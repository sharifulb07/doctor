"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import AppointmentCard from "@/components/appointments/AppointmentCard";
import { IAppointment, AppointmentStatus } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

type PopulatedAppointment = IAppointment & {
  _id: string;
  dentistId?: { name: string; specialization: string; clinicLocation: string };
};

export default function AppointmentsPage() {
  const { t } = useLanguage();
  const ap = t.appointments;

  const TABS = [
    { label: ap.tabs.all, value: "all" },
    { label: ap.tabs.pending, value: AppointmentStatus.PENDING },
    { label: ap.tabs.confirmed, value: AppointmentStatus.CONFIRMED },
    { label: ap.tabs.completed, value: AppointmentStatus.COMPLETED },
    { label: ap.tabs.cancelled, value: AppointmentStatus.CANCELLED },
  ];
  const [appointments, setAppointments] = useState<PopulatedAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const url =
        activeTab === "all"
          ? "/api/appointments?limit=50"
          : `/api/appointments?status=${activeTab}&limit=50`;
      const res = await fetch(url);
      const data = await res.json();
      setAppointments(data.data || []);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  async function handleCancel(id: string) {
    if (!confirm(ap.cancelConfirm)) return;
    setCancellingId(id);
    try {
      await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: AppointmentStatus.CANCELLED }),
      });
      await fetchAppointments();
    } finally {
      setCancellingId(null);
    }
  }

  const counts = appointments.reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{ap.title}</h1>
        <p className="text-slate-500 mt-1">{ap.subtitle}</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 flex-wrap mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-sky-500 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-600"
            }`}
          >
            {tab.label}
            {tab.value !== "all" && counts[tab.value] ? (
              <span className="ml-1.5 text-xs opacity-80">
                ({counts[tab.value]})
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-slate-100 rounded-xl h-40"
            />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-4">📅</div>
          <p className="text-lg font-medium">{ap.empty}</p>
          <p className="text-sm mt-1">
            <Link
              href="/book-appointment"
              className="text-sky-600 hover:underline"
            >
              {ap.bookFirst}
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <AppointmentCard
              key={appt._id}
              appointment={appt}
              onCancel={handleCancel}
              cancelling={cancellingId === appt._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
