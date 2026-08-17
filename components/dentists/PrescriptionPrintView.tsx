"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiPrinter } from "react-icons/fi";
import logo from "@/public/logo.png";

type DentalQuadrants = { upperLeft?: string; upperRight?: string; lowerLeft?: string; lowerRight?: string };

type Prescription = {
  _id: string;
  patientName: string;
  patientEmail?: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: string;
  diagnosis: string;
  complaints?: string;
  onExamination?: string;
  medicalHistory?: string;
  treatmentPlan?: string;
  complaintQuadrants?: DentalQuadrants;
  examinationQuadrants?: DentalQuadrants;
  investigationQuadrants?: DentalQuadrants;
  diagnosisQuadrants?: DentalQuadrants;
  treatmentPlanQuadrants?: DentalQuadrants;
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
    additionalSpecializations?: string[];
    qualifications: string[];
    bmdcRegistration?: string;
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
  const legacyRegistration = dentist.qualifications?.find((line) => /^BMDC\b/i.test(line.trim()));
  const registrationLine = dentist.bmdcRegistration
    ? `BMDC Reg. ${dentist.bmdcRegistration.replace(/^BMDC\s*(?:Reg(?:istration)?\.?\s*)?/i, "")}`
    : legacyRegistration || "BMDC Reg.";
  const qualificationLines = dentist.qualifications?.filter((line) => !/^BMDC\b/i.test(line.trim())) || [];

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

      <article className="prescription-paper relative isolate flex min-h-[270mm] flex-col overflow-hidden bg-white px-12 py-9 text-[13px] leading-relaxed text-slate-950 shadow-sm">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
          <Image src={logo} alt="" className="h-auto w-[300px] opacity-[0.07] grayscale" />
        </div>
        <header className="flex items-start justify-between gap-8">
          <Image src={logo} alt="EasyDentalSolution" priority className="h-auto w-[105px] shrink-0" />
          <div className="max-w-[72%] text-right">
            <h1 className="text-[21px] font-extrabold leading-tight text-blue-900">
              Dr. {dentist.name}
            </h1>
            {qualificationLines.map((qualification) => (
              <p key={qualification} className="whitespace-pre-line text-[12px] font-medium leading-5">
                {qualification}
              </p>
            ))}
            <p className="mt-0.5 whitespace-pre-line text-[14px] font-bold leading-5 text-red-600">
              {dentist.specialization}
            </p>
            {dentist.additionalSpecializations?.map((specialization) => <p key={specialization} className="text-[13px] font-semibold leading-5 text-red-600">{specialization}</p>)}
            <p className="whitespace-pre-line text-[13px] font-bold leading-5 text-emerald-600">
              {dentist.clinicLocation}
            </p>
            <p className="whitespace-pre-line text-[12px] font-semibold leading-5">{registrationLine}</p>
            <p className="mt-0.5 text-[11px] text-slate-600">
              {dentist.clinicPhone} · {dentist.email}
            </p>
          </div>
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

        <section className="grid flex-1 grid-cols-[36%_64%] border-b border-slate-400">
          <div className="flex flex-col border-r border-slate-400 py-5 pr-5">
            <ClinicalSection label="C/C:" value={data.complaints} quadrants={data.complaintQuadrants} minHeight="min-h-28" />
            <ClinicalSection label="O/E:" value={data.onExamination} quadrants={data.examinationQuadrants} minHeight="min-h-[180px]" />
            <ClinicalSection label="M/H:" value={data.medicalHistory} minHeight="min-h-[60px]" />
            <div className="mt-auto space-y-4">
              <ClinicalSection label="Inv:" value={data.investigations} quadrants={data.investigationQuadrants} minHeight="min-h-20" />
              <ClinicalSection label="D/D:" value={data.diagnosis} quadrants={data.diagnosisQuadrants} minHeight="min-h-20" />
              <ClinicalSection label="Rx Plan:" value={data.treatmentPlan} quadrants={data.treatmentPlanQuadrants} minHeight="min-h-[180px]" />
            </div>
          </div>

          <div className="flex flex-col py-5 pl-7">
            <div className="mb-5 text-[20px] font-serif italic leading-none">Rx.</div>
            <div className="space-y-5">
              {data.medicines.map((medicine, index) => (
                <div key={`${medicine.name}-${index}`} className="grid break-inside-avoid grid-cols-[28px_1fr] gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 text-[11px] font-semibold">
                    {toRoman(index + 1)}
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold leading-6">
                      {medicine.name}
                      {medicine.strength && <span className="ml-2 font-normal">{medicine.strength}</span>}
                    </p>
                    <div className="mt-1 flex items-baseline gap-2 text-[12px]">
                      <span>{medicine.dosage}</span>
                      <span>·</span>
                      <span>{medicine.frequency}</span>
                      <span className="mx-1 flex-1 border-b border-slate-500" />
                      <span className="whitespace-nowrap">{medicine.duration}</span>
                    </div>
                    {medicine.instructions && <p className="mt-1 text-[11px] italic text-slate-600">{medicine.instructions}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto grid grid-cols-[1fr_160px] items-end gap-8 pt-10">
              <div className="space-y-4">
                {data.advice && <div><h2 className="mb-1 font-bold italic underline underline-offset-4">Advice:</h2><p className="whitespace-pre-line text-[12px]">{data.advice}</p></div>}
              </div>
              <div className="text-right text-[13px] leading-relaxed">
                <p className="font-semibold">Dr. {dentist.name}</p>
                <div className="whitespace-nowrap border-b border-slate-700 pb-1">Signature of Dental Surgeon</div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-auto border-t-2 border-sky-500 pt-2 text-center">
          <p className="text-[10px] text-slate-500">
            This prescription was generated electronically by EasyDentalSolution
          </p>
        </footer>
      </article>

      {data.followUpDate && (
        <article className="prescription-paper mt-6 flex min-h-[270mm] break-before-page flex-col bg-white px-12 py-9 text-[13px] leading-relaxed text-slate-950 shadow-sm print:mt-0">
          <header className="border-b-2 border-sky-600 pb-4">
            <h1 className="text-[23px] font-extrabold text-blue-900">Follow-up</h1>
            <p className="mt-1 text-[12px] text-slate-600">Patient: {data.patientName}</p>
          </header>

          <section className="py-8">
            <div className="grid max-w-md grid-cols-[110px_1fr] gap-4 border-b border-slate-400 pb-3">
              <h2 className="font-bold italic">Follow-up date:</h2>
              <p>{new Date(data.followUpDate).toLocaleDateString("en-GB")}</p>
            </div>
          </section>

          <footer className="mt-auto border-t-2 border-sky-500 pt-2 text-center">
            <p className="text-[10px] text-slate-500">This follow-up page belongs to the prescription dated {date}</p>
          </footer>
        </article>
      )}
    </div>
  );
}

function ClinicalSection({
  label,
  value,
  quadrants,
  minHeight = "min-h-16",
}: {
  label: string;
  value?: string;
  quadrants?: DentalQuadrants;
  minHeight?: string;
}) {
  if (quadrants) {
    return (
      <div className={minHeight}>
        <div className="mb-1 flex items-baseline gap-1"><h2 className="font-bold italic underline decoration-slate-500 underline-offset-2">{label}</h2><span aria-hidden="true" className="text-xl font-normal leading-none">+</span></div>
        {value && <p className="whitespace-pre-line pl-2 text-[12px] leading-relaxed">{value}</p>}
      </div>
    );
  }

  return (
    <div className={minHeight}>
      <h2 className="mb-1 font-bold italic underline decoration-slate-500 underline-offset-2">{label}</h2>
      {value && <p className="whitespace-pre-line pl-2 text-[12px] leading-relaxed">{value}</p>}
    </div>
  );
}

function toRoman(value: number) {
  const numerals: Array<[number, string]> = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let remaining = value;
  let result = "";
  for (const [amount, numeral] of numerals) {
    while (remaining >= amount) {
      result += numeral;
      remaining -= amount;
    }
  }
  return result;
}
