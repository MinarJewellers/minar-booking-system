import { NextResponse } from "next/server";
import { getBusySlots } from "@/lib/googleCalendar";
import { getStandardSlots } from "@/lib/slots";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Missing date." }, { status: 400 });
  }

  try {
    const standardSlots = getStandardSlots();
    const busy = await getBusySlots(date);

    const availableSlots = standardSlots.filter((slot) => {
      const slotStart = new Date(`${date}T${slot}:00`);
      const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);

      return !busy.some((busySlot) => {
        const busyStart = new Date(busySlot.start || "");
        const busyEnd = new Date(busySlot.end || "");
        return slotStart < busyEnd && slotEnd > busyStart;
      });
    });

    return NextResponse.json({ slots: availableSlots });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch slots." }, { status: 500 });
  }
}
