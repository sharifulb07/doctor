"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  formatTimeSlot,
  formatTimeSlotRange,
  formatTimeSlotRanges,
} from "@/utils/timeSlots";

interface TimeSlot {
  time: string;
  isBooked: boolean;
}

interface AppointmentDetail {
  _id: string;
  patientName: string;
  appointmentDate: string;
  timeSlot: string;
  dentistId: string | { _id: string };
  status: string;
}

export default function ReschedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t, locale } = useLanguage();
  const rs = t.reschedule;

  const [appointment, setAppointment] = useState<AppointmentDetail | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<TimeSlot[] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Minimum date = tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];
  const currentAppointmentRange = formatTimeSlotRange(
    appointment?.timeSlot ?? "",
  );
  const loadingSlots = Boolean(selectedDate && slots === null);
  const availableSlotRanges = formatTimeSlotRanges(
    (slots ?? []).map((slot) => slot.time),
  );

  useEffect(() => {
    fetch(`/api/appointments/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setAppointment(d.data);
      });
  }, [id]);

  useEffect(() => {
    if (!selectedDate || !appointment) return;

    let cancelled = false;
    const dentistId =
      typeof appointment.dentistId === "object"
        ? appointment.dentistId._id
        : appointment.dentistId;

    fetch(`/api/availability?dentistId=${dentistId}&date=${selectedDate}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.success) {
          setSlots(d.data?.timeSlots ?? d.data?.slots ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, appointment]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      setError(rs.selectBoth);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentDate: new Date(`${selectedDate}T12:00:00`).toISOString(),
          timeSlot: selectedSlot,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || t.common.error);
        return;
      }
      router.push("/appointments");
    } finally {
      setSubmitting(false);
    }
  }

  if (!appointment) {
    return (
      <p className="text-center text-slate-400 py-20">{t.common.loading}</p>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{rs.title}</h1>
        <p className="text-sm text-slate-500 mb-6">
          {rs.currentlyBooked}{" "}
          <span className="font-medium text-slate-700">
            {new Date(appointment.appointmentDate).toLocaleDateString(
              locale === "bn" ? "bn-BD" : "en-US",
            )}{" "}
            {rs.at} {currentAppointmentRange}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Date picker */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {rs.newDate}
            </label>
            <input
              type="date"
              min={minDateStr}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot("");
                setSlots(null);
              }}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {rs.newTimeSlot}
              </label>
              {loadingSlots ? (
                <p className="text-sm text-slate-400">{rs.loadingSlots}</p>
              ) : (slots ?? []).length === 0 ? (
                <p className="text-sm text-slate-400">{rs.noSlots}</p>
              ) : (
                <div className="space-y-3">
                  {availableSlotRanges.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {availableSlotRanges.map((range) => (
                        <span
                          key={range}
                          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
                        >
                          {range}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2">
                    {(slots ?? []).map((s) => (
                      <button
                        key={s.time}
                        type="button"
                        disabled={s.isBooked}
                        onClick={() => setSelectedSlot(s.time)}
                        className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                          s.isBooked
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border-transparent"
                            : selectedSlot === s.time
                              ? "bg-sky-600 text-white border-sky-600"
                              : "bg-white text-slate-700 border-slate-300 hover:border-sky-400"
                        }`}
                      >
                        {formatTimeSlot(s.time)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedSlot}
              className="flex-1 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 disabled:opacity-50"
            >
              {submitting ? rs.submitting : rs.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
