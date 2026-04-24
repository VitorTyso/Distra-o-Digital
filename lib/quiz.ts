export type Option = {
  label: string;
  value: number;
};

export type QuestionId =
  | "ageRange"
  | "phoneHours"
  | "socialHours"
  | "unlocks"
  | "notifications"
  | "sleep"
  | "tabs"
  | "mentalState";

export type Question = {
  id: QuestionId;
  title: string;
  description?: string;
  options: Option[];
};

export const questions: Question[] = [
  {
    id: "ageRange",
    title: "Qual sua faixa etária?",
    description: "Seu resultado será mais preciso com essa informação.",
    options: [
      { label: "Menos de 18 anos", value: 0 },
      { label: "18 a 24 anos", value: 1 },
      { label: "25 a 34 anos", value: 2 },
      { label: "35 a 44 anos", value: 3 },
      { label: "45 a 59 anos", value: 4 },
      { label: "60 anos ou mais", value: 5 },
    ],
  },
  {
    id: "phoneHours",
    title: "Quantas horas por dia você passa no celular?",
    options: [
      { label: "Menos de 2 horas", value: 0 },
      { label: "Entre 2 e 4 horas", value: 1 },
      { label: "Entre 4 e 6 horas", value: 2 },
      { label: "Mais de 6 horas", value: 3 },
    ],
  },
  {
    id: "socialHours",
    title: "Quantas horas por dia você passa em redes sociais?",
    options: [
      { label: "Menos de 1 hora", value: 0 },
      { label: "Entre 1 e 2 horas", value: 1 },
      { label: "Entre 2 e 4 horas", value: 2 },
      { label: "Mais de 4 horas", value: 3 },
    ],
  },
  {
    id: "unlocks",
    title: "Quantas vezes por dia você desbloqueia o telefone?",
    options: [
      { label: "Menos de 20 vezes", value: 0 },
      { label: "Entre 20 e 50 vezes", value: 1 },
      { label: "Entre 50 e 100 vezes", value: 2 },
      { label: "Mais de 100 vezes", value: 3 },
    ],
  },
  {
    id: "notifications",
    title: "Quantas notificações você recebe por dia?",
    options: [
      { label: "Quase nenhuma", value: 0 },
      { label: "Entre 10 e 30", value: 1 },
      { label: "Entre 30 e 60", value: 2 },
      { label: "Mais de 60", value: 3 },
    ],
  },
  {
    id: "sleep",
    title: "Quantas horas você dorme por noite?",
    options: [
      { label: "Mais de 8 horas", value: 0 },
      { label: "Entre 7 e 8 horas", value: 1 },
      { label: "Entre 5 e 7 horas", value: 2 },
      { label: "Menos de 5 horas", value: 3 },
    ],
  },
  {
    id: "mentalState",
    title: "Como está sua sensação mental hoje?",
    options: [
      { label: "Leve e clara", value: 0 },
      { label: "Um pouco cansada", value: 1 },
      { label: "Confusa e sobrecarregada", value: 2 },
      { label: "Exausta e fragmentada", value: 3 },
    ],
  },
  {
    id: "tabs",
    title: "Quantas abas abertas você costuma ter ao mesmo tempo?",
    options: [
      { label: "1 a 3 abas", value: 0 },
      { label: "4 a 8 abas", value: 1 },
      { label: "9 a 15 abas", value: 2 },
      { label: "Mais de 15", value: 3 },
    ],
  },
];

export type AnswerMap = Partial<Record<QuestionId, number>>;

export type Diagnosis = {
  rawScore: number;
  score: number;
  classification: string;
  severityPercentage: number;
  title: string;
  diagnosis: string;
  guidance: string;
  impactPhrase: string;
  ageAverage: number;
  remainingYears: number;
  hoursLostPerDay: number;
  daysLostPerYear: number;
  projectedYearsLost: number;
  emailMode: "mock" | "live";
};

type Band = {
  min: number;
  max: number;
  classification: string;
  title: string;
  diagnosis: string;
  guidance: string;
  impactPhrases: string[];
};

