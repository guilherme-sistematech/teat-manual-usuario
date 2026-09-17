#!/usr/bin/env node

'use strict';

const fsSync = require('node:fs');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const MarkdownIt = require('markdown-it');
const puppeteer = require('puppeteer');

const projectDir = path.resolve(__dirname, '..');
const manualDir = path.join(projectDir, 'manual-usuario');
const summaryFile = path.join(manualDir, 'README.md');
const defaultOutput = path.join(projectDir, 'dist', 'manual-usuario-teat.pdf');

function parseArguments(argv) {
  const result = { output: defaultOutput };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === '--output' || argument === '-o') {
      if (!argv[index + 1]) throw new Error(`A opção ${argument} exige um caminho.`);
      result.output = path.resolve(argv[++index]);
    } else if (argument === '--help' || argument === '-h') {
      result.help = true;
    } else {
      throw new Error(`Opção desconhecida: ${argument}`);
    }
  }

  return result;
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-');
}

function documentId(relativeFile) {
  return `capitulo-${slugify(relativeFile.replace(/\.md$/i, '').replaceAll('/', '-'))}`;
}

function imageDataUrl(absoluteFile) {
  const mimeTypes = {
    '.gif': 'image/gif',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
  };
  const extension = path.extname(absoluteFile).toLowerCase();
  const mimeType = mimeTypes[extension];

  if (!mimeType) {
    throw new Error(`formato de imagem local não suportado: ${absoluteFile}`);
  }

  try {
    const base64 = fsSync.readFileSync(absoluteFile).toString('base64');
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    throw new Error(`não foi possível incorporar a imagem ${absoluteFile}: ${error.message}`);
  }
}

