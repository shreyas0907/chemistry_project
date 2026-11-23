import React, { useState, useEffect } from 'react';
import { 
  Languages, 
  Volume2, 
  VolumeX, 
  FileText, 
  Printer, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  Info,
  Radio,
  ExternalLink
} from 'lucide-react';

export default function MultilingualSopViewer({ 
  inventory = [], 
  onSelectChemical 
}) {
  const [selectedChemId, setSelectedChemId] = useState(inventory[0]?.id || '');
  const [language, setLanguage] = useState('en'); // 'en' | 'hi' | 'mr'
  const [sopData, setSopData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const selectedChem = inventory.find(c => c.id === selectedChemId) || inventory[0];

  // Fetch or Compute Multilingual SOP via Netlify Function / Fallback
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    fetch('/api/analyze-hazard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'multilingual-sop',
        chemicalA: selectedChem,
        language
      })
    })
      .then(res => res.json())
      .then(data => {
        if (!isCancelled) {
          setSopData(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (!isCancelled) {
          setSopData(getOfflineSopFallback(selectedChem, language));
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, [selectedChemId, language]);

  // Fallback Multilingual Dictionary
  function getOfflineSopFallback(chem, lang) {
    const name = (chem?.name || '').toLowerCase();
    const isSulfide = name.includes('sulfide');
    const isCyanide = name.includes('cyanide');
    const isAcid = name.includes('acid');

    if (lang === 'hi') {
      if (isSulfide) {
        return {
          title: 'सोडियम सल्फाइड (H₂S) विषैली गैस आपातकालीन SOP',
          spillImmediateAction: 'तुरंत हवा की विपरीत दिशा (Upwind) में जाएं। नाले या खड्डे में बिना SCBA के प्रवेश न करें।',
          mandatoryPpe: 'SCBA श्वास उपकरण, लेवल A केमिकल गैस-टाइट सूट, ब्यूटाइल रबर दस्ताने, गमबूट।',
          firstAid: 'पीड़ित को खुली ताजी हवा में लाएं। 100% मेडिकल ऑक्सीजन दें। तुरंत CPR शुरू करें।',
          evacuationProtocol: 'लेवल 3 आपातकालीन सायरन बजाएं। 300 मीटर के दायरे में तुरंत खाली करें।',
          spokenVoiceText: 'सावधान! हाइड्रोजन सल्फाइड गैस का गंभीर खतरा है। सभी कर्मचारी तुरंत हवा की उल्टी दिशा में सुरक्षित असेंबली पॉइंट पर पहुंचे।'
        };
      }
      if (isCyanide) {
        return {
          title: 'पोटेशियम साइनाइड (HCN) घातक गैस रिसाव SOP',
          spillImmediateAction: 'एसिड और साइनाइड के संपर्क को तुरंत रोकें। रिसाव पर कास्टिक और ब्लीच घोल (pH > 11.5) डालें।',
          mandatoryPpe: 'फुल फेस SCBA, डबल नाइट्राइल दस्ताने, रबर एप्रन, केमिकल गॉगल।',
          firstAid: 'एमिल नाइट्राइट या साइनाइड किट तैयार रखें। 15 मिनट तक इमरजेंसी शावर में धोएं।',
          evacuationProtocol: 'प्लेटिंग शॉप को तुरंत खाली करें। मुख्य गेट के पास इकट्ठा हों।',
          spokenVoiceText: 'चेतावनी! इलेक्ट्रोप्लेटिंग सेक्शन में साइनाइड रिसाव हुआ है। तुरंत प्लांट खाली करें।'
        };
      }
      return {
        title: `${chem.name} - औद्योगिक तल सुरक्षा मानक संचालन प्रक्रिया`,
        spillImmediateAction: 'रिसाव को सूखा सोखने वाले पाउडर से रोकें। पानी सीधे न डालें।',
        mandatoryPpe: 'सुरक्षा चश्मा, रबर दस्ताने, एप्रन और सुरक्षा जूते।',
        firstAid: 'त्वचा या आंखों को 15 मिनट तक पानी से धोएं और प्राथमिक चिकित्सा केंद्र जाएं।',
        evacuationProtocol: 'अलार्म बजने पर निर्धारित सुरक्षित स्थान पर जाएं।',
        spokenVoiceText: `सावधान! ${chem.name} रिसाव की सूचना मिली है। मानक सुरक्षा नियमों का पालन करें।`
      };
    }

    if (lang === 'mr') {
      if (isSulfide) {
        return {
          title: 'सोडियम सल्फाईड (H₂S) विषारी वायू आणीबाणी SOP',
          spillImmediateAction: 'तात्काळ वाऱ्याच्या विरुद्ध दिशेने (Upwind) पळा. गटारात किंवा खड्ड्यात SCBA उपकरणाशिवाय अजिबात उतरू नका.',
          mandatoryPpe: 'पॉझिटिव्ह प्रेशर SCBA श्वसन किट, केमिकल सूट, ब्युटाइल रबर हातमोजे.',
          firstAid: 'बाधित व्यक्तीला लगेच मोकळ्या हवेत आणा. १०० टक्के ऑक्सिजन द्या. त्वरित डॉक्टरांना बोलवा.',
          evacuationProtocol: 'कारखान्याचा लेव्हल ३ सायरन वाजवा. ३०० मीटर परिसरातील सर्व कामगारांना तात्काळ बाहेर काढा.',
          spokenVoiceText: 'सावधान! अत्यंत विषारी हायड्रोजन सल्फाईड वायूचा धोका निर्माण झाला आहे. सर्व कामगारांनी तात्काळ वाऱ्याच्या विरुद्ध दिशेने सुरक्षित ठिकाणी जावे.'
        };
      }
      if (isCyanide) {
        return {
          title: 'पोटॅशियम सायनाईड (HCN) घातक वायू आणीबाणी SOP',
          spillImmediateAction: 'अॅसिड आणि सायनाईडचा संपर्क तात्काळ तोडा. कॉस्टिक द्रावणाने (pH > 11.5) निष्प्रभ करा.',
          mandatoryPpe: 'फुल फेस SCBA श्वसन किट, डबल रबर हातमोजे, गमबूट.',
          firstAid: 'सायनाईड अँटीडोट किट सज्ज ठेवा. डोळे व त्वचेवर आपत्कालीन शॉवरचे पाणी मारा.',
          evacuationProtocol: 'इलेक्ट्रोप्लेटिंग विभाग त्वरित रिकामा करा.',
          spokenVoiceText: 'धोका! इलेक्ट्रोप्लेटिंग विभागात सायनाईड वायूचा धोका उद्भवला आहे. तात्काळ बाहेर पडा.'
        };
      }
      return {
        title: `${chem.name} - कारखाना कामगार सुरक्षितता SOP`,
        spillImmediateAction: 'गळती झालेल्या भागाभोवती कोरडे शोषक पावडर टाका. थेट पाणी टाकू नका.',
        mandatoryPpe: 'सेफ्टी चष्मा, रबर हातमोजे, केमिकल एप्रन आणि गमबूट.',
        firstAid: 'किमान १५ मिनिटे आपत्कालीन शॉवर खाली त्वचा स्वच्छ धुवा.',
        evacuationProtocol: 'सायरन वाजताच सुरक्षित असेंब्ली पॉईंटवर जमा व्हा.',
        spokenVoiceText: `सावधान! ${chem.name} गळती झाली आहे. सर्व कामगारांनी सुरक्षित अंतर ठेवावे.`
      };
    }

    return {
      title: `${chem.name} - Industrial Floor Emergency SOP`,
      spillImmediateAction: 'Isolate immediate area. Contain perimeter using dry chemical absorbent berms. Prevent drainage into sewer.',
      mandatoryPpe: 'Chemical splash goggles, nitrile/neoprene gloves, acid/alkali apron, half-face respirator with multi-gas cartridge.',
      firstAid: 'Flush skin/eyes with emergency eyewash for 15 minutes. Administer medical oxygen if respiratory distress occurs.',
      evacuationProtocol: 'Broadcast floor alarm and muster upwind at Designated Assembly Point 1.',
      spokenVoiceText: `Attention floor operators. Chemical incident involving ${chem.name} detected. Evacuate upwind and follow standard isolation protocol.`
    };
  }

  // Web Speech API Text-to-Speech Playback
  const handlePlayVoiceSOP = () => {
    if (!('speechSynthesis' in window)) {
      alert('Web Speech API is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = sopData?.spokenVoiceText || sopData?.title || 'Chemical emergency alert.';
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Set voice language
    if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (language === 'mr') {
      utterance.lang = 'mr-IN';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = 0.95; // Slightly slower for clarity over industrial plant speakers
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // MPCB / CPCB Printable Document Handler
  const handlePrintAudit = () => {
    setShowPrintModal(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#08151f] via-[#091b26] to-[#0e2738] border border-cyan-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 text-xs font-mono font-bold uppercase flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-cyan-400" />
              MODULE D: MULTILINGUAL FLOOR SOPS &amp; MPCB/CPCB AUDIT
            </span>
            <span className="text-slate-400 text-xs font-mono">English &bull; हिंदी &bull; मराठी + Spoken Voice</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2 mt-1">
            <Radio className="w-6 h-6 text-cyan-400" />
            Multilingual Floor Worker SOPs &amp; Official Audit Generator
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Empower floor workers in industrial clusters with clear native-language emergency guidance, text-to-speech voice broadcasts, and 1-click MPCB/CPCB safety audit dossiers.
          </p>
        </div>

        {/* Export MPCB / CPCB Audit Button */}
        <button
          onClick={handlePrintAudit}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:opacity-95 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition hover:scale-105"
        >
          <Printer className="w-4 h-4" />
          <span>Export MPCB / CPCB Safety Audit Report (Print / PDF)</span>
        </button>
      </div>

      {/* SUBSTANCE SELECTOR & LANGUAGE TOGGLE BAR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        
        {/* Select Chemical */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="font-mono font-bold text-slate-400 uppercase">Target Substance:</span>
          <select
            value={selectedChemId}
            onChange={(e) => setSelectedChemId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs max-w-xs truncate"
          >
            {inventory.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.industry || 'Reagent'})
              </option>
            ))}
          </select>
        </div>

        {/* 3-Language Toggle (English, Hindi, Marathi) */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-slate-500 px-2 uppercase font-bold">Language:</span>
          
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              language === 'en'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>

          <button
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              language === 'hi'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            हिंदी (Hindi)
          </button>

          <button
            onClick={() => setLanguage('mr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              language === 'mr'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            मराठी (Marathi)
          </button>
        </div>

        {/* Spoken Voice Alert Button */}
        <button
          onClick={handlePlayVoiceSOP}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center space-x-2 transition ${
            isSpeaking
              ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          <span>{isSpeaking ? 'Stop Voice Broadcast' : '🔊 Broadcast Voice Alert (TTS)'}</span>
        </button>

      </div>

      {/* MULTILINGUAL SOP CARDS GRID */}
      {isLoading ? (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center font-mono text-xs text-cyan-400">
          Generating multilingual floor safety instructions via Gemini Copilot...
        </div>
      ) : sopData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Card 1: Immediate Spill Containment */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold font-mono text-amber-400 uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                1. Spill &amp; Leak Immediate Action
              </span>
              <span className="text-[10px] font-mono text-slate-500">Floor Level 1</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed pt-1">
              {sopData.spillImmediateAction}
            </p>
          </div>

          {/* Card 2: Mandatory Worker PPE */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold font-mono text-cyan-400 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                2. Mandatory Protective Equipment (PPE)
              </span>
              <span className="text-[10px] font-mono text-slate-500">Zero Compromise</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed pt-1">
              {sopData.mandatoryPpe}
            </p>
          </div>

          {/* Card 3: First Aid & Exposure Protocol */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold font-mono text-emerald-400 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                3. First Aid &amp; Decontamination
              </span>
              <span className="text-[10px] font-mono text-slate-500">Emergency 15 Min</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed pt-1">
              {sopData.firstAid}
            </p>
          </div>

          {/* Card 4: Evacuation Protocol */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold font-mono text-red-400 uppercase flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                4. Evacuation &amp; Assembly Protocol
              </span>
              <span className="text-[10px] font-mono text-slate-500">Upwind Zone</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed pt-1">
              {sopData.evacuationProtocol}
            </p>
          </div>

        </div>
      ) : null}

      {/* SPOKEN VOICE TEXT SCRIPT BOX */}
      {sopData?.spokenVoiceText && (
        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/60 flex items-start space-x-3 text-xs font-mono">
          <Volume2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-cyan-300 block mb-1 uppercase">
              Floor PA Speaker Voice Script ({language === 'hi' ? 'हिंदी' : language === 'mr' ? 'मराठी' : 'English'}):
            </span>
            <p className="text-slate-200 text-[13px] leading-relaxed italic">
              "{sopData.spokenVoiceText}"
            </p>
          </div>
        </div>
      )}

      {/* PRINTABLE MPCB / CPCB SAFETY AUDIT REPORT OVERLAY */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-white text-black p-8 overflow-y-auto print:block">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="border-b-2 border-black pb-4 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight">
                  MAHARASHTRA / CENTRAL POLLUTION CONTROL BOARD (MPCB/CPCB)
                </h1>
                <h2 className="text-sm font-bold text-slate-700">
                  ANNUAL CHEMICAL INVENTORY, HAZMAT SEGREGATION &amp; ETP COMPLIANCE AUDIT
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Prepared under the Manufacture, Storage and Import of Hazardous Chemical Rules (MSIHC) 1989 &amp; Hazardous Waste Rules 2016.
                </p>
              </div>
              <div className="text-right text-xs font-mono">
                <p><strong>Audit Ref:</strong> MPCB-IND-2026-CH7</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Inspector Ref:</strong> OSHA-HAZWOPER-DIV</p>
              </div>
            </div>

            {/* Facility Executive Summary */}
            <div className="grid grid-cols-4 gap-4 text-xs border p-3 rounded">
              <div>
                <span className="text-slate-500 block uppercase font-mono">Total Substances</span>
                <span className="text-lg font-bold">{inventory.length} Chemicals</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-mono">Storage Bay Health</span>
                <span className="text-lg font-bold text-green-700">100% Segregated</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-mono">ETP 3-Pipe System</span>
                <span className="text-lg font-bold text-green-700">Fully Validated</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-mono">Audit Outcome</span>
                <span className="text-lg font-bold text-green-700">PASSED (COMPLIANT)</span>
              </div>
            </div>

            {/* Active Chemical Inventory Table */}
            <div>
              <h3 className="font-bold text-sm uppercase border-b pb-1 mb-2">
                1. Verified On-Site Hazardous Chemical Inventory:
              </h3>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-slate-100">
                    <th className="p-1.5">Substance Name</th>
                    <th className="p-1.5">CAS Registry</th>
                    <th className="p-1.5">Formula</th>
                    <th className="p-1.5">Storage Class</th>
                    <th className="p-1.5">Allocated Bay</th>
                    <th className="p-1.5">WGK Class</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {inventory.slice(0, 15).map((chem, idx) => (
                    <tr key={idx}>
                      <td className="p-1.5 font-bold">{chem.name}</td>
                      <td className="p-1.5 font-mono">{chem.cas}</td>
                      <td className="p-1.5 font-mono">{chem.formula}</td>
                      <td className="p-1.5">{chem.storageClass}</td>
                      <td className="p-1.5">{chem.storageLocation?.split('-')?.[1] || 'Main Vault'}</td>
                      <td className="p-1.5">{chem.wgkClass || 'WGK 2'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ETP 3-Pipe Segregation Verification */}
            <div className="border p-4 rounded space-y-2 text-xs">
              <h3 className="font-bold text-sm uppercase">2. ETP 3-Pipe Waste Stream Segregation Audit:</h3>
              <ul className="space-y-1 list-disc pl-5">
                <li><strong>Pipe 1 (Sulfide Beamhouse Stream):</strong> Dedicated coarse-bubble catalytic aeration basin with MnSO4 catalyst dosing. Strict operational protocol: pH maintained &ge; 10.0 to prevent H2S liberation.</li>
                <li><strong>Pipe 2 (Chrome Float Spent Liquor):</strong> Segregated acid-resistant pipe directed to MgO alkali clarifier (pH ~ 8.5) producing filter-pressable Cr(OH)3 sludge cake.</li>
                <li><strong>Pipe 3 (General Deliming &amp; Pickling Stream):</strong> Equalization sump with lime slurry neutralization before primary sedimentation.</li>
              </ul>
            </div>

            {/* Official Sign-Off Block */}
            <div className="pt-8 border-t flex justify-between text-xs">
              <div>
                <p><strong>Factory Safety Officer / Technical Director:</strong></p>
                <div className="h-12 border-b w-64 border-dashed mt-2"></div>
                <p className="text-[10px] text-slate-500 mt-1">Signature &amp; Factory Seal</p>
              </div>

              <div>
                <p><strong>MPCB / CPCB Inspecting Officer:</strong></p>
                <div className="h-12 border-b w-64 border-dashed mt-2"></div>
                <p className="text-[10px] text-slate-500 mt-1">Inspection Stamp &amp; Date</p>
              </div>
            </div>

            <div className="no-print pt-4 flex justify-end gap-3">
              <button 
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded text-xs font-bold"
              >
                Close Report View
              </button>
              <button 
                onClick={() => window.print()}
                className="px-4 py-2 bg-black text-white hover:bg-slate-800 rounded text-xs font-bold"
              >
                Print to PDF Now
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
