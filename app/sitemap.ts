import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://travel.wizelife.ai';
  const now = new Date();
  const langs = { he: '?lang=he', en: '?lang=en', pt: '?lang=pt', es: '?lang=es' };
  function alts(path: string) {
    return { languages: Object.fromEntries(Object.entries(langs).map(([l, q]) => [l, `${base}${path}${q}`])) };
  }
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0, alternates: alts('/') },
  ];
}
