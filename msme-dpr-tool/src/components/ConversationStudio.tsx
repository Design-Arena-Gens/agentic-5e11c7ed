"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LanguageOption, voicePrompts } from "@/data/datasets";

type RecognitionResult = {
  transcript: string;
};

type RecognitionEvent = {
  results: Array<{
    0: RecognitionResult;
  }>;
};

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: RecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type SpeechRecognitionWindow = Window &
  Partial<{
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }>;

type Message = {
  role: "entrepreneur" | "assistant";
  text: string;
  lang: LanguageOption;
  timestamp: string;
};

const languageConfig: Record<LanguageOption, { label: string; code: string }> = {
  english: { label: "English", code: "en-IN" },
  telugu: { label: "తెలుగు", code: "te-IN" },
};

export function ConversationStudio() {
  const [language, setLanguage] = useState<LanguageOption>("telugu");
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "నమస్తే! మీ వ్యాపార లక్ష్యం మరియు ప్రస్తుతం ఉన్న సవాళ్లను వివరించండి. I'm tuned to translate everything into a bank-ready DPR structure.",
      lang: "telugu",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return () => undefined;
    }

    const speechWindow = window as SpeechRecognitionWindow;
    const SpeechRecognitionConstructor =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (SpeechRecognitionConstructor) {
      const recognition = new SpeechRecognitionConstructor();
      recognition.lang = languageConfig[language].code;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: RecognitionEvent) => {
        const transcript = event.results
          .map((result) => result[0].transcript)
          .join("");
        transcriptRef.current = transcript;
        setInput(transcript);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    };
    // intentionally leave dependencies empty so the constructor binds only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = languageConfig[language].code;
      if (isListening) {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current?.start(), 300);
      }
    }
  }, [language, isListening]);

  const suggestedPrompts = useMemo(() => voicePrompts[language], [language]);

  const synthesiseResponse = (userMessage: string, lang: LanguageOption) => {
    const normalized = userMessage.toLowerCase();
    const indicators = [
      normalized.includes("loan"),
      normalized.includes("scheme"),
      normalized.includes("export"),
      normalized.includes("energy"),
    ].filter(Boolean).length;

    const bankabilityScore = Math.min(
      0.42 + indicators * 0.12 + Math.min(userMessage.length / 500, 0.18),
      0.95,
    );

    const baseResponse =
      lang === "telugu"
        ? "మీ వివరాలను DPR నిర్మాణానికి చేర్చాను. మీకు అనుకూలమైన పథకాలు మరియు బ్యాంకబిలిటీ పొరపాటు సూచనలు క్రింద ఉన్నాయి."
        : "Your insights are being structured into the DPR with matched schemes and bankability nudges.";

    return `${baseResponse}\n- Bankability score (beta): ${(bankabilityScore * 100).toFixed(
      0,
    )}%\n- Next action: Attach cash-flow evidence and geo-tagged assets.\n- Recommended advisor review within 48 hours.`;
  };

  const handleSubmit = (text?: string) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed) return;

    const entrepreneurMessage: Message = {
      role: "entrepreneur",
      text: trimmed,
      lang: language,
      timestamp: new Date().toLocaleTimeString(),
    };

    const assistantMessage: Message = {
      role: "assistant",
      text: synthesiseResponse(trimmed, language),
      lang: language,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, entrepreneurMessage, assistantMessage]);
    setInput("");
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      transcriptRef.current = "";
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <section className="grid gap-8 rounded-3xl border border-border bg-surface px-8 py-10 md:grid-cols-[3fr,2fr] md:px-12">
      <div>
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Conversational Onboarding Studio</h2>
            <p className="mt-1 text-sm text-foreground/70">
              Text + voice guidance orchestrated for first-time entrepreneurs in English and Telugu.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-surface-muted px-2 py-1">
            {(Object.keys(languageConfig) as LanguageOption[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLanguage(option)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  language === option
                    ? "bg-brand-primary text-white shadow-sm"
                    : "text-foreground/70 hover:bg-white"
                }`}
              >
                {languageConfig[option].label}
              </button>
            ))}
          </div>
        </header>

        <div className="mt-6 space-y-4">
          <div className="h-[22rem] overflow-hidden rounded-3xl border border-border/70 bg-surface-muted/60">
            <div className="flex h-full flex-col justify-end">
              <div className="grid h-full gap-3 overflow-y-auto px-6 py-6">
                {messages.map((message, index) => (
                  <div
                    key={`${message.timestamp}-${index}`}
                    className={`flex flex-col gap-1 ${
                      message.role === "entrepreneur" ? "items-end" : "items-start"
                    }`}
                    aria-label={`${message.role} message`}
                  >
                    <span className="text-[10px] uppercase tracking-wide text-foreground/50">
                      {message.role === "entrepreneur" ? "Entrepreneur" : "DPR Copilot"} -{" "}
                      {message.timestamp}
                    </span>
                    <div
                      className={`max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition ${
                        message.role === "entrepreneur"
                          ? "bg-brand-primary/90 text-white"
                          : "bg-white text-foreground"
                      }`}
                    >
                      {message.text.split("\n").map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border/70 bg-surface px-6 py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="flex flex-1 items-center rounded-full border border-border bg-white px-4 py-2">
                    <textarea
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      placeholder={
                        language === "telugu"
                          ? "మీ వ్యాపారం గురించి వివరాలు ఇక్కడ రాయండి లేదా మాట్లాడండి..."
                          : "Type or dictate your business context for the DPR..."
                      }
                      rows={2}
                      className="flex-1 resize-none border-none bg-transparent text-sm focus:outline-none focus:ring-0"
                    />
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
                        isListening
                          ? "bg-red-500 text-white"
                          : "bg-brand-secondary/20 text-brand-secondary"
                      }`}
                      aria-pressed={isListening}
                      aria-label={isListening ? "Stop voice capture" : "Start voice capture"}
                    >
                      {isListening ? "REC" : "MIC"}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-primary/90"
                  >
                    Generate DPR Section
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSubmit(prompt)}
                className="rounded-2xl border border-border/60 bg-white px-4 py-3 text-left text-sm text-foreground/80 shadow-sm transition hover:-translate-y-1 hover:border-brand-primary/60 hover:text-brand-primary"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="flex flex-col justify-between gap-6 rounded-3xl border border-border/60 bg-surface-muted p-6">
        <div>
          <h3 className="text-lg font-semibold text-brand-secondary">
            Structured DPR Outputs (Auto-generated)
          </h3>
          <ul className="mt-4 space-y-4 text-sm text-foreground/75">
            <li>
              <strong className="text-brand-primary">Narrative Synopsis:</strong> Market thesis,
              sector intelligence, and vision paragraphs aligned with SIDBI DPR rubrics.
            </li>
            <li>
              <strong className="text-brand-primary">Financial Evidence Locker:</strong> Upload and
              auto-validate invoices, GST, land records, and geo-tagged photos.
            </li>
            <li>
              <strong className="text-brand-primary">Compliance Guardrails:</strong> Inline DPDP Act
              consent capture with audit trails back to AP Digital Governance Policy.
            </li>
          </ul>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">
            Last-mile enablement
          </h4>
          <p className="mt-2 text-sm text-foreground/75">
            Works offline in outreach camps, syncs securely once connectivity resumes, and
            integrates vernacular nudges with WhatsApp, IVR, and village volunteer toolkits.
          </p>
        </div>
      </aside>
    </section>
  );
}
