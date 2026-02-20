/* eslint-disable no-console */

const fs = require('node:fs/promises');
const path = require('node:path');
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

function ensureKeys(items) {
  if (!Array.isArray(items)) return items;
  return items.map((item) => {
    if (!item || typeof item !== 'object') return item;
    if (typeof item._key === 'string' && item._key.trim().length > 0) return item;
    return { ...item, _key: crypto.randomUUID() };
  });
}

;(async function main() {
  await loadDotEnvLocal();
  const client = await getSanityWriteClient();

  const doc = await client.getDocument('siteSettings');
  if (!doc) {
    console.log('No siteSettings document found with id "siteSettings". Nothing to fix.');
    return;
  }

  const nextServices = ensureKeys(doc.services);
  const nextLeadership = ensureKeys(doc.leadership);

  const servicesChanged = JSON.stringify(nextServices) !== JSON.stringify(doc.services);
  const leadershipChanged = JSON.stringify(nextLeadership) !== JSON.stringify(doc.leadership);

  if (!servicesChanged && !leadershipChanged) {
    console.log('siteSettings already has keys. Nothing to fix.');
    return;
  }

  const patch = client.patch('siteSettings');
  if (servicesChanged) patch.set({ services: nextServices });
  if (leadershipChanged) patch.set({ leadership: nextLeadership });

  await patch.commit({ autoGenerateArrayKeys: false });

  console.log('Fixed siteSettings missing keys.');
})();
