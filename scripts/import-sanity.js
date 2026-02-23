/* eslint-disable no-console */

const fs = require('node:fs/promises');
const path = require('node:path');
const matter = require('gray-matter');
const crypto = require('node:crypto');

async function loadDotEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  let raw = '';
  try {
    raw = await fs.readFile(envPath, 'utf8');
  } catch {
    return;
  }

  raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !l.startsWith('#'))
    .forEach((line) => {
      const idx = line.indexOf('=');
      if (idx <= 0) return;
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    });
}

async function withRetry(fn, label, { retries = 5, baseDelayMs = 500 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const waitMs = baseDelayMs * Math.pow(2, attempt);
      if (attempt >= retries) break;
      console.warn(`Retrying (${attempt + 1}/${retries}) after error in ${label}: ${err?.message ?? String(err)}`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
  throw lastErr;
}

async function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID');
  if (!dataset) throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET');
  if (!apiVersion) throw new Error('Missing NEXT_PUBLIC_SANITY_API_VERSION');
  if (!token) throw new Error('Missing SANITY_API_WRITE_TOKEN');

  const mod = await import('@sanity/client');
  const createClient = mod.createClient;

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false
  });
}

async function importSiteSettings(client) {
  const siteJsonPath = path.join(process.cwd(), 'content', 'settings', 'site.json');
  const raw = await fs.readFile(siteJsonPath, 'utf8');
  const data = JSON.parse(raw);

  const services = Array.isArray(data.services)
    ? data.services.map((s) => ({
        ...s,
        _key:
          typeof s?._key === 'string' && s._key.trim().length > 0
            ? s._key
            : crypto.randomUUID()
      }))
    : data.services;

  const leadership = Array.isArray(data.leadership)
    ? data.leadership.map((l) => ({
        ...l,
        _key:
          typeof l?._key === 'string' && l._key.trim().length > 0
            ? l._key
            : crypto.randomUUID()
      }))
    : data.leadership;

  const doc = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    ...data,
    services,
    leadership
  };

  await withRetry(() => client.createOrReplace(doc), 'siteSettings.createOrReplace');
  console.log('Imported siteSettings');
}

async function importProjects(client) {
  const projectsDir = path.join(process.cwd(), 'content', 'projects');
  const entries = await fs.readdir(projectsDir);
  const mdFiles = entries.filter((f) => f.toLowerCase().endsWith('.md'));

  for (const file of mdFiles) {
    const slug = file.replace(/\.md$/i, '');
    const fullPath = path.join(projectsDir, file);
    const raw = await fs.readFile(fullPath, 'utf8');
    const parsed = matter(raw);

    const doc = {
      _id: `project.${slug}`,
      _type: 'project',
      title: String(parsed.data.title ?? slug),
      slug: { _type: 'slug', current: slug },
      draft: Boolean(parsed.data.draft ?? false),
      location: parsed.data.location ? String(parsed.data.location) : undefined,
      year: parsed.data.year ? String(parsed.data.year) : undefined,
      status: parsed.data.status ? String(parsed.data.status) : undefined,
      summary: parsed.data.summary ? String(parsed.data.summary) : undefined,
      image: parsed.data.image ? String(parsed.data.image) : undefined,
      video: parsed.data.video ? String(parsed.data.video) : undefined,
      video2: parsed.data.video2 ? String(parsed.data.video2) : undefined,
      video2Poster: parsed.data.video2Poster ? String(parsed.data.video2Poster) : undefined,
      content: parsed.content
    };

    Object.keys(doc).forEach((k) => {
      if (doc[k] === undefined) delete doc[k];
    });

    await withRetry(() => client.createOrReplace(doc), `project.createOrReplace:${doc._id}`);
    console.log(`Imported project: ${doc.slug?.current}`);
  }
}

