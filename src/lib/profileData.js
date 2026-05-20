// Profile and eligibility context — pre-loaded with all known information
// This can be updated by the user in the app settings

export const DEFAULT_PROFILE = {
  name: "Edinburgh Graduate",
  nationality: ["British", "Irish"],
  location: "New York City",
  targetCity: "New York City",
  targetMSA: "NYC Metro",
  degreeLevel: "MA Honours",
  degreeField: "Politics",
  university: "University of Edinburgh",
  graduationDate: "July 2026",
  targetStartDate: "October 2026",
  previousStudy: "Psychology (Years 1–2, University of Edinburgh)",
  experienceYears: 0,
  targetSalaryMin: 35000,
  visaRoutes: ["J-1", "E-2"],
  interests: [
    "Policy & Research",
    "Journalism & Editorial",
    "Humanitarian & Development",
    "Communications & PR",
    "Nonprofit & NGO",
    "International Affairs",
    "Behavioural Insights",
    "Human Rights",
    "Universities & Research Institutes",
    "UK/Irish-Owned Firms"
  ],
  skills: [
    "Policy analysis", "Research", "Writing", "Communications",
    "Stakeholder engagement", "International affairs", "Advocacy",
    "Editorial work", "Grants research", "Program coordination",
    "Behavioural research", "Social research", "Public affairs"
  ]
};

export const ELIGIBLE_ROLE_TITLES = [
  "Research Fellow", "Editorial Fellow", "Communications Fellow",
  "Program Assistant", "Policy Assistant", "Development Assistant",
  "External Relations Assistant", "Advocacy Fellow", "Program Intern",
  "Research Intern", "Journalism Fellow", "Editorial Assistant",
  "Grants Assistant", "Research Assistant", "Policy Associate",
  "Communications Associate", "Program Coordinator", "Project Coordinator",
  "Public Affairs Assistant", "Partnerships Associate", "Program Fellow",
  "Research Analyst", "Policy Analyst", "Junior Research Fellow",
  "Graduate Research Assistant", "Teaching Assistant", "Program Officer",
  "Communications Coordinator", "Development Associate", "Advocacy Coordinator",
  "International Programs Coordinator", "Graduate Fellow", "Staff Writer",
  "Content Associate", "Social Impact Analyst", "ESG Analyst",
  "Behavioural Insights Analyst", "Country Risk Analyst", "Junior Analyst",
  "Political Risk Analyst", "Due Diligence Analyst", "Social Research Assistant"
];

export const DEGREE_ALIGNED_FIELDS = [
  "policy", "research", "politics", "international affairs", "communications",
  "journalism", "editorial", "humanitarian", "development", "nonprofit",
  "advocacy", "public affairs", "human rights", "social research",
  "behavioural", "behavioral", "psychology", "social science",
  "program coordination", "grants", "stakeholder", "foreign policy",
  "global affairs", "governance", "diplomacy", "democracy", "civic",
  "immigration", "refugee", "ESG", "sustainability policy", "health policy",
  "education policy", "urban policy", "economic development", "philanthropy",
  "think tank", "media", "publishing", "broadcasting", "content"
];

