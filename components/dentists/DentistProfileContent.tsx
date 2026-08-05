"use client";

import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";

interface DentistProfile {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  totalReviews: number;
  consultationFee: number;
  clinicLocation: string;
  clinicPhone?: string;
  bio?: string;
  photo?: string;
  availableDays: string[];
  availableTimeSlots: string[];
  qualifications: string[];
}

interface Props {
  dentist: DentistProfile;
  id: string;
}

export default function DentistProfileContent({ dentist, id }: Props) {
  const { t } = useLanguage();
  const dp = t.dentistProfile;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/dentists"
        className="text-sm text-sky-600 hover:underline mb-6 inline-block"
      >
        {dp.backToDentists}
      </Link>

      <Card>
        <CardBody>
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-sky-100 flex items-center justify-center text-4xl shrink-0 overflow-hidden border-4 border-sky-200">
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
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">
                Dr. {dentist.name}
              </h1>
              <p className="text-sky-600 font-medium">
                {dentist.specialization}
              </p>
              <p className="text-slate-500 text-sm mt-1">
                {dentist.experience} {dp.yearsExperience}
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                {dentist.rating > 0 && (
                  <span className="flex items-center gap-1">
                    ⭐ <strong>{dentist.rating.toFixed(1)}</strong>
                    <span className="text-slate-400">
                      ({dentist.totalReviews} {dp.reviews})
                    </span>
                  </span>
                )}
                <span className="font-semibold text-slate-700">
                  💰 {dp.consultation}: ${dentist.consultationFee}
                </span>
              </div>
            </div>
            <Link href={`/book-appointment?dentistId=${id}`}>
              <Button size="lg">
                {dp.bookAppointment} {dentist.name}
              </Button>
            </Link>
          </div>

          {/* Bio */}
          {dentist.bio && (
            <div className="mb-6">
              <h2 className="font-semibold text-slate-900 mb-2">{dp.about}</h2>
              <p className="text-slate-600 leading-relaxed">{dentist.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Clinic Info */}
            <div>
              <h2 className="font-semibold text-slate-900 mb-3">
                {dp.clinicInfo}
              </h2>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span>📍</span>
                  <span>{dentist.clinicLocation}</span>
                </li>
                {dentist.clinicPhone && (
                  <li className="flex items-center gap-2">
                    <span>📞</span>
                    <span>{dentist.clinicPhone}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Availability */}
            <div>
              <h2 className="font-semibold text-slate-900 mb-3">
                {dp.availableDays}
              </h2>
              <div className="flex flex-wrap gap-2">
                {dentist.availableDays.map((day) => (
                  <Badge key={day} variant="info">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Qualifications */}
            {dentist.qualifications.length > 0 && (
              <div>
                <h2 className="font-semibold text-slate-900 mb-3">
                  {dp.qualifications}
                </h2>
                <ul className="space-y-1">
                  {dentist.qualifications.map((q, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <span className="text-sky-500 mt-0.5">🎓</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Time Slots */}
            {dentist.availableTimeSlots.length > 0 && (
              <div>
                <h2 className="font-semibold text-slate-900 mb-3">
                  {dp.availableTimes}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {dentist.availableTimeSlots.map((slot) => (
                    <span
                      key={slot}
                      className="px-2.5 py-1 rounded border border-slate-200 text-xs text-slate-600 bg-slate-50"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
