import { google } from "googleapis";

function getAuth() {
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !key) {
    throw new Error("Missing Google Calendar credentials.");
  }

  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
}

export function getCalendarClient() {
  return google.calendar({
    version: "v3",
    auth: getAuth(),
  });
}

export async function getBusySlots(date: string) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) throw new Error("Missing GOOGLE_CALENDAR_ID.");

  const calendar = getCalendarClient();

  const timeMin = new Date(`${date}T00:00:00+00:00`).toISOString();
  const timeMax = new Date(`${date}T23:59:59+00:00`).toISOString();

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      timeZone: "Europe/London",
      items: [{ id: calendarId }],
    },
  });

  return response.data.calendars?.[calendarId]?.busy || [];
}

export async function createCalendarEvent(data: {
  consultationTitle: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  date: string;
  time: string;
  notes?: string;
}) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) throw new Error("Missing GOOGLE_CALENDAR_ID.");

  const calendar = getCalendarClient();

  const start = new Date(`${data.date}T${data.time}:00`);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const response = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: `Minar Appointment - ${data.consultationTitle}`,
      location: "Minar Jewellers, 181 Upper Tooting Road, London SW17 7TG",
      description: [
        `Consultation: ${data.consultationTitle}`,
        `Customer: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `Address: ${data.address}`,
        `Notes: ${data.notes || "None"}`,
      ].join("\n"),
      start: {
        dateTime: start.toISOString(),
        timeZone: "Europe/London",
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "Europe/London",
      },
      attendees: [{ email: data.email }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 60 },
        ],
      },
    },
    sendUpdates: "all",
  });

  return response.data;
}
