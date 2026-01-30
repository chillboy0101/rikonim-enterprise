import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export type Project = {
  slug: string;
  title: string;
  image?: string;
  location?: string;
  year?: string;
  status?: string;
  summary?: string;
  content: string;
};

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');

export async function getProjects(): Promise<Project[]> {
  const entries = await fs.readdir(PROJECTS_DIR);
  const mdFiles = entries.filter((f) => f.toLowerCase().endsWith('.md'));

  const projects = await Promise.all(
    mdFiles.map(async (file) => {
      const slug = file.replace(/\.md$/i, '');
      const fullPath = path.join(PROJECTS_DIR, file);
      const raw = await fs.readFile(fullPath, 'utf8');
      const parsed = matter(raw);

      return {
        slug,
        title: String(parsed.data.title ?? slug),
        image: parsed.data.image ? String(parsed.data.image) : undefined,
        location: parsed.data.location ? String(parsed.data.location) : undefined,
        year: parsed.data.year ? String(parsed.data.year) : undefined,
        status: parsed.data.status ? String(parsed.data.status) : undefined,
        summary: parsed.data.summary ? String(parsed.data.summary) : undefined,
        content: parsed.content
      } satisfies Project;
    })
  );

  return projects.sort((a, b) => (b.year ?? '').localeCompare(a.year ?? ''));
}
