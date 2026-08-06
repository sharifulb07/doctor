"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildRangesFromSlots } from "@/utils/availabilityRanges";

interface Dentist {
  _id: string;
  name: string;
  email: string;
  photo?: string;
  specialization: string;
  experience: number;
  consultationFee: number;
  rating: number;
  isActive: boolean;
  bio?: string;
  clinicPhone?: string;
  clinicLocation?: string;
  qualifications?: string[];
  availableDays?: string[];
  availableTimeSlots?: string[];
  availableDayTimes?: Record<
    string,
    Array<{ startTime: string; endTime: string }>
  >;
  maxAppointmentsPerDay?: number;
}

interface DentistFormState {
  name: string;
  email: string;
  password: string;
  photo: string;
  specialization: string;
  qualificationsText: string;
  experience: string;
  bio: string;
  clinicLocation: string;
  clinicPhone: string;
  availableDays: string[];
  availableDayTimes: Record<
    string,
    Array<{ startTime: string; endTime: string }>
  >;
  consultationFee: string;
  maxAppointmentsPerDay: string;
  isActive: boolean;
}

const DAY_OPTIONS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DEFAULT_TIME_RANGE = {
  startTime: "09:00:00 AM",
  endTime: "04:00:00 PM",
};

function createDefaultRange() {
  return { ...DEFAULT_TIME_RANGE };
}

const DEFAULT_CREATE_FORM: DentistFormState = {
  name: "",
  email: "",
  password: "",
  photo: "",
  specialization: "",
  qualificationsText: "BDS, MDS",
  experience: "3",
  bio: "",
  clinicLocation: "",
  clinicPhone: "",
  availableDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
  availableDayTimes: {
    Sunday: [createDefaultRange()],
    Monday: [createDefaultRange()],
    Tuesday: [createDefaultRange()],
    Wednesday: [createDefaultRange()],
    Thursday: [createDefaultRange()],
  },
  consultationFee: "800",
  maxAppointmentsPerDay: "10",
  isActive: true,
};

function parseTwelveHourToMinutes(value: string): number | null {
  const match = value
    .trim()
    .match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;

  const hourRaw = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[4].toUpperCase();

  if (hourRaw < 1 || hourRaw > 12 || minute < 0 || minute > 59) return null;

  let hour24 = hourRaw % 12;
  if (meridiem === "PM") hour24 += 12;
  return hour24 * 60 + minute;
}

