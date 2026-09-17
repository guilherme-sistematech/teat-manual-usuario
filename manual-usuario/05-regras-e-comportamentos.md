# Regras e comportamentos importantes

## Validações do sistema

Antes da finalização, o TEAT verifica os dados obrigatórios e as condições do fluxo. Entre as validações mais importantes estão:

- aparelho aprovado e sessão exclusiva ativa;
- operação vigente e contexto operacional completo;
- faixa de numeração disponível para AIT;
- catálogo normativo válido;
- identificação e enquadramento compatíveis;
- justificativas obrigatórias para consulta manual, ausência de prontuário, recusa ou impossibilidade;
- ciência registrada por uma única opção;
- limites de veículos, testemunhas, fotos e arquivos;
- gates legais das medidas administrativas;
- comunicação de bodycam quando exigida pela política.

Alertas informativos podem permitir continuidade. Alertas impeditivos devem ser resolvidos antes da confirmação final.

## Restrições

- A classificação “sem abordagem” decorre do enquadramento e do MBFT; não é selecionada livremente.
- OCR não preenche o ato sem confirmação humana.
- O agente de campo não aplica `device-wins` ou `server-wins`; ele encaminha o conflito.
- Um AIT formal não pode ser sobrescrito genericamente em conflito.
- O modo economia limita novas fotos a três.
- O sinistro admite até seis veículos e quatro testemunhas.
- Um aparelho em `pending_activation` não abre turno nem recebe numeração.
- A operação deve ser escolhida antes dos demais elementos do contexto.
- Em modo API, não há fallback para catálogos demonstrativos.

## Casos duplicados

A sincronização é idempotente: repetir uma tentativa de envio não deve criar um segundo ato formal. Quando o sistema identifica indícios de processamento concorrente, o item pode receber o estado `concurrency-suspect` para análise.

Se parecer haver duplicidade:

1. não crie outro ato para substituir o primeiro;
2. abra a fila de sincronização;
3. confira identificador, número, estado e horário;
4. tente o reenvio somente quando a interface permitir;
5. encaminhe conflito ou suspeita à supervisão;
6. inclua o diagnóstico ao solicitar suporte.

## Alterações após assinatura ou finalização

A assinatura é parte da ciência, mas a imutabilidade jurídica é aplicada na finalização. Quando um AIT é finalizado:

- o número reservado é consumido;
- o conteúdo é congelado;
- um hash é gerado;
- o item entra na fila de sincronização.

Correções e decisões posteriores são registradas em trilha auditável. O pedido de cancelamento depende de análise da Diretoria e não apaga imediatamente o AIT.

Uma assinatura coletada em caso de AIT apenas guardado não é preservada após a retomada e precisa ser realizada novamente.

## Campos condicionais

Alguns campos surgem somente conforme escolhas e políticas anteriores, por exemplo:

- dados de medição quando o teste de alcoolemia foi realizado;
- justificativa quando houve recusa, impossibilidade ou preenchimento manual;
- etapa de vítimas quando o sinistro possui vítimas;
- pátio, guincho, prazo e recusa em remoção;
- comunicação de falha quando a operação exige bodycam;
- medidas sugeridas de acordo com o enquadramento;
- dados de carga, peso ou dimensão conforme o tipo de fiscalização.

Revise a tela após cada seleção para identificar novos campos obrigatórios.

## Comportamento offline e online

O TEAT é offline-first. Atos podem ser registrados localmente e enviados quando a rede estiver disponível. A falta de rede é uma condição operacional; o estado formal do registro continua sendo exibido na fila.

O ciclo normal de sincronização usa `pending`, `sent`, `received` e `applied`. Itens que exigem ação podem aparecer como `conflict`, `rejected` ou `concurrency-suspect`.

Regras importantes:

- finalizar localmente não significa que a central já aplicou o registro;
- consulte a fila para confirmar o estado;
- mídias podem ser processadas separadamente e entrar em quarentena;
- não apague nem refaça um ato apenas porque ele ainda não foi aplicado;
- consultas externas podem falhar offline; use preenchimento manual somente quando permitido e justifique;
- o pacote operacional offline deve ser verificado antes do uso;
- atualizações OTA dependem de canal, assinatura e runtime compatíveis.

