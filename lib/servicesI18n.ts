import {
  ServiceDetails,
  ServiceFAQ,
  ServiceQuickInfo,
  ServiceReview,
} from "@/lib/services";

export type ServiceLocale = "en" | "bn";

export interface LocalizedServiceContent {
  name: string;
  shortDescription: string;
  overview: string;
  symptoms: string[];
  whenNeeded: string[];
  treatmentProcedure: [string, string, string, string, string];
  benefits: string[];
  afterCare: string[];
  avoidIf: string[];
  faqs: ServiceFAQ[];
  reviews: ServiceReview[];
  quickInfo: ServiceQuickInfo;
}

const serviceNameBnBySlug: Record<string, string> = {
  "root-canal-treatment": "রুট ক্যানাল ট্রিটমেন্ট",
  "tooth-restoration-filling": "দাঁত পুনর্গঠন (ফিলিং)",
  "extraction-colour-matching-filling": "এক্সট্রাকশন (কালার ম্যাচিং ফিলিং)",
  "surgical-extraction": "সার্জিক্যাল এক্সট্রাকশন",
  "tooth-fracture-management": "দাঁত ভাঙা ব্যবস্থাপনা",
  "scaling-root-planing": "স্কেলিং ও রুট প্ল্যানিং",
  "dental-implants": "ডেন্টাল ইমপ্ল্যান্ট",
  "bleaching-teeth-whitening": "ব্লিচিং (টিথ হোয়াইটেনিং)",
  veneer: "ভিনিয়ার",
  "crown-cap": "ক্রাউন (ক্যাপ)",
  "metal-cap": "মেটাল ক্যাপ",
  "metal-ceramic-cap": "মেটাল সিরামিক ক্যাপ",
  "zirconia-cap": "জিরকোনিয়া ক্যাপ",
  "e-max-cap": "ই-ম্যাক্স ক্যাপ",
  "partial-complete-denture": "পার্শিয়াল ডেনচার ও কমপ্লিট ডেনচার",
  "acrylic-teeth-denture": "অ্যাক্রিলিক দাঁত/ডেঞ্চার",
  "flexible-denture": "ফ্লেক্সিবল ডেঞ্চার",
  "orthodontic-treatment": "অর্থোডন্টিক ট্রিটমেন্ট",
  "cyst-tumour-surgery": "সিস্ট ও টিউমার সার্জারি",
  apicoectomy: "এপিসেকটমি",
  "midline-diastema-closure": "মিডলাইন ডায়াস্টেমা ক্লোজার",
  "mandible-fracture-management": "ম্যান্ডিবল ফ্র্যাকচার ম্যানেজমেন্ট",
  "facial-bone-fracture-management": "ফেসিয়াল বোন ফ্র্যাকচার ম্যানেজমেন্ট",
  "children-dental-disease-management": "শিশুদের ডেন্টাল রোগ ব্যবস্থাপনা",
  filling: "ফিলিং",
  pulpotomy: "পালপোটমি",
  pulpectomy: "পালপেকটমি",
  "abscess-management": "অ্যাবসেস ম্যানেজমেন্ট",
};

const categoryShortBn: Record<ServiceDetails["category"], string> = {
  endodontic:
    "দাঁতের ভেতরের ইনফেকশন নিয়ন্ত্রণ করে প্রাকৃতিক দাঁত বাঁচানোর চিকিৎসা।",
  restorative:
    "ক্ষয় বা ক্ষতিগ্রস্ত দাঁত পুনর্গঠন করে কার্যক্ষমতা ফেরানোর চিকিৎসা।",
  surgical: "জটিল ওরাল সমস্যার জন্য নিরাপদ সার্জিক্যাল ডেন্টাল চিকিৎসা।",
  preventive: "দাঁত ও মাড়ির রোগ প্রতিরোধে নিয়মিত প্রতিরোধমূলক পরিচর্যা।",
  cosmetic: "হাসির সৌন্দর্য, দাঁতের রঙ ও গঠন উন্নত করার চিকিৎসা।",
  prosthodontic: "হারানো বা দুর্বল দাঁত পুনঃস্থাপনে প্রস্থডন্টিক সমাধান।",
  orthodontic: "বাঁকা দাঁত ও বাইট ঠিক করার দীর্ঘমেয়াদি অ্যালাইনমেন্ট চিকিৎসা।",
  pediatric: "শিশুদের দাঁতের জন্য আরামদায়ক ও বয়স-উপযোগী ডেন্টাল কেয়ার।",
  "oral-surgery":
    "হাড় ও টিস্যু-সংক্রান্ত জটিল সমস্যার ওরাল সার্জিক্যাল চিকিৎসা।",
  trauma: "দাঁত/চোয়ালের আঘাতের জরুরি ও পুনর্বাসনমূলক চিকিৎসা।",
};

