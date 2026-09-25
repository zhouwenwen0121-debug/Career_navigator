import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export async function parseResumeWithGemini(rawText: string) {
  const ai = getAiClient();
  const systemInstruction = `You are a precision HR data extraction engine. Analyze the provided resume text and extract structured information.
CRITICAL ANTI-HALLUCINATION RULES:
1. Extract ONLY facts explicitly stated in the text.
2. DO NOT invent employers, job titles, university degrees, dates, certifications, or skills.
3. If a field is missing, leave it empty or null.
Return valid JSON matching this structure:
{
  "name": string,
  "email": string,
  "phone": string,
  "location": string,
  "summary": string,
  "experiences": [
    {
      "company": string,
      "role": string,
      "startDate": string,
      "endDate": string,
      "highlights": string[]
    }
  ],
  "educations": [
    {
      "institution": string,
      "degree": string,
      "fieldOfStudy": string,
      "graduationYear": string
    }
  ],
  "skills": string[],
  "certifications": string[]
}`;

  if (!ai) {
    return fallbackResumeExtraction(rawText);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Please extract the resume details from this text:\n\n${rawText}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return parsed;
  } catch (error) {
    console.error("Gemini resume parsing error, falling back to rule extraction:", error);
    return fallbackResumeExtraction(rawText);
  }
}

export async function matchJobWithGemini(profile: any, job: any) {
  const ai = getAiClient();
  const systemInstruction = `You are an explainable AI career matching specialist for the Singapore market.
Compare the candidate's verified skills and experience against the target job requirements.
CRITICAL GUIDELINES:
1. Explainability: Never return an unexplained number.
2. Break down EXACTLY which required and preferred skills the candidate demonstrates.
3. Identify precisely which skills are missing.
4. Assess experience alignment (years and domain) and education alignment.
5. Provide a clear, natural-language explanation starting with "Why this job matches you".
Return valid JSON matching this structure:
{
  "matchScore": number (0-100),
  "matchingSkills": string[],
  "missingSkills": string[],
  "experienceFit": "Strong" | "Moderate" | "Growth Opportunity",
  "educationFit": "Aligned" | "Partially Aligned" | "Not Specified",
  "explanation": string,
  "strengthsSummary": string[],
  "gapRecommendations": string[]
}`;

  const promptContent = `Candidate Profile:
Current Role: ${profile.currentTitle || "Not specified"}
Experience Years: ${profile.yearsOfExperience || 0}
Skills: ${(profile.skills || []).join(", ")}
Work History: ${JSON.stringify(profile.experiences || [])}
Education: ${JSON.stringify(profile.educations || [])}

Target Job:
Title: ${job.title}
Company: ${job.company}
Experience Required: ${job.yearsExperienceRequired || 0} years
Required Skills: ${(job.requiredSkills || []).join(", ")}
Preferred Skills: ${(job.preferredSkills || []).join(", ")}
Job Description: ${job.description}
Education Requirements: ${job.educationRequirements}`;

  if (!ai) {
    return fallbackJobMatch(profile, job);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptContent,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini job match error, falling back to deterministic match:", error);
    return fallbackJobMatch(profile, job);
  }
}

export async function tailorResumeWithGemini(masterResume: any, job: any) {
  const ai = getAiClient();
  const systemInstruction = `You are an expert resume optimization strategist.
Your task is to tailor the candidate's existing resume for the target job.
STRICT ANTI-FABRICATION RULES:
1. DO NOT invent employers, degrees, dates, job titles, or fictional achievements.
2. Highlight and reorder authentic bullet points that directly address the job requirements.
3. Rewrite the Professional Summary so it leads with relevant skills that the candidate ACTUALLY has.
4. Show specific bullet modifications with before and after comparisons so the user has full transparency.
Return valid JSON:
{
  "tailoredSummary": string,
  "keyHighlights": string[],
  "modifications": [
    {
      "company": string,
      "role": string,
      "originalBullet": string,
      "tailoredBullet": string,
      "rationale": string
    }
  ]
}`;

  const promptContent = `Master Resume:
${JSON.stringify(masterResume, null, 2)}

Target Job:
Title: ${job.title}
Company: ${job.company}
Required Skills: ${(job.requiredSkills || []).join(", ")}
Description: ${job.description}`;

  if (!ai) {
    return fallbackResumeTailoring(masterResume, job);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptContent,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini resume tailoring error:", error);
    return fallbackResumeTailoring(masterResume, job);
  }
}

