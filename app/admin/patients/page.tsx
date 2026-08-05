"use client";

import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminPatientsPage() {
  const { t, locale } = useLanguage();
  const ad = t.admin;
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
        role: "patient",
      });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      if (data.success) {
        setPatients(data.data?.users || []);
        setTotalPages(data.data.pagination?.totalPages ?? 1);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  async function toggleActive(patient: Patient) {
    setTogglingId(patient._id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: patient._id,
          isActive: !patient.isActive,
        }),
      });

      if (res.ok) await fetchPatients();
    } finally {
      setTogglingId(null);
    }
  }

  async function deletePatient(patient: Patient) {
    const confirmed = window.confirm(
      `Delete ${patient.name}? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(patient._id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: patient._id }),
      });

      if (res.ok) await fetchPatients();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-6">{ad.patients}</h2>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder={ad.searchPatients}
          className="w-full max-w-sm rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <p className="text-center text-slate-400 py-12">{t.common.loading}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">{ad.colName}</th>
                  <th className="px-6 py-3 text-left">{ad.colEmail}</th>
                  <th className="px-6 py-3 text-left">{ad.colPhone}</th>
                  <th className="px-6 py-3 text-left">{ad.colStatus}</th>
                  <th className="px-6 py-3 text-left">{ad.colJoined}</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-900">
                      {p.name}
                    </td>
                    <td className="px-6 py-3 text-slate-600">{p.email}</td>
                    <td className="px-6 py-3 text-slate-500">
                      {p.phone || "—"}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          p.isActive !== false
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {p.isActive !== false
                          ? ad.statusActive
                          : ad.statusInactive}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString(
                        locale === "bn" ? "bn-BD" : "en-US",
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => toggleActive(p)}
                          disabled={togglingId === p._id}
                          className={`text-xs px-2.5 py-1 rounded-md ${
                            p.isActive
                              ? "bg-red-50 text-red-700 hover:bg-red-100"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          } disabled:opacity-50`}
                        >
                          {togglingId === p._id
                            ? "..."
                            : p.isActive
                              ? ad.deactivate
                              : ad.activate}
                        </button>
                        <button
                          onClick={() => deletePatient(p)}
                          disabled={deletingId === p._id}
                          className="text-xs px-2.5 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {deletingId === p._id ? "..." : ad.deletePatient}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {patients.length === 0 && (
              <p className="text-center text-slate-400 py-10 text-sm">
                {ad.noPatients}
              </p>
            )}
          </div>
        )}
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
