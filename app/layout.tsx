import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
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
  ],
  openGraph: {
    siteName: "EasyDentalSolution",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getUTCFullYear();

  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        className="antialiased min-h-screen flex flex-col bg-slate-50"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer currentYear={currentYear} />
        </LanguageProvider>
      </body>
    </html>
  );
}
