import { defineConfig } from 'sanity';
import { visionTool } from '@sanity/vision';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './sanity/schemaTypes';
import { structure } from './sanity/deskStructure';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export default defineConfig({
  name: 'default',
  title: 'Rikonim Enterprise',
  projectId: projectId || '',
  dataset: dataset || 'production',
  basePath: '/studio',
  plugins: [deskTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes
  }
});
