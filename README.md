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

## Google Sheets

Se quiser capturar somente `e-mail` e `idade`, configure:

```bash
GOOGLE_SHEETS_WEBHOOK_URL=
```

O endpoint espera um `POST` com este JSON:

```json
{
  "email": "voce@exemplo.com",
  "ageLabel": "25 a 34 anos",
  "ageAverage": 29
}
```
