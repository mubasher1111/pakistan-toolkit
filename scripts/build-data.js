// Writes the reference data in src/data.js to plain JSON files in /data,
// so non-JavaScript projects (Python, PHP, Go, SQL imports...) can use it.
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { provinces, cities, banks } from '../src/data.js';

const outDir = fileURLToPath(new URL('../data/', import.meta.url));
mkdirSync(outDir, { recursive: true });

for (const [name, rows] of Object.entries({ provinces, cities, banks })) {
  writeFileSync(`${outDir}${name}.json`, JSON.stringify(rows, null, 2) + '\n', 'utf8');
  console.log(`data/${name}.json  (${rows.length} rows)`);
}
