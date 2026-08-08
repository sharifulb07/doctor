"use client";

import { useCallback, useEffect, useState } from "react";
import { AppointmentStatus } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

type Appointment = { _id: string; patientName: string; phone?: string; patientId?: { name?: string; email?: string; phone?: string }; appointmentDate: string; timeSlot: string; status: string; notes?: string };
const statuses = ["", "pending", "confirmed", "completed", "cancelled"];
const colors: Record<string, string> = { pending: "bg-amber-100 text-amber-700", confirmed: "bg-sky-100 text-sky-700", completed: "bg-emerald-100 text-emerald-700", cancelled: "bg-red-100 text-red-700" };

export default function DentalSurgeonAppointments() {
  const { locale } = useLanguage();
  const ui = locale === "bn" ? {
    title: "অ্যাপয়েন্টমেন্ট",
    subtitle: "আপনার রোগীদের বুকিং পরিচালনা ও পুনঃনির্ধারণ করুন",
    all: "সব",
    pending: "অপেক্ষমাণ",
    confirmed: "নিশ্চিত",
    completed: "সম্পন্ন",
    cancelled: "বাতিল",
    patient: "রোগী",
    dateTime: "তারিখ ও সময়",
    notes: "নোট",
    status: "অবস্থা",
    actions: "কার্যক্রম",
    confirm: "নিশ্চিত করুন",
    complete: "সম্পন্ন করুন",
    reschedule: "পুনঃনির্ধারণ",
    cancel: "বাতিল করুন",
    loading: "অ্যাপয়েন্টমেন্ট লোড হচ্ছে…",
    empty: "কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।",
    modalTitle: "রোগীর অ্যাপয়েন্টমেন্ট পুনঃনির্ধারণ",
    modalText: "এর জন্য নতুন তারিখ ও আপনার সুবিধাজনক সময় নির্বাচন করুন:",
    date: "তারিখ",
    time: "সময়",
    close: "বন্ধ করুন",
    save: "নতুন সময় সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে…",
    updateError: "অ্যাপয়েন্টমেন্ট আপডেট করা যায়নি",
  } : {
    title: "Appointments",
    subtitle: "Manage and reschedule your patient bookings",
    all: "All", pending: "Pending", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled",
    patient: "Patient", dateTime: "Date & time", notes: "Notes", status: "Status", actions: "Actions",
    confirm: "Confirm", complete: "Complete", reschedule: "Reschedule", cancel: "Cancel",
    loading: "Loading appointments…", empty: "No appointments found.",
    modalTitle: "Reschedule patient appointment",
    modalText: "Choose a new date and a suitable time for:",
    date: "Date", time: "Time", close: "Close", save: "Save new time", saving: "Saving…",
    updateError: "Could not update appointment",
  };
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState("");
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const query = new URLSearchParams({ limit: "50" });
    if (filter) query.set("status", filter);
    try { const data = await fetch(`/api/appointments?${query}`).then((r) => r.json()); if (data.success) setAppointments(data.data || []); }
    finally { setLoading(false); }
  }, [filter]);
  useEffect(() => { load(); }, [load]);

  async function patch(id: string, body: object) {
    setActing(id); setError("");
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.message || ui.updateError); return false; }
      await load(); return true;
    } finally { setActing(""); }
  }

  async function submitReschedule(e: React.FormEvent) {
    e.preventDefault();
    if (!rescheduling) return;
    const ok = await patch(rescheduling._id, { appointmentDate: new Date(`${newDate}T00:00:00`).toISOString(), timeSlot: newTime });
    if (ok) { setRescheduling(null); setNewDate(""); setNewTime(""); }
  }

  return (
    <div>
      <div className="mb-5"><h2 className="text-xl font-bold text-slate-900">{ui.title}</h2><p className="text-sm text-slate-500">{ui.subtitle}</p></div>
      {error && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="mb-5 flex flex-wrap gap-2">{statuses.map((status) => <button key={status} onClick={() => setFilter(status)} className={`rounded-full border px-4 py-1.5 text-sm ${filter === status ? "border-sky-600 bg-sky-600 text-white" : "border-slate-300 bg-white text-slate-600"}`}>{status ? ui[status as "pending" | "confirmed" | "completed" | "cancelled"] : ui.all}</button>)}</div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3 text-left">{ui.patient}</th><th className="px-4 py-3 text-left">{ui.dateTime}</th><th className="px-4 py-3 text-left">{ui.notes}</th><th className="px-4 py-3 text-left">{ui.status}</th><th className="px-4 py-3 text-left">{ui.actions}</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{appointments.map((appointment) => <tr key={appointment._id} className="hover:bg-slate-50"><td className="px-4 py-3"><p className="font-medium text-slate-900">{appointment.patientId?.name || appointment.patientName}</p><p className="text-xs text-slate-500">{appointment.patientId?.phone || appointment.phone || appointment.patientId?.email || "—"}</p></td><td className="px-4 py-3 text-slate-600">{new Date(appointment.appointmentDate).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US")}<br/><span className="text-xs">{appointment.timeSlot}</span></td><td className="max-w-48 truncate px-4 py-3 text-slate-500">{appointment.notes || "—"}</td><td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs ${colors[appointment.status]}`}>{ui[appointment.status as "pending" | "confirmed" | "completed" | "cancelled"]}</span></td><td className="px-4 py-3"><div className="flex flex-wrap gap-2">{appointment.status === "pending" && <button disabled={acting === appointment._id} onClick={() => patch(appointment._id, { status: AppointmentStatus.CONFIRMED })} className="rounded bg-sky-600 px-2.5 py-1 text-xs text-white">{ui.confirm}</button>}{appointment.status === "confirmed" && <button disabled={acting === appointment._id} onClick={() => patch(appointment._id, { status: AppointmentStatus.COMPLETED })} className="rounded bg-emerald-600 px-2.5 py-1 text-xs text-white">{ui.complete}</button>}{!["cancelled", "completed"].includes(appointment.status) && <><button onClick={() => { setRescheduling(appointment); setNewDate(appointment.appointmentDate.slice(0, 10)); setNewTime(appointment.timeSlot); }} className="rounded bg-violet-100 px-2.5 py-1 text-xs text-violet-700">{ui.reschedule}</button><button disabled={acting === appointment._id} onClick={() => patch(appointment._id, { status: AppointmentStatus.CANCELLED })} className="rounded bg-red-100 px-2.5 py-1 text-xs text-red-700">{ui.cancel}</button></>}</div></td></tr>)}</tbody>
        </table>
        {loading && <p className="p-8 text-center text-slate-500">{ui.loading}</p>}{!loading && appointments.length === 0 && <p className="p-8 text-center text-slate-500">{ui.empty}</p>}
      </div>
      {rescheduling && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true"><form onSubmit={submitReschedule} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"><h3 className="text-lg font-semibold text-slate-900">{ui.modalTitle}</h3><p className="mb-4 text-sm text-slate-500">{ui.modalText} {rescheduling.patientId?.name || rescheduling.patientName}</p><label className="mb-1 block text-sm font-medium">{ui.date}</label><input required type="date" min={new Date().toISOString().slice(0, 10)} value={newDate} onChange={(e) => setNewDate(e.target.value)} className="mb-3 w-full rounded-lg border border-slate-300 px-3 py-2"/><label className="mb-1 block text-sm font-medium">{ui.time} (HH:MM)</label><input required type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2"/><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setRescheduling(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">{ui.close}</button><button disabled={!!acting} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white">{acting ? ui.saving : ui.save}</button></div></form></div>}
    </div>
  );
}
