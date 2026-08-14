import type { Metadata } from "next";
import LegalDocument, { type LegalCopy } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How EasyDentalSolution uses cookies and browser storage.",
};

const en: LegalCopy = {
  eyebrow: "Browser storage",
  title: "Cookie Policy",
  intro: "This policy describes the cookies and local browser storage used by EasyDentalSolution and the choices available to you.",
  updated: "Effective date: August 15, 2026",
  sections: [
    { title: "What cookies are", paragraphs: ["Cookies are small pieces of data stored by a website in your browser. Similar browser storage, such as localStorage, can remember settings on your device without being sent with every request."] },
    { title: "Essential authentication cookie", paragraphs: ["When you sign in, we use a secure authentication cookie to maintain your session and protect access to account features. This cookie is essential for login, authorization, and security and cannot be disabled through an in-app preference without signing out."] },
    { title: "Language and theme preferences", paragraphs: ["We store your chosen language and light or dark theme in local browser storage. These settings improve your experience but are not used for advertising. Removing site data resets them to the application defaults."] },
    { title: "Security and operational data", paragraphs: ["Our infrastructure may process request information needed for rate limiting, fraud prevention, reliability, and security. We do not currently use cookies for third-party behavioral advertising."] },
    { title: "Managing storage", paragraphs: ["You can delete or block cookies and local storage through your browser settings. Blocking the authentication cookie will prevent sign-in and protected account features from working. You can change language and theme directly from the navigation controls."] },
    { title: "Policy updates", paragraphs: ["If we introduce new cookie categories or analytics tools, we will update this policy and provide consent controls where required by applicable law."] },
  ],
};

const bn: LegalCopy = {
  eyebrow: "ব্রাউজার স্টোরেজ",
  title: "কুকি নীতি",
  intro: "EasyDentalSolution যে কুকি ও স্থানীয় ব্রাউজার স্টোরেজ ব্যবহার করে এবং সেগুলো নিয়ন্ত্রণের উপায় এখানে ব্যাখ্যা করা হয়েছে।",
  updated: "কার্যকর তারিখ: ১৫ আগস্ট ২০২৬",
  sections: [
    { title: "কুকি কী", paragraphs: ["কুকি হলো ওয়েবসাইটের মাধ্যমে ব্রাউজারে রাখা ছোট তথ্য। localStorage-এর মতো প্রযুক্তি প্রতিটি অনুরোধে তথ্য না পাঠিয়েও আপনার ডিভাইসে পছন্দ মনে রাখতে পারে।"] },
    { title: "অপরিহার্য প্রমাণীকরণ কুকি", paragraphs: ["সাইন ইন করার পর সেশন চালু রাখা এবং অ্যাকাউন্ট সুরক্ষিত করতে আমরা একটি নিরাপদ প্রমাণীকরণ কুকি ব্যবহার করি। লগইন, অনুমোদন ও নিরাপত্তার জন্য এটি অপরিহার্য; সাইন আউট না করে অ্যাপের পছন্দ থেকে এটি বন্ধ করা যায় না।"] },
    { title: "ভাষা ও থিমের পছন্দ", paragraphs: ["আপনার নির্বাচিত ভাষা এবং হালকা বা গাঢ় থিম স্থানীয় ব্রাউজার স্টোরেজে রাখা হয়। এগুলো বিজ্ঞাপনের জন্য ব্যবহৃত হয় না। সাইটের তথ্য মুছে দিলে অ্যাপের ডিফল্ট পছন্দ ফিরে আসবে।"] },
    { title: "নিরাপত্তা ও পরিচালনাগত তথ্য", paragraphs: ["রেট লিমিট, জালিয়াতি প্রতিরোধ, নির্ভরযোগ্যতা ও নিরাপত্তার জন্য আমাদের অবকাঠামো অনুরোধ-সংক্রান্ত তথ্য প্রক্রিয়া করতে পারে। বর্তমানে তৃতীয় পক্ষের আচরণভিত্তিক বিজ্ঞাপনের জন্য কুকি ব্যবহার করা হয় না।"] },
    { title: "স্টোরেজ নিয়ন্ত্রণ", paragraphs: ["ব্রাউজার সেটিংস থেকে কুকি ও স্থানীয় স্টোরেজ মুছতে বা বন্ধ করতে পারেন। প্রমাণীকরণ কুকি বন্ধ করলে সাইন ইন ও সুরক্ষিত অ্যাকাউন্ট সুবিধা কাজ করবে না। নেভিগেশন থেকে ভাষা ও থিম পরিবর্তন করা যায়।"] },
    { title: "নীতির হালনাগাদ", paragraphs: ["নতুন কুকি বিভাগ বা অ্যানালিটিক্স টুল যুক্ত হলে এই নীতি হালনাগাদ করা হবে এবং প্রযোজ্য আইন অনুযায়ী প্রয়োজনীয় সম্মতি নিয়ন্ত্রণ দেওয়া হবে।"] },
  ],
};

export default function CookiesPage() {
  return <LegalDocument en={en} bn={bn} />;
}
