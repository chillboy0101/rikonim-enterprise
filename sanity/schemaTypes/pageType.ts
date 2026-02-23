import { defineField, defineType } from 'sanity';

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enabled on Website',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'route',
      title: 'Route',
      type: 'string',
      description: 'Path on the website. Example: /privacy-policy or /'
    }),
    defineField({ name: 'title', type: 'string' }),
    defineField({
      name: 'seo',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', type: 'string' }),
        defineField({ name: 'metaDescription', type: 'text' })
      ]
    }),
    defineField({
      name: 'sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'heroSection',
          title: 'Hero (Top of page)',
          fields: [
            defineField({ name: 'title', title: 'Hero Title', type: 'string' }),
            defineField({ name: 'subtitle', title: 'Hero Subtitle', type: 'string' }),
            defineField({ name: 'imageUrl', title: 'Hero Image URL (fallback)', type: 'string' }),
            defineField({ name: 'videoUrl', title: 'Hero Video URL (fallback)', type: 'string' }),
            defineField({ name: 'image', title: 'Hero Image Upload', type: 'image' }),
            defineField({ name: 'video', title: 'Hero Video Upload', type: 'file' })
          ]
        },
        {
          type: 'object',
          name: 'markdownSection',
          title: 'Body: Markdown (Legacy)',
          fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'markdown', type: 'text' })
          ]
        },
        {
          type: 'object',
          name: 'richTextSection',
          title: 'Body: Rich Text',
          fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({
              name: 'body',
              type: 'array',
              of: [
                {
                  type: 'block',
                  marks: {
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        fields: [
                          defineField({ name: 'href', type: 'url' })
                        ]
                      }
                    ]
                  }
                },
                { type: 'image' }
              ]
            })
          ]
        },
        {
          type: 'object',
          name: 'leadershipSection',
          title: 'Leadership Section',
          fields: [
            defineField({ name: 'kicker', type: 'string' }),
            defineField({ name: 'heading', type: 'string' }),
            defineField({ name: 'introParagraph1', type: 'text' }),
            defineField({ name: 'introParagraph2', type: 'text' }),
            defineField({
              name: 'members',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'leadershipMember',
                  fields: [
                    defineField({ name: 'role', type: 'string' }),
                    defineField({ name: 'name', type: 'string' }),
                    defineField({ name: 'bio', type: 'text' }),
                    defineField({ name: 'highlights', type: 'array', of: [{ type: 'string' }] }),
                    defineField({ name: 'image', type: 'image' }),
                    defineField({ name: 'imageUrl', type: 'string' })
                  ]
                }
              ]
            }),
            defineField({ name: 'pillarsTitle', type: 'string' }),
            defineField({
              name: 'pillars',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'leadershipPillar',
                  fields: [
                    defineField({ name: 'title', type: 'string' }),
                    defineField({ name: 'body', type: 'text' })
                  ]
                }
              ]
            })
          ]
        },
        {
          type: 'object',
          name: 'homeHeroSection',
          title: 'Home: Hero',
          fields: [
            defineField({ name: 'tagline', type: 'string' }),
            defineField({ name: 'heading', type: 'string' }),
            defineField({ name: 'videoUrl', type: 'string' }),
            defineField({ name: 'posterUrl', type: 'string' }),
            defineField({ name: 'showFeaturedCarousel', type: 'boolean', initialValue: true })
          ]
        },
        {
          type: 'object',
          name: 'homeWorkSection',
          title: 'Home: Our Work',
          fields: [
            defineField({ name: 'kicker', type: 'string' }),
            defineField({ name: 'heading', type: 'string' }),
            defineField({ name: 'paragraph1', type: 'text' }),
            defineField({ name: 'paragraph2', type: 'text' }),
            defineField({ name: 'primaryCtaLabel', type: 'string' }),
            defineField({ name: 'primaryCtaHref', type: 'string' }),
            defineField({ name: 'secondaryCtaLabel', type: 'string' }),
            defineField({ name: 'secondaryCtaHref', type: 'string' }),
            defineField({ name: 'videoUrl', type: 'string' })
          ]
        },
        {
          type: 'object',
          name: 'homePeopleSection',
          title: 'Home: Our People',
          fields: [
            defineField({ name: 'kicker', type: 'string' }),
            defineField({ name: 'heading', type: 'string' }),
            defineField({ name: 'paragraph', type: 'text' }),
            defineField({ name: 'ctaLabel', type: 'string' }),
            defineField({ name: 'ctaHref', type: 'string' }),
            defineField({ name: 'videoUrl', type: 'string' })
          ]
        },
        {
          type: 'object',
          name: 'homeApproachSection',
          title: 'Home: Our Approach',
          fields: [
            defineField({ name: 'kicker', type: 'string' }),
            defineField({ name: 'heading', type: 'string' }),
            defineField({ name: 'paragraph', type: 'text' }),
            defineField({ name: 'videoUrl', type: 'string' })
          ]
        },
        {
          type: 'object',
          name: 'homeStatementSection',
          title: 'Home: Statement',
          fields: [
            defineField({ name: 'heading', type: 'string' }),
            defineField({ name: 'paragraph', type: 'text' })
          ]
        },
        {
          type: 'object',
          name: 'homeFeaturedProjectsSection',
          title: 'Home: Featured Projects',
          fields: [
            defineField({ name: 'heading', type: 'string' }),
            defineField({ name: 'ctaLabel', type: 'string' }),
            defineField({ name: 'ctaHref', type: 'string' })
          ]
        },
        {
          type: 'object',
          name: 'homeVisionMissionSection',
          title: 'Home: Vision & Mission',
          fields: [
            defineField({ name: 'heading', type: 'string' }),
            defineField({ name: 'vision', type: 'text' }),
            defineField({ name: 'commitmentTitle', type: 'string' }),
            defineField({ name: 'missionBullets', type: 'array', of: [{ type: 'string' }] })
          ]
        },
        {
          type: 'object',
          name: 'homeServicesTeaserSection',
          title: 'Home: Services Teaser',
          fields: [
            defineField({ name: 'heading', type: 'string' }),
            defineField({ name: 'paragraph', type: 'text' }),
            defineField({ name: 'ctaLabel', type: 'string' }),
            defineField({ name: 'ctaHref', type: 'string' }),
            defineField({
              name: 'services',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'homeServiceItem',
                  fields: [
                    defineField({ name: 'title', type: 'string' }),
                    defineField({ name: 'body', type: 'text' })
                  ]
                }
              ]
            })
          ]
        },
        {
          type: 'object',
          name: 'servicesSection',
          title: 'Services Section',
          fields: [
            defineField({ name: 'kicker', type: 'string' }),
            defineField({ name: 'heading', type: 'string' }),
            defineField({ name: 'paragraph1', type: 'text' }),
            defineField({ name: 'paragraph2', type: 'text' }),
            defineField({
              name: 'highlights',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'servicesHighlight',
                  fields: [
                    defineField({ name: 'title', type: 'string' }),
                    defineField({ name: 'body', type: 'text' })
                  ]
                }
              ]
            }),
            defineField({ name: 'safetyHeading', type: 'string' }),
            defineField({ name: 'safetyBody', type: 'text' })
          ]
        },
        {
          type: 'object',
          name: 'aboutSection',
          title: 'About Section',
          fields: [
            defineField({ name: 'overviewKicker', type: 'string' }),
            defineField({ name: 'overviewHeading', type: 'string' }),
            defineField({ name: 'overviewBody1', type: 'text' }),
            defineField({ name: 'overviewBody2', type: 'text' }),
            defineField({
              name: 'overviewStats',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'aboutStat',
                  fields: [
                    defineField({ name: 'label', type: 'string' }),
                    defineField({ name: 'value', type: 'string' })
                  ]
                }
              ]
            }),
            defineField({ name: 'capabilitiesKicker', type: 'string' }),
            defineField({ name: 'capabilitiesHeading', type: 'string' }),
            defineField({ name: 'companyKicker', type: 'string' }),
            defineField({ name: 'companyHeading', type: 'string' }),
            defineField({ name: 'companyBody', type: 'text' }),
            defineField({ name: 'companyImage1', type: 'image' }),
            defineField({ name: 'companyImage2', type: 'image' }),
            defineField({ name: 'companyImage1Url', type: 'string' }),
            defineField({ name: 'companyImage2Url', type: 'string' }),
            defineField({ name: 'galleryKicker', type: 'string' }),
            defineField({ name: 'galleryHeading', type: 'string' }),
            defineField({ name: 'galleryBody', type: 'text' }),
            defineField({ name: 'galleryCtaLabel', type: 'string' }),
            defineField({ name: 'galleryCtaHref', type: 'string' }),
            defineField({ name: 'galleryVideo', type: 'file' }),
            defineField({ name: 'galleryVideoUrl', type: 'string' }),
            defineField({ name: 'visionTitle', type: 'string' }),
            defineField({ name: 'visionBody', type: 'text' }),
            defineField({ name: 'missionTitle', type: 'string' }),
            defineField({ name: 'missionBullets', type: 'array', of: [{ type: 'string' }] }),
            defineField({ name: 'deliveryHeading', type: 'string' }),
            defineField({
              name: 'deliveryCards',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'aboutDeliveryCard',
                  fields: [
                    defineField({ name: 'title', type: 'string' }),
                    defineField({ name: 'body', type: 'text' })
                  ]
                }
              ]
            })
          ]
        },
        {
          type: 'object',
          name: 'contactSection',
          title: 'Contact Section',
          fields: [
            defineField({ name: 'officeTitle', type: 'string' }),
            defineField({ name: 'headOffice', type: 'string' }),
            defineField({ name: 'phoneTitle', type: 'string' }),
            defineField({ name: 'phoneNumbers', type: 'array', of: [{ type: 'string' }] }),
            defineField({ name: 'emailTitle', type: 'string' }),
            defineField({ name: 'email', type: 'string' }),
            defineField({ name: 'enquiryKicker', type: 'string' }),
            defineField({ name: 'enquiryBody', type: 'text' }),
            defineField({ name: 'locationKicker', type: 'string' }),
            defineField({ name: 'locationHeading', type: 'string' }),
            defineField({ name: 'addressLines', type: 'array', of: [{ type: 'string' }] }),
            defineField({ name: 'mapQuery', type: 'string' }),
            defineField({ name: 'mapLinkLabel', type: 'string' })
          ]
        },
        {
          type: 'object',
          name: 'projectsIntroSection',
          title: 'Body: Projects Intro',
          fields: [
            defineField({ name: 'kicker', type: 'string' }),
            defineField({ name: 'body', type: 'text' })
          ]
        },
        {
          type: 'object',
          name: 'mediaSection',
          title: 'Body: Media',
          fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'markdown', type: 'text' }),
            defineField({ name: 'image', type: 'image' }),
            defineField({ name: 'video', type: 'file' }),
            defineField({ name: 'imageUrl', type: 'string' }),
            defineField({ name: 'videoUrl', type: 'string' })
          ]
        }
      ]
    })
  ]
});
