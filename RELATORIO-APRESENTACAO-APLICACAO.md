# Relatório de análise e estrutura de apresentação da aplicação

O material representa o **Talonário Eletrônico do Agente de Trânsito**, uma aplicação móvel para atividades de fiscalização em campo.

## 1. O que existe no diretório

O acervo contém:

- 324 imagens PNG:
  - 108 telas em tema claro;
  - 108 telas em tema escuro;
  - 108 versões em formato blueprint.
- Um PDF consolidando as jornadas.
- READMEs com o inventário das capturas.
- Um mapa funcional detalhado com rotas, transições e situação de implementação.

As três coleções de imagens representam as mesmas funcionalidades, não três aplicações diferentes.

A documentação registra:

- 71 rotas;
- 593 transições possíveis;
- 45 rotas implementadas;
- 22 formulários guiados ou protótipos funcionais;
- 4 rotas apenas navegáveis, sem lógica de negócio completa;
- 18 rotas que reutilizam telas de outros fluxos.

As capturas foram geradas em um Moto G20, Android 11, usando um ambiente sandbox offline e dados de demonstração. Portanto, elas comprovam a interface e os fluxos previstos, mas não permitem validar integrações reais com RENAVAM, RENACH, impressoras, bodycams ou servidores.

As principais referências são o [mapa funcional](MAPADEFUNCIONALIDADES.md), o [inventário das telas claras](talonario-telas-2026-09-08-claro/README.md) e o [PDF das jornadas](talonario-blueprints-2026-09-08/Jornadas-do-Talonario-2026-09-08.pdf).

## 2. Explicação resumida da aplicação

A aplicação acompanha o ciclo completo de trabalho de um agente:

```text
Login
  ↓
Verificação em duas etapas
  ↓
Seleção de operação, unidade, equipe e viatura
  ↓
Abertura do turno
  ↓
Fiscalização em campo
  ├─ AIT
  ├─ Alcoolemia
  ├─ Medidas administrativas
  ├─ Sinistros
  ├─ Consultas
  └─ Fiscalizações complementares
  ↓
Armazenamento local e fila de sincronização
  ↓
Envio à central
  ↓
Resumo e encerramento do turno
```

O desenho é **offline-first**: o agente consegue registrar ocorrências localmente e enviá-las quando houver conectividade. A interface mantém indicadores de rede, bateria, impressora, etilômetro, bodycam e sincronização.

## 3. Estrutura recomendada para apresentação ao primeiro usuário

### Parte 1 — Para que serve o Talonário

Apresente a aplicação como a ferramenta utilizada para:

- iniciar e encerrar o turno operacional;
- lavrar Autos de Infração de Trânsito — AIT;
- consultar veículos e condutores;
- registrar procedimentos de alcoolemia;
- aplicar medidas administrativas;
- registrar sinistros;
- coletar fotos, localização e ciência do cidadão;
- acompanhar sincronização e pendências;
- registrar ações de fiscalização mesmo quando não há autuação;
- acessar ajuda normativa e suporte técnico.

### Parte 2 — Primeiro acesso

Explique a sequência:

1. Informar usuário e senha.
2. Confirmar o código de verificação em duas etapas.
3. Caso ocorram muitas tentativas incorretas, o aparelho pode ser bloqueado.
4. A sessão é exclusiva por aparelho.
5. Se o aparelho anterior foi perdido, roubado ou avariado, o agente pode declarar o incidente antes de iniciar a nova sessão.

Na declaração de aparelho anterior, é possível informar:

- avaria, perda, roubo/furto ou outro motivo;
- patrimônio ou número de série;
- descrição do ocorrido;
- declaração de responsabilidade.

### Parte 3 — Preparação e abertura do turno

Antes de realizar atos de campo, o agente deve:

- escolher a operação;
- consultar a situação e vigência da operação;
- selecionar a unidade operacional;
- selecionar a equipe;
- informar a viatura ou trabalhar sem viatura;
- confirmar a sessão exclusiva;
- reservar a faixa de numeração de AIT;
- abrir o turno.

A operação define a unidade responsável, a composição da equipe, os equipamentos e a faixa de numeração disponível.

### Parte 4 — Conhecendo a tela inicial

