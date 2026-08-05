export interface ServiceQuickInfo {
  duration: string;
  recoveryTime: string;
  anesthesia: string;
  cost: string;
  appointmentRequired: string;
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
      cost: "$80 - $180",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "tooth-restoration-filling",
    name: "Tooth Restoration (Filling)",
    shortDescription: "Repair decayed teeth and restore natural function.",
    iconSrc: "/icons/2.png",
    imageSrc: "/icons/2.png",
    category: "restorative",
    specializations: ["Conservative Dentistry", "General Dentistry"],
    quickInfo: {
      duration: "30-45 minutes",
      recoveryTime: "Same day",
      anesthesia: "Usually local anesthesia",
      cost: "$20 - $60",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "extraction-colour-matching-filling",
    name: "Extraction (Colour Matching Filling)",
    shortDescription:
      "Tooth removal and aesthetic restoration planning in one pathway.",
    iconSrc: "/icons/3.png",
    imageSrc: "/icons/3.png",
    category: "surgical",
    specializations: ["Oral Surgery", "General Dentistry"],
    quickInfo: {
      duration: "45-75 minutes",
      recoveryTime: "3-5 days",
      anesthesia: "Local anesthesia",
      cost: "$35 - $110",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "surgical-extraction",
    name: "Surgical Extraction",
    shortDescription: "Advanced extraction for impacted or difficult teeth.",
    iconSrc: "/icons/4.png",
    imageSrc: "/icons/4.png",
    category: "surgical",
    specializations: ["Oral Surgery"],
    quickInfo: {
      duration: "45-90 minutes",
      recoveryTime: "5-7 days",
      anesthesia: "Local anesthesia / sedation",
      cost: "$60 - $200",
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
      cost: "$30 - $220",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "scaling-root-planing",
    name: "Scaling & Root Planing",
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
      cost: "$40 - $120",
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
      cost: "$450 - $1200",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "bleaching-teeth-whitening",
    name: "Bleaching (Teeth Whitening)",
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
      cost: "$60 - $180",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "veneer",
    name: "Veneer",
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
      cost: "$120 - $400 per tooth",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "crown-cap",
    name: "Crown (Cap)",
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
      cost: "$90 - $260",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "metal-cap",
    name: "Metal Cap",
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
      cost: "$80 - $180",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "metal-ceramic-cap",
    name: "Metal Ceramic Cap",
    shortDescription: "Balanced strength and aesthetics for crown restoration.",
    iconSrc: "/icons/12.png",
    imageSrc: "/icons/12.png",
    category: "prosthodontic",
    specializations: ["Prosthodontics"],
    quickInfo: {
      duration: "2 visits",
      recoveryTime: "1-2 days",
      anesthesia: "Local anesthesia",
      cost: "$120 - $240",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "zirconia-cap",
    name: "Zirconia Cap",
    shortDescription: "Premium aesthetic crown with excellent durability.",
    iconSrc: "/icons/13.png",
    imageSrc: "/icons/13.png",
    category: "prosthodontic",
    specializations: ["Prosthodontics", "Cosmetic Dentistry"],
    quickInfo: {
      duration: "2 visits",
      recoveryTime: "1-2 days",
      anesthesia: "Local anesthesia",
      cost: "$180 - $380",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "e-max-cap",
    name: "E-max Cap",
    shortDescription: "Highly aesthetic all-ceramic crown for visible teeth.",
    iconSrc: "/icons/14.png",
    imageSrc: "/icons/14.png",
    category: "prosthodontic",
    specializations: ["Prosthodontics", "Cosmetic Dentistry"],
    quickInfo: {
      duration: "2 visits",
      recoveryTime: "1-2 days",
      anesthesia: "Local anesthesia",
      cost: "$220 - $420",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "partial-complete-denture",
    name: "Partial Denture & Complete Denture",
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
      cost: "$120 - $500",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "acrylic-teeth-denture",
    name: "Acrylic Teeth / Denture",
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
      cost: "$90 - $300",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "flexible-denture",
    name: "Flexible Denture",
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
      cost: "$150 - $420",
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
      cost: "$350 - $1600",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "cyst-tumour-surgery",
    name: "Cyst & Tumour Surgery",
    shortDescription: "Surgical management of oral cystic or tumorous lesions.",
    iconSrc: "/icons/19.png",
    imageSrc: "/icons/19.png",
    category: "oral-surgery",
    specializations: ["Oral & Maxillofacial Surgery"],
    quickInfo: {
      duration: "60-150 minutes",
      recoveryTime: "7-14 days",
      anesthesia: "Local / sedation / GA (case-based)",
      cost: "$150 - $900",
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
      cost: "$120 - $320",
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
      cost: "$40 - $260",
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
      cost: "$300 - $2400",
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
      cost: "$450 - $3000",
      appointmentRequired: "Urgent/Emergency",
    },
  },
  {
    slug: "children-dental-disease-management",
    name: "Children Dental Diseases Management",
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
      cost: "$25 - $140",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "filling",
    name: "Filling",
    shortDescription: "Simple cavity restoration for children and adults.",
    iconSrc: "/icons/25.png",
    imageSrc: "/icons/25.png",
    category: "restorative",
    specializations: ["General Dentistry", "Pediatric Dentistry"],
    quickInfo: {
      duration: "20-40 minutes",
      recoveryTime: "Same day",
      anesthesia: "Usually local anesthesia",
      cost: "$15 - $55",
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
      cost: "$35 - $95",
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
      cost: "$45 - $130",
      appointmentRequired: "Yes",
    },
  },
  {
    slug: "abscess-management",
    name: "Abscess Management",
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
      cost: "$35 - $160",
      appointmentRequired: "Yes / Emergency",
    },
  },
];

const serviceCatalogDraft: ServiceDetails[] = baseServices.map((service) => {
  const template = categoryContent[service.category];

  return {
    ...service,
    overview: template.overview,
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

const serviceCatalog: ServiceDetails[] = serviceCatalogDraft.map((service) => {
  const related = serviceCatalogDraft
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
