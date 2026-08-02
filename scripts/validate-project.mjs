import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = process.cwd();
const errors = [];

const requiredFiles = [
  'src/main.ts',
  'public/manifest.webmanifest',
  'public/assets/icons/app-icon.svg',
  'public/assets/icons/maskable-icon.svg',
  'public/assets/social/social-preview.svg',
];

const forbiddenFiles = [
  'src/app/main.ts',
  'public/favicon.svg',
  'public/social-preview.svg',
  'public/icons/README.md',
];

const read = (path) => readFileSync(resolve(root, path), 'utf8');

for (const path of requiredFiles) {
  if (!existsSync(resolve(root, path))) {
    errors.push(`Missing required file: ${path}`);
  }
}

for (const path of forbiddenFiles) {
  if (existsSync(resolve(root, path))) {
    errors.push(`Legacy file should not exist: ${path}`);
  }
}

if (existsSync(resolve(root, 'src/main.ts'))) {
  const entryPoint = read('src/main.ts');
  if (!entryPoint.includes("from './app/App'")) {
    errors.push('src/main.ts must import the application composition root.');
  }
  if (!entryPoint.includes("import './app/styles'")) {
    errors.push('src/main.ts must import the global application styles.');
  }
  if (!entryPoint.includes("querySelector<HTMLElement>('#app')")) {
    errors.push('src/main.ts must mount the application at #app.');
  }
}

if (existsSync(resolve(root, 'index.html'))) {
  const indexHtml = read('index.html');
  const requiredReferences = [
    'https://mihaicristiancondrea.github.io/symbly/',
    '%BASE_URL%manifest.webmanifest',
    '%BASE_URL%assets/icons/app-icon.svg',
    'assets/social/social-preview.svg',
  ];

  for (const reference of requiredReferences) {
    if (!indexHtml.includes(reference)) {
      errors.push(`index.html is missing reference: ${reference}`);
    }
  }

  if (indexHtml.includes('example.github.io')) {
    errors.push('index.html still contains the placeholder GitHub Pages domain.');
  }
}

if (existsSync(resolve(root, 'public/manifest.webmanifest'))) {
  const manifest = JSON.parse(read('public/manifest.webmanifest'));
  const icons = Array.isArray(manifest.icons) ? manifest.icons : [];

  if (icons.length === 0) {
    errors.push('The web manifest must declare at least one icon.');
  }

  for (const icon of icons) {
    if (typeof icon?.src !== 'string' || icon.src.length === 0) {
      errors.push('Every manifest icon must declare a source path.');
      continue;
    }

    const iconPath = resolve(root, 'public', icon.src);
    if (!existsSync(iconPath)) {
      errors.push(`Manifest icon does not exist: public/${icon.src}`);
    }
  }
}

const sourceRoot = resolve(root, 'src');
const sourceFiles = [];

const collectSourceFiles = (directory) => {
  for (const entry of readdirSync(directory)) {
    const absolutePath = join(directory, entry);
    const metadata = statSync(absolutePath);

    if (metadata.isDirectory()) {
      collectSourceFiles(absolutePath);
    } else if (/\.(?:ts|scss|css|html)$/.test(entry)) {
      sourceFiles.push(absolutePath);
    }
  }
};

if (existsSync(sourceRoot)) {
  collectSourceFiles(sourceRoot);
}

for (const absolutePath of sourceFiles) {
  const content = readFileSync(absolutePath, 'utf8');
  const projectPath = relative(root, absolutePath).replaceAll('\\', '/');

  if (/data:image\/svg\+xml/i.test(content)) {
    errors.push(`Embedded SVG data URI found in ${projectPath}`);
  }

  if (/<svg(?:\s|>)/i.test(content)) {
    errors.push(`Standalone SVG markup found in ${projectPath}`);
  }
}

if (errors.length > 0) {
  console.error('Project validation failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Project validation passed (${requiredFiles.length} required files, ${sourceFiles.length} source files checked).`);
