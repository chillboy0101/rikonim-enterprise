import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/projects';

export async function GET() {
  const projects = await getProjects();
  const featured = projects.slice(0, 6).map((p) => ({
    slug: p.slug,
    title: p.title,
    image: p.image,
    location: p.location,
    year: p.year,
    status: p.status,
    summary: p.summary
  }));

  return NextResponse.json({ featured });
}
