export function isDailyAppointmentLimitReached(
  bookedCount: number,
  maxAppointmentsPerDay: number,
): boolean {
  return bookedCount >= maxAppointmentsPerDay;
}
