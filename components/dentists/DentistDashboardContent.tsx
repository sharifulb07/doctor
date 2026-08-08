"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DentistProfile {
  _id: string;
  name: string;
  specialization: string;
  clinicLocation: string;
}

interface AvailabilityRow {
  _id: string;
  date: string;
  isAvailable: boolean;
  timeSlots: { time: string; isBooked: boolean }[];
}

export default function DentistDashboardContent() {
  const { locale } = useLanguage();
  const ui = locale === "bn" ? {
    profile: "প্রোফাইল",
    schedule: "নিজের সময়সূচি নির্ধারণ বা পুনঃনির্ধারণ",
    date: "তারিখ",
    slots: "সময়ের স্লট (HH:MM, কমা দিয়ে আলাদা করুন)",
    example: "উদাহরণ: 09:00,10:00,11:00,15:30",
    available: "এই দিনটি রোগীদের বুকিংয়ের জন্য উন্মুক্ত",
    save: "সময়সূচি সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে…",
    upcoming: "আসন্ন সময়সূচি",
    loading: "সময়সূচি লোড হচ্ছে…",
    empty: "এখনও কোনো সময়সূচি পাওয়া যায়নি।",
    availableLabel: "উপলভ্য",
    unavailableLabel: "অনুপলভ্য",
    saved: "নিজের সময়সূচি সফলভাবে সংরক্ষিত হয়েছে।",
    pickDate: "অনুগ্রহ করে একটি তারিখ নির্বাচন করুন",
  } : {
    profile: "Profile",
    schedule: "Set or reschedule your own availability",
    date: "Date",
    slots: "Time slots (HH:MM, comma-separated)",
    example: "Example: 09:00,10:00,11:00,15:30",
    available: "This day is open for patient bookings",
    save: "Save schedule",
    saving: "Saving…",
    upcoming: "Upcoming availability",
    loading: "Loading availability…",
    empty: "No schedule found yet.",
    availableLabel: "Available",
    unavailableLabel: "Unavailable",
    saved: "Your schedule was saved successfully.",
    pickDate: "Please pick a date",
  };
  const [profile, setProfile] = useState<DentistProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [selectedDate, setSelectedDate] = useState("");
  const [slotsText, setSlotsText] = useState(
    "09:00,10:00,11:00,12:00,15:00,16:00",
  );
  const [isAvailable, setIsAvailable] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [upcoming, setUpcoming] = useState<AvailabilityRow[]>([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      setLoadingProfile(true);
      try {
        const res = await fetch("/api/dentists/me");
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load Dental Surgeon profile");
          return;
        }

        setProfile(data.data);
      } catch {
        setError("Network error while loading Dental Surgeon profile");
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, []);

  useEffect(() => {
    const dentistId = profile?._id;
    if (!dentistId) return;

    async function loadUpcoming() {
      setLoadingUpcoming(true);
      try {
        const res = await fetch(`/api/availability/${dentistId}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setUpcoming(data.data || []);
        }
      } finally {
        setLoadingUpcoming(false);
      }
    }

    loadUpcoming();
  }, [profile?._id]);

  useEffect(() => {
    const dentistId = profile?._id;
    if (!dentistId || !selectedDate) return;

    async function loadDay() {
      try {
        const iso = new Date(selectedDate).toISOString();
        const res = await fetch(
          `/api/availability?dentistId=${dentistId}&date=${encodeURIComponent(iso)}`,
        );
        const data = await res.json();
        if (!res.ok || !data.success) return;

        const existingSlots = (data.data?.timeSlots || [])
          .map((slot: { time: string }) => slot.time)
          .join(",");

        if (existingSlots) {
          setSlotsText(existingSlots);
        }
      } catch {
        // no-op
      }
    }

    loadDay();
  }, [profile?._id, selectedDate]);

  const parsedSlots = useMemo(
    () =>
      slotsText
        .split(",")
        .map((slot) => slot.trim())
        .filter(Boolean),
    [slotsText],
  );

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    if (!profile?._id) {
      setError("Dental Surgeon profile missing");
      setSaving(false);
      return;
    }

    if (!selectedDate) {
      setError(ui.pickDate);
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/availability/${profile._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date(selectedDate).toISOString(),
          timeSlots: parsedSlots,
          isAvailable,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to save schedule");
        return;
      }

      setMessage(ui.saved);

      const listRes = await fetch(`/api/availability/${profile._id}`);
      const listData = await listRes.json();
      if (listRes.ok && listData.success) {
        setUpcoming(listData.data || []);
      }
    } catch {
      setError("Network error while saving schedule");
    } finally {
      setSaving(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  if (loadingProfile) {
    return <p className="text-slate-500">Loading Dental Surgeon dashboard...</p>;
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error || "Could not load Dental Surgeon profile"}
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
      <div className="space-y-6">
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900">{ui.profile}</h2>
          <p className="text-sm text-slate-600 mt-2">{profile.name}</p>
          <p className="text-sm text-slate-500">{profile.specialization}</p>
          <p className="text-sm text-slate-500">{profile.clinicLocation}</p>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">
            {ui.schedule}
          </h2>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
              {error}
            </p>
          )}
          {message && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-3">
              {message}
            </p>
          )}

          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {ui.date}
              </label>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {ui.slots}
              </label>
              <input
                value={slotsText}
                onChange={(e) => setSlotsText(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                {ui.example}
              </p>
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
              />
              {ui.available}
            </label>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 disabled:opacity-60"
            >
              {saving ? ui.saving : ui.save}
            </button>
          </form>
        </section>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 p-5 h-fit">
        <h2 className="font-semibold text-slate-900 mb-3">
          {ui.upcoming}
        </h2>

        {loadingUpcoming ? (
          <p className="text-sm text-slate-500">{ui.loading}</p>
        ) : upcoming.length === 0 ? (
          <p className="text-sm text-slate-500">{ui.empty}</p>
        ) : (
          <div className="space-y-3 max-h-135 overflow-auto pr-1">
            {upcoming.map((row) => (
              <div
                key={row._id}
                className="rounded-lg border border-slate-200 p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(row.date).toLocaleDateString("en-US")}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      row.isAvailable
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {row.isAvailable ? ui.availableLabel : ui.unavailableLabel}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {row.timeSlots.map((slot) => (
                    <span
                      key={`${row._id}-${slot.time}`}
                      className={`text-xs px-2 py-1 rounded-md border ${
                        slot.isBooked
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      }`}
                    >
                      {slot.time}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
