import { defineConfig } from 'sanity';
import { visionTool } from '@sanity/vision';
import { deskTool } from 'sanity/desk';
import { presentationTool } from 'sanity/presentation';
import { schemaTypes } from './sanity/schemaTypes';
import { structure } from './sanity/deskStructure';
import { locations, mainDocuments } from './sanity/presentationResolve';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;

const previewInitialUrl =
  process.env.NEXT_PUBLIC_SANITY_PREVIEW_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://rikonim.com' : 'http://localhost:3000');

export default defineConfig({
  name: 'default',
  title: 'Rikonim Enterprise',
  projectId: projectId || '',
  dataset: dataset || 'production',
  apiVersion: apiVersion || '2025-01-01',
  basePath: '/studio',
  plugins: [
    deskTool({ structure }),
    presentationTool({
      previewUrl: {
        initial: previewInitialUrl,
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable'
        }
      },
      allowOrigins: ['http://localhost:*', 'https://rikonim.com', 'https://www.rikonim.com'],
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
