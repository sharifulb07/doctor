import type { Metadata } from "next";
import LegalDocument, { type LegalCopy } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How EasyDentalSolution collects, uses, and protects your information.",
};

const en: LegalCopy = {
  eyebrow: "Your privacy",
  title: "Privacy Policy",
  intro: "This policy explains how EasyDentalSolution handles information when you use our appointment and dental-care services.",
  updated: "Effective date: August 15, 2026",
  sections: [
    { title: "Information we collect", paragraphs: ["We may collect account details such as your name, email address, mobile number, date of birth, login credentials, appointment information, treatment notes, prescriptions, and information you submit to our support team.", "We also receive limited technical information, including IP address, browser type, device information, and security logs needed to operate and protect the service."] },
    { title: "How we use information", paragraphs: ["We use information to create and secure accounts, schedule and manage appointments, connect patients with dental surgeons, provide prescriptions and reminders, respond to requests, prevent misuse, and improve service reliability."] },
    { title: "When information is shared", paragraphs: ["Relevant appointment and care information is shared with the dental surgeon or authorized clinic staff involved in your care. We may also use trusted infrastructure, email, database, image-hosting, and security providers that process information only to deliver their services to us.", "We may disclose information when required by law, to protect patients or others, or to investigate fraud and security incidents. We do not sell personal information."] },
    { title: "Security and retention", paragraphs: ["We use access controls, encrypted connections, password hashing, secure cookies, validation, logging, and other safeguards. No online system is completely risk-free.", "We retain information only as long as reasonably necessary for care, account administration, security, legal obligations, and dispute resolution, then delete or anonymize it where appropriate."] },
    { title: "Your choices", paragraphs: ["You may request access, correction, or deletion of eligible personal information by contacting us. Some clinical, transaction, or security records may need to be retained where required by law or legitimate operational needs."] },
    { title: "Children and changes", paragraphs: ["A parent or legal guardian should manage the account and consent where a patient cannot legally provide consent. We may update this policy as the service or legal requirements change and will publish the revised effective date here."] },
  ],
};

const bn: LegalCopy = {
  eyebrow: "আপনার গোপনীয়তা",
  title: "গোপনীয়তা নীতি",
  intro: "EasyDentalSolution-এর অ্যাপয়েন্টমেন্ট ও ডেন্টাল সেবা ব্যবহারের সময় আপনার তথ্য কীভাবে পরিচালিত হয় তা এই নীতিতে ব্যাখ্যা করা হয়েছে।",
  updated: "কার্যকর তারিখ: ১৫ আগস্ট ২০২৬",
  sections: [
    { title: "আমরা যে তথ্য সংগ্রহ করি", paragraphs: ["আমরা আপনার নাম, ইমেইল, মোবাইল নম্বর, জন্মতারিখ, লগইন তথ্য, অ্যাপয়েন্টমেন্ট, চিকিৎসার নোট, প্রেসক্রিপশন এবং সহায়তার জন্য পাঠানো তথ্য সংগ্রহ করতে পারি।", "সেবা পরিচালনা ও নিরাপদ রাখতে আইপি ঠিকানা, ব্রাউজার, ডিভাইস এবং নিরাপত্তা লগের মতো সীমিত প্রযুক্তিগত তথ্যও সংগ্রহ হতে পারে।"] },
    { title: "তথ্য ব্যবহারের উদ্দেশ্য", paragraphs: ["অ্যাকাউন্ট তৈরি ও সুরক্ষিত রাখা, অ্যাপয়েন্টমেন্ট পরিচালনা, রোগীকে দন্তচিকিৎসকের সঙ্গে যুক্ত করা, প্রেসক্রিপশন ও রিমাইন্ডার দেওয়া, অনুরোধের উত্তর দেওয়া এবং সেবার মান ও নিরাপত্তা উন্নত করতে তথ্য ব্যবহার করা হয়।"] },
    { title: "তথ্য কখন শেয়ার করা হয়", paragraphs: ["আপনার চিকিৎসায় যুক্ত দন্তচিকিৎসক বা অনুমোদিত ক্লিনিক কর্মীদের সঙ্গে প্রয়োজনীয় অ্যাপয়েন্টমেন্ট ও চিকিৎসার তথ্য শেয়ার করা হয়। নির্ভরযোগ্য ডাটাবেস, ইমেইল, ছবি সংরক্ষণ ও নিরাপত্তা সেবাদাতারাও আমাদের পক্ষে সীমিত তথ্য প্রক্রিয়া করতে পারে।", "আইনের প্রয়োজন, রোগী বা অন্যদের সুরক্ষা এবং জালিয়াতি বা নিরাপত্তা ঘটনা তদন্তের জন্য তথ্য প্রকাশ করা হতে পারে। আমরা ব্যক্তিগত তথ্য বিক্রি করি না।"] },
    { title: "নিরাপত্তা ও সংরক্ষণ", paragraphs: ["আমরা অ্যাক্সেস নিয়ন্ত্রণ, এনক্রিপ্টেড সংযোগ, পাসওয়ার্ড হ্যাশিং, নিরাপদ কুকি, যাচাই ও লগিংসহ বিভিন্ন সুরক্ষা ব্যবস্থা ব্যবহার করি। তবে কোনো অনলাইন ব্যবস্থা সম্পূর্ণ ঝুঁকিমুক্ত নয়।", "চিকিৎসা, অ্যাকাউন্ট পরিচালনা, নিরাপত্তা ও আইনি প্রয়োজনের জন্য যতদিন যুক্তিসঙ্গতভাবে দরকার ততদিন তথ্য রাখা হয়; এরপর প্রযোজ্য ক্ষেত্রে মুছে ফেলা বা পরিচয়হীন করা হয়।"] },
    { title: "আপনার অধিকার", paragraphs: ["যোগাযোগ করে যোগ্য ব্যক্তিগত তথ্য দেখা, সংশোধন বা মুছে ফেলার অনুরোধ করতে পারেন। আইন বা বৈধ পরিচালনাগত প্রয়োজনে কিছু চিকিৎসা ও নিরাপত্তা রেকর্ড সংরক্ষণ করতে হতে পারে।"] },
    { title: "শিশু ও নীতির পরিবর্তন", paragraphs: ["রোগী আইনগতভাবে সম্মতি দিতে না পারলে অভিভাবক বা আইনগত প্রতিনিধিকে অ্যাকাউন্ট ও সম্মতি পরিচালনা করতে হবে। সেবা বা আইন পরিবর্তিত হলে নীতিটি হালনাগাদ করে নতুন কার্যকর তারিখ এখানে প্রকাশ করা হবে।"] },
  ],
};

export default function PrivacyPolicyPage() {
  return <LegalDocument en={en} bn={bn} />;
}
