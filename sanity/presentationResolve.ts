import { defineDocuments, defineLocations } from 'sanity/presentation';

export const locations = {
  project: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current'
    },
    resolve: (doc) => ({
      locations: [
        {
          title: doc.title ?? 'Project',
          href: `/projects/${doc.slug}`
        },
        {
          title: 'Projects Index',
          href: '/projects'
        }
      ]
    })
  }),
  siteSettings: defineLocations({
    select: {
      title: 'name'
    },
    resolve: (doc) => ({
      locations: [
        {
          title: doc.title ?? 'Home',
          href: '/'
        }
      ]
    })
  })
};

export const mainDocuments = defineDocuments([
  {
    route: '/projects/:slug',
    filter: `_type == "project" && slug.current == $slug`
  }
]);
