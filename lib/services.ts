import one from "@/public/carousels/own/1.png";
import two from "@/public/carousels/own/2.png";
import three from "@/public/carousels/own/3.png";
import four from "@/public/carousels/own/4.png";
import five from "@/public/icons/5.png";
import type { StaticImageData } from "next/image";

export interface ServiceQuickInfo {
  duration: string;
  recoveryTime: string;
  anesthesia: string;
  cost: string;
  appointmentRequired: string;
}

export interface DevelopedServiceData {
  slug: string;
  title: {
    bn: string;
    en: string;
  };
  image: string | StaticImageData;
  shortDescription: {
    bn: string;
    en: string;
  };
  description: {
    bn: string;
    en: string;
  };
  benefits: {
    bn: string[];
    en: string[];
  };
  treatmentProcess: {
    bn: string[];
    en: string[];
  };
  duration: {
    bn: string;
    en: string;
  };
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceReview {
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ServiceDetails {
  slug: string;
  name: string;
  shortDescription: string;
  iconSrc: string;
  imageSrc: string;
  quickInfo: ServiceQuickInfo;
  overview: string;
  symptoms: string[];
  whenNeeded: string[];
  treatmentProcedure: [string, string, string, string, string];
  benefits: string[];
  afterCare: string[];
  avoidIf: string[];
  faqs: ServiceFAQ[];
  relatedServiceSlugs: string[];
  specializations: string[];
  reviews: ServiceReview[];
  category:
    | "endodontic"
    | "restorative"
    | "surgical"
    | "preventive"
    | "cosmetic"
    | "prosthodontic"
    | "orthodontic"
    | "pediatric"
    | "oral-surgery"
    | "trauma";
}

type BaseService = Omit<
  ServiceDetails,
  | "overview"
  | "symptoms"
  | "whenNeeded"
  | "treatmentProcedure"
  | "benefits"
  | "afterCare"
  | "avoidIf"
  | "faqs"
  | "relatedServiceSlugs"
  | "reviews"
>;

const categoryContent: Record<
  ServiceDetails["category"],
  Pick<
    ServiceDetails,
    | "overview"
    | "symptoms"
    | "whenNeeded"
    | "benefits"
    | "afterCare"
    | "avoidIf"
  >
> = {
  endodontic: {
    overview:
      "Endodontic care focuses on saving natural teeth by treating infection or inflammation inside the tooth pulp.",
    symptoms: [
      "Persistent toothache or throbbing pain",
      "Sensitivity to hot/cold lasting more than 30 seconds",
      "Swelling around a tooth or gum",
      "Pain while chewing",
    ],
    whenNeeded: [
      "Deep cavities reaching the tooth nerve",
      "Cracked tooth with pulp exposure",
      "Tooth abscess or recurrent infection",
      "Severe lingering sensitivity",
    ],
    benefits: [
      "Preserves your natural tooth",
      "Eliminates infection and pain",
      "Restores function for normal chewing",
      "Prevents spread of infection to nearby tissues",
    ],
    afterCare: [
      "Avoid chewing on the treated side for 24 hours",
      "Take prescribed medicine as directed",
      "Return for crown/final restoration on time",
      "Maintain strict oral hygiene",
    ],
    avoidIf: [
      "Tooth is non-restorable due to severe structural loss",
      "Untreated systemic infection requiring urgent medical stabilization",
      "Severe allergy to local anesthetic alternatives",
    ],
  },
  restorative: {
    overview:
      "Restorative dentistry repairs damaged teeth to restore shape, function, and comfort while preventing further decay.",
    symptoms: [
      "Visible holes, dark spots, or worn tooth surfaces",
      "Food getting stuck between teeth",
      "Mild to moderate sensitivity",
      "Pain while biting",
    ],
    whenNeeded: [
      "Early to moderate tooth decay",
      "Small chips or minor fractures",
      "Leaking old fillings",
      "Cosmetic correction of localized defects",
    ],
    benefits: [
      "Stops cavity progression",
      "Improves chewing comfort",
      "Enhances natural tooth appearance",
      "Protects tooth structure for the long term",
    ],
    afterCare: [
      "Avoid very hard foods for the first day",
      "Brush gently around treated area",
      "Report persistent high bite or sensitivity",
      "Attend routine dental checks",
    ],
    avoidIf: [
      "Uncontrolled gum disease around the target tooth",
      "Very extensive decay that requires crown or extraction",
      "Active severe bruxism without management plan",
    ],
  },
  surgical: {
    overview:
      "Surgical dental treatment addresses complex oral conditions requiring precise procedures under controlled clinical settings.",
    symptoms: [
      "Severe or recurrent pain",
      "Facial or gum swelling",
      "Difficulty opening mouth or chewing",
      "Persistent infection not responding to basic treatment",
    ],
    whenNeeded: [
      "Impacted or non-restorable teeth",
      "Oral lesions, cysts, or suspicious growths",
      "Complicated extractions",
      "Infections requiring drainage and surgical access",
    ],
    benefits: [
      "Definitive treatment for complex dental issues",
      "Reduces chronic infection risks",
      "Relieves persistent pain and swelling",
      "Protects nearby oral structures",
    ],
    afterCare: [
      "Follow medication and wound-care instructions exactly",
      "Use cold compression during first 24 hours",
      "Eat soft foods and avoid smoking",
      "Attend follow-up for healing review",
    ],
    avoidIf: [
      "Uncontrolled blood pressure or bleeding disorders",
      "Unmanaged diabetes",
      "Acute systemic illness without physician clearance",
    ],
  },
  preventive: {
    overview:
      "Preventive procedures reduce plaque, tartar, and disease risk to keep teeth and gums healthy over time.",
    symptoms: [
      "Bleeding gums during brushing",
      "Bad breath or persistent plaque buildup",
      "Early gum recession",
      "Stains and rough tooth surfaces",
    ],
    whenNeeded: [
      "Routine oral maintenance",
      "Early signs of gum inflammation",
      "High caries risk",
      "Before major restorative procedures",
    ],
    benefits: [
      "Prevents cavities and gum disease progression",
      "Improves overall oral hygiene",
      "Freshens breath and reduces plaque",
      "Lowers long-term treatment costs",
    ],
    afterCare: [
      "Avoid strongly colored foods for several hours",
      "Use prescribed mouth rinse if advised",
      "Continue regular brushing/flossing",
      "Schedule recall visits every 6 months",
    ],
    avoidIf: [
      "Acute oral infection requiring immediate targeted care",
      "Severe sensitivity needing desensitization first",
      "Recent major oral surgery still healing",
    ],
  },
  cosmetic: {
    overview:
      "Cosmetic dentistry improves smile aesthetics while preserving or strengthening natural tooth structure when possible.",
    symptoms: [
      "Stained, discolored, or uneven teeth",
      "Minor shape or spacing concerns",
      "Smile dissatisfaction",
      "Visible wear or edge irregularity",
    ],
    whenNeeded: [
      "To improve smile confidence",
      "For events requiring aesthetic enhancement",
      "After completion of basic oral disease treatment",
      "When alignment is acceptable but shape/color needs improvement",
    ],
    benefits: [
      "Enhances smile appearance",
      "Improves confidence in social/professional settings",
      "Can conservatively correct multiple visual issues",
      "Often completed in fewer visits",
    ],
    afterCare: [
      "Avoid stain-causing foods for 48 hours (if whitening)",
      "Use non-abrasive toothpaste",
      "Wear protective guard if advised",
      "Maintain regular polishing and checkups",
    ],
    avoidIf: [
      "Untreated decay or gum disease",
      "Unrealistic aesthetic expectations without consultation",
      "Severe enamel loss requiring restorative-first approach",
    ],
  },
  prosthodontic: {
    overview:
      "Prosthodontic treatment restores missing or heavily damaged teeth with crowns, dentures, or fixed replacements.",
    symptoms: [
      "Missing teeth affecting chewing",
      "Broken teeth requiring full coverage",
      "Poorly fitting old dentures",
      "Difficulty speaking due to tooth loss",
    ],
    whenNeeded: [
      "Single or multiple missing teeth",
      "Teeth weakened after root canal",
      "Need for improved chewing and facial support",
      "Replacement of failing prosthesis",
    ],
    benefits: [
      "Restores chewing efficiency",
      "Improves speech and facial aesthetics",
      "Protects weakened teeth",
      "Improves quality of life and confidence",
    ],
    afterCare: [
      "Follow insertion/removal instructions carefully",
      "Clean prosthesis daily",
      "Attend adjustment visits",
      "Avoid very hard foods initially",
    ],
    avoidIf: [
      "Unhealed extraction sites",
      "Untreated severe periodontal disease",
      "Insufficient support without prior foundational treatment",
    ],
  },
  orthodontic: {
    overview:
      "Orthodontic care aligns teeth and bite relationships to improve both aesthetics and functional oral health.",
    symptoms: [
      "Crowded or spaced teeth",
      "Bite misalignment (overbite/underbite/crossbite)",
      "Jaw discomfort from occlusal issues",
      "Difficulty cleaning between crowded teeth",
    ],
    whenNeeded: [
      "Noticeable misalignment affecting smile or bite",
      "Speech or chewing issues from malocclusion",
      "Relapse after previous braces",
      "Preventive alignment in growing patients",
    ],
    benefits: [
      "Improves bite function and smile aesthetics",
      "Makes oral hygiene easier",
      "Can reduce long-term wear and TMJ strain",
      "Supports better overall oral health outcomes",
    ],
    afterCare: [
      "Wear retainers exactly as instructed",
      "Avoid sticky/hard foods with braces",
      "Attend monthly adjustment visits",
      "Maintain meticulous brushing and flossing",
    ],
    avoidIf: [
      "Active untreated periodontal disease",
      "Poor oral hygiene compliance",
      "Severe systemic conditions without specialist clearance",
    ],
  },
  pediatric: {
    overview:
      "Pediatric dental care is tailored for children, focusing on comfort, prevention, and age-appropriate treatment.",
    symptoms: [
      "Tooth pain or sensitivity in children",
      "Visible cavities in milk teeth",
      "Swelling or gum boils",
      "Feeding or chewing discomfort",
    ],
    whenNeeded: [
      "Early childhood caries",
      "Pain in primary teeth",
      "Preventive assessment for erupting teeth",
      "Behavior-guided care for anxious children",
    ],
    benefits: [
      "Relieves pain quickly and safely",
      "Preserves primary teeth until natural shedding",
      "Supports healthy jaw and speech development",
      "Builds positive long-term dental habits",
    ],
    afterCare: [
      "Monitor child for 24 hours after treatment",
      "Follow diet guidance from dentist",
      "Supervise brushing twice daily",
      "Keep regular follow-up intervals",
    ],
    avoidIf: [
      "Active fever/infection needing medical stabilization first",
      "Incomplete medical history for sedation decisions",
      "Untreated trauma requiring emergency referral",
    ],
  },
  "oral-surgery": {
    overview:
      "Oral surgery includes advanced procedures involving bone, soft tissue, and complex oral pathology management.",
    symptoms: [
      "Persistent jaw or facial pain",
      "Abnormal swelling, lump, or lesion",
      "Bone-related discomfort",
      "Repeated oral infections",
    ],
    whenNeeded: [
      "Pathology requiring biopsy or removal",
      "Bone-related infections or defects",
      "Surgical correction of complex oral conditions",
      "Cases beyond routine restorative treatment",
    ],
    benefits: [
      "Targets root cause of severe oral conditions",
      "Improves oral function and health safety",
      "Prevents progression of pathology",
      "Supports coordinated multidisciplinary care",
    ],
    afterCare: [
      "Strictly follow wound-care protocol",
      "Use prescribed medicines on schedule",
      "Limit strenuous activity temporarily",
      "Attend all post-op reviews",
    ],
    avoidIf: [
      "Uncontrolled coagulopathy",
      "Lack of medical clearance in high-risk patients",
      "Active uncontrolled systemic infection",
    ],
  },
  trauma: {
    overview:
      "Dental trauma care addresses fractures and impact injuries to restore function and reduce long-term complications.",
    symptoms: [
      "Loose, chipped, or broken teeth",
      "Jaw pain after injury",
      "Difficulty biting or mouth opening",
      "Facial swelling or bruising",
    ],
    whenNeeded: [
      "Recent facial or dental injury",
      "Suspected jaw fracture",
      "Tooth displacement or avulsion",
      "Persistent post-trauma pain",
    ],
    benefits: [
      "Rapid pain and stability management",
      "Protects airway and oral structures",
      "Improves healing outcomes",
      "Reduces risk of long-term bite problems",
    ],
    afterCare: [
      "Follow emergency and follow-up instructions",
      "Use soft diet during recovery",
      "Avoid contact activities until cleared",
      "Report numbness, fever, or worsening pain immediately",
    ],
    avoidIf: [
      "None in emergencies; stabilization is prioritized",
      "Elective trauma correction may be delayed in unstable medical conditions",
    ],
  },
};

const createProcedureSteps = (
  name: string,
): [string, string, string, string, string] => [
  `Comprehensive consultation and diagnostics for ${name.toLowerCase()}.`,
  "Personalized treatment planning with explanation of options and outcomes.",
  "Preparation of the treatment area with strict infection-control protocol.",
  `${name} is performed using modern techniques and clinical monitoring.`,
  "Final assessment, after-care guidance, and follow-up scheduling.",
];

const createFaqs = (name: string): ServiceFAQ[] => [
  {
    question: `Is ${name.toLowerCase()} painful?`,
    answer:
      "Most patients report minimal discomfort because we use appropriate anesthesia and gentle techniques.",
  },
  {
    question: `How long does ${name.toLowerCase()} take?`,
    answer:
      "It depends on complexity, but your dentist will provide a realistic timeline after evaluation.",
  },
  {
    question: "Can I return to normal activities the same day?",
    answer:
      "Many patients can, but for surgical or complex treatments we may advise rest for 24–48 hours.",
  },
];

const createReviews = (serviceName: string): ServiceReview[] => [
  {
    patientName: "Ayesha Rahman",
    rating: 5,
    comment: `Very smooth ${serviceName.toLowerCase()} experience. The team explained every step clearly.`,
    date: "2026-05-18",
  },
  {
    patientName: "Md. Arif Hasan",
    rating: 4,
    comment:
      "Professional care and clean clinic environment. Recovery instructions were very helpful.",
    date: "2026-06-02",
  },
];

export const developedServices: DevelopedServiceData[] = [
  {
    slug: "modern-dental-clinic",

    title: {
      bn: "আধুনিক ডেন্টাল ক্লিনিক",
      en: "Modern Dental Clinic",
    },

    image: one,

    shortDescription: {
      bn: "আধুনিক প্রযুক্তি ও অভিজ্ঞ ডেন্টিস্টের মাধ্যমে উন্নতমানের দাঁতের চিকিৎসা।",
      en: "Advanced dental care with modern technology and experienced dentists.",
    },

    description: {
      bn: "আমাদের আধুনিক ডেন্টাল ক্লিনিকে ডিজিটাল প্রযুক্তি, অত্যাধুনিক যন্ত্রপাতি এবং বিশেষজ্ঞ চিকিৎসকদের মাধ্যমে নিরাপদ ও মানসম্মত চিকিৎসা প্রদান করা হয়।",
      en: "Our modern dental clinic provides safe and high-quality dental treatments using advanced technology, equipment, and specialist dentists.",
    },

    benefits: {
      bn: [
        "আধুনিক ডিজিটাল প্রযুক্তি",
        "বিশেষজ্ঞ ডেন্টিস্ট",
        "নিরাপদ ও পরিচ্ছন্ন পরিবেশ",
        "ব্যক্তিগত চিকিৎসা পরিকল্পনা",
      ],
      en: [
        "Advanced digital technology",
        "Expert dental specialists",
        "Safe and hygienic environment",
        "Personalized treatment plans",
      ],
    },

    treatmentProcess: {
      bn: [
        "প্রাথমিক পরীক্ষা",
        "ডিজিটাল ডায়াগনসিস",
        "চিকিৎসা পরিকল্পনা",
        "চিকিৎসা সম্পন্ন",
      ],
      en: [
        "Initial examination",
        "Digital diagnosis",
        "Treatment planning",
        "Treatment completion",
      ],
    },

    duration: {
      bn: "৩০-৬০ মিনিট",
      en: "30-60 minutes",
    },
  },

  {
    slug: "root-canal-treatment",

    title: {
      bn: "রুট ক্যানাল চিকিৎসা",
      en: "Root Canal Treatment",
    },

    image: two,

    shortDescription: {
      bn: "ক্ষতিগ্রস্ত দাঁত সংরক্ষণের জন্য আধুনিক রুট ক্যানাল চিকিৎসা।",
      en: "Modern root canal treatment to save infected and damaged teeth.",
    },

    description: {
      bn: "দাঁতের ভিতরের সংক্রমণ দূর করে প্রাকৃতিক দাঁত দীর্ঘদিন ভালো রাখতে রুট ক্যানাল চিকিৎসা করা হয়।",
      en: "Root canal treatment removes infection and helps preserve your natural tooth for years.",
    },

    benefits: {
      bn: ["দাঁত সংরক্ষণ করা যায়", "ব্যথা কমে", "দাঁতের কার্যক্ষমতা ফিরে আসে"],
      en: [
        "Preserves natural teeth",
        "Reduces pain",
        "Restores tooth function",
      ],
    },

    treatmentProcess: {
      bn: ["দাঁত পরীক্ষা", "সংক্রমণ পরিষ্কার", "রুট ফিলিং", "ক্রাউন স্থাপন"],
      en: [
        "Tooth examination",
        "Cleaning infection",
        "Root filling",
        "Crown placement",
      ],
    },

    duration: {
      bn: "১-৩ ভিজিট",
      en: "1-3 visits",
    },
  },

  {
    slug: "dental-implant",

    title: {
      bn: "ডেন্টাল ইমপ্লান্ট",
      en: "Dental Implant",
    },

    image: three,

    shortDescription: {
      bn: "হারানো দাঁতের জন্য স্থায়ী ও প্রাকৃতিক সমাধান।",
      en: "Permanent and natural-looking solution for missing teeth.",
    },

    description: {
      bn: "ডেন্টাল ইমপ্লান্টের মাধ্যমে হারানো দাঁতের জায়গায় শক্তিশালী ও দীর্ঘস্থায়ী দাঁত প্রতিস্থাপন করা হয়।",
      en: "Dental implants replace missing teeth with strong, durable, and natural-looking teeth.",
    },

    benefits: {
      bn: [
        "দীর্ঘস্থায়ী সমাধান",
        "প্রাকৃতিক দেখতে দাঁত",
        "খাওয়ার সুবিধা বৃদ্ধি",
      ],
      en: [
        "Long-lasting solution",
        "Natural appearance",
        "Improved chewing ability",
      ],
    },

    treatmentProcess: {
      bn: [
        "ডেন্টাল পরীক্ষা",
        "ইমপ্লান্ট স্থাপন",
        "হিলিং পিরিয়ড",
        "ক্রাউন সংযুক্তি",
      ],
      en: [
        "Dental evaluation",
        "Implant placement",
        "Healing period",
        "Crown attachment",
      ],
    },

    duration: {
      bn: "৩-৬ মাস",
      en: "3-6 months",
    },
  },

  {
    slug: "teeth-whitening",

    title: {
      bn: "দাঁত সাদা করার চিকিৎসা",
      en: "Teeth Whitening",
    },

    image: four,

    shortDescription: {
      bn: "উজ্জ্বল ও সুন্দর হাসির জন্য পেশাদার দাঁত সাদা করার সেবা।",
      en: "Professional teeth whitening for a brighter smile.",
    },

    description: {
      bn: "নিরাপদ পদ্ধতিতে দাঁতের দাগ দূর করে উজ্জ্বল হাসি ফিরিয়ে আনা হয়।",
      en: "Safe whitening procedures remove stains and restore a bright smile.",
    },

    benefits: {
      bn: ["উজ্জ্বল হাসি", "দাগ দূর হয়", "আত্মবিশ্বাস বৃদ্ধি"],
      en: ["Brighter smile", "Removes stains", "Boosts confidence"],
    },

    treatmentProcess: {
      bn: ["দাঁতের পরীক্ষা", "ক্লিনিং", "হোয়াইটেনিং প্রয়োগ"],
      en: ["Dental checkup", "Cleaning", "Whitening application"],
    },

    duration: {
      bn: "৬০-৯০ মিনিট",
      en: "60-90 minutes",
    },
  },

  {
    slug: "pediatric-dental-care",

    title: {
      bn: "শিশুদের ডেন্টাল চিকিৎসা",
      en: "Pediatric Dental Care",
    },

    image: five,

    shortDescription: {
      bn: "শিশুদের জন্য নিরাপদ ও বন্ধুত্বপূর্ণ ডেন্টাল সেবা।",
      en: "Safe and friendly dental care specially designed for children.",
    },

    description: {
      bn: "শিশুদের দাঁতের বৃদ্ধি, সমস্যা এবং প্রতিরোধমূলক চিকিৎসার জন্য বিশেষ সেবা প্রদান করা হয়।",
      en: "Specialized dental care for children's dental growth, problems, and prevention.",
    },

    benefits: {
      bn: [
        "শিশু বিশেষজ্ঞ ডাক্তার",
        "বন্ধুত্বপূর্ণ পরিবেশ",
        "প্রতিরোধমূলক চিকিৎসা",
      ],
      en: [
        "Child dental specialists",
        "Friendly environment",
        "Preventive care",
      ],
    },

    treatmentProcess: {
      bn: ["দাঁতের পরীক্ষা", "পরামর্শ", "প্রয়োজনীয় চিকিৎসা"],
      en: ["Dental examination", "Consultation", "Required treatment"],
    },

    duration: {
      bn: "৩০-৬০ মিনিট",
      en: "30-60 minutes",
    },
  },

  {
    slug: "orthodontic-treatment",
    title: {
      bn: "অর্থোডন্টিক চিকিৎসা",
      en: "Orthodontic Treatment",
    },
    image:
      "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1200&q=80",

    shortDescription: {
      bn: "বাঁকা দাঁত সোজা করার আধুনিক ব্রেস চিকিৎসা।",
      en: "Modern braces treatment to straighten crooked teeth.",
    },

    description: {
      bn: "ব্রেস ও আধুনিক অর্থোডন্টিক প্রযুক্তির মাধ্যমে দাঁতের অবস্থান ঠিক করা হয়।",
      en: "Orthodontic technology corrects teeth alignment using braces and modern methods.",
    },

    benefits: {
      bn: ["সুন্দর হাসি", "সঠিক দাঁতের অবস্থান", "উন্নত কামড়"],
      en: ["Beautiful smile", "Proper alignment", "Better bite"],
    },

    treatmentProcess: {
      bn: ["পরীক্ষা", "ব্রেস নির্বাচন", "নিয়মিত ফলোআপ"],
      en: ["Assessment", "Brace selection", "Regular follow-up"],
    },

    duration: {
      bn: "১২-২৪ মাস",
      en: "12-24 months",
    },
  },

  {
    slug: "digital-dental-xray",
    title: {
      bn: "ডিজিটাল ডেন্টাল এক্স-রে",
      en: "Digital Dental X-Ray",
    },

    image:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

    shortDescription: {
      bn: "দাঁতের সমস্যার সঠিক নির্ণয়ের জন্য ডিজিটাল এক্স-রে।",
      en: "Digital imaging for accurate dental diagnosis.",
    },

    description: {
      bn: "ডিজিটাল এক্স-রের মাধ্যমে দাঁতের ভিতরের সমস্যা দ্রুত শনাক্ত করা যায়।",
      en: "Digital X-rays help identify hidden dental problems quickly and accurately.",
    },

    benefits: {
      bn: ["দ্রুত রিপোর্ট", "নির্ভুল রোগ নির্ণয়", "কম রেডিয়েশন"],
      en: ["Fast reports", "Accurate diagnosis", "Low radiation"],
    },

    treatmentProcess: {
      bn: ["এক্স-রে গ্রহণ", "রিপোর্ট বিশ্লেষণ", "চিকিৎসা পরিকল্পনা"],
      en: ["X-ray capture", "Report analysis", "Treatment planning"],
    },

    duration: {
      bn: "১০-২০ মিনিট",
      en: "10-20 minutes",
    },
  },

  {
    slug: "cosmetic-dentistry",

    title: {
      bn: "কসমেটিক ডেন্টিস্ট্রি",
      en: "Cosmetic Dentistry",
    },

    image:
      "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1200&q=80",

    shortDescription: {
      bn: "হাসির সৌন্দর্য বৃদ্ধির জন্য আধুনিক কসমেটিক চিকিৎসা।",
      en: "Modern cosmetic treatments to improve your smile.",
    },

    description: {
      bn: "ভেনিয়ার, বন্ডিং এবং অন্যান্য আধুনিক পদ্ধতির মাধ্যমে হাসির সৌন্দর্য বৃদ্ধি করা হয়।",
      en: "Smile enhancement through veneer, bonding, and advanced cosmetic procedures.",
    },

    benefits: {
      bn: ["সুন্দর হাসি", "দাঁতের আকৃতি উন্নত", "আত্মবিশ্বাস বৃদ্ধি"],
      en: ["Beautiful smile", "Improved tooth shape", "More confidence"],
    },

    treatmentProcess: {
      bn: ["পরামর্শ", "ডিজাইন", "চিকিৎসা সম্পন্ন"],
      en: ["Consultation", "Smile design", "Treatment completion"],
    },

    duration: {
      bn: "১-৩ ভিজিট",
      en: "1-3 visits",
    },
  },

  {
    slug: "emergency-dental-service",

    title: {
      bn: "জরুরি ডেন্টাল সেবা",
      en: "Emergency Dental Service",
    },

    image:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",

    shortDescription: {
      bn: "হঠাৎ দাঁতের ব্যথা ও জরুরি সমস্যার দ্রুত সমাধান।",
      en: "Quick solutions for sudden dental pain and emergencies.",
    },

    description: {
      bn: "জরুরি সময়ে দ্রুত চিকিৎসা ও ব্যথা নিয়ন্ত্রণের জন্য আমাদের বিশেষ সেবা রয়েছে।",
      en: "We provide immediate dental care and pain management during emergencies.",
    },

    benefits: {
      bn: ["দ্রুত চিকিৎসা", "ব্যথা নিয়ন্ত্রণ", "জরুরি পরামর্শ"],
      en: ["Fast treatment", "Pain management", "Emergency consultation"],
    },

    treatmentProcess: {
      bn: ["সমস্যা নির্ণয়", "তাৎক্ষণিক চিকিৎসা", "পরবর্তী পরিকল্পনা"],
      en: ["Diagnosis", "Immediate treatment", "Follow-up plan"],
    },

    duration: {
      bn: "জরুরি ভিত্তিতে",
      en: "Emergency basis",
    },
  },

  {
    slug: "dental-consultation",

    title: {
      bn: "বিশেষজ্ঞ ডেন্টাল পরামর্শ",
      en: "Expert Dental Consultation",
    },

    image:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80",

    shortDescription: {
      bn: "অভিজ্ঞ ডেন্টিস্টের কাছ থেকে ব্যক্তিগত চিকিৎসা পরামর্শ।",
      en: "Personal dental advice from experienced dentists.",
    },

    description: {
      bn: "আপনার দাঁতের সমস্যা অনুযায়ী বিশেষজ্ঞ ডাক্তার চিকিৎসা পরিকল্পনা প্রদান করেন।",
      en: "Our specialists provide personalized treatment plans based on your dental needs.",
    },

    benefits: {
      bn: [
        "বিশেষজ্ঞ পরামর্শ",
        "সঠিক রোগ নির্ণয়",
        "ব্যক্তিগত চিকিৎসা পরিকল্পনা",
      ],
      en: ["Expert advice", "Accurate diagnosis", "Personal treatment plan"],
    },

    treatmentProcess: {
      bn: ["সমস্যা আলোচনা", "পরীক্ষা", "চিকিৎসা পরিকল্পনা"],
      en: ["Problem discussion", "Examination", "Treatment planning"],
    },

    duration: {
      bn: "২০-৩০ মিনিট",
      en: "20-30 minutes",
    },
  },
];

const bestServiceSlugs = new Set([
  "root-canal-treatment",
  "dental-implant",
  "teeth-whitening",
  "orthodontic-treatment",
  "cosmetic-dentistry",
  "pediatric-dental-care",
]);

export const bestServices: DevelopedServiceData[] = developedServices.filter(
  (service) => bestServiceSlugs.has(service.slug),
);

const baseServices: BaseService[] = [
  {
    slug: "root-canal-treatment",
    name: "Root Canal Treatment",
    shortDescription: "Save infected teeth and eliminate deep nerve pain.",
    iconSrc: "/icons/1.png",
    imageSrc: "/icons/1.png",
    category: "endodontic",
    specializations: [
      "Endodontics",
      "Conservative Dentistry",
      "General Dentistry",
    ],
    quickInfo: {
      duration: "60-90 minutes",
      recoveryTime: "1-3 days",
      anesthesia: "Local anesthesia",
      cost: "৳3000 - ৳5000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "tooth-restoration-filling",
    name: "Tooth Restoration Filling",
    shortDescription: "Repair decayed teeth and restore natural function.",
    iconSrc: "/icons/2.png",
    imageSrc: "/icons/2.png",
    category: "restorative",
    specializations: ["Conservative Dentistry", "General Dentistry"],
    quickInfo: {
      duration: "30-45 minutes",
      recoveryTime: "Same day",
      anesthesia: "Usually local anesthesia",
      cost: "৳500 - ৳3000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "tooth-extraction",
    name: "Tooth Extraction",
    shortDescription:
      "Safe removal of a damaged or non-restorable tooth.",
    iconSrc: "/icons/3.png",
    imageSrc: "/icons/3.png",
    category: "surgical",
    specializations: ["Oral Surgery", "General Dentistry"],
    quickInfo: {
      duration: "45-75 minutes",
      recoveryTime: "3-5 days",
      anesthesia: "Local anesthesia",
      cost: "৳500 - ৳3000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "surgical-tooth-extraction",
    name: "Surgical Tooth Extraction",
    shortDescription: "Advanced extraction for impacted or difficult teeth.",
    iconSrc: "/icons/4.png",
    imageSrc: "/icons/4.png",
    category: "surgical",
    specializations: ["Oral Surgery"],
    quickInfo: {
      duration: "45-90 minutes",
      recoveryTime: "5-7 days",
      anesthesia: "Local anesthesia / sedation",
      cost: "৳3000 - ৳8000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "tooth-fracture-management",
    name: "Tooth Fracture Management",
    shortDescription: "Stabilize and restore fractured teeth after injury.",
    iconSrc: "/icons/5.png",
    imageSrc: "/icons/5.png",
    category: "trauma",
    specializations: [
      "Restorative Dentistry",
      "Oral Surgery",
      "General Dentistry",
    ],
    quickInfo: {
      duration: "40-80 minutes",
      recoveryTime: "1-7 days",
      anesthesia: "Case-dependent",
      cost: "৳500 - ৳5000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "scaling-root-planing",
    name: "Scaling And Root Planing",
    shortDescription:
      "Deep gum cleaning to control plaque and periodontal disease.",
    iconSrc: "/icons/6.png",
    imageSrc: "/icons/6.png",
    category: "preventive",
    specializations: ["Periodontics", "General Dentistry"],
    quickInfo: {
      duration: "45-70 minutes",
      recoveryTime: "1-2 days",
      anesthesia: "Topical / local anesthesia",
      cost: "৳1500 - ৳2500",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "dental-implants",
    name: "Dental Implants",
    shortDescription:
      "Permanent replacement for missing teeth with natural feel.",
    iconSrc: "/icons/7.png",
    imageSrc: "/icons/7.png",
    category: "prosthodontic",
    specializations: ["Implant Dentistry", "Prosthodontics", "Oral Surgery"],
    quickInfo: {
      duration: "60-120 minutes",
      recoveryTime: "3-7 days (initial)",
      anesthesia: "Local anesthesia / sedation",
      cost: "৳30000 - ৳70000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "teeth-whitening",
    name: "Teeth Whitening (bleaching)",
    shortDescription:
      "Professional whitening for a brighter and cleaner smile.",
    iconSrc: "/icons/8.png",
    imageSrc: "/icons/8.png",
    category: "cosmetic",
    specializations: ["Cosmetic Dentistry", "General Dentistry"],
    quickInfo: {
      duration: "30-60 minutes",
      recoveryTime: "Same day",
      anesthesia: "Not usually required",
      cost: "৳4000 - ৳10000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "dental-veneer",
    name: "Dental Veneer",
    shortDescription:
      "Thin custom shells to improve shape, color, and smile harmony.",
    iconSrc: "/icons/9.png",
    imageSrc: "/icons/9.png",
    category: "cosmetic",
    specializations: ["Cosmetic Dentistry", "Prosthodontics"],
    quickInfo: {
      duration: "2-3 visits",
      recoveryTime: "1-2 days",
      anesthesia: "Minimal / local",
      cost: "৳120 - ৳400 per tooth",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "dental-crowns",
    name: "Dental Crowns",
    shortDescription:
      "Protect weak teeth with durable full-coverage restoration.",
    iconSrc: "/icons/10.png",
    imageSrc: "/icons/10.png",
    category: "prosthodontic",
    specializations: ["Prosthodontics", "Restorative Dentistry"],
    quickInfo: {
      duration: "2 visits",
      recoveryTime: "1-3 days",
      anesthesia: "Local anesthesia",
      cost: "৳3000 - ৳15000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "metal-crown",
    name: "Metal Crown",
    shortDescription:
      "Strong metal crown option for long-lasting posterior support.",
    iconSrc: "/icons/11.png",
    imageSrc: "/icons/11.png",
    category: "prosthodontic",
    specializations: ["Prosthodontics"],
    quickInfo: {
      duration: "2 visits",
      recoveryTime: "1-2 days",
      anesthesia: "Local anesthesia",
      cost: "৳3000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "metal-ceramic-crown",
    name: "Metal Ceramic Crown",
    shortDescription: "Balanced strength and aesthetics for crown restoration.",
    iconSrc: "/icons/12.png",
    imageSrc: "/icons/12.png",
    category: "prosthodontic",
    specializations: ["Prosthodontics"],
    quickInfo: {
      duration: "2 visits",
      recoveryTime: "1-2 days",
      anesthesia: "Local anesthesia",
      cost: "৳3000 - ৳4000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "zirconia-crown",
    name: "Zirconia Crown",
    shortDescription: "Premium aesthetic crown with excellent durability.",
    iconSrc: "/icons/13.png",
    imageSrc: "/icons/13.png",
    category: "prosthodontic",
    specializations: ["Prosthodontics", "Cosmetic Dentistry"],
    quickInfo: {
      duration: "2 visits",
      recoveryTime: "1-2 days",
      anesthesia: "Local anesthesia",
      cost: "৳10000 - ৳15000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "e-max-crown",
    name: "E Max Crown",
    shortDescription: "Highly aesthetic all-ceramic crown for visible teeth.",
    iconSrc: "/icons/14.png",
    imageSrc: "/icons/14.png",
    category: "prosthodontic",
    specializations: ["Prosthodontics", "Cosmetic Dentistry"],
    quickInfo: {
      duration: "2 visits",
      recoveryTime: "1-2 days",
      anesthesia: "Local anesthesia",
      cost: "৳10000 - ৳15000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "partial-complete-dentures",
    name: "Partial And Complete Dentures",
    shortDescription:
      "Replace missing teeth to restore smile and chewing function.",
    iconSrc: "/icons/15.png",
    imageSrc: "/icons/15.png",
    category: "prosthodontic",
    specializations: ["Prosthodontics"],
    quickInfo: {
      duration: "3-5 visits",
      recoveryTime: "3-10 days adaptation",
      anesthesia: "Not usually required",
      cost: "৳1500 - ৳16000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "acrylic-dentures",
    name: "Acrylic Dentures",
    shortDescription:
      "Cost-effective removable prosthesis for tooth replacement.",
    iconSrc: "/icons/16.png",
    imageSrc: "/icons/16.png",
    category: "prosthodontic",
    specializations: ["Prosthodontics"],
    quickInfo: {
      duration: "3-4 visits",
      recoveryTime: "3-7 days adaptation",
      anesthesia: "Not usually required",
      cost: "৳8000 - ৳16000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "flexible-denture",
    name: "Flexible Dentures",
    shortDescription:
      "Comfortable, aesthetic, metal-free removable denture option.",
    iconSrc: "/icons/17.png",
    imageSrc: "/icons/17.png",
    category: "prosthodontic",
    specializations: ["Prosthodontics"],
    quickInfo: {
      duration: "3-4 visits",
      recoveryTime: "2-5 days adaptation",
      anesthesia: "Not usually required",
      cost: "৳7000 - ৳20000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "orthodontic-treatment",
    name: "Orthodontic Treatment",
    shortDescription: "Align teeth and improve bite with braces or aligners.",
    iconSrc: "/icons/18.png",
    imageSrc: "/icons/18.png",
    category: "orthodontic",
    specializations: ["Orthodontics"],
    quickInfo: {
      duration: "6-24 months",
      recoveryTime: "Mild discomfort 2-5 days after adjustments",
      anesthesia: "Not required",
      cost: "Braces-৳60000-৳120000, Clear Aligner-৳100000-৳150000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "cyst-tumor-surgery",
    name: "Cyst And Tumor Surgery",
    shortDescription: "Surgical management of oral cystic or tumorous lesions.",
    iconSrc: "/icons/19.png",
    imageSrc: "/icons/19.png",
    category: "oral-surgery",
    specializations: ["Oral & Maxillofacial Surgery"],
    quickInfo: {
      duration: "60-150 minutes",
      recoveryTime: "7-14 days",
      anesthesia: "Local / sedation / GA (case-based)",
      cost: "With local anasthesia>৳12000-৳20000, with general anasthasia>৳40000-৳100000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "apicoectomy",
    name: "Apicoectomy",
    shortDescription:
      "Microsurgical root-end treatment when root canal alone is insufficient.",
    iconSrc: "/icons/20.png",
    imageSrc: "/icons/20.png",
    category: "endodontic",
    specializations: ["Endodontics", "Oral Surgery"],
    quickInfo: {
      duration: "45-90 minutes",
      recoveryTime: "3-7 days",
      anesthesia: "Local anesthesia",
      cost: "৳9000 - ৳15000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "midline-diastema-closure",
    name: "Midline Diastema Closure",
    shortDescription:
      "Close front tooth gap for better smile aesthetics and phonetics.",
    iconSrc: "/icons/21.png",
    imageSrc: "/icons/21.png",
    category: "cosmetic",
    specializations: ["Cosmetic Dentistry", "Orthodontics"],
    quickInfo: {
      duration: "1-3 visits",
      recoveryTime: "Same day",
      anesthesia: "Minimal / local",
      cost: "৳3000 - ৳5000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "mandible-fracture-management",
    name: "Mandible Fracture Management",
    shortDescription:
      "Comprehensive assessment and stabilization of lower jaw fractures.",
    iconSrc: "/icons/22.png",
    imageSrc: "/icons/22.png",
    category: "trauma",
    specializations: ["Oral & Maxillofacial Surgery"],
    quickInfo: {
      duration: "Emergency + staged care",
      recoveryTime: "2-6 weeks",
      anesthesia: "Case-dependent",
      cost: "৳10000 - ৳40000",
      appointmentRequired: "Urgent/Emergency",
    },
  },
  {
    slug: "facial-bone-fracture-management",
    name: "Facial Bone Fracture Management",
    shortDescription: "Advanced trauma care for facial skeleton injuries.",
    iconSrc: "/icons/23.png",
    imageSrc: "/icons/23.png",
    category: "trauma",
    specializations: ["Oral & Maxillofacial Surgery"],
    quickInfo: {
      duration: "Emergency + staged care",
      recoveryTime: "2-8 weeks",
      anesthesia: "Case-dependent",
      cost: "varriable",
      appointmentRequired: "Urgent/Emergency",
    },
  },
  {
    slug: "child-dental-disease-management",
    name: "Child Dental Disease Management",
    shortDescription:
      "Child-focused diagnosis and treatment for common pediatric dental problems.",
    iconSrc: "/icons/24.png",
    imageSrc: "/icons/24.png",
    category: "pediatric",
    specializations: ["Pediatric Dentistry"],
    quickInfo: {
      duration: "30-60 minutes",
      recoveryTime: "Same day to 2 days",
      anesthesia: "Topical / local (if needed)",
      cost: "varriable",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "dental-filling",
    name: "Dental Filling",
    shortDescription: "Simple cavity restoration for children and adults.",
    iconSrc: "/icons/25.png",
    imageSrc: "/icons/25.png",
    category: "restorative",
    specializations: ["General Dentistry", "Pediatric Dentistry"],
    quickInfo: {
      duration: "20-40 minutes",
      recoveryTime: "Same day",
      anesthesia: "Usually local anesthesia",
      cost: "varriable",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "pulpotomy",
    name: "Pulpotomy",
    shortDescription: "Vital pulp therapy to preserve infected primary teeth.",
    iconSrc: "/icons/26.png",
    imageSrc: "/icons/26.png",
    category: "pediatric",
    specializations: ["Pediatric Dentistry", "Endodontics"],
    quickInfo: {
      duration: "30-50 minutes",
      recoveryTime: "1-2 days",
      anesthesia: "Local anesthesia",
      cost: "৳1000 - ৳2000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "pulpectomy",
    name: "Pulpectomy",
    shortDescription:
      "Complete pulp treatment for severely infected primary teeth.",
    iconSrc: "/icons/27.png",
    imageSrc: "/icons/27.png",
    category: "pediatric",
    specializations: ["Pediatric Dentistry", "Endodontics"],
    quickInfo: {
      duration: "45-70 minutes",
      recoveryTime: "1-3 days",
      anesthesia: "Local anesthesia",
      cost: "৳2000 - ৳4000",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "dental-abscess-management",
    name: "Dental Abscess Management",
    shortDescription:
      "Rapid pain relief and infection control for dental abscess.",
    iconSrc: "/icons/28.png",
    imageSrc: "/icons/28.png",
    category: "surgical",
    specializations: ["Endodontics", "Oral Surgery", "General Dentistry"],
    quickInfo: {
      duration: "30-75 minutes",
      recoveryTime: "2-5 days",
      anesthesia: "Local anesthesia",
      cost: "৳500 - ৳1000",
      appointmentRequired: "Yes / Emergency",
    },
  },
  {
    slug: "dental-aesthetics-smile-design",
    name: "Dental Aesthetics And Smile Design",
    shortDescription: "Personalized cosmetic planning to improve smile balance, color, and proportion.",
    iconSrc: "/icons/29.png",
    imageSrc: "/icons/29.png",
    category: "cosmetic",
    specializations: ["Cosmetic Dentistry", "Prosthodontics"],
    quickInfo: { duration: "45-90 minutes", recoveryTime: "Treatment-dependent", anesthesia: "Usually not required", cost: "Custom quote", appointmentRequired: "Yes" },
  },
  {
    slug: "dental-bridges",
    name: "Dental Bridges",
    shortDescription: "Fixed replacement of one or more missing teeth using supported prosthetic teeth.",
    iconSrc: "/icons/30.png",
    imageSrc: "/icons/30.png",
    category: "prosthodontic",
    specializations: ["Prosthodontics", "Restorative Dentistry"],
    quickInfo: { duration: "2-3 visits", recoveryTime: "2-5 days", anesthesia: "Local anesthesia", cost: "Custom quote", appointmentRequired: "Yes" },
  },
  {
    slug: "apexogenesis-apexification",
    name: "Apexogenesis And Apexification",
    shortDescription: "Specialized pulp therapy that supports root development in immature permanent teeth.",
    iconSrc: "/icons/31.png",
    imageSrc: "/icons/31.png",
    category: "endodontic",
    specializations: ["Endodontics", "Pediatric Dentistry"],
    quickInfo: { duration: "45-75 minutes", recoveryTime: "1-3 days", anesthesia: "Local anesthesia", cost: "Custom quote", appointmentRequired: "Yes" },
  },
  {
    slug: "dental-emergency-management",
    name: "Dental Emergency Management",
    shortDescription: "Prompt assessment and stabilization for severe pain, trauma, bleeding, or swelling.",
    iconSrc: "/icons/32.png",
    imageSrc: "/icons/32.png",
    category: "trauma",
    specializations: ["Emergency Dentistry", "General Dentistry", "Oral Surgery"],
    quickInfo: { duration: "30-90 minutes", recoveryTime: "Case-dependent", anesthesia: "Case-dependent", cost: "Case-dependent", appointmentRequired: "Urgent / Emergency" },
  },
  {
    slug: "pyogenic-granuloma-surgery",
    name: "Pyogenic Granuloma Surgery",
    shortDescription: "Removal and examination of a benign overgrowth that commonly affects the gums.",
    iconSrc: "/icons/33.png",
    imageSrc: "/icons/33.png",
    category: "oral-surgery",
    specializations: ["Oral & Maxillofacial Surgery", "Periodontics"],
    quickInfo: { duration: "30-60 minutes", recoveryTime: "5-10 days", anesthesia: "Local anesthesia", cost: "৳10000-৳20000", appointmentRequired: "Yes" },
  },
  {
    slug: "oral-cancer-management",
    name: "Oral Cancer Management",
    shortDescription: "Coordinated evaluation, biopsy, treatment planning, and follow-up for oral cancer.",
    iconSrc: "/icons/34.png",
    imageSrc: "/icons/34.png",
    category: "oral-surgery",
    specializations: ["Oral & Maxillofacial Surgery", "Oral Medicine"],
    quickInfo: { duration: "Multistage care", recoveryTime: "Treatment-dependent", anesthesia: "Procedure-dependent", cost: "Custom quote", appointmentRequired: "Urgent consultation" },
  },
  {
    slug: "oral-ulcer-treatment",
    name: "Oral Ulcer Treatment",
    shortDescription: "Diagnosis and targeted care for persistent, painful, or recurrent mouth ulcers.",
    iconSrc: "/icons/35.png",
    imageSrc: "/icons/35.png",
    category: "preventive",
    specializations: ["Oral Medicine", "General Dentistry"],
    quickInfo: { duration: "20-40 minutes", recoveryTime: "Usually 7-14 days", anesthesia: "Not usually required", cost: "Custom quote", appointmentRequired: "Yes" },
  },
  {
    slug: "premalignant-lesion-management",
    name: "Premalignant Lesion Management",
    shortDescription: "Assessment, biopsy, risk reduction, and monitoring of potentially malignant oral lesions.",
    iconSrc: "/icons/36.png",
    imageSrc: "/icons/36.png",
    category: "oral-surgery",
    specializations: ["Oral Medicine", "Oral & Maxillofacial Surgery"],
    quickInfo: { duration: "30-60 minutes", recoveryTime: "Procedure-dependent", anesthesia: "Local anesthesia if biopsied", cost: "Custom quote", appointmentRequired: "Yes" },
  },
  {
    slug: "oral-thrush-treatment",
    name: "Oral Thrush Treatment",
    shortDescription: "Antifungal care and cause assessment for oral candidiasis affecting the mouth and tongue.",
    iconSrc: "/icons/37.png",
    imageSrc: "/icons/37.png",
    category: "preventive",
    specializations: ["Oral Medicine", "General Dentistry"],
    quickInfo: { duration: "20-30 minutes", recoveryTime: "7-14 days", anesthesia: "Not required", cost: "Custom quote", appointmentRequired: "Yes" },
  },
  {
    slug: "dental-x-ray-opg-rvg",
    name: "Dental X-ray ( OPG & RVG)",
    shortDescription: "Digital panoramic and intraoral imaging for accurate dental diagnosis and treatment planning.",
    iconSrc: "/icons/38.png",
    imageSrc: "/icons/38.png",
    category: "preventive",
    specializations: ["Oral Radiology", "General Dentistry"],
    quickInfo: { duration: "10-20 minutes", recoveryTime: "None", anesthesia: "Not required", cost: "৳150-৳", appointmentRequired: "Recommended" },
  },
];

const serviceCatalogDraft: ServiceDetails[] = baseServices.map((service) => {
  const template = categoryContent[service.category];

  return {
    ...service,
    overview: `${service.shortDescription} ${template.overview}`,
    symptoms: template.symptoms,
    whenNeeded: template.whenNeeded,
    treatmentProcedure: createProcedureSteps(service.name),
    benefits: template.benefits,
    afterCare: template.afterCare,
    avoidIf: template.avoidIf,
    faqs: createFaqs(service.name),
    relatedServiceSlugs: [],
    reviews: createReviews(service.name),
  };
});

// Some developed services also have a richer entry in the main service
// catalog. Keep the main entry in that case so every public slug appears
// exactly once across listings, related services, and static route params.
const allCatalogDraft: ServiceDetails[] = serviceCatalogDraft;

const serviceCatalog: ServiceDetails[] = allCatalogDraft.map((service) => {
  const related = allCatalogDraft
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 3)
    .map((s) => s.slug);

  return {
    ...service,
    relatedServiceSlugs: related,
  };
});

const serviceMap = new Map(
  serviceCatalog.map((service) => [service.slug, service]),
);

const developedServiceMap = new Map(
  developedServices.map((service) => [service.slug, service]),
);

const bestServiceMap = new Map(
  bestServices.map((service) => [service.slug, service]),
);

export function getAllServices(): ServiceDetails[] {
  return serviceCatalog;
}

export function getServiceBySlug(slug: string): ServiceDetails | undefined {
  return serviceMap.get(slug);
}

export function getServicesBySlugs(slugs: string[]): ServiceDetails[] {
  return slugs
    .map((slug) => serviceMap.get(slug))
    .filter((service): service is ServiceDetails => Boolean(service));
}

export function getAllServiceSlugs(): string[] {
  return serviceCatalog.map((service) => service.slug);
}

export function getAllDevelopedServices(): DevelopedServiceData[] {
  return developedServices;
}

export function getDevelopedServiceBySlug(
  slug: string,
): DevelopedServiceData | undefined {
  return developedServiceMap.get(slug);
}

export function getAllDevelopedServiceSlugs(): string[] {
  return developedServices.map((service) => service.slug);
}

export function getDevelopedServicesBySlugs(
  slugs: string[],
): DevelopedServiceData[] {
  return slugs
    .map((slug) => developedServiceMap.get(slug))
    .filter((service): service is DevelopedServiceData => Boolean(service));
}

export function getAllBestServices(): DevelopedServiceData[] {
  return bestServices;
}

export function getBestServiceBySlug(
  slug: string,
): DevelopedServiceData | undefined {
  return bestServiceMap.get(slug);
}

export function getAllBestServiceSlugs(): string[] {
  return bestServices.map((service) => service.slug);
}

export function getBestServicesBySlugs(
  slugs: string[],
): DevelopedServiceData[] {
  return slugs
    .map((slug) => bestServiceMap.get(slug))
    .filter((service): service is DevelopedServiceData => Boolean(service));
}
