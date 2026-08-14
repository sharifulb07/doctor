import type { Metadata } from "next";
import LegalDocument, { type LegalCopy } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms governing the use of EasyDentalSolution.",
};

const en: LegalCopy = {
  eyebrow: "Service agreement",
  title: "Terms and Conditions",
  intro: "By accessing EasyDentalSolution, you agree to these terms. Please read them before creating an account or booking care.",
  updated: "Effective date: August 15, 2026",
  sections: [
    { title: "Our role", paragraphs: ["EasyDentalSolution provides tools for finding dental surgeons, requesting appointments, managing schedules, and receiving service-related information. The platform does not replace professional medical judgment, diagnosis, treatment, or emergency services."] },
    { title: "Accounts and eligibility", paragraphs: ["You must provide accurate information, keep your credentials confidential, and promptly notify us of unauthorized account use. You are responsible for activity performed through your account. A guardian must act for a user who cannot legally agree to these terms."] },
    { title: "Appointments and emergencies", paragraphs: ["An appointment request is subject to surgeon availability and clinic confirmation. Arrive on time and follow the clinic's cancellation or rescheduling instructions.", "Do not rely on the platform for emergencies. For severe bleeding, trauma, breathing difficulty, rapidly increasing swelling, or another urgent condition, contact local emergency services or an appropriate medical facility immediately."] },
    { title: "Fees and clinical care", paragraphs: ["Displayed consultation fees are informational and may not include tests, procedures, medicines, or other clinic charges. Confirm costs directly with the clinic. Clinical decisions and outcomes remain the responsibility of the treating professional and patient."] },
    { title: "Acceptable use", paragraphs: ["You must not misuse the service, impersonate another person, submit unlawful or harmful content, probe security, disrupt availability, scrape data, or use the platform for unauthorized commercial activity. We may restrict or terminate access when necessary to protect users and the service."] },
    { title: "Availability and liability", paragraphs: ["We work to keep the service accurate and available but cannot guarantee uninterrupted operation, error-free content, appointment availability, or a particular clinical outcome. To the extent permitted by law, EasyDentalSolution is not liable for indirect or consequential loss arising from use of the platform."] },
    { title: "Changes and governing rules", paragraphs: ["We may update the service and these terms. Continued use after an update means you accept the revised terms. Applicable mandatory consumer, healthcare, and data-protection laws continue to apply regardless of these terms."] },
  ],
};

const bn: LegalCopy = {
  eyebrow: "সেবা চুক্তি",
  title: "শর্তাবলি",
  intro: "EasyDentalSolution ব্যবহার করলে আপনি এই শর্তাবলিতে সম্মত হন। অ্যাকাউন্ট তৈরি বা সেবা বুক করার আগে অনুগ্রহ করে পড়ুন।",
  updated: "কার্যকর তারিখ: ১৫ আগস্ট ২০২৬",
  sections: [
    { title: "আমাদের ভূমিকা", paragraphs: ["EasyDentalSolution দন্তচিকিৎসক খোঁজা, অ্যাপয়েন্টমেন্টের অনুরোধ, সময়সূচি পরিচালনা এবং সেবা-সংক্রান্ত তথ্য পাওয়ার সুবিধা দেয়। এটি পেশাদার চিকিৎসা পরামর্শ, রোগ নির্ণয়, চিকিৎসা বা জরুরি সেবার বিকল্প নয়।"] },
    { title: "অ্যাকাউন্ট ও যোগ্যতা", paragraphs: ["আপনাকে সঠিক তথ্য দিতে, লগইন তথ্য গোপন রাখতে এবং অননুমোদিত ব্যবহার হলে দ্রুত জানাতে হবে। আপনার অ্যাকাউন্টের কার্যকলাপের দায়িত্ব আপনার। আইনগতভাবে সম্মতি দিতে অক্ষম ব্যবহারকারীর পক্ষে অভিভাবককে কাজ করতে হবে।"] },
    { title: "অ্যাপয়েন্টমেন্ট ও জরুরি অবস্থা", paragraphs: ["অ্যাপয়েন্টমেন্ট চিকিৎসকের সময় ও ক্লিনিকের নিশ্চিতকরণের ওপর নির্ভরশীল। সময়মতো উপস্থিত হোন এবং বাতিল বা পুনর্নির্ধারণের নিয়ম অনুসরণ করুন।", "জরুরি অবস্থায় প্ল্যাটফর্মের ওপর নির্ভর করবেন না। অতিরিক্ত রক্তপাত, আঘাত, শ্বাসকষ্ট, দ্রুত ফোলা বা অন্য জরুরি সমস্যায় অবিলম্বে স্থানীয় জরুরি সেবা বা উপযুক্ত হাসপাতালে যোগাযোগ করুন।"] },
    { title: "ফি ও চিকিৎসা", paragraphs: ["প্রদর্শিত পরামর্শ ফি তথ্যের জন্য এবং এতে পরীক্ষা, চিকিৎসা পদ্ধতি, ওষুধ বা অন্য ক্লিনিক খরচ অন্তর্ভুক্ত নাও থাকতে পারে। ক্লিনিকের সঙ্গে খরচ নিশ্চিত করুন। চিকিৎসার সিদ্ধান্ত ও ফলাফল সংশ্লিষ্ট পেশাজীবী ও রোগীর দায়িত্ব।"] },
    { title: "গ্রহণযোগ্য ব্যবহার", paragraphs: ["সেবার অপব্যবহার, অন্যের পরিচয় ব্যবহার, বেআইনি বা ক্ষতিকর তথ্য দেওয়া, নিরাপত্তা পরীক্ষা, সেবা ব্যাহত করা, তথ্য স্ক্র্যাপ করা বা অনুমতিহীন বাণিজ্যিক কাজে প্ল্যাটফর্ম ব্যবহার করা যাবে না। ব্যবহারকারী ও সেবা সুরক্ষায় আমরা প্রবেশাধিকার সীমিত বা বন্ধ করতে পারি।"] },
    { title: "সেবার প্রাপ্যতা ও দায়", paragraphs: ["আমরা সেবা সঠিক ও সচল রাখার চেষ্টা করি, তবে নিরবচ্ছিন্ন কার্যক্রম, ত্রুটিমুক্ত তথ্য, অ্যাপয়েন্টমেন্ট বা নির্দিষ্ট চিকিৎসা ফলাফলের নিশ্চয়তা দিই না। আইন যতটুকু অনুমতি দেয়, প্ল্যাটফর্ম ব্যবহারের পরোক্ষ ক্ষতির জন্য EasyDentalSolution দায়ী নয়।"] },
    { title: "পরিবর্তন ও প্রযোজ্য নিয়ম", paragraphs: ["আমরা সেবা ও শর্তাবলি হালনাগাদ করতে পারি। পরিবর্তনের পর ব্যবহার চালিয়ে গেলে সংশোধিত শর্তে সম্মতি বোঝাবে। বাধ্যতামূলক ভোক্তা, স্বাস্থ্যসেবা ও তথ্য সুরক্ষা আইন সবসময় প্রযোজ্য থাকবে।"] },
  ],
};

export default function TermsPage() {
  return <LegalDocument en={en} bn={bn} />;
}
