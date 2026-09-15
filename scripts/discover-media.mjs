import { CATALOG } from '../src/data/catalog.js';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
const prior = await readFile('research/source-images.json', 'utf8').then(JSON.parse).catch(() => []);
const sources = [...new Set([...CATALOG.filter(x => !x.gif).map(x => x.source), ...prior.map(x => x.source), ...process.argv.slice(2)])];
const results = [];
await mkdir('research', { recursive: true });
const clean = text => text.replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, ' ').trim();
for (const source of sources) {
  const response = await fetch(source, { signal: AbortSignal.timeout(20000) });
  const html = await response.text();
  const images = [];
  let heading = '';
  for (const match of html.matchAll(/<h[234][\s\S]*?<\/h[234]>|<img\b[^>]*>/gi)) {
    const tag = match[0];
    if (tag.startsWith('<h')) { heading = clean(tag); continue; }
    const urls = [...tag.matchAll(/https:[^\s"<>]+\.(?:gif|webp|jpg|png)/g)].map(x => x[0]);
    const url = urls.find(x => x.endsWith('.gif')) || urls[0];
    if (url) images.push({ heading, alt: tag.match(/alt="([^"]*)"/)?.[1] || '', url });
  }
  results.push({ source, images });
}
await writeFile('research/source-images.json', JSON.stringify(results, null, 2));
for (const result of results) {
  if (process.argv.length > 2 && !process.argv.slice(2).includes(result.source)) continue;
  console.log('\n' + result.source);
  for (const image of result.images.filter(x => x.url.endsWith('.gif'))) console.log(image.heading + ' | ' + image.alt + ' | ' + image.url);
}
