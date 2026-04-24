export type RoleDefinition = {
  id: string;
  title: string;
  summary: string;
  focusAreas: string[];
  starterQuestions: string[];
};

export const roleDefinitions: RoleDefinition[] = [
  {
    id: "frontend",
    title: "Frontend Developer",
    summary: "Build strong UI intuition, web fundamentals, and interview confidence.",
    focusAreas: ["React", "performance", "state management", "accessibility"],
    starterQuestions: [
      "What should I learn first to become a frontend developer?",
      "Ask me a frontend interview question.",
      "Explain the difference between CSR and SSR simply."
    ]
  },
  {
    id: "backend",
    title: "Backend Developer",
    summary: "Practice APIs, databases, architecture, and debugging habits.",
    focusAreas: ["Node.js", "SQL", "system design", "authentication"],
    starterQuestions: [
      "How do I become job-ready as a backend developer?",
      "Give me a backend interview question.",
      "Explain indexing in a beginner-friendly way."
    ]
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    summary: "Get comfortable with SQL, dashboards, metrics, and business thinking.",
    focusAreas: ["SQL", "Excel", "dashboards", "storytelling"],
    starterQuestions: [
      "What skills matter most for an entry-level data analyst?",
      "Ask me a SQL interview question.",
      "How do I talk about projects in interviews?"
    ]
  },
  {
    id: "support",
    title: "Customer Support",
    summary: "Improve communication, empathy, product understanding, and ticket handling.",
    focusAreas: ["communication", "de-escalation", "SLA awareness", "documentation"],
    starterQuestions: [
      "How should I answer 'tell me about yourself' for a support role?",
      "Give me a mock support interview question.",
      "How do I handle an angry customer professionally?"
    ]
  }
];

export const getRoleDefinition = (roleId: string) =>
  roleDefinitions.find((role) => role.id === roleId) ?? roleDefinitions[0];
