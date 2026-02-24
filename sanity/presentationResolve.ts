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
          title: doc?.title ?? 'Project',
          href: `/projects/${doc?.slug ?? ''}`
        },
        {
          title: 'Projects Index',
          href: '/projects'
        }
      ]
    })
  }),
  page: defineLocations({
    select: {
      title: 'title',
      route: 'route'
    },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title ?? doc?.route ?? 'Page',
          href: doc?.route ?? '/'
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
          title: doc?.title ?? 'Home',
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
  },
  {
    route: '/',
    filter: `_type == "page" && route == "/"`
  },
  {
    route: '/:route',
    filter: `_type == "page" && (route == "/" + $route || route == $route || route == "/" + $route + "/")`
  },
  {
    route: '/:path*',
    filter: `_type == "page" && (route == "/" + $path || route == $path || route == "/" + $path + "/")`
  }
]);
