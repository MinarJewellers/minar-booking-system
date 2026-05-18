import { NextResponse } from "next/server";
import { getStandardSlots } from "@/lib/slots";

export async function GET() {
  return NextResponse.json({ slots: getStandardSlots() });
}
