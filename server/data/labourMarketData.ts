export interface IndustryTrend {
  id: string;
  industry: string;
  jobDemandIndex: number; // 100 = baseline 2023
  jobDemandTrend: 'Rapid Growth' | 'Moderate Growth' | 'Stable' | 'Softening';
  demandGrowthYoY: number; // e.g. +8.4%
  medianSalarySGD: number;
  p25SalarySGD: number;
  p75SalarySGD: number;
  vacancyRatio: number; // job vacancies per unemployed person
  topInDemandRoles: string[];
  emergingSkills: string[];
  coreCompetencies: string[];
  quarterlyTrends: { quarter: string; demandIndex: number; vacancies: number }[];
  sourceCitation: string;
  sourceDate: string;
  geography: string;
}

export interface LabourMarketOverview {
  overallUnemploymentRate: number; // %
  residentUnemploymentRate: number; // %
  overallVacancyRatio: number;
  totalJobVacancies: number;
  retrenchmentPerThousand: number;
  surveyPeriod: string;
  reportingAuthority: string;
  industries: IndustryTrend[];
  emergingOccupations2026: {
    title: string;
    industry: string;
    growthProjection: string;
    criticalSkills: string[];
    skillsFrameworkRef: string;
  }[];
}

export const SINGAPORE_LABOUR_MARKET: LabourMarketOverview = {
  overallUnemploymentRate: 2.0,
  residentUnemploymentRate: 2.8,
  overallVacancyRatio: 1.28,
  totalJobVacancies: 79800,
  retrenchmentPerThousand: 1.3,
  surveyPeriod: "Q1-Q2 2026 (Released August 2026)",
  reportingAuthority: "Ministry of Manpower (MOM) Singapore & SkillsFuture Singapore (SSG)",
  industries: [
    {
      id: "ind-infocomm",
      industry: "Information & Communications",
      jobDemandIndex: 142.5,
      jobDemandTrend: "Rapid Growth",
      demandGrowthYoY: 11.2,
      medianSalarySGD: 7800,
      p25SalarySGD: 5200,
      p75SalarySGD: 12500,
      vacancyRatio: 1.65,
      topInDemandRoles: [
        "AI / Machine Learning Engineer",
        "Cloud & DevOps Architect",
        "Cybersecurity Specialist",
        "Full Stack Developer",
        "Data Engineer / Analytics Specialist"
      ],
      emergingSkills: [
        "GenAI / LLM Orchestration",
        "Cloud Cost Optimization (FinOps)",
        "Zero Trust Architecture",
        "Agentic AI Workflow Design",
        "Rust & WebAssembly"
      ],
      coreCompetencies: ["Software Architecture", "Data Modeling", "Agile Product Delivery", "System Security"],
      quarterlyTrends: [
        { quarter: "2025 Q1", demandIndex: 122.0, vacancies: 9800 },
        { quarter: "2025 Q2", demandIndex: 126.8, vacancies: 10400 },
        { quarter: "2025 Q3", demandIndex: 131.5, vacancies: 11100 },
        { quarter: "2025 Q4", demandIndex: 136.2, vacancies: 11900 },
        { quarter: "2026 Q1", demandIndex: 139.8, vacancies: 12400 },
        { quarter: "2026 Q2", demandIndex: 142.5, vacancies: 12900 }
      ],
      sourceCitation: "MOM Labour Market Report Q2 2026 (Table 4B: Employment Changes & Vacancies)",
      sourceDate: "August 2026",
      geography: "Singapore"
    },
    {
      id: "ind-fintech",
      industry: "Financial & Insurance Services",
      jobDemandIndex: 128.4,
      jobDemandTrend: "Moderate Growth",
      demandGrowthYoY: 6.8,
      medianSalarySGD: 8400,
      p25SalarySGD: 5800,
      p75SalarySGD: 14200,
      vacancyRatio: 1.44,
      topInDemandRoles: [
        "Quantitative Risk Analyst",
        "WealthTech Product Specialist",
        "Financial Crimes & AML Compliance Analyst",
        "ESG Data Analyst",
        "Core Banking Modernization Lead"
      ],
      emergingSkills: [
        "Sustainable Finance Taxonomy",
        "Algorithmic Risk Management",
        "Digital Assets & Tokenization",
        "Cloud-Native Banking APIs",
        "MAS Regulatory Compliance"
      ],
      coreCompetencies: ["Financial Modeling", "Portfolio Analytics", "Regulatory Frameworks", "Data Governance"],
      quarterlyTrends: [
        { quarter: "2025 Q1", demandIndex: 116.5, vacancies: 6200 },
        { quarter: "2025 Q2", demandIndex: 119.2, vacancies: 6500 },
        { quarter: "2025 Q3", demandIndex: 122.1, vacancies: 6850 },
        { quarter: "2025 Q4", demandIndex: 124.9, vacancies: 7100 },
        { quarter: "2026 Q1", demandIndex: 126.5, vacancies: 7350 },
        { quarter: "2026 Q2", demandIndex: 128.4, vacancies: 7600 }
      ],
      sourceCitation: "Monetary Authority of Singapore (MAS) & MOM Financial Services Sector Brief 2026",
      sourceDate: "July 2026",
      geography: "Singapore"
    },
    {
      id: "ind-profservices",
      industry: "Professional Services",
      jobDemandIndex: 118.6,
      jobDemandTrend: "Stable",
      demandGrowthYoY: 4.1,
      medianSalarySGD: 6700,
      p25SalarySGD: 4500,
      p75SalarySGD: 10800,
      vacancyRatio: 1.15,
      topInDemandRoles: [
        "Management Consultant (Digital Transformation)",
        "Sustainability / ESG Assurance Specialist",
        "Tax Technology Analyst",
        "Commercial IP Attorney",
        "Organizational Change Strategist"
      ],
      emergingSkills: [
        "Carbon Accounting & Auditing",
        "Supply Chain Resilience Strategy",
        "AI Governance Policy",
        "LegalTech Automation"
      ],
      coreCompetencies: ["Stakeholder Management", "Strategic Advisory", "Financial Diligence", "Project Leadership"],
      quarterlyTrends: [
        { quarter: "2025 Q1", demandIndex: 112.0, vacancies: 5100 },
        { quarter: "2025 Q2", demandIndex: 113.8, vacancies: 5250 },
        { quarter: "2025 Q3", demandIndex: 115.4, vacancies: 5400 },
        { quarter: "2025 Q4", demandIndex: 116.9, vacancies: 5550 },
        { quarter: "2026 Q1", demandIndex: 117.8, vacancies: 5700 },
        { quarter: "2026 Q2", demandIndex: 118.6, vacancies: 5850 }
      ],
      sourceCitation: "Singapore Economic Development Board (EDB) & MOM Professional Services Review 2026",
      sourceDate: "June 2026",
      geography: "Singapore"
    },
    {
      id: "ind-healthcare",
      industry: "Healthcare & Biomedical Sciences",
      jobDemandIndex: 135.2,
      jobDemandTrend: "Rapid Growth",
      demandGrowthYoY: 9.7,
      medianSalarySGD: 5600,
      p25SalarySGD: 3900,
      p75SalarySGD: 8900,
      vacancyRatio: 1.82,
      topInDemandRoles: [
        "Clinical Informatics Specialist",
        "Biomedical Quality Assurance Engineer",
        "Bioprocess Development Scientist",
        "Health Systems Operations Lead",
        "Telemedicine Care Coordinator"
      ],
      emergingSkills: [
        "Health AI Validation (HSA)",
        "Single-Cell Multi-Omics",
        "Continuous Biomanufacturing",
        "EHR Interoperability (HL7/FHIR)"
      ],
      coreCompetencies: ["Clinical Trial Management", "ISO 13485 Compliance", "Patient Care Analytics", "Laboratory Safety"],
      quarterlyTrends: [
        { quarter: "2025 Q1", demandIndex: 118.2, vacancies: 7400 },
        { quarter: "2025 Q2", demandIndex: 122.5, vacancies: 7900 },
        { quarter: "2025 Q3", demandIndex: 126.4, vacancies: 8300 },
        { quarter: "2025 Q4", demandIndex: 130.1, vacancies: 8800 },
        { quarter: "2026 Q1", demandIndex: 132.8, vacancies: 9200 },
        { quarter: "2026 Q2", demandIndex: 135.2, vacancies: 9600 }
      ],
      sourceCitation: "Ministry of Health (MOH) & MOM Healthcare Manpower Insights 2026",
      sourceDate: "August 2026",
      geography: "Singapore"
    },
    {
      id: "ind-logistics",
      industry: "Wholesale Trade & Logistics",
      jobDemandIndex: 112.4,
      jobDemandTrend: "Stable",
      demandGrowthYoY: 3.2,
      medianSalarySGD: 5200,
      p25SalarySGD: 3600,
      p75SalarySGD: 8200,
      vacancyRatio: 1.10,
      topInDemandRoles: [
        "Cold Chain Supply Planner",
        "Automated Warehouse Solutions Architect",
        "Regional Trade Compliance Manager",
        "Freight Digitization Specialist"
      ],
      emergingSkills: [
        "Green Logistics & Fleet Decarbonization",
        "Automated Guided Vehicle (AGV) Orchestration",
        "Predictive Demand Forecasting",
        "Cross-Border Customs API Automation"
      ],
      coreCompetencies: ["Inventory Optimization", "Vendor Relations", "Freight Forwarding", "Risk Mitigation"],
      quarterlyTrends: [
        { quarter: "2025 Q1", demandIndex: 108.5, vacancies: 4800 },
        { quarter: "2025 Q2", demandIndex: 109.6, vacancies: 4950 },
        { quarter: "2025 Q3", demandIndex: 110.8, vacancies: 5050 },
        { quarter: "2025 Q4", demandIndex: 111.5, vacancies: 5150 },
        { quarter: "2026 Q1", demandIndex: 112.0, vacancies: 5250 },
        { quarter: "2026 Q2", demandIndex: 112.4, vacancies: 5350 }
      ],
      sourceCitation: "Enterprise Singapore (ESG) & MOM Logistics Sector Survey 2026",
      sourceDate: "May 2026",
      geography: "Singapore"
    },
    {
      id: "ind-manufacturing",
      industry: "Advanced Manufacturing & Electronics",
      jobDemandIndex: 120.1,
      jobDemandTrend: "Moderate Growth",
      demandGrowthYoY: 5.4,
      medianSalarySGD: 5900,
      p25SalarySGD: 4100,
      p75SalarySGD: 9400,
      vacancyRatio: 1.25,
      topInDemandRoles: [
        "Semiconductor Yield Enhancement Engineer",
        "Industrial Automation & Robotics Programmer",
        "Smart Factory Systems Integrator",
        "Additive Manufacturing Specialist"
      ],
      emergingSkills: [
        "Industrial IoT (IIoT) Sensors",
        "Digital Twin Simulation",
        "Lithography Quality Control",
        "Robotic Process Automation in Cleanrooms"
      ],
      coreCompetencies: ["Statistical Process Control (SPC)", "Lean Manufacturing", "Equipment Maintenance", "Root Cause Analysis"],
      quarterlyTrends: [
        { quarter: "2025 Q1", demandIndex: 111.0, vacancies: 6100 },
        { quarter: "2025 Q2", demandIndex: 113.2, vacancies: 6300 },
        { quarter: "2025 Q3", demandIndex: 115.8, vacancies: 6600 },
        { quarter: "2025 Q4", demandIndex: 117.9, vacancies: 6800 },
        { quarter: "2026 Q1", demandIndex: 119.2, vacancies: 7000 },
        { quarter: "2026 Q2", demandIndex: 120.1, vacancies: 7150 }
      ],
      sourceCitation: "EDB Singapore & MOM Advanced Manufacturing Report 2026",
      sourceDate: "June 2026",
      geography: "Singapore"
    }
  ],
  emergingOccupations2026: [
    {
      title: "AI Trust, Risk & Security Manager",
      industry: "Information & Communications",
      growthProjection: "+28% demand over 24 months",
      criticalSkills: ["AI Ethics", "Adversarial Robustness", "Regulatory Compliance (EU AI Act & SG Model AI Framework)", "Risk Management"],
      skillsFrameworkRef: "SSG Infocomm Technology Skills Framework (ICT-SEC-5001-1.1)"
    },
    {
      title: "Sustainability Carbon Accounting Auditor",
      industry: "Professional Services / Financial Services",
      growthProjection: "+24% demand over 24 months",
      criticalSkills: ["GHG Protocol", "Scope 1-3 Emissions Verification", "SGX Climate Disclosures", "Data Verification"],
      skillsFrameworkRef: "SSG Accountancy & Sustainability Framework (ACC-SUS-4002-1.1)"
    },
    {
      title: "Clinical AI Implementation Lead",
      industry: "Healthcare & Biomedical Sciences",
      growthProjection: "+22% demand over 24 months",
      criticalSkills: ["Healthcare Informatics", "Clinical Workflow Optimization", "HSA SaMD Regulation", "Stakeholder Engagement"],
      skillsFrameworkRef: "SSG Healthcare Services Framework (HLT-INF-4010-1.1)"
    },
    {
      title: "Smart Logistics Robotics Integrator",
      industry: "Wholesale Trade & Logistics",
      growthProjection: "+19% demand over 24 months",
      criticalSkills: ["AGV/AMR Fleet Systems", "Warehouse Management Systems (WMS)", "PLC Programming", "Industrial Safety"],
      skillsFrameworkRef: "SSG Logistics Framework (LOG-AUT-3008-1.1)"
    }
  ]
};
