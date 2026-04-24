import { describe, expect, it } from "vitest";
import { buildMockAnswer } from "@/lib/chat";

describe("buildMockAnswer", () => {
  it("returns a roadmap response for roadmap-style prompts", () => {
    const reply = buildMockAnswer({
      roleId: "frontend",
      question: "What roadmap should I follow and what should I learn first?",
      history: []
    });

    expect(reply).toContain("Frontend Developer");
    expect(reply).toContain("1. Learn HTML, CSS, and modern JavaScript well.");
  });

  it("returns an interview practice response for interview prompts", () => {
    const reply = buildMockAnswer({
      roleId: "backend",
      question: "Give me a backend interview question",
      history: []
    });

    expect(reply).toContain("Interview practice for Backend Developer:");
    expect(reply).toContain("What I would listen for:");
  });

  it("returns a general coaching response for other prompts", () => {
    const reply = buildMockAnswer({
      roleId: "support",
      question: "How can I prepare for this role?",
      history: []
    });

    expect(reply).toContain("Customer Support");
    expect(reply).toContain("A good next step is to ask for a roadmap");
  });
});
