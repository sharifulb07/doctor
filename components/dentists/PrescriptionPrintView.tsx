"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiPrinter } from "react-icons/fi";

type Prescription = {
  _id: string;
  patientName: string;
  patientEmail?: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: string;
  diagnosis: string;
  complaints?: string;
  advice?: string;
  investigations?: string;
  followUpDate?: string;
  createdAt: string;
  medicines: Array<{
    name: string;
    strength?: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  dentistId: {
    name: string;
    email: string;
    specialization: string;
    qualifications: string[];
    clinicLocation: string;
    clinicPhone: string;
  };
};

export default function PrescriptionPrintView({ id }: { id: string }) {
  const [data, setData] = useState<Prescription | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/prescriptions/${id}`)
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.message);
        setData(body.data);
      })
      .catch((requestError) =>
        setError(requestError.message || "Could not load prescription"),
      );
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl rounded-md border border-red-200 bg-red-50 p-5 text-red-700">
        {error}
      </div>
    );
  }
  if (!data) return <p className="text-slate-500">Loading prescription...</p>;

  const dentist = data.dentistId;
  const date = new Date(data.createdAt).toLocaleDateString("en-GB");

  return (
    <div className="prescription-screen mx-auto max-w-[210mm]">
      <div className="prescription-actions mb-4 flex items-center justify-between">
        <Link
          href="/dentist/patients"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <FiArrowLeft /> Patients
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          <FiPrinter /> Print prescription
        </button>
      </div>

      <article className="prescription-paper flex min-h-[270mm] flex-col bg-white px-12 py-9 text-[13px] leading-relaxed text-slate-950 shadow-sm">
        <header className="ml-auto max-w-[72%] text-right">
          <h1 className="text-[25px] font-extrabold leading-tight text-blue-900">
            Dr. {dentist.name}
          </h1>
          {dentist.qualifications?.map((qualification) => (
            <p key={qualification} className="text-[12px] leading-5">
              {qualification}
            </p>
          ))}
          <p className="mt-0.5 text-[17px] font-bold leading-tight text-red-600">
            {dentist.specialization}
          </p>
          <p className="text-[14px] font-bold text-emerald-600">
            {dentist.clinicLocation}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-600">
            {dentist.clinicPhone} · {dentist.email}
          </p>
        </header>

        <section className="mt-8 border-b border-slate-500 pb-2 font-semibold italic">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-8">
            <p>Pat. Name: <span className="not-italic">{data.patientName}</span></p>
            <p>Age: <span className="not-italic">{data.patientAge ?? "—"}</span></p>
            <p>Date: <span className="not-italic">{date}</span></p>
          </div>
          <div className="mt-1 grid grid-cols-[1fr_auto] gap-x-8 text-[11px] font-normal not-italic text-slate-600">
            <p>Contact: {data.patientPhone}</p>
            <p>Sex: {data.patientGender || "—"}</p>
          </div>
        </section>

        <section className="flex-1 py-5">
          <ClinicalSection label="C/C:" value={data.complaints} />
          <ClinicalSection label="O/E:" value={data.advice} minHeight="min-h-24" />
          <ClinicalSection label="INV:" value={data.investigations} />
          <ClinicalSection label="D/D:" value={data.diagnosis} />

          <div className="mt-5 grid grid-cols-[58px_1fr] gap-3">
            <h2 className="font-bold italic">Rx Plan:</h2>
            <div className="space-y-3">
              {data.medicines.map((medicine, index) => (
                <div key={`${medicine.name}-${index}`} className="break-inside-avoid">
                  <p className="font-semibold">
                    {index + 1}. {medicine.name}{" "}
                    {medicine.strength && (
                      <span className="font-normal">{medicine.strength}</span>
                    )}
                  </p>
                  <p className="ml-4 text-[12px] text-slate-700">
                    {medicine.dosage} · {medicine.frequency} · {medicine.duration}
                  </p>
                  {medicine.instructions && (
                    <p className="ml-4 text-[11px] italic text-slate-600">
                      {medicine.instructions}
                    </p>
                  )}
                </div>
              ))}
              {data.followUpDate && (
                <p className="pt-2 text-[12px]">
                  <strong>Follow-up:</strong>{" "}
                  {new Date(data.followUpDate).toLocaleDateString("en-GB")}
                </p>
              )}
            </div>
          </div>
        </section>

        <footer className="mt-auto border-t-2 border-sky-500 pt-2 text-center">
          <p className="text-[10px] text-slate-500">
            This prescription was generated electronically by EasyDentalSolution
          </p>
        </footer>
      </article>
    </div>
  );
}

function ClinicalSection({
  label,
  value,
  minHeight = "min-h-16",
}: {
  label: string;
  value?: string;
  minHeight?: string;
}) {
  return (
    <div className={`grid grid-cols-[58px_1fr] gap-3 ${minHeight}`}>
      <h2 className="font-bold italic">{label}</h2>
      {value && <p className="whitespace-pre-line">{value}</p>}
    </div>
  );
}
