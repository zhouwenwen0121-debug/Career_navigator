export interface SkillDefinition {
  id: string;
  name: string;
  canonicalCategory: 'Technical' | 'Analytical' | 'Design' | 'Management' | 'Domain' | 'Core';
  ssgCode?: string;
  ssgCategory?: string;
  aliases: string[];
  transferableTo: string[];
  recommendedTrainingCourses?: {
    courseName: string;
    provider: string;
    ssgEligible: boolean;
    duration: string;
    level: string;
  }[];
}

export const SKILLS_TAXONOMY: SkillDefinition[] = [
  {
    id: "skill-python",
    name: "Python",
    canonicalCategory: "Technical",
    ssgCode: "ICT-DDA-3004-1.1",
    ssgCategory: "Data Science & Artificial Intelligence",
    aliases: ["python3", "python programming", "py", "python scripting"],
    transferableTo: ["Data Analysis", "Machine Learning", "Backend Engineering", "Automation"],
    recommendedTrainingCourses: [
      {
        courseName: "Applied Python for Data Analytics & Automation",
        provider: "National University of Singapore (NUS Scale)",
        ssgEligible: true,
        duration: "3 days (24 hours)",
        level: "Intermediate"
      },
      {
        courseName: "Python for Artificial Intelligence & ML Foundations",
        provider: "Nanyang Polytechnic (NYP)",
        ssgEligible: true,
        duration: "4 days (32 hours)",
        level: "Beginner to Intermediate"
      }
    ]
  },
  {
    id: "skill-sql",
    name: "SQL",
    canonicalCategory: "Technical",
    ssgCode: "ICT-DDA-3006-1.1",
    ssgCategory: "Database Management & Querying",
    aliases: ["sql querying", "relational databases", "mysql", "postgresql querying", "structured query language"],
    transferableTo: ["Data Analysis", "Database Administration", "Business Intelligence", "Analytics Engineering"],
    recommendedTrainingCourses: [
      {
        courseName: "Relational Database Design and SQL Masterclass",
        provider: "Singapore Management University (SMU Academy)",
        ssgEligible: true,
        duration: "2 days (16 hours)",
        level: "Intermediate"
      }
    ]
  },
  {
    id: "skill-react",
    name: "React",
    canonicalCategory: "Technical",
    ssgCode: "ICT-DES-3012-1.1",
    ssgCategory: "Software Development & Architecture",
    aliases: ["react.js", "reactjs", "react frontend", "react framework"],
    transferableTo: ["Frontend Development", "Full Stack Development", "Mobile App Development (React Native)"],
    recommendedTrainingCourses: [
      {
        courseName: "Enterprise Modern Web Application Development with React & TypeScript",
        provider: "Institute of Systems Science (NUS-ISS)",
        ssgEligible: true,
        duration: "5 days (40 hours)",
        level: "Advanced"
      }
    ]
  },
  {
    id: "skill-typescript",
    name: "TypeScript",
    canonicalCategory: "Technical",
    ssgCode: "ICT-DES-4001-1.1",
    ssgCategory: "Software Engineering",
    aliases: ["ts", "typescript language", "typed javascript"],
    transferableTo: ["Frontend Development", "Backend Development", "Node.js Architecture"],
    recommendedTrainingCourses: [
      {
        courseName: "TypeScript in Production: Architectural Patterns & Clean Code",
        provider: "Singapore Polytechnic (SP PACE)",
        ssgEligible: true,
        duration: "2 days (16 hours)",
        level: "Intermediate"
      }
    ]
  },
  {
    id: "skill-tableau",
    name: "Tableau",
    canonicalCategory: "Analytical",
    ssgCode: "ICT-DDA-3015-1.1",
    ssgCategory: "Data Visualization & Storytelling",
    aliases: ["tableau desktop", "tableau server", "tableau dashboards"],
    transferableTo: ["Data Analysis", "Business Intelligence", "Executive Reporting", "Data Storytelling"],
    recommendedTrainingCourses: [
      {
        courseName: "Visual Analytics and Interactive Dashboards with Tableau",
        provider: "Singapore Management University (SMU Academy)",
        ssgEligible: true,
        duration: "3 days (24 hours)",
        level: "Beginner to Intermediate"
      }
    ]
  },
  {
    id: "skill-powerbi",
    name: "Power BI",
    canonicalCategory: "Analytical",
    ssgCode: "ICT-DDA-3016-1.1",
    ssgCategory: "Data Visualization & Business Intelligence",
    aliases: ["microsoft power bi", "powerbi", "power bi desktop", "dax"],
    transferableTo: ["Data Analysis", "Business Intelligence", "Financial Reporting"],
    recommendedTrainingCourses: [
      {
        courseName: "Microsoft Power BI Data Analysis and Visualization Bootcamp",
        provider: "NTUC LearningHub",
        ssgEligible: true,
        duration: "2 days (16 hours)",
        level: "Beginner to Intermediate"
      }
    ]
  },
  {
    id: "skill-aws",
    name: "AWS",
    canonicalCategory: "Technical",
    ssgCode: "ICT-INF-4008-1.1",
    ssgCategory: "Cloud Infrastructure & DevOps",
    aliases: ["amazon web services", "aws cloud", "amazon aws"],
    transferableTo: ["Cloud Architecture", "DevOps Engineering", "System Administration"],
    recommendedTrainingCourses: [
      {
        courseName: "AWS Certified Solutions Architect Associate Preparation",
        provider: "Temasek Polytechnic (TP)",
        ssgEligible: true,
        duration: "4 days (32 hours)",
        level: "Intermediate"
      }
    ]
  },
  {
    id: "skill-docker",
    name: "Docker",
    canonicalCategory: "Technical",
    ssgCode: "ICT-INF-3014-1.1",
    ssgCategory: "Containerization & Deployment",
    aliases: ["containers", "docker engine", "containerization"],
    transferableTo: ["DevOps", "Cloud Engineering", "Microservices Architecture"],
    recommendedTrainingCourses: [
      {
        courseName: "Hands-on Containerization with Docker & Kubernetes",
        provider: "Institute of Systems Science (NUS-ISS)",
        ssgEligible: true,
        duration: "3 days (24 hours)",
        level: "Intermediate"
      }
    ]
  },
  {
    id: "skill-kubernetes",
    name: "Kubernetes",
    canonicalCategory: "Technical",
    ssgCode: "ICT-INF-5002-1.1",
    ssgCategory: "Cloud Orchestration",
    aliases: ["k8s", "kubernetes cluster", "container orchestration"],
    transferableTo: ["Site Reliability Engineering", "DevOps", "Platform Engineering"],
    recommendedTrainingCourses: [
      {
        courseName: "Kubernetes Administration and Orchestration",
        provider: "Republic Polytechnic (RP)",
        ssgEligible: true,
        duration: "3 days (24 hours)",
        level: "Advanced"
      }
    ]
  },
  {
    id: "skill-data-analysis",
    name: "Data Analysis",
    canonicalCategory: "Analytical",
    ssgCode: "ICT-DDA-3001-1.1",
    ssgCategory: "Data Analytics & Insights",
    aliases: ["data analytics", "analytical data skills", "exploratory data analysis", "data insight generation"],
    transferableTo: ["Business Analytics", "Product Analytics", "Market Research", "Financial Analysis"],
    recommendedTrainingCourses: [
      {
        courseName: "Data Analytics for Decision Makers",
        provider: "NUS-ISS",
        ssgEligible: true,
        duration: "3 days (24 hours)",
        level: "Intermediate"
      }
    ]
  },
  {
    id: "skill-machine-learning",
    name: "Machine Learning",
    canonicalCategory: "Technical",
    ssgCode: "ICT-DDA-4008-1.1",
    ssgCategory: "Artificial Intelligence",
    aliases: ["ml", "applied machine learning", "predictive modeling"],
    transferableTo: ["AI Engineering", "Data Science", "Quantitative Research"],
    recommendedTrainingCourses: [
      {
        courseName: "Applied Machine Learning Systems",
        provider: "NUS School of Computing",
        ssgEligible: true,
        duration: "5 days (40 hours)",
        level: "Advanced"
      }
    ]
  },
  {
    id: "skill-product-management",
    name: "Product Management",
    canonicalCategory: "Management",
    ssgCode: "ICT-DES-4009-1.1",
    ssgCategory: "Product Management & Innovation",
    aliases: ["digital product management", "product strategy", "product lifecycle management"],
    transferableTo: ["Project Management", "Business Analysis", "Strategy Consulting"],
    recommendedTrainingCourses: [
      {
        courseName: "Strategic Digital Product Management",
        provider: "SMU Academy",
        ssgEligible: true,
        duration: "3 days (24 hours)",
        level: "Intermediate"
      }
    ]
  },
  {
    id: "skill-ui-ux",
    name: "UI/UX Design",
    canonicalCategory: "Design",
    ssgCode: "ICT-DES-3002-1.1",
    ssgCategory: "User Experience & Interface Design",
    aliases: ["user experience design", "ux design", "ui design", "product design"],
    transferableTo: ["Front-end Development", "Customer Experience Strategy", "Design Systems"],
    recommendedTrainingCourses: [
      {
        courseName: "Human-Centered UI/UX Design and Prototyping",
        provider: "Nanyang Polytechnic",
        ssgEligible: true,
        duration: "4 days (32 hours)",
        level: "Intermediate"
      }
    ]
  },
  {
    id: "skill-cybersecurity",
    name: "Cybersecurity",
    canonicalCategory: "Technical",
    ssgCode: "ICT-SEC-4002-1.1",
    ssgCategory: "Cybersecurity Operations & Defense",
    aliases: ["information security", "infosec", "cyber security", "network security"],
    transferableTo: ["Cloud Security", "IT Audit & Governance", "Risk Assessment"],
    recommendedTrainingCourses: [
      {
        courseName: "Cybersecurity Defense and Threat Monitoring Essentials",
        provider: "Singapore Polytechnic (SP)",
        ssgEligible: true,
        duration: "3 days (24 hours)",
        level: "Intermediate"
      }
    ]
  }
];

export function normalizeSkillName(rawInput: string): SkillDefinition | null {
  const cleaned = rawInput.trim().toLowerCase();
  for (const skill of SKILLS_TAXONOMY) {
    if (skill.name.toLowerCase() === cleaned) return skill;
    if (skill.aliases.some(alias => alias.toLowerCase() === cleaned)) return skill;
  }
  return null;
}
