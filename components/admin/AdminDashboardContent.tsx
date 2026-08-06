"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface RecentAppointment {
  _id: { toString: () => string } | string;
  patientName: string;
  dentistName: string;
  appointmentDate: string;
  status: string;
}

interface AdminStats {
  totalPatients: number;
  totalDentists: number;
  totalAppointments: number;
  pending: number;
  today: number;
  recent: RecentAppointment[];
}

interface Props {
  stats: AdminStats;
}

export default function AdminDashboardContent({ stats }: Props) {
  const { t, locale } = useLanguage();
  const ad = t.admin;
  const statusLabels: Record<string, string> = {
    pending: t.appointments.tabs.pending,
    confirmed: t.appointments.tabs.confirmed,
    completed: t.appointments.tabs.completed,
    cancelled: t.appointments.tabs.cancelled,
  };

  const statCards = [
    {
      label: ad.totalPatients,
      value: stats.totalPatients,
      icon: "👥",
      color: "text-sky-600 bg-sky-50",
    },
    {
      label: ad.activeDentists,
      value: stats.totalDentists,
      icon: "👨‍⚕️",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: ad.totalAppointments,
      value: stats.totalAppointments,
      icon: "📅",
      color: "text-violet-600 bg-violet-50",
    },
    {
      label: ad.pendingReview,
      value: stats.pending,
      icon: "⏳",
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: ad.todayAppointments,
      value: stats.today,
      icon: "🗓️",
      color: "text-rose-600 bg-rose-50",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-6">{ad.overview}</h2>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl p-4 ${card.color.split(" ")[1]} border border-slate-100`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className={`text-2xl font-bold ${card.color.split(" ")[0]}`}>
              {card.value}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">
            {ad.recentAppointments}
          </h3>
          <Link
            href="/admin/appointments"
            className="text-sm text-sky-600 hover:underline"
          >
            {ad.viewAll}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">{ad.colPatient}</th>
                <th className="px-6 py-3 text-left">{ad.colDentist}</th>
                <th className="px-6 py-3 text-left">{ad.colDate}</th>
                <th className="px-6 py-3 text-left">{ad.colStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recent.map((appt) => {
                const rowKey =
                  typeof appt._id === "string" ? appt._id : appt._id.toString();

                return (
                  <tr key={rowKey} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-900">
                      {appt.patientName}
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      {appt.dentistName || "—"}
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      {new Date(appt.appointmentDate).toLocaleDateString(
                        locale === "bn" ? "bn-BD" : "en-US",
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          appt.status === "confirmed"
                            ? "bg-sky-100 text-sky-700"
                            : appt.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : appt.status === "completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {statusLabels[appt.status] ?? appt.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
