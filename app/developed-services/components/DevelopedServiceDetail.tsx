"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";
import { DevelopedServiceData } from "@/lib/services";

interface DevelopedServiceDetailProps {
  service: DevelopedServiceData;
  relatedServices: DevelopedServiceData[];
}

export default function DevelopedServiceDetail({
  service,
  relatedServices,
}: DevelopedServiceDetailProps) {
  const { locale } = useLanguage();

  const title = locale === "bn" ? service.title.bn : service.title.en;
  const shortDescription =
    locale === "bn" ? service.shortDescription.bn : service.shortDescription.en;
  const description =
    locale === "bn" ? service.description.bn : service.description.en;
  const duration = locale === "bn" ? service.duration.bn : service.duration.en;
  const benefits = locale === "bn" ? service.benefits.bn : service.benefits.en;
  const treatmentProcess =
    locale === "bn" ? service.treatmentProcess.bn : service.treatmentProcess.en;

  const ui =
    locale === "bn"
      ? {
          home: "হোম",
          developed: "উন্নত সেবাসমূহ",
          duration: "সময়কাল",
          overview: "ওভারভিউ",
          process: "চিকিৎসা প্রক্রিয়া",
          benefits: "উপকারিতা",
          step: "ধাপ",
          related: "সম্পর্কিত উন্নত সেবা",
          viewAll: "সব উন্নত সেবা দেখুন",
          readDetails: "বিস্তারিত পড়ুন",
          book: "অ্যাপয়েন্টমেন্ট বুক করুন",
        }
      : {
          home: "Home",
          developed: "Developed Services",
          duration: "Duration",
          overview: "Overview",
          process: "Treatment Process",
          benefits: "Benefits",
          step: "Step",
          related: "Related Developed Services",
          viewAll: "View all developed services",
          readDetails: "Read details",
          book: "Book Appointment",
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
                <Link href="/developed-services" className="hover:text-white">
                  {ui.developed}
                </Link>
              </li>
              <li>/</li>
              <li className="text-white font-semibold">{title}</li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                {title}
              </h1>
              <p className="mt-4 text-sky-100 text-lg">{shortDescription}</p>
            </div>
            <Link
              href={`/book-appointment?treatment=${encodeURIComponent(service.title.en)}`}
            >
              <Button className="bg-white text-sky-700 hover:bg-sky-50">
                {ui.book}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Card className="overflow-hidden">
          <div className="relative w-full h-80 bg-white">
            <Image
              src={service.image}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </Card>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardBody>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {ui.overview}
              </h2>
              <p className="text-slate-700 leading-relaxed">{description}</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                {ui.duration}
              </h2>
              <p className="text-slate-700">{duration}</p>
            </CardBody>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {ui.process}
              </h2>
              <div className="space-y-3">
                {treatmentProcess.map((step, index) => (
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

          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {ui.benefits}
              </h2>
              <ul className="space-y-2 text-slate-700">
                {benefits.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">{ui.related}</h2>
            <Link
              href="/developed-services"
              className="text-sky-600 text-sm font-medium hover:underline"
            >
              {ui.viewAll}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedServices.map((related) => {
              const relatedTitle =
                locale === "bn" ? related.title.bn : related.title.en;
              const relatedDescription =
                locale === "bn"
                  ? related.shortDescription.bn
                  : related.shortDescription.en;

              return (
                <Card key={related.slug} hover>
                  <CardBody>
                    <h3 className="font-semibold text-slate-900">
                      {relatedTitle}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {relatedDescription}
                    </p>
                    <Link
                      href={`/developed-services/${related.slug}`}
                      className="inline-block mt-2 text-xs text-sky-600 hover:underline"
                    >
                      {ui.readDetails}
                    </Link>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
