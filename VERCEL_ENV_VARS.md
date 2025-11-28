# Variáveis de Ambiente para o Vercel

Adicione as seguintes variáveis de ambiente no painel do Vercel (Settings > Environment Variables):

## Configuração Principal (Leitura do Cardápio)

Estas variáveis permitem que o site leia os dados do cardápio da sua planilha publicada.

| Key | Value |
| --- | --- |
| `NEXT_PUBLIC_SHEET_URL` | `https://docs.google.com/spreadsheets/d/e/2PACX-1vTFeYAo7QKAGm947PC5VAFTxTCuVKPz0UGTcPLNaGzSv4P-vei6QanuNhm-nm2qBU5OaeJF8d3ttrpM/pub?output=csv` |

## Configuração de Funcionalidades (Opcional)

Se você publicou o documento inteiro (todas as abas) e quer usar as abas de Configuração e Features:

| Key | Value |
| --- | --- |
| `NEXT_PUBLIC_CONFIG_GID` | `1` (ou o GID da sua aba de Configurações) |
| `NEXT_PUBLIC_FEATURE_CONFIG_GID` | `1043160202` (ou o GID da sua aba de Features) |

**Nota:** Se o link acima for apenas para a aba do Cardápio, as configurações e features usarão os valores padrão do site. Para usar as abas da planilha, publique o documento como "Documento Inteiro" em vez de apenas a aba "Cardápio".

## Configuração de Leads (Captura de E-mails/Cupons)

Para que o formulário de cupom funcione e salve os leads na planilha, você precisa das credenciais de serviço do Google, pois o link público é apenas para leitura.

| Key | Value |
| --- | --- |
| `GOOGLE_SHEETS_ID` | O ID da planilha (encontrado na URL de edição, ex: `1HSW...`) |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | O e-mail da conta de serviço (ex: `menu-digital@...iam.gserviceaccount.com`) |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | A chave privada da conta de serviço (começa com `-----BEGIN PRIVATE KEY-----`) |
