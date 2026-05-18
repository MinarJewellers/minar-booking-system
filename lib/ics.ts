function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toICSDate(date: Date) {
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

function escapeICS(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
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
  const startDate = new Date(`${data.date}T${data.time}:00+01:00`);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const adminEmail =
    process.env.ADMIN_EMAIL || "onlineorders@minarjewellers.com";

  const location =
    "Minar Jewellers, 181 Upper Tooting Road, London SW17 7TG";

  const description = `
Consultation: ${data.consultationTitle}
Customer: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Address: ${data.address}
Notes: ${data.notes || "None"}
  `.trim();

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Minar Jewellers//Appointment Booking//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:minar-${Date.now()}@minarjewellers.com
DTSTAMP:${toICSDate(new Date())}
DTSTART:${toICSDate(startDate)}
DTEND:${toICSDate(endDate)}
SUMMARY:${escapeICS(`Minar Appointment - ${data.consultationTitle}`)}
DESCRIPTION:${escapeICS(description)}
LOCATION:${escapeICS(location)}
ORGANIZER;CN=Minar Jewellers:MAILTO:${adminEmail}
ATTENDEE;CN=${escapeICS(data.name)};ROLE=REQ-PARTICIPANT;RSVP=TRUE:MAILTO:${data.email}
ATTENDEE;CN=Minar Jewellers;ROLE=REQ-PARTICIPANT;RSVP=TRUE:MAILTO:${adminEmail}
STATUS:CONFIRMED
SEQUENCE:0
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;
}
