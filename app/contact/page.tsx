import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Send a question to the EasyDentalSolution team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[0.8fr_1.2fr]">
        <div className="bg-linear-to-br from-sky-600 to-cyan-500 p-8 text-white sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-100">
            EasyDentalSolution
          </p>
          <h1 className="mt-4 text-3xl font-extrabold">Contact us</h1>
          <p className="mt-4 leading-7 text-sky-50">
            Send your question securely through this form. Our team will reply to the email address you provide.
          </p>
          <div className="mt-8 space-y-3 text-sm text-sky-50">
            <p>Islami Bank Hospital, Khulna</p>
            <p>+8801742675039</p>
            <p className="break-all">mostafizurrahman3535@gmail.com</p>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
