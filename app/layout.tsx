import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { Metadata } from "next";

const SITE_NAME = "EasyDentalSolution";
const SITE_URL = "https://www.easydentalsolution.com";

export const metadata: Metadata = {
  // =========================================================
  // BASE URL
  // =========================================================
  metadataBase: new URL(SITE_URL),

  // =========================================================
  // BASIC WEBSITE INFORMATION
  // =========================================================
  applicationName: SITE_NAME,

  title: {
    default:
      "EasyDentalSolution | Online Dental Appointment & Dental Care",
    template: `%s | ${SITE_NAME}`,
  },

  description:
    "EasyDentalSolution helps patients find qualified dentists, explore dental treatments, and book dental appointments online. Discover root canal treatment, dental implants, teeth whitening, orthodontics, crowns, emergency dental care, and more.",

  // =========================================================
  // SEO KEYWORDS
  // =========================================================
  keywords: [
    // Brand
    "EasyDentalSolution",
    "Easy Dental Solution",
    "EasyDental Solution",

    // Main dental keywords
    "dentist",
    "dental clinic",
    "dental care",
    "dental treatment",
    "dental services",
    "dental surgeon",

    // Appointment keywords
    "dental appointment",
    "dentist appointment",
    "online dental appointment",
    "book dentist online",
    "online dentist booking",
    "book dental appointment",

    // Bangladesh
    "dentist Bangladesh",
    "dental clinic Bangladesh",
    "dental appointment Bangladesh",
    "online dentist appointment Bangladesh",

    // Khulna
    "dentist Khulna",
    "dental clinic Khulna",
    "dental surgeon Khulna",
    "dental appointment Khulna",
    "online dentist appointment Khulna",

    // Treatments
    "root canal treatment",
    "dental implant",
    "teeth whitening",
    "dental crown",
    "dental filling",
    "dental bridge",
    "orthodontic treatment",
    "teeth cleaning",
    "scaling and root planing",
    "dental emergency",
    "cosmetic dentistry",
    "dental aesthetics",
  ],

  // =========================================================
  // AUTHOR / PUBLISHER
  // =========================================================
  authors: [
    {
      name: SITE_NAME,
      url: SITE_URL,
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,

  category: "healthcare",

  // =========================================================
  // CANONICAL URL
  // =========================================================
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "bn-BD": "/",
    },
  },

  // =========================================================
  // ROBOTS / GOOGLEBOT
  // =========================================================
  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // =========================================================
  // OPEN GRAPH
  // Facebook / Messenger / LinkedIn etc.
  // =========================================================
  openGraph: {
    title:
      "EasyDentalSolution | Online Dental Appointment & Dental Care",

    description:
      "Find qualified dentists, explore dental treatments, and book dental appointments online with EasyDentalSolution.",

    url: SITE_URL,

    siteName: SITE_NAME,

    type: "website",

    locale: "bn_BD",

    alternateLocale: ["en_US"],

    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "EasyDentalSolution - Online Dental Appointment and Dental Care",
      },
    ],
  },

  // =========================================================
  // TWITTER / X
  // =========================================================
  twitter: {
    card: "summary_large_image",

    title:
      "EasyDentalSolution | Online Dental Appointment & Dental Care",

    description:
      "Find qualified dentists, explore modern dental treatments, and book dental appointments online.",

    images: ["/logo.png"],
  },

  // =========================================================
  // ICONS
  // =========================================================
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // =========================================================
  // GOOGLE SEARCH CONSOLE
  // =========================================================
  // If you verified using Google's HTML file, you don't need this.
  // If Google gives you a meta verification code, use:
  //
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_CODE",
  // },

  // =========================================================
  // OTHER
  // =========================================================
  other: {
    "format-detection": "telephone=no",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getUTCFullYear();

  return (
    <html lang="bn" className="dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var r=document.documentElement,t=null;try{t=localStorage.getItem('theme')}catch(e){}var d=t!=='light',v=d?'dark':'light';r.classList.toggle('dark',d);r.dataset.theme=v;r.style.colorScheme=v})()`,
          }}
        />
      </head>
      <body
        className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer currentYear={currentYear} />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
