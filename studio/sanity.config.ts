import { defineConfig } from 'sanity';
import { dashboardTool, projectInfoWidget, projectUsersWidget, sanityTutorialsWidget } from '@sanity/dashboard';
import { visionTool } from '@sanity/vision';
import { deskTool } from 'sanity/desk';
import { presentationTool } from 'sanity/presentation';
import { media } from 'sanity-plugin-media';
import { createElement } from 'react';
import faviconUrl from '../public/favicon.png';
import './mobile.css';

import { schemaTypes } from '../sanity/schemaTypes';
import { structure } from '../sanity/deskStructure';
import { locations, mainDocuments } from '../sanity/presentationResolve';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'oy93rufy';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;

const previewInitialUrl =
  process.env.NEXT_PUBLIC_SANITY_PREVIEW_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://rikonim.com' : 'http://localhost:3000');

export default defineConfig({
  name: 'default',
  title: 'Rikonim Enterprise',
  projectId,
  dataset,
  apiVersion: apiVersion || '2025-01-01',
  basePath: '/',
  icon: () =>
    createElement('img', {
      src: faviconUrl,
      alt: 'Rikonim Enterprise',
      style: {
        width: 22,
        height: 22,
        objectFit: 'contain',
        display: 'block'
      }
    }),
  plugins: [
    dashboardTool({
      title: 'Dashboard',
      widgets: [sanityTutorialsWidget(), projectInfoWidget(), projectUsersWidget()]
    }),
    deskTool({ structure }),
    media(),
    presentationTool({
      previewUrl: {
        initial: previewInitialUrl,
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable'
        }
      },
      allowOrigins: [
        'http://localhost:*',
        'https://rikonim.com',
        'https://www.rikonim.com',
        'https://studio.rikonim.com'
      ],
      resolve: {
        locations,
        mainDocuments
      }
    }),
    visionTool()
  ],
  schema: {
    types: schemaTypes
  }
});
