export const OPENING_HOURS = {
  startHour: 10,
  endHour: 17,
  slotMinutes: 60,
};

export function getStandardSlots() {
  const slots: string[] = [];

  for (let hour = OPENING_HOURS.startHour; hour <= OPENING_HOURS.endHour; hour++) {
    const value = `${String(hour).padStart(2, "0")}:00`;
    if (value !== "13:00") slots.push(value); // lunch blocked
  }

  return slots;
}

export function formatTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(2026, 0, 1, hour, minute));
}