const categoryContentBn: Record<
  ServiceDetails["category"],
  {
    overview: string;
    symptoms: string[];
    whenNeeded: string[];
    benefits: string[];
    afterCare: string[];
    avoidIf: string[];
  }
> = {
  endodontic: {
    overview:
      "এন্ডোডন্টিক চিকিৎসার লক্ষ্য হলো দাঁতের পাল্পে ইনফেকশন বা প্রদাহ নিয়ন্ত্রণ করে প্রাকৃতিক দাঁত সংরক্ষণ করা।",
    symptoms: [
      "ধকধক বা স্থায়ী দাঁতের ব্যথা",
      "গরম/ঠান্ডায় দীর্ঘক্ষণ সেনসিটিভিটি",
      "মাড়ির আশেপাশে ফোলা",
      "চিবাতে ব্যথা",
    ],
    whenNeeded: [
      "গভীর ক্যাভিটি নার্ভ পর্যন্ত পৌঁছালে",
      "ক্র্যাক হয়ে পাল্প এক্সপোজ হলে",
      "অ্যাবসেস বা পুনরাবৃত্ত ইনফেকশন হলে",
      "দীর্ঘস্থায়ী তীব্র সেনসিটিভিটি থাকলে",
    ],
    benefits: [
      "প্রাকৃতিক দাঁত সংরক্ষণ করা যায়",
      "ইনফেকশন ও ব্যথা কমে",
      "স্বাভাবিক চিবানোর ক্ষমতা ফিরে আসে",
      "ইনফেকশন ছড়িয়ে পড়া রোধ হয়",
    ],
    afterCare: [
      "২৪ ঘণ্টা চিকিৎসাকৃত পাশে চাপ দিয়ে না চিবানো",
      "ডাক্তারের দেয়া ওষুধ নিয়মিত সেবন",
      "ফাইনাল রিস্টোরেশন/ক্রাউন সময়মতো করা",
      "ওরাল হাইজিন ভালোভাবে মেনে চলা",
    ],
    avoidIf: [
      "দাঁত পুনর্গঠনের অযোগ্য হলে",
      "অনিয়ন্ত্রিত সিস্টেমিক ইনফেকশন থাকলে",
      "অ্যানেস্থেশিয়াতে তীব্র অ্যালার্জির ঝুঁকি থাকলে",
    ],
  },
  restorative: {
    overview:
      "রিস্টোরেটিভ চিকিৎসা ক্ষতিগ্রস্ত দাঁত মেরামত করে তার আকৃতি ও কার্যক্ষমতা পুনরুদ্ধার করে।",
    symptoms: [
      "দাঁতে গর্ত/কালো দাগ",
      "খাবার আটকে যাওয়া",
      "হালকা ব্যথা",
      "চিবাতে অস্বস্তি",
    ],
    whenNeeded: [
      "প্রাথমিক থেকে মাঝারি দাঁতের ক্ষয়",
      "ছোট চিপ বা ভাঙন",
      "পুরনো ফিলিং লিক করলে",
      "লোকাল সৌন্দর্যগত সংশোধন দরকার হলে",
    ],
    benefits: [
      "ক্ষয় বৃদ্ধি থামে",
      "চিবানো আরামদায়ক হয়",
      "দাঁতের গঠন টিকে থাকে",
      "দাঁতের সৌন্দর্য বাড়ে",
    ],
    afterCare: [
      "প্রথম দিন খুব শক্ত খাবার এড়ানো",
      "চিকিৎসাকৃত স্থানে নরম ব্রাশ করা",
      "অস্বাভাবিক সেনসিটিভিটি হলে জানানো",
      "রুটিন চেকআপ বজায় রাখা",
    ],
    avoidIf: [
      "তীব্র মাড়ির রোগ থাকলে",
      "অতিরিক্ত ক্ষয় হয়ে থাকলে",
      "অপরিচালিত ব্রুক্সিজম থাকলে",
    ],
  },
  surgical: {
    overview:
      "সার্জিক্যাল ডেন্টাল চিকিৎসা জটিল সমস্যার জন্য নিয়ন্ত্রিত পদ্ধতিতে করা হয়।",
    symptoms: [
      "তীব্র ব্যথা",
      "মুখ/মাড়ি ফুলে যাওয়া",
      "মুখ খুলতে কষ্ট",
      "বারবার ইনফেকশন",
    ],
    whenNeeded: [
      "ইমপ্যাক্টেড দাঁত",
      "জটিল এক্সট্রাকশন",
      "লেশন/সিস্ট",
      "ড্রেনেজের প্রয়োজন",
    ],
    benefits: [
      "জটিল সমস্যার নির্দিষ্ট সমাধান",
      "ইনফেকশন নিয়ন্ত্রণ",
      "ব্যথা ও ফোলা কমায়",
      "পাশের টিস্যু সুরক্ষা",
    ],
    afterCare: [
      "ওষুধ ও নির্দেশনা মেনে চলা",
      "প্রথম ২৪ ঘণ্টা ঠান্ডা সেঁক",
      "নরম খাবার",
      "ফলোআপে আসা",
    ],
    avoidIf: [
      "অনিয়ন্ত্রিত রক্তচাপ",
      "অনিয়ন্ত্রিত ডায়াবেটিস",
      "মেডিক্যাল ক্লিয়ারেন্স না থাকলে",
    ],
  },
  preventive: {
    overview:
      "প্রিভেন্টিভ চিকিৎসা প্লাক ও টারটার কমিয়ে দাঁত-মাড়ির রোগের ঝুঁকি হ্রাস করে।",
    symptoms: ["মাড়ি থেকে রক্ত পড়া", "দুর্গন্ধ", "টারটার জমা", "দাঁতে দাগ"],
    whenNeeded: [
      "রুটিন মেইনটেন্যান্স",
      "প্রাথমিক মাড়ির প্রদাহ",
      "উচ্চ ক্যারিজ ঝুঁকি",
      "বড় চিকিৎসার আগে",
    ],
    benefits: [
      "ক্যাভিটি প্রতিরোধ",
      "মাড়ির স্বাস্থ্য ভালো",
      "শ্বাস সতেজ",
      "দীর্ঘমেয়াদে খরচ কম",
    ],
    afterCare: [
      "কিছু সময় দাগ ফেলে এমন খাবার এড়ানো",
      "মাউথওয়াশ ব্যবহার",
      "ব্রাশ-ফ্লস চালিয়ে যাওয়া",
      "৬ মাস অন্তর চেকআপ",
    ],
    avoidIf: [
      "তীব্র তাত্ক্ষণিক ইনফেকশন",
      "অতিরিক্ত সেনসিটিভিটি",
      "সাম্প্রতিক বড় সার্জারির পর",
    ],
  },
  cosmetic: {
    overview:
      "কসমেটিক ডেন্টিস্ট্রি দাঁতের রঙ, আকার ও স্মাইলের সৌন্দর্য উন্নত করে।",
    symptoms: [
      "দাঁতে দাগ",
      "ফাঁক/আকৃতিগত সমস্যা",
      "স্মাইল নিয়ে অস্বস্তি",
      "দাঁতের প্রান্ত ক্ষয়",
    ],
    whenNeeded: [
      "স্মাইল ইমপ্রুভমেন্ট",
      "ইভেন্ট/প্রেজেন্টেশনের আগে",
      "মৌলিক চিকিৎসা শেষে",
      "রঙ/আকৃতি সংশোধনে",
    ],
    benefits: [
      "স্মাইল আকর্ষণীয় হয়",
      "আত্মবিশ্বাস বাড়ে",
      "কম ভিজিটে ফল পাওয়া যায়",
      "একাধিক ভিজ্যুয়াল সমস্যা ঠিক হয়",
    ],
    afterCare: [
      "দাগ ফেলে এমন খাবার এড়ানো",
      "নন-অ্যাব্রেসিভ টুথপেস্ট",
      "প্রয়োজনে নাইটগার্ড",
      "রেগুলার পলিশিং",
    ],
    avoidIf: [
      "অচিকিৎসিত ক্যাভিটি/মাড়ির রোগ",
      "অবাস্তব প্রত্যাশা",
      "তীব্র এনামেল ক্ষয়",
    ],
  },
  prosthodontic: {
    overview:
      "প্রস্থডন্টিক চিকিৎসা হারানো বা দুর্বল দাঁত ক্রাউন, ডেঞ্চার বা স্থায়ী সমাধানে পুনঃস্থাপন করে।",
    symptoms: [
      "হারানো দাঁত",
      "দুর্বল/ভাঙা দাঁত",
      "ডেঞ্চার ঢিলা",
      "কথা বলতে অসুবিধা",
    ],
    whenNeeded: [
      "এক বা একাধিক দাঁত না থাকলে",
      "রুট ক্যানালের পর সুরক্ষা দরকার হলে",
      "চিবানো উন্নত করতে",
      "পুরনো প্রস্থেসিস বদলাতে",
    ],
    benefits: [
      "চিবানোর ক্ষমতা বাড়ে",
      "কথা বলা সহজ হয়",
      "দাঁত সুরক্ষিত থাকে",
      "জীবনমান উন্নত হয়",
    ],
    afterCare: [
      "ডেঞ্চার/প্রস্থেসিস পরিষ্কার রাখা",
      "অ্যাডজাস্টমেন্ট ভিজিটে আসা",
      "শুরুতে নরম খাবার",
      "ইনসার্শন নির্দেশনা মেনে চলা",
    ],
    avoidIf: [
      "এক্সট্রাকশন সাইট না শুকালে",
      "তীব্র পেরিওডন্টাল সমস্যা থাকলে",
      "ফাউন্ডেশন ট্রিটমেন্ট বাকি থাকলে",
    ],
  },
  orthodontic: {
    overview:
      "অর্থোডন্টিক চিকিৎসা দাঁত ও বাইট অ্যালাইন করে সৌন্দর্য ও কার্যক্ষমতা দুটোই উন্নত করে।",
    symptoms: [
      "দাঁত বাঁকা/ফাঁক",
      "বাইট সমস্যা",
      "চোয়ালে অস্বস্তি",
      "পরিষ্কার করতে সমস্যা",
    ],
    whenNeeded: [
      "দৃষ্টিগ্রাহ্য অ্যালাইনমেন্ট সমস্যা",
      "চিবানো/কথায় সমস্যা",
      "পুরনো ব্রেসের রিল্যাপ্স",
      "শিশুদের প্রিভেন্টিভ গাইডেন্স",
    ],
    benefits: [
      "বাইট ভালো হয়",
      "স্মাইল সুন্দর হয়",
      "হাইজিন সহজ হয়",
      "দীর্ঘমেয়াদে ক্ষয় কমে",
    ],
    afterCare: [
      "রিটেইনার ব্যবহার",
      "স্টিকি/হার্ড খাবার এড়ানো",
      "মাসিক ফলোআপ",
      "নিয়মিত ব্রাশ-ফ্লস",
    ],
    avoidIf: [
      "অচিকিৎসিত পেরিওডন্টাল রোগ",
      "দুর্বল ওরাল হাইজিন",
      "উচ্চ ঝুঁকির অসুখে ক্লিয়ারেন্স না থাকলে",
    ],
  },
  pediatric: {
    overview:
      "শিশুদের জন্য আরামদায়ক, নিরাপদ এবং বয়স-উপযোগী ডেন্টাল চিকিৎসা প্রদান করা হয়।",
    symptoms: [
      "দাঁতের ব্যথা",
      "শিশু দাঁতে ক্যাভিটি",
      "মাড়িতে ফোলা",
      "চিবাতে কষ্ট",
    ],
    whenNeeded: [
      "আর্লি ক্যারিজ",
      "দুধ দাঁতে ইনফেকশন",
      "ইরাপশন মনিটরিং",
      "চাইল্ড-ফ্রেন্ডলি কেয়ার দরকার হলে",
    ],
    benefits: [
      "ব্যথা দ্রুত কমে",
      "প্রাইমারি দাঁত সংরক্ষণ",
      "চোয়াল বিকাশে সহায়তা",
      "ভালো ওরাল হ্যাবিট গড়ে ওঠে",
    ],
    afterCare: [
      "২৪ ঘণ্টা পর্যবেক্ষণ",
      "খাবার নির্দেশনা মানা",
      "অভিভাবকের তত্ত্বাবধানে ব্রাশ",
      "রেগুলার ফলোআপ",
    ],
    avoidIf: [
      "জ্বর/সিস্টেমিক ইনফেকশন থাকলে আগে স্ট্যাবিলাইজ",
      "অসম্পূর্ণ মেডিক্যাল হিস্ট্রি",
      "ট্রমায় জরুরি রেফার দরকার হলে",
    ],
  },
  "oral-surgery": {
    overview:
      "ওরাল সার্জারিতে হাড় ও সফট টিস্যুর জটিল রোগের উন্নত চিকিৎসা করা হয়।",
    symptoms: [
      "চোয়ালে দীর্ঘস্থায়ী ব্যথা",
      "অস্বাভাবিক ফোলা/লেশন",
      "হাড়জনিত অস্বস্তি",
      "রিপিটেড ইনফেকশন",
    ],
    whenNeeded: [
      "বায়োপসি/অপসারণ দরকার হলে",
      "হাড় সংক্রান্ত সমস্যা",
      "জটিল কন্ডিশনের সার্জিক্যাল কারেকশন",
      "রুটিন চিকিৎসায় সমাধান না হলে",
    ],
    benefits: [
      "মূল কারণভিত্তিক সমাধান",
      "কার্যক্ষমতা উন্নত",
      "রোগের অগ্রগতি কমায়",
      "মাল্টিডিসিপ্লিনারি কেয়ার সহায়তা",
    ],
    afterCare: [
      "ওয়াউন্ড কেয়ার মানা",
      "ওষুধ সময়মতো নেওয়া",
      "ভারী কাজ কমানো",
      "পোস্ট-অপ ফলোআপ",
    ],
    avoidIf: [
      "কোয়াগুলেশন সমস্যা অনিয়ন্ত্রিত",
      "মেডিক্যাল ক্লিয়ারেন্স না থাকলে",
      "অনিয়ন্ত্রিত সিস্টেমিক ইনফেকশন",
    ],
  },
  trauma: {
    overview:
      "ডেন্টাল ট্রমা কেয়ারে আঘাতজনিত দাঁত/চোয়াল সমস্যা দ্রুত মূল্যায়ন ও চিকিৎসা করা হয়।",
    symptoms: [
      "দাঁত নড়া/ভাঙা",
      "আঘাতের পর চোয়ালে ব্যথা",
      "বাইটে সমস্যা",
      "মুখে ফোলা/কালশিটে",
    ],
    whenNeeded: [
      "সাম্প্রতিক দুর্ঘটনা",
      "ফ্র্যাকচার সন্দেহ",
      "দাঁত ডিসপ্লেসমেন্ট",
      "পোস্ট-ট্রমা ব্যথা",
    ],
    benefits: [
      "দ্রুত ব্যথা নিয়ন্ত্রণ",
      "স্ট্রাকচার সুরক্ষা",
      "হিলিং উন্নত",
      "দীর্ঘমেয়াদি জটিলতা কমে",
    ],
    afterCare: [
      "জরুরি নির্দেশনা মানা",
      "নরম খাবার",
      "কন্টাক্ট অ্যাক্টিভিটি এড়ানো",
      "অবস্থা খারাপ হলে দ্রুত জানানো",
    ],
    avoidIf: [
      "জরুরিতে চিকিৎসা বিলম্ব নয়",
      "মেডিক্যালি অনিরাপদ হলে elective correction পিছোতে পারে",
    ],
  },
};

