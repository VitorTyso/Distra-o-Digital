type LeadPayload = {
  email: string;
  ageLabel: string;
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
              email: payload.email,
              "Faixa etaria": payload.ageLabel,
            },
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`airtable_failed:${response.status}:${errorText}`);
  }

  return {
    ok: true,
  };
}
