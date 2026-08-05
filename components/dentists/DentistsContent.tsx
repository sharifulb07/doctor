"use client";

import DentistCard from "@/components/dentists/DentistCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { IDentist } from "@/types";

interface DentistsContentProps {
  dentists: Array<IDentist & { _id: string }>;
  specializations: string[];
}

export default function DentistsContent({
  dentists,
  specializations,
}: DentistsContentProps) {
  const { t } = useLanguage();
  const d = t.dentists;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">{d.title}</h1>
        <p className="text-slate-500 mt-2">
          {d.subtitle.replace("{count}", String(dentists.length))}
        </p>
      </div>

      {/* Specialization filter chips */}
      {specializations.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-4 py-1.5 rounded-full bg-sky-500 text-white text-sm font-medium">
            {d.all}
          </span>
          {specializations.map((s) => (
            <span
              key={s}
              className="px-4 py-1.5 rounded-full border border-slate-300 text-slate-600 text-sm hover:border-sky-400 hover:text-sky-600 cursor-pointer transition-colors"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {dentists.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-4">👨‍⚕️</div>
          <p className="text-lg font-medium">{d.noResults}</p>
          <p className="text-sm mt-1">{d.checkBack}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dentists.map((dentist) => (
            <DentistCard key={dentist._id} dentist={dentist} />
          ))}
        </div>
      )}
    </div>
  );
}