A tela inicial concentra:

- identificação do agente;
- órgão, unidade, equipe, viatura e operação;
- faixa de números de AIT disponível;
- quantidade de rascunhos;
- itens pendentes de sincronização;
- quantidade de evidências;
- status da rede;
- nível de bateria;
- situação da bodycam;
- disponibilidade da impressora;
- disponibilidade do etilômetro;
- comunicados da operação.

A barra inferior oferece acesso direto a:

- Início;
- novo AIT;
- medidas;
- sinistro;
- autos lavrados;
- sincronização.

## 4. Funcionalidades operacionais

### AIT — Auto de Infração

O agente pode iniciar uma nova autuação e seguir um assistente por etapas.

#### Identificação do veículo

Permite:

- informar a placa;
- indicar abordagem, ausência de abordagem, videomonitoramento ou constatação por equipamento;
- fotografar a placa;
- selecionar uma imagem já existente;
- executar reconhecimento OCR offline;
- confirmar o resultado reconhecido;
- informar marca, modelo e espécie do veículo.

#### Condutor ou infrator

Permite:

- definir o papel da pessoa: condutor, proprietário ou preposto;
- consultar pelo CPF;
- registrar condutor não identificado;
- informar que o condutor não foi localizado na base;
- justificar a ausência do prontuário.

#### Procedimento de alcoolemia

Pode registrar:

- teste realizado no etilômetro;
- recusa do condutor;
- impossibilidade técnica do aparelho;
- indisponibilidade do etilômetro;
- sinais psicomotores;
- resultado da medição;
- encaminhamento;
- termo de alcoolemia;
- AITs e medidas administrativas vinculadas.

#### Enquadramento

O agente pode:

- pesquisar por artigo ou descrição;
- consultar infrações do catálogo normativo;
- visualizar gravidade, pontos e valor;
- selecionar o enquadramento;
- indicar constatação realizada por outro agente;
- informar se houve flagrante.

#### Local e observações

Permite:

- capturar a posição por GPS;
- registrar endereço e coordenadas;
- acrescentar observações;
- revisar alertas e inconsistências.

#### Evidências

Permite:

- capturar até cinco fotos;
- selecionar imagens do aparelho;
- vincular a gravação da bodycam;
- continuar sem foto, registrando uma pendência para a retaguarda.

#### Medidas sugeridas

A partir do enquadramento, a aplicação pode encaminhar o agente para:

- retenção;
- remoção;
- procedimento de alcoolemia;
- outras medidas administrativas relacionadas.

#### Ciência do infrator

O agente deve registrar exatamente uma opção:

- o condutor assinou;
- recusou-se a assinar;
- ficou impossibilitado de assinar.

A ciência pode ocorrer na tela ou na via impressa.

#### Revisão e finalização

Antes de finalizar, a tela apresenta:

- placa;
- forma de constatação;
- condutor;
- enquadramento;
- medida;
- observações;
- localização;
- evidências;
- resultado da ciência;
- validações e alertas.

A finalização exige confirmação prolongada. Depois disso:

- o número reservado é consumido;
- o AIT torna-se imutável;
- é gerado um hash;
- o registro entra na fila de sincronização.

Também existem recursos para:

- salvar o caso e atender o próximo veículo;
- consultar autos lavrados;
- consultar detalhes do turno;
- imprimir ou reimprimir;
- solicitar cancelamento de um auto já finalizado.

O cancelamento pós-finalização é apenas uma solicitação para análise da Diretoria, não um cancelamento imediato pelo agente.

### Medidas administrativas

O agente pode registrar:

- retenção;
- remoção;
- recolhimento de CNH;
- recolhimento de PPD;
- recolhimento de CR;
- recolhimento de CLA/CRLV-e;
- transbordo;
- teste de alcoolemia ou perícia;
- recolhimento de animais;
- exames de aptidão;
- medida inominada.

A origem pode ser:

- um AIT;
- ordem judicial;
- ato administrativo;
- veículo abandonado ou envolvido em sinistro.

#### Retenção

Permite registrar:

- decisão de aplicar ou não a exceção discricionária;
- possibilidade de sanar a irregularidade no local;
- desfecho adotado pelo agente.

#### Remoção

Permite escolher o fundamento, como:

- irregularidade não sanada;
- ausência de condutor habilitado;
- veículo não registrado ou licenciado;
- abandono;
- sinistro;
- ordem judicial;
- ato administrativo;
- necessidade de boa ordem administrativa.

Também há opção de salvar o caso enquanto aguarda o reboque.

#### Inventário

Permite documentar:

- objetos deixados no veículo;
- equipamentos obrigatórios ausentes;
- estado da lataria;
- estado da pintura;
- estado dos pneus;
- condições do veículo no momento da remoção.

#### Transbordo

Permite informar:

- carga transbordada;
- responsável;
- placa do veículo de destino.

#### Termo e finalização

O agente registra:

- assinatura do interessado;
- recusa;
- impossibilidade ou ausência;
- identificação do proprietário ou condutor;
- comunicação ao cidadão.

A medida finalizada recebe hash próprio e entra na fila de sincronização independentemente do AIT.

### Registro de sinistro

O registro de sinistro possui dez etapas:

1. Tipo e gravidade.
2. Localização.
3. Condições da via.
4. Veículos.
5. Pessoas.
6. Vítimas.
7. Dinâmica.
8. Croqui.
9. Evidências.
10. AITs e medidas vinculadas, seguida da revisão.

O agente pode:

- classificar colisão lateral, traseira, atropelamento, queda ou choque com objeto fixo;
- informar se houve danos materiais, feridos ou óbito;
- capturar GPS;
- registrar pavimentação, clima, iluminação e sinalização;
- incluir até seis veículos;
- informar placa, dano e evasão;
- consultar condutores por CPF ou CNH;
- registrar passageiros e testemunhas;
- classificar vítimas como leves, graves ou óbito;
- informar atendimento médico e hospital;
- descrever a dinâmica e uma hipótese preliminar;
- anexar croqui simples, documento ou mapa georreferenciado;
- fotografar o croqui;
- anexar evidências;
- relacionar um AIT e uma medida administrativa.

Os dados de vítimas têm indicação de acesso reforçado por envolverem informações pessoais sensíveis.

Após a revisão, o registro recebe hash, entra na fila de sincronização e fica disponível para alimentação dos sistemas relacionados a acidentes.

### Consultas

A aplicação oferece:

- consulta de veículo pela placa;
- consulta de condutor pelo CPF;
- tratamento de falha, indisponibilidade ou timeout;
- registro de consulta offline;
- preenchimento manual com justificativa;
- identificação de divergência cadastral;
- aproveitamento do resultado em AIT ou sinistro.

Limitação importante: as telas de resultado de veículo, resultado de condutor e divergência estão registradas e navegáveis, mas aparecem no acervo como “implementação pendente”. Assim, a apresentação deve mostrá-las como funcionalidade prevista, não como integração concluída.

### Sincronização

A fila apresenta:

- quantidade de registros pendentes;
- mídias pendentes;
- mídias rejeitadas;
- situação geral da fila;
- botão para sincronização manual.

Os registros podem envolver:

- AIT;
- medida administrativa;
- alcoolemia;
- sinistro;
- evidência.

Os estados previstos incluem pendente, aguardando rede, enviado, validado e conflito.

Nos conflitos, o fluxo prevê:

- preservar o dado local;
- sobrescrever com o dado remoto;
- encaminhar para supervisor ou sistema web.

As telas de detalhe e conflito são formulários guiados de protótipo; a fila principal está implementada.

### Bodycam

O estado da bodycam é exibido de forma global.

Quando não existe confirmação de gravação:

- uma faixa vermelha alerta o usuário;
- o agente pode comunicar imediatamente a falha;
- o ato de campo não é bloqueado;
- a pendência fica registrada para supervisão.

Podem ser comunicados:

- mau funcionamento;
- falha de gravação;
- falha de bateria;
- falha de memória;
- falha de transmissão;
- impossibilidade técnica de uso.

Também é possível vincular o trecho da gravação ao AIT.

### Fiscalizações complementares

#### Abordagem sem autuação

Permite registrar uma interação que não gerou AIT:

