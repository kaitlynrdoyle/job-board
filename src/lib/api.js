// Calls /api/anthropic (our Vercel serverless proxy) instead of Anthropic directly
// This avoids CORS issues with browser-to-Anthropic requests

async function callAnthropic(body) {
  const response = await fetch('/api/anthropic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || err.error || `Request failed: ${response.status}`);
  }

  return response.json();
}

export async function searchJobs({ profile, tags, resumeText, cvText, searchMode = "broad" }) {
  const ukIrishCompanies = [
    "Reuters", "The Economist Group", "Financial Times", "The Guardian", "BBC Studios",
    "Pearson", "Brunswick Group", "Finsbury Glover Hering", "Portland Communications",
    "FTI Consulting", "Teneo", "Control Risks", "Oxford Analytica", "Kroll",
    "Hakluyt", "S-RM", "YouGov", "Ipsos", "Kantar", "Mintel", "British Council",
    "Behavioural Insights Team", "Wellcome Trust", "Concern Worldwide", "WPP",
    "Burson", "HSBC", "Barclays", "Schroders", "Man Group", "abrdn",
    "Cambridge University Press", "Oxford University Press", "EF Education First",
    "Accenture", "FDM Group", "Endava", "Experian", "National Grid", "GSK",
    "Bloomsbury", "RELX", "Springer Nature", "Informa", "Economist Intelligence Unit"
  ];

  const systemPrompt = `You are a specialist job search assistant helping a specific candidate find suitable roles. Your task is to use web search to find REAL, CURRENTLY POSTED job listings that match the candidate's profile and eligibility criteria.

CANDIDATE PROFILE:
- UK/Irish citizen, dual British and Irish nationality
- Education: MA Honours Politics, University of Edinburgh (graduating July 2026). Previously studied Psychology (Years 1-2) at same university before switching to Politics.
- Target start: October 2026
- Target location: New York City (NYC Metro area)
- Visa situation: ONLY eligible for J-1 Intern visa OR E-2 treaty employee visa
- Experience level: Entry level / early career (0-3 years)
- Minimum salary: $35,000/year annualised (exception: funded postgraduate study with stipend + tuition coverage)

ELIGIBILITY RULES — every result MUST pass ALL of these:
1. Located in NYC or NYC metro, OR explicitly remote/hybrid based in NYC
2. Paid at or above $35,000/year (or funded study exception)
3. Entry level: requires 0-3 years experience maximum
4. Degree-compatible: core skill involves any of: research, writing, policy analysis, communications, international affairs, advocacy, journalism, editorial, program coordination, development/fundraising, stakeholder engagement, public affairs, human rights, social research, behavioural insights, grants, external relations, ESG, media, publishing, education policy, urban policy, health policy, immigration, humanitarian work, psychology-adjacent roles, behavioural research, social impact, nonprofit management
5. MUST be eligible via at least one route:
   - J-1 INTERN: role appears structured as fellowship/internship/training placement, fixed term (up to 12 months), employer has HR capacity, NO "must be authorized to work without sponsorship" language
   - E-2 TREATY: employer is UK or Irish-owned (known list: ${ukIrishCompanies.join(", ")})

J-1 VIABILITY SCORING:
- HIGH: explicitly a fellowship/internship, fixed term, nonprofit/think tank/university employer, field matches degree
- MEDIUM: assistant/coordinator role at large org, could be structured as training placement, no explicit sponsorship exclusion
- LOW: permanent staff role language, "authorized to work" required, very small org unlikely to have HR
- UNCLEAR: insufficient info to determine

E-2 STATUS:
- CONFIRMED: employer is on the known UK/Irish company list
- POSSIBLE: employer appears UK/Irish-owned but unconfirmed
- UNLIKELY: US-independent entity despite brand association

${resumeText ? `CANDIDATE RESUME:\n${resumeText}\n` : ""}
${cvText ? `CANDIDATE CV:\n${cvText}\n` : ""}
${tags && tags.length > 0 ? `USER PRIORITY TAGS: ${tags.join(", ")}. Surface these prominently but do NOT exclude eligible roles outside these tags.` : ""}

SEARCH INSTRUCTIONS:
Search these sources for REAL currently posted roles:
- idealist.org for nonprofit/NGO roles
- reliefweb.int for humanitarian roles  
- devex.com for international development roles
- LinkedIn and Indeed for general roles
- Direct org career pages for think tanks, foundations, universities
- UK/Irish company career pages for E-2 roles

Use search queries like:
- "policy fellow New York 2025 2026"
- "research assistant NYC nonprofit entry level"
- "editorial fellow New York international"
- "communications fellow NYC"
- "program assistant humanitarian New York"
- "J-1 intern New York policy"
- "graduate programme NYC" UK OR Irish company
- site:idealist.org "New York" fellow OR assistant policy
- site:reliefweb.int "New York" internship OR fellowship

Return 15-25 real results. If you cannot verify a listing is still active, include it but note that.

CRITICAL: Respond with ONLY a valid JSON array. No markdown fences, no preamble, no explanation. Just the raw JSON array starting with [ and ending with ].

JSON format:
[
  {
    "title": "Job title",
    "organization": "Organisation name",
    "location": "NYC / Remote / Hybrid",
    "salary": "Salary range or null",
    "term": "Fixed term duration or Permanent or null",
    "url": "Direct URL to listing or careers page",
    "description": "2-3 sentence description",
    "fitScore": 85,
    "fitReason": "Why this matches the candidate",
    "j1Viability": "HIGH or MEDIUM or LOW or UNCLEAR",
    "j1Reason": "Plain English J-1 explanation",
    "e2Eligible": "CONFIRMED or POSSIBLE or UNLIKELY or NO",
    "e2Reason": "Plain English E-2 explanation",
    "visaRoute": "J-1 or E-2 or BOTH or UNCLEAR",
    "sector": "Sector name",
    "tags": ["tag1", "tag2"],
    "priorityMatch": true,
    "salaryException": false,
    "source": "Where found"
  }
]`;

  const userMessage = searchMode === "targeted" && tags?.length > 0
    ? `Search for currently posted NYC jobs. PRIORITISE roles in: ${tags.join(", ")}. Also include other eligible roles. Return 15-25 results as a JSON array only.`
    : `Search broadly for currently posted NYC jobs matching the candidate profile across all eligible sectors. Return 15-25 results as a JSON array only.`;

  const data = await callAnthropic({
    model: "claude-sonnet-4-5",
    max_tokens: 16000,
    thinking: {
      type: "enabled",
      budget_tokens: 10000
    },
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search"
      }
    ],
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }]
  });

  // Extract text blocks — find the last text block
  const textBlocks = data.content.filter(b => b.type === "text");
  if (!textBlocks.length) throw new Error("No text in API response — search may have failed");

  const rawText = textBlocks[textBlocks.length - 1].text;

  // Strip markdown fences if present
  const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  // Find the JSON array
  const jsonStart = cleaned.indexOf("[");
  const jsonEnd = cleaned.lastIndexOf("]");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Could not find job results in response. Please try again.");
  }

  const jsonStr = cleaned.slice(jsonStart, jsonEnd + 1);
  const results = JSON.parse(jsonStr);
  return results;
}

