"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Appointment = { _id: string; patientName: string; appointmentDate: string; timeSlot: string; status: string };
type Profile = { name: string; specialization: string; clinicLocation: string };

export default function DentalSurgeonOverview() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dentists/me").then((r) => r.json()),
      fetch("/api/appointments?limit=50").then((r) => r.json()),
    ]).then(([profileData, appointmentData]) => {
      if (profileData.success) setProfile(profileData.data);
      if (appointmentData.success) setAppointments(appointmentData.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      total: appointments.length,
      today: appointments.filter((a) => new Date(a.appointmentDate).toDateString() === today).length,
      pending: appointments.filter((a) => a.status === "pending").length,
      completed: appointments.filter((a) => a.status === "completed").length,
    };
  }, [appointments]);

  const upcoming = appointments.filter((a) => new Date(a.appointmentDate) >= new Date() && !["cancelled", "completed"].includes(a.status)).sort((a, b) => +new Date(a.appointmentDate) - +new Date(b.appointmentDate)).slice(0, 5);

  if (loading) return <p className="text-sm text-slate-500">Loading dashboard…</p>;

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-sky-700">Welcome back</p>
        <h2 className="text-2xl font-bold text-slate-900">{profile?.name || "Dental Surgeon"}</h2>
        <p className="text-sm text-slate-500">{profile?.specialization}{profile?.clinicLocation ? ` · ${profile.clinicLocation}` : ""}</p>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[['Total appointments', stats.total], ['Today', stats.today], ['Awaiting action', stats.pending], ['Completed', stats.completed]].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </section>
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h3 className="font-semibold text-slate-900">Upcoming appointments</h3>
          <Link href="/dentist/appointments" className="text-sm text-sky-600 hover:underline">Manage all</Link>
        </div>
        {upcoming.length ? <div className="divide-y divide-slate-100">{upcoming.map((a) => (
          <div key={a._id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
            <div><p className="font-medium text-slate-900">{a.patientName}</p><p className="text-xs text-slate-500">{new Date(a.appointmentDate).toLocaleDateString()} at {a.timeSlot}</p></div>
            <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium capitalize text-sky-700">{a.status}</span>
          </div>
        ))}</div> : <p className="p-8 text-center text-sm text-slate-500">No upcoming appointments.</p>}
      </section>
    </div>
  );
}