export const UK_IRISH_COMPANIES = [
  // Media & Publishing
  { name: "Reuters", hq: "London", sector: "Media", nyc: true, e2status: "confirmed" },
  { name: "The Economist Group", hq: "London", sector: "Media", nyc: true, e2status: "confirmed" },
  { name: "Financial Times", hq: "London", sector: "Media", nyc: true, e2status: "confirmed" },
  { name: "The Guardian US", hq: "London", sector: "Media", nyc: true, e2status: "confirmed" },
  { name: "BBC Studios Americas", hq: "London", sector: "Media", nyc: true, e2status: "confirmed" },
  { name: "Pearson", hq: "London", sector: "Education/Publishing", nyc: true, e2status: "confirmed" },
  { name: "Informa", hq: "London", sector: "Publishing/Events", nyc: true, e2status: "confirmed" },
  { name: "RELX Group", hq: "London", sector: "Publishing/Data", nyc: true, e2status: "confirmed" },
  { name: "Springer Nature", hq: "London", sector: "Publishing", nyc: true, e2status: "confirmed" },
  { name: "Bloomsbury Publishing", hq: "London", sector: "Publishing", nyc: true, e2status: "confirmed" },
  { name: "Macmillan Publishers", hq: "London", sector: "Publishing", nyc: true, e2status: "confirmed" },
  // Public Affairs & PR
  { name: "Brunswick Group", hq: "London", sector: "Public Affairs", nyc: true, e2status: "confirmed" },
  { name: "Finsbury Glover Hering", hq: "London", sector: "Communications", nyc: true, e2status: "confirmed" },
  { name: "Portland Communications", hq: "London", sector: "Public Affairs", nyc: true, e2status: "confirmed" },
  { name: "FTI Consulting", hq: "London", sector: "Consulting/Comms", nyc: true, e2status: "confirmed" },
  { name: "Teneo", hq: "Dublin", sector: "Advisory/Comms", nyc: true, e2status: "confirmed" },
  { name: "Cicero Group", hq: "London", sector: "Public Affairs", nyc: false, e2status: "possible" },
  { name: "Hanover Communications", hq: "London", sector: "Public Affairs", nyc: false, e2status: "possible" },
  { name: "WPP", hq: "London", sector: "Advertising/Comms", nyc: true, e2status: "confirmed" },
  { name: "Burson (WPP)", hq: "London", sector: "PR", nyc: true, e2status: "confirmed" },
  { name: "Hill+Knowlton (WPP)", hq: "London", sector: "PR", nyc: true, e2status: "confirmed" },
  // Political Risk & Intelligence
  { name: "Control Risks", hq: "London", sector: "Political Risk", nyc: true, e2status: "confirmed" },
  { name: "Oxford Analytica", hq: "Oxford", sector: "Political Risk", nyc: false, e2status: "confirmed" },
  { name: "Economist Intelligence Unit", hq: "London", sector: "Research/Intelligence", nyc: true, e2status: "confirmed" },
  { name: "Kroll", hq: "London/NYC", sector: "Risk/Intelligence", nyc: true, e2status: "confirmed" },
  { name: "Hakluyt & Company", hq: "London", sector: "Intelligence", nyc: true, e2status: "confirmed" },
  { name: "S-RM", hq: "London", sector: "Intelligence", nyc: true, e2status: "confirmed" },
  { name: "Verisk Maplecroft", hq: "UK", sector: "Risk Analytics", nyc: false, e2status: "possible" },
  { name: "Sibylline", hq: "London", sector: "Intelligence", nyc: false, e2status: "possible" },
  // Consulting (direct UK/Irish entities only)
  { name: "Accenture", hq: "Dublin", sector: "Consulting/Tech", nyc: true, e2status: "confirmed" },
  { name: "CRH", hq: "Dublin", sector: "Materials/Infrastructure", nyc: true, e2status: "confirmed" },
  // Finance
  { name: "HSBC", hq: "London", sector: "Banking", nyc: true, e2status: "confirmed" },
  { name: "Barclays", hq: "London", sector: "Banking", nyc: true, e2status: "confirmed" },
  { name: "Standard Chartered", hq: "London", sector: "Banking", nyc: true, e2status: "confirmed" },
  { name: "NatWest", hq: "Edinburgh", sector: "Banking", nyc: true, e2status: "confirmed" },
  { name: "Schroders", hq: "London", sector: "Asset Management", nyc: true, e2status: "confirmed" },
  { name: "Man Group", hq: "London", sector: "Investment", nyc: true, e2status: "confirmed" },
  { name: "abrdn", hq: "Edinburgh", sector: "Asset Management", nyc: true, e2status: "confirmed" },
  { name: "AIB", hq: "Dublin", sector: "Banking", nyc: true, e2status: "possible" },
  // Research & Data
  { name: "YouGov", hq: "London", sector: "Research/Data", nyc: true, e2status: "confirmed" },
  { name: "Ipsos", hq: "London", sector: "Research", nyc: true, e2status: "confirmed" },
  { name: "Kantar", hq: "London", sector: "Data/Research", nyc: true, e2status: "confirmed" },
  { name: "Mintel", hq: "London", sector: "Market Research", nyc: true, e2status: "confirmed" },
  { name: "Wood Mackenzie", hq: "Edinburgh", sector: "Energy Research", nyc: false, e2status: "confirmed" },
  { name: "Verisk Analytics", hq: "Jersey City NJ", sector: "Data Analytics", nyc: true, e2status: "possible" },
  // Education & Exchange
  { name: "British Council USA", hq: "London", sector: "Cultural/Education", nyc: true, e2status: "confirmed" },
  { name: "Cambridge University Press", hq: "Cambridge", sector: "Publishing/Education", nyc: true, e2status: "confirmed" },
  { name: "Oxford University Press", hq: "Oxford", sector: "Publishing/Education", nyc: true, e2status: "confirmed" },
  { name: "EF Education First", hq: "London/Lucerne", sector: "Education", nyc: true, e2status: "confirmed" },
  { name: "INTO University Partnerships", hq: "Brighton", sector: "Education", nyc: false, e2status: "possible" },
  { name: "Navitas", hq: "London", sector: "Education", nyc: false, e2status: "possible" },
  { name: "Study Group", hq: "Brighton", sector: "Education", nyc: false, e2status: "possible" },
  // Behavioural Insights & Policy
  { name: "Behavioural Insights Team", hq: "London", sector: "Policy/Research", nyc: true, e2status: "confirmed" },
  { name: "Nesta", hq: "London", sector: "Innovation/Policy", nyc: false, e2status: "possible" },
  { name: "Social Finance", hq: "London", sector: "Social Impact", nyc: false, e2status: "possible" },
  // Charities & NGOs
  { name: "Oxfam America", hq: "Oxford origin", sector: "Humanitarian", nyc: true, e2status: "possible" },
  { name: "Save the Children US", hq: "London origin", sector: "Humanitarian", nyc: true, e2status: "possible" },
  { name: "Wellcome Trust Americas", hq: "London", sector: "Health/Research", nyc: true, e2status: "confirmed" },
  { name: "Concern Worldwide US", hq: "Dublin", sector: "Humanitarian", nyc: true, e2status: "confirmed" },
  { name: "Goal USA", hq: "Dublin", sector: "Humanitarian", nyc: true, e2status: "possible" },
  // Legal (for policy/comms roles)
  { name: "Linklaters", hq: "London", sector: "Legal", nyc: true, e2status: "confirmed" },
  { name: "Freshfields", hq: "London", sector: "Legal", nyc: true, e2status: "confirmed" },
  { name: "Allen & Overy", hq: "London", sector: "Legal", nyc: true, e2status: "confirmed" },
  { name: "Clifford Chance", hq: "London", sector: "Legal", nyc: true, e2status: "confirmed" },
  { name: "Hogan Lovells", hq: "London/DC", sector: "Legal", nyc: true, e2status: "confirmed" },
  { name: "Norton Rose Fulbright", hq: "London", sector: "Legal", nyc: true, e2status: "confirmed" },
  { name: "DLA Piper", hq: "London/Chicago", sector: "Legal", nyc: true, e2status: "confirmed" },
  // Tech & Data
  { name: "FDM Group", hq: "London", sector: "Tech/Graduate", nyc: true, e2status: "confirmed" },
  { name: "Endava", hq: "London", sector: "Tech", nyc: true, e2status: "confirmed" },
  { name: "Experian", hq: "Dublin", sector: "Data", nyc: true, e2status: "confirmed" },
  { name: "Flutter/FanDuel", hq: "Dublin", sector: "Tech", nyc: true, e2status: "confirmed" },
  // Energy
  { name: "BP America", hq: "London", sector: "Energy", nyc: true, e2status: "confirmed" },
  { name: "Shell USA", hq: "London/Hague", sector: "Energy", nyc: true, e2status: "confirmed" },
  { name: "National Grid USA", hq: "London", sector: "Energy/Utilities", nyc: true, e2status: "confirmed" },
  // Pharma/Health (comms/policy)
  { name: "AstraZeneca", hq: "Cambridge UK", sector: "Pharma", nyc: false, e2status: "possible" },
  { name: "GSK", hq: "London", sector: "Pharma", nyc: true, e2status: "confirmed" },
];

