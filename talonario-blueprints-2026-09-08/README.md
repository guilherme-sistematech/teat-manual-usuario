# Blueprints das telas do Talonário — 2026-09-08

Uma prancha por captura (modo claro): a tela real com marcadores numerados nos elementos legíveis (lidos do `uiautomator dump` da mesma tela — campos, botões e textos curtos, sem o chrome de bodycam nem a barra inferior) e a ficha resumida da rota vinda do registro de paridade: rota, uxCode, grupo, status, quem renderiza, papéis, destinos e as transições registradas. Nada é inventado: rótulos, rotas e regras vêm do código.

Gerado por `blueprints.ts` (Playwright) a partir de `../talonario-telas-2026-09-08-claro/`. Pranchas em 2800×1600 (2×).

Aparelho: Moto G20 (Android 11, 720×1600), build de captura `teat.talonario.mapa` (perfil `local-sandbox`, offline, dados de demonstração), repositório `codexmark/teat-mobile-expo`, branch `feat/capture-hook`.

Pastas = grupos do inventário (`src/domain/mobile-ux-parity.registry.ts`). `NN-<rota>.png` = rota aberta por deep link; `--passo-<x>` = passo do assistente; `portao--<x>` = portão renderizado com dados fixos; `00`–`05` em autenticação = fluxo real (login → MFA → operação → turno → início).

**PDF das jornadas:** `Jornadas-do-Talonario-2026-09-08.pdf` — 113 páginas (capa, índice, um storyboard por jornada com as ações registradas entre as telas, e a prancha de cada tela), nas oito jornadas de `docs/product/FIELD-FLOWS.md`.

