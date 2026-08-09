"use client";

import { useEffect, useMemo, useState } from "react";
import { FiFileText, FiPlus, FiTrash2, FiX } from "react-icons/fi";

type Appointment = { _id: string; patientName: string; phone?: string; patientId?: { _id?: string; name?: string; email?: string; phone?: string }; appointmentDate: string; createdAt: string };
type PatientRow = { name: string; email: string; phone: string; visits: number; latestAppointment: string; latestBooking: string; appointmentId: string };
type Medicine = { name: string; strength: string; dosage: string; frequency: string; duration: string; instructions: string };
const emptyMedicine = (): Medicine => ({ name: "", strength: "", dosage: "1 tablet", frequency: "Twice daily", duration: "5 days", instructions: "After food" });

export default function DentalSurgeonPatients() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<PatientRow | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([emptyMedicine()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetch("/api/appointments?limit=50").then((r) => r.json()).then((d) => d.success && setAppointments(d.data || [])).finally(() => setLoading(false)); }, []);

  const patients = useMemo(() => {
    const rows = new Map<string, PatientRow>();
    appointments.forEach((a) => {
      const phone = a.phone || a.patientId?.phone || "-";
      const name = a.patientName || a.patientId?.name || "Patient";
      const key = `${name.trim().toLowerCase()}|${phone.replace(/\D/g, "")}`;
      const existing = rows.get(key);
      if (!existing) rows.set(key, { name, email: a.patientId?.email || "-", phone, visits: 1, latestAppointment: a.appointmentDate, latestBooking: a.createdAt, appointmentId: a._id });
      else {
        existing.visits++;
        if (new Date(a.appointmentDate) > new Date(existing.latestAppointment)) { existing.latestAppointment = a.appointmentDate; existing.appointmentId = a._id; }
        if (new Date(a.createdAt) > new Date(existing.latestBooking)) existing.latestBooking = a.createdAt;
      }
    });
    const q = search.trim().toLowerCase();
    return [...rows.values()].filter((p) => `${p.name} ${p.email} ${p.phone}`.toLowerCase().includes(q));
  }, [appointments, search]);

  function updateMedicine(index: number, field: keyof Medicine, value: string) {
    setMedicines((current) => current.map((m, i) => i === index ? { ...m, [field]: value } : m));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!patient) return;
    setSaving(true); setError("");
    const form = new FormData(event.currentTarget);
    const age = form.get("patientAge")?.toString();
    const body = { appointmentId: patient.appointmentId, patientAge: age ? Number(age) : undefined, patientGender: form.get("patientGender"), diagnosis: form.get("diagnosis"), complaints: form.get("complaints"), investigations: form.get("investigations"), advice: form.get("advice"), followUpDate: form.get("followUpDate"), medicines };
    try {
      const res = await fetch("/api/prescriptions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Could not create prescription"); return; }
      window.location.href = `/dentist/prescriptions/${data.data._id}`;
    } catch { setError("Network error while creating prescription"); } finally { setSaving(false); }
  }

  return <div>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-900">Patients</h2><p className="text-sm text-slate-500">View patients and create prescriptions</p></div><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patients..." className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" /></div>
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white"><table className="w-full text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3 text-left">Patient</th><th className="px-4 py-3 text-left">Mobile</th><th className="px-4 py-3 text-left">Visits</th><th className="px-4 py-3 text-left">Latest appointment</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{patients.map((p) => <tr key={`${p.name}-${p.phone}`}><td className="px-4 py-3"><p className="font-medium text-slate-900">{p.name}</p><p className="text-xs text-slate-500">{p.email}</p></td><td className="px-4 py-3 text-slate-600">{p.phone}</td><td className="px-4 py-3 text-slate-600">{p.visits}</td><td className="whitespace-nowrap px-4 py-3 text-slate-600">{new Date(p.latestAppointment).toLocaleDateString()}</td><td className="px-4 py-3 text-right"><button onClick={() => { setPatient(p); setMedicines([emptyMedicine()]); setError(""); }} className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-xs font-medium text-white hover:bg-sky-700"><FiFileText /> Prescribe</button></td></tr>)}</tbody></table>{loading && <p className="p-8 text-center text-slate-500">Loading patients...</p>}{!loading && patients.length === 0 && <p className="p-8 text-center text-slate-500">No patients found.</p>}</div>
    {patient && <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 p-4"><form onSubmit={submit} className="mx-auto my-4 w-full max-w-5xl rounded-lg bg-white shadow-xl"><header className="flex items-start justify-between border-b border-slate-200 px-6 py-4"><div><h3 className="text-lg font-semibold text-slate-900">New prescription</h3><p className="text-sm text-slate-500">{patient.name} · {patient.phone}</p></div><button type="button" title="Close" onClick={() => setPatient(null)} className="p-2 text-slate-500 hover:text-slate-900"><FiX size={20}/></button></header>
      <div className="space-y-6 p-6">{error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <section><h4 className="mb-3 text-sm font-semibold text-slate-800">Patient and clinical details</h4><div className="grid gap-3 sm:grid-cols-4"><input name="patientAge" type="number" min="0" max="130" placeholder="Age" className="rounded-md border border-slate-300 px-3 py-2 text-sm"/><select name="patientGender" className="rounded-md border border-slate-300 px-3 py-2 text-sm"><option value="">Gender</option><option>Male</option><option>Female</option><option>Other</option></select><input required name="diagnosis" placeholder="Diagnosis *" className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"/><textarea name="complaints" placeholder="Chief complaints / history" className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-4" rows={2}/></div></section>
        <section><div className="mb-3 flex items-center justify-between"><h4 className="text-sm font-semibold text-slate-800">Medicines</h4><button type="button" onClick={() => setMedicines((m) => [...m, emptyMedicine()])} className="inline-flex items-center gap-1 text-sm font-medium text-sky-700"><FiPlus/> Add medicine</button></div><div className="space-y-3">{medicines.map((m, i) => <div key={i} className="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1.4fr_.7fr_1fr_1fr_1fr_1.3fr_auto]">{(["name","strength","dosage","frequency","duration","instructions"] as const).map((field) => <input key={field} required={!['strength','instructions'].includes(field)} value={m[field]} onChange={(e) => updateMedicine(i, field, e.target.value)} placeholder={({name:"Medicine *",strength:"Strength",dosage:"Dose *",frequency:"Frequency *",duration:"Duration *",instructions:"Instructions"})[field]} className="min-w-0 rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"/>)}<button type="button" title="Remove medicine" disabled={medicines.length === 1} onClick={() => setMedicines((list) => list.filter((_, x) => x !== i))} className="p-2 text-red-600 disabled:opacity-30"><FiTrash2/></button></div>)}</div></section>
        <section className="grid gap-3 sm:grid-cols-2"><textarea name="investigations" placeholder="Investigations / tests" rows={2} className="rounded-md border border-slate-300 px-3 py-2 text-sm"/><textarea name="advice" placeholder="Advice and oral care instructions" rows={2} className="rounded-md border border-slate-300 px-3 py-2 text-sm"/><label className="text-sm text-slate-600">Follow-up date<input name="followUpDate" type="date" className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"/></label></section>
      </div><footer className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4"><button type="button" onClick={() => setPatient(null)} className="rounded-md border border-slate-300 px-4 py-2 text-sm">Cancel</button><button disabled={saving} className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{saving ? "Creating..." : "Create & preview"}</button></footer>
    </form></div>}
  </div>;
}
