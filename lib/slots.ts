export function getStandardSlots() {
  return ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
}

export function formatTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(2026, 0, 1, hour, minute));
}
