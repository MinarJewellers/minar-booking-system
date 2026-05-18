export async function sendVoodooSms(data: {
  phone: string;
  consultationTitle: string;
  date: string;
  time: string;
}) {
  const apiKey = process.env.VOODOO_API_KEY;
  const apiSecret = process.env.VOODOO_API_SECRET;
  const sender = process.env.VOODOO_SENDER || "MINAR";

  if (!apiKey || !apiSecret) {
    throw new Error("Missing VOODOO SMS credentials.");
  }

  const message = `Minar Jewellers: Your ${data.consultationTitle} is booked for ${data.date} at ${data.time}. We look forward to welcoming you.`;

  const response = await fetch("https://api.voodoosms.com/sendsms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}:${apiSecret}`,
    },
    body: JSON.stringify({
      to: data.phone,
      from: sender,
      body: message,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`VOODOO SMS failed: ${errorText}`);
  }

  return response.json().catch(() => ({ ok: true }));
}
