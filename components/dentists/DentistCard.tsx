"use client";

import Link from "next/link";
import { IDentist } from "@/types";
import { Card, CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";

interface DentistCardProps {
  dentist: IDentist & { _id: string };
}

export default function DentistCard({ dentist }: DentistCardProps) {
  const { t } = useLanguage();
  const d = t.dentists;
  return (
    <Card hover className="flex flex-col h-full">
      <CardBody className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
            {dentist.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dentist.photo}
                alt={dentist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              "👨‍⚕️"
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-lg leading-tight">
              {dentist.name}
            </h3>
            <p className="text-sky-600 text-sm font-medium">
              {dentist.specialization}
            </p>
            <p className="text-slate-500 text-xs mt-0.5">
              {dentist.experience} {d.yearsExp}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            ⭐{" "}
            <strong>
              {dentist.rating > 0 ? dentist.rating.toFixed(1) : "New"}
            </strong>
            {dentist.totalReviews > 0 && (
              <span className="text-xs text-slate-400">
                ({dentist.totalReviews} {d.reviews})
              </span>
            )}
          </span>
          <span>💰 ৳{dentist.consultationFee}</span>
        </div>

        {/* Location */}
        <p className="text-sm text-slate-500 flex items-start gap-1.5">
          <span className="mt-0.5">📍</span>
          <span className="line-clamp-2">{dentist.clinicLocation}</span>
        </p>

        {/* Available days */}
        <div className="flex flex-wrap gap-1">
          {dentist.availableDays.slice(0, 4).map((day) => (
            <Badge key={day} variant="info" className="text-xs">
              {day.slice(0, 3)}
            </Badge>
          ))}
          {dentist.availableDays.length > 4 && (
            <Badge variant="default" className="text-xs">
              +{dentist.availableDays.length - 4}
            </Badge>
          )}
        </div>

        {/* Qualifications */}
        {dentist.qualifications.length > 0 && (
          <p className="text-xs text-slate-500 line-clamp-1">
            🎓 {dentist.qualifications.slice(0, 2).join(" • ")}
            {dentist.qualifications.length > 2 &&
              ` +${dentist.qualifications.length - 2} ${d.qualMore}`}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2">
          <Link href={`/dentists/${dentist._id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              {d.viewProfile}
            </Button>
          </Link>
          <Link
            href={`/book-appointment?dentistId=${dentist._id}`}
            className="flex-1"
          >
            <Button size="sm" className="w-full">
              {d.book}
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
