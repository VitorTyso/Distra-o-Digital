type LeadPayload = {
  email: string;
  ageLabel: string;
  ageAverage: number;
};

export async function sendLeadToGoogleSheets(payload: LeadPayload) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      ok: true,
      mode: "mock" as const,
    };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`google_sheets_failed:${response.status}`);
  }

  return {
    ok: true,
    mode: "live" as const,
  };
}
