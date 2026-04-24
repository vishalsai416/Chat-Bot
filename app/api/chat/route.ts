import { NextResponse } from "next/server";
import { type ChatMessage } from "@/lib/chat";
import { generateAssistantReply } from "@/lib/assistant";
import { getRoleDefinition } from "@/lib/roles";

type ChatRequest = {
  roleId?: string;
  message?: string;
  history?: ChatMessage[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as ChatRequest;
  const roleId = body.roleId ?? "frontend";
  const message = body.message?.trim();

  if (!message) {
    return NextResponse.json(
      { error: "Please send a message before asking the assistant." },
      { status: 400 }
    );
  }

  const role = getRoleDefinition(roleId);

  const answer = await generateAssistantReply({
    roleId: role.id,
    message,
    history: body.history ?? []
  });

  return NextResponse.json({
    reply: answer,
    role: role.title
  });
}
