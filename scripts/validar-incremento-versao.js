#!/usr/bin/env node

'use strict';

const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { projectDir } = require('./fontes-pdf');

const baseRevision = process.argv[2];
if (!baseRevision) {
  console.error('Uso: node scripts/validar-incremento-versao.js <revisão-base>');
  process.exit(1);
}

const relevantPaths = [
  'manual-usuario',
  'scripts/gerar-pdf.js',
  'package-lock.json',
];
const diff = spawnSync(
  'git',
  ['diff', '--quiet', baseRevision, 'HEAD', '--', ...relevantPaths],
  { cwd: projectDir },
);

if (diff.status === 0) {
  console.log('Nenhuma fonte publicável foi alterada; incremento de versão dispensado.');
  process.exit(0);
}
if (diff.status !== 1) {
  console.error('Não foi possível comparar a revisão base com o conteúdo atual.');
  process.exit(1);
}

function parse(version) {
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    throw new Error(`versão SemVer inválida: ${version}`);
  }
  return version.split('.').map(Number);
}

function isGreater(current, previous) {
  for (let index = 0; index < 3; index += 1) {
    if (current[index] > previous[index]) return true;
    if (current[index] < previous[index]) return false;
  }
  return false;
}

try {
  const currentPackage = JSON.parse(
    fs.readFileSync(path.join(projectDir, 'package.json'), 'utf8'),
  );
  const basePackage = JSON.parse(
    execFileSync('git', ['show', `${baseRevision}:package.json`], {
      cwd: projectDir,
      encoding: 'utf8',
    }),
  );

  const baseVersion = basePackage.version || '0.0.0';
  if (!isGreater(parse(currentPackage.version), parse(baseVersion))) {
    throw new Error(
      `fontes publicáveis mudaram, mas a versão ${currentPackage.version} `
      + `não é superior a ${baseVersion}`,
    );
  }

  console.log(`Versão incrementada: ${baseVersion} → ${currentPackage.version}.`);
} catch (error) {
  console.error(`Erro de versão: ${error.message}`);
  process.exitCode = 1;
}
