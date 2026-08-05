"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <span className="text-2xl">🦷</span>
              <span>{t.nav.brand}</span>
            </div>
            <p className="text-sm leading-relaxed">{t.footer.tagline}</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-sky-400 transition-colors">
                  {t.footer.home}
                </Link>
              </li>
              <li>
                <Link
                  href="/dentists"
                  className="hover:text-sky-400 transition-colors"
                >
                  {t.footer.ourDentists}
                </Link>
              </li>
              <li>
                <Link
                  href="/book-appointment"
                  className="hover:text-sky-400 transition-colors"
                >
                  {t.footer.bookAppointment}
                </Link>
              </li>
              <li>
                <Link
                  href="/appointments"
                  className="hover:text-sky-400 transition-colors"
                >
                  {t.footer.myAppointments}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">
              {t.footer.contact}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>📞 +1 (555) 123-4567</li>
              <li>📧 info@dentalcare.com</li>
              <li>📍 123 Dental Street, Health City</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-xs">
          <p>
            © {new Date().getFullYear()} {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
