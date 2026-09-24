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
const brandDir = path.join(projectDir, 'docs', 'identidade-visual-detran-AM');
const brandLogoFile = path.join(brandDir, 'logo.jpeg');
const brandIconFile = path.join(brandDir, 'icone.jpeg');

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

function extractChapters(summary) {
  const summarySection = summary.match(/## Sumário\s+([\s\S]*?)(?=\n## |$)/i);
  if (!summarySection) throw new Error('A seção "Sumário" não foi encontrada em manual-usuario/index.md.');

  const chapters = [];
  let parentNumber = null;
  let childNumber = 0;
  const summaryItem = /^(\s*)(?:\d+\.|-)\s+\[[^\]]+\]\(([^)#]+\.md)(?:#[^)]+)?\)/gim;

  for (const match of summarySection[1].matchAll(summaryItem)) {
    const relativeFile = path.posix.normalize(match[2]);
    if (chapters.some((chapter) => chapter.relativeFile === relativeFile)) continue;

    if (match[1].length === 0) {
      parentNumber = chapters.filter((chapter) => !chapter.number.includes('.')).length + 1;
      childNumber = 0;
      chapters.push({ relativeFile, number: String(parentNumber) });
    } else {
      if (parentNumber === null) throw new Error('O sumário contém um subitem sem capítulo pai.');
      childNumber += 1;
      chapters.push({ relativeFile, number: `${parentNumber}.${childNumber}` });
    }
  }

  if (chapters.length === 0) throw new Error('O sumário não contém links para capítulos Markdown.');
  return chapters;
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

    const level = Number(tokens[index].tag.slice(1));
    if (environment.sectionNumber && (level === 1 || environment.numberSubheadings)) {
      if (level === 1) {
        environment.headingNumbers = [environment.sectionNumber];
      } else {
        const indexAtLevel = level - 1;
        environment.headingNumbers[indexAtLevel] = (environment.headingNumbers[indexAtLevel] || 0) + 1;
        environment.headingNumbers.length = level;
      }
      tokens[index].attrJoin('class', 'numbered-heading');
      tokens[index].attrSet('data-section-number', environment.headingNumbers.join('.'));
    }
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
  const chapters = extractChapters(summary);
  const chapterFiles = chapters.map((chapter) => chapter.relativeFile);
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

  for (const { relativeFile, number } of chapters) {
    const absoluteFile = path.resolve(manualDir, relativeFile);
    const relativeCheck = path.relative(manualDir, absoluteFile);
    if (relativeCheck.startsWith('..') || path.isAbsolute(relativeCheck)) {
      throw new Error(`Capítulo fora da pasta do manual: ${relativeFile}`);
    }
    documents.push({
      relativeFile,
      sectionNumber: number,
      numberSubheadings: !chapters.some((chapter) => chapter.number.startsWith(`${number}.`)),
      content: stripFrontMatter(await fs.readFile(absoluteFile, 'utf8')),
    });
  }

  return documents.map((document) => {
    const absoluteFile = path.resolve(manualDir, document.relativeFile);
    const environment = {
      absoluteFile,
      documentId: document.documentId || documentId(document.relativeFile),
      headingCounts: new Map(),
      headingNumbers: [],
      sectionNumber: document.sectionNumber,
      numberSubheadings: document.numberSubheadings,
    };
    const classes = document.cover
      ? 'document cover'
      : `document ${document.frontmatter ? 'frontmatter' : 'chapter'}`;
    return `<section class="${classes}" id="${environment.documentId}">${markdown.render(document.content, environment)}</section>`;
  }).join('\n');
}

function buildHtml(body) {
  const brandLogo = imageDataUrl(brandLogoFile);
  const brandIcon = imageDataUrl(brandIconFile);
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
        <div class="brand-logo-crop"><img src="${brandLogo}" alt="DETRAN-AM — Departamento Estadual de Trânsito do Amazonas"></div>
      </div>
      <div class="cover-emblem" aria-hidden="true"><img src="${brandIcon}" alt=""></div>
      <div class="cover-accent" aria-hidden="true"></div>`);

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Manual do Usuário — TEAT</title>
  <style>
    :root {
      --navy: #061f55;
      --blue: #16477f;
      --blue-light: #edf3f8;
      --orange: #f58220;
      --orange-dark: #c95d00;
      --orange-light: #fff1e5;
      --green: #2f7d4a;
      --green-light: #eaf5ec;
      --purple: #6750a4;
      --ink: #17283a;
      --muted: #526174;
      --line: #bdc9d8;
      --paper: #ffffff;
    }
    @page { size: A4; margin: 25mm 17mm 20mm; }
    * { box-sizing: border-box; }
    html { font: 10.5pt/1.48 Calibri, Carlito, Arial, sans-serif; color: var(--ink); }
    body { margin: 0; background: var(--paper); }
    .chapter { break-before: page; page-break-before: always; }
    .frontmatter { break-before: page; page-break-before: always; }
    .cover { position: relative; min-height: 245mm; margin: -25mm -17mm -20mm; padding: 18mm; overflow: hidden; background: linear-gradient(165deg, white 0 40%, var(--navy) 40.2% 100%); color: white; }
    .institutional-signature { position: relative; z-index: 3; display: grid; width: 112mm; color: var(--navy); }
    .brand-logo-crop { position: relative; width: 112mm; height: 45mm; overflow: hidden; }
    .brand-logo-crop img { position: absolute; top: -35mm; left: 0; width: 112mm; max-height: none; margin: 0; }
    .institutional-signature span { margin-bottom: 2mm; font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em; }
    .cover-emblem { position: absolute; z-index: 1; right: -10mm; bottom: -5mm; width: 105mm; height: 116mm; opacity: 0.38; mix-blend-mode: multiply; }
    .cover-emblem img { width: 100%; max-height: none; margin: 0; }
    .cover-accent { position: absolute; z-index: 2; top: 80mm; left: 0; width: 100%; height: 3.5mm; background: var(--orange); transform: skewY(-2deg); transform-origin: left; }
    .cover > h1 { position: relative; z-index: 2; width: 132mm; margin: 55mm 0 5mm; padding: 0; border: 0; font-size: 34pt; line-height: 1.04; color: white; letter-spacing: -0.02em; }
    .cover > p:first-of-type { position: relative; z-index: 2; width: 118mm; margin: 0; font-size: 14pt; line-height: 1.35; color: #edf3fa; }
    .cover strong { color: white; }
    .cover > h2, .cover > h2 ~ * { display: none; }
    h1, h2, h3, h4 { color: var(--navy); line-height: 1.18; break-after: avoid; }
    h1 { margin: 0 0 8mm; padding-bottom: 3mm; border-bottom: 1.2mm solid var(--blue); font-size: 24pt; }
    h2 { margin-top: 8mm; padding-bottom: 2mm; border-bottom: 0.5mm solid var(--blue); font-size: 17pt; }
    h3 { margin-top: 6mm; font-size: 13pt; color: var(--blue); }
    h4 { color: var(--blue); }
    .numbered-heading::before { content: attr(data-section-number) " "; color: var(--orange-dark); font-weight: 700; }
    p, li { orphans: 3; widows: 3; }
    strong { color: var(--navy); }
    a { color: #155f9a; text-decoration: none; }
    ol { padding-left: 7mm; }
    ol > li { padding-left: 1.5mm; }
    ol > li::marker { color: var(--blue); font-weight: 700; }
    ul > li::marker { color: var(--orange); }
    .frontmatter > ol { padding-left: 0; counter-reset: summary-item; }
    .frontmatter ol { list-style: none; }
    .frontmatter ol > li { position: relative; padding-left: 10mm; counter-increment: summary-item; }
    .frontmatter ol > li::before { position: absolute; left: 0; width: 9mm; content: counters(summary-item, ".") "."; color: var(--orange-dark); font-weight: 700; }
    .frontmatter ol ol { margin-top: 1.2mm; padding-left: 0; counter-reset: summary-item; }
    blockquote { margin: 5mm 0; padding: 3mm 4mm; border-left: 1.2mm solid var(--blue); background: var(--blue-light); break-inside: avoid; }
    blockquote > :first-child { margin-top: 0; }
    blockquote > :last-child { margin-bottom: 0; }
    .callout.attention { border-color: var(--orange); background: var(--orange-light); }
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
  const disableSandbox = process.getuid?.() === 0
    || process.env.PUPPETEER_NO_SANDBOX === 'true';

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: disableSandbox ? ['--no-sandbox'] : [],
    });
  } catch (error) {
    if (/No usable sandbox/i.test(error.message)) {
      throw new Error(
        `o Chromium não encontrou uma sandbox utilizável. Configure a sandbox do ambiente `
        + `ou, somente para conteúdo confiável, defina PUPPETEER_NO_SANDBOX=true. `
        + `Detalhe: ${error.message}`,
      );
    }
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
      headerTemplate: `<div style="box-sizing:border-box;width:100%;margin:0 17mm;padding:0 0 2.5mm;border-bottom:2px solid #f58220;font:8px Calibri,Arial,sans-serif;color:#061f55;display:flex;justify-content:space-between;align-items:flex-end">
        <span><b>DETRAN-AM</b> — Departamento Estadual de Trânsito do Amazonas | TEAT</span>
        <span style="color:#536273">Manual do Usuário</span>
      </div>`,
      footerTemplate: `<div style="box-sizing:border-box;width:100%;margin:0 17mm;padding-top:2mm;border-top:3px solid #061f55;font:8px Calibri,Arial,sans-serif;color:#536273;display:flex;justify-content:space-between">
        <span><i style="display:inline-block;width:18px;height:3px;background:#f58220;margin-right:4px"></i><i style="display:inline-block;width:7px;height:3px;background:#16477f"></i></span>
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

if (require.main === module) {
  main().catch((error) => {
    console.error(`Erro ao gerar o PDF: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { buildHtml, extractChapters, readDocuments };