function extractChapterFiles(summary) {
  const summarySection = summary.match(/## Sumário\s+([\s\S]*?)(?=\n## |$)/i);
  if (!summarySection) throw new Error('A seção "Sumário" não foi encontrada em manual-usuario/README.md.');

  const files = [];
  const markdownLink = /\[[^\]]+\]\(([^)#]+\.md)(?:#[^)]+)?\)/gi;

  for (const match of summarySection[1].matchAll(markdownLink)) {
    const normalized = path.posix.normalize(match[1]);
    if (!files.includes(normalized)) files.push(normalized);
  }

  if (files.length === 0) throw new Error('O sumário não contém links para capítulos Markdown.');
  return files;
}

function publicIntroduction(summary) {
  // A checklist editorial é deliberadamente excluída do documento destinado ao usuário.
  return summary.replace(/\n## Material editorial[\s\S]*?(?=\n## |$)/i, '');
}

function stripFrontMatter(markdown) {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
}

function configureMarkdown(includedFiles) {
  const markdown = new MarkdownIt({ html: true, linkify: true, typographer: true });
  const defaultHeadingOpen = markdown.renderer.rules.heading_open
    || ((tokens, index, options, environment, renderer) => renderer.renderToken(tokens, index, options));

  markdown.renderer.rules.heading_open = (tokens, index, options, environment, renderer) => {
    const inline = tokens[index + 1];
    const base = slugify(inline?.content || 'secao') || 'secao';
    const count = environment.headingCounts.get(base) || 0;
    environment.headingCounts.set(base, count + 1);
    const suffix = count === 0 ? '' : `-${count}`;
    tokens[index].attrSet('id', `${environment.documentId}-${base}${suffix}`);
    return defaultHeadingOpen(tokens, index, options, environment, renderer);
  };

  markdown.core.ruler.after('inline', 'resolve-local-resources', (state) => {
    for (const block of state.tokens) {
      if (block.type !== 'inline' || !block.children) continue;

      for (const token of block.children) {
        if (token.type === 'image') {
          const source = token.attrGet('src');
          if (source && !/^(?:[a-z]+:|#)/i.test(source)) {
            const absolute = path.resolve(path.dirname(state.env.absoluteFile), decodeURI(source));
            token.attrSet('src', imageDataUrl(absolute));
          }
        }

        if (token.type === 'link_open') {
          const href = token.attrGet('href');
          if (!href || /^(?:[a-z]+:|#)/i.test(href)) continue;

          const [target, fragment = ''] = href.split('#', 2);
          const absoluteTarget = path.resolve(path.dirname(state.env.absoluteFile), decodeURI(target));
          const relativeTarget = path.relative(manualDir, absoluteTarget).split(path.sep).join('/');

          if (target.toLowerCase().endsWith('.md') && includedFiles.has(relativeTarget)) {
            const anchor = fragment ? `-${slugify(decodeURIComponent(fragment))}` : '';
            token.attrSet('href', `#${documentId(relativeTarget)}${anchor}`);
          } else {
            token.attrSet('href', pathToFileURL(absoluteTarget).href + (fragment ? `#${fragment}` : ''));
          }
        }
      }
    }
  });

  return markdown;
}

async function readDocuments() {
  const summary = await fs.readFile(summaryFile, 'utf8');
  const chapterFiles = extractChapterFiles(summary);
  const includedFiles = new Set(chapterFiles);
  const markdown = configureMarkdown(includedFiles);
  const documents = [{ relativeFile: 'README.md', content: publicIntroduction(summary), cover: true }];

  for (const relativeFile of chapterFiles) {
    const absoluteFile = path.resolve(manualDir, relativeFile);
    const relativeCheck = path.relative(manualDir, absoluteFile);
    if (relativeCheck.startsWith('..') || path.isAbsolute(relativeCheck)) {
      throw new Error(`Capítulo fora da pasta do manual: ${relativeFile}`);
    }
    documents.push({ relativeFile, content: stripFrontMatter(await fs.readFile(absoluteFile, 'utf8')) });
  }

  return documents.map((document) => {
    const absoluteFile = path.resolve(manualDir, document.relativeFile);
    const environment = {
      absoluteFile,
      documentId: documentId(document.relativeFile),
      headingCounts: new Map(),
    };
    const classes = document.cover ? 'document cover' : 'document chapter';
    return `<section class="${classes}" id="${environment.documentId}">${markdown.render(document.content, environment)}</section>`;
  }).join('\n');
}

function buildHtml(body) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Manual do Usuário — TEAT</title>
  <style>
    @page { size: A4; margin: 20mm 17mm 20mm; }
    * { box-sizing: border-box; }
    html { font: 10.5pt/1.5 Arial, Helvetica, sans-serif; color: #172033; }
    body { margin: 0; }
    .chapter { break-before: page; page-break-before: always; }
    .cover > h1 { margin-top: 55mm; font-size: 30pt; color: #153d73; }
    .cover > p:first-of-type { max-width: 145mm; font-size: 14pt; color: #4a5568; }
    h1, h2, h3, h4 { color: #153d73; line-height: 1.2; break-after: avoid; }
    h1 { margin: 0 0 8mm; font-size: 24pt; }
    h2 { margin-top: 8mm; padding-bottom: 2mm; border-bottom: 1px solid #cbd5e1; font-size: 17pt; }
    h3 { margin-top: 6mm; font-size: 13pt; }
    p, li { orphans: 3; widows: 3; }
    a { color: #1559a6; text-decoration: none; }
    blockquote { margin: 5mm 0; padding: 2mm 4mm; border-left: 3px solid #e49b21; background: #fff8e8; }
    blockquote > :first-child { margin-top: 0; }
    blockquote > :last-child { margin-bottom: 0; }
    code { padding: 0.2em 0.35em; border-radius: 3px; background: #eef2f7; font-family: Consolas, monospace; font-size: 0.9em; }
    pre { overflow-wrap: anywhere; white-space: pre-wrap; break-inside: avoid; padding: 4mm; background: #eef2f7; }
    pre code { padding: 0; }
    table { width: 100%; margin: 5mm 0; border-collapse: collapse; font-size: 9pt; }
    th, td { padding: 2.2mm; border: 1px solid #cbd5e1; text-align: left; vertical-align: top; }
    th { background: #eaf1f9; color: #153d73; }
    tr { break-inside: avoid; }
    img { display: block; max-width: 100%; max-height: 220mm; margin: 5mm auto; object-fit: contain; break-inside: avoid; }
    hr { margin: 8mm 0; border: 0; border-top: 1px solid #cbd5e1; }
  </style>
</head>
<body>${body}</body>
</html>`;
}

async function generatePdf(output) {
  const html = buildHtml(await readDocuments());
  await fs.mkdir(path.dirname(output), { recursive: true });

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: process.getuid?.() === 0 ? ['--no-sandbox'] : [],
    });
  } catch (error) {
    throw new Error(
      `não foi possível iniciar o Chromium. Instale as dependências de sistema `
      + `documentadas pelo Puppeteer ou defina PUPPETEER_EXECUTABLE_PATH para um `
      + `Chrome/Chromium funcional. Detalhe: ${error.message}`,
    );
  }
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: ['load', 'networkidle0'] });
    await page.emulateMediaType('print');
    await page.pdf({
      path: output,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: '<div style="width:100%;font:8px Arial;color:#64748b;text-align:center"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
      margin: { top: '20mm', right: '17mm', bottom: '20mm', left: '17mm' },
      outline: true,
    });
  } finally {
    await browser.close();
  }

  console.log(`PDF gerado em ${output}`);
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    console.log('Uso: npm run pdf -- [--output caminho/arquivo.pdf]');
    return;
  }
  await generatePdf(options.output);
}

main().catch((error) => {
  console.error(`Erro ao gerar o PDF: ${error.message}`);
  process.exitCode = 1;
});
