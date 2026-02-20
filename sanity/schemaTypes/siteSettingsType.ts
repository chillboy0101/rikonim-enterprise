import { defineField, defineType } from 'sanity';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string' }),
    defineField({ name: 'tagline', type: 'string' }),
    defineField({ name: 'industry', type: 'string' }),
    defineField({ name: 'businessType', type: 'string' }),
    defineField({ name: 'headquarters', type: 'string' }),
    defineField({ name: 'founded', type: 'string' }),
    defineField({ name: 'overview', type: 'text' }),
    defineField({ name: 'vision', type: 'text' }),
    defineField({ name: 'missionBullets', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'heroVideos',
      type: 'object',
      fields: [
        defineField({ name: 'home', type: 'string' }),
        defineField({ name: 'company', type: 'string' }),
        defineField({ name: 'services', type: 'string' }),
        defineField({ name: 'projects', type: 'string' }),
        defineField({ name: 'contact', type: 'string' }),
        defineField({ name: 'leadership', type: 'string' }),
        defineField({ name: 'legal', type: 'string' })
      ]
    }),
    defineField({
      name: 'services',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'slug', type: 'string' }),
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'summary', type: 'text' }),
            defineField({ name: 'bullets', type: 'array', of: [{ type: 'string' }] }),
            defineField({ name: 'image', type: 'string' }),
            defineField({ name: 'video', type: 'string' })
          ]
        }
      ]
    }),
    defineField({
      name: 'leadership',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'role', type: 'string' }),
            defineField({ name: 'name', type: 'string' }),
            defineField({ name: 'bio', type: 'text' }),
            defineField({ name: 'highlights', type: 'array', of: [{ type: 'string' }] }),
            defineField({ name: 'image', type: 'string' })
          ]
        }
      ]
    }),
    defineField({
      name: 'contact',
      type: 'object',
      fields: [
        defineField({ name: 'phone', type: 'string' }),
        defineField({ name: 'email', type: 'string' }),
        defineField({ name: 'headOffice', type: 'string' }),
        defineField({ name: 'addressLines', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'mapQuery', type: 'string' })
      ]
    })
  ]
});
