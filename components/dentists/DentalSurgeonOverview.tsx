"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatTimeSlotRange } from "@/utils/timeSlots";

type Appointment = {
  _id: string;
  patientName: string;
  appointmentDate: string;
  timeSlot: string;
  status: string;
};

type Profile = {
  name: string;
  specialization: string;
  clinicLocation: string;
};

export default function DentalSurgeonOverview() {
  const { locale } = useLanguage();
  const ui =
    locale === "bn"
      ? {
          loading: "ড্যাশবোর্ড লোড হচ্ছে…",
          welcome: "স্বাগতম",
          dentist: "দন্ত চিকিৎসক",
          total: "মোট অ্যাপয়েন্টমেন্ট",
          today: "আজকের অ্যাপয়েন্টমেন্ট",
          pending: "অপেক্ষমাণ",
          completed: "সম্পন্ন",
          upcoming: "আসন্ন অ্যাপয়েন্টমেন্ট",
          manageAll: "সব পরিচালনা করুন",
          noUpcoming: "কোনো আসন্ন অ্যাপয়েন্টমেন্ট নেই।",
          at: "সময়",
          statuses: {
            pending: "অপেক্ষমাণ",
            confirmed: "নিশ্চিত",
            completed: "সম্পন্ন",
            cancelled: "বাতিল",
          } as Record<string, string>,
        }
      : {
          loading: "Loading dashboard…",
          welcome: "Welcome back",
          dentist: "Dental Surgeon",
          total: "Total appointments",
          today: "Today",
          pending: "Awaiting action",
          completed: "Completed",
          upcoming: "Upcoming appointments",
          manageAll: "Manage all",
          noUpcoming: "No upcoming appointments.",
          at: "at",
          statuses: {
            pending: "Pending",
            confirmed: "Confirmed",
            completed: "Completed",
            cancelled: "Cancelled",
          } as Record<string, string>,
        };

  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
    completed: 0,
  });
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dentist/dashboard")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.data.profile);
          setStats(data.data.stats);
          setUpcoming(data.data.upcoming || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500">{ui.loading}</p>;
  }

  const statCards = [
    [ui.total, stats.total],
    [ui.today, stats.today],
    [ui.pending, stats.pending],
    [ui.completed, stats.completed],
  ] as const;
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-sky-700">{ui.welcome}</p>
        <h2 className="text-2xl font-bold text-slate-900">
          {profile?.name || ui.dentist}
        </h2>
        <p className="text-sm text-slate-500">
          {profile?.specialization}
          {profile?.clinicLocation ? ` · ${profile.clinicLocation}` : ""}
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h3 className="font-semibold text-slate-900">{ui.upcoming}</h3>
          <Link
            href="/dentist/appointments"
            className="text-sm text-sky-600 hover:underline"
          >
            {ui.manageAll}
          </Link>
        </div>

        {upcoming.length ? (
          <div className="divide-y divide-slate-100">
            {upcoming.map((appointment) => (
              <div
                key={appointment._id}
                className="flex flex-wrap items-center justify-between gap-2 px-5 py-4"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {appointment.patientName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(appointment.appointmentDate).toLocaleDateString(
                      dateLocale,
                    )}{" "}
                    {ui.at} {formatTimeSlotRange(appointment.timeSlot)}
                  </p>
                </div>
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                  {ui.statuses[appointment.status] || appointment.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-8 text-center text-sm text-slate-500">
            {ui.noUpcoming}
          </p>
        )}
      </section>
    </div>
  );
}
