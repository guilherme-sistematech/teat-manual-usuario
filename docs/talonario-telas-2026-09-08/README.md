# Telas do Talonário — capturas de 2026-09-08

Aparelho: Moto G20 (Android 11, 720×1600), build de captura `teat.talonario.mapa` (perfil `local-sandbox`, offline, dados de demonstração), repositório `codexmark/teat-mobile-expo`, branch `feat/capture-hook` (base `feat/multi-agency-bootstrap` @ 7238914).

Pastas = grupos do inventário de paridade (`src/domain/mobile-ux-parity.registry.ts`). `NN-<rota>.png` é a rota aberta por deep link; `--passo-<x>` é um passo do assistente; `portao--<x>` é um portão renderizado com dados fixos; `00`–`05` em autenticação são o fluxo real de login → MFA → operação → turno → início.

Total: 101 capturas do plano + 6 do fluxo real. O mapa completo (tabelas, grafos e miniaturas) está em `docs/product/MAPA-DE-FUNCIONALIDADES.md` do repositório.

| arquivo | rota | tela | status |
|---|---|---|---|
| `autenticacao-e-turno/portao--auth-login.png` | `auth-login` | Login | implemented |
| `autenticacao-e-turno/portao--auth-mfa.png` | `auth-mfa` | MFA/Reautenticação | implemented |
| `autenticacao-e-turno/portao--device-blocked.png` | `device-blocked` | Dispositivo bloqueado | implemented |
| `autenticacao-e-turno/portao--shift-context.png` | `shift-context` | Selecionar unidade/equipe/viatura | implemented |
| `autenticacao-e-turno/01-device-incident.png` | `device-incident` | Declarar incidente do aparelho anterior | implemented |
| `autenticacao-e-turno/02-operation-select.png` | `operation-select` | Selecionar operação | implemented |
| `autenticacao-e-turno/03-home.png` | `home` | Início do turno | implemented |
| `autenticacao-e-turno/04-close-shift.png` | `close-shift` | Encerramento de turno | implemented |
| `autenticacao-e-turno/05-shift-summary.png` | `shift-summary` | Resumo do turno | implemented |
| `ait-completo/06-ait-history.png` | `ait-history` | Autos lavrados | implemented |
| `ait-completo/07-ait-cancel-posfinal.png` | `ait-cancel-posfinal` | Solicitar cancelamento pós-finalização | implemented |
| `ait-completo/08-ait-start.png` | `ait-start` | Novo AIT — início | implemented |
| `ait-completo/08-ait-start--passo-vehicle.png` | `ait-start?step=vehicle` | Novo AIT — início | implemented |
| `ait-completo/08-ait-start--passo-driver.png` | `ait-start?step=driver` | Novo AIT — início | implemented |
| `ait-completo/08-ait-start--passo-alcohol.png` | `ait-start?step=alcohol` | Novo AIT — início | implemented |
| `ait-completo/08-ait-start--passo-frame.png` | `ait-start?step=frame` | Novo AIT — início | implemented |
| `ait-completo/08-ait-start--passo-location.png` | `ait-start?step=location` | Novo AIT — início | implemented |
| `ait-completo/08-ait-start--passo-evidence.png` | `ait-start?step=evidence` | Novo AIT — início | implemented |
| `ait-completo/08-ait-start--passo-signature.png` | `ait-start?step=signature` | Novo AIT — início | implemented |
| `ait-completo/08-ait-start--passo-review.png` | `ait-start?step=review` | Novo AIT — início | implemented |
| `ait-completo/08-ait-start--passo-done.png` | `ait-start?step=done` | Novo AIT — início | implemented |
| `ait-completo/09-ait-vehicle.png` | `ait-vehicle` | AIT — veículo | shell-functional |
| `ait-completo/10-ait-driver.png` | `ait-driver` | AIT — condutor/infrator | shell-functional |
| `ait-completo/11-ait-frame.png` | `ait-frame` | AIT — enquadramento | implemented |
| `ait-completo/12-ait-frame-detail.png` | `ait-frame-detail` | AIT — detalhe do enquadramento | implemented |
| `ait-completo/13-ait-location.png` | `ait-location` | AIT — local | shell-functional |
| `ait-completo/14-ait-notes.png` | `ait-notes` | AIT — observações | shell-functional |
| `ait-completo/15-ait-validations.png` | `ait-validations` | AIT — validações | shell-functional |
| `ait-completo/16-ait-evidence.png` | `ait-evidence` | AIT — evidências | shell-functional |
| `ait-completo/17-ait-measures.png` | `ait-measures` | AIT — medidas sugeridas | shell-functional |
| `ait-completo/18-ait-signature.png` | `ait-signature` | AIT — assinatura/ciência | implemented |
| `ait-completo/19-ait-review.png` | `ait-review` | AIT — revisão final | shell-functional |
| `ait-completo/20-ait-done.png` | `ait-done` | AIT — finalizado | registered |
| `ait-completo/21-ait-print.png` | `ait-print` | AIT — impressão | implemented |
| `ait-completo/22-ait-shift-detail.png` | `ait-shift-detail` | AIT — detalhes do turno | shell-functional |
| `alcoolemia/23-alcohol-start.png` | `alcohol-start` | Início alcoolemia | implemented |
| `alcoolemia/24-alcohol-device.png` | `alcohol-device` | Etilômetro | implemented |
| `alcoolemia/25-alcohol-result.png` | `alcohol-result` | Resultado do teste | implemented |
| `alcoolemia/26-alcohol-refusal.png` | `alcohol-refusal` | Recusa | implemented |
| `alcoolemia/27-alcohol-signs.png` | `alcohol-signs` | Sinais psicomotores | implemented |
| `alcoolemia/28-alcohol-forward.png` | `alcohol-forward` | Encaminhamento | implemented |
| `alcoolemia/29-alcohol-links.png` | `alcohol-links` | AIT/medidas vinculadas | implemented |
| `alcoolemia/30-alcohol-term.png` | `alcohol-term` | Termo de alcoolemia | implemented |
| `medidas-administrativas/31-measure-start.png` | `measure-start` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-start.png` | `measure-start?step=start` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-retention.png` | `measure-start?step=retention` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-removal.png` | `measure-start?step=removal` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-inventory.png` | `measure-start?step=inventory` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-transshipment.png` | `measure-start?step=transshipment` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-seizure.png` | `measure-start?step=seizure` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-generic.png` | `measure-start?step=generic` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-term.png` | `measure-start?step=term` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-communication.png` | `measure-start?step=communication` | Nova medida | implemented |
| `medidas-administrativas/31-measure-start--passo-done.png` | `measure-start?step=done` | Nova medida | implemented |
| `medidas-administrativas/32-retention.png` | `retention` | Retenção | implemented |
| `medidas-administrativas/33-removal.png` | `removal` | Remoção | implemented |
| `medidas-administrativas/34-inventory.png` | `inventory` | Inventário | implemented |
| `medidas-administrativas/35-transshipment.png` | `transshipment` | Transbordo | implemented |
| `medidas-administrativas/36-measure-term.png` | `measure-term` | Termo administrativo | implemented |
| `medidas-administrativas/37-measure-done.png` | `measure-done` | Finalização da medida | implemented |
| `sinistros/38-crash-start.png` | `crash-start` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-start.png` | `crash-start?step=start` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-location.png` | `crash-start?step=location` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-conditions.png` | `crash-start?step=conditions` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-vehicles.png` | `crash-start?step=vehicles` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-people.png` | `crash-start?step=people` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-victims.png` | `crash-start?step=victims` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-dynamics.png` | `crash-start?step=dynamics` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-sketch.png` | `crash-start?step=sketch` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-evidence.png` | `crash-start?step=evidence` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-links.png` | `crash-start?step=links` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-review.png` | `crash-start?step=review` | Novo sinistro | implemented |
| `sinistros/38-crash-start--passo-done.png` | `crash-start?step=done` | Novo sinistro | implemented |
| `sinistros/39-crash-location.png` | `crash-location` | Local e horário | shell-functional |
| `sinistros/40-crash-conditions.png` | `crash-conditions` | Condições | shell-functional |
| `sinistros/41-crash-vehicles.png` | `crash-vehicles` | Veículos envolvidos | shell-functional |
| `sinistros/42-crash-people.png` | `crash-people` | Pessoas envolvidas | shell-functional |
| `sinistros/43-crash-victims.png` | `crash-victims` | Vítimas | shell-functional |
| `sinistros/44-crash-dynamics.png` | `crash-dynamics` | Dinâmica | shell-functional |
| `sinistros/45-crash-sketch.png` | `crash-sketch` | Croqui | shell-functional |
| `sinistros/46-crash-evidence.png` | `crash-evidence` | Evidências do sinistro | shell-functional |
| `sinistros/47-crash-ait-links.png` | `crash-ait-links` | AITs vinculados | shell-functional |
| `sinistros/48-crash-review.png` | `crash-review` | Revisão do sinistro | shell-functional |
| `consultas/49-vehicle-search.png` | `vehicle-search` | Consulta de veículo | implemented |
| `consultas/50-vehicle-result.png` | `vehicle-result` | Resultado de veículo | registered |
| `consultas/51-vehicle-divergence.png` | `vehicle-divergence` | Divergência veicular | registered |
| `consultas/52-driver-search.png` | `driver-search` | Consulta de condutor | implemented |
| `consultas/53-driver-result.png` | `driver-result` | Resultado de condutor | registered |
| `consultas/54-query-failure.png` | `query-failure` | Falha de consulta | shell-functional |
| `sincronizacao-suporte-e-diagnostico/55-bodycam-failure.png` | `bodycam-failure` | Comunicar falha de bodycam | implemented |
| `sincronizacao-suporte-e-diagnostico/56-sync.png` | `sync` | Fila de sincronização | implemented |
| `sincronizacao-suporte-e-diagnostico/57-sync-item.png` | `sync-item` | Detalhe de item pendente | shell-functional |
| `sincronizacao-suporte-e-diagnostico/58-sync-conflict.png` | `sync-conflict` | Conflito de sincronização | shell-functional |
| `sincronizacao-suporte-e-diagnostico/59-diagnostics.png` | `diagnostics` | Diagnóstico do app | implemented |
| `sincronizacao-suporte-e-diagnostico/60-support.png` | `support` | Suporte técnico | implemented |
| `sincronizacao-suporte-e-diagnostico/61-messages.png` | `messages` | Comunicados da operação | implemented |
| `complementares/62-approach-no-ait.png` | `approach-no-ait` | Abordagem sem autuação | implemented |
| `complementares/63-document-check.png` | `document-check` | Fiscalização documental | implemented |
| `complementares/64-special-inspection.png` | `special-inspection` | Fiscalização de carga/equipamento | implemented |
| `complementares/65-context-help.png` | `context-help` | Ajuda contextual MBFT | implemented |
| `complementares/66-local-settings.png` | `local-settings` | Configurações locais | implemented |