async function importServices(client) {
  const siteJsonPath = path.join(process.cwd(), 'content', 'settings', 'site.json');
  const raw = await fs.readFile(siteJsonPath, 'utf8');
  const data = JSON.parse(raw);
  const services = Array.isArray(data.services) ? data.services : [];

  for (let idx = 0; idx < services.length; idx += 1) {
    const s = services[idx];
    const slug = String(s.slug ?? '').trim();
    if (!slug) continue;

    const doc = {
      _id: `service.${slug}`,
      _type: 'service',
      title: String(s.title ?? slug),
      slug: { _type: 'slug', current: slug },
      summary: s.summary ? String(s.summary) : undefined,
      bullets: Array.isArray(s.bullets) ? s.bullets.map(String) : [],
      imageUrl: s.image ? String(s.image) : undefined,
      videoUrl: s.video ? String(s.video) : undefined,
      order: idx
    };

    Object.keys(doc).forEach((k) => {
      if (doc[k] === undefined) delete doc[k];
    });

    await withRetry(() => client.createOrReplace(doc), `service.createOrReplace:${doc._id}`);
    console.log(`Imported service: ${doc.slug?.current}`);
  }
}

function pageIdFromRoute(route) {
  if (route === '/') return 'page.home';
  return `page.${route.replace(/^\//, '').replace(/\//g, '-').replace(/[^a-z0-9-]/gi, '-')}`;
}

function makeHero({ title, subtitle, imageUrl, videoUrl }) {
  return {
    _key: crypto.randomUUID(),
    _type: 'heroSection',
    title,
    subtitle,
    imageUrl,
    videoUrl
  };
}

function makeContactSection(data) {
  const phones = String(data?.contact?.phone ?? '')
    .split('/')
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    _key: crypto.randomUUID(),
    _type: 'contactSection',
    officeTitle: 'Head Office',
    headOffice: data?.contact?.headOffice ?? 'Accra, Ghana',
    phoneTitle: 'Phone',
    phoneNumbers: phones,
    emailTitle: 'Email',
    email: data?.contact?.email ?? '',
    enquiryKicker: 'Enquiry',
    enquiryBody: 'Send a message and we’ll respond as soon as possible.',
    locationKicker: 'Location',
    locationHeading: 'Find our head office.',
    addressLines: data?.contact?.addressLines ?? [data?.contact?.headOffice ?? 'Accra, Ghana'],
    mapQuery: data?.contact?.mapQuery ?? data?.contact?.headOffice ?? 'Accra, Ghana',
    mapLinkLabel: 'Open in Google Maps'
  };
}

function makeProjectsIntroSection() {
  return {
    _key: crypto.randomUUID(),
    _type: 'projectsIntroSection',
    kicker: 'Projects',
    body: 'Explore current work and selected engagements delivered with disciplined planning, quality controls, and safety leadership.'
  };
}

function makeHomeHeroSection({ tagline, heading, videoUrl, posterUrl, showFeaturedCarousel }) {
  return {
    _key: crypto.randomUUID(),
    _type: 'homeHeroSection',
    tagline,
    heading,
    videoUrl,
    posterUrl,
    showFeaturedCarousel
  };
}

function makeHomeWorkSection({ kicker, heading, paragraph1, paragraph2, primaryCtaLabel, primaryCtaHref, secondaryCtaLabel, secondaryCtaHref, videoUrl }) {
  return {
    _key: crypto.randomUUID(),
    _type: 'homeWorkSection',
    kicker,
    heading,
    paragraph1,
    paragraph2,
    primaryCtaLabel,
    primaryCtaHref,
    secondaryCtaLabel,
    secondaryCtaHref,
    videoUrl
  };
}

function makeHomePeopleSection({ kicker, heading, paragraph, ctaLabel, ctaHref, videoUrl }) {
  return {
    _key: crypto.randomUUID(),
    _type: 'homePeopleSection',
    kicker,
    heading,
    paragraph,
    ctaLabel,
    ctaHref,
    videoUrl
  };
}

function makeHomeApproachSection({ kicker, heading, paragraph, videoUrl }) {
  return {
    _key: crypto.randomUUID(),
    _type: 'homeApproachSection',
    kicker,
    heading,
    paragraph,
    videoUrl
  };
}

function makeHomeStatementSection({ heading, paragraph }) {
  return {
    _key: crypto.randomUUID(),
    _type: 'homeStatementSection',
    heading,
    paragraph
  };
}

function makeHomeFeaturedProjectsSection({ heading, ctaLabel, ctaHref }) {
  return {
    _key: crypto.randomUUID(),
    _type: 'homeFeaturedProjectsSection',
    heading,
    ctaLabel,
    ctaHref
  };
}

function makeHomeVisionMissionSection({ heading, vision, commitmentTitle, missionBullets }) {
  return {
    _key: crypto.randomUUID(),
    _type: 'homeVisionMissionSection',
    heading,
    vision,
    commitmentTitle,
    missionBullets
  };
}

