/* eslint-disable no-console */

const fs = require('node:fs/promises');
const path = require('node:path');
const matter = require('gray-matter');

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
  return mod.createClient({ projectId, dataset, apiVersion, token, useCdn: false });
}

async function getKeepSlugsFromLocalMarkdown() {
  const projectsDir = path.join(process.cwd(), 'content', 'projects');
  const entries = await fs.readdir(projectsDir);
  const mdFiles = entries.filter((f) => f.toLowerCase().endsWith('.md'));

  const nonDraftSlugs = [];

  for (const file of mdFiles) {
    const slug = file.replace(/\.md$/i, '');
    const raw = await fs.readFile(path.join(projectsDir, file), 'utf8');
    const parsed = matter(raw);
    const isDraft = Boolean(parsed.data.draft ?? false);
    if (!isDraft) nonDraftSlugs.push(slug);
  }

  return nonDraftSlugs;
}

(async function main() {
  await loadDotEnvLocal();
  const client = await getSanityWriteClient();

  const keepSlugs = await getKeepSlugsFromLocalMarkdown();
  const keepIds = new Set(keepSlugs.map((s) => `project.${s}`));

  const ids = await client.fetch(`*[_type == "project"]._id`);
  const toDelete = ids.filter((id) => {
    const isDraft = String(id).startsWith('drafts.');
    if (isDraft) {
      const baseId = String(id).replace(/^drafts\./, '');
      return !keepIds.has(baseId);
    }
    return !keepIds.has(String(id));
  });

  console.log(`Keeping ${keepIds.size} project(s):`);
  keepSlugs.forEach((s) => console.log(`  - ${s}`));

  console.log(`Found ${ids.length} project doc(s) in Sanity.`);
  console.log(`Deleting ${toDelete.length} project doc(s) not in keep list...`);

  if (toDelete.length === 0) {
    console.log('Nothing to delete.');
    return;
  }

  let tx = client.transaction();
  for (const id of toDelete) {
    tx = tx.delete(id);
  }

  await tx.commit();
  console.log('Cleanup complete.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
