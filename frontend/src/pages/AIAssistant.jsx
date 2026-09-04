import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  BookOpen,
  Heart,
  Target,
  BriefcaseBusiness,
  RotateCcw,
} from "lucide-react";
import Layout from "../components/Layout";
import api from "../api/axios";

const SUGGESTIONS = [
  {
    text: "Build me a study plan for this week",
    icon: BookOpen,
  },
  {
    text: "I'm feeling stressed about exams",
    icon: Heart,
  },
  {
    text: "What skills am I missing for my goal?",
    icon: Target,
  },
  {
    text: "Help me prepare for placement interviews",
    icon: BriefcaseBusiness,
  },
];

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your personal academic & career mentor. Ask me anything about your studies, wellbeing, skills or placement prep.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages, loading]);

  const send = async (text) => {
    const content = text ?? input;

    if (!content.trim() || loading) return;

    const cleanContent = content.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: cleanContent,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/ai/chat", {
        message: cleanContent,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            "I wasn't able to generate a response. Please try again.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong while reaching your assistant. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  const clearConversation = () => {
    if (loading) return;

    setMessages([
      {
        role: "assistant",
        content:
          "Hi! I'm your personal academic & career mentor. Ask me anything about your studies, wellbeing, skills or placement prep.",
      },
    ]);

    setInput("");
    inputRef.current?.focus();
  };

  return (
    <Layout
      title="AI Assistant"
      subtitle="Your personal academic & career mentor, personalised to your journey."
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Intro / Hero */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-border-default bg-surface shadow-sm">
          <div className="relative px-5 py-5 sm:px-6">
            {/* Decorative background */}
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-sm"
                  aria-hidden="true"
                >
                  <Bot size={24} strokeWidth={2} />
                </div>

                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <h2 className="font-display text-lg font-semibold text-primary-text">
                      Your AI Mentor
                    </h2>

                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-300">
                      <Sparkles size={11} />
                      Personalised
                    </span>
                  </div>

                  <p className="max-w-2xl text-sm leading-relaxed text-secondary">
                    Get practical guidance based on your studies, goals,
                    wellbeing and career preparation.
                  </p>
                </div>
              </div>

              {messages.length > 1 && (
                <button
                  type="button"
                  onClick={clearConversation}
                  disabled={loading}
                  className="
                    flex h-9 shrink-0 items-center gap-2 rounded-lg
                    border border-border-default bg-surface-muted
                    px-3 text-xs font-medium text-secondary
                    transition-all duration-150
                    hover:bg-surface hover:text-primary-text
                    disabled:cursor-not-allowed disabled:opacity-50
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-primary
                  "
                  title="Start a new conversation"
                  aria-label="Start a new conversation"
                >
                  <RotateCcw size={14} />
                  <span className="hidden sm:inline">New chat</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Chat container */}
        <section
          className="
            flex h-[calc(100vh-270px)] min-h-[500px]
            flex-col overflow-hidden
            rounded-2xl border border-border-default
            bg-surface shadow-sm
          "
          aria-label="AI mentor conversation"
        >
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-border-default px-4 py-3 sm:px-5">
            <div className="relative">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"
                aria-hidden="true"
              >
                <Sparkles size={18} />
              </div>

              <span
                className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-emerald-500"
                aria-label="Assistant available"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-primary-text">
                Personalised Mentor
              </p>
              <p className="text-xs text-secondary">
                Ready to help with your next step
              </p>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-5 sm:px-6"
            aria-live="polite"
            aria-label="Conversation messages"
          >
            <div className="mx-auto max-w-3xl space-y-5">
              {messages.map((message, index) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex items-end gap-2.5 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Assistant avatar */}
                    {!isUser && (
                      <div
                        className="
                          flex h-8 w-8 shrink-0 items-center justify-center
                          rounded-xl bg-primary/10 text-primary
                        "
                        aria-hidden="true"
                      >
                        <Bot size={16} />
                      </div>
                    )}

                    <div
                      className={`max-w-[88%] sm:max-w-[75%] ${
                        isUser ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`
                          whitespace-pre-line rounded-2xl px-4 py-3
                          text-sm leading-relaxed
                          ${
                            isUser
                              ? "rounded-br-md bg-ink-900 text-white shadow-sm dark:bg-primary dark:text-white"
                              : "rounded-bl-md border border-border-default bg-surface-muted text-primary-text"
                          }
                        `}
                      >
                        {message.content}
                      </div>

                      <p
                        className={`mt-1 px-1 text-[10px] text-secondary ${
                          isUser ? "text-right" : "text-left"
                        }`}
                      >
                        {isUser ? "You" : "AI Mentor"}
                      </p>
                    </div>

                    {/* User avatar */}
                    {isUser && (
                      <div
                        className="
                          flex h-8 w-8 shrink-0 items-center justify-center
                          rounded-xl bg-amber-400 text-ink-950
                        "
                        aria-hidden="true"
                      >
                        <User size={16} />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Loading state */}
              {loading && (
                <div className="flex items-end gap-2.5">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                    aria-hidden="true"
                  >
                    <Bot size={16} />
                  </div>

                  <div className="rounded-2xl rounded-bl-md border border-border-default bg-surface-muted px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="sr-only">
                        AI Mentor is thinking
                      </span>

                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="border-t border-border-default bg-surface-muted/50 px-4 py-4 sm:px-5">
              <div className="mx-auto max-w-3xl">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles
                    size={14}
                    className="text-amber-500"
                    aria-hidden="true"
                  />

                  <p className="text-xs font-semibold text-primary-text">
                    Not sure where to start?
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {SUGGESTIONS.map((suggestion) => {
                    const Icon = suggestion.icon;

                    return (
                      <button
                        key={suggestion.text}
                        type="button"
                        onClick={() => send(suggestion.text)}
                        disabled={loading}
                        className="
                          group flex items-center gap-3
                          rounded-xl border border-border-default
                          bg-surface px-3.5 py-3
                          text-left text-xs font-medium text-primary-text
                          transition-all duration-150
                          hover:-translate-y-0.5
                          hover:border-primary/40
                          hover:shadow-sm
                          disabled:cursor-not-allowed disabled:opacity-50
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-primary
                        "
                      >
                        <span
                          className="
                            flex h-8 w-8 shrink-0 items-center justify-center
                            rounded-lg bg-primary/10 text-primary
                            transition-colors
                            group-hover:bg-primary group-hover:text-white
                          "
                        >
                          <Icon size={15} aria-hidden="true" />
                        </span>

                        <span className="leading-relaxed">
                          {suggestion.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
            className="border-t border-border-default bg-surface px-4 py-3 sm:px-5 sm:py-4"
          >
            <div className="mx-auto flex max-w-3xl items-end gap-2">
              <div className="relative flex-1">
                <label htmlFor="ai-message" className="sr-only">
                  Message your AI mentor
                </label>

                <input
                  ref={inputRef}
                  id="ai-message"
                  className="
                    input-field
                    min-h-[44px]
                    pr-4
                  "
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask your mentor anything..."
                  disabled={loading}
                  autoComplete="off"
                />
              </div>

              <button
                type="submit"
                className="
                  flex h-[44px] w-[44px] shrink-0
                  items-center justify-center
                  rounded-xl bg-amber-500
                  text-ink-950
                  shadow-sm
                  transition-all duration-150
                  hover:bg-amber-400
                  hover:shadow-md
                  active:scale-95
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-amber-500
                  focus-visible:ring-offset-2
                "
                disabled={loading || !input.trim()}
                aria-label="Send message"
                title="Send message"
              >
                <Send size={18} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>

            <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-secondary">
              Your mentor uses your personalised academic information to
              provide more relevant guidance.
            </p>
          </form>
        </section>
      </div>
    </Layout>
  );
};

export default AIAssistant;