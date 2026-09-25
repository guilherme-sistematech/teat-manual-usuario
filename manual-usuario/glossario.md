# Glossário

Este glossário reúne siglas e termos recorrentes no Manual do Usuário do TEAT. As definições abaixo explicam como cada termo é utilizado no contexto da aplicação e não substituem normas de trânsito, manuais oficiais ou procedimentos do órgão.

| Termo | Significado no manual |
|---|---|
| **AIT** | **Auto de Infração de Trânsito**. Registro formal de uma infração de trânsito. No TEAT, o AIT só passa a ser tratado como ato finalizado depois da confirmação do fluxo, quando recebe os elementos formais aplicáveis e entra na sincronização. |
| **API** | Interface usada pelo aplicativo para se comunicar com os serviços da retaguarda e obter ou enviar dados. |
| **Ato** | Registro operacional ou formal produzido no TEAT, como AIT, medida administrativa, procedimento de alcoolemia ou registro de sinistro. |
| **Bodycam** | Câmera corporal utilizada durante a atividade de fiscalização. O TEAT pode registrar informações de vínculo e de cadeia de custódia, conforme a integração disponível. |
| **Bootstrap** | Carga inicial autenticada que fornece ao aplicativo informações necessárias para a operação, como contexto, catálogos e dados permitidos para o aparelho e o usuário. |
| **Cadeia de custódia** | Conjunto de informações usado para manter a rastreabilidade e a integridade das evidências associadas a um ato. |
| **Caso guardado / rascunho** | Atendimento interrompido antes da finalização. Um caso guardado ainda não é um ato jurídico finalizado e pode exigir recaptura de informações ao ser retomado. |
| **Ciência** | Registro de que o interessado tomou conhecimento do ato, por assinatura ou pela situação de recusa ou impossibilidade, conforme o fluxo. |
| **CNH** | **Carteira Nacional de Habilitação**. Documento de habilitação do condutor. |
| **CRLV-e** | **Certificado de Registro e Licenciamento de Veículo em meio digital**. Documento digital utilizado para comprovar registro e licenciamento do veículo. |
| **Etilômetro** | Equipamento utilizado para medir a concentração de álcool no ar expirado. No TEAT, seus dados podem fazer parte do procedimento de alcoolemia quando o equipamento e a operação permitirem. |
| **Evidência** | Foto, documento, localização, croqui ou referência de bodycam associada a um ato para documentar a ocorrência ou fiscalização. |
| **Faixa de numeração de AIT** | Conjunto de números de AIT reservado para uso durante a operação do agente. |
| **Finalização** | Etapa que conclui um fluxo e torna o registro formal conforme as regras aplicáveis. Depois dela, o conteúdo não deve ser alterado silenciosamente. |
| **Hash** | Identificador criptográfico usado para verificar a integridade de um registro ou vínculo. Alterações no conteúdo produzem um valor diferente. |
| **Idempotência** | Propriedade que permite repetir uma operação, como um reenvio de sincronização, sem criar um segundo ato formal equivalente. |
| **MBFT** | **Manual Brasileiro de Fiscalização de Trânsito**. Referência normativa usada para enquadramentos e procedimentos de fiscalização. |
| **Medida administrativa** | Providência administrativa registrada como ato próprio no TEAT, como retenção, remoção ou recolhimento de documento, podendo estar vinculada ou não a um AIT. |
| **MFA** | **Autenticação multifator**. Etapa adicional de segurança no acesso, além de usuário e senha. |
| **OCR** | **Reconhecimento Óptico de Caracteres**. Recurso que identifica caracteres em imagens, como uma placa ou documento. O resultado precisa ser conferido pelo agente. |
| **Offline-first** | Modelo em que o aplicativo consegue executar e armazenar parte das atividades mesmo sem internet, enviando os registros posteriormente quando houver conectividade. |
| **OTA** | **Over-the-Air**. Atualização distribuída ao aplicativo pela rede, sem exigir uma nova instalação completa do pacote nativo, quando canal, assinatura e runtime forem compatíveis. |
| **pending_activation** | Estado de um aparelho que já foi apresentado à retaguarda, mas ainda aguarda aprovação para operar. Nesse estado, o aparelho não abre turno nem recebe faixa de numeração. |
| **PPD** | **Permissão para Dirigir**. Documento provisório concedido ao condutor nas condições previstas pela legislação. |
| **QR Code** | Código bidimensional que pode ser lido pela câmera para auxiliar na consulta ou validação de documentos digitais. |
| **RENACH** | **Registro Nacional de Condutores Habilitados**. Base nacional relacionada aos registros de condutores habilitados. |
| **RENAVAM** | **Registro Nacional de Veículos Automotores**. Base nacional relacionada aos registros de veículos. |
| **Retaguarda** | Conjunto de serviços e sistemas centrais que apoiam o TEAT, realizando autorizações, processamento, sincronização e outras funções administrativas. |
| **Runtime** | Versão de compatibilidade usada pelo aplicativo para determinar quais atualizações OTA podem ser aplicadas com segurança à instalação. |
| **Sandbox / local-sandbox** | Ambiente de demonstração ou testes locais, que pode apresentar comportamentos simplificados ou simulados e não deve ser tratado como referência para produção. |
| **Sincronização** | Processo de envio dos registros locais para a central e de acompanhamento do processamento realizado pela retaguarda. |
| **Estados de sincronização** | Situações apresentadas na fila: `pending` (aguardando envio), `sent` (enviado), `received` (recebido pela central), `applied` (aplicado), `conflict` (conflito), `rejected` (rejeitado) e `concurrency-suspect` (suspeita de processamento concorrente ou duplicado). |
| **Talonário eletrônico** | Forma digital do conjunto de recursos usados pelo agente para registrar atos de fiscalização em campo. No projeto, corresponde ao TEAT. |
| **TEAT** | **Talonário Eletrônico do Agente de Trânsito**. Aplicação móvel utilizada nas atividades de fiscalização de campo descritas neste manual. |
| **TOTP** | **Time-based One-Time Password**. Código temporário gerado com base no tempo e utilizado em etapas de autenticação MFA. |
| **Turno operacional** | Período de trabalho aberto no TEAT com contexto definido, como operação, unidade, equipe, viatura e recursos necessários para a fiscalização. |
