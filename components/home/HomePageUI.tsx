"use client";

import Image from "next/image";
import Link from "next/link";
import DentistCard from "@/components/dentists/DentistCard";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { IDentist } from "@/types";
import { getAllServices } from "@/lib/services";
import pro from "@/public/pro.png"
import teeth from "@/public/teethmain.png"

interface HomePageUIProps {
  dentists: Array<IDentist & { _id: string }>;
}

export default function HomePageUI({ dentists }: HomePageUIProps) {
  const { t, locale } = useLanguage();
  const h = t.home;
  const allServices = getAllServices();

  const isImageSrcString = (value: string) =>
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:");

  const stats = [
    { label: h.stats.expertDentists, value: "15+" },
    { label: h.stats.happyPatients, value: "10,000+" },
    { label: h.stats.yearsOfService, value: "12+" },
    { label: h.stats.treatments, value: "20+" },
  ];

  const steps = [
    { icon: "🔍", step: "1", ...h.steps[0] },
    { icon: "📅", step: "2", ...h.steps[1] },
    { icon: "✅", step: "3", ...h.steps[2] },
  ];

  const carouselServices = h.services.slice(0, 12).map((service, index) => ({
    title: service.label,
    description:
      locale === "bn"
        ? "বিস্তারিত জানতে সেবাটিতে ক্লিক করুন এবং চিকিৎসা, সময়কাল ও যত্ন সম্পর্কে পড়ুন।"
        : "Click to explore treatment steps, duration, after-care, and booking details.",
    image: `/carousels/${(index % 12) + 1}.jpeg`,
    href: allServices[index] ? `/services/${allServices[index].slug}` : "/services",
  }));

  const duplicatedServices = [...carouselServices, ...carouselServices];

  return (
    <div>
      {/* Hero */}
     <section className="bg-linear-to-br from-sky-600 via-sky-500 to-cyan-400 text-white">
  <div className="
    max-w-7xl 
    mx-auto 
    px-4 
    sm:px-6 
    lg:px-8 
    py-8 
    lg:py-16

    flex 
    flex-col 
    lg:flex-row 
    items-center 
    justify-between
    gap-12
  ">

    {/* Hero Content */}
    <div className="max-w-3xl text-center lg:text-left">

      <h1 className="
        text-4xl 
        sm:text-5xl 
        lg:text-6xl 
        font-extrabold 
        leading-tight 
        mb-6
      ">
        {h.heroTitle1}
        <br />
        <span className="text-cyan-200">
          {h.heroTitle2}
        </span>
      </h1>


      <p className="
        text-lg 
        sm:text-xl 
        text-sky-100 
        mb-10 
        leading-relaxed
      ">
        {h.heroSubtitle}
      </p>


      <div className="
        flex 
        flex-col 
        sm:flex-row 
        gap-4
        justify-center
        lg:justify-start
      ">

        <Link href="/book-appointment">
          <Button
            size="lg"
            className="
              bg-white 
              text-sky-600 
              hover:bg-sky-50 
              w-full 
              sm:w-auto
            "
          >
            {h.bookAppointment}
          </Button>
        </Link>


        <Link href="/dentists">
          <Button
            size="lg"
            variant="outline"
            className="
              border-white 
              text-white 
              hover:bg-white/10 
              w-full 
              sm:w-auto
            "
          >
            {h.meetDentists}
          </Button>
        </Link>

      </div>

    </div>


    {/* Hero Image */}
    <div className="
      relative
      w-[280px]
      sm:w-[320px]
      lg:w-[380px]
      flex
      justify-center
    ">

      <Image
        src={pro}
        width={380}
        height={400}
        alt="Doctor"
        className="
          rounded-full
          object-cover
        "
        priority
      />


      <Image
        src={teeth}
        width={250}
        height={300}
        alt="Teeth"
        className="
          absolute
          -bottom-10
          sm:-bottom-14
          lg:-bottom-16
          left-1/2
          -translate-x-1/2
          z-10
        "
      />

    </div>


  </div>
</section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-extrabold text-sky-600">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Carousel */}
      <section className="overflow-hidden py-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">
            {h.currentService}
          </h2>
          <p className="text-center text-slate-500 mt-2">{h.currentSubtitle}</p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-linear-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-linear-to-l from-white to-transparent z-10" />

          <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
            {duplicatedServices.map((service, index) => (
              <Link
                key={`${service.title}-${index}`}
                href={service.href}
                className="mx-3 w-75 rounded-2xl border bg-white p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-100 mb-4 bg-slate-50">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
            {h.howItWorks}
          </h2>
          <p className="text-center text-slate-500 mb-12">
            {h.howItWorksSubtitle}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center text-3xl mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Dentists */}
      {dentists.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  {h.topDentists}
                </h2>
                <p className="text-slate-500 mt-1">{h.topDentistsSubtitle}</p>
              </div>
              <Link href="/dentists" className="hidden sm:block">
                <Button variant="outline">{h.viewAll}</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dentists.map((d) => (
                <DentistCard key={d._id} dentist={d} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
            {h.ourServices}
          </h2>
          <p className="text-center text-slate-500 mb-12">
            {h.ourServicesSubtitle}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {h.services.map((s, index) => (
              <Link
                key={s.label}
                href={
                  allServices[index]
                    ? `/services/${allServices[index].slug}`
                    : "/services"
                }
                className="bg-white rounded-xl p-4 h-50 text-center shadow-sm border border-slate-100 hover:shadow-md transition-shadow block"
              >
                <div className="text-3xl mb-2 mx-auto flex items-center justify-center">
                  {typeof s.icon === "string" ? (
                    isImageSrcString(s.icon) ? (
                      <Image
                        src={s.icon}
                        alt={s.label}
                        width={128}
                        height={128}
                        className="h-16 w-16 object-contain"
                      />
                    ) : (
                      s.icon
                    )
                  ) : (
                    <Image
                      src={s.icon}
                      alt={s.label}
                      width={128}
                      height={128}
                      className="h-32 w-32 object-contain"
                    />
                  )}
                </div>
                <p className="text-xs font-medium text-slate-700">{s.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-sky-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{h.ctaTitle}</h2>
          <p className="text-sky-100 mb-8 text-lg">{h.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-sky-600 hover:bg-sky-50 w-full sm:w-auto"
              >
                {h.createAccount}
              </Button>
            </Link>
            <Link href="/book-appointment">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
              >
                {h.bookNow}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
