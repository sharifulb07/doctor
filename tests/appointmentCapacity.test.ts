import test from "node:test";
import assert from "node:assert/strict";
import { isDailyAppointmentLimitReached } from "../utils/appointmentCapacity";
import { buildRangesFromSlots } from "../utils/availabilityRanges";

test("counts a day as full when appointments reach the limit", () => {
  assert.equal(isDailyAppointmentLimitReached(5, 5), true);
  assert.equal(isDailyAppointmentLimitReached(4, 5), false);
});

test("reconstructs multiple time ranges from saved slots", () => {
  assert.deepEqual(
    buildRangesFromSlots([
      "09:00",
      "09:30",
      "10:00",
      "14:00",
      "14:30",
      "15:00",
    ]),
    [
      { startTime: "09:00", endTime: "10:00" },
      { startTime: "14:00", endTime: "15:00" },
    ],
  );
});
