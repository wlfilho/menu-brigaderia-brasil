# Variáveis de Ambiente para o Vercel

Adicione as seguintes variáveis de ambiente no painel do Vercel (Settings > Environment Variables).

## 1. Link Principal (Cardápio)

| Key | Value |
| --- | --- |
| `NEXT_PUBLIC_SHEET_URL` | `https://docs.google.com/spreadsheets/d/e/2PACX-1vTFeYAo7QKAGm947PC5VAFTxTCuVKPz0UGTcPLNaGzSv4P-vei6QanuNhm-nm2qBU5OaeJF8d3ttrpM/pub?output=csv` |

## 2. Configuração das Abas

| Key | Value |
| --- | --- |
| `NEXT_PUBLIC_CONFIG_GID` | `1914842493` |
| `NEXT_PUBLIC_FEATURE_CONFIG_GID` | `SEU_GID_AQUI` (Ex: `987654`) |

## 3. Captura de Leads (Webhook N8N)

Para o formulário de cupom funcionar e enviar os dados para o seu fluxo no N8N.

| Key | Value |
| --- | --- |
| `N8N_WEBHOOK_URL` | A URL do seu webhook no N8N (ex: `https://seu-n8n.com/webhook/...`) |