function makeHomeServicesTeaserSection({ heading, paragraph, ctaLabel, ctaHref, services }) {
  return {
    _key: crypto.randomUUID(),
    _type: 'homeServicesTeaserSection',
    heading,
    paragraph,
    ctaLabel,
    ctaHref,
    services: Array.isArray(services)
      ? services.map((s) => ({
          _key: crypto.randomUUID(),
          title: s.title,
          body: s.body
        }))
      : []
  };
}

function makeMarkdown({ title, markdown }) {
  return {
    _key: crypto.randomUUID(),
    _type: 'markdownSection',
    title,
    markdown
  };
}

function makeRichTextSection({ title, paragraphs }) {
  const blocks = Array.isArray(paragraphs)
    ? paragraphs
        .filter(Boolean)
        .map((text) => ({
          _type: 'block',
          style: 'normal',
          _key: crypto.randomUUID(),
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: crypto.randomUUID(),
              text: String(text),
              marks: []
            }
          ]
        }))
    : [];

  return {
    _key: crypto.randomUUID(),
    _type: 'richTextSection',
    title,
    body: blocks
  };
}

function makeMediaSection({ title, markdown, imageUrl, videoUrl }) {
  return {
    _key: crypto.randomUUID(),
    _type: 'mediaSection',
    title,
    markdown,
    imageUrl,
    videoUrl
  };
}

function makeServicesSection({ kicker, heading, paragraph1, paragraph2, highlights, safetyHeading, safetyBody }) {
  return {
    _key: crypto.randomUUID(),
    _type: 'servicesSection',
    kicker,
    heading,
    paragraph1,
    paragraph2,
    highlights: Array.isArray(highlights)
      ? highlights.map((h) => ({
          _key: crypto.randomUUID(),
          title: h.title,
          body: h.body
        }))
      : [],
    safetyHeading,
    safetyBody
  };
}

function makeAboutSection(data) {
  return {
    _key: crypto.randomUUID(),
    _type: 'aboutSection',
    overviewKicker: 'Company Overview',
    overviewHeading: data?.name ?? 'Rikonim Enterprise',
    overviewBody1: data?.overview ?? '',
    overviewBody2:
      'We partner with public and private sector clients to deliver buildings and civil works that are safe, durable, and cost-effective—supported by disciplined project controls and transparent coordination.',
    overviewStats: [
      { _key: crypto.randomUUID(), label: 'Industry', value: data?.industry ?? '' },
      { _key: crypto.randomUUID(), label: 'Business Type', value: data?.businessType ?? '' },
      { _key: crypto.randomUUID(), label: 'Headquarters', value: data?.headquarters ?? '' },
      { _key: crypto.randomUUID(), label: 'Founded', value: data?.founded ?? '' }
    ],
    capabilitiesKicker: 'Capabilities',
    capabilitiesHeading: 'What we deliver.',
    companyKicker: 'Company',
    companyHeading: 'Work that shows up on site.',
    companyBody:
      'From planning through closeout, we emphasize visible discipline on site—coordination, workmanship, and safety leadership.',
    companyImage1Url: '/uploads/company-1.jpeg',
    companyImage2Url: '/uploads/company-3.jpeg',
    galleryKicker: 'On Site',
    galleryHeading: 'Work that shows up on site.',
    galleryBody:
      'From planning through closeout, we emphasize visible discipline on site—coordination, workmanship, and safety leadership.',
    galleryCtaLabel: 'View projects',
    galleryCtaHref: '/projects',
    galleryVideoUrl: '/videos/company-gallery.mp4',
    visionTitle: 'Vision',
    visionBody: data?.vision ?? '',
    missionTitle: 'Mission',
    missionBullets: data?.missionBullets ?? [],
    deliveryHeading: 'How we deliver.',
    deliveryCards: [
      {
        _key: crypto.randomUUID(),
        title: 'Plan & mobilize',
        body: 'We define scope, schedule, and risk controls early—then mobilize the right people, materials, and partners to execute with confidence.'
      },
      {
        _key: crypto.randomUUID(),
        title: 'Build with discipline',
        body: 'Site coordination, safety leadership, and quality checks are embedded into daily execution, backed by clear reporting and change control.'
      },
      {
        _key: crypto.randomUUID(),
        title: 'Handover with confidence',
        body: 'We complete documentation, QA/QC closeout, and stakeholder sign-off so assets perform reliably after commissioning.'
      }
    ]
  };
}

