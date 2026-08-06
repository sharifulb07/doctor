"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";
import { ServiceDetails } from "@/lib/services";
import { getLocalizedServiceContent } from "@/lib/servicesI18n";

interface ServicesPageContentProps {
  services: ServiceDetails[];
}

export default function ServicesPageContent({
  services,
}: ServicesPageContentProps) {
  const { locale } = useLanguage();

  const ui =
    locale === "bn"
      ? {
          home: "হোম",
          services: "সেবাসমূহ",
          title: "সমন্বিত ডেন্টাল সেবাসমূহ",
          subtitle:
            "সব চিকিৎসা সম্পর্কে বিস্তারিত জানুন, তুলনা করুন এবং আপনার জন্য উপযুক্ত চিকিৎসা পরিকল্পনা বেছে নিন।",
          duration: "সময়কাল",
          cost: "খরচ",
          viewDetails: "বিস্তারিত দেখুন",
        }
      : {
          home: "Home",
          services: "Services",
          title: "Comprehensive Dental Services",
          subtitle:
            "Browse all treatments, compare procedure details, and find the right care plan for your dental needs.",
          duration: "Duration",
          cost: "Cost",
          viewDetails: "View Details",
        };

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-linear-to-br from-sky-700 via-sky-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-sky-100 mb-6">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-white">
                  {ui.home}
                </Link>
              </li>
              <li>/</li>
              <li className="text-white font-semibold">{ui.services}</li>
            </ol>
          </nav>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {ui.title}
          </h1>
          <p className="mt-4 text-sky-100 max-w-3xl text-lg">{ui.subtitle}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const localized = getLocalizedServiceContent(service, locale);
            return (
              <Card
                key={`${service.slug}-${index}`}
                hover
                className="h-full flex flex-col"
              >
                <CardBody className="flex h-full flex-col">
                  <div className="h-20 w-20 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center mb-4">
                    <Image
                      src={service.iconSrc}
                      alt={localized.name}
                      width={64}
                      height={64}
                      className="h-14 w-14 object-contain"
                    />
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 mb-2">
                    {localized.name}
                  </h2>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                    {localized.shortDescription}
                  </p>

                  <div className="space-y-2 text-xs text-slate-500 mb-5">
                    <p>
                      <span className="font-semibold text-slate-700">
                        {ui.duration}:
                      </span>{" "}
                      {localized.quickInfo.duration}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-700">
                        {ui.cost}:
                      </span>{" "}
                      {localized.quickInfo.cost}
                    </p>
                  </div>

                  <Link href={`/services/${service.slug}`} className="mt-auto">
                    <Button variant="outline" className="w-full">
                      {ui.viewDetails}
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