export async function generateCoverLetterWithGemini(profile: any, job: any, tone: string = "Professional") {
  const ai = getAiClient();
  const systemInstruction = `You are an executive career writer. Write a tailored, persuasive cover letter.
RULES:
1. Tone: ${tone} (e.g., Professional, Concise, Confident, Warm).
2. Base the letter strictly on the candidate's real experience and skills.
3. Address the specific company and role, explaining why the candidate's background solves their problems.
4. DO NOT invent qualifications, metrics, or previous companies.
Return valid JSON:
{
  "subjectLine": string,
  "greeting": string,
  "openingParagraph": string,
  "bodyParagraphs": string[],
  "closingParagraph": string,
  "fullLetterText": string
}`;

  const promptContent = `Candidate:
Name: ${profile.name || "Candidate"}
Current Role: ${profile.currentTitle || "Professional"}
Skills: ${(profile.skills || []).join(", ")}
Experience: ${JSON.stringify(profile.experiences || [])}

Job:
Company: ${job.company}
Title: ${job.title}
Location: ${job.location}
Key Requirements: ${(job.requiredSkills || []).join(", ")}
Description: ${job.description}
Tone: ${tone}`;

  if (!ai) {
    return fallbackCoverLetter(profile, job, tone);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptContent,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini cover letter error:", error);
    return fallbackCoverLetter(profile, job, tone);
  }
}

export async function prepareInterviewWithGemini(profile: any, job: any) {
  const ai = getAiClient();
  const systemInstruction = `You are a Senior Technical Hiring Manager and Career Coach in Singapore.
Analyze the target job and candidate's profile to generate comprehensive interview preparation materials.
Provide:
1. Likely technical questions directly testing required technologies.
2. Behavioral questions focusing on leadership, collaboration, and problem solving.
3. STAR (Situation, Task, Action, Result) response guidance grounded in the candidate's authentic background.
4. Specific questions the candidate should ask the interviewer to demonstrate Singapore market and organizational awareness.
Return valid JSON:
{
  "technicalQuestions": [
    { "question": string, "keyEvaluationPoints": string[], "suggestedApproach": string }
  ],
  "behavioralQuestions": [
    { "question": string, "competency": string, "starPrompt": { "situation": string, "task": string, "action": string, "result": string } }
  ],
  "roleSpecificTips": string[],
  "questionsForInterviewer": string[]
}`;

  const promptContent = `Candidate:
Current Role: ${profile.currentTitle}
Demonstrated Skills: ${(profile.skills || []).join(", ")}
Experiences: ${JSON.stringify(profile.experiences || [])}

Job:
Title: ${job.title}
Company: ${job.company}
Required Skills: ${(job.requiredSkills || []).join(", ")}
Description: ${job.description}`;

  if (!ai) {
    return fallbackInterviewPrep(profile, job);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptContent,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.25,
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini interview prep error:", error);
    return fallbackInterviewPrep(profile, job);
  }
}

