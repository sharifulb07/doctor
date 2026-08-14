import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "EasyDentalSolution — Online Appointment Booking",
    template: "%s | EasyDentalSolution",
  },
  description:
    "Book dental appointments online with qualified dentists. Easy scheduling, confirmations, and reminders.",
  keywords: [
    "dentist",
    "dental appointment",
    "teeth cleaning",
    "orthodontics",
    "EasyDentalSolution",
    "dentist Khulna",
    "dental clinic Bangladesh",
    "online dentist appointment Bangladesh",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "healthcare",
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
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "bn_BD",
    alternateLocale: "en_US",
    images: [{ url: "/logo.png", alt: `${SITE_NAME} logo` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EasyDentalSolution — Online Dental Appointment Booking",
    description:
      "Book appointments with qualified dental surgeons and explore modern dental services.",
    images: ["/logo.png"],
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
