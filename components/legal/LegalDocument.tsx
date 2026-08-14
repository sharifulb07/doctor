"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export interface LegalCopy {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: Array<{ title: string; paragraphs: string[] }>;
}

export default function LegalDocument({
  en,
  bn,
}: {
  en: LegalCopy;
  bn: LegalCopy;
}) {
  const { locale } = useLanguage();
  const copy = locale === "bn" ? bn : en;

  return (
    <div className="bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 sm:py-16">
      <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <header className="border-b border-slate-200 bg-linear-to-br from-sky-600 to-cyan-500 px-6 py-10 text-white dark:border-slate-700 sm:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-100">
            {copy.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-sky-50">{copy.intro}</p>
          <p className="mt-5 text-sm text-sky-100">{copy.updated}</p>
        </header>

        <div className="space-y-9 px-6 py-10 sm:px-10">
          {copy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 leading-7 text-slate-600 dark:text-slate-300">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 text-slate-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-slate-300">
            {locale === "bn" ? "কোনো প্রশ্ন আছে?" : "Have a question?"}{" "}
            <Link
              href="/contact"
              className="font-semibold text-sky-700 hover:underline dark:text-sky-400"
            >
              {locale === "bn" ? "আমাদের ইমেইল করুন" : "Email us"}
            </Link>
            .
          </div>
        </div>
      </article>
    </div>
  );
}
