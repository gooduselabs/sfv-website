// Usage: node scripts/import-results.mjs <file.csv|file.xlsx> [competition-slug]
// Sends the file to the custom endpoint POST /sfv/import-results (same logic as the admin flow).
import fs from 'node:fs';
import path from 'node:path';
import { api } from './lib.mjs';
const [file, comp] = process.argv.slice(2);
if (!file) { console.log('usage: import-results <file> [competition-slug]'); process.exit(1); }
const fd = new FormData(); fd.append('file', new Blob([fs.readFileSync(file)]), path.basename(file));
console.log(JSON.stringify(await api('POST', '/sfv/import-results' + (comp ? `?competition=${comp}` : ''), fd), null, 2));
