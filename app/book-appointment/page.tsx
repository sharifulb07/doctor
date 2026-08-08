import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import BookingForm from "@/components/appointments/BookingForm";
import BookAppointmentHeading from "@/components/appointments/BookAppointmentHeading";
import { getServerAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Schedule your dental appointment with one of our qualified dentists.",
};
export const dynamic = "force-dynamic";

export default async function BookAppointmentPage() {
  const auth = await getServerAuth();

  if (!auth) {
    redirect("/login?redirect=/book-appointment");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BookAppointmentHeading />
      <Suspense
        fallback={
          <div className="animate-pulse bg-slate-100 rounded-xl h-96" />
        }
      >
        <BookingForm userRole={auth.role} />
      </Suspense>
    </div>
  );
}