export const TARGET_ORGS = [
  // International Affairs / Policy / Nonprofit
  "Council on Foreign Relations", "International Rescue Committee", "Human Rights Watch",
  "Committee to Protect Journalists", "International Peace Institute", "Asia Society Policy Institute",
  "Social Science Research Council", "Brennan Center for Justice", "Women's Refugee Commission",
  "Physicians for Human Rights", "Global Centre for the Responsibility to Protect",
  "International Center for Transitional Justice", "Center for Civilians in Conflict",
  "OutRight International", "International Refugee Assistance Project",
  // Think Tanks
  "Carnegie Endowment for International Peace", "Brookings Institution", "Stimson Center",
  "Center for Strategic and International Studies", "New America Foundation", "Urban Institute",
  "Demos", "Century Foundation", "Roosevelt Institute", "Vera Institute of Justice",
  "Citizens Budget Commission", "Community Service Society", "Center for Migration Studies",
  // Foundations
  "Ford Foundation", "Open Society Foundations", "Rockefeller Foundation",
  "Carnegie Corporation of New York", "MacArthur Foundation", "Russell Sage Foundation",
  "New York Community Trust", "Bloomberg Philanthropies", "Robin Hood Foundation",
  // Humanitarian / Refugee / Immigration
  "HIAS", "Safe Horizon", "African Communities Together", "Make the Road New York",
  "New York Immigration Coalition", "Catholic Charities NY", "Upwardly Global",
  "Church World Service", "IRC New York",
  // Human Rights
  "Amnesty International USA", "ACLU", "Center for Constitutional Rights",
  "Freedom House", "Article 19", "Reporters Without Borders", "PEN America",
  "Global Witness", "Witness",
  // Journalism / Editorial / Media
  "Associated Press", "Bloomberg", "The New York Times", "ProPublica", "Semafor",
  "Devex", "PassBlue", "Just Security", "World Politics Review", "The Nation",
  "The New Republic", "The Intercept", "Rest of World", "The Marshall Project",
  "Type Investigations", "The City NY", "Columbia Journalism Review",
  // Universities & Research
  "Columbia SIPA", "Columbia Earth Institute", "NYU Wagner", "NYU Center for Global Affairs",
  "The New School", "CUNY Graduate Center", "Cornell Tech", "Fordham University",
  "New York University", "Columbia University",
  // Behavioural / Social Research
  "Behavioural Insights Team", "Innovations for Poverty Action", "ideas42",
  // Sustainability / Climate
  "Natural Resources Defense Council", "Environmental Defense Fund",
  "World Resources Institute", "C40 Cities", "ClimateWorks",
  // Cultural / Exchange
  "Institute of International Education", "Americas Society", "Asia Society",
  "English-Speaking Union", "American Council on Germany",
];

export const JOB_BOARDS = [
  { name: "Idealist", url: "idealist.org", focus: "Nonprofit/NGO" },
  { name: "ReliefWeb", url: "reliefweb.int", focus: "Humanitarian" },
  { name: "Devex", url: "devex.com", focus: "Development/International" },
  { name: "Impactpool", url: "impactpool.org", focus: "International Orgs" },
  { name: "GlobalJobs", url: "globaljobs.org", focus: "International Affairs" },
  { name: "Idealist", url: "idealist.org", focus: "Nonprofit" },
  { name: "LinkedIn", url: "linkedin.com", focus: "General" },
  { name: "Indeed", url: "indeed.com", focus: "General" },
];
