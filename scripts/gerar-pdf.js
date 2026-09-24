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
const summaryFile = path.join(manualDir, 'index.md');
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
  if (!summarySection) throw new Error('A seção "Sumário" não foi encontrada em manual-usuario/index.md.');

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
  const summary = stripFrontMatter(await fs.readFile(summaryFile, 'utf8'));
  const chapterFiles = extractChapterFiles(summary);
  const includedFiles = new Set(chapterFiles);
  const markdown = configureMarkdown(includedFiles);
  const introduction = publicIntroduction(summary);
  const summaryStart = introduction.search(/^## Sumário\s*$/m);
  const documents = [
    {
      relativeFile: 'index.md',
      content: summaryStart >= 0 ? introduction.slice(0, summaryStart).trim() : introduction,
      cover: true,
      documentId: 'capa',
    },
  ];

  if (summaryStart >= 0) {
    documents.push({
      relativeFile: 'index.md',
      content: introduction.slice(summaryStart).trim(),
      frontmatter: true,
      documentId: 'sumario',
    });
  }

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
      documentId: document.documentId || documentId(document.relativeFile),
      headingCounts: new Map(),
    };
    const classes = document.cover
      ? 'document cover'
      : `document ${document.frontmatter ? 'frontmatter' : 'chapter'}`;
    return `<section class="${classes}" id="${environment.documentId}">${markdown.render(document.content, environment)}</section>`;
  }).join('\n');
}