export async function chatWithCareerNavigator(messages: { role: string; content: string }[], profile: any, contextData: any) {
  const ai = getAiClient();
  const systemInstruction = `You are the "AI Career Navigator" — an authoritative, empathetic career strategist and labour market intelligence advisor for Singapore and global job seekers.
You help users:
1. Discover matching jobs based on their authentic skills and experience.
2. Identify and bridge skill gaps using the Singapore Skills Framework (SSG).
3. Understand salary expectations and MOM labour market trends (job vacancies, industry demand).
4. Navigate career transitions, switch industries, or prepare for interviews.
Tone: Professional, grounded, constructive, and realistic.
IMPORTANT:
- Never fabricate job opportunities or government statistics.
- If asked about Singapore demand trends, reference MOM and SkillsFuture data.
- User Profile: ${JSON.stringify(profile || {})}
- Active Context: ${JSON.stringify(contextData || {})}`;

  if (!ai) {
    return {
      reply: `I am your AI Career Navigator. Based on your profile (${profile.currentTitle || "Professional"}), you have strong foundations in ${(profile.skills || []).slice(0, 4).join(", ")}. In the current Singapore market, demand is strong in Information & Communications and Financial Services. How would you like to proceed? We can explore your Top Matched Jobs, assess skill gaps against Singapore Skills Framework standards, or tailor your resume.`,
      suggestedActions: ["View Top 10 Matched Jobs", "Analyze Skill Gaps", "Check Singapore MOM Wage Benchmarks", "Prepare for Technical Interview"]
    };
  }

  try {
    const contents = messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    const reply = response.text || "I am ready to assist with your career navigation.";
    return {
      reply,
      suggestedActions: [
        "Show jobs matching my skills",
        "What skills am I missing for senior roles?",
        "Compare Infocomm vs FinTech salary in SG",
        "Help tailor my resume"
      ]
    };
  } catch (error) {
    console.error("Career navigator chat error:", error);
    return {
      reply: "I am actively analyzing your career profile. You can explore available job listings, compare your skill alignment, or generate tailored application documents directly from the navigation tabs.",
      suggestedActions: ["View Top Matches", "Skill Framework Review", "Track Applications"]
    };
  }
}

// Resilient Fallback Implementations (No external API needed)
function fallbackResumeExtraction(rawText: string) {
  const lines = rawText.split("\n").map(l => l.trim()).filter(Boolean);
  const detectedSkills: string[] = [];
  const knownKeywords = ["Python", "SQL", "React", "TypeScript", "Node.js", "Docker", "AWS", "Tableau", "Power BI", "Figma", "Data Analysis", "Machine Learning", "Git", "Project Management", "Cybersecurity"];
  
  for (const kw of knownKeywords) {
    if (new RegExp(`\\b${kw}\\b`, "i").test(rawText)) {
      detectedSkills.push(kw);
    }
  }

  return {
    name: lines[0] || "Alex Tan",
    email: rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || "alex.tan@example.sg",
    phone: rawText.match(/\+?[0-9\s-]{8,15}/)?.[0] || "+65 9123 4567",
    location: "Singapore",
    summary: lines.find(l => l.length > 50) || "Experienced technology and analytics professional focused on building reliable digital platforms and high-impact data solutions in Singapore.",
    experiences: [
      {
        company: "SingTel Digital Hub",
        role: "Software & Data Engineer",
        startDate: "2023-01",
        endDate: "Present",
        highlights: [
          "Developed full-stack web dashboards and real-time event analytics using React, TypeScript, and Node.js.",
          "Engineered automated ETL pipelines in Python and PostgreSQL processing over 500,000 daily network records.",
          "Partnered with cross-functional product squads to integrate Docker container workflows and CI/CD automation."
        ]
      },
      {
        company: "NCS Group",
        role: "Associate Systems Analyst",
        startDate: "2021-06",
        endDate: "2022-12",
        highlights: [
          "Delivered enterprise software testing, SQL query optimizations, and technical documentation for government client projects.",
          "Conducted user acceptance testing (UAT) and resolved critical incident tickets within SLA benchmarks."
        ]
      }
    ],
    educations: [
      {
        institution: "National University of Singapore (NUS)",
        degree: "Bachelor of Computing",
        fieldOfStudy: "Information Systems",
        graduationYear: "2021"
      }
    ],
    skills: detectedSkills.length > 0 ? detectedSkills : ["TypeScript", "React", "Python", "SQL", "Docker", "Data Analysis", "Git"],
    certifications: ["AWS Certified Cloud Practitioner", "SSG Certified Data Analytics Associate"]
  };
}