const impactHoursByAnswer: Partial<Record<QuestionId, number[]>> = {
  phoneHours: [0.2, 0.7, 1.3, 2],
  socialHours: [0.1, 0.4, 0.8, 1.4],
  unlocks: [0.05, 0.2, 0.45, 0.8],
  notifications: [0.05, 0.2, 0.4, 0.7],
  sleep: [0, 0.15, 0.45, 0.9],
  tabs: [0.05, 0.15, 0.3, 0.5],
  mentalState: [0, 0.2, 0.5, 0.9],
};

const severityBands: Band[] = [
  {
    min: 0,
    max: 0.05,
    classification: "Alerta",
    title: "Sua atenção ainda parece relativamente preservada.",
    diagnosis:
      "Seu padrão atual ainda parece reversível, mas já existe um custo silencioso se acumulando. Pequenas distrações recorrentes podem crescer sem chamar atenção até afetarem sua clareza.",
    guidance: "O melhor momento para proteger sua atenção é antes que a perda vire rotina.",
    impactPhrases: [
      "O que parece normal hoje pode estar custando anos de presença ao longo da vida.",
      "Sua atenção forte hoje merece proteção antes que a sobrecarga vire padrão.",
    ],
  },
  {
    min: 0.05,
    max: 0.1,
    classification: "Sobrecarga",
    title: "Sua atenção já começa a mostrar sinais de sobrecarga.",
    diagnosis:
      "Seu padrão digital já aponta uma perda relevante de energia mental. Interrupções, excesso de estímulo e troca constante de contexto podem estar reduzindo foco e profundidade com mais frequência do que parece.",
    guidance: "Você ainda está em uma faixa de reversão, mas já vale agir com intenção.",
    impactPhrases: [
      "Distração não rouba só tempo. Rouba profundidade, energia e direção.",
      "O excesso de estímulo cobra um preço invisível, mas real.",
    ],
  },
  {
    min: 0.1,
    max: 0.15,
    classification: "Severa",
    title: "Sua rotina digital já pode estar corroendo parte importante da sua vida útil.",
    diagnosis:
      "O padrão atual sugere um desgaste consistente, não pontual. Sua atenção pode estar sendo fragmentada a ponto de afetar presença, qualidade mental e consistência nas decisões do dia a dia.",
    guidance:
      "Aqui já não basta tentar focar mais. Você precisa redesenhar ambiente, estímulos e rotina.",
    impactPhrases: [
      "Sua vida sente o peso daquilo que captura sua atenção todos os dias.",
      "Quando a fragmentação vira rotina, até tarefas simples passam a custar mais energia.",
    ],
  },
  {
    min: 0.15,
    max: 0.2,
    classification: "Crítica",
    title: "Sua atenção está sendo drenada em um nível preocupante.",
    diagnosis:
      "Seu padrão atual sugere um comprometimento alto da sua energia mental. O problema pode não ser falta de capacidade, mas uma rotina que fragmenta sua clareza com frequência suficiente para alterar sua vida prática.",
    guidance:
      "Sua atenção precisa sair do improviso e voltar a ser protegida de forma deliberada.",
    impactPhrases: [
      "Distração não rouba só tempo. Rouba profundidade, energia e direção.",
      "O excesso de estímulo cobra um preço invisível, mas real.",
    ],
  },
  {
    min: 0.2,
    max: Number.POSITIVE_INFINITY,
    classification: "ALERTA MÁXIMO",
    title: "Seu padrão atual sugere comprometimento extremo da sua vida restante.",
    diagnosis:
      "O custo projetado já não parece apenas desconfortável. Ele se aproxima de um nível estrutural de perda de presença, energia e capacidade de direção ao longo dos próximos anos.",
    guidance:
      "Isso pede uma resposta consciente e imediata. Sua atenção precisa voltar a ser tratada como ativo central da sua vida.",
    impactPhrases: [
      "O que hoje parece hábito pode estar sequestrando uma fatia séria da sua vida restante.",
      "Quando a atenção se perde todos os dias, o prejuízo deixa de ser abstrato.",
    ],
  },
];

export function getProgress(step: number) {
  const totalSteps = questions.length + 3;
  return Math.round((step / totalSteps) * 100);
}

export function calculateRawScore(answers: AnswerMap) {
  return questions.reduce((sum, question) => {
    if (question.id === "ageRange") return sum;
    return sum + (answers[question.id] ?? 0);
  }, 0);
}

