#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { projectDir, writeSignature } = require('./fontes-pdf');

const packageFile = path.join(projectDir, 'package.json');
const packageLockFile = path.join(projectDir, 'package-lock.json');
const controlFile = path.join(projectDir, 'manual-usuario', '09-controle-do-documento.md');
const semanticVersion = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function nextVersion(current, requested) {
  if (semanticVersion.test(requested)) return requested;
  if (!['patch', 'minor', 'major'].includes(requested)) {
    throw new Error('informe patch, minor, major ou uma versão X.Y.Z');
  }

  let [major, minor, patch] = current.split('.').map(Number);
  if (requested === 'major') [major, minor, patch] = [major + 1, 0, 0];
  if (requested === 'minor') [minor, patch] = [minor + 1, 0];
  if (requested === 'patch') patch += 1;
  return `${major}.${minor}.${patch}`;
}

function today() {
  const parts = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.day}/${value.month}/${value.year}`;
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function main() {
  const requested = process.argv[2];
  const description = process.argv.slice(3).join(' ').trim();
  if (!requested || !description) {
    throw new Error('uso: npm run release:prepare -- patch|minor|major "Descrição da versão"');
  }

  const packageData = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  const packageLock = JSON.parse(fs.readFileSync(packageLockFile, 'utf8'));
  const version = nextVersion(packageData.version, requested);
  if (version === packageData.version) throw new Error('a nova versão deve ser diferente da atual');

  packageData.version = version;
  packageLock.version = version;
  packageLock.packages[''].version = version;
  writeJson(packageFile, packageData);
  writeJson(packageLockFile, packageLock);

  let control = fs.readFileSync(controlFile, 'utf8');
  control = control.replace(
    /^\| Versão do manual \| .* \|$/m,
    `| Versão do manual | ${version} |`,
  );
  control = control.replace(
    /^\| Data da atualização \| .* \|$/m,
    `| Data da atualização | ${today()} |`,
  );

  const historyHeader = '|---|---|---|---|\n';
  if (!control.includes(historyHeader)) throw new Error('tabela de histórico não encontrada');
  control = control.replace(
    historyHeader,
    `${historyHeader}| ${version} | ${today()} | ${description.replaceAll('|', '\\|')} | Equipe do projeto |\n`,
  );
  fs.writeFileSync(controlFile, control);

  const pdf = spawnSync(process.execPath, [path.join(projectDir, 'scripts', 'gerar-pdf.js')], {
    cwd: projectDir,
    stdio: 'inherit',
  });
  if (pdf.status !== 0) throw new Error('a geração do PDF falhou');

  writeSignature();
  console.log(`Release v${version} preparada. Revise os arquivos e faça o commit.`);
}

try {
  main();
} catch (error) {
  console.error(`Erro ao preparar release: ${error.message}`);
  process.exitCode = 1;
}
