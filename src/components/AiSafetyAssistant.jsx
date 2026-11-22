import React, { useState } from 'react';
import { 
  Sparkles, Send, ShieldAlert, BookOpen, AlertTriangle, 
  HelpCircle, Bot, User, RefreshCw, FileText, CheckCircle2 
} from 'lucide-react';
import { queryAiSafetyAssistant } from '../services/chemicalSafetyEngine';

const PRESET_QUESTIONS = [
  "Why are Sodium Sulfide and Sulfuric Acid incompatible in tanneries?",
  "What hazards arise if Dichloromethane is stored with Caustic Soda in cleanrooms?",
  "Why must Hydrogen Peroxide and organic fragrances be segregated in cosmetics?",
  "How should Chromium Tanning effluent be segregated from sulfide liming liquors?",
  "What green solvent alternatives are documented for Hexane and Toluene?",
  "What mandatory PPE and engineering controls are required for handling Acyl Chlorides?"
];

export default function AiSafetyAssistant({ inventory = [] }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      timestamp: "Just now",
      content: {
        topic: "CHEM-SHIELD Industrial Safety Intelligence Core",
        status: "ACTIVE DECISION SUPPORT",
        primaryHazard: "Welcome to the CHEM-SHIELD AI Safety Copilot. I analyze multi-chemical functional groups, NOAA CAMEO reactivity matrices, and industrial segregation mandates.",
        chemicalEquation: "Advisory Rule: In industrial safety, absence of evidence is NEVER evidence of safety.",
        industrialPrevention: [
          "Select a preset safety question below or enter a custom chemical inquiry.",
          "All responses are cross-referenced with NOAA CAMEO, OSHA 1910.1200, and EPA RCRA standards.",
          "Review manufacturer Safety Data Sheets (SDS) Section 10 prior to high-volume chemical transfers."
        ],
        ppeRequirements: "Standard baseline PPE: Splash goggles, chemical-resistant nitrile gloves, closed-toe footwear.",
        authoritativeCitations: [
          "NOAA CAMEO Chemicals Database",
          "OSHA 29 CFR 1910.1200 Hazard Communication",
          "NFPA 400 Hazardous Materials Code"
        ],
        disclaimer: "CHEM-SHIELD AI provides scientific decision support and does not replace certified industrial hygienists or site-specific safety operating procedures (SOPs)."
      }
    }
  ]);

  const [inputQuestion, setInputQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleAsk = (queryText) => {
    const q = queryText || inputQuestion;
    if (!q.trim()) return;

    // Add user message
    const userMsg = {
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: q
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion("");
    setIsTyping(true);

    setTimeout(() => {
      const response = queryAiSafetyAssistant(q, inventory);
      const aiMsg = {
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: response
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#0b1324] border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Sparkles className="w-5 h-5 stroke-[2.2]" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">
              AI Industrial Chemical Safety Copilot
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
            Retrieval-augmented industrial chemical safety advisor. Queries authoritative reactivity databases (NOAA CAMEO, OSHA, EPA) to explain hazardous reaction mechanisms, safe segregation distances, and green alternatives with full source citations.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#070d1a] px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Factual Knowledge Base Active</span>
        </div>
      </div>

      {/* Preset Suggested Questions */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Quick Safety Inquiries:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUESTIONS.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(pq)}
              className="px-3 py-1.5 rounded-xl bg-[#0b1324] hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-white transition text-left"
            >
              {pq}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Chat Stream */}
      <div className="space-y-4">
        {messages.map((msg, mIdx) => (
          <div key={mIdx} className="space-y-2">
            {msg.sender === "user" ? (
              <div className="flex items-start justify-end space-x-3">
                <div className="p-3.5 rounded-2xl bg-emerald-600 text-white text-xs max-w-xl font-medium shadow-md shadow-emerald-950">
                  {msg.text}
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              </div>
            ) : (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>

                <div className="flex-1 p-5 rounded-2xl bg-[#0b1324] border border-slate-800 shadow-xl space-y-4">
                  {/* Topic & Status Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span>{msg.content.topic}</span>
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 w-fit">
                      {msg.content.status}
                    </span>
                  </div>

                  {/* Primary Hazard */}
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-amber-300 block">Hazard Analysis &amp; Reaction Dynamics:</span>
                    <p className="text-slate-300 leading-relaxed">
                      {msg.content.primaryHazard}
                    </p>
                  </div>

                  {/* Chemical Equation Box */}
                  {msg.content.chemicalEquation && (
                    <div className="p-3 rounded-xl bg-black/50 border border-slate-800 text-xs font-mono text-cyan-300">
                      <strong>Reaction Equation: </strong>{msg.content.chemicalEquation}
                    </div>
                  )}

                  {/* Prevention & Engineering Mandates */}
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-emerald-400 block">Industrial Preventive Safeguards:</span>
                    <ul className="space-y-1 text-slate-300">
                      {msg.content.industrialPrevention.map((ip, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{ip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* PPE */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                    <strong className="text-amber-400">Mandatory PPE: </strong>
                    {msg.content.ppeRequirements}
                  </div>

                  {/* Citations & Disclaimer */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                    <div className="flex flex-wrap gap-2">
                      <strong className="text-slate-400">Authoritative Sources:</strong>
                      {msg.content.authoritativeCitations.map((cit, cIdx) => (
                        <span key={cIdx} className="underline text-slate-400">{cit}</span>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 italic">
                    {msg.content.disclaimer}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-3 text-xs text-slate-400 animate-pulse">
            <Bot className="w-5 h-5 text-emerald-400" />
            <span>Consulting CAMEO reactivity rules and industrial safety directives...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 rounded-2xl bg-[#0b1324] border border-slate-800 shadow-xl">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask about chemical incompatibilities, reaction hazards, storage separation, or green substitutions..."
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim()}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition shadow-lg shadow-emerald-950"
          >
            <span>Query Copilot</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}

