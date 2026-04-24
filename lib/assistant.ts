import { buildMockAnswer, type ChatMessage } from "@/lib/chat";
import { getRoleDefinition } from "@/lib/roles";

type AssistantInput = {
  roleId: string;
  message: string;
  history: ChatMessage[];
};

function buildSystemPrompt(roleId: string) {
  const role = getRoleDefinition(roleId);

  return [
    `You are RolePilot AI, a focused job-role assistant for ${role.title}.`,
    `Your core focus areas are: ${role.focusAreas.join(", ")}.`,
    "Give practical, encouraging answers.",
    "Prefer simple language, clear steps, and realistic preparation advice.",
    "When useful, suggest interview practice, project ideas, or learning roadmap steps."
  ].join(" ");
}

async function generateOpenAIReply({ roleId, message, history }: AssistantInput) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const trimmedHistory = history.slice(-8).map((item) => ({
    role: item.role,
    content: item.content
  }));

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(roleId)
        },
        ...trimmedHistory,
        {
          role: "user",
          content: message
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error("The AI provider request failed.");
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return payload.choices?.[0]?.message?.content?.trim() || null;
}

export async function generateAssistantReply(input: AssistantInput) {
  try {
    const liveReply = await generateOpenAIReply(input);
    if (liveReply) {
      return liveReply;
    }
  } catch {
    // Fall back to mock responses so the app stays usable during setup.
  }

  return buildMockAnswer({
    roleId: input.roleId,
    question: input.message,
    history: input.history
  });
}
