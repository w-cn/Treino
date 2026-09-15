import { writeFile } from 'node:fs/promises';
import { CATALOG } from '../src/data/catalog.js';
const urls = [...new Set(CATALOG.map(x => x.gif).filter(Boolean))];
const results = [];
let index = 0;
async function worker() {
  while (index < urls.length) {
    const url = urls[index++];
    try {
      const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(15000) });
      results.push({ url, status: response.status, type: response.headers.get('content-type'), ok: response.ok && (response.headers.get('content-type') || '').startsWith('image/') });
    } catch (error) { results.push({ url, ok: false, error: error.message }); }
  }
}
await Promise.all(Array.from({ length: 5 }, worker));
await writeFile('media-audit.json', JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
console.log(JSON.stringify({ total: results.length, valid: results.filter(x => x.ok).length, failed: results.filter(x => !x.ok) }, null, 2));