- abordagem educativa;
- fiscalização sem infração;
- orientação;
- bloqueio operacional;
- veículo e condutor opcionais;
- resultado como orientado, liberado ou encaminhado.

#### Fiscalização documental

Permite:

- escanear o QR Code do CRLV-e;
- escanear o QR Code da CNH Digital;
- registrar documento regular, ausente ou vencido;
- capturar foto opcional;
- registrar a fiscalização.

#### Fiscalização de carga ou equipamento

Permite:

- selecionar carga, equipamento, transporte especial ou peso/dimensão;
- informar peso e dimensões;
- anexar até três documentos;
- indicar eventual medida administrativa cabível;
- registrar a fiscalização.

#### Ajuda normativa

Disponibiliza:

- busca no MBFT por artigo ou descrição;
- consulta contextual durante os fluxos;
- checklist antes da finalização de um AIT.

### Suporte e diagnóstico

O diagnóstico apresenta:

- versão do aplicativo;
- identificação do dispositivo e do órgão;
- pacote normativo instalado;
- validade do catálogo;
- validação do pacote normativo;
- trilha de auditoria somente para leitura;
- geração de pacote local para suporte.

O pacote de diagnóstico pode ser compartilhado pelo menu nativo do aparelho.

O suporte permite:

- abrir chamado de dúvida;
- comunicar problema técnico;
- enviar sugestão;
- descrever a ocorrência;
- acessar a declaração de aparelho anterior;
- acessar a comunicação de falha da bodycam.

A central de mensagens apresenta avisos sobre:

- pacote normativo;
- sincronização;
- conflitos;
- comunicados da operação.

### Configurações locais

Permite:

- localizar impressoras;
- selecionar uma impressora;
- testar a impressão;
- usar equipamentos integrados ou Bluetooth;
- consultar manuais offline, quando empacotados;
- escolher modo padrão;
- ativar alto contraste;
- ampliar o texto.

## 5. Encerramento do turno

Ao finalizar o serviço, a aplicação apresenta:

- viatura;
- equipe;
- operação;
- horário de início;
- AITs lavrados;
- AITs sincronizados;
- AITs aguardando transmissão;
- faixa de numeração utilizada;
- medidas administrativas;
- sinistros registrados;
- pendências de sincronização;
- situação da bodycam;
- falhas de gravação comunicadas.

O encerramento não é necessariamente bloqueado por falha de bodycam, mas a ausência de comunicação fica registrada como pendência operacional. Após a confirmação, o usuário retorna ao login.

## 6. Roteiro prático para uma demonstração

Uma apresentação inicial pode seguir esta ordem:

1. Explicar o objetivo do Talonário.
2. Mostrar login, MFA e sessão exclusiva por aparelho.
3. Selecionar operação, equipe e viatura.
4. Abrir o turno.
5. Apresentar indicadores da página inicial.
6. Simular um AIT completo.
7. Mostrar o procedimento de alcoolemia.
8. Registrar uma medida administrativa.
9. Demonstrar um sinistro.
10. Mostrar consultas de veículo e condutor.
11. Registrar uma abordagem sem autuação.
12. Exibir fila de sincronização e tratamento de conflitos.
13. Mostrar diagnóstico, mensagens, ajuda e configurações.
14. Encerrar o turno e revisar o resumo.

## 7. Cuidados para a apresentação

É importante não apresentar todas as telas como igualmente concluídas:

- As telas foram capturadas em sandbox, com dados simulados.
- Resultado de veículo, divergência veicular e resultado de condutor ainda aparecem como shells sem lógica completa.
- Algumas telas de detalhe, validação e conflito são formulários guiados de protótipo.
- Diversas rotas de alcoolemia reutilizam o componente do fluxo de AIT e não aparecem como telas independentes completas.
- Impressão, bodycam, etilômetro e consultas nacionais precisam de validação em ambiente integrado.
- O inventário concede acesso tanto a `field-agent` quanto a `field-supervisor`, mas não demonstra funcionalidades exclusivas de supervisão.

Assim, a melhor forma de apresentá-la é como uma aplicação operacional ampla e offline-first, deixando claro o que já está implementado, o que está funcional como formulário guiado e o que ainda representa uma funcionalidade prevista.
