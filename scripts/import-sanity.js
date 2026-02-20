/* eslint-disable no-console */

const fs = require('node:fs/promises');
const path = require('node:path');
const matter = require('gray-matter');
const crypto = require('node:crypto');

async function loadDotEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  let raw = '';
  try {
    raw = await fs.readFile(envPath, 'utf8');
  } catch {
    return;
  }

  raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !l.startsWith('#'))
    .forEach((line) => {
      const idx = line.indexOf('=');
      if (idx <= 0) return;
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    });
}

async function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID');
  if (!dataset) throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET');
  if (!apiVersion) throw new Error('Missing NEXT_PUBLIC_SANITY_API_VERSION');
  if (!token) throw new Error('Missing SANITY_API_WRITE_TOKEN');

  const mod = await import('@sanity/client');
  const createClient = mod.createClient;

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false
  });
}

async function importSiteSettings(client) {
  const siteJsonPath = path.join(process.cwd(), 'content', 'settings', 'site.json');
  const raw = await fs.readFile(siteJsonPath, 'utf8');
  const data = JSON.parse(raw);

  const services = Array.isArray(data.services)
    ? data.services.map((s) => ({
        ...s,
        _key:
          typeof s?._key === 'string' && s._key.trim().length > 0
            ? s._key
            : crypto.randomUUID()
      }))
    : data.services;

  const leadership = Array.isArray(data.leadership)
    ? data.leadership.map((l) => ({
        ...l,
        _key:
          typeof l?._key === 'string' && l._key.trim().length > 0
            ? l._key
            : crypto.randomUUID()
      }))
    : data.leadership;

  const doc = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    ...data,
    services,
    leadership
  };

  await client.createOrReplace(doc);
  console.log('Imported siteSettings');
}

async function importProjects(client) {
  const projectsDir = path.join(process.cwd(), 'content', 'projects');
  const entries = await fs.readdir(projectsDir);
  const mdFiles = entries.filter((f) => f.toLowerCase().endsWith('.md'));

  for (const file of mdFiles) {
    const slug = file.replace(/\.md$/i, '');
    const fullPath = path.join(projectsDir, file);
    const raw = await fs.readFile(fullPath, 'utf8');
    const parsed = matter(raw);

    const doc = {
      _id: `project.${slug}`,
      _type: 'project',
      title: String(parsed.data.title ?? slug),
      slug: { _type: 'slug', current: slug },
      draft: Boolean(parsed.data.draft ?? false),
      location: parsed.data.location ? String(parsed.data.location) : undefined,
      year: parsed.data.year ? String(parsed.data.year) : undefined,
      status: parsed.data.status ? String(parsed.data.status) : undefined,
      summary: parsed.data.summary ? String(parsed.data.summary) : undefined,
      image: parsed.data.image ? String(parsed.data.image) : undefined,
      video: parsed.data.video ? String(parsed.data.video) : undefined,
      video2: parsed.data.video2 ? String(parsed.data.video2) : undefined,
      video2Poster: parsed.data.video2Poster ? String(parsed.data.video2Poster) : undefined,
      content: parsed.content
    };

    Object.keys(doc).forEach((k) => {
      if (doc[k] === undefined) delete doc[k];
    });

    await client.createOrReplace(doc);
    console.log(`Imported project: ${slug}`);
  }
}

(async function main() {
  await loadDotEnvLocal();
  const client = await getSanityWriteClient();
  await importSiteSettings(client);
  await importProjects(client);
  console.log('Done');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
