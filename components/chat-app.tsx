"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ChatMessage } from "@/lib/chat";
import { roleDefinitions } from "@/lib/roles";
import styles from "./chat-app.module.css";

const STORAGE_KEY = "rolepilot-chat-state";

type StoredState = {
  roleId: string;
  messages: ChatMessage[];
};

const initialAssistantMessage = (roleTitle: string, roleId: string): ChatMessage => ({
  id: `welcome-${roleId}`,
  role: "assistant",
  content: `I am your ${roleTitle} guide. Ask for a roadmap, interview practice, project ideas, or skill advice.`,
  timestamp: "initial"
});

export function ChatApp() {
  const [selectedRoleId, setSelectedRoleId] = useState(roleDefinitions[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>([
    initialAssistantMessage(roleDefinitions[0].title, roleDefinitions[0].id)
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeRole = useMemo(
    () => roleDefinitions.find((role) => role.id === selectedRoleId) ?? roleDefinitions[0],
    [selectedRoleId]
  );

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as StoredState;
      if (parsed.roleId) {
        setSelectedRoleId(parsed.roleId);
      }
      if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
        setMessages(parsed.messages);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const nextState: StoredState = {
      roleId: selectedRoleId,
      messages
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }, [messages, selectedRoleId]);

  const resetConversation = () => {
    setMessages([initialAssistantMessage(activeRole.title, activeRole.id)]);
    setError(null);
  };

  const changeRole = (roleId: string) => {
    const role = roleDefinitions.find((entry) => entry.id === roleId) ?? roleDefinitions[0];
    setSelectedRoleId(role.id);
    setMessages([initialAssistantMessage(role.title, role.id)]);
    setError(null);
  };

  const submitMessage = async (event?: FormEvent<HTMLFormElement>, preset?: string) => {
    event?.preventDefault();
    const nextInput = (preset ?? input).trim();
    if (!nextInput || isLoading) {
      return;
    }

    const nextUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: nextInput,
      timestamp: new Date().toISOString()
    };

    const nextMessages = [...messages, nextUserMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          roleId: selectedRoleId,
          message: nextInput,
          history: nextMessages
        })
      });

      const payload = (await response.json()) as { error?: string; reply?: string };
      if (!response.ok || !payload.reply) {
        throw new Error(payload.error ?? "Unable to get a response right now.");
      }
      const reply = payload.reply;

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong while contacting the assistant.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.pageShell}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>RolePilot AI</p>
          <h1>Career guidance that talks like a focused job coach, not a generic bot.</h1>
          <p className={styles.heroText}>
            Pick a role, ask practical questions, and use the assistant for learning paths,
            project ideas, and interview prep.
          </p>
          <div className={styles.focusRow}>
            {activeRole.focusAreas.map((item) => (
              <span key={item} className={styles.focusChip}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <aside className={styles.roleCard}>
          <p className={styles.cardLabel}>Current track</p>
          <select
            className={styles.select}
            value={selectedRoleId}
            onChange={(event) => changeRole(event.target.value)}
          >
            {roleDefinitions.map((role) => (
              <option key={role.id} value={role.id}>
                {role.title}
              </option>
            ))}
          </select>
          <p className={styles.roleSummary}>{activeRole.summary}</p>
          <button type="button" className={styles.secondaryButton} onClick={resetConversation}>
            New conversation
          </button>
        </aside>
      </section>

      <section className={styles.workspace}>
        <div className={styles.promptPanel}>
          <div>
            <p className={styles.panelTitle}>Quick starts</p>
            <p className={styles.panelSubtitle}>
              These prompts are tuned for the selected job role.
            </p>
          </div>
          <div className={styles.promptList}>
            {activeRole.starterQuestions.map((question) => (
              <button
                key={question}
                type="button"
                className={styles.promptButton}
                onClick={() => void submitMessage(undefined, question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.chatPanel}>
          <div className={styles.chatHeader}>
            <div>
              <p className={styles.panelTitle}>Conversation</p>
              <p className={styles.panelSubtitle}>Local history is saved in your browser.</p>
            </div>
          </div>

          <div className={styles.messages}>
            {messages.map((message) => (
              <article
                key={message.id}
                className={
                  message.role === "assistant" ? styles.assistantMessage : styles.userMessage
                }
              >
                <p className={styles.messageRole}>
                  {message.role === "assistant" ? "Coach" : "You"}
                </p>
                <p className={styles.messageBody}>{message.content}</p>
              </article>
            ))}

            {isLoading ? (
              <article className={styles.assistantMessage}>
                <p className={styles.messageRole}>Coach</p>
                <p className={styles.messageBody}>Thinking through a helpful answer...</p>
              </article>
            ) : null}
          </div>

          <form className={styles.composer} onSubmit={submitMessage}>
            <textarea
              className={styles.textarea}
              rows={4}
              placeholder={`Ask about ${activeRole.title.toLowerCase()} skills, roadmap, projects, or interviews...`}
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <div className={styles.composerFooter}>
              <p className={styles.helperText}>
                MVP mode uses a local response engine. Real LLM hookup comes next.
              </p>
              <button type="submit" className={styles.primaryButton} disabled={isLoading}>
                Send
              </button>
            </div>
          </form>

          {error ? <p className={styles.errorText}>{error}</p> : null}
        </div>
      </section>
    </main>
  );
}