function minutesToHHMM(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function toTwelveHour(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return DEFAULT_TIME_RANGE.startTime;
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")}:00 ${ampm}`;
}

function buildSlotsFromRange(
  start: string,
  end: string,
  stepMinutes = 30,
): string[] {
  const startMinutes = parseTwelveHourToMinutes(start);
  const endMinutes = parseTwelveHourToMinutes(end);

  if (
    startMinutes === null ||
    endMinutes === null ||
    endMinutes <= startMinutes
  ) {
    return [];
  }

  const slots: string[] = [];
  for (let t = startMinutes; t <= endMinutes; t += stepMinutes) {
    slots.push(minutesToHHMM(t));
  }
  return slots;
}

function buildDayTimes(days: string[], slots?: string[]) {
  const ranges = buildRangesFromSlots(slots || []);

  return days.reduce<
    Record<string, Array<{ startTime: string; endTime: string }>>
  >((acc, day) => {
    acc[day] =
      ranges.length > 0
        ? ranges.map((range) => ({
            ...range,
            startTime: toTwelveHour(range.startTime),
            endTime: toTwelveHour(range.endTime),
          }))
        : [{ ...DEFAULT_TIME_RANGE }];
    return acc;
  }, {});
}

function buildDayTimesFromDentist(dentist: Dentist, days: string[]) {
  const hasExplicitDayTimes =
    dentist.availableDayTimes &&
    Object.keys(dentist.availableDayTimes).length > 0;

  if (!hasExplicitDayTimes) {
    return buildDayTimes(days, dentist.availableTimeSlots);
  }

  return days.reduce<
    Record<string, Array<{ startTime: string; endTime: string }>>
  >((acc, day) => {
    const ranges = dentist.availableDayTimes?.[day] || [];
    acc[day] =
      ranges.length > 0
        ? ranges.map((range) => ({
            startTime: toTwelveHour(range.startTime),
            endTime: toTwelveHour(range.endTime),
          }))
        : [{ ...DEFAULT_TIME_RANGE }];
    return acc;
  }, {});
}

function dentistToForm(dentist: Dentist): DentistFormState {
  const days = dentist.availableDays?.length
    ? dentist.availableDays
    : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

  return {
    name: dentist.name,
    email: dentist.email,
    password: "",
    photo: dentist.photo || "",
    specialization: dentist.specialization,
    qualificationsText: (dentist.qualifications || []).join(", "),
    experience: String(dentist.experience ?? 0),
    bio: dentist.bio || "",
    clinicLocation: dentist.clinicLocation || "",
    clinicPhone: dentist.clinicPhone || "",
    availableDays: days,
    availableDayTimes: buildDayTimesFromDentist(dentist, days),
    consultationFee: String(dentist.consultationFee ?? 0),
    maxAppointmentsPerDay: String(dentist.maxAppointmentsPerDay ?? 10),
    isActive: dentist.isActive,
  };
}

type FormTarget = "create" | "edit";

function DentistFormFields({
  form,
  setForm,
  uploadingPhoto,
  onPhotoUpload,
  isEdit,
}: {
  form: DentistFormState;
  setForm: (updater: (prev: DentistFormState) => DentistFormState) => void;
  uploadingPhoto: boolean;
  onPhotoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  isEdit: boolean;
}) {
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Name"
          required
        />
        <input
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Email"
          type="email"
          required
        />
        <input
          value={form.password}
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder={isEdit ? "Password (optional)" : "Password"}
          type="password"
          required={!isEdit}
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
          type="file"
          accept="image/*"
          onChange={onPhotoUpload}
          disabled={uploadingPhoto}
        />
        {uploadingPhoto && (
          <p className="text-xs text-slate-500 sm:col-span-2">
            Uploading photo...
          </p>
        )}
        {form.photo && (
          <div className="sm:col-span-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.photo}
              alt="Uploaded dentist"
              className="h-14 w-14 rounded-lg object-cover border border-slate-200"
            />
            <input
              value={form.photo}
              onChange={(e) =>
                setForm((p) => ({ ...p, photo: e.target.value }))
              }
              className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-600"
            />
          </div>
        )}
        <input
          value={form.specialization}
          onChange={(e) =>
            setForm((p) => ({ ...p, specialization: e.target.value }))
          }
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Specialization"
          required
        />
        <input
          value={form.experience}
          onChange={(e) =>
            setForm((p) => ({ ...p, experience: e.target.value }))
          }
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Experience (years)"
          type="number"
          min={0}
          max={60}
          required
        />
        <input
          value={form.consultationFee}
          onChange={(e) =>
            setForm((p) => ({ ...p, consultationFee: e.target.value }))
          }
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Consultation fee"
          type="number"
          min={0}
          required
        />
        <input
          value={form.maxAppointmentsPerDay}
          onChange={(e) =>
            setForm((p) => ({ ...p, maxAppointmentsPerDay: e.target.value }))
          }
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Max appointments per day"
          type="number"
          min={1}
          max={100}
          required
        />
        <input
          value={form.clinicPhone}
          onChange={(e) =>
            setForm((p) => ({ ...p, clinicPhone: e.target.value }))
          }
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Clinic phone"
          required
        />
        <input
          value={form.clinicLocation}
          onChange={(e) =>
            setForm((p) => ({ ...p, clinicLocation: e.target.value }))
          }
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Clinic location"
          required
        />
      </div>

      <textarea
        value={form.bio}
        onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        placeholder="Short bio"
        rows={3}
      />

      <input
        value={form.qualificationsText}
        onChange={(e) =>
          setForm((p) => ({ ...p, qualificationsText: e.target.value }))
        }
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        placeholder="Qualifications (comma-separated)"
        required
      />

      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">
          Available days
        </p>
        <div className="flex flex-wrap gap-2">
          {DAY_OPTIONS.map((day) => {
            const active = form.availableDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() =>
                  setForm((prev) => {
                    const hasDay = prev.availableDays.includes(day);
                    return {
                      ...prev,
                      availableDays: hasDay
                        ? prev.availableDays.filter((d) => d !== day)
                        : [...prev.availableDays, day],
                      availableDayTimes: hasDay
                        ? prev.availableDayTimes
                        : {
                            ...prev.availableDayTimes,
                            [day]: prev.availableDayTimes[day] || [
                              createDefaultRange(),
                            ],
                          },
                    };
                  })
                }
                className={`px-3 py-1.5 rounded-full text-xs border ${
                  active
                    ? "bg-sky-600 text-white border-sky-600"
                    : "bg-white text-slate-600 border-slate-300"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div>
          <p className="text-sm font-medium text-slate-700">
            Available time range per day
          </p>
          <p className="text-xs text-slate-500">
            Use format like 10:30:00 AM and 02:50:00 PM (same as your sample).
          </p>
        </div>

        {form.availableDays.length === 0 ? (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Select at least one available day to set times.
          </p>
        ) : (
          <div className="space-y-4">
            {form.availableDays.map((day) => (
              <div
                key={day}
                className="rounded-lg border border-slate-200 bg-white p-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  {day}
                </p>
                <div className="space-y-3">
                  {(form.availableDayTimes[day] || [createDefaultRange()]).map(
                    (range, rangeIndex) => (
                      <div
                        key={`${day}-${rangeIndex}`}
                        className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-slate-600">
                            Range {rangeIndex + 1}
                          </p>
                          {(form.availableDayTimes[day] || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setForm((p) => ({
                                  ...p,
                                  availableDayTimes: {
                                    ...p.availableDayTimes,
                                    [day]: (
                                      p.availableDayTimes[day] || []
                                    ).filter((_, idx) => idx !== rangeIndex),
                                  },
                                }))
                              }
                              className="text-xs text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">
                              Start time
                            </label>
                            <input
                              value={range.startTime || ""}
                              onChange={(e) =>
                                setForm((p) => ({
                                  ...p,
                                  availableDayTimes: {
                                    ...p.availableDayTimes,
                                    [day]: (p.availableDayTimes[day] || []).map(
                                      (item, idx) =>
                                        idx === rangeIndex
                                          ? {
                                              ...item,
                                              startTime: e.target.value,
                                            }
                                          : item,
                                    ),
                                  },
                                }))
                              }
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                              placeholder="10:30:00 AM"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">
                              End time
                            </label>
                            <input
                              value={range.endTime || ""}
                              onChange={(e) =>
                                setForm((p) => ({
                                  ...p,
                                  availableDayTimes: {
                                    ...p.availableDayTimes,
                                    [day]: (p.availableDayTimes[day] || []).map(
                                      (item, idx) =>
                                        idx === rangeIndex
                                          ? {
                                              ...item,
                                              endTime: e.target.value,
                                            }
                                          : item,
                                    ),
                                  },
                                }))
                              }
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                              placeholder="02:50:00 PM"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        availableDayTimes: {
                          ...p.availableDayTimes,
                          [day]: [
                            ...(p.availableDayTimes[day] || []),
                            createDefaultRange(),
                          ],
                        },
                      }))
                    }
                    className="text-xs font-medium text-sky-700 hover:text-sky-800"
                  >
                    + Add time range
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) =>
            setForm((p) => ({ ...p, isActive: e.target.checked }))
          }
        />
        Active dentist profile
      </label>
    </>
  );
}

export default function AdminDentistsPage() {
  const { t } = useLanguage();
  const ad = t.admin;
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [uploadingCreatePhoto, setUploadingCreatePhoto] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [createForm, setCreateForm] =
    useState<DentistFormState>(DEFAULT_CREATE_FORM);

  const [editingDentist, setEditingDentist] = useState<Dentist | null>(null);
  const [editingForm, setEditingForm] = useState<DentistFormState | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingEditPhoto, setUploadingEditPhoto] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  const fetchDentists = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: "12" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/dentists?${params}`);
      const data = await res.json();
      if (data.success) {
        setDentists(data.data?.dentists || []);
        setTotalPages(data.data?.pagination?.totalPages ?? 1);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchDentists();
  }, [fetchDentists]);

  async function toggleActive(dentist: Dentist) {
    setLoading(true);
    setTogglingId(dentist._id);
    try {
      const res = await fetch("/api/admin/dentists", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dentistId: dentist._id,
          isActive: !dentist.isActive,
        }),
      });
      if (res.ok) await fetchDentists();
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDeleteDentist(dentist: Dentist) {
    const ok = window.confirm(
      `Delete ${dentist.name}? This will remove the linked dentist account too.`,
    );
    if (!ok) return;

    setLoading(true);
    setDeleteId(dentist._id);
    try {
      const res = await fetch("/api/admin/dentists", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dentistId: dentist._id }),
      });
      if (res.ok) {
        await fetchDentists();
        if (editingDentist?._id === dentist._id) {
          setEditingDentist(null);
          setEditingForm(null);
        }
      }
    } finally {
      setDeleteId(null);
    }
  }

  function openEditDentist(dentist: Dentist) {
    setEditingDentist(dentist);
    setEditingForm(dentistToForm(dentist));
    setEditError("");
    setEditSuccess("");
  }

  function handlePhotoUpload(
    e: ChangeEvent<HTMLInputElement>,
    target: FormTarget,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const setUploading =
      target === "create" ? setUploadingCreatePhoto : setUploadingEditPhoto;
    const setError = target === "create" ? setCreateError : setEditError;
    const setSuccess = target === "create" ? setCreateSuccess : setEditSuccess;

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("image", file);

    fetch("/api/admin/uploads/dentist-photo", {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to upload photo");
          return;
        }

        const uploadedUrl = data?.data?.url;
        if (!uploadedUrl || typeof uploadedUrl !== "string") {
          setError("Upload succeeded but no image URL was returned");
          return;
        }

        if (target === "create") {
          setCreateForm((prev) => ({ ...prev, photo: uploadedUrl }));
        } else {
          setEditingForm((prev) =>
            prev ? { ...prev, photo: uploadedUrl } : prev,
          );
        }
        setSuccess("Photo uploaded successfully.");
      })
      .catch(() => setError("Network error while uploading photo"))
      .finally(() => {
        setUploading(false);
        e.target.value = "";
      });
  }

  async function submitDentistForm(e: FormEvent, target: FormTarget) {
    e.preventDefault();

    const form = target === "create" ? createForm : editingForm;
    if (!form) return;

    const setSubmitting = target === "create" ? setCreating : setSavingEdit;
    const setError = target === "create" ? setCreateError : setEditError;
    const setSuccess = target === "create" ? setCreateSuccess : setEditSuccess;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const qualifications = form.qualificationsText
        .split(",")
        .map((q) => q.trim())
        .filter(Boolean);

      const collectedSlots: string[] = [];
      const availableDayTimesPayload: Record<
        string,
        Array<{ startTime: string; endTime: string }>
      > = {};
      for (const day of form.availableDays) {
        const ranges = form.availableDayTimes[day] || [];
        if (ranges.length === 0) {
          setError(`Please add at least one time range for ${day}.`);
          return;
        }

        const normalizedRanges: Array<{ startTime: string; endTime: string }> =
          [];

        for (const range of ranges) {
          const start = range?.startTime?.trim() || "";
          const end = range?.endTime?.trim() || "";

          if (!start || !end) {
            setError(`Please enter start and end time for ${day}.`);
            return;
          }

          const daySlots = buildSlotsFromRange(start, end);
          if (daySlots.length === 0) {
            setError(
              `Invalid time range for ${day}. Use hh:mm:ss AM/PM and keep end time after start time.`,
            );
            return;
          }

          const startMinutes = parseTwelveHourToMinutes(start);
          const endMinutes = parseTwelveHourToMinutes(end);
          if (startMinutes === null || endMinutes === null) {
            setError(`Invalid time format for ${day}.`);
            return;
          }

          normalizedRanges.push({
            startTime: minutesToHHMM(startMinutes),
            endTime: minutesToHHMM(endMinutes),
          });

          collectedSlots.push(...daySlots);
        }

        availableDayTimesPayload[day] = normalizedRanges;
      }

      const availableTimeSlots = Array.from(new Set(collectedSlots));

      const payload: Record<string, unknown> = {
        ...(target === "edit" && editingDentist
          ? { dentistId: editingDentist._id }
          : {}),
        name: form.name,
        email: form.email,
        password: form.password.trim() || undefined,
        photo: form.photo || undefined,
        specialization: form.specialization,
        qualifications,
        experience: Number(form.experience),
        bio: form.bio,
        clinicLocation: form.clinicLocation,
        clinicPhone: form.clinicPhone,
        availableDays: form.availableDays,
        availableTimeSlots,
        availableDayTimes: availableDayTimesPayload,
        maxAppointmentsPerDay: Number(form.maxAppointmentsPerDay),
        consultationFee: Number(form.consultationFee),
        isActive: form.isActive,
      };

      const res = await fetch("/api/admin/dentists", {
        method: target === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const firstFieldError = data?.errors
          ? Object.values(data.errors).flat()[0]
          : null;
        setError(
          (typeof firstFieldError === "string" ? firstFieldError : undefined) ||
            data.message ||
            `Failed to ${target === "create" ? "create" : "update"} dentist`,
        );
        return;
      }

      setSuccess(
        target === "create"
          ? "Dentist profile created successfully."
          : "Dentist profile updated successfully.",
      );

      if (target === "create") {
        setCreateForm(DEFAULT_CREATE_FORM);
      } else {
        setEditingDentist(null);
        setEditingForm(null);
      }

      await fetchDentists();
      setLoading(false);
    } catch {
      setError(
        `Network error while ${target === "create" ? "creating" : "updating"} dentist`,
      );
    } finally {
      setSubmitting(false);
      if (target === "create" || target === "edit") {
        setLoading(false);
      }
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        {ad.manageDentists}
      </h2>

      <form
        onSubmit={(e) => submitDentistForm(e, "create")}
        className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 mb-6 space-y-4"
      >
        <h3 className="font-semibold text-slate-900">{ad.createDentist}</h3>

        {createError && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {createError}
          </p>
        )}
        {createSuccess && (
          <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            {createSuccess}
          </p>
        )}

        <DentistFormFields
          form={createForm}
          setForm={(updater) => setCreateForm(updater)}
          uploadingPhoto={uploadingCreatePhoto}
          onPhotoUpload={(e) => handlePhotoUpload(e, "create")}
          isEdit={false}
        />

        <button
          type="submit"
          disabled={creating || uploadingCreatePhoto}
          className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 disabled:opacity-60"
        >
          {creating ? "Creating..." : ad.createDentist}
        </button>
      </form>

      <div className="mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setLoading(true);
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder={ad.searchDentists}
          className="w-full max-w-sm rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {loading ? (
        <p className="text-center text-slate-400 py-12">{t.common.loading}</p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {dentists.map((d) => (
            <div
              key={d._id}
              className={`bg-white rounded-xl border p-5 ${d.isActive ? "border-slate-200" : "border-slate-200 opacity-60"}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  {d.photo && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={d.photo}
                      alt={d.name}
                      className="h-12 w-12 rounded-lg object-cover border border-slate-200 mb-2"
                    />
                  )}
                  <p className="font-semibold text-slate-900">{d.name}</p>
                  <p className="text-xs text-slate-500">{d.email}</p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                >
                  {d.isActive ? ad.statusActive : ad.statusInactive}
                </span>
              </div>

              <div className="text-sm text-slate-600 space-y-0.5 mb-4">
                <p>
                  <span className="text-slate-400">{ad.specialtyLabel}</span>{" "}
                  {d.specialization}
                </p>
                <p>
                  <span className="text-slate-400">{ad.experienceLabel}</span>{" "}
                  {d.experience} yr{d.experience !== 1 ? "s" : ""}
                </p>
                <p>
                  <span className="text-slate-400">{ad.feeLabel}</span> ৳
                  {d.consultationFee}
                </p>
                <p>
                  <span className="text-slate-400">{ad.ratingLabel}</span> ⭐{" "}
                  {d.rating?.toFixed(1) ?? "—"}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => openEditDentist(d)}
                  className="w-full py-2 rounded-lg text-sm font-medium bg-sky-50 text-sky-700 hover:bg-sky-100"
                >
                  {ad.editDentist}
                </button>
                <button
                  onClick={() => handleDeleteDentist(d)}
                  disabled={deleteId === d._id}
                  className="w-full py-2 rounded-lg text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
                >
                  {deleteId === d._id ? "Deleting..." : ad.deleteDentist}
                </button>
                <button
                  onClick={() => toggleActive(d)}
                  disabled={togglingId === d._id}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                    d.isActive
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  } disabled:opacity-50`}
                >
                  {togglingId === d._id
                    ? ad.saving
                    : d.isActive
                      ? ad.deactivate
                      : ad.activate}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && dentists.length === 0 && (
        <p className="text-center text-slate-400 py-10 text-sm">
          {ad.noDentists}
        </p>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => {
              setLoading(true);
              setPage((p) => Math.max(1, p - 1));
            }}
            disabled={page === 1}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-sm hover:bg-slate-50 disabled:opacity-40"
          >
            {ad.previous}
          </button>
          <span className="text-sm text-slate-600">
            {ad.page} {page} {ad.pageSep} {totalPages}
          </span>
          <button
            onClick={() => {
              setLoading(true);
              setPage((p) => Math.min(totalPages, p + 1));
            }}
            disabled={page === totalPages}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-sm hover:bg-slate-50 disabled:opacity-40"
          >
            {ad.next}
          </button>
        </div>
      )}

      {editingDentist && editingForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {ad.editDentist}: {editingDentist.name}
                </h3>
                <p className="text-sm text-slate-500">
                  Update profile, schedule, and linked account details.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingDentist(null);
                  setEditingForm(null);
                }}
                className="text-slate-500 hover:text-slate-900 text-2xl leading-none"
                aria-label={ad.cancel}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={(e) => submitDentistForm(e, "edit")}
              className="p-5 sm:p-6 space-y-4"
            >
              {editError && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {editError}
                </p>
              )}
              {editSuccess && (
                <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  {editSuccess}
                </p>
              )}

              <DentistFormFields
                form={editingForm}
                setForm={(updater) =>
                  setEditingForm((prev) => (prev ? updater(prev) : prev))
                }
                uploadingPhoto={uploadingEditPhoto}
                onPhotoUpload={(e) => handlePhotoUpload(e, "edit")}
                isEdit
              />

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditingDentist(null);
                    setEditingForm(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {ad.cancel}
                </button>
                <button
                  type="submit"
                  disabled={savingEdit || uploadingEditPhoto}
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 disabled:opacity-60"
                >
                  {savingEdit ? "Saving..." : ad.saveDentist}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
