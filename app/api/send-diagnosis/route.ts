import { NextResponse } from "next/server";
import { Resend } from "resend";

import { sendLeadToAirtable } from "@/lib/airtable";
import { createEmailTemplate } from "@/lib/email";
import { calculateDiagnosis, getAgeRangeLabel, type AnswerMap } from "@/lib/quiz";

type Payload = {
  email: string;
  answers: AnswerMap;
  diagnosis?: {
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
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;
    const email = body.email?.trim();
    const answers = body.answers ?? {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "invalid_email" },
        { status: 400 },
      );
    }

    const finalDiagnosis = body.diagnosis ?? calculateDiagnosis(answers);
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Distração Digital <onboarding@resend.dev>";
    const ctaUrl =
      process.env.NEXT_PUBLIC_CTA_URL ??
      "https://www.vitortyso.com.br/";
    const ageLabel = getAgeRangeLabel(answers.ageRange) ?? "Nao informado";

    await sendLeadToAirtable({
      email,
      ageLabel,
      ageAverage: finalDiagnosis.ageAverage,
    });

    if (!resendApiKey) {
      return NextResponse.json({
        ok: true,
        mode: "lead_only",
      });
    }

    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Seu diagnóstico: ${finalDiagnosis.classification} (${finalDiagnosis.score}/100)`,
      html: createEmailTemplate({
        answers,
        ctaUrl,
        ...finalDiagnosis,
      }),
    });

    return NextResponse.json({
      ok: true,
      mode: "live",
    });
  } catch (error) {
    console.error("send-diagnosis failed", error);

    const message = error instanceof Error ? error.message : "send_failed";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