const replaceMapBn: Array<[RegExp, string]> = [
  [/Same day/gi, "একই দিন"],
  [/minutes/gi, "মিনিট"],
  [/days/gi, "দিন"],
  [/weeks/gi, "সপ্তাহ"],
  [/months/gi, "মাস"],
  [/Local anesthesia/gi, "লোকাল অ্যানেস্থেশিয়া"],
  [/Topical/gi, "টপিকাল"],
  [/Not required/gi, "প্রয়োজন নেই"],
  [/Usually local anesthesia/gi, "সাধারণত লোকাল অ্যানেস্থেশিয়া"],
  [/Yes \/ Emergency/gi, "হ্যাঁ / জরুরি"],
  [/Urgent\/Emergency/gi, "জরুরি"],
  [/Yes/gi, "হ্যাঁ"],
];

function quickInfoToBn(quickInfo: ServiceQuickInfo): ServiceQuickInfo {
  const convert = (value: string) =>
    replaceMapBn.reduce(
      (acc, [pattern, replacement]) => acc.replace(pattern, replacement),
      value,
    );

  return {
    duration: convert(quickInfo.duration),
    recoveryTime: convert(quickInfo.recoveryTime),
    anesthesia: convert(quickInfo.anesthesia),
    cost: quickInfo.cost,
    appointmentRequired: convert(quickInfo.appointmentRequired),
  };
}

