"use client";

import { useEffect, useMemo, useState } from "react";

import { OptionCard } from "@/components/option-card";
import { ProgressBar } from "@/components/progress-bar";
import { ScoreMeter } from "@/components/score-meter";
import { calculateDiagnosis, getProgress, questions, type AnswerMap } from "@/lib/quiz";
import { loadPayload, savePayload } from "@/lib/storage";

type Phase =
  | "intro"
  | "questions"
  | "analysis"
  | "lead"
  | "result";

const analysisMessages = [
  "Cruzando seus hábitos digitais...",
  "Medindo sinais de sobrecarga...",
  "Calculando seu nível de distração...",
];

const CTA_URL =
  process.env.NEXT_PUBLIC_CTA_URL ??
  "https://www.vitortyso.com.br/";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function DiagnosisApp() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [analysisMessageIndex, setAnalysisMessageIndex] = useState(0);
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const diagnosis = useMemo(() => calculateDiagnosis(answers), [answers]);
  const currentQuestion = questions[currentQuestionIndex];
  const progressValue = useMemo(() => {
    if (phase === "intro") return getProgress(1);
    if (phase === "questions") return getProgress(currentQuestionIndex + 2);
    if (phase === "analysis") return getProgress(questions.length + 2);
    return 100;
  }, [currentQuestionIndex, phase]);

  useEffect(() => {
    const stored = loadPayload();
    if (!stored) return;

    setAnswers(stored.answers);
    setEmail(stored.email);
  }, []);

  useEffect(() => {
    if (phase !== "analysis") return;

    const messageTimer = window.setInterval(() => {
      setAnalysisMessageIndex((current) =>
        current < analysisMessages.length - 1 ? current + 1 : current,
      );
    }, 650);

    const resultTimer = window.setTimeout(() => {
      setPhase("lead");
    }, 2000);

    return () => {
      window.clearInterval(messageTimer);
      window.clearTimeout(resultTimer);
    };
  }, [phase]);

  useEffect(() => {
    savePayload({ answers, email });
  }, [answers, email]);

  function handleSelect(value: number) {
    const question = questions[currentQuestionIndex];

    setAnswers((current) => ({
      ...current,
      [question.id]: value,
    }));

    window.setTimeout(() => {
      if (currentQuestionIndex === questions.length - 1) {
        setAnalysisMessageIndex(0);
        setPhase("analysis");
        return;
      }

      setCurrentQuestionIndex((current) => current + 1);
    }, 180);
  }

  function handleBack() {
    if (phase === "questions" && currentQuestionIndex > 0) {
      setCurrentQuestionIndex((current) => current - 1);
      return;
    }

    if (phase === "questions" && currentQuestionIndex === 0) {
      setPhase("intro");
      return;
    }

    if (phase === "lead") {
      setPhase("questions");
      setCurrentQuestionIndex(questions.length - 1);
    }
  }

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailTouched(true);

    if (!isValidEmail(email)) return;

    setEmailStatus("loading");

    try {
      const response = await fetch("/api/send-diagnosis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          answers,
          diagnosis,
        }),
      });

      const payload = (await response.json()) as { ok: boolean };
      setEmailStatus(payload.ok ? "success" : "error");
    } catch {
      setEmailStatus("error");
    } finally {
      setPhase("result");
    }
  }

  const emailHasError = emailTouched && !isValidEmail(email);

  return (
    <main className="min-h-screen px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-3xl flex-col">
        <div className="glass-panel flex min-h-[calc(100vh-2.5rem)] flex-1 flex-col px-5 py-5 md:px-8 md:py-8">
          <ProgressBar value={progressValue} />

          <div className="flex flex-1 flex-col justify-between">
            {phase === "intro" && (
              <section className="flex flex-1 flex-col justify-between py-8 md:py-12">
                <div className="animate-float-in">
                  <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-gold">
                    Diagnóstico guiado
                  </p>
                  <h1 className="max-w-2xl font-serif text-5xl leading-[0.95] tracking-tight text-ink md:text-7xl">
                    Distração Digital
                  </h1>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-slate md:text-xl">
                    Descubra o quanto sua atenção está sendo drenada todos os dias.
                  </p>
                  <p className="mt-6 max-w-xl muted-copy">
                    Em poucos passos, faça um diagnóstico simples sobre sua rotina digital, sua
                    sobrecarga mental e o impacto invisível da distração na sua vida.
                  </p>
                </div>

                <div className="mt-10 animate-float-in">
                  <button
                    type="button"
                    onClick={() => setPhase("questions")}
                    className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-4 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Começar diagnóstico
                  </button>
                </div>
              </section>
            )}

            {phase === "questions" && (
              <section className="flex flex-1 flex-col py-6 md:py-10">
                <div className="mb-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="rounded-full border border-black/8 px-4 py-2 text-sm text-slate transition hover:border-black/15 hover:bg-white/80"
                  >
                    Voltar
                  </button>
                  <p className="text-sm text-slate">
                    {currentQuestionIndex + 1} de {questions.length}
                  </p>
                </div>

                <div key={currentQuestion.id} className="animate-float-in">
                  <p className="mb-4 text-[11px] uppercase tracking-[0.24em] text-gold">
                    {currentQuestion.id === "ageRange" ? "Contexto pessoal" : "Hábitos e rotina"}
                  </p>
                  <h2 className="max-w-2xl font-serif text-3xl leading-tight text-ink md:text-5xl">
                    {currentQuestion.title}
                  </h2>
                  {currentQuestion.description && (
                    <p className="mt-4 max-w-xl muted-copy">{currentQuestion.description}</p>
                  )}
                </div>

                <div className="mt-10 grid gap-3 md:mt-12">
                  {currentQuestion.options.map((option) => (
                    <OptionCard
                      key={option.label}
                      label={option.label}
                      selected={answers[currentQuestion.id] === option.value}
                      onClick={() => handleSelect(option.value)}
                    />
                  ))}
                </div>
              </section>
            )}

            {phase === "analysis" && (
              <section className="flex flex-1 flex-col items-center justify-center py-10 text-center">
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-soft">
                  <div className="h-12 w-12 rounded-full border border-gold/30 bg-gold/10 animate-pulse-glow" />
                </div>
                <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-gold">
                  Processando diagnóstico
                </p>
                <h2 className="font-serif text-3xl leading-tight text-ink md:text-5xl">
                  Analisando seu padrão de distração...
                </h2>
                <p className="mt-5 max-w-lg muted-copy">
                  Estamos processando seus hábitos digitais e sinais de sobrecarga.
                </p>
                <div className="mt-10 space-y-3">
                  {analysisMessages.map((message, index) => (
                    <p
                      key={message}
                      className={[
                        "text-sm transition-all duration-500",
                        index <= analysisMessageIndex
                          ? "translate-y-0 opacity-100 text-ink"
                          : "translate-y-1 opacity-30 text-slate",
                      ].join(" ")}
                    >
                      {message}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {phase === "lead" && (
              <section className="flex flex-1 flex-col justify-center py-8 md:py-12">
                <button
                  type="button"
                  onClick={handleBack}
                  className="mb-8 w-fit rounded-full border border-black/8 px-4 py-2 text-sm text-slate transition hover:border-black/15 hover:bg-white/80"
                >
                  Voltar
                </button>

                <div className="animate-float-in">
                  <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-gold">
                    Resultado bloqueado
                  </p>
                  <h2 className="max-w-2xl font-serif text-3xl leading-tight text-ink md:text-5xl">
                    Seu resultado está pronto. Para desbloquear, informe seu e-mail.
                  </h2>
                </div>

                <form onSubmit={handleEmailSubmit} className="mt-10 max-w-xl animate-float-in">
                  <label className="mb-3 block text-[11px] uppercase tracking-[0.24em] text-slate/80">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="voce@exemplo.com"
                    className={[
                      "w-full rounded-[1.4rem] border bg-white/80 px-5 py-4 text-base text-ink placeholder:text-slate/55",
                      "focus:border-black/20 focus:outline-none focus:ring-2 focus:ring-ink/10",
                      emailHasError ? "border-red-300" : "border-black/8",
                    ].join(" ")}
                  />
                  {emailHasError && (
                    <p className="mt-3 text-sm text-red-500">Digite um e-mail valido para continuar.</p>
                  )}
                  <button
                    type="submit"
                    disabled={emailStatus === "loading"}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-ink px-6 py-4 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
                  >
                    {emailStatus === "loading" ? "Enviando diagnostico..." : "Desbloquear meu resultado"}
                  </button>
                </form>
              </section>
            )}

            {phase === "result" && (
              <section className="flex flex-1 flex-col py-6 md:py-8">
                <div className="animate-float-in">
                  <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-gold">
                    Relatório final
                  </p>
                  <h2 className="font-serif text-3xl leading-tight text-ink md:text-5xl">{diagnosis.title}</h2>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-[2rem] bg-ink px-6 py-7 text-white shadow-card">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">
                      Score de Distração Digital
                    </p>
                    <div className="mt-5 flex items-end gap-3">
                      <span className="font-serif text-6xl leading-none md:text-7xl">
                        {diagnosis.score}
                      </span>
                      <span className="pb-2 text-lg text-white/70">/100</span>
                    </div>
                    <p className="mt-5 text-2xl leading-tight text-[#f1e7d8]">
                      {diagnosis.classification}
                    </p>
                    <p className="mt-4 max-w-lg text-sm leading-7 text-white/70">
                      {diagnosis.diagnosis}
                    </p>
                    <p className="mt-4 max-w-lg text-sm leading-7 text-white/55">
                      {diagnosis.guidance}
                    </p>
                    <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/10 px-4 py-4">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">
                        Vida restante comprometida
                      </p>
                      <p className="mt-2 font-serif text-4xl leading-none text-[#f7e9d3]">
                        {diagnosis.severityPercentage}%
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/70">
                        Você pode estar comprometendo {diagnosis.severityPercentage}% da sua vida restante.
                      </p>
                    </div>
                  </div>

                  <ScoreMeter score={diagnosis.score} />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <article className="rounded-[1.8rem] border border-black/8 bg-white/80 p-5 shadow-soft">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate/80">Classificação</p>
                    <p className="mt-4 text-lg leading-7 text-ink">{diagnosis.classification}</p>
                  </article>
                  <article className="rounded-[1.8rem] border border-black/8 bg-white/80 p-5 shadow-soft">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate/80">Dias por ano</p>
                    <p className="mt-4 text-lg leading-7 text-ink">
                      {diagnosis.daysLostPerYear} dias em fragmentação atencional
                    </p>
                  </article>
                  <article className="rounded-[1.8rem] border border-black/8 bg-white/80 p-5 shadow-soft">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate/80">Impacto acumulado</p>
                    <p className="mt-4 text-lg leading-7 text-ink">
                      {diagnosis.projectedYearsLost} anos perdidos projetados
                    </p>
                  </article>
                </div>

                <div className="mt-4 rounded-[2rem] bg-[#efe4d4] px-6 py-7 shadow-soft">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-gold">
                    Severidade projetada
                  </p>
                  <div className="mt-4 flex items-end gap-3">
                    <span className="font-serif text-6xl leading-none text-ink md:text-7xl">
                      {diagnosis.severityPercentage}%
                    </span>
                  </div>
                  <p className="mt-4 max-w-2xl text-lg leading-8 text-ink">
                    Você pode estar comprometendo {diagnosis.severityPercentage}% da sua vida restante.
                  </p>
                </div>

                <div className="mt-4 rounded-[2rem] border border-black/8 bg-[#fbfaf8] p-6 shadow-soft">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate/80">Projeção até os 80 anos com base na sua faixa etária</p>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-slate">
                    Mantido esse padrão, e considerando sua faixa etária atual, o impacto
                    acumulado até os 80 anos pode ser de {diagnosis.projectedYearsLost} anos.
                  </p>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-ink">
                    {diagnosis.impactPhrase}
                  </p>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-slate">
                    {diagnosis.guidance}
                  </p>
                </div>

                <div className="mt-6 rounded-[2rem] bg-[#f2ebe2] px-6 py-7 shadow-soft">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-gold">
                    Próximo passo
                  </p>
                  <h3 className="mt-3 font-serif text-3xl leading-tight text-ink">
                    Recupere sua atenção em 7 dias
                  </h3>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-slate">
                    Se sua atenção está fragmentada, sua vida inteira sente o impacto. O próximo
                    passo é recuperar clareza, presença e direção.
                  </p>
                  <a
                    href={CTA_URL}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-ink px-6 py-4 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Quero começar o Desafio de 7 dias
                  </a>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
