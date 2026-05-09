// utils/universityData.js
// Pakistan University Aggregate Calculator Data & Formulas

export const universities = [
  {
    id: "nust",
    name: "NUST",
    fullName: "National University of Sciences and Technology",
    city: "Islamabad",
    slug: "nust-islamabad",
    logo: "🎓",
    color: "#1565C0",
    accentColor: "#42A5F5",
    entryTest: "NET",
    description:
      "NUST calculates aggregate based on Matric, FSc/A-Levels, and NET score.",
    formula: { matric: 10, inter: 15, entryTest: 75 },
    formulaLabel: "10% Matric + 15% FSc + 75% NET",
    minAggregate: 50,
    fields: [
      { key: "matric", label: "Matric Marks", max: 1200, placeholder: "e.g. 990" },
      { key: "inter", label: "FSc / Intermediate Marks", max: 1200, placeholder: "e.g. 950" },
      { key: "entryTest", label: "NET Score", max: 200, placeholder: "e.g. 150" },
    ],
    programs: ["Engineering", "CS & IT", "Business", "Sciences", "Architecture"],
    website: "https://nust.edu.pk",
  },
  {
    id: "uet",
    name: "UET Lahore",
    fullName: "University of Engineering and Technology, Lahore",
    city: "Lahore",
    slug: "uet-lahore",
    logo: "⚙️",
    color: "#2E7D32",
    accentColor: "#66BB6A",
    entryTest: "ECAT",
    description: "UET Lahore calculates aggregate using Matric, FSc, and ECAT score.",
    formula: { matric: 10, inter: 40, entryTest: 50 },
    formulaLabel: "10% Matric + 40% FSc + 50% ECAT",
    minAggregate: 50,
    fields: [
      { key: "matric", label: "Matric Marks", max: 1200, placeholder: "e.g. 990" },
      { key: "inter", label: "FSc Marks (Pre-Engineering)", max: 1200, placeholder: "e.g. 950" },
      { key: "entryTest", label: "ECAT Score", max: 400, placeholder: "e.g. 320" },
    ],
    programs: ["Civil Engineering", "Mechanical", "Electrical", "Chemical", "CS"],
    website: "https://uet.edu.pk",
  },
  {
    id: "fast",
    name: "FAST-NUCES",
    fullName: "FAST National University of Computer and Emerging Sciences",
    city: "Multiple Campuses",
    slug: "fast-nuces",
    logo: "💻",
    color: "#6A1B9A",
    accentColor: "#AB47BC",
    entryTest: "NU Test / NAT",
    description: "FAST uses NU Entry Test or NAT for admission with Matric and FSc weightage.",
    formula: { matric: 10, inter: 40, entryTest: 50 },
    formulaLabel: "10% Matric + 40% FSc + 50% NU Test",
    minAggregate: 50,
    fields: [
      { key: "matric", label: "Matric Marks", max: 1200, placeholder: "e.g. 990" },
      { key: "inter", label: "FSc Marks", max: 1200, placeholder: "e.g. 950" },
      { key: "entryTest", label: "NU Test / NAT Score", max: 100, placeholder: "e.g. 75" },
    ],
    programs: ["Computer Science", "Software Engineering", "AI & DS", "Business Computing"],
    website: "https://nu.edu.pk",
  },
  {
    id: "comsats",
    name: "COMSATS",
    fullName: "COMSATS University Islamabad",
    city: "Multiple Campuses",
    slug: "comsats-university",
    logo: "🔬",
    color: "#C62828",
    accentColor: "#EF5350",
    entryTest: "SAT / NTS / NAT",
    description: "COMSATS accepts SAT, NTS, and NAT scores with Matric and FSc marks.",
    formula: { matric: 10, inter: 40, entryTest: 50 },
    formulaLabel: "10% Matric + 40% FSc + 50% Entry Test",
    minAggregate: 45,
    fields: [
      { key: "matric", label: "Matric Marks", max: 1200, placeholder: "e.g. 990" },
      { key: "inter", label: "FSc / A-Level Marks", max: 1200, placeholder: "e.g. 950" },
      { key: "entryTest", label: "Entry Test Score (SAT/NTS/NAT)", max: 100, placeholder: "e.g. 70" },
    ],
    programs: ["Computer Science", "Engineering", "Biosciences", "Management", "Pharmacy"],
    website: "https://comsats.edu.pk",
  },
  {
    id: "lums",
    name: "LUMS",
    fullName: "Lahore University of Management Sciences",
    city: "Lahore",
    slug: "lums-lahore",
    logo: "🏛️",
    color: "#E65100",
    accentColor: "#FFA726",
    entryTest: "SAT / LCAT",
    description: "LUMS uses SAT scores primarily with O/A-Level or Matric/FSc equivalents.",
    formula: { matric: 20, inter: 30, entryTest: 50 },
    formulaLabel: "20% Matric + 30% FSc + 50% SAT/LCAT",
    minAggregate: 60,
    fields: [
      { key: "matric", label: "Matric / O-Level Marks", max: 1200, placeholder: "e.g. 990" },
      { key: "inter", label: "FSc / A-Level Marks", max: 1200, placeholder: "e.g. 950" },
      { key: "entryTest", label: "SAT Score (out of 1600)", max: 1600, placeholder: "e.g. 1350" },
    ],
    programs: ["Business Administration", "Computer Science", "Law", "Social Sciences", "Engineering"],
    website: "https://lums.edu.pk",
  },
  {
    id: "pu",
    name: "Punjab University",
    fullName: "University of the Punjab",
    city: "Lahore",
    slug: "university-of-punjab",
    logo: "📚",
    color: "#1A237E",
    accentColor: "#5C6BC0",
    entryTest: "PU Entry Test",
    description: "Punjab University uses PU Entry Test along with Matric and FSc marks.",
    formula: { matric: 10, inter: 40, entryTest: 50 },
    formulaLabel: "10% Matric + 40% FSc + 50% PU Test",
    minAggregate: 45,
    fields: [
      { key: "matric", label: "Matric Marks", max: 1200, placeholder: "e.g. 990" },
      { key: "inter", label: "FSc Marks", max: 1200, placeholder: "e.g. 950" },
      { key: "entryTest", label: "PU Entry Test Score", max: 100, placeholder: "e.g. 72" },
    ],
    programs: ["Sciences", "Arts & Humanities", "Commerce", "Law", "IT"],
    website: "https://pu.edu.pk",
  },
  {
    id: "qau",
    name: "Quaid-i-Azam University",
    fullName: "Quaid-i-Azam University",
    city: "Islamabad",
    slug: "quaid-i-azam-university",
    logo: "🌟",
    color: "#004D40",
    accentColor: "#26A69A",
    entryTest: "QAU Entry Test",
    description: "QAU calculates aggregate based on Matric, FSc, and QAU Entry Test.",
    formula: { matric: 10, inter: 40, entryTest: 50 },
    formulaLabel: "10% Matric + 40% FSc + 50% QAU Test",
    minAggregate: 45,
    fields: [
      { key: "matric", label: "Matric Marks", max: 1200, placeholder: "e.g. 990" },
      { key: "inter", label: "FSc Marks", max: 1200, placeholder: "e.g. 950" },
      { key: "entryTest", label: "QAU Entry Test Score", max: 100, placeholder: "e.g. 68" },
    ],
    programs: ["Natural Sciences", "Social Sciences", "Biological Sciences", "Chemistry", "Physics"],
    website: "https://qau.edu.pk",
  },
  {
    id: "aku",
    name: "Aga Khan University",
    fullName: "Aga Khan University",
    city: "Karachi",
    slug: "aga-khan-university",
    logo: "🏥",
    color: "#880E4F",
    accentColor: "#EC407A",
    entryTest: "AKU-EB / SAT II",
    description: "AKU focuses on medical sciences with its own entry test and high academic standards.",
    formula: { matric: 15, inter: 35, entryTest: 50 },
    formulaLabel: "15% Matric + 35% FSc + 50% AKU Test",
    minAggregate: 70,
    fields: [
      { key: "matric", label: "Matric Marks", max: 1200, placeholder: "e.g. 1050" },
      { key: "inter", label: "FSc Pre-Medical Marks", max: 1200, placeholder: "e.g. 1000" },
      { key: "entryTest", label: "AKU Entry Test Score", max: 100, placeholder: "e.g. 85" },
    ],
    programs: ["MBBS", "BScN Nursing", "Medical College", "Institute of Education"],
    website: "https://aku.edu",
  },
];

