#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const requiredFiles = [
  'app/page.tsx',
  'app/layout.tsx',
  'app/robots.ts',
  'app/sitemap.ts',
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.resolve(process.cwd(), file)));

if (missing.length > 0) {
  console.error('Faltan archivos clave para operación/SEO:');
  for (const file of missing) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log('Pruebas clave OK: archivos críticos presentes.');
