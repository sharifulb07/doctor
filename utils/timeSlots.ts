const STEP_MINUTES = 30;

function parseHHMM(value: string): number | null {
  const match = value.trim().match(/^(\d{2}):(\d{2})$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return hours * 60 + minutes;
}

function format12Hour(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const meridiem = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${String(hours12).padStart(2, "0")}:${String(minutes).padStart(2, "0")}${meridiem}`;
}

export function formatTimeSlot(value: string): string {
  const minutes = parseHHMM(value);
  return minutes === null ? value : format12Hour(minutes);
}

export function formatTimeSlotRange(
  value: string,
  durationMinutes = STEP_MINUTES,
): string {
  const minutes = parseHHMM(value);
  return minutes === null
    ? value
    : `${format12Hour(minutes)}–${format12Hour(minutes + durationMinutes)}`;
}

export function formatTimeSlotRanges(
  slots: string[],
  stepMinutes = STEP_MINUTES,
): string[] {
  const minutes = slots
    .map(parseHHMM)
    .filter((value): value is number => value !== null)
    .sort((a, b) => a - b);

  if (minutes.length === 0) return [];

  const uniqueMinutes = Array.from(new Set(minutes));
  const ranges: string[] = [];

  let rangeStart = uniqueMinutes[0];
  let previous = uniqueMinutes[0];

  for (let i = 1; i < uniqueMinutes.length; i += 1) {
    const current = uniqueMinutes[i];
    if (current - previous !== stepMinutes) {
      ranges.push(formatRange(rangeStart, previous + stepMinutes));
      rangeStart = current;
    }
    previous = current;
  }

  ranges.push(formatRange(rangeStart, previous + stepMinutes));
  return ranges;
}

function formatRange(startMinutes: number, endMinutes: number): string {
  return `${format12Hour(startMinutes)}–${format12Hour(endMinutes)}`;
}
