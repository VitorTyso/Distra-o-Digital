# Distração Digital

Web app/mobile web app em Next.js + Tailwind para diagnosticar distração digital, capturar lead e enviar o resultado por e-mail.

## Rodar localmente

```bash
npm install
npm run dev
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
RESEND_API_KEY=
RESEND_FROM_EMAIL="Distração Digital <onboarding@resend.dev>"
```

Se `RESEND_API_KEY` não estiver definida, a API usa modo mock e o fluxo continua normalmente.

## Airtable

Se quiser capturar somente `e-mail` e `idade`, configure:

```bash
AIRTABLE_TOKEN=
AIRTABLE_BASE_ID=appGVt93TC9Ri9Xvy
AIRTABLE_TABLE_NAME="Diagnostico Distração digital"
```

O app envia para uma rota interna do projeto e essa rota faz o `POST` para a API do Airtable no backend da Vercel.
Sem `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID` e `AIRTABLE_TABLE_NAME`, a captura falha explicitamente.

Na tabela do Airtable, crie estas colunas:

- `Email`
- `Faixa etaria`
- `Idade media`

O payload enviado pelo app é equivalente a:

```json
{
  "email": "voce@exemplo.com",
  "ageLabel": "25 a 34 anos",
  "ageAverage": 29
}
```