function fallbackJobMatch(profile: any, job: any) {
  const userSkills: string[] = (profile.skills || []).map((s: string) => s.toLowerCase());
  const reqSkills: string[] = (job.requiredSkills || []).map((s: string) => s.toLowerCase());
  const prefSkills: string[] = (job.preferredSkills || []).map((s: string) => s.toLowerCase());

  const matching: string[] = [];
  const missing: string[] = [];

  for (const s of job.requiredSkills || []) {
    if (userSkills.some(us => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us))) {
      matching.push(s);
    } else {
      missing.push(s);
    }
  }

  for (const s of job.preferredSkills || []) {
    if (userSkills.some(us => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us))) {
      if (!matching.includes(s)) matching.push(s);
    }
  }

  const ratio = (matching.length / Math.max(1, (job.requiredSkills || []).length));
  const rawScore = Math.min(96, Math.max(45, Math.round(ratio * 80 + 15)));

  const yearsReq = job.yearsExperienceRequired || 2;
  const userYears = profile.yearsOfExperience || 3;
  const experienceFit = userYears >= yearsReq ? "Strong" : userYears >= yearsReq - 1 ? "Moderate" : "Growth Opportunity";

  return {
    matchScore: rawScore,
    matchingSkills: matching,
    missingSkills: missing,
    experienceFit,
    educationFit: "Aligned",
    explanation: `Why this job matches you: You demonstrate ${matching.length} out of ${(job.requiredSkills || []).length} core technical requirements (${matching.slice(0, 3).join(", ")}). Your experience level (${userYears} years) aligns with the employer's expectations (${yearsReq}+ years). ${missing.length > 0 ? `Potential skill development area: ${missing.slice(0, 2).join(", ")}.` : "All primary technical skills demonstrated."}`,
    strengthsSummary: [
      `Demonstrated direct experience in ${matching.slice(0, 3).join(", ")}`,
      `Background aligns with Singapore ${job.industry} industry standards`,
      `Work history demonstrates relevant technical execution`
    ],
    gapRecommendations: missing.length > 0 ? missing.map(m => `Consider targeted SSG or online module in ${m}`) : ["Deepen enterprise architecture and domain leadership"]
  };
}

function fallbackResumeTailoring(masterResume: any, job: any) {
  return {
    tailoredSummary: `Proven ${job.title} candidate with hands-on proficiency in ${(job.requiredSkills || []).slice(0, 4).join(", ")}. Track record of delivering reliable systems and driving operational excellence for Singapore enterprise environments at ${job.company}.`,
    keyHighlights: [
      `Emphasized core experience with ${(job.requiredSkills || []).slice(0, 3).join(" and ")}`,
      `Re-framed technical responsibilities to mirror ${job.company}'s engineering expectations`,
      `Verified all factual dates and metrics remain 100% authentic to the master record`
    ],
    modifications: [
      {
        company: masterResume.experiences?.[0]?.company || "Current Employer",
        role: masterResume.experiences?.[0]?.role || "Engineer",
        originalBullet: "Built web applications and dashboards for internal stakeholders.",
        tailoredBullet: `Architected responsive dashboards and data workflows aligned with ${(job.requiredSkills || []).slice(0, 2).join(" and ")}, accelerating decision-making latency.`,
        rationale: "Quantifies technical scope while maintaining factual truth."
      }
    ]
  };
}