export function calculateAggregate(university, values) {
  const { matric, inter, entryTest } = values;
  const { formula, fields } = university;

  const matricMax = fields.find((f) => f.key === "matric")?.max || 1200;
  const interMax  = fields.find((f) => f.key === "inter")?.max  || 1200;
  const testMax   = fields.find((f) => f.key === "entryTest")?.max || 100;

  const matricPct = (matric  / matricMax) * 100;
  const interPct  = (inter   / interMax)  * 100;
  const testPct   = (entryTest / testMax) * 100;

  const aggregate =
    (matricPct * formula.matric)    / 100 +
    (interPct  * formula.inter)     / 100 +
    (testPct   * formula.entryTest) / 100;

  return {
    aggregate:     aggregate.toFixed(2),
    matricPercent: matricPct.toFixed(1),
    interPercent:  interPct.toFixed(1),
    testPercent:   testPct.toFixed(1),
    isEligible:    aggregate >= university.minAggregate,
    status:
      aggregate >= university.minAggregate + 15 ? "Excellent"
      : aggregate >= university.minAggregate + 5  ? "Good"
      : aggregate >= university.minAggregate       ? "Borderline"
      : "Not Eligible",
  };
}

export function getUniversityBySlug(slug) {
  return universities.find((u) => u.slug === slug);
}