#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {
  projectDir,
  signatureContents,
  signatureFile,
} = require('./fontes-pdf');

const packageFile = path.join(projectDir, 'package.json');
const packageLockFile = path.join(projectDir, 'package-lock.json');
const controlFile = path.join(projectDir, 'manual-usuario', '09-controle-do-documento.md');
const pdfFile = path.join(projectDir, 'dist', 'manual-usuario-teat.pdf');
const semanticVersion = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

const packageData = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
const packageLock = JSON.parse(fs.readFileSync(packageLockFile, 'utf8'));
const control = fs.readFileSync(controlFile, 'utf8');
const errors = [];

if (!semanticVersion.test(packageData.version || '')) {
  errors.push(`versão inválida no package.json: ${packageData.version || '(ausente)'}`);
}

if (packageLock.version !== packageData.version
  || packageLock.packages?.['']?.version !== packageData.version) {
  errors.push('package-lock.json não está sincronizado com package.json');
}

if (!control.includes(`| Versão do manual | ${packageData.version} |`)) {
  errors.push('controle do documento não contém a versão atual do package.json');
}

if (!control.includes(`| ${packageData.version} |`)) {
  errors.push('histórico do documento não contém uma entrada para a versão atual');
}

if (!fs.existsSync(pdfFile) || !fs.readFileSync(pdfFile).subarray(0, 5).equals(Buffer.from('%PDF-'))) {
  errors.push('dist/manual-usuario-teat.pdf está ausente ou não é um PDF válido');
}

if (!fs.existsSync(signatureFile)
  || fs.readFileSync(signatureFile, 'utf8') !== signatureContents()) {
  errors.push('a assinatura das fontes está ausente ou desatualizada');
}

if (errors.length > 0) {
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Release v${packageData.version} consistente.`);
}
