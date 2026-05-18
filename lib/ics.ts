function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toIcsDate(date: Date) {
  return date.getUTCFullYear() + pad(date.getUTCMonth() + 1) + pad(date.getUTCDate()) + "T" + pad(date.getUTCHours()) + pad(date.getUTCMinutes()) + pad(date.getUTCSeconds()) + "Z";
}

function escapeIcsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function createCalendarInvite(data: {
  consultationTitle: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  date: string;
  time: string;
  notes?: string;
}) {
  const start = new Date(`${data.date}T${data.time}:00+01:00`);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const uid = `minar-${Date.now()}@minarjewellers.com`;
  const location = "Minar Jewellers, 181 Upper Tooting Road, London SW17 7TG";
  const adminEmail = process.env.ADMIN_EMAIL || "onlineorders@minarjewellers.com";

  const description = [
    `Consultation: ${data.consultationTitle}`,
    `Customer: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Address: ${data.address}`,
    `Notes: ${data.notes || "None"}`
  ].join("\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Minar Jewellers//Booking System//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(`Minar Appointment - ${data.consultationTitle}`)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(location)}`,
    `ORGANIZER;CN=Minar Jewellers:MAILTO:${adminEmail}`,
    `ATTENDEE;CN=${escapeIcsText(data.name)};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:MAILTO:${data.email}`,
    `ATTENDEE;CN=Minar Jewellers;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:MAILTO:${adminEmail}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\\r\\n");
}
