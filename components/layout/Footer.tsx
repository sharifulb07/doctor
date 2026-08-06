"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-2xl mb-4">
              <span className="text-3xl">🦷</span>
              <span>{t.nav.brand}</span>
            </div>

            <p className="text-sm leading-7 text-slate-400 max-w-md">
              {t.footer.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">
              {t.footer.quickLinks}
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-sky-400 transition-colors"
                >
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
            <h3 className="text-white font-semibold text-base mb-4">
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
            <h3 className="text-white font-semibold text-base mb-4">
              {t.footer.followUs || "Follow Us"}
            </h3>

            <div className="flex flex-wrap gap-3">
              <Link
                href="https://facebook.com"
                target="_blank"
                className="w-11 h-11 rounded-full bg-slate-800 hover:bg-blue-600 transition-all duration-300 flex items-center justify-center hover:scale-110"
              >
                <FaFacebookF className="text-white text-lg" />
              </Link>

              <Link
                href="https://instagram.com"
                target="_blank"
                className="w-11 h-11 rounded-full bg-slate-800 hover:bg-pink-600 transition-all duration-300 flex items-center justify-center hover:scale-110"
              >
                <FaInstagram className="text-white text-lg" />
              </Link>

              <Link
                href="https://linkedin.com"
                target="_blank"
                className="w-11 h-11 rounded-full bg-slate-800 hover:bg-sky-700 transition-all duration-300 flex items-center justify-center hover:scale-110"
              >
                <FaLinkedinIn className="text-white text-lg" />
              </Link>

              <Link
                href="https://youtube.com"
                target="_blank"
                className="w-11 h-11 rounded-full bg-slate-800 hover:bg-red-600 transition-all duration-300 flex items-center justify-center hover:scale-110"
              >
                <FaYoutube className="text-white text-lg" />
              </Link>

              <Link
                href="https://wa.me/8801742675039"
                target="_blank"
                className="w-11 h-11 rounded-full bg-slate-800 hover:bg-green-600 transition-all duration-300 flex items-center justify-center hover:scale-110"
              >
                <FaWhatsapp className="text-white text-lg" />
              </Link>
            </div>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              {t.footer.socialText ||
                "Stay connected with us for dental tips, clinic updates and special offers."}
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} {t.footer.copyright}
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
    </footer>
  );
}