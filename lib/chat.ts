import { getRoleDefinition } from "@/lib/roles";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

type ResponseInput = {
  roleId: string;
  question: string;
  history: ChatMessage[];
};

const roadmapByRole: Record<string, string[]> = {
  frontend: [
    "Learn HTML, CSS, and modern JavaScript well.",
    "Build 3 polished UI projects with responsive layouts.",
    "Practice React, state flows, and API integration.",
    "Prepare for interviews with accessibility and performance examples."
  ],
  backend: [
    "Master one backend language and framework.",
    "Practice designing REST APIs and handling auth securely.",
    "Use PostgreSQL well and understand indexes and joins.",
    "Build deployable projects that show logging, validation, and testing."
  ],
  "data-analyst": [
    "Strengthen SQL fundamentals and analytical thinking.",
    "Create dashboard projects that answer business questions.",
    "Learn to explain metrics clearly to non-technical people.",
    "Prepare case-study style answers using structured storytelling."
  ],
  support: [
    "Practice clear writing and calm customer communication.",
    "Learn how tickets are prioritized, documented, and escalated.",
    "Study product troubleshooting workflows.",
    "Use mock scenarios to improve empathy and response quality."
  ]
};

export function buildMockAnswer({ roleId, question }: ResponseInput) {
  const role = getRoleDefinition(roleId);
  const normalized = question.toLowerCase();
  const roadmap = roadmapByRole[role.id] ?? [];

  if (normalized.includes("roadmap") || normalized.includes("learn first")) {
    return [
      `Here is a practical roadmap for becoming a stronger ${role.title}:`,
      ...roadmap.map((item, index) => `${index + 1}. ${item}`),
      "Pick one project that proves these skills and keep notes on what you solved."
    ].join("\n");
  }

  if (normalized.includes("interview")) {
    return [
      `Interview practice for ${role.title}:`,
      `Question: ${role.starterQuestions[1]}`,
      "What I would listen for:",
      "1. A clear explanation with real examples.",
      "2. Good tradeoff thinking, not just definitions.",
      "3. Confidence about tools, but honesty about gaps.",
      "Reply with your answer and I can score it next."
    ].join("\n");
  }

  if (normalized.includes("skill") || normalized.includes("tools")) {
    return [
      `${role.title} core skill stack:`,
      `Focus areas: ${role.focusAreas.join(", ")}.`,
      "Build one beginner project, one realistic project, and one portfolio-ready project.",
      "Keep your answers simple, practical, and tied to what the job expects."
    ].join("\n");
  }

  return [
    `You are preparing for a ${role.title} role, so I would keep this practical.`,
    `Your question was: "${question}"`,
    `Start with the fundamentals around ${role.focusAreas.slice(0, 2).join(" and ")}, then connect them to real tasks recruiters expect.`,
    "A good next step is to ask for a roadmap, a mock interview question, or a project idea tailored to this role."
  ].join("\n\n");
}
