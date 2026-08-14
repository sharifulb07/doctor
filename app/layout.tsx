import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var r=document.documentElement,t=null;try{t=localStorage.getItem('theme')}catch(e){}var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches),v=d?'dark':'light';r.classList.toggle('dark',d);r.dataset.theme=v;r.style.colorScheme=v})()`,
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
