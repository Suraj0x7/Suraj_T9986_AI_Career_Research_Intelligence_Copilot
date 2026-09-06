import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, ChevronDown, ChevronUp, FileSearch, Terminal, CheckCircle2 } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  evidence?: string[];
}

interface ChatBoxProps {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  presetPrompts?: string[];
  onSendMessage: (query: string) => Promise<{ answer: string; evidence?: string[] }>;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  title = "Evidence-Grounded AI Copilot",
  subtitle = "Directly queries your indexed documents using ChromaDB vectors & Gemini",
  placeholder = "Ask anything about your resume, missing qualifications, or research...",
  presetPrompts = [
    "What are my highest priority skill gaps?",
    "What project should I build first to demonstrate skills?",
    "Which bullet points on my resume are weakest?",
    "Generate 3 technical interview questions based on my background",
  ],
  onSendMessage,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Hello! I am your evidence-grounded AI copilot. I analyze your uploaded document embeddings in ChromaDB to give factual, verifiable career and research answers. Ask me anything below.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEvidence, setShowEvidence] = useState<{ [key: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    const userMsgId = `user_${Date.now()}`;
    const newMsg: Message = { id: userMsgId, sender: "user", text: textToSend };
    setMessages((prev) => [...prev, newMsg]);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      const response = await onSendMessage(textToSend);
      const botMsgId = `bot_${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: "assistant",
          text: response.answer,
          evidence: response.evidence,
        },
      ]);
      // Auto expand evidence if available
      if (response.evidence && response.evidence.length > 0) {
        setShowEvidence((prev) => ({ ...prev, [botMsgId]: true }));
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: "assistant",
          text: "I encountered an issue querying the vector collection. Please ensure your document was uploaded and indexed, then try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleEvidence = (msgId: string) => {
    setShowEvidence((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  return (
    <div className="glass-card-premium rounded-2xl border border-white/[0.08] flex flex-col h-[560px] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.08] bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-tight">
              {title}
              <span className="text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                RAG Online
              </span>
            </h3>
            <p className="text-xs text-slate-400 line-clamp-1">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === "user"
                  ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25"
                  : "bg-slate-900 border border-slate-700/80 text-cyan-400 shadow-md"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none shadow-md shadow-blue-600/20"
                  : "bg-slate-900/85 border border-white/[0.08] text-slate-200 rounded-tl-none shadow-xl"
              }`}
            >
              <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

              {/* Evidence context citations accordion */}
              {msg.evidence && msg.evidence.length > 0 && (
                <div className="mt-3.5 pt-2.5 border-t border-white/[0.08]">
                  <button
                    onClick={() => toggleEvidence(msg.id)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <FileSearch className="w-3.5 h-3.5" />
                    <span>
                      {showEvidence[msg.id]
                        ? "Hide retrieved vector chunks"
                        : `Inspect grounded evidence (${msg.evidence.length} chunks)`}
                    </span>
                    {showEvidence[msg.id] ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {showEvidence[msg.id] && (
                    <div className="mt-2.5 space-y-2">
                      {msg.evidence.map((chunk, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono leading-relaxed"
                        >
                          <div className="flex items-center justify-between text-[10px] text-cyan-400 font-sans font-bold uppercase tracking-wider mb-1.5 pb-1 border-b border-slate-900">
                            <span className="flex items-center gap-1">
                              <Terminal className="w-3 h-3" />
                              Chunk #{idx + 1}
                            </span>
                            <span className="text-emerald-400 font-mono text-[9px] lowercase">Grounded citation</span>
                          </div>
                          <p className="line-clamp-4 text-slate-300">{chunk}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/80 text-cyan-400 flex items-center justify-center shrink-0 shadow-md">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-900/85 border border-white/[0.08] rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-400 flex items-center gap-2.5 shadow-xl">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Querying vector store & generating evidence response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset prompt pills */}
      {presetPrompts.length > 0 && (
        <div className="px-4 py-2 border-t border-white/[0.06] bg-slate-950/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold font-mono shrink-0">
            Quick Prompts:
          </span>
          {presetPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={loading}
              className="text-xs bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1 rounded-full border border-slate-700/70 whitespace-nowrap transition-all duration-200 shrink-0 hover:border-cyan-500/40"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 sm:p-4 border-t border-white/[0.08] bg-slate-900/70 flex items-center gap-2.5"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
          className="flex-1 bg-slate-950/90 border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-blue-600/25 flex items-center gap-2"
        >
          <span className="hidden sm:inline">Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