function makeLeadershipSection({ kicker, heading, introParagraph1, introParagraph2, members, pillarsTitle, pillars }) {
  return {
    _key: crypto.randomUUID(),
    _type: 'leadershipSection',
    kicker,
    heading,
    introParagraph1,
    introParagraph2,
    members: Array.isArray(members)
      ? members.map((m) => ({
          _key: crypto.randomUUID(),
          role: m.role,
          name: m.name,
          bio: m.bio,
          highlights: m.highlights,
          imageUrl: m.image
        }))
      : [],
    pillarsTitle,
    pillars: Array.isArray(pillars)
      ? pillars.map((p) => ({
          _key: crypto.randomUUID(),
          title: p.title,
          body: p.body
        }))
      : []
  };
}

async function importPages(client) {
  const siteJsonPath = path.join(process.cwd(), 'content', 'settings', 'site.json');
  const raw = await fs.readFile(siteJsonPath, 'utf8');
  const data = JSON.parse(raw);

  function seoForRoute(route) {
    switch (route) {
      case '/':
        return {
          metaTitle: `${data?.name ?? 'Rikonim Enterprise'}`,
          metaDescription:
            'Rikonim Enterprise is a building and civil engineering contractor in Ghana delivering construction, roads, drainage, renovations and disciplined project management.'
        };
      case '/about':
        return {
          metaTitle: 'Company',
          metaDescription:
            'Company profile of Rikonim Enterprise—an Accra, Ghana building and civil engineering contractor delivering quality construction, infrastructure and renovations.'
        };
      case '/services':
        return {
          metaTitle: 'Services',
          metaDescription:
            'Construction and civil engineering services in Ghana—building construction, civil works, project management and renovations delivered with quality and safety discipline.'
        };
      case '/leadership':
        return {
          metaTitle: 'Leadership',
          metaDescription:
            'Leadership at Rikonim Enterprise—experienced professionals driving disciplined construction and civil engineering delivery across Ghana.'
        };
      case '/contact':
        return {
          metaTitle: 'Contact',
          metaDescription:
            'Contact Rikonim Enterprise for construction and civil engineering enquiries in Ghana. Request a consultation for buildings, roads, drainage or renovations.'
        };
      case '/projects':
        return {
          metaTitle: 'Projects',
          metaDescription:
            'Explore building and civil engineering projects delivered in Ghana—construction, roads and drainage works completed with disciplined planning and safety.'
        };
      case '/privacy-policy':
        return {
          metaTitle: 'Privacy Policy',
          metaDescription: 'Privacy Policy for Rikonim Enterprise.'
        };
      case '/terms-of-use':
        return {
          metaTitle: 'Terms of Use',
          metaDescription: 'Terms of Use for Rikonim Enterprise.'
        };
      case '/history':
        return {
          metaTitle: 'History',
          metaDescription:
            'Our story since 2013. Learn how Rikonim Enterprise has grown as a building and civil engineering contractor delivering construction in Ghana.'
        };
      case '/media':
        return {
          metaTitle: 'Media',
          metaDescription:
            'Media and updates from Rikonim Enterprise—news, photos and construction progress highlights from building and civil engineering projects in Ghana.'
        };
      case '/careers':
        return {
          metaTitle: 'Careers',
          metaDescription:
            'Careers at Rikonim Enterprise in Ghana. Join a construction and civil engineering team focused on safety, quality workmanship and reliable project delivery.'
        };
      case '/suppliers':
        return {
          metaTitle: 'Suppliers',
          metaDescription:
            'Supplier information for Rikonim Enterprise. Partner with our construction and civil engineering teams in Ghana on materials, equipment and services.'
        };
      case '/impact-reports':
        return {
          metaTitle: 'Impact Reports',
          metaDescription:
            'Impact reports from Rikonim Enterprise—safety performance, sustainability and community outcomes across construction and civil engineering work in Ghana.'
        };
      case '/blog':
        return {
          metaTitle: 'Blog',
          metaDescription:
            'Construction insights from Rikonim Enterprise—engineering methods, quality control, scheduling and safety culture for projects in Ghana.'
        };
      default:
        return {
          metaTitle: String(route || 'Page'),
          metaDescription: `${data?.name ?? 'Rikonim Enterprise'} page.`
        };
    }
  }

  const pages = [
    {
      route: '/',
      title: 'Home',
      sections: [
        makeHomeHeroSection({
          tagline: data?.tagline,
          heading: 'Building enduring infrastructure with discipline, integrity, and exceptional execution.',
          videoUrl: data?.heroVideos?.home,
          posterUrl: '/videos/rikonim-home-hero.jpg',
          showFeaturedCarousel: true
        }),
        makeHomeWorkSection({
          kicker: 'Our Work',
          heading: 'Extraordinary teams building inspiring projects.',
          paragraph1:
            'We deliver first-of-a-kind infrastructure and building works that improve quality of life, support economic growth, and strengthen critical systems.',
          paragraph2:
            'Our approach blends planning discipline, engineering judgement, and site execution—supported by transparent coordination and safety leadership.',
          primaryCtaLabel: 'View projects',
          primaryCtaHref: '/projects',
          secondaryCtaLabel: 'Explore Services',
          secondaryCtaHref: '/services',
          videoUrl: '/videos/home-services-section.mp4'
        }),
        makeHomePeopleSection({
          kicker: 'Our People',
          heading: 'Defined by the quality of our people.',
          paragraph:
            'We bring technical excellence, careful planning, and hands-on site leadership to every engagement. Our teams work with clients to solve complex challenges and deliver reliable outcomes.',
          ctaLabel: 'Meet leadership',
          ctaHref: '/leadership',
          videoUrl: '/videos/home-company-section.mp4'
        }),
        makeHomeApproachSection({
          kicker: 'Our Approach',
          heading: 'Plan precisely. Build safely. Deliver with integrity.',
          paragraph:
            'From procurement and scheduling through QA/QC and commissioning, we keep stakeholders aligned and risks controlled—without compromising workmanship.',
          videoUrl: '/videos/home-approach-section.mp4'
        }),
        makeHomeStatementSection({
          heading: 'Building tomorrow, together.',
          paragraph:
            'With people, partners, and communities at the center of delivery, we focus on durability, safety, and transparency across every project lifecycle.'
        }),
        makeHomeFeaturedProjectsSection({
          heading: 'Featured Projects',
          ctaLabel: 'Explore more projects',
          ctaHref: '/projects'
        }),
        makeHomeVisionMissionSection({
          heading: 'Vision & Mission',
          vision: data?.vision,
          commitmentTitle: 'What we commit to',
          missionBullets: data?.missionBullets ?? []
        }),
        makeHomeServicesTeaserSection({
          heading: 'Premium delivery, end to end.',
          paragraph:
            'From planning through execution, we bring rigorous project control, site discipline, and quality assurance to every engagement.',
          ctaLabel: 'View projects',
          ctaHref: '/projects',
          services: (data?.services ?? []).map((s) => ({
            title: s.title,
            body: 'Precision planning, transparent coordination, and workmanship built for longevity.'
          }))
        })
      ]
    },
    {
      route: '/projects',
      title: 'Projects',
      sections: [
        makeHero({
          title: 'Projects',
          subtitle: 'Current work and selected engagements.',
          imageUrl: 'https://images.pexels.com/photos/8961141/pexels-photo-8961141.jpeg?auto=compress&cs=tinysrgb&w=2400',
          videoUrl: data?.heroVideos?.projects
        }),
        makeProjectsIntroSection()
      ]
    },
    {
      route: '/about',
      title: 'Company',
      sections: [
        makeHero({
          title: 'Company',
          subtitle: 'Company profile, vision, and mission.',
          imageUrl: 'https://images.pexels.com/photos/534220/pexels-photo-534220.jpeg?auto=compress&cs=tinysrgb&w=2400',
          videoUrl: data?.heroVideos?.company
        }),
        makeAboutSection(data)
      ]
    },
    {
      route: '/services',
      title: 'Services',
      sections: [
        makeHero({
          title: 'Services',
          subtitle: 'Engineering services built for long-term value.',
          imageUrl: '/uploads/services-1.jpeg',
          videoUrl: data?.heroVideos?.services
        }),
        makeServicesSection({
          kicker: 'Services',
          heading: 'Built for speed, performance, and long-term value.',
          paragraph1:
            'We provide an integrated set of services for public and private sector clients—delivered with strict quality control, safety discipline, and transparent project management.',
          paragraph2:
            'From concept planning to closeout, we help clients manage complexity, reduce risk, and deliver durable assets that perform over the long term.',
          highlights: [
            {
              title: 'Safety-led delivery',
              body: 'Daily planning, workfront controls, and supervision that protects people and assets.'
            },
            {
              title: 'Quality controls',
              body: 'Clear hold points, inspections, and documentation to verify workmanship and materials.'
            },
            {
              title: 'Project management',
              body: 'Transparent reporting, coordinated procurement, and schedule discipline from start to closeout.'
            }
          ],
          safetyHeading: 'Safety & environmental responsibility.',
          safetyBody:
            'We maintain high standards of safety and environmental responsibility, aligned with the mission of delivering durable, cost-effective, and high-quality outcomes.'
        })
      ]
    },
    {
      route: '/leadership',
      title: 'Leadership',
      sections: [
        makeHero({
          title: 'Leadership',
          subtitle: 'Responsible governance. Clear accountability.',
          imageUrl: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=2400',
          videoUrl: data?.heroVideos?.leadership
        }),
        makeLeadershipSection({
          kicker: 'Leadership',
          heading: 'Built on accountability.',
          introParagraph1:
            'Rikonim Enterprise is led by experienced professionals focused on disciplined execution, client outcomes, and long-term partnerships.',
          introParagraph2:
            'Our leadership team sets clear standards for safety, quality, and project controls—ensuring that stakeholders receive consistent reporting, reliable schedules, and durable results.',
          members: data?.leadership ?? [],
          pillarsTitle: 'How we lead.',
          pillars: [
            {
              title: 'Safety first',
              body: 'We set expectations for site discipline, risk controls, and a culture where every worker goes home safely.'
            },
            {
              title: 'Quality and compliance',
              body: 'We standardize QA/QC checks, documentation, and handover requirements to protect long-term asset performance.'
            },
            {
              title: 'Transparent reporting',
              body: 'Stakeholders receive clear progress updates, change control visibility, and schedule performance tracking.'
            },
            {
              title: 'Client partnership',
              body: 'We collaborate early, align expectations, and make decisions that protect scope, cost, and delivery outcomes.'
            }
          ]
        })
      ]
    },
    {
      route: '/contact',
      title: 'Contact',
      sections: [
        makeHero({
          title: 'Contact',
          subtitle: 'Reach out for project enquiries, partnerships, or a consultation.',
          imageUrl: '/uploads/company-2.jpeg',
          videoUrl: data?.heroVideos?.contact
        }),
        makeContactSection(data)
      ]
    },
    {
      route: '/privacy-policy',
      title: 'Privacy Policy',
      sections: [
        makeHero({
          title: 'Privacy Policy',
          subtitle: 'Legal',
          imageUrl: 'https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=2400',
          videoUrl: data?.heroVideos?.legal
        }),
        makeRichTextSection({
          title: undefined,
          paragraphs: [
            `This website is operated by ${data?.name ?? 'Rikonim Enterprise'}. We respect your privacy and are committed to protecting the information you share with us.`,
            'We may collect basic analytics and information you submit through our contact channels (such as email or phone). We do not sell personal information.',
            `If you have any questions about this policy, contact us at ${data?.contact?.email ?? ''}.`
          ]
        })
      ]
    },
    {
      route: '/terms-of-use',
      title: 'Terms of Use',
      sections: [
        makeHero({
          title: 'Terms of Use',
          subtitle: 'Legal',
          imageUrl: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=2400',
          videoUrl: data?.heroVideos?.legal
        }),
        makeRichTextSection({
          title: undefined,
          paragraphs: [
            'By accessing and using this website, you agree to these Terms of Use. If you do not agree, please do not use the site.',
            'Information on this site is provided for general informational purposes and may be updated without notice.',
            `For enquiries, contact ${data?.name ?? 'Rikonim Enterprise'} at ${data?.contact?.email ?? ''}.`
          ]
        })
      ]
    },
    {
      route: '/history',
      title: 'History',
      sections: [
        makeHero({
          title: 'History',
          subtitle: data?.founded ? `Our story since ${data.founded}.` : 'Our story.',
          imageUrl: 'https://images.pexels.com/photos/8961142/pexels-photo-8961142.jpeg?auto=compress&cs=tinysrgb&w=2400',
          videoUrl: data?.heroVideos?.company
        }),
        makeRichTextSection({
          title: undefined,
          paragraphs: [
            `${data?.name ?? 'Rikonim Enterprise'} was founded in ${data?.founded ?? ''} to deliver high-quality building and civil engineering services with strict site discipline and transparent project management.`,
            'This page is a placeholder you can expand with major milestones, signature projects, and growth across Ghana and West Africa.'
          ]
        })
      ]
    },
    {
      route: '/media',
      title: 'Media',
      sections: [
        makeHero({
          title: 'Media',
          subtitle: 'News, photos, and project updates.',
          imageUrl: 'https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=2400',
          videoUrl: data?.heroVideos?.projects
        }),
        makeRichTextSection({
          title: undefined,
          paragraphs: [
            'Use this page to publish press releases, construction progress highlights, and media assets.',
            'Updates will be published here as new announcements and project highlights become available.'
          ]
        })
      ]
    },
    {
      route: '/careers',
      title: 'Careers',
      sections: [
        makeHero({
          title: 'Careers',
          subtitle: 'Build with us. Explore opportunities and grow your impact.',
          imageUrl: 'https://images.pexels.com/photos/8961143/pexels-photo-8961143.jpeg?auto=compress&cs=tinysrgb&w=2400',
          videoUrl: data?.heroVideos?.company
        }),
        makeRichTextSection({
          title: `Why join ${data?.name ?? 'us'}`,
          paragraphs: [
            "We’re building a team of disciplined professionals committed to safe execution, quality workmanship, and long-term client outcomes.",
            `To enquire about openings, email ${data?.contact?.email ?? ''}.`,
            `For urgent matters, call ${data?.contact?.phone ?? ''}.`
          ]
        })
      ]
    },
    {
      route: '/suppliers',
      title: 'Suppliers',
      sections: [
        makeHero({
          title: 'Suppliers',
          subtitle: 'Partner with us on materials, equipment, and services.',
          imageUrl: 'https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=2400',
          videoUrl: data?.heroVideos?.services
        }),
        makeRichTextSection({
          title: 'Supplier enquiries',
          paragraphs: [
            `To submit capability information or register as a supplier, email ${data?.contact?.email ?? ''}.`,
            'You can expand this page with documents, compliance requirements, and a secure supplier onboarding form.'
          ]
        })
      ]
    },
    {
      route: '/impact-reports',
      title: 'Impact Reports',
      sections: [
        makeHero({
          title: 'Impact Reports',
          subtitle: 'Safety, sustainability, and community impact.',
          imageUrl: 'https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=2400',
          videoUrl: data?.heroVideos?.services
        }),
        makeRichTextSection({
          title: undefined,
          paragraphs: [
            'This page is ready for published reports on safety performance, environmental responsibility, and local community outcomes.',
            'If you provide report files (PDFs), I can add a download list with year filters.'
          ]
        })
      ]
    },
    {
      route: '/blog',
      title: 'Blog',
      sections: [
        makeHero({
          title: 'Blog',
          subtitle: 'Insights from the field, project delivery, and safety culture.',
          imageUrl: 'https://images.pexels.com/photos/2101138/pexels-photo-2101138.jpeg?auto=compress&cs=tinysrgb&w=2400',
          videoUrl: data?.heroVideos?.projects
        }),
        makeRichTextSection({
          title: undefined,
          paragraphs: [
            'This is a placeholder blog page. You can publish articles about engineering methods, quality control, scheduling, and community impact.',
            'Tell me if you want the blog to be dynamic (CMS-driven) or static (markdown files).'
          ]
        })
      ]
    }
  ];

  for (const page of pages) {
    const id = pageIdFromRoute(page.route);
    await withRetry(
      () => client.delete(`drafts.${id}`).catch(() => undefined),
      `page.deleteDraft:${page.route}`
    );
    const doc = {
      _id: id,
      _type: 'page',
      enabled: true,
      route: page.route,
      title: page.title,
      seo: seoForRoute(page.route),
      sections: page.sections
    };

    await withRetry(() => client.createOrReplace(doc), `page.createOrReplace:${page.route}`);
    console.log(`Imported page: ${page.route}`);
  }
}

(async function main() {
  await loadDotEnvLocal();
  const client = await getSanityWriteClient();
  await importSiteSettings(client);
  await importServices(client);
  await importProjects(client);
  await importPages(client);
  console.log('Done');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
