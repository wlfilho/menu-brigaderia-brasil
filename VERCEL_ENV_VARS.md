# Variáveis de Ambiente para o Vercel

Adicione as seguintes variáveis de ambiente no painel do Vercel (Settings > Environment Variables).

## 1. Link Principal (Cardápio)

| Key | Value |
| --- | --- |
| `NEXT_PUBLIC_SHEET_URL` | `https://docs.google.com/spreadsheets/d/e/2PACX-1vTFeYAo7QKAGm947PC5VAFTxTCuVKPz0UGTcPLNaGzSv4P-vei6QanuNhm-nm2qBU5OaeJF8d3ttrpM/pub?output=csv` |

## 2. Configuração das Abas

Identifiquei sua aba de configurações pelo link que você enviou.

### Aba de Configurações (Identificada)
| Key | Value |
| --- | --- |
| `NEXT_PUBLIC_CONFIG_GID` | `1914842493` |

### Aba de Features (Recursos/Cupom)
*Ainda falta o ID desta aba. Se você tiver uma aba "Features" ou "Recursos" na planilha, clique nela e copie o número `gid` da URL.*

| Key | Value |
| --- | --- |
| `NEXT_PUBLIC_FEATURE_CONFIG_GID` | `SEU_GID_AQUI` (Ex: `987654`) |

## 3. Captura de Leads (Para o Cupom funcionar)

Extraí o ID da sua planilha a partir do link de edição que você enviou.

| Key | Value |
| --- | --- |
| `GOOGLE_SHEETS_ID` | `1UbR70LJZ75Ei3_j1x--AGB7haZfChAMKXJVCh9vBP8k` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | O e-mail da conta de serviço (ex: `menu-digital@...iam.gserviceaccount.com`) |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | A chave privada da conta de serviço (começa com `-----BEGIN PRIVATE KEY-----`) |
