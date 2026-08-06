"use client";

import Link from "next/link";
import { IAppointment, AppointmentStatus } from "@/types";
import { Card, CardBody, CardFooter } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatTimeSlotRange } from "@/utils/timeSlots";

interface AppointmentCardProps {
  appointment: IAppointment & {
    _id: string;
    dentistId?: {
      name: string;
      specialization: string;
      clinicLocation: string;
    } | null;
  };
  onCancel?: (id: string) => void;
  cancelling?: boolean;
}

export default function AppointmentCard({
  appointment,
  onCancel,
  cancelling,
}: AppointmentCardProps) {
  const { t, locale } = useLanguage();
  const ap = t.appointments;

  const canCancel =
    appointment.status === AppointmentStatus.PENDING ||
    appointment.status === AppointmentStatus.CONFIRMED;

  const dateFormatted = new Date(
    appointment.appointmentDate,
  ).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dentist = appointment.dentistId as {
    name: string;
    specialization: string;
    clinicLocation: string;
  } | null;

  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900">
                {dentist?.name || ap.dentist}
              </h3>
              <Badge variant={appointment.status}>{appointment.status}</Badge>
            </div>
            <p className="text-sm text-sky-600">{dentist?.specialization}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{dateFormatted}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⏰</span>
            <span>{formatTimeSlotRange(appointment.timeSlot)}</span>
          </div>
          {dentist?.clinicLocation && (
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{dentist.clinicLocation}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span>📞</span>
            <span>{appointment.phone}</span>
          </div>
          {appointment.treatmentType && (
            <div className="flex items-center gap-2 sm:col-span-2">
              <span>🦷</span>
              <span>{appointment.treatmentType}</span>
            </div>
          )}
          {appointment.notes && (
            <div className="flex items-start gap-2 sm:col-span-2">
              <span>📝</span>
              <span className="text-slate-500 italic">{appointment.notes}</span>
            </div>
          )}
        </div>
      </CardBody>

      {canCancel && onCancel && (
        <CardFooter className="flex items-center justify-between">
          <Link href={`/appointments/${appointment._id}/reschedule`}>
            <Button variant="outline" size="sm">
              {ap.reschedule}
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onCancel(appointment._id)}
            loading={cancelling}
          >
            {ap.cancelAppointment}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
