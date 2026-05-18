import { NextResponse } from "next/server";
import { consultations } from "@/lib/consultations";
import { sendBookingEmails } from "@/lib/email";
import { sendVoodooSms } from "@/lib/voodoo";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const required = ["consultationId", "name", "email", "phone", "address", "date", "time"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing ${field}.` }, { status: 400 });
      }
    }

    const consultation = consultations.find((item) => item.id === body.consultationId);
    if (!consultation) {
      return NextResponse.json({ error: "Invalid consultation type." }, { status: 400 });
    }

    const payload = {
      consultationTitle: consultation.title,
      name: String(body.name),
      email: String(body.email),
      phone: String(body.phone),
      address: String(body.address),
      date: String(body.date),
      time: String(body.time),
      notes: String(body.notes || ""),
    };

    await sendBookingEmails(payload);

    try {
      await sendVoodooSms(payload);
    } catch (smsError) {
      console.error("SMS error:", smsError);
    }

    return NextResponse.json({ success: true, message: "Appointment request submitted successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Booking failed." }, { status: 500 });
  }
}
