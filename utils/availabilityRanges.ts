export interface TimeRange {
  startTime: string;
  endTime: string;
}

export function buildRangesFromSlots(slots: string[]): TimeRange[] {
  const normalized = [...new Set(slots.filter(Boolean).sort())].map((slot) => {
    const [hours, minutes] = slot.split(":").map(Number);
    return hours * 60 + minutes;
  });

  if (normalized.length === 0) return [];

  const ranges: TimeRange[] = [];
  let currentStart = normalized[0];
  let currentEnd = normalized[0];

  for (let index = 1; index < normalized.length; index += 1) {
    const current = normalized[index];
    const previous = normalized[index - 1];

    if (current - previous === 30) {
      currentEnd = current;
      continue;
    }

    ranges.push({
      startTime: formatMinutesToHHMM(currentStart),
      endTime: formatMinutesToHHMM(currentEnd),
    });
    currentStart = current;
    currentEnd = current;
  }

  ranges.push({
    startTime: formatMinutesToHHMM(currentStart),
    endTime: formatMinutesToHHMM(currentEnd),
  });

  return ranges;
}

function formatMinutesToHHMM(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
