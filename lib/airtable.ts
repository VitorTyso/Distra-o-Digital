type LeadPayload = {
  email: string;
  ageLabel: string;
  ageAverage: number;
};

export async function sendLeadToAirtable(payload: LeadPayload) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

  if (!apiKey || !baseId || !tableName) {
    return {
      ok: true,
      mode: "mock" as const,
    };
  }

  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Email: payload.email,
              "Faixa etaria": payload.ageLabel,
              "Idade media": payload.ageAverage,
            },
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`airtable_failed:${response.status}`);
  }

  return {
    ok: true,
    mode: "live" as const,
  };
}
