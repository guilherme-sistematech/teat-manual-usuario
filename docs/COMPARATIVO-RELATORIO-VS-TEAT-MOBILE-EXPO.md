# Comparativo entre o relatório de apresentação e o `teat-mobile-expo`

Data da auditoria: **16/09/2026**.

## Conclusão

O arquivo [`RELATORIO-APRESENTACAO-APLICACAO.md`](RELATORIO-APRESENTACAO-APLICACAO.md) é coerente com o acervo de capturas produzido em **08/09/2026**, mas **não representa integralmente o estado atual da aplicação**.

Há divergências materiais de funcionalidade e maturidade. A principal causa é temporal: depois das capturas, várias rotas que eram shells ou formulários guiados passaram a usar telas próprias com lógica de domínio. Também foram acrescentadas duas telas e novas regras operacionais.

Assim, o relatório pode continuar sendo usado como roteiro histórico das capturas, desde que não seja apresentado como inventário atual do código nem como certificado de homologação das integrações.

## Escopo e fontes examinadas

Foram confrontados:

- o relatório local e o [`MAPADEFUNCIONALIDADES.md`](MAPADEFUNCIONALIDADES.md);
- as 324 imagens do diretório, divididas em 108 claras, 108 escuras e 108 blueprints;
- exclusivamente o aplicativo [`codexmark/teat-mobile-expo`](https://github.com/codexmark/teat-mobile-expo), na ponta atual da branch `main`, commit [`add80bed`](https://github.com/codexmark/teat-mobile-expo/commit/add80bedfa38a07ac9424c03f29218a239cafe21).

Nenhum outro repositório ou aplicativo foi usado na comparação funcional.

## Versão auditada e situação de publicação

O código auditado corresponde à versão mais recente disponível na branch padrão `main` em 16/09/2026:

- commit: [`add80bed`](https://github.com/codexmark/teat-mobile-expo/commit/add80bedfa38a07ac9424c03f29218a239cafe21);
- versão declarada do aplicativo: **0.3.0**;
- runtime Expo: **0.3.0(3)**;
- Android `versionCode`: **3**;
- release mais recente no GitHub: [`v0.3.0`](https://github.com/codexmark/teat-mobile-expo/releases/tag/v0.3.0), sem release semântica posterior.

Há uma diferença entre “código mais recente” e “binário mais recente”. O APK anexado à release foi recompilado a partir do commit `dbaa47d`; a `main` está nove commits à frente. Nesse intervalo não houve alteração de runtime, dependências ou configuração nativa, portanto as mudanças são compatíveis com entrega OTA, mas não estão embutidas no APK-base.

Na consulta aos canais OTA para o runtime `0.3.0(3)`:

- `stage` retornou uma atualização criada em **16/09/2026 às 18:20:34 UTC**, ID `94d537cc-4536-417a-9a83-0730b5b7304b`;
- `homologacao` e `producao` retornaram HTTP 204, isto é, não ofereceram uma atualização OTA para essa consulta.

O manifesto público de `stage` não informa o SHA Git, portanto não é possível vincular criptograficamente esse OTA ao commit `add80bed`, embora sua publicação tenha ocorrido logo após a atualização da `main`. A conclusão segura é: **o repositório foi auditado na versão de código mais recente, mas não é possível afirmar que todos os canais instalados executam essa mesma revisão**.

## Comparação funcional

| Tema | Informado no relatório | O que ocorre no código atual | Avaliação |
|---|---|---|---|
| Acervo local | 324 PNGs, sendo 108 claros, 108 escuros e 108 blueprints | As quantidades foram confirmadas no diretório | Correto para o acervo |
| Natureza das capturas | Sandbox offline, sem comprovar integrações reais | O mapa foi gerado em Moto G20, no perfil `local-sandbox`, em 08/09/2026; o repositório também alerta que os adapters de sandbox não são garantias de produção | Correto |
| Quantidade de rotas/telas | 71 rotas | O registro atual possui **73** entradas: as 71 anteriores mais Manual de campo offline e Importação de pacote operacional offline | Desatualizado |
| Transições | 593 transições | O registro móvel atual continua contendo **593** transições | Correto |
| Status de implementação | 45 implementadas, 22 formulários guiados e 4 somente navegáveis | O teste de consistência atual exige **73 implementadas**, nenhuma `shell-functional` e nenhuma `registered` | Desatualizado |
| Reutilização de telas | 18 rotas reutilizam telas | A própria documentação atual informa que essa contagem veio das capturas antigas e não foi recalculada. Hoje, 73 rotas são resolvidas por 35 componentes/portões; 38 mapeamentos excedentes compartilham componente com outra rota | Desatualizado e com métrica antiga |
| Resultado de veículo, divergência e resultado de condutor | Funcionalidades previstas, ainda shells | `VehicleResultScreen`, `VehicleDivergenceScreen` e `DriverResultScreen` são componentes próprios e possuem testes. A divergência veicular é informativa e não cria um ato autônomo | Divergência funcional |
| Detalhe e conflito de sincronização | Formulários guiados de protótipo | `SyncItemScreen` e `SyncConflictScreen` são telas próprias, com regras de reenvio, permissões e auditoria | Desatualizado |
| Etapas de AIT e sinistro | Parte delas é tratada como formulário guiado/protótipo | As etapas são entradas para `AitFlowScreen` e `CrashFlowScreen`, abertas no passo correspondente e cobertas por regras de domínio | Desatualizado |
| Login e MFA | Sequência fixa login → código de verificação; três erros podem bloquear o aparelho | Em staging/produção, MFA é um desafio TOTP condicional do Cognito, tratado no login. O código fixo e o bloqueio após três tentativas pertencem somente ao `local-sandbox` | Parcialmente correto, mas mistura sandbox e produção |
| Ativação do dispositivo | Menciona sessão exclusiva e incidente do aparelho anterior | Um aparelho novo hoje se apresenta à retaguarda, fica `pending_activation` e depende de aprovação humana. Apresentação não autoriza abertura de turno nem entrega numeração | Omissão de funcionalidade recente |
| Seleção operacional | Operação, unidade, equipe, viatura e faixa de AIT | Em modo API, os catálogos vêm exclusivamente do bootstrap autenticado. Não há fallback para listas demonstrativas. A operação é escolhida antes do restante do contexto e define política de faixa, vigência e composição | Essência correta; faltam gates atuais |
| Forma de constatação do AIT | O agente poderia indicar abordagem, ausência de abordagem, videomonitoramento ou equipamento na identificação do veículo | A classificação “sem abordagem” é derivada do enquadramento e das regras do MBFT; não deve ser uma escolha livre do agente | Divergência de regra de negócio |
| Consulta e preenchimento do veículo | Placa, foto, galeria, OCR offline e confirmação humana | O comportamento existe; o OCR somente propõe candidatos e nunca preenche o ato sem confirmação | Correto, com confirmação obrigatória |
| Evidências do AIT | Até cinco fotos | O limite padrão é cinco, mas o modo economia reduz novas capturas para **três**. Fotos já capturadas não são descartadas ao trocar de modo | Parcialmente correto |
| Guardar caso de AIT | Salvar o caso e atender o próximo veículo | Vários casos podem ser guardados, mas eles não são AITs jurídicos: não possuem número, hash ou item de fila. Fotos e assinatura não são preservadas no caso e precisam ser recapturadas após retomada | Correto na ação, incompleto nas limitações |
| Ciência do infrator | Exatamente uma entre assinatura, recusa e impossibilidade | A implementação mantém controles distintos e mutuamente exclusivos, com justificativas próprias | Correto |
| Finalização do AIT | Consome número, congela conteúdo, gera hash e enfileira sincronização | A regra permanece. Cancelamento posterior é pedido formal; correções e decisões posteriores são auditáveis, não edição silenciosa do auto | Correto, com a ressalva do fluxo formal posterior |
| Medidas administrativas | Lista retenção, remoção, recolhimentos, transbordo, alcoolemia/perícia, animais, exames e inominada | O enum de domínio contém exatamente essas 11 categorias | Correto |
| Remoção e inventário | Fundamentos, espera de reboque, inventário e termo | O fluxo atual adiciona gates legais, pátio/guincho credenciados, prazos e recusas fechadas. Ao guardar caso aguardando reboque, fotos gerais e GPS não sobrevivem a uma retomada após morte do processo | Correto em alto nível, incompleto nas restrições |
| Sinistro | “Dez etapas”, encerrando com vínculos e revisão | O domínio define 11 passos antes do estado final: tipo, local, condições, veículos, pessoas, vítimas, dinâmica, croqui, evidência, vínculos e revisão. Vítimas é condicional; sem vítima, o fluxo efetivo tem dez passos | Contagem imprecisa |
| Limites do sinistro | Até seis veículos | O código limita a seis veículos, cinco fotos de evidência no modo padrão, quatro testemunhas e três fotos/três arquivos de croqui | Correto quanto aos veículos; incompleto nos demais limites |
| Estados de sincronização | Pendente, aguardando rede, enviado, validado e conflito | O vocabulário atual é `pending`, `sent`, `received`, `applied`, `conflict`, `rejected` e `concurrency-suspect`. “Aguardando rede” é condição operacional, não o conjunto completo de estados | Desatualizado |
| Resolução de conflitos | Preservar local, sobrescrever remoto ou encaminhar à supervisão | A retaguarda define `allowedResolutions`. Agente de campo só pode encaminhar para análise; `device-wins` e `server-wins` exigem `field-supervisor`. AIT formal não pode ser sobrescrito genericamente | Incompleto e permissivo demais |
| Bodycam global | Indicador global, falha não bloqueia o ato e pode ser comunicada | A exigência é política do órgão/unidade/operação. Turno dispensado mostra “Bodycam não exigida” e não gera cobrança. Turno exigido sem confirmação cobra comunicação imediata, sem invalidar o ato | Desatualizado quanto à política |
| Vínculo de bodycam ao AIT | É possível vincular trecho da gravação | O app persiste referência de intervalo e cadeia de custódia. Sem integração com o subsistema de bodycam, o hash é apenas selo do descritor e `stateFromDevice` é falso; o arquivo não é copiado nem transferido pelo app | Parcialmente correto; integração física não comprovada |
| Encerramento com falha de bodycam | Não necessariamente bloqueado; omissão fica como pendência | Na UI atual, quando a comunicação é devida, o botão conduz primeiro à comunicação. O domínio não torna o ato inválido nem impede saída definitiva, mas a tela não trata a omissão como simples fechamento normal | Redação desatualizada |
| Consultas nacionais | Telas existem, mas integrações reais não são comprovadas pelas capturas | O código possui cliente e telas reais, porém homologação credenciada com RENAVAM/RENACH continua fora da evidência local/sandbox | Correto quanto à ressalva |
| Impressão | Integrada/Bluetooth, ainda dependente de validação | Existem adapters nativos para equipamento integrado e Bluetooth, duas vias e reimpressão. O teste físico da Leopardo XR continua pendente segundo `PENDING.md` | Correto com ressalva |
| Manuais offline | Disponíveis quando empacotados | Existe tela e conteúdo empacotado, mas o próprio repositório classifica o conteúdo como rascunho pendente de revisão | Parcialmente correto |
| Configurações locais | Padrão, alto contraste e texto ampliado | Além disso, há modo economia com efeito real sobre qualidade/resolução e teto de fotos; não há captura periódica de GPS cuja frequência possa ser reduzida | Incompleto |
| Encerramento do turno | Resumo, pendências e retorno ao login | O fluxo também liquida a numeração (usados, devolvidos e retidos), encerra a sessão exclusiva e pode consolidar atos de mais de um aparelho após handoff | Correto em alto nível, incompleto nas funções recentes |

## Funcionalidades atuais ausentes do relatório

As seguintes capacidades existem no estado atual e deveriam ser incluídas em uma apresentação atualizada:

- apresentação reversa de aparelho novo e aprovação pela retaguarda;
- importação verificada de pacote operacional para provisionamento offline;
- manual de campo offline, ainda como conteúdo em revisão;
- política de bodycam configurável por órgão, unidade e operação;
- tela real de resultado e divergência de veículo e de resultado de condutor;
- telas reais de item e conflito de sincronização;
- rejeição técnica retentável, rejeição de regra e suspeita de concorrência tratadas separadamente;
- quarentena de mídia e cadeia de custódia visível na sincronização;
- consolidação de turno após troca autorizada de aparelho;
- liquidação detalhada da faixa de numeração no encerramento;
- atualização OTA automática na abertura, condicionada a canal, assinatura e runtime compatíveis.

## Pontos do relatório que permanecem válidos

Continuam corretos como descrição de produto:

- arquitetura offline-first;
- necessidade de turno e contexto operacional antes dos atos de campo;
- reserva de numeração e sincronização idempotente;
- AIT, alcoolemia, medidas administrativas e sinistro como atos distintos e auditáveis;
- hash e cadeia de custódia das evidências;
- cancelamento pós-finalização como solicitação, não exclusão imediata;
- funcionamento de OCR como sugestão sujeita à confirmação humana;
- fluxo de consulta com fallback manual justificado;
- limites das capturas de sandbox para provar integrações nacionais e periféricos;
- necessidade de homologação em ambiente integrado e em hardware físico.

## Recomendação de uso

Para uma nova apresentação:

1. Trate o relatório original como **fotografia funcional de 08/09/2026**.
2. Identifique a fonte por versão e commit: `teat-mobile-expo` **0.3.0**, runtime **0.3.0(3)**, commit `add80bed`.
3. Substitua as contagens por **73 telas/rotas, 593 transições e 73 implementadas**, referenciando o commit auditado.
4. Não mostre mais resultado de veículo, divergência, resultado de condutor, item de sincronização e conflito como shells.
5. Diferencie claramente sandbox, staging/produção, integração real e teste físico de hardware.
6. Explique as permissões: o agente encaminha conflitos, mas somente o supervisor decide entre dispositivo e central.
7. Apresente bodycam como política configurável e vínculo por referência; não como prova de integração física completa.
8. Registre as limitações de retomada de casos: fotos do caso de AIT e fotos gerais/GPS do caso de remoção podem exigir recaptura.

## Evidências principais no GitHub

- [`main` no commit `add80bed`](https://github.com/codexmark/teat-mobile-expo/commit/add80bedfa38a07ac9424c03f29218a239cafe21): revisão mais recente utilizada na auditoria.
- [Release `v0.3.0`](https://github.com/codexmark/teat-mobile-expo/releases/tag/v0.3.0): versão publicada mais recente e APK-base.
- [`teat-mobile-expo/app.json`](https://github.com/codexmark/teat-mobile-expo/blob/add80bedfa38a07ac9424c03f29218a239cafe21/app.json): versão 0.3.0 e runtime 0.3.0(3).
- [`mobile-ux-parity.registry.ts`](https://github.com/codexmark/teat-mobile-expo/blob/add80bedfa38a07ac9424c03f29218a239cafe21/src/domain/mobile-ux-parity.registry.ts): catálogo atual de telas e transições.
- [`ux-parity-status.test.ts`](https://github.com/codexmark/teat-mobile-expo/blob/add80bedfa38a07ac9424c03f29218a239cafe21/__tests__/ux-parity-status.test.ts): trava de 73 telas implementadas, sem shells.
- [`screen-registry.tsx`](https://github.com/codexmark/teat-mobile-expo/blob/add80bedfa38a07ac9424c03f29218a239cafe21/src/navigation/screen-registry.tsx): resolução das rotas para componentes reais.
- [`UX-PARITY-DELTAS.md`](https://github.com/codexmark/teat-mobile-expo/blob/add80bedfa38a07ac9424c03f29218a239cafe21/docs/product/UX-PARITY-DELTAS.md): deltas absorvidos desde o mapa original.
- [`PENDING.md`](https://github.com/codexmark/teat-mobile-expo/blob/add80bedfa38a07ac9424c03f29218a239cafe21/PENDING.md): limitações conhecidas e confirmação de que as capturas de 08/09 ficaram desatualizadas.
- [`SyncConflictScreen.tsx`](https://github.com/codexmark/teat-mobile-expo/blob/add80bedfa38a07ac9424c03f29218a239cafe21/src/screens/SyncConflictScreen.tsx): opções permitidas pela retaguarda e gate de supervisor.
- [`bodycam-policy.ts`](https://github.com/codexmark/teat-mobile-expo/blob/add80bedfa38a07ac9424c03f29218a239cafe21/src/domain/bodycam-policy.ts): política de exigência de bodycam por escopo.
- [`crash-flow-steps.ts`](https://github.com/codexmark/teat-mobile-expo/blob/add80bedfa38a07ac9424c03f29218a239cafe21/src/domain/crash-flow-steps.ts): passos atuais e etapa condicional de vítimas.
