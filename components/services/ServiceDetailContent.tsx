"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";
import { ServiceDetails } from "@/lib/services";
import {
  getLocalizedServiceContent,
  getLocalizedServiceName,
} from "@/lib/servicesI18n";
import { IDentist } from "@/types";

interface ServiceDetailContentProps {
  service: ServiceDetails;
  relatedServices: ServiceDetails[];
  doctors: Array<IDentist & { _id: string }>;
}

export default function ServiceDetailContent({
  service,
  relatedServices,
  doctors,
}: ServiceDetailContentProps) {
  const { locale } = useLanguage();

  const localized = getLocalizedServiceContent(service, locale);

  const ui =
    locale === "bn"
      ? {
          home: "হোম",
          services: "সেবাসমূহ",
          bookThisService: "এই সেবাটি বুক করুন",
          quickInformation: "দ্রুত তথ্য",
          duration: "সময়কাল",
          recoveryTime: "সুস্থ হতে সময়",
          anesthesia: "অ্যানেস্থেশিয়া",
          cost: "খরচ",
          appointmentRequired: "অ্যাপয়েন্টমেন্ট প্রয়োজন",
          overview: "ওভারভিউ",
          symptoms: "লক্ষণসমূহ",
          whenNeed: "কখন এই চিকিৎসা প্রয়োজন?",
          treatmentProcedure: "চিকিৎসা প্রক্রিয়া",
          step: "ধাপ",
          benefits: "উপকারিতা",
          afterCare: "পরবর্তী যত্ন",
          avoid: "কারা এড়িয়ে চলবেন?",
          faq: "প্রায়শই জিজ্ঞাসিত প্রশ্ন",
          relatedServices: "সম্পর্কিত সেবা",
          viewAllServices: "সব সেবা দেখুন",
          readDetails: "বিস্তারিত পড়ুন",
          bookAppointmentCta: "অ্যাপয়েন্টমেন্ট বুক করুন",
          ctaText:
            "চিকিৎসা শুরু করতে প্রস্তুত? এখনই অ্যাপয়েন্টমেন্ট নিন, আমাদের টিম পরবর্তী ধাপে সহায়তা করবে।",
          bookAppointment: "অ্যাপয়েন্টমেন্ট বুক করুন",
          viewDoctors: "ডাক্তার দেখুন",
          doctorList: "ডাক্তার তালিকা",
          noDoctors:
            "এই সেবার জন্য নির্দিষ্ট ডাক্তার এখনো ম্যাপ করা নেই। সব ডেন্টিস্ট দেখে উপযুক্ত ডাক্তার নির্বাচন করুন।",
          browseDentists: "ডেন্টিস্ট দেখুন",
          reviews: "রিভিউ",
          contactSection: "যোগাযোগ সেকশন",
          contactText:
            "সঠিক চিকিৎসা বাছাইয়ে সহায়তা চান? আমাদের সাথে যোগাযোগ করুন, আমরা পরামর্শ ও বুকিংয়ে সহায়তা করব।",
          phone: "ফোন",
          email: "ইমেইল",
          address: "ঠিকানা",
          contactAndBook: "যোগাযোগ ও বুকিং",
          view: "দেখুন",
          new: "নতুন",
        }
      : {
          home: "Home",
          services: "Services",
          bookThisService: "Book This Service",
          quickInformation: "Quick Information",
          duration: "Duration",
          recoveryTime: "Recovery Time",
          anesthesia: "Anesthesia",
          cost: "Cost",
          appointmentRequired: "Appointment Required",
          overview: "Overview",
          symptoms: "Symptoms",
          whenNeed: "When do you need this treatment?",
          treatmentProcedure: "Treatment Procedure",
          step: "Step",
          benefits: "Benefits",
          afterCare: "After Care",
          avoid: "Who should avoid it?",
          faq: "Frequently Asked Questions",
          relatedServices: "Related Services",
          viewAllServices: "View all services",
          readDetails: "Read details",
          bookAppointmentCta: "Book Appointment CTA",
          ctaText:
            "Ready to start your treatment? Book an appointment now and our team will guide you through the next best step.",
          bookAppointment: "Book Appointment",
          viewDoctors: "View Doctors",
          doctorList: "Doctor List",
          noDoctors:
            "No specific doctors are mapped right now. Please browse all dentists and choose the best match for your treatment.",
          browseDentists: "Browse Dentists",
          reviews: "Reviews",
          contactSection: "Contact Section",
          contactText:
            "Need help choosing the right treatment? Reach out and our team will assist you with consultation and scheduling.",
          phone: "Phone",
          email: "Email",
          address: "Address",
          contactAndBook: "Contact & Book",
          view: "View",
          new: "New",
        };

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-linear-to-br from-sky-700 via-sky-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-sky-100 mb-6">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-white">
                  {ui.home}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/services" className="hover:text-white">
                  {ui.services}
                </Link>
              </li>
              <li>/</li>
              <li className="text-white font-semibold">{localized.name}</li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                {localized.name}
              </h1>
              <p className="mt-4 text-sky-100 text-lg">
                {localized.shortDescription}
              </p>
            </div>
            <Link
              href={`/book-appointment?treatment=${encodeURIComponent(service.name)}`}
            >
              <Button className="bg-white text-sky-700 hover:bg-sky-50">
                {ui.bookThisService}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 overflow-hidden">
            <div className="relative w-full h-70 sm:h-90 bg-white">
              <Image
                src={service.imageSrc}
                alt={localized.name}
                fill
                className="object-contain p-6"
                priority
              />
            </div>
          </Card>

          <Card>
            <CardBody>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {ui.quickInformation}
              </h2>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                  <span className="font-medium">{ui.duration}</span>
                  <span>{localized.quickInfo.duration}</span>
                </li>
                <li className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                  <span className="font-medium">{ui.recoveryTime}</span>
                  <span>{localized.quickInfo.recoveryTime}</span>
                </li>
                <li className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                  <span className="font-medium">{ui.anesthesia}</span>
                  <span>{localized.quickInfo.anesthesia}</span>
                </li>
                <li className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                  <span className="font-medium">{ui.cost}</span>
                  <span>{localized.quickInfo.cost}</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="font-medium">{ui.appointmentRequired}</span>
                  <span>{localized.quickInfo.appointmentRequired}</span>
                </li>
              </ul>
            </CardBody>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {ui.overview}
              </h2>
              <p className="text-slate-700 leading-relaxed">
                {localized.overview}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {ui.symptoms}
              </h2>
              <ul className="space-y-2 text-slate-700">
                {localized.symptoms.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-sky-600">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </section>

        <section>
          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {ui.whenNeed}
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                {localized.whenNeeded.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </section>

        <section>
          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {ui.treatmentProcedure}
              </h2>
              <div className="space-y-3">
                {localized.treatmentProcedure.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-3"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-600 text-white text-xs font-bold shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-slate-700">
                      <span className="font-semibold">
                        {ui.step} {index + 1}:{" "}
                      </span>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {ui.benefits}
              </h2>
              <ul className="space-y-2 text-slate-700">
                {localized.benefits.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {ui.afterCare}
              </h2>
              <ul className="space-y-2 text-slate-700">
                {localized.afterCare.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-cyan-600">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {ui.avoid}
              </h2>
              <ul className="space-y-2 text-slate-700">
                {localized.avoidIf.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-rose-600">⚠</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </section>

        <section>
          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {ui.faq}
              </h2>
              <div className="space-y-4">
                {localized.faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <h3 className="font-semibold text-slate-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-slate-700 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">
              {ui.relatedServices}
            </h2>
            <Link
              href="/services"
              className="text-sky-600 text-sm font-medium hover:underline"
            >
              {ui.viewAllServices}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedServices.map((related) => {
              const relatedName = getLocalizedServiceName(related, locale);
              const relatedDesc = getLocalizedServiceContent(
                related,
                locale,
              ).shortDescription;
              return (
                <Card key={related.slug} hover>
                  <CardBody>
                    <div className="flex items-start gap-3">
                      <Image
                        src={related.iconSrc}
                        alt={relatedName}
                        width={56}
                        height={56}
                        className="h-14 w-14 object-contain rounded-md border border-slate-100 bg-slate-50 p-1"
                      />
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {relatedName}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {relatedDesc}
                        </p>
                        <Link
                          href={`/services/${related.slug}`}
                          className="inline-block mt-2 text-xs text-sky-600 hover:underline"
                        >
                          {ui.readDetails}
                        </Link>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="bg-sky-600 rounded-2xl p-6 sm:p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">{ui.bookAppointmentCta}</h2>
          <p className="text-sky-100 max-w-2xl">{ui.ctaText}</p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/book-appointment?treatment=${encodeURIComponent(service.name)}`}
            >
              <Button className="bg-white text-sky-700 hover:bg-sky-50">
                {ui.bookAppointment}
              </Button>
            </Link>
            <Link href="/dentists">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                {ui.viewDoctors}
              </Button>
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {ui.doctorList}
          </h2>
          {doctors.length === 0 ? (
            <Card>
              <CardBody>
                <p className="text-slate-600">{ui.noDoctors}</p>
                <Link href="/dentists" className="inline-block mt-3">
                  <Button variant="outline">{ui.browseDentists}</Button>
                </Link>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doctor) => (
                <Card key={doctor._id} hover>
                  <CardBody>
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-xl overflow-hidden shrink-0">
                        {doctor.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={doctor.photo}
                            alt={doctor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          "👨‍⚕️"
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900">
                          Dr. {doctor.name}
                        </h3>
                        <p className="text-sm text-sky-600">
                          {doctor.specialization}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          📍 {doctor.clinicLocation}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          ⭐{" "}
                          {doctor.rating > 0
                            ? doctor.rating.toFixed(1)
                            : ui.new}{" "}
                          • 💰 ${doctor.consultationFee}
                        </p>
                      </div>

                      <Link href={`/dentists/${doctor._id}`}>
                        <Button size="sm" variant="outline">
                          {ui.view}
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {ui.reviews}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localized.reviews.map((review) => (
              <Card key={`${review.patientName}-${review.date}`}>
                <CardBody>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">
                      {review.patientName}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {review.date}
                    </span>
                  </div>
                  <p className="text-amber-500 mb-2">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </p>
                  <p className="text-sm text-slate-700">{review.comment}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <Card className="border-sky-200 bg-sky-50">
            <CardBody>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {ui.contactSection}
              </h2>
              <p className="text-slate-700 mb-4">{ui.contactText}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-700">
                <div className="rounded-lg bg-white p-3 border border-sky-100">
                  <p className="font-semibold text-slate-900">{ui.phone}</p>
                  <p>+880 1700-000000</p>
                </div>
                <div className="rounded-lg bg-white p-3 border border-sky-100">
                  <p className="font-semibold text-slate-900">{ui.email}</p>
                  <p>care@dentalcare.com</p>
                </div>
                <div className="rounded-lg bg-white p-3 border border-sky-100">
                  <p className="font-semibold text-slate-900">{ui.address}</p>
                  <p>Dhaka, Bangladesh</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/book-appointment">
                  <Button>{ui.contactAndBook}</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </section>
      </main>
    </div>
  );
}
