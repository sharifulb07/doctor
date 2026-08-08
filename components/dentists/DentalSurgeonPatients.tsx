"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type Appointment = {
  patientName: string;
  phone?: string;
  patientId?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  appointmentDate: string;
  createdAt: string;
  status: string;
};

type PatientRow = {
  name: string;
  email: string;
  phone: string;
  visits: number;
  latestAppointment: string;
  latestBooking: string;
};

export default function DentalSurgeonPatients() {
  const { locale } = useLanguage();
  const ui =
    locale === "bn"
      ? {
          title: "রোগীরা",
          subtitle: "এই দন্ত চিকিৎসকের কাছে বুকিং করা রোগীরা",
          search: "রোগী খুঁজুন…",
          patient: "রোগী",
          mobile: "মোবাইল",
          appointments: "অ্যাপয়েন্টমেন্ট",
          latestAppointment: "সর্বশেষ অ্যাপয়েন্টমেন্ট",
          bookingDateTime: "বুকিংয়ের তারিখ ও সময়",
          loading: "রোগীর তথ্য লোড হচ্ছে…",
          empty: "কোনো রোগী পাওয়া যায়নি।",
        }
      : {
          title: "Patients",
          subtitle: "Patients who have booked with this Dental Surgeon",
          search: "Search patients…",
          patient: "Patient",
          mobile: "Mobile",
          appointments: "Appointments",
          latestAppointment: "Latest appointment",
          bookingDateTime: "Booking Time & Date",
          loading: "Loading patients…",
          empty: "No patients found.",
        };

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/appointments?limit=50")
      .then((response) => response.json())
      .then((data) => data.success && setAppointments(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const patients = useMemo(() => {
    const rows = new Map<string, PatientRow>();

    appointments.forEach((appointment) => {
      const phone = appointment.phone || appointment.patientId?.phone || "—";
      const name =
        appointment.patientName || appointment.patientId?.name || "Patient";
      const normalizedName = name.trim().replace(/\s+/g, " ").toLowerCase();
      const normalizedPhone = phone.replace(/\D/g, "");
      const key = `${normalizedName}|${normalizedPhone}`;
      const existing = rows.get(key);

      if (!existing) {
        rows.set(key, {
          name,
          email: appointment.patientId?.email || "—",
          phone,
          visits: 1,
          latestAppointment: appointment.appointmentDate,
          latestBooking: appointment.createdAt,
        });
        return;
      }

      existing.visits += 1;
      if (
        new Date(appointment.appointmentDate) >
        new Date(existing.latestAppointment)
      ) {
        existing.latestAppointment = appointment.appointmentDate;
      }
      if (new Date(appointment.createdAt) > new Date(existing.latestBooking)) {
        existing.latestBooking = appointment.createdAt;
      }
    });

    const query = search.trim().toLowerCase();
    return [...rows.values()].filter((patient) =>
      `${patient.name} ${patient.email} ${patient.phone}`
        .toLowerCase()
        .includes(query),
    );
  }, [appointments, search]);

  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{ui.title}</h2>
          <p className="text-sm text-slate-500">{ui.subtitle}</p>
        </div>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={ui.search}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">{ui.patient}</th>
              <th className="px-4 py-3 text-left">{ui.mobile}</th>
              <th className="px-4 py-3 text-left">{ui.appointments}</th>
              <th className="px-4 py-3 text-left">{ui.latestAppointment}</th>
              <th className="px-4 py-3 text-left">{ui.bookingDateTime}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.map((patient) => (
              <tr key={`${patient.name}-${patient.phone}`}>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{patient.name}</p>
                  <p className="text-xs text-slate-500">{patient.email}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{patient.phone}</td>
                <td className="px-4 py-3 text-slate-600">{patient.visits}</td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                  {new Date(patient.latestAppointment).toLocaleDateString(
                    dateLocale,
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                  {new Date(patient.latestBooking).toLocaleString(dateLocale, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Dhaka",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <p className="p-8 text-center text-slate-500">{ui.loading}</p>
        )}
        {!loading && patients.length === 0 && (
          <p className="p-8 text-center text-slate-500">{ui.empty}</p>
        )}
      </div>
    </div>
  );
}
