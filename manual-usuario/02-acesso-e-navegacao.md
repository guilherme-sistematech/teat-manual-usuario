# Acesso e navegação

## Login

1. Abra o TEAT.
2. Informe usuário e senha.
3. Se o ambiente solicitar MFA, informe o código TOTP associado à sua conta.
4. Aguarde a validação das credenciais e do aparelho.

Em `staging` e produção, o MFA é um desafio condicional. O código fixo e o bloqueio após três erros são comportamentos do `local-sandbox` e não devem ser considerados regra dos ambientes integrados.

### Ativação de aparelho novo

Um aparelho ainda não autorizado é apresentado à retaguarda e permanece como `pending_activation` até aprovação humana. Enquanto estiver pendente, ele não pode abrir turno nem receber faixa de numeração.

Quando não houver conectividade para provisionamento, use a função de **Importação de pacote operacional offline**, se disponibilizada pelo órgão. O pacote deve passar pela verificação do aplicativo.

### Sessão exclusiva e troca de aparelho

A sessão operacional é exclusiva por aparelho. Se o aparelho anterior foi perdido, roubado ou avariado, registre a declaração correspondente, informando motivo, patrimônio ou número de série, descrição e declaração de responsabilidade.

Depois de uma troca autorizada, o encerramento do turno pode consolidar atos produzidos em mais de um aparelho.

## Logout

O encerramento normal da sessão ocorre ao concluir o turno. Antes de sair:

1. confira os atos registrados e as pendências;
2. revise a fila de sincronização;
3. comunique falha de bodycam quando exigido;
4. confira a liquidação da faixa de numeração;
5. confirme o encerramento do turno.

Após a confirmação, a sessão exclusiva é encerrada e o aplicativo retorna ao login.

## Tela inicial e menus

A tela inicial apresenta, conforme a configuração da operação:

- identificação do agente;
- órgão, unidade, equipe, viatura e operação;
- faixa de AIT disponível;
- rascunhos ou casos guardados;
- itens e mídias pendentes de sincronização;
- quantidade de evidências;
- rede e bateria;
- situação da bodycam;
- disponibilidade da impressora e do etilômetro;
- comunicados operacionais.

A navegação principal oferece acesso a **Início**, **Novo AIT**, **Medidas**, **Sinistro**, **Autos lavrados** e **Sincronização**. Outras funções ficam disponíveis nos menus de consultas, suporte, diagnóstico, mensagens, ajuda normativa e configurações.

[PLACEHOLDER — Imagem: Tela inicial / navegação principal]

## Preparação do contexto operacional

Antes de praticar atos de campo:

1. selecione a operação;
2. confira situação e vigência;
3. selecione a unidade;
4. selecione a equipe;
5. informe a viatura ou a opção sem viatura;
6. confirme a sessão exclusiva;
7. reserve a faixa de AIT;
8. abra o turno.

A operação deve ser escolhida primeiro, pois determina vigência, composição, equipamentos e política de numeração. No modo API, os catálogos são fornecidos pelo bootstrap autenticado e não há fallback para listas demonstrativas.

## Principais elementos da interface

- **Indicadores de estado:** mostram rede, bateria, sincronização e periféricos.
- **Alertas e validações:** informam dados ausentes, inconsistências ou ações obrigatórias.
- **Assistentes por etapas:** organizam fluxos extensos, como AIT e sinistro.
- **Revisão:** consolida os dados antes da finalização.
- **Confirmação prolongada:** protege ações que tornam o registro formal e imutável.
- **Fila de sincronização:** informa o estágio de envio e aplicação de cada registro.
- **Ajuda contextual:** disponibiliza consulta normativa durante os fluxos.