export async function generateOutreachDraft({ job, profile, resumeText, type }) {
  const template = type === "e2"
    ? `Write a concise E-2 employer outreach email. Mention UK/Irish dual citizenship, interest in transatlantic work, and relevant skills. Under 200 words. Include subject line.`
    : `Write a concise J-1 host outreach email. Mention recent Edinburgh graduation (July 2026), J-1 intern eligibility, that the host wouldn't need to run an H-1B process, and willingness to arrange sponsorship through a designated sponsor. Under 200 words. Include subject line.`;

  const data = await callAnthropic({
    model: "claude-sonnet-4-5",
    max_tokens: 1000,
    system: "You help a UK/Irish Edinburgh Politics graduate draft personalised outreach emails. Professional but warm tone. Specific to the organisation. Concise.",
    messages: [{
      role: "user",
      content: `Draft a ${type === "e2" ? "E-2 employer" : "J-1 host"} outreach email for:
Role: ${job.title} at ${job.organization}
Description: ${job.description}
${template}
Candidate: MA Honours Politics, University of Edinburgh (graduating July 2026), previously studied Psychology. Skills: policy analysis, research, writing, communications, international affairs.
${resumeText ? `Resume context: ${resumeText.slice(0, 400)}` : ""}
Return subject line then email body as plain text only.`
    }]
  });

  return data.content[0]?.text || "";
}

export async function analyzeDocument(text, type) {
  const data = await callAnthropic({
    model: "claude-sonnet-4-5",
    max_tokens: 800,
    messages: [{
      role: "user",
      content: `Extract key info from this ${type} as JSON with fields: name, education (array), experience (array of {role, org, duration}), skills (array), highlights (array). Return only valid JSON, no markdown. ${type}:\n\n${text.slice(0, 3000)}`
    }]
  });

  const raw = data.content[0]?.text || "{}";
  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return {};
  }
}
