const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

export async function searchJobs({ profile, tags, resumeText, cvText, searchMode = "broad" }) {
  const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
  
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
- Name context: UK/Irish citizen, dual British and Irish nationality
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
4. Degree-compatible: core skill involves any of: research, writing, policy analysis, communications, international affairs, advocacy, journalism, editorial, program coordination, development/fundraising, stakeholder engagement, public affairs, human rights, social research, behavioural insights, grants, external relations, ESG, media, publishing, education policy, urban policy, health policy, immigration, humanitarian work
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
- UNLIKELY: US-independent entity despite brand association (e.g. KPMG US, Deloitte US)

${resumeText ? `CANDIDATE RESUME:\n${resumeText}\n` : ""}
${cvText ? `CANDIDATE CV:\n${cvText}\n` : ""}

${tags && tags.length > 0 ? `USER'S PRIORITY INTEREST TAGS: ${tags.join(", ")}. Surface these prominently but DO NOT exclude eligible roles outside these tags.` : ""}

SEARCH INSTRUCTIONS:
1. Use web search to find REAL currently posted job listings. Search multiple sources: LinkedIn, Indeed, Idealist, ReliefWeb, Devex, Impactpool, GlobalJobs, organization career pages, Greenhouse/Lever/Ashby job boards.
2. Search queries to use:
   - "policy fellow New York 2025 2026"
   - "research assistant NYC nonprofit entry level"  
   - "editorial fellow New York international affairs"
   - "communications fellow NYC nonprofit"
   - "program assistant humanitarian New York"
   - "advocacy fellow NYC human rights"
   - "J-1 intern New York policy research"
   - site:idealist.org "New York" "fellow" OR "assistant" policy
   - site:reliefweb.int "New York" internship OR fellowship
   - UK Irish company NYC entry level policy communications research
   - "graduate programme" NYC UK company 2026
3. Return 15-25 real, currently posted results where possible.
4. If a listing is no longer active or you cannot verify it, note that but still include it.

RESPONSE FORMAT — respond with ONLY a valid JSON array, no markdown, no preamble:
[
  {
    "title": "Job title",
    "organization": "Organisation name",
    "location": "NYC / Remote / Hybrid",
    "salary": "Salary range or null if not listed",
    "term": "Fixed term duration or Permanent",
    "url": "Direct URL to listing or careers page",
    "description": "2-3 sentence description of the role",
    "fitScore": 85,
    "fitReason": "Why this matches the candidate profile",
    "j1Viability": "HIGH|MEDIUM|LOW|UNCLEAR",
    "j1Reason": "Plain English explanation of J-1 viability",
    "e2Eligible": "CONFIRMED|POSSIBLE|UNLIKELY|NO",
    "e2Reason": "Plain English explanation of E-2 eligibility",
    "visaRoute": "J-1|E-2|BOTH|UNCLEAR",
    "sector": "Sector/industry",
    "tags": ["relevant", "interest", "tags"],
    "priorityMatch": true,
    "salaryException": false,
    "source": "Where this listing was found"
  }
]`;

  const userMessage = searchMode === "targeted" && tags?.length > 0
    ? `Search for currently posted NYC jobs matching the candidate profile. PRIORITISE roles in these sectors/areas: ${tags.join(", ")}. But also include any other eligible roles you find. Return 15-25 real results as a JSON array.`
    : `Search broadly for currently posted NYC jobs matching the candidate profile across all eligible sectors. Return 15-25 real results as a JSON array.`;

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "interleaved-thinking-2025-05-14"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
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
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "API request failed");
  }

  const data = await response.json();
  
  // Extract text from response — find the last text block
  const textBlocks = data.content.filter(b => b.type === "text");
  if (!textBlocks.length) throw new Error("No text response from API");
  
  const rawText = textBlocks[textBlocks.length - 1].text;
  
  // Parse JSON — strip any markdown fences
  const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  
  // Find JSON array in response
  const jsonStart = cleaned.indexOf("[");
  const jsonEnd = cleaned.lastIndexOf("]");
  if (jsonStart === -1 || jsonEnd === -1) throw new Error("No valid JSON array in response");
  
  const jsonStr = cleaned.slice(jsonStart, jsonEnd + 1);
  return JSON.parse(jsonStr);
}

export async function generateOutreachDraft({ job, profile, resumeText, type }) {
  const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
  
  const systemPrompt = `You are helping a UK/Irish Edinburgh Politics graduate draft personalised outreach messages for job applications. Write in a professional but warm tone. Be specific to the organisation and role. Keep it concise — under 200 words for the body.`;

  const template = type === "e2" 
    ? `E-2 employer outreach: mention UK/Irish citizenship, interest in transatlantic work, and relevant skills.`
    : `J-1 host outreach: mention recent Edinburgh graduation, J-1 intern eligibility, that the host organisation wouldn't need to run an H-1B process, and willingness to arrange sponsorship through a designated sponsor.`;

  const userMessage = `Draft a ${type === "e2" ? "E-2 employer" : "J-1 host"} outreach email for this role:

Role: ${job.title} at ${job.organization}
Description: ${job.description}

${template}

Candidate background: MA Honours Politics from University of Edinburgh (graduating July 2026), previously studied Psychology. Skills: policy analysis, research, writing, communications, international affairs.
${resumeText ? `Additional context from resume: ${resumeText.slice(0, 500)}` : ""}

Return: subject line, then email body. No JSON needed, just plain text.`;

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }]
    })
  });

  const data = await response.json();
  return data.content[0]?.text || "";
}

export async function analyzeDocument(text, type) {
  const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
  
  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Extract key information from this ${type} as JSON with fields: name, education (array), experience (array of {role, org, duration}), skills (array), languages (array), highlights (array of notable points). ${type} text:\n\n${text.slice(0, 3000)}`
      }]
    })
  });

  const data = await response.json();
  const raw = data.content[0]?.text || "{}";
  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {};
  }
}
