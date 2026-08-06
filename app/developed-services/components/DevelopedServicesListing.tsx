"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";
import { DevelopedServiceData } from "@/lib/services";

interface DevelopedServicesListingProps {
  services: DevelopedServiceData[];
}

export default function DevelopedServicesListing({
  services,
}: DevelopedServicesListingProps) {
  const { locale } = useLanguage();

  const ui =
    locale === "bn"
      ? {
          home: "হোম",
          title: "উন্নত সেবাসমূহ",
          subtitle:
            "আমাদের আধুনিকভাবে উন্নত ডেন্টাল সেবাগুলো দেখুন এবং আপনার প্রয়োজন অনুযায়ী সেবাটি নির্বাচন করুন।",
          duration: "সময়কাল",
          details: "বিস্তারিত দেখুন",
        }
      : {
          home: "Home",
          title: "Developed Services",
          subtitle:
            "Discover our developed dental services designed with modern workflows and patient-focused care.",
          duration: "Duration",
          details: "View Details",
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
              <li className="text-white font-semibold">{ui.title}</li>
            </ol>
          </nav>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {ui.title}
          </h1>
          <p className="mt-4 text-sky-100 max-w-3xl text-lg">{ui.subtitle}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const title = locale === "bn" ? service.title.bn : service.title.en;
            const shortDescription =
              locale === "bn"
                ? service.shortDescription.bn
                : service.shortDescription.en;
            const duration =
              locale === "bn" ? service.duration.bn : service.duration.en;

            return (
              <Card key={service.slug} hover className="h-full flex flex-col">
                <CardBody className="flex h-full flex-col">
                  <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-100 bg-white mb-4">
                    <Image
                      src={service.image}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 mb-2">
                    {title}
                  </h2>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                    {shortDescription}
                  </p>

                  <p className="text-xs text-slate-500 mb-5">
                    <span className="font-semibold text-slate-700">
                      {ui.duration}:
                    </span>{" "}
                    {duration}
                  </p>

                  <Link
                    href={`/developed-services/${service.slug}`}
                    className="mt-auto"
                  >
                    <Button variant="outline" className="w-full">
                      {ui.details}
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
