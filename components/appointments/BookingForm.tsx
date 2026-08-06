"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatTimeSlot, formatTimeSlotRanges } from "@/utils/timeSlots";

interface Dentist {
  _id: string;
  name: string;
  specialization: string;
  clinicLocation: string;
  consultationFee: number;
  availableDays: string[];
  availableTimeSlots: string[];
  availableDayTimes?: Record<
    string,
    Array<{ startTime: string; endTime: string }>
  >;
}

interface TimeSlot {
  time: string;
  isBooked: boolean;
}

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedDentistId = searchParams.get("dentistId") || "";

  const { t } = useLanguage();
  const bk = t.bookAppointment;
  const treatmentOptions = bk.treatmentOptions ?? [];

  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const [form, setForm] = useState({
    dentistId: preselectedDentistId,
    appointmentDate: "",
    timeSlot: "",
    patientName: "",
    phone: "",
    treatmentType: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedDentist = dentists.find((d) => d._id === form.dentistId);
  const selectedDateWeekday = form.appointmentDate
    ? new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
        new Date(`${form.appointmentDate}T12:00:00`),
      )
    : "";
  const selectedDateExplicitRanges = useMemo(() => {
    if (!selectedDentist || !selectedDateWeekday) return [] as string[];
    const dayRanges = selectedDentist.availableDayTimes?.[selectedDateWeekday];
    if (!dayRanges || dayRanges.length === 0) return [] as string[];

    return dayRanges.map(
      (range) =>
        `${formatTimeSlot(range.startTime)}–${formatTimeSlot(range.endTime)}`,
    );
  }, [selectedDentist, selectedDateWeekday]);
  const selectedDentistRanges = useMemo(() => {
    if (!selectedDentist) return [];

    if (
      selectedDateWeekday &&
      selectedDentist.availableDayTimes?.[selectedDateWeekday]
    ) {
      return selectedDentist.availableDayTimes[selectedDateWeekday].map(
        (range) =>
          `${formatTimeSlot(range.startTime)}–${formatTimeSlot(range.endTime)}`,
      );
    }

    if (
      selectedDentist.availableDayTimes &&
      Object.keys(selectedDentist.availableDayTimes).length > 0
    ) {
      const orderedDays =
        selectedDentist.availableDays.length > 0
          ? selectedDentist.availableDays
          : Object.keys(selectedDentist.availableDayTimes);

      const dayLabels = orderedDays.flatMap((day) => {
        const dayRanges = selectedDentist.availableDayTimes?.[day] || [];
        return dayRanges.map(
          (range) =>
            `${day}: ${formatTimeSlot(range.startTime)}–${formatTimeSlot(range.endTime)}`,
        );
      });

      if (dayLabels.length > 0) return dayLabels;
    }

    return formatTimeSlotRanges(selectedDentist.availableTimeSlots || []);
  }, [selectedDentist, selectedDateWeekday]);
  const isDateMatched =
    !selectedDentist ||
    !form.appointmentDate ||
    selectedDentist.availableDays.includes(selectedDateWeekday);

  // Load dentists
  useEffect(() => {
    fetch("/api/dentists?limit=100")
      .then((r) => r.json())
      .then((d) => setDentists(d.data || []));
  }, []);

  // Load time slots when dentist + date changes
  useEffect(() => {
    if (!form.dentistId || !form.appointmentDate) {
      return;
    }

    if (selectedDentist && !isDateMatched) {
      return;
    }

    const iso = new Date(`${form.appointmentDate}T12:00:00`).toISOString();
    fetch(`/api/availability?dentistId=${form.dentistId}&date=${iso}`)
      .then((r) => r.json())
      .then((d) => setTimeSlots(d.data?.timeSlots || []));
  }, [form.dentistId, form.appointmentDate, selectedDentist, isDateMatched]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
    // Reset time slot when date changes
    if (name === "appointmentDate" || name === "dentistId") {
      setForm((prev) => ({ ...prev, [name]: value, timeSlot: "" }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setServerError("");

    if (selectedDentist && form.appointmentDate && !isDateMatched) {
      setErrors((prev) => ({
        ...prev,
        appointmentDate: bk.dateNotAvailable,
      }));
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...form,
        appointmentDate: new Date(
          `${form.appointmentDate}T12:00:00`,
        ).toISOString(),
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login?redirect=/book-appointment");
          return;
        }

        if (data.errors) {
          const flat: Record<string, string> = {};
          for (const [k, v] of Object.entries(data.errors)) {
            flat[k] = (v as string[])[0];
          }
          setErrors(flat);
        } else {
          setServerError(data.message || bk.bookingFailed);
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/appointments"), 2000);
    } catch {
      setServerError(bk.networkError);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card>
        <CardBody className="text-center py-12">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {bk.bookingSuccess}
          </h2>
          <p className="text-slate-600">{bk.bookingSuccessMsg}</p>
        </CardBody>
      </Card>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-6">
        {serverError && (
          <div
            role="alert"
            className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          >
            {serverError}
          </div>
        )}

        {/* Dentist Selection */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-900">{bk.selectDentist}</h2>
          </CardHeader>
          <CardBody className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="dentistId"
                className="text-sm font-medium text-slate-700"
              >
                {bk.dentistLabel} <span className="text-red-500">*</span>
              </label>
              <select
                id="dentistId"
                name="dentistId"
                value={form.dentistId}
                onChange={handleChange}
                required
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">{bk.selectDentistOption}</option>
                {dentists.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} — {d.specialization} (৳{d.consultationFee})
                  </option>
                ))}
              </select>
              {errors.dentistId && (
                <p className="text-xs text-red-500">{errors.dentistId}</p>
              )}
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  {bk.availabilitySummary}
                </h3>
                {selectedDentist && (
                  <span className="text-xs text-slate-500">
                    {selectedDentist.name}
                  </span>
                )}
              </div>

              {!selectedDentist ? (
                <p className="text-sm text-slate-500">
                  {bk.selectDentistToViewAvailability}
                </p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
                      {bk.availableDays}
                    </p>
                    {selectedDentist.availableDays.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedDentist.availableDays.map((day) => (
                          <span
                            key={day}
                            className="inline-flex items-center rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">
                        {bk.noAvailabilitySet}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
                      {bk.availableTimes}
                    </p>
                    {selectedDentistRanges.length > 0 ? (
                      <div className="space-y-2">
                        {selectedDentistRanges.length > 1 && (
                          <p className="text-xs font-medium text-slate-500">
                            multiple
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {selectedDentistRanges.map((range) => (
                            <span
                              key={range}
                              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
                            >
                              {range}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">
                        {bk.noAvailabilitySet}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Date & Time */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-900">{bk.dateTime}</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label={bk.dateLabel}
              name="appointmentDate"
              type="date"
              value={form.appointmentDate}
              onChange={handleChange}
              error={
                errors.appointmentDate ||
                (selectedDentist && form.appointmentDate && !isDateMatched
                  ? bk.dateNotAvailable
                  : "")
              }
              min={today}
              required
            />

            {selectedDentist && form.appointmentDate && (
              <div
                className={`rounded-lg border p-4 ${
                  isDateMatched
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
                  {bk.selectedDateLabel}
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {form.appointmentDate}{" "}
                  {selectedDateWeekday && `(${selectedDateWeekday})`}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    isDateMatched ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {isDateMatched ? bk.dateMatches : bk.dateNotAvailable}
                </p>
                {selectedDentist.availableDays.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedDentist.availableDays.map((day) => (
                      <span
                        key={day}
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          day === selectedDateWeekday
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {form.dentistId && form.appointmentDate && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  {bk.timeSlot} <span className="text-red-500">*</span>
                </label>
                {!isDateMatched ? (
                  <p className="text-sm text-slate-500">{bk.noSlots}</p>
                ) : timeSlots.length === 0 ? null : (
                  <div className="space-y-3">
                    {(selectedDateExplicitRanges.length > 0
                      ? selectedDateExplicitRanges
                      : formatTimeSlotRanges(timeSlots.map((slot) => slot.time))
                    ).length > 1 && (
                      <p className="text-xs font-medium text-slate-500">
                        multiple
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {(selectedDateExplicitRanges.length > 0
                        ? selectedDateExplicitRanges
                        : formatTimeSlotRanges(
                            timeSlots.map((slot) => slot.time),
                          )
                      ).map((range) => (
                        <span
                          key={range}
                          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
                        >
                          {range}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={slot.isBooked}
                          onClick={() =>
                            !slot.isBooked &&
                            setForm((p) => ({ ...p, timeSlot: slot.time }))
                          }
                          className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                            slot.isBooked
                              ? "border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed line-through"
                              : form.timeSlot === slot.time
                                ? "border-sky-500 bg-sky-500 text-white"
                                : "border-slate-300 bg-white text-slate-700 hover:border-sky-400 hover:text-sky-600"
                          }`}
                        >
                          {formatTimeSlot(slot.time)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {errors.timeSlot && (
                  <p className="text-xs text-red-500">{errors.timeSlot}</p>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Patient Info */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-900">{bk.patientInfo}</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label={bk.patientName}
              name="patientName"
              type="text"
              value={form.patientName}
              onChange={handleChange}
              error={errors.patientName}
              required
              placeholder="Jane Smith"
            />
            <Input
              label={bk.phone}
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
              required
              placeholder="+1 555 123 4567"
            />

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="treatmentType"
                className="text-sm font-medium text-slate-700"
              >
                {bk.treatmentType}
              </label>
              <select
                id="treatmentType"
                name="treatmentType"
                value={form.treatmentType}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">{bk.selectTreatment}</option>
                {treatmentOptions.map((treatmentOption) => (
                  <option
                    key={treatmentOption.value}
                    value={treatmentOption.value}
                  >
                    {treatmentOption.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="notes"
                className="text-sm font-medium text-slate-700"
              >
                {bk.notes}
              </label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                maxLength={1000}
                placeholder={bk.notesPlaceholder}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              />
            </div>
          </CardBody>
        </Card>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={loading}
          disabled={!form.dentistId || !form.appointmentDate || !form.timeSlot}
        >
          {bk.confirmBooking}
        </Button>
      </div>
    </form>
  );
}
