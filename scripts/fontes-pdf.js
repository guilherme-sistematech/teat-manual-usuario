'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const projectDir = path.resolve(__dirname, '..');
const signatureFile = path.join(projectDir, 'dist', 'manual-usuario-teat.sources.sha256');

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const absolute = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(absolute) : [absolute];
    });
}

function sourceFiles() {
  return [
    ...listFiles(path.join(projectDir, 'manual-usuario')),
    ...listFiles(path.join(projectDir, 'docs', 'identidade-visual-detran-AM')),
    path.join(projectDir, 'scripts', 'gerar-pdf.js'),
    path.join(projectDir, 'scripts', 'fontes-pdf.js'),
    path.join(projectDir, 'package-lock.json'),
  ].sort((left, right) => left.localeCompare(right));
}

function sourceDigest() {
  const hash = crypto.createHash('sha256');

  for (const absoluteFile of sourceFiles()) {
    const relativeFile = path.relative(projectDir, absoluteFile).split(path.sep).join('/');
    hash.update(relativeFile);
    hash.update('\0');
    hash.update(fs.readFileSync(absoluteFile));
    hash.update('\0');
  }

  return hash.digest('hex');
}

function signatureContents() {
  return `${sourceDigest()}  fontes-do-pdf\n`;
}

function writeSignature() {
  fs.mkdirSync(path.dirname(signatureFile), { recursive: true });
  fs.writeFileSync(signatureFile, signatureContents());
}

module.exports = {
  projectDir,
  signatureContents,
  signatureFile,
  sourceDigest,
  writeSignature,
};
