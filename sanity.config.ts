import { defineConfig } from 'sanity';
import { visionTool } from '@sanity/vision';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './sanity/schemaTypes';
import { structure } from './sanity/deskStructure';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;

export default defineConfig({
  name: 'default',
  title: 'Rikonim Enterprise',
  projectId: projectId || '',
  dataset: dataset || 'production',
  apiVersion: apiVersion || '2025-01-01',
  basePath: '/studio',
  plugins: [deskTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes
  }
});
