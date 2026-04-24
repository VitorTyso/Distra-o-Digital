type LeadPayload = {
  email: string;
  ageLabel: string;
  ageAverage: number;
};

export async function sendLeadToAirtable(payload: LeadPayload) {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

  if (!token || !baseId || !tableName) {
    throw new Error("airtable_not_configured");
  }

  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
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
  };
}
