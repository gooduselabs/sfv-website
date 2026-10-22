import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });
const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  // Images are served by Directus asset transforms (width/format), so plain <img> is intentional.
  { rules: { '@next/next/no-img-element': 'off' } },
];
export default config;
