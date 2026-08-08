"use client";

import { useEffect, useMemo, useState } from "react";

type Appointment = { patientName: string; phone?: string; patientId?: { _id?: string; name?: string; email?: string; phone?: string }; appointmentDate: string; status: string };

export default function DentalSurgeonPatients() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/appointments?limit=50").then((r) => r.json()).then((d) => d.success && setAppointments(d.data || [])).finally(() => setLoading(false)); }, []);
  const patients = useMemo(() => {
    const map = new Map<string, { name: string; email: string; phone: string; visits: number; lastVisit: string }>();
    appointments.forEach((a) => {
      const key = a.patientId?._id || a.patientId?.email || a.phone || a.patientName;
      const row = map.get(key) || { name: a.patientId?.name || a.patientName, email: a.patientId?.email || "—", phone: a.patientId?.phone || a.phone || "—", visits: 0, lastVisit: a.appointmentDate };
      row.visits += 1;
      if (new Date(a.appointmentDate) > new Date(row.lastVisit)) row.lastVisit = a.appointmentDate;
      map.set(key, row);
    });
    return [...map.values()].filter((p) => `${p.name} ${p.email} ${p.phone}`.toLowerCase().includes(search.toLowerCase()));
  }, [appointments, search]);
  return <div>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-900">Patients</h2><p className="text-sm text-slate-500">Patients who have booked with this Dental Surgeon</p></div><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patients…" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" /></div>
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white"><table className="w-full text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3 text-left">Patient</th><th className="px-4 py-3 text-left">Mobile</th><th className="px-4 py-3 text-left">Appointments</th><th className="px-4 py-3 text-left">Latest appointment</th></tr></thead><tbody className="divide-y divide-slate-100">{patients.map((p) => <tr key={`${p.email}-${p.phone}`}><td className="px-4 py-3"><p className="font-medium text-slate-900">{p.name}</p><p className="text-xs text-slate-500">{p.email}</p></td><td className="px-4 py-3 text-slate-600">{p.phone}</td><td className="px-4 py-3 text-slate-600">{p.visits}</td><td className="px-4 py-3 text-slate-600">{new Date(p.lastVisit).toLocaleDateString()}</td></tr>)}</tbody></table>{loading && <p className="p-8 text-center text-slate-500">Loading patients…</p>}{!loading && patients.length === 0 && <p className="p-8 text-center text-slate-500">No patients found.</p>}</div>
  </div>;
}
