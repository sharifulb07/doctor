"use client";

import { useEffect, useState, useCallback } from "react";
import { AppointmentStatus } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatTimeSlotRange } from "@/utils/timeSlots";

interface Appointment {
  _id: string;
  patientName: string;
  patientId?: { name?: string; email?: string } | null;
  dentistId: { name?: string } | null;
  appointmentDate: string;
  timeSlot: string;
  createdAt: string;
  status: string;
  notes?: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-sky-100 text-sky-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const ALL_STATUSES = ["", "pending", "confirmed", "completed", "cancelled"];

export default function AdminAppointmentsPage() {
  const { t, locale } = useLanguage();
  const ad = t.admin;
  const statusLabels: Record<string, string> = {
    pending: t.appointments.tabs.pending,
    confirmed: t.appointments.tabs.confirmed,
    completed: t.appointments.tabs.completed,
    cancelled: t.appointments.tabs.cancelled,
  };
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (filterStatus) params.set("status", filterStatus);
      const res = await fetch(`/api/appointments?${params}`);
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data || []);
        setTotalPages(data.pagination?.pages ?? 1);
      }
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  async function updateStatus(id: string, status: AppointmentStatus) {
    setActionLoading(id + status);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) await fetchAppointments();
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        {ad.allAppointments}
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => {
              setPage(1);
              setFilterStatus(s);
            }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filterStatus === s
                ? "bg-sky-600 text-white border-sky-600"
                : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
            }`}
          >
            {s ? (statusLabels[s] ?? s) : ad.filterAll}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center text-slate-400 py-12">
              {t.common.loading}
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">{ad.colPatient}</th>
                  <th className="px-4 py-3 text-left">{ad.colDentist}</th>
                  <th className="px-4 py-3 text-left">{ad.colDate}</th>
                  <th className="px-4 py-3 text-left">{ad.colTime}</th>
                  <th className="px-4 py-3 text-left">
                    {locale === "bn" ? "বুকিংয়ের তারিখ ও সময়" : "Booking Time & Date"}
                  </th>
                  <th className="px-4 py-3 text-left">{ad.colStatus}</th>
                  <th className="px-4 py-3 text-left">{ad.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        {appt.patientName || appt.patientId?.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {appt.patientId?.email || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {appt.dentistId?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(appt.appointmentDate).toLocaleDateString(
                        locale === "bn" ? "bn-BD" : "en-US",
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatTimeSlotRange(appt.timeSlot)}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(appt.createdAt).toLocaleString(
                        locale === "bn" ? "bn-BD" : "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                          timeZone: "Asia/Dhaka",
                        },
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[appt.status] ?? ""}`}
                      >
                        {statusLabels[appt.status] ?? appt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {appt.status === AppointmentStatus.PENDING && (
                          <button
                            onClick={() =>
                              updateStatus(
                                appt._id,
                                AppointmentStatus.CONFIRMED,
                              )
                            }
                            disabled={!!actionLoading}
                            className="text-xs px-2.5 py-1 rounded-md bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50"
                          >
                            {actionLoading ===
                            appt._id + AppointmentStatus.CONFIRMED
                              ? "…"
                              : ad.actionConfirm}
                          </button>
                        )}
                        {appt.status === AppointmentStatus.CONFIRMED && (
                          <button
                            onClick={() =>
                              updateStatus(
                                appt._id,
                                AppointmentStatus.COMPLETED,
                              )
                            }
                            disabled={!!actionLoading}
                            className="text-xs px-2.5 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {actionLoading ===
                            appt._id + AppointmentStatus.COMPLETED
                              ? "…"
                              : ad.actionComplete}
                          </button>
                        )}
                        {appt.status !== AppointmentStatus.CANCELLED &&
                          appt.status !== AppointmentStatus.COMPLETED && (
                            <button
                              onClick={() =>
                                updateStatus(
                                  appt._id,
                                  AppointmentStatus.CANCELLED,
                                )
                              }
                              disabled={!!actionLoading}
                              className="text-xs px-2.5 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                            >
                              {actionLoading ===
                              appt._id + AppointmentStatus.CANCELLED
                                ? "…"
                                : ad.actionCancel}
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && appointments.length === 0 && (
            <p className="text-center text-slate-400 py-10 text-sm">
              {t.appointments.empty}
            </p>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-sm hover:bg-slate-50 disabled:opacity-40"
          >
            {ad.previous}
          </button>
          <span className="text-sm text-slate-600">
            {ad.page} {page} {ad.pageSep} {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-sm hover:bg-slate-50 disabled:opacity-40"
          >
            {ad.next}
          </button>
        </div>
      )}
    </div>
  );
}
