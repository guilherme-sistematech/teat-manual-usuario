#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { projectDir } = require('./fontes-pdf');

const ignoredDirectories = new Set(['.git', 'node_modules', 'dist']);

function listMarkdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      if (entry.isDirectory() && ignoredDirectories.has(entry.name)) return [];
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) return listMarkdownFiles(absolute);
      return entry.name.endsWith('.md') ? [absolute] : [];
    });
}

const brokenLinks = [];
let checkedLinks = 0;

for (const markdownFile of listMarkdownFiles(projectDir)) {
  const markdown = fs.readFileSync(markdownFile, 'utf8');
  const linkPattern = /!?\[[^\]]*\]\(([^)]+)\)/g;

  for (const match of markdown.matchAll(linkPattern)) {
    checkedLinks += 1;
    let target = match[1].trim().replace(/^<|>$/g, '');
    target = target.split(/[?#]/, 1)[0];

    if (!target || /^[a-z][a-z+.-]*:/i.test(target)) continue;

    try {
      target = decodeURI(target);
    } catch {
      brokenLinks.push({ markdownFile, target: match[1], reason: 'URL inválida' });
      continue;
    }

    const absoluteTarget = path.resolve(path.dirname(markdownFile), target);
    if (!fs.existsSync(absoluteTarget)) {
      brokenLinks.push({ markdownFile, target: match[1], reason: 'arquivo ausente' });
    }
  }
}

if (brokenLinks.length > 0) {
  for (const broken of brokenLinks) {
    console.error(
      `${path.relative(projectDir, broken.markdownFile)}: ${broken.target} (${broken.reason})`,
    );
  }
  console.error(`${brokenLinks.length} link(s) local(is) inválido(s).`);
  process.exitCode = 1;
} else {
  console.log(`${checkedLinks} links verificados; nenhum link local quebrado.`);
}