function createProcedureStepsBn(
  serviceNameBn: string,
): [string, string, string, string, string] {
  return [
    `${serviceNameBn} এর জন্য বিস্তারিত ডায়াগনস্টিক মূল্যায়ন ও পরামর্শ।`,
    "আপনার অবস্থা অনুযায়ী পার্সোনালাইজড ট্রিটমেন্ট প্ল্যান তৈরি।",
    "ইনফেকশন-কন্ট্রোল প্রটোকল মেনে চিকিৎসার প্রস্তুতি।",
    "আধুনিক পদ্ধতিতে নিরাপদে চিকিৎসা সম্পন্ন করা।",
    "পরবর্তী যত্ন, ওষুধ নির্দেশনা ও ফলোআপ সময় নির্ধারণ।",
  ];
}

function createFaqsBn(serviceNameBn: string): ServiceFAQ[] {
  return [
    {
      question: `${serviceNameBn} কি ব্যথাদায়ক?`,
      answer:
        "সাধারণত খুব কম অস্বস্তি হয়, কারণ প্রয়োজন অনুযায়ী অ্যানেস্থেশিয়া ও নরম টেকনিক ব্যবহার করা হয়।",
    },
    {
      question: `${serviceNameBn} করতে কত সময় লাগে?`,
      answer:
        "চিকিৎসার জটিলতার উপর সময় নির্ভর করে; চেকআপের পর ডাক্তার সঠিক সময় জানিয়ে দেন।",
    },
    {
      question: "চিকিৎসার দিনই কি স্বাভাবিক কাজে ফিরতে পারব?",
      answer:
        "বেশিরভাগ ক্ষেত্রে সম্ভব, তবে সার্জিক্যাল বা জটিল চিকিৎসায় ২৪-৪৮ ঘণ্টা বিশ্রাম লাগতে পারে।",
    },
  ];
}

