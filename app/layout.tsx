import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: {
    default: "DentalCare — Online Appointment Booking",
    template: "%s | DentalCare",
  },
  description:
    "Book dental appointments online with qualified dentists. Easy scheduling, confirmations, and reminders.",
  keywords: [
    "dentist",
    "dental appointment",
    "teeth cleaning",
    "orthodontics",
    "DentalCare",
  ],
  openGraph: {
    siteName: "DentalCare",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
