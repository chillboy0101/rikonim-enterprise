import { defineField, defineType } from 'sanity';

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'draft', type: 'boolean', initialValue: false }),
    defineField({ name: 'location', type: 'string' }),
    defineField({ name: 'year', type: 'string' }),
    defineField({ name: 'status', type: 'string' }),
    defineField({ name: 'summary', type: 'text' }),
    defineField({ name: 'image', type: 'string' }),
    defineField({ name: 'video', type: 'string' }),
    defineField({ name: 'video2', type: 'string' }),
    defineField({ name: 'video2Poster', type: 'string' }),
    defineField({ name: 'content', type: 'text' })
  ]
});
