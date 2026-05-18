export async function sendVoodooSms(data: {
  phone: string;
  consultationTitle: string;
  date: string;
  time: string;
}) {
  const apiKey = process.env.VOODOO_API_KEY;
  const sender = process.env.VOODOO_SENDER || "MINAR";

  if (!apiKey) {
    console.warn("Missing VOODOO API key. SMS skipped.");
    return { skipped: true };
  }

  const message = `Minar Jewellers: Your ${data.consultationTitle} request has been received for ${data.date} at ${data.time}.`;

  const response = await fetch("https://api.voodoosms.com/sendsms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      to: data.phone,
      from: sender,
      msg: message,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("VOODOO SMS failed:", errorText);
    return { error: errorText };
  }

  return response.json().catch(() => ({ ok: true }));
}