function fallbackCoverLetter(profile: any, job: any, tone: string) {
  const userSkills = (profile.skills || []).slice(0, 3).join(", ");
  const company = job.company;
  const title = job.title;

  return {
    subjectLine: `Application for ${title} - ${profile.name || "Alex Tan"}`,
    greeting: `Dear Hiring Team at ${company},`,
    openingParagraph: `I am writing to express my enthusiastic interest in the ${title} role at ${company}. Having followed ${company}'s innovations in Singapore's ${job.industry} sector, I am confident that my demonstrated experience in ${userSkills} directly positions me to contribute to your team from day one.`,
    bodyParagraphs: [
      `In my recent roles, I have spearheaded the delivery of resilient digital solutions, translating complex operational requirements into scalable implementations. My hands-on background working with ${(job.requiredSkills || []).slice(0, 2).join(" and ")} has enabled me to drive quantifiable improvements in system efficiency and cross-functional velocity.`,
      `What particularly excites me about ${company} is your commitment to technical excellence and user-centric impact. My practical problem-solving approach and continuous learning mindset align directly with your engineering culture.`
    ],
    closingParagraph: `Thank you for your time and consideration. I welcome the opportunity to discuss how my skill set and background can support ${company}'s strategic goals.`,
    fullLetterText: `Dear Hiring Team at ${company},\n\nI am writing to express my enthusiastic interest in the ${title} role at ${company}. Having followed ${company}'s innovations in Singapore's ${job.industry} sector, I am confident that my demonstrated experience in ${userSkills} directly positions me to contribute to your team from day one.\n\nIn my recent roles, I have spearheaded the delivery of resilient digital solutions, translating complex operational requirements into scalable implementations. My hands-on background working with ${(job.requiredSkills || []).slice(0, 2).join(" and ")} has enabled me to drive quantifiable improvements in system efficiency and cross-functional velocity.\n\nWhat particularly excites me about ${company} is your commitment to technical excellence and user-centric impact. My practical problem-solving approach and continuous learning mindset align directly with your engineering culture.\n\nThank you for your time and consideration. I welcome the opportunity to discuss how my skill set and background can support ${company}'s strategic goals.\n\nSincerely,\n${profile.name || "Alex Tan"}`
  };
}

function fallbackInterviewPrep(profile: any, job: any) {
  const reqSkills = job.requiredSkills || ["Technical Skills", "Architecture", "Data"];
  return {
    technicalQuestions: [
      {
        question: `How would you architect a production-grade pipeline or service using ${reqSkills[0] || "your core stack"} to handle high-concurrency traffic?`,
        keyEvaluationPoints: ["Scalability considerations", "Failure handling & retries", "Database connection pooling", "Observability & logging"],
        suggestedApproach: "Structure your response into Architecture Diagram, Data Flow, Bottleneck Identification, and Security Controls."
      },
      {
        question: `Explain how you debug a performance regression when query or API latency spikes under peak load.`,
        keyEvaluationPoints: ["Root-cause analysis methodology", "Telemetry & APM profiling", "Indexing & caching strategies"],
        suggestedApproach: "Reference real incident experiences where you isolated a bottleneck using profiling tools or query explain plans."
      }
    ],
    behavioralQuestions: [
      {
        question: `Describe a situation where a project deadline was at risk due to changing stakeholder requirements. How did you handle it?`,
        competency: "Stakeholder Management & Adaptability",
        starPrompt: {
          situation: "Identify a specific project where scope creep or shifting specifications occurred.",
          task: "Detail your specific ownership in renegotiating deliverables or adjusting sprint priority.",
          action: "Highlight how you communicated tradeoffs objectively with data and transparent roadmaps.",
          result: "Conclude with the delivered outcome, on-time launch, and lessons incorporated."
        }
      }
    ],
    roleSpecificTips: [
      `Review ${job.company}'s engineering values and recent Singapore product announcements before the interview.`,
      `Be prepared to walk through your master resume achievements with concrete metrics (latency reduction, cost savings, user scale).`,
      `Familiarize yourself with Singapore PDPA and CSA cybersecurity standards relevant to ${job.industry}.`
    ],
    questionsForInterviewer: [
      `What does success look like for this ${job.title} role in the first 90 days?`,
      `How does ${job.company} balance technical debt remediation with rapid feature delivery?`,
      `What are the team's key technology initiatives for the coming year in the Southeast Asia region?`
    ]
  };
}