function createReviewsBn(serviceNameBn: string): ServiceReview[] {
  return [
    {
      patientName: "আয়েশা রহমান",
      rating: 5,
      comment: `${serviceNameBn} চিকিৎসার অভিজ্ঞতা খুবই ভালো ছিল। পুরো প্রক্রিয়া সহজভাবে বুঝিয়ে দিয়েছেন।`,
      date: "2026-05-18",
    },
    {
      patientName: "মোঃ আরিফ হাসান",
      rating: 4,
      comment:
        "ডাক্তার ও স্টাফরা খুব পেশাদার। পরবর্তী যত্নের নির্দেশনা মেনে দ্রুত সুস্থ হয়েছি।",
      date: "2026-06-02",
    },
  ];
}

export function getLocalizedServiceName(
  service: ServiceDetails,
  locale: ServiceLocale,
): string {
  if (locale === "en") return service.name;
  return serviceNameBnBySlug[service.slug] ?? service.name;
}

export function getLocalizedServiceContent(
  service: ServiceDetails,
  locale: ServiceLocale,
): LocalizedServiceContent {
  if (locale === "en") {
    return {
      name: service.name,
      shortDescription: service.shortDescription,
      overview: service.overview,
      symptoms: service.symptoms,
      whenNeeded: service.whenNeeded,
      treatmentProcedure: service.treatmentProcedure,
      benefits: service.benefits,
      afterCare: service.afterCare,
      avoidIf: service.avoidIf,
      faqs: service.faqs,
      reviews: service.reviews,
      quickInfo: service.quickInfo,
    };
  }

  const name = getLocalizedServiceName(service, "bn");
  const category = categoryContentBn[service.category];

  return {
    name,
    shortDescription: categoryShortBn[service.category],
    overview: category.overview,
    symptoms: category.symptoms,
    whenNeeded: category.whenNeeded,
    treatmentProcedure: createProcedureStepsBn(name),
    benefits: category.benefits,
    afterCare: category.afterCare,
    avoidIf: category.avoidIf,
    faqs: createFaqsBn(name),
    reviews: createReviewsBn(name),
    quickInfo: quickInfoToBn(service.quickInfo),
  };
}
