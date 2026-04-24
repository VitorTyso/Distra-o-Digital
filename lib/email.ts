import type { AnswerMap } from "@/lib/quiz";
import { getQuestionTitle, getSelectedLabel } from "@/lib/quiz";

type EmailTemplateInput = {
  rawScore: number;
  score: number;
  classification: string;
  severityPercentage: number;
  title: string;
  ageAverage: number;
  remainingYears: number;
  daysLostPerYear: number;
  projectedYearsLost: number;
  diagnosis: string;
  guidance: string;
  impactPhrase: string;
  answers: AnswerMap;
  ctaUrl: string;
};

export function createEmailTemplate(data: EmailTemplateInput) {
  const answerList = Object.entries(data.answers)
    .map(([key, value]) => {
      if (typeof value !== "number") return "";
      const title = getQuestionTitle(key);
      const label = getSelectedLabel(key, value);
      return label && title
        ? `<li style="margin-bottom:12px;color:#5d5a55;"><strong style="display:block;color:#111111;margin-bottom:4px;">${title}</strong>${label}</li>`
        : "";
    })
    .join("");

  return `
    <div style="margin:0;background:#f5f5f2;padding:32px 16px;font-family:Inter,Arial,sans-serif;color:#111111;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:28px;padding:36px 28px;box-shadow:0 24px 60px rgba(17,17,17,0.08);">
        <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#a67c52;">Distração Digital</p>
        <h1 style="margin:0 0 12px;font-size:36px;line-height:1.05;font-family:Georgia,serif;">Seu diagnóstico está pronto</h1>
        <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#5d5a55;">Este é o retrato atual do seu padrão de distração digital.</p>
        <div style="border:1px solid rgba(17,17,17,0.08);border-radius:24px;padding:24px;margin-bottom:24px;background:#faf9f7;">
          <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:#7a756d;">Score final</p>
          <p style="margin:0;font-size:48px;font-weight:700;">${data.score}/100</p>
          <p style="margin:8px 0 0;font-size:18px;color:#111111;">${data.classification}</p>
          <p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#5d5a55;">${data.rawScore} de 21 pontos brutos no diagnóstico.</p>
        </div>
        <div style="margin-bottom:24px;padding:22px 24px;border-radius:24px;background:#111111;color:#f8f6f2;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#d7c2a6;">Vida restante comprometida</p>
          <p style="margin:0;font-size:44px;font-weight:700;color:#f7e9d3;">${data.severityPercentage}%</p>
          <p style="margin:10px 0 0;font-size:15px;line-height:1.7;color:#e7e0d6;">Você pode estar comprometendo ${data.severityPercentage}% da sua vida restante.</p>
        </div>
        <div style="display:grid;gap:12px;margin-bottom:24px;">
          <div style="padding:18px 20px;border-radius:20px;background:#f5f2ec;">
            <strong style="display:block;margin-bottom:4px;">Dias perdidos por ano</strong>
            <span style="color:#5d5a55;">${data.daysLostPerYear} dias em fragmentação atencional.</span>
          </div>
          <div style="padding:18px 20px;border-radius:20px;background:#f5f2ec;">
            <strong style="display:block;margin-bottom:4px;">Anos perdidos projetados</strong>
            <span style="color:#5d5a55;">${data.projectedYearsLost} anos até os 80, com base na sua faixa etária.</span>
          </div>
        </div>
        <h2 style="margin:0 0 10px;font-size:24px;line-height:1.3;font-family:Georgia,serif;">${data.title}</h2>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#5d5a55;">${data.diagnosis}</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#7a756d;">${data.guidance}</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#5d5a55;">Projeção até os 80 anos com base na sua faixa etária.</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#5d5a55;">Mantido esse padrão, e considerando sua faixa etária atual, o impacto acumulado até os 80 anos pode ser de ${data.projectedYearsLost} anos.</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#111111;"><strong>Frase de impacto:</strong> ${data.impactPhrase}</p>
        <div style="margin:0 0 28px;">
          <p style="margin:0 0 10px;font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:#7a756d;">Resumo das respostas</p>
          <ul style="padding-left:18px;margin:0;">${answerList}</ul>
        </div>
        <div style="padding:22px;border-radius:24px;background:#111111;color:#f8f6f2;">
          <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#d7c2a6;">Próximo passo</p>
          <h2 style="margin:0 0 10px;font-size:24px;font-family:Georgia,serif;">Recupere sua atenção em 7 dias</h2>
          <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#e7e0d6;">Se sua atenção está fragmentada, sua vida inteira sente o impacto. O próximo passo é recuperar clareza, presença e direção.</p>
          <a href="${data.ctaUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#f7f3ee;color:#111111;text-decoration:none;font-weight:600;">Quero começar o Desafio de 7 dias</a>
        </div>
      </div>
    </div>
  `;
}