export function calculateFinalScore(rawScore: number) {
  return Math.round((rawScore / 21) * 100);
}

function getScoreSeverityIndex(score: number) {
  if (score <= 25) return 0;
  if (score <= 50) return 1;
  if (score <= 75) return 2;
  return 3;
}

export function calculateSeverityPercentage(projectedYearsLost: number, remainingYears: number) {
  if (remainingYears <= 0) return 0;
  return Number((projectedYearsLost / remainingYears).toFixed(4));
}

function getPercentageSeverityIndex(severityPercentage: number) {
  if (severityPercentage >= 0.2) return 4;
  if (severityPercentage >= 0.15) return 3;
  if (severityPercentage >= 0.1) return 2;
  if (severityPercentage >= 0.05) return 1;
  return 0;
}

export function getClassification(score: number, severityPercentage: number) {
  const percentageIndex = getPercentageSeverityIndex(severityPercentage);
  if (percentageIndex >= 4) return severityBands[4];

  const scoreIndex = getScoreSeverityIndex(score);
  const finalIndex = Math.max(scoreIndex, percentageIndex);
  return severityBands[finalIndex] ?? severityBands[severityBands.length - 1];
}

export function calculateDailyLostHours(answers: AnswerMap) {
  return Number(
    (
      Object.entries(impactHoursByAnswer).reduce((total, [questionId, weights]) => {
        const answer = answers[questionId as QuestionId] ?? 0;
        return total + (weights[answer] ?? 0);
      }, 0)
    ).toFixed(2),
  );
}

export function calculateAnnualImpact(hoursLostPerDay: number) {
  return Math.round((hoursLostPerDay * 365) / 24);
}

export function mapAgeRange(ageRange: number | undefined) {
  const ageMap = [16, 21, 29, 39, 52, 65];
  return ageMap[ageRange ?? 0] ?? 29;
}

export function calculateRemainingYears(ageAverage: number) {
  return Math.max(0, 80 - ageAverage);
}

export function calculateLifetimeImpact(daysLostPerYear: number, ageAverage: number) {
  const remainingYears = calculateRemainingYears(ageAverage);
  return Number(((daysLostPerYear * remainingYears) / 365).toFixed(1));
}

export function generateDiagnosisText(score: number) {
  return getClassification(score, 0).diagnosis;
}

export function generateFinalGuidance(score: number) {
  return getClassification(score, 0).guidance;
}

export function generateImpactPhrase(score: number) {
  const band = getClassification(score, 0);
  const phraseIndex = score % band.impactPhrases.length;
  return band.impactPhrases[phraseIndex];
}

export function calculateDiagnosis(answers: AnswerMap): Omit<Diagnosis, "emailMode"> {
  const rawScore = calculateRawScore(answers);
  const score = calculateFinalScore(rawScore);
  const ageAverage = mapAgeRange(answers.ageRange);
  const remainingYears = calculateRemainingYears(ageAverage);
  const hoursLostPerDay = calculateDailyLostHours(answers);
  const daysLostPerYear = calculateAnnualImpact(hoursLostPerDay);
  const projectedYearsLost = calculateLifetimeImpact(daysLostPerYear, ageAverage);
  const severityPercentage = calculateSeverityPercentage(projectedYearsLost, remainingYears);
  const band = getClassification(score, severityPercentage);
  const phraseIndex = score % band.impactPhrases.length;

  return {
    rawScore,
    score,
    classification: band.classification,
    severityPercentage: Number((severityPercentage * 100).toFixed(1)),
    title: band.title,
    diagnosis: band.diagnosis,
    guidance: band.guidance,
    impactPhrase: band.impactPhrases[phraseIndex],
    ageAverage,
    remainingYears,
    hoursLostPerDay,
    daysLostPerYear,
    projectedYearsLost,
  };
}

export function getSelectedLabel(questionId: string, value: number) {
  return questions
    .find((question) => question.id === questionId)
    ?.options.find((option) => option.value === value)?.label;
}

export function getQuestionTitle(questionId: string) {
  return questions.find((question) => question.id === questionId)?.title;
}

export function getAgeRangeLabel(ageRange: number | undefined) {
  if (typeof ageRange !== "number") return undefined;
  return getSelectedLabel("ageRange", ageRange);
}
