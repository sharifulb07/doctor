"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer({ currentYear }: { currentYear: number }) {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
              <Image
                src={logo}
                width={300}
                height={200}
                alt="logo"
                className="h-[75] w-[85]"
              />
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400">
              {t.footer.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
              {t.footer.quickLinks}
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-sky-400 transition-colors">
                  {t.footer.home}
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  className="hover:text-sky-400 transition-colors"
                >
                  {t.nav.services}
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

              <li>
                <Link
                  href="/contact"
                  className="hover:text-sky-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
              {t.footer.contact}
            </h3>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span>📞</span>
                <span>+8801742675039</span>
              </li>

              <li className="flex items-start gap-2 break-all">
                <span>📧</span>
                <span>mostafizurrahman3535@gmail.com</span>
              </li>

              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Islami Bank Hospital, Khulna</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
              {t.footer.followUs || "Follow Us"}
            </h3>

            <div className="flex flex-wrap gap-3">
              <Link
                href="https://www.facebook.com/share/17U7m6W7Rv/"
                target="_blank"
                className="group flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 transition-all duration-300 hover:scale-110 hover:bg-blue-600 dark:bg-slate-800"
              >
                <FaFacebookF className="text-lg text-slate-700 group-hover:text-white dark:text-white" />
              </Link>

              <Link
                href="https://www.instagram.com/mostafizur_rahmann?utm_source=qr&igsh=dDBjYnpoajBpN3I0"
                target="_blank"
                className="group flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 transition-all duration-300 hover:scale-110 hover:bg-pink-600 dark:bg-slate-800"
              >
                <FaInstagram className="text-lg text-slate-700 group-hover:text-white dark:text-white" />
              </Link>

              <Link
                href="https://linkedin.com"
                target="_blank"
                className="group flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 transition-all duration-300 hover:scale-110 hover:bg-sky-700 dark:bg-slate-800"
              >
                <FaLinkedinIn className="text-lg text-slate-700 group-hover:text-white dark:text-white" />
              </Link>

              <Link
                href="https://youtube.com/@mostafiz3535?si=QUCSA9cnqn4o4VpE"
                target="_blank"
                className="group flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 transition-all duration-300 hover:scale-110 hover:bg-red-600 dark:bg-slate-800"
              >
                <FaYoutube className="text-lg text-slate-700 group-hover:text-white dark:text-white" />
              </Link>

              <Link
                href="https://wa.me/8801742675039"
                target="_blank"
                className="group flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 transition-all duration-300 hover:scale-110 hover:bg-green-600 dark:bg-slate-800"
              >
                <FaWhatsapp className="text-lg text-slate-700 group-hover:text-white dark:text-white" />
              </Link>
            </div>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              {t.footer.socialText ||
                "Stay connected with us for dental tips, clinic updates and special offers."}
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 md:flex-row">
          <p>
            © {currentYear} {t.footer.copyright}
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-sky-400 transition-colors"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="hover:text-sky-400 transition-colors"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/cookies"
              className="hover:text-sky-400 transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "auto" })}
        aria-label="Back to top"
        title="Back to top"
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg ring-1 ring-white/30 transition hover:-translate-y-1 hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="h-5 w-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 15 6-6 6 6" />
        </svg>
      </button>
    </footer>
  );
}
