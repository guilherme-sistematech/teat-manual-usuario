# Documentação interna e evidências

Este diretório reúne os materiais usados para elaborar e validar o Manual do Usuário do TEAT. Seu conteúdo é interno ao repositório e não integra o site publicado pelo GitHub Pages.

## Conteúdo

### Relatórios e referências

- [Relatório de apresentação da aplicação](RELATORIO-APRESENTACAO-APLICACAO.md)
- [Comparativo entre relatório e aplicação](COMPARATIVO-RELATORIO-VS-TEAT-MOBILE-EXPO.md)
- [Mapa de funcionalidades](MAPADEFUNCIONALIDADES.md)
- [Identidade visual e tom de voz](relatorio-identidade-visual-e-tom-de-voz.md)
- [Plano de aplicação da identidade visual do DETRAN-AM](plano-identidade-visual-detran-am.md)
- `identidade-visual-detran-AM/`: marcas institucionais fornecidas para o Manual do TEAT
- `Manual_DER_v2.pdf`: documento de referência em PDF

### Evidências de 08/09/2026

- [Blueprints e PDF das jornadas](talonario-blueprints-2026-09-08/README.md)
- [Capturas em tema claro](talonario-telas-2026-09-08-claro/README.md)
- [Capturas em tema escuro](talonario-telas-2026-09-08/README.md)

Os diretórios datados representam snapshots. Não substitua arquivos dentro de um snapshot para representar outra versão da aplicação; crie um novo diretório datado e registre a versão e o commit de origem no respectivo `README.md`.

### Material editorial

- [Pendências de validação](editorial/pendencias-de-validacao.md)

O material editorial controla itens que ainda precisam de confirmação. Ele deve permanecer fora de `manual-usuario/` para não ser incluído na publicação.

## Relação com o manual

- `manual-usuario/` contém apenas a fonte publicável.
- `docs/` contém referências, evidências e controles internos.
- `dist/` contém artefatos gerados localmente e não deve ser versionado.

Antes de alterar o manual, confirme se a evidência usada corresponde à versão declarada em `manual-usuario/09-controle-do-documento.md`.
