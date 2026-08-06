import test from "node:test";
import assert from "node:assert/strict";
import { formatTimeSlot, formatTimeSlotRanges } from "../utils/timeSlots";

test("formats single times as 12-hour values without spaces", () => {
  assert.equal(formatTimeSlot("09:00"), "09:00AM");
  assert.equal(formatTimeSlot("17:00"), "05:00PM");
});

test("formats separate ranges with the same 12-hour style", () => {
  assert.deepEqual(formatTimeSlotRanges(["09:00", "09:30", "11:00"]), [
    "09:00AM–10:00AM",
    "11:00AM–11:30AM",
  ]);
});
