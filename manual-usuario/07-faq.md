# FAQ

## O TEAT funciona sem internet?

Sim. O desenho é offline-first e permite registrar atos localmente. Consultas externas, envio à central e algumas atualizações dependem de conectividade. Verifique posteriormente se o registro chegou ao estado `applied`.

## Um AIT finalizado pode ser editado?

Não silenciosamente. A finalização consome o número, congela o conteúdo, gera hash e cria o item de sincronização. Correções, decisões posteriores e cancelamento seguem fluxos auditáveis.

## Solicitar cancelamento remove o AIT imediatamente?

Não. A solicitação é enviada para análise da Diretoria.

## Posso escolher livremente “sem abordagem”?

Não. Essa classificação é derivada do enquadramento e das regras do MBFT.

## O OCR preenche automaticamente os dados?

Não. Ele apresenta candidatos, e o agente precisa conferir e confirmar.

## Quantas fotos posso anexar ao AIT?

Até cinco no modo padrão. No modo economia, até três novas fotos. Ativar o modo economia não remove fotos que já tenham sido capturadas.

## O que acontece quando guardo um AIT?

Ele permanece como caso, não como AIT jurídico. Ainda não possui número, hash nem item de sincronização. Fotos e assinatura terão de ser coletadas novamente na retomada.

## Posso guardar mais de um caso?

Sim. Identifique cuidadosamente o caso correto ao retomar.

## A divergência de veículo gera um novo ato?

Não. Ela é informativa e pode orientar o preenchimento do fluxo correspondente.

## As consultas provam integração com RENAVAM e RENACH?

Não por si só. As telas estão implementadas, mas a integração precisa de homologação credenciada fora do sandbox.

## O agente pode decidir um conflito escolhendo o dado local ou remoto?

O agente de campo apenas encaminha para análise. `device-wins` e `server-wins` exigem supervisor e precisam estar entre as resoluções autorizadas pela retaguarda.

## Reenviar um item cria outro ato?

O processamento foi projetado para ser idempotente. Em suspeita de duplicidade ou concorrência, não recrie o ato; consulte o estado e encaminhe para análise.

## A bodycam é sempre obrigatória?

Não. A exigência depende da política do órgão, unidade ou operação. A interface informa quando ela não é exigida.

## Vincular bodycam envia o vídeo?

Não necessariamente. Sem integração com o subsistema, o TEAT registra o intervalo e o descritor da cadeia de custódia, mas não copia nem transfere o arquivo.

## Uma falha de bodycam invalida o ato?

Não automaticamente. Quando a bodycam é exigida, a falha deve ser comunicada; a interface direciona o usuário antes do encerramento.

## Posso fechar o turno com itens sem rede?

O fluxo apresenta as pendências e as trata conforme a regra operacional. A falta de rede não deve levar à recriação dos atos. Confirme as orientações do órgão e acompanhe a fila.

## A reimpressão altera o AIT?

Não. Ela utiliza o conteúdo do ato já finalizado.

## O Manual de campo offline substitui o MBFT ou a norma oficial?

Não. Ele é material auxiliar e seu conteúdo ainda está classificado como em revisão.

## Por que minha tela pode ser diferente deste manual?

A instalação pode estar em outro canal ou revisão, e algumas funções dependem de perfil, política e operação. Consulte a versão em **Diagnóstico**.