| prancha | rota | tela | status |
|---|---|---|---|
| `autenticacao-e-turno/portao--auth-login.blueprint.png` | `auth-login` | Login | implemented |
| `autenticacao-e-turno/portao--auth-mfa.blueprint.png` | `auth-mfa` | MFA/Reautenticação | implemented |
| `autenticacao-e-turno/portao--device-blocked.blueprint.png` | `device-blocked` | Dispositivo bloqueado | implemented |
| `autenticacao-e-turno/portao--shift-context.blueprint.png` | `shift-context` | Selecionar unidade/equipe/viatura | implemented |
| `autenticacao-e-turno/01-device-incident.blueprint.png` | `device-incident` | Declarar incidente do aparelho anterior | implemented |
| `autenticacao-e-turno/02-operation-select.blueprint.png` | `operation-select` | Selecionar operação | implemented |
| `autenticacao-e-turno/03-home.blueprint.png` | `home` | Início do turno | implemented |
| `autenticacao-e-turno/04-close-shift.blueprint.png` | `close-shift` | Encerramento de turno | implemented |
| `autenticacao-e-turno/05-shift-summary.blueprint.png` | `shift-summary` | Resumo do turno | implemented |
| `ait-completo/06-ait-history.blueprint.png` | `ait-history` | Autos lavrados | implemented |
| `ait-completo/07-ait-cancel-posfinal.blueprint.png` | `ait-cancel-posfinal` | Solicitar cancelamento pós-finalização | implemented |
| `ait-completo/08-ait-start.blueprint.png` | `ait-start` | Novo AIT — início | implemented |
| `ait-completo/08-ait-start--passo-vehicle.blueprint.png` | `ait-start?step=vehicle` | Novo AIT — início | implemented |
| `ait-completo/08-ait-start--passo-driver.blueprint.png` | `ait-start?step=driver` | Novo AIT — início | implemented |
| `ait-completo/08-ait-start--passo-alcohol.blueprint.png` | `ait-start?step=alcohol` | Novo AIT — início | implemented |
| `ait-completo/08-ait-start--passo-frame.blueprint.png` | `ait-start?step=frame` | Novo AIT — início | implemented |
| `ait-completo/08-ait-start--passo-location.blueprint.png` | `ait-start?step=location` | Novo AIT — início | implemented |
| `ait-completo/08-ait-start--passo-evidence.blueprint.png` | `ait-start?step=evidence` | Novo AIT — início | implemented |
| `ait-completo/08-ait-start--passo-signature.blueprint.png` | `ait-start?step=signature` | Novo AIT — início | implemented |
| `ait-completo/08-ait-start--passo-review.blueprint.png` | `ait-start?step=review` | Novo AIT — início | implemented |
| `ait-completo/08-ait-start--passo-done.blueprint.png` | `ait-start?step=done` | Novo AIT — início | implemented |
| `ait-completo/09-ait-vehicle.blueprint.png` | `ait-vehicle` | AIT — veículo | shell-functional |
| `ait-completo/10-ait-driver.blueprint.png` | `ait-driver` | AIT — condutor/infrator | shell-functional |
| `ait-completo/11-ait-frame.blueprint.png` | `ait-frame` | AIT — enquadramento | implemented |
| `ait-completo/12-ait-frame-detail.blueprint.png` | `ait-frame-detail` | AIT — detalhe do enquadramento | implemented |
| `ait-completo/13-ait-location.blueprint.png` | `ait-location` | AIT — local | shell-functional |
| `ait-completo/14-ait-notes.blueprint.png` | `ait-notes` | AIT — observações | shell-functional |
| `ait-completo/15-ait-validations.blueprint.png` | `ait-validations` | AIT — validações | shell-functional |
| `ait-completo/16-ait-evidence.blueprint.png` | `ait-evidence` | AIT — evidências | shell-functional |
| `ait-completo/17-ait-measures.blueprint.png` | `ait-measures` | AIT — medidas sugeridas | shell-functional |
| `ait-completo/18-ait-signature.blueprint.png` | `ait-signature` | AIT — assinatura/ciência | implemented |
| `ait-completo/19-ait-review.blueprint.png` | `ait-review` | AIT — revisão final | shell-functional |
| `ait-completo/20-ait-done.blueprint.png` | `ait-done` | AIT — finalizado | registered |
| `ait-completo/21-ait-print.blueprint.png` | `ait-print` | AIT — impressão | implemented |
| `ait-completo/22-ait-shift-detail.blueprint.png` | `ait-shift-detail` | AIT — detalhes do turno | shell-functional |
| `alcoolemia/23-alcohol-start.blueprint.png` | `alcohol-start` | Início alcoolemia | implemented |
| `alcoolemia/24-alcohol-device.blueprint.png` | `alcohol-device` | Etilômetro | implemented |
| `alcoolemia/25-alcohol-result.blueprint.png` | `alcohol-result` | Resultado do teste | implemented |
| `alcoolemia/26-alcohol-refusal.blueprint.png` | `alcohol-refusal` | Recusa | implemented |
| `alcoolemia/27-alcohol-signs.blueprint.png` | `alcohol-signs` | Sinais psicomotores | implemented |
| `alcoolemia/28-alcohol-forward.blueprint.png` | `alcohol-forward` | Encaminhamento | implemented |
| `alcoolemia/29-alcohol-links.blueprint.png` | `alcohol-links` | AIT/medidas vinculadas | implemented |
| `alcoolemia/30-alcohol-term.blueprint.png` | `alcohol-term` | Termo de alcoolemia | implemented |
| `medidas-administrativas/31-measure-start.blueprint.png` | `measure-start` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-start.blueprint.png` | `measure-start?step=start` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-retention.blueprint.png` | `measure-start?step=retention` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-removal.blueprint.png` | `measure-start?step=removal` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-inventory.blueprint.png` | `measure-start?step=inventory` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-transshipment.blueprint.png` | `measure-start?step=transshipment` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-seizure.blueprint.png` | `measure-start?step=seizure` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-generic.blueprint.png` | `measure-start?step=generic` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-term.blueprint.png` | `measure-start?step=term` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-communication.blueprint.png` | `measure-start?step=communication` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-done.blueprint.png` | `measure-start?step=done` | Nova medida | implemented |
| `medidas-administrativas/32-retention.blueprint.png` | `retention` | Retenção | implemented |
| `medidas-administrativas/33-removal.blueprint.png` | `removal` | Remoção | implemented |
| `medidas-administrativas/34-inventory.blueprint.png` | `inventory` | Inventário | implemented |
| `medidas-administrativas/35-transshipment.blueprint.png` | `transshipment` | Transbordo | implemented |
| `medidas-administrativas/36-measure-term.blueprint.png` | `measure-term` | Termo administrativo | implemented |
| `medidas-administrativas/37-measure-done.blueprint.png` | `measure-done` | Finalização da medida | implemented |
| `sinistros/38-crash-start.blueprint.png` | `crash-start` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-start.blueprint.png` | `crash-start?step=start` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-location.blueprint.png` | `crash-start?step=location` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-conditions.blueprint.png` | `crash-start?step=conditions` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-vehicles.blueprint.png` | `crash-start?step=vehicles` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-people.blueprint.png` | `crash-start?step=people` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-victims.blueprint.png` | `crash-start?step=victims` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-dynamics.blueprint.png` | `crash-start?step=dynamics` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-sketch.blueprint.png` | `crash-start?step=sketch` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-evidence.blueprint.png` | `crash-start?step=evidence` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-links.blueprint.png` | `crash-start?step=links` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-review.blueprint.png` | `crash-start?step=review` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-done.blueprint.png` | `crash-start?step=done` | Novo sinistro | implemented |
| `sinistros/39-crash-location.blueprint.png` | `crash-location` | Local e horário | shell-functional |
| `sinistros/40-crash-conditions.blueprint.png` | `crash-conditions` | Condições | shell-functional |
| `sinistros/41-crash-vehicles.blueprint.png` | `crash-vehicles` | Veículos envolvidos | shell-functional |
| `sinistros/42-crash-people.blueprint.png` | `crash-people` | Pessoas envolvidas | shell-functional |
| `sinistros/43-crash-victims.blueprint.png` | `crash-victims` | Vítimas | shell-functional |
| `sinistros/44-crash-dynamics.blueprint.png` | `crash-dynamics` | Dinâmica | shell-functional |
| `sinistros/45-crash-sketch.blueprint.png` | `crash-sketch` | Croqui | shell-functional |
| `sinistros/46-crash-evidence.blueprint.png` | `crash-evidence` | Evidências do sinistro | shell-functional |
| `sinistros/47-crash-ait-links.blueprint.png` | `crash-ait-links` | AITs vinculados | shell-functional |
| `sinistros/48-crash-review.blueprint.png` | `crash-review` | Revisão do sinistro | shell-functional |
| `consultas/49-vehicle-search.blueprint.png` | `vehicle-search` | Consulta de veículo | implemented |
| `consultas/50-vehicle-result.blueprint.png` | `vehicle-result` | Resultado de veículo | registered |
| `consultas/51-vehicle-divergence.blueprint.png` | `vehicle-divergence` | Divergência veicular | registered |
| `consultas/52-driver-search.blueprint.png` | `driver-search` | Consulta de condutor | implemented |
| `consultas/53-driver-result.blueprint.png` | `driver-result` | Resultado de condutor | registered |
| `consultas/54-query-failure.blueprint.png` | `query-failure` | Falha de consulta | shell-functional |
| `sincronizacao-suporte-e-diagnostico/55-bodycam-failure.blueprint.png` | `bodycam-failure` | Comunicar falha de bodycam | implemented |
| `sincronizacao-suporte-e-diagnostico/56-sync.blueprint.png` | `sync` | Fila de sincronização | implemented |
| `sincronizacao-suporte-e-diagnostico/57-sync-item.blueprint.png` | `sync-item` | Detalhe de item pendente | shell-functional |
| `sincronizacao-suporte-e-diagnostico/58-sync-conflict.blueprint.png` | `sync-conflict` | Conflito de sincronização | shell-functional |
| `sincronizacao-suporte-e-diagnostico/59-diagnostics.blueprint.png` | `diagnostics` | Diagnóstico do app | implemented |
| `sincronizacao-suporte-e-diagnostico/60-support.blueprint.png` | `support` | Suporte técnico | implemented |
| `sincronizacao-suporte-e-diagnostico/61-messages.blueprint.png` | `messages` | Comunicados da operação | implemented |
| `complementares/62-approach-no-ait.blueprint.png` | `approach-no-ait` | Abordagem sem autuação | implemented |
| `complementares/63-document-check.blueprint.png` | `document-check` | Fiscalização documental | implemented |
| `complementares/64-special-inspection.blueprint.png` | `special-inspection` | Fiscalização de carga/equipamento | implemented |
| `complementares/65-context-help.blueprint.png` | `context-help` | Ajuda contextual MBFT | implemented |
| `complementares/66-local-settings.blueprint.png` | `local-settings` | Configurações locais | implemented |
| `autenticacao-e-turno/00-auth-login--vazio.blueprint.png` | `auth-login` | Login | implemented |
| `autenticacao-e-turno/01-auth-login--preenchido.blueprint.png` | `auth-login` | Login | implemented |
| `autenticacao-e-turno/02-auth-mfa.blueprint.png` | `auth-mfa` | MFA/Reautenticação | implemented |
| `autenticacao-e-turno/03-depois-do-mfa.blueprint.png` | `operation-select` | Selecionar operação | implemented |
| `autenticacao-e-turno/04-shift-context--abrir-turno.blueprint.png` | `shift-context` | Selecionar unidade/equipe/viatura | implemented |
| `autenticacao-e-turno/04b-shift-context--pronto.blueprint.png` | `shift-context` | Selecionar unidade/equipe/viatura | implemented |
| `autenticacao-e-turno/05-home.blueprint.png` | `home` | Início do turno | implemented |
