import siteJson from '../../content/settings/site.json';

const defaultSite = {
  name: 'Rikonim Enterprise',
  tagline: 'Building & Civil Engineering Company',
  industry: 'Construction & Civil Engineering',
  businessType: 'Private Company',
  headquarters: 'Accra, Ghana',
  founded: '2013',
  heroVideos: {
    home: '/videos/rikonim-home-hero.mp4',
    company: '/videos/rikonim-company-hero.mp4',
    services: '/videos/rikonim-services-hero.mp4',
    projects: '/videos/rikonim-projects-hero.mp4',
    contact: '/videos/rikonim-contact-hero.mp4',
    leadership: '/videos/rikonim-leadership-hero.mp4',
    legal: '/videos/rikonim-legal-hero.mp4'
  },
  overview:
    'Rikonim Enterprise is a well-established building and civil engineering company headquartered in Accra, Ghana. Founded in 2013, the company delivers high-quality construction, infrastructure, and engineering solutions to both public and private sector clients.',
  vision:
    'To become a leading construction and civil engineering company in Ghana and West Africa, known for excellence, innovation, and sustainable development.',
  missionBullets: [
    'To deliver durable, cost-effective, and high-quality construction projects',
    'To meet and exceed client expectations through professionalism and integrity',
    'To maintain the highest standards of safety and environmental responsibility',
    'To build long-term partnerships with clients and stakeholders'
  ],
  services: [
    {
      slug: 'building-construction',
      title: 'Building Construction',
      summary: 'End-to-end delivery for residential, commercial, and institutional buildings.',
      bullets: [
        'Structural works and finishing',
        'Quality control and compliance',
        'Schedule and cost discipline',
        'Site safety management'
      ],
      image: '/uploads/services-1.jpeg',
      video: '/videos/service-building.mp4'
    },
    {
      slug: 'civil-engineering-works',
      title: 'Civil Engineering Works',
      summary: 'Infrastructure and heavy civil works executed with durability and long-term performance in mind.',
      bullets: [
        'Roads, drainage, and earthworks',
        'Concrete works and structures',
        'Utilities coordination',
        'Testing and documentation'
      ],
      image: '/uploads/services-2.jpeg',
      video: '/videos/service-civil.mp4'
    },
    {
      slug: 'project-management',
      title: 'Project Management',
      summary: 'Clear planning, controls, and reporting to keep stakeholders aligned from start to closeout.',
      bullets: [
        'Work breakdown and scheduling',
        'Procurement and subcontract coordination',
        'Progress reporting and change control',
        'Handover documentation'
      ],
      image: '/uploads/services-3.jpeg',
      video: '/videos/service-management.mp4'
    },
    {
      slug: 'renovation-refurbishment',
      title: 'Renovation & Refurbishment',
      summary: 'Upgrades, reconfiguration, and lifecycle improvements with minimal disruption to operations.',
      bullets: [
        'Condition surveys and scope definition',
        'Phased execution planning',
        'Finishes, MEP upgrades, and repairs',
        'Quality inspections and snagging'
      ],
      image: '/uploads/services-2.jpeg',
      video: '/videos/service-renovation.mp4'
    }
  ],
  leadership: [
    {
      role: 'Chief Executive Officer (CEO)',
      name: 'Mr. Kofi Nimo Donkor',
      bio: 'Mr. Kofi Nimo Donkor provides overall strategic direction for Rikonim Enterprise, with a focus on disciplined delivery, client trust, and sustainable growth. He leads executive oversight across operations, finance, and stakeholder engagement to ensure every project meets quality and safety expectations.',
      highlights: [
        'Strategic leadership and governance',
        'Client and stakeholder relationship management',
        'Quality and safety accountability',
        'Long-term business development'
      ],
      image:
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1200'
    },
    {
      role: 'Project Director',
      name: 'Mrs Gifty Nimo Donkor',
      bio: 'Mrs Gifty Nimo Donkor leads project execution across planning, coordination, and site delivery. She works closely with clients and partners to manage scope, schedule, and cost controls while maintaining high standards in workmanship and documentation.',
      highlights: [
        'Project planning and controls',
        'Site coordination and subcontract oversight',
        'Schedule, cost, and risk management',
        'Progress reporting and closeout'
      ],
      image:
        'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1200'
    }
  ],
  contact: {
    phone: '+233245731123',
    email: 'info@rikonim.com',
    headOffice: 'Accra, Ghana',
    addressLines: ['Accra, Ghana'],
    mapQuery: 'Accra, Ghana'
  }
};

const partial = (siteJson ?? {}) as Partial<typeof defaultSite>;

export const site = {
  ...defaultSite,
  ...partial,
  heroVideos: {
    ...defaultSite.heroVideos,
    ...(partial.heroVideos ?? {})
  },
  contact: {
    ...defaultSite.contact,
    ...(partial.contact ?? {})
  },
  missionBullets: Array.isArray(partial.missionBullets)
    ? partial.missionBullets
    : defaultSite.missionBullets,
  services: Array.isArray(partial.services) ? partial.services : defaultSite.services,
  leadership: Array.isArray(partial.leadership) ? partial.leadership : defaultSite.leadership
} as typeof defaultSite;