function buildHtml(body) {
  const styledBody = body
    .replace(/<blockquote><p><strong>Atenção:<\/strong>/gi, '<blockquote class="callout attention"><p><strong>Atenção:</strong>')
    .replace(/<blockquote><p><strong>Dica:<\/strong>/gi, '<blockquote class="callout tip"><p><strong>Dica:</strong>')
    .replace(/<blockquote><p><strong>Informação:<\/strong>/gi, '<blockquote class="callout information"><p><strong>Informação:</strong>')
    .replace(/<blockquote><p><strong>Você está aqui:<\/strong>/gi, '<blockquote class="callout location"><p><strong>Você está aqui:</strong>')
    .replace(/<blockquote><p><strong>Rastreabilidade:<\/strong>/gi, '<blockquote class="callout traceability"><p><strong>Rastreabilidade:</strong>')
    .replace(/<blockquote><p><strong>O sistema faz por você:<\/strong>/gi, '<blockquote class="callout automation"><p><strong>O sistema faz por você:</strong>')
    .replace(/(<section class="document cover"[^>]*>)/, `$1
      <div class="institutional-signature">
        <span>Manual institucional</span>
        <strong>TEAT</strong>
        <small>Talonário Eletrônico do Agente de Trânsito</small>
      </div>
      <div class="cover-route" aria-hidden="true"><i></i></div>
      <p class="product-name">Talonário Eletrônico do Agente de Trânsito</p>`);

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Manual do Usuário — TEAT</title>
  <style>
    :root {
      --navy: #0b2e4f;
      --blue: #2f6f9f;
      --blue-light: #eaf3fa;
      --gold: #d49b00;
      --gold-light: #fff4cc;
      --green: #2f7d4a;
      --green-light: #eaf5ec;
      --purple: #6750a4;
      --ink: #263747;
      --muted: #536273;
      --line: #b9c9d7;
      --paper: #ffffff;
    }
    @page { size: A4; margin: 25mm 17mm 20mm; }
    * { box-sizing: border-box; }
    html { font: 10.5pt/1.48 Calibri, Carlito, Arial, sans-serif; color: var(--ink); }
    body { margin: 0; background: var(--paper); }
    .chapter { break-before: page; page-break-before: always; }
    .frontmatter { break-before: page; page-break-before: always; }
    .cover { position: relative; min-height: 245mm; margin: -25mm -17mm -20mm; padding: 22mm 18mm 18mm; overflow: hidden; background: var(--navy); color: white; }
    .institutional-signature { position: relative; z-index: 2; display: grid; width: 112mm; color: white; }
    .institutional-signature span { font-size: 10pt; text-transform: uppercase; letter-spacing: 0.12em; }
    .institutional-signature strong { margin: 1mm 0 0; font-size: 24pt; line-height: 1; }
    .institutional-signature small { margin-top: 1.5mm; font-size: 9.5pt; line-height: 1.25; }
    .cover-route { position: absolute; z-index: 0; top: 0; right: -38mm; width: 125mm; height: 245mm; border-radius: 58% 0 0 58%; background: linear-gradient(112deg, var(--green) 0 24%, #f5f7f3 24% 29%, #62717a 29% 72%, var(--gold) 72% 76%, #62717a 76% 100%); transform: rotate(8deg); opacity: 0.96; }
    .cover-route i { position: absolute; left: 58%; top: 0; width: 3px; height: 100%; background: repeating-linear-gradient(to bottom, var(--gold) 0 18mm, transparent 18mm 29mm); transform: rotate(-4deg); }
    .cover > h1 { position: relative; z-index: 2; width: 116mm; margin: 55mm 0 5mm; font-size: 34pt; line-height: 1.04; color: white; letter-spacing: -0.02em; }
    .cover > p:first-of-type { position: relative; z-index: 2; width: 108mm; margin: 0; font-size: 14pt; line-height: 1.35; color: #e8f0f6; }
    .cover .product-name { position: absolute; z-index: 2; left: 18mm; bottom: 20mm; width: 110mm; margin: 0; padding-top: 4mm; border-top: 1.5mm solid var(--gold); font-size: 12pt; font-weight: 600; color: white; }
    .cover > h2, .cover > h2 ~ * { display: none; }
    h1, h2, h3, h4 { color: var(--navy); line-height: 1.18; break-after: avoid; }
    h1 { margin: 0 0 8mm; padding-bottom: 3mm; border-bottom: 1.2mm solid var(--blue); font-size: 24pt; }
    h2 { margin-top: 8mm; padding-bottom: 2mm; border-bottom: 0.5mm solid var(--blue); font-size: 17pt; }
    h3 { margin-top: 6mm; font-size: 13pt; color: var(--blue); }
    h4 { color: var(--blue); }
    p, li { orphans: 3; widows: 3; }
    strong { color: var(--navy); }
    a { color: #155f9a; text-decoration: none; }
    ol { padding-left: 7mm; }
    ol > li { padding-left: 1.5mm; }
    ol > li::marker { color: var(--blue); font-weight: 700; }
    ul > li::marker { color: var(--gold); }
    blockquote { margin: 5mm 0; padding: 3mm 4mm; border-left: 1.2mm solid var(--blue); background: var(--blue-light); break-inside: avoid; }
    blockquote > :first-child { margin-top: 0; }
    blockquote > :last-child { margin-bottom: 0; }
    .callout.attention { border-color: var(--gold); background: var(--gold-light); }
    .callout.tip { border-color: var(--green); background: var(--green-light); }
    .callout.location { border-color: #2b9bb3; background: #e9f7fa; }
    .callout.traceability { border-color: #5968b0; background: #eef0fb; }
    .callout.automation { border-color: var(--blue); background: var(--blue-light); }
    .callout.information { border-color: var(--purple); background: #f2eefb; }
    code { padding: 0.2em 0.35em; border-radius: 3px; background: #edf2f6; font-family: Consolas, monospace; font-size: 0.9em; }
    pre { overflow-wrap: anywhere; white-space: pre-wrap; break-inside: avoid; padding: 4mm; border-left: 1mm solid var(--blue); background: #edf2f6; }
    pre code { padding: 0; }
    table { width: 100%; margin: 5mm 0; border-collapse: collapse; border-top: 1mm solid var(--blue); font-size: 9pt; }
    th, td { padding: 2.2mm; border: 1px solid var(--line); text-align: left; vertical-align: top; }
    th { background: var(--navy); color: white; font-weight: 600; }
    tbody tr:nth-child(even) { background: #f5f8fa; }
    tr { break-inside: avoid; }
    img { display: block; max-width: 100%; max-height: 220mm; margin: 5mm auto; object-fit: contain; break-inside: avoid; }
    hr { margin: 8mm 0; border: 0; border-top: 0.5mm solid var(--blue); }
  </style>
</head>
<body>${styledBody}</body>
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
      headerTemplate: `<div style="box-sizing:border-box;width:100%;margin:0 17mm;padding:0 0 2.5mm;border-bottom:1px solid #2f6f9f;font:8px Calibri,Arial,sans-serif;color:#0b2e4f;display:flex;justify-content:space-between;align-items:flex-end">
        <span><b>TEAT</b> — Talonário Eletrônico do Agente de Trânsito</span>
        <span style="color:#536273">Manual do Usuário</span>
      </div>`,
      footerTemplate: `<div style="box-sizing:border-box;width:100%;margin:0 17mm;padding-top:2mm;border-top:3px solid #0b2e4f;font:8px Calibri,Arial,sans-serif;color:#536273;display:flex;justify-content:space-between">
        <span><i style="display:inline-block;width:18px;height:3px;background:#d49b00;margin-right:4px"></i><i style="display:inline-block;width:7px;height:3px;background:#2f7d4a"></i></span>
        <span>Talonário Eletrônico do Agente de Trânsito</span>
        <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
      </div>`,
      margin: { top: '25mm', right: '17mm', bottom: '20mm', left: '17mm' },
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
