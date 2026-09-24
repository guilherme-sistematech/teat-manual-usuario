# Manual do Usuário — TEAT

Este repositório mantém o Manual do Usuário do Talonário Eletrônico do Agente de Trânsito (TEAT), as referências usadas em sua elaboração e a automação para publicação web e geração do PDF.

## Estrutura do repositório

| Caminho | Finalidade |
|---|---|
| `manual-usuario/` | Fonte publicável do manual e configuração do GitHub Pages |
| `manual-usuario/index.md` | Entrada e sumário canônicos usados pelo site e pelo PDF |
| `manual-usuario/fluxos/` | Procedimentos organizados por fluxo de trabalho |
| `manual-usuario/assets/` | Diagramas e imagens incorporados ao manual |
| `docs/` | Relatórios, evidências e controles editoriais internos |
| `scripts/` | Automação para geração de artefatos |
| `dist/` | Saída local gerada; não versionada |

Consulte também o [índice da documentação interna](docs/README.md) e as [pendências de validação](docs/editorial/pendencias-de-validacao.md).

## Requisitos

- Node.js 22.12.0 ou mais recente; a versão principal recomendada está em `.nvmrc`;
- npm 11.17.0;
- dependências de sistema exigidas pelo Chromium usado pelo Puppeteer.

Com `nvm`, prepare o ambiente com:

```bash
nvm use
npm ci
```

## Gerar o PDF

```bash
npm run pdf
```

O arquivo será criado em `dist/manual-usuario-teat.pdf`. Para escolher outro destino:

```bash
npm run pdf -- --output dist/outro-nome.pdf
```

## Editar o manual

1. Confirme em `manual-usuario/09-controle-do-documento.md` qual versão da aplicação está documentada.
2. Consulte as evidências e relatórios em `docs/`.
3. Atualize o capítulo correspondente em `manual-usuario/`.
4. Se a ordem ou o conjunto de capítulos mudar, altere somente `manual-usuario/index.md`.
5. Atualize o histórico do documento e as pendências editoriais afetadas.
6. Gere o PDF e confira links, imagens, sumário e quebras de página antes da revisão.

Conteúdo ainda não aprovado deve permanecer em `docs/editorial/`, fora da origem publicada.

## Publicação

O workflow `.github/workflows/pages.yml` publica o conteúdo de `manual-usuario/` no GitHub Pages após alterações na branch `main` ou por acionamento manual.

Antes de integrar uma mudança em `main`, confirme que:

- o conteúdo corresponde à versão declarada da aplicação;
- dados pessoais estão ausentes ou anonimizados;
- links e imagens locais são válidos;
- o PDF é gerado com sucesso;
- alterações funcionais e editoriais receberam a revisão adequada;
- nenhuma pendência crítica está sendo apresentada como comportamento homologado.

## Artefatos e evidências

Diretórios datados dentro de `docs/` são snapshots. Preserve a data, a versão e a origem do lote; para representar outra versão da aplicação, crie um novo snapshot em vez de substituir silenciosamente os arquivos existentes.

Não adicione artefatos gerados em `dist/` ao Git. A política definitiva para armazenamento dos conjuntos pesados de imagens e PDFs será tratada separadamente.
