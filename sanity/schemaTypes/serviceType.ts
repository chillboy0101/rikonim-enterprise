import { defineField, defineType } from 'sanity';

export const serviceType = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'summary', type: 'text' }),
    defineField({ name: 'bullets', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'image', type: 'image' }),
    defineField({ name: 'video', type: 'file' }),
    defineField({ name: 'imageUrl', type: 'string' }),
    defineField({ name: 'videoUrl', type: 'string' }),
    defineField({ name: 'order', type: 'number' })
  ]
});
