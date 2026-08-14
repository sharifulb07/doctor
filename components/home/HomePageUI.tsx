"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DentistCard from "@/components/dentists/DentistCard";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { IDentist } from "@/types";
import pro from "@/public/pro.png";
import teeth from "@/public/teethmain.png";

interface HomePageUIProps {
  dentists: Array<IDentist & { _id: string }>;
  carouselServices: Array<{
    slug: string;
    title: { bn: string; en: string };
    image: string | StaticImageData;
  }>;
  serviceCards: Array<{ slug: string; name: string; imageSrc: string }>;
}

export default function HomePageUI({
  dentists,
  carouselServices,
  serviceCards,
}: HomePageUIProps) {
  const { t, locale } = useLanguage();
  const h = t.home;
  const homeRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState(0);

  const faqs =
    locale === "bn"
      ? [
          {
            question: "কীভাবে অনলাইনে অ্যাপয়েন্টমেন্ট বুক করব?",
            answer:
              "একজন দন্তচিকিৎসক নির্বাচন করুন, সুবিধাজনক তারিখ ও সময় বেছে নিন এবং আপনার তথ্য দিয়ে বুকিং নিশ্চিত করুন।",
          },
          {
            question: "অ্যাপয়েন্টমেন্ট পরিবর্তন বা বাতিল করা যাবে কি?",
            answer:
              "হ্যাঁ। আপনার ড্যাশবোর্ড থেকে আসন্ন অ্যাপয়েন্টমেন্ট দেখুন এবং প্রয়োজন অনুযায়ী সেটি পরিচালনা করুন।",
          },
          {
            question: "ক্লিনিকে যাওয়ার সময় কী সঙ্গে আনব?",
            answer:
              "আগের প্রেসক্রিপশন, এক্স-রে, ব্যবহৃত ওষুধের তালিকা এবং প্রাসঙ্গিক চিকিৎসার নথি সঙ্গে আনুন।",
          },
          {
            question: "জরুরি দাঁতের সমস্যায় কী করব?",
            answer:
              "তীব্র ব্যথা, রক্তপাত বা আঘাতের ক্ষেত্রে দ্রুত ক্লিনিকে যোগাযোগ করুন এবং নিকটতম সময় বুক করুন।",
          },
        ]
      : [
          {
            question: "How do I book a dental appointment online?",
            answer:
              "Choose a dental surgeon, select a convenient available date and time, then confirm the booking with your details.",
          },
          {
            question: "Can I change or cancel my appointment?",
            answer:
              "Yes. Open your dashboard to review upcoming appointments and manage them when your plans change.",
          },
          {
            question: "What should I bring to my clinic visit?",
            answer:
              "Bring previous prescriptions, X-rays, a list of current medicines, and any relevant medical records.",
          },
          {
            question: "What should I do for a dental emergency?",
            answer:
              "For severe pain, bleeding, or trauma, contact the clinic promptly and book the earliest available visit.",
          },
        ];

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (
      !homeRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-gsap-hero-copy] > *", {
          opacity: 0,
          y: 36,
          duration: 0.75,
          stagger: 0.12,
        })
        .from(
          "[data-gsap-hero-art]",
          { opacity: 0, x: 50, scale: 0.92, duration: 0.9 },
          "-=0.55",
        )
        .from(
          "[data-gsap-stat]",
          { opacity: 0, y: 20, duration: 0.45, stagger: 0.08 },
          "-=0.35",
        );

      gsap.utils
        .toArray<HTMLElement>("[data-gsap-section]")
        .forEach((section) => {
          gsap.from(section, {
            opacity: 0,
            y: 55,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 84%", once: true },
          });
        });
    }, homeRef);

    return () => context.revert();
  }, []);

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

  const localizedCarouselServices = carouselServices.map((service) => ({
    title: locale === "bn" ? service.title.bn : service.title.en,
    image: service.image,
    href: `/developed-services/${service.slug}`,
  }));
  const duplicatedCarouselServices = [
    ...localizedCarouselServices,
    ...localizedCarouselServices,
  ];

  return (
    <div ref={homeRef}>
      {/* Hero */}
      <section className="bg-linear-to-br from-sky-600 via-sky-500 to-cyan-400 text-white">
        <div
          className="
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
  "
        >
          {/* Hero Content */}
          <div
            data-gsap-hero-copy
            className="max-w-3xl text-center lg:text-left"
          >
            <h1
              className="
        text-4xl 
        sm:text-5xl 
        lg:text-6xl 
        font-extrabold 
        leading-tight 
        mb-6
      "
            >
              {h.heroTitle1}
              <br />
              <span className="text-cyan-200">{h.heroTitle2}</span>
            </h1>

            <p
              className="
        text-lg 
        sm:text-xl 
        text-sky-100 
        mb-10 
        leading-relaxed
      "
            >
              {h.heroSubtitle}
            </p>

            <div
              className="
        flex 
        flex-col 
        sm:flex-row 
        gap-4
        justify-center
        lg:justify-start
      "
            >
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
          <div
            data-gsap-hero-art
            className="
      relative
      w-[280px]
      sm:w-[320px]
      lg:w-[380px]
      flex
      justify-center
    "
          >
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
              <div key={stat.label} data-gsap-stat>
                <p className="text-3xl font-extrabold text-sky-600">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developed services carousel — intentionally separate from Services */}
      <section
        data-gsap-section
        className="overflow-hidden border-b border-slate-200 bg-white py-10"
      >
        <div className="mx-auto mb-6 max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            {h.currentService}
          </h2>
          <p className="mt-2 text-center text-slate-500">{h.currentSubtitle}</p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-white to-transparent" />
          <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
            {duplicatedCarouselServices.map((service, index) => {
              const isDuplicate = index >= localizedCarouselServices.length;
              return (
                <Link
                  key={`${service.href}-${index}`}
                  href={service.href}
                  aria-hidden={isDuplicate || undefined}
                  tabIndex={isDuplicate ? -1 : undefined}
                  className="group relative mx-3 flex h-80 w-100 flex-col rounded-2xl border-2 border-sky-200 bg-white p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-sky-500 hover:shadow-[0_0_25px_rgba(14,165,233,0.35)]"
                >
                  <div className="relative mb-4 h-[90%] w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50 transition-all duration-300 group-hover:border-sky-400">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="400px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-sky-600">
                    {service.title}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section data-gsap-section className="py-20 bg-slate-50">
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
      <section data-gsap-section className="py-20 bg-white">
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
          {dentists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dentists.map((d) => (
                <DentistCard key={d._id} dentist={d} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-slate-50 px-6 py-10 text-center text-slate-500">
              {t.dentists.noResults}
            </p>
          )}
        </div>
      </section>

      {/* Services */}
      <section data-gsap-section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
            {h.ourServices}
          </h2>
          <p className="text-center text-slate-500 mb-12">
            {h.ourServicesSubtitle}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {serviceCards.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="
    group relative block overflow-hidden
    h-55 rounded-2xl
    shadow-lg
    border border-sky-200

    [perspective:1200px]
    transition-all duration-700
    hover:-translate-y-3
    hover:shadow-2xl
  "
              >
                <div
                  className="
      relative
      h-full
      w-full
      overflow-hidden
      rounded-2xl

      [transform-style:preserve-3d]

      transition-transform
      duration-700
      ease-out

      group-hover:[transform:rotateX(12deg)_rotateY(-12deg)_scale(1.05)]
    "
                >
                  {/* Full card image */}
                  <Image
                    src={service.imageSrc}
                    alt={service.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="
        object-cover

        transition-transform
        duration-[10s]

        group-hover:scale-125
        [transform:translateZ(20px)]
      "
                  />

                  {/* Dental overlay */}
                  <div
                    className="
        absolute inset-0
        bg-linear-to-t
        from-sky-950/90
        via-sky-600/30
        to-transparent

        [transform:translateZ(30px)]
      "
                  />

                  {/* X-ray scanning light */}
                  <div
                    className="
        absolute inset-0
        overflow-hidden
      "
                  >
                    <span
                      className="
          absolute
          -left-full
          top-0
          h-full
          w-1/3

          bg-linear-to-r
          from-transparent
          via-white/50
          to-transparent

          rotate-12

          group-hover:left-[150%]
          transition-all
          duration-[3000ms]
        "
                    />
                  </div>

                  {/* Dental pulse animation */}
                  <div
                    className="
        absolute
        inset-0
        flex
        items-center
        justify-center

        [transform:translateZ(50px)]
      "
                  >
                    <span
                      className="
          absolute
          w-32
          h-32
          rounded-full
          border-2
          border-sky-300/50
          animate-ping
        "
                    />

                    <span
                      className="
          absolute
          w-44
          h-44
          rounded-full
          border
          border-white/30
          animate-pulse
        "
                    />
                  </div>

                  {/* Content pops forward */}
                  <div
                    className="
        relative
        z-10
        h-full

        flex
        flex-col
        items-center
        justify-end

        p-5
        text-center

        [transform:translateZ(70px)]
      "
                  >
                    <h3
                      className="
          text-white
          font-bold
          text-lg
          drop-shadow-lg

          group-hover:text-sky-200
          transition-colors
        "
                    >
                      {service.name}
                    </h3>
                  </div>

                  {/* Animated border */}
                  <div
                    className="
        absolute
        inset-0
        rounded-2xl

        border-2
        border-sky-300

        opacity-0
        group-hover:opacity-100

        animate-pulse

        pointer-events-none
      "
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section data-gsap-section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
              {locale === "bn" ? "সাধারণ প্রশ্ন" : "FAQ"}
            </p>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              {locale === "bn"
                ? "প্রায়শই জিজ্ঞাসিত প্রশ্ন"
                : "Frequently Asked Questions"}
            </h2>
            <p className="mt-3 text-slate-500">
              {locale === "bn"
                ? "আপনার ভিজিটের আগে প্রয়োজনীয় উত্তরগুলো জেনে নিন।"
                : "Helpful answers to know before your visit."}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`home-faq-${index}`}
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  >
                    <span className="font-semibold text-slate-900">
                      {faq.question}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xl text-sky-700 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                  <div id={`home-faq-${index}`} hidden={!isOpen}>
                    <p className="px-5 pb-5 leading-7 text-slate-600 sm:px-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-gsap-section className="py-20 bg-sky-600 text-white">
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
