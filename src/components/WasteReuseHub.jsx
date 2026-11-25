import React, { useState, useMemo } from 'react';
import { 
  Recycle, 
  Layers, 
  Sparkles, 
  FlaskConical, 
  ArrowRight, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Printer, 
  Download, 
  ExternalLink, 
  Info, 
  TrendingUp, 
  Leaf, 
  Factory, 
  RotateCcw, 
  ChevronRight, 
  Zap, 
  X,
  Gauge,
  Sliders,
  Compass
} from 'lucide-react';
import { 
  WASTE_INDUSTRIES, 
  VERIFIED_WASTE_STREAMS, 
  SAMPLE_WASTE_PRESETS 
} from '../data/wasteValorisationData';
import { analyzeIndustrialWaste, getWasteValorisationStats } from '../services/wasteValorisationEngine';

export default function WasteReuseHub({ onSelectChemical }) {
  // Global engine statistics
  const stats = useMemo(() => getWasteValorisationStats(), []);

  // Form State
  const [selectedIndustry, setSelectedIndustry] = useState('leather');
  const [selectedWasteId, setSelectedWasteId] = useState('waste-leather-2'); // Default to Chrome Shavings
  const [customWasteName, setCustomWasteName] = useState('');
  const [customComposition, setCustomComposition] = useState('');
  const [quantity, setQuantity] = useState('2500 kg / batch');
  const [contaminants, setContaminants] = useState('Trivalent Chromium Cr(III), Residual acid');

  // Analysis result state
  const [analysisResult, setAnalysisResult] = useState(() => {
    return analyzeIndustrialWaste({
      industryId: 'leather',
      wasteId: 'waste-leather-2',
      wasteName: 'Wet Blue Chrome Shavings & Splits',
      customComposition: 'Collagen-Cr(III) cross-linked matrix 75%, Cr2O3 3.8%, Moisture 40%, Sulfate salts 4%',
      quantity: '2500 kg / batch',
      contaminants: 'Trivalent Chromium Cr(III), Residual pickling acids'
    });
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'recovery' | 'reuse' | 'sustainability' | 'safety'
  const [showMatrixModal, setShowMatrixModal] = useState(false);

  // Available streams for currently selected industry
  const currentIndustryStreams = useMemo(() => {
    return VERIFIED_WASTE_STREAMS.filter(s => s.industryId === selectedIndustry);
  }, [selectedIndustry]);

  // Handle Industry Card Click
  const handleIndustryChange = (indId) => {
    setSelectedIndustry(indId);
    const firstStream = VERIFIED_WASTE_STREAMS.find(s => s.industryId === indId);
    if (firstStream) {
      setSelectedWasteId(firstStream.id);
      setCustomWasteName(firstStream.name);
      setCustomComposition(firstStream.typicalComposition);
      setQuantity('1000 kg / campaign');
      setContaminants('');
    }
  };

  // Handle Stream Dropdown Selection
  const handleStreamSelect = (streamId) => {
    setSelectedWasteId(streamId);
    const found = VERIFIED_WASTE_STREAMS.find(s => s.id === streamId);
    if (found) {
      setCustomWasteName(found.name);
      setCustomComposition(found.typicalComposition);
      setContaminants('');
    }
  };

  // Handle Preset Selection
  const handleApplyPreset = (preset) => {
    setSelectedIndustry(preset.industryId);
    setSelectedWasteId(preset.wasteId);
    setCustomWasteName(preset.customName);
    setCustomComposition(preset.chemicalComposition);
    setQuantity(preset.quantity);
    setContaminants(preset.contaminants);

    // Auto-trigger analysis
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeIndustrialWaste({
        industryId: preset.industryId,
        wasteId: preset.wasteId,
        wasteName: preset.customName,
        customComposition: preset.chemicalComposition,
        quantity: preset.quantity,
        contaminants: preset.contaminants
      });
      setAnalysisResult(res);
      setIsAnalyzing(false);
    }, 250);
  };

  // Trigger Analysis
  const handleRunAnalysis = (e) => {
    if (e) e.preventDefault();
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeIndustrialWaste({
        industryId: selectedIndustry,
        wasteId: selectedWasteId,
        wasteName: customWasteName,
        customComposition,
        quantity,
        contaminants
      });
      setAnalysisResult(res);
      setIsAnalyzing(false);
    }, 250);
  };

  // Print Dossier Handler
  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP HEADER & CIRCULAR ECONOMY METRIC STRIP */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#07131b] via-[#091822] to-[#0d222e] border border-cyan-500/25 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                CIRCULAR ECONOMY PLATFORM
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Leather • Cosmetics • Pharmaceuticals
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-2.5">
              <Recycle className="w-7 h-7 text-emerald-400" />
              <span>Industrial Waste <span className="text-emerald-400">Analysis &amp; Recommendations</span></span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Intelligent waste valorisation engine. Identifies industrial side-streams, evaluates chemical hazards, and matches secondary resources across industrial boundaries.
            </p>
          </div>

          {/* Quick Metrics & Matrix Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Verified Pathways</span>
                <span className="text-cyan-400 font-bold text-sm">{stats.totalStreams} Streams</span>
              </div>
              <div className="h-7 w-[1px] bg-slate-800" />
              <div>
                <span className="text-slate-400 block text-[10px]">Cross-Industry Uses</span>
                <span className="text-emerald-400 font-bold text-sm">{stats.totalPossibleApplications}+ Apps</span>
              </div>
              <div className="h-7 w-[1px] bg-slate-800" />
              <div>
                <span className="text-slate-400 block text-[10px]">Avg Circularity</span>
                <span className="text-purple-400 font-bold text-sm">{stats.averageCircularityIndex}/100</span>
              </div>
            </div>

            <button
              onClick={() => setShowMatrixModal(true)}
              className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center space-x-2 transition"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Cross-Industry Matrix</span>
            </button>

            <button
              onClick={handlePrintDossier}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 text-xs font-bold flex items-center space-x-2 transition shadow-lg shadow-emerald-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print Audit Dossier</span>
            </button>
          </div>
        </div>

        {/* Quick Presets Strip */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1 shrink-0">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Quick Demos:
          </span>
          {SAMPLE_WASTE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="px-3 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-slate-300 text-[11px] whitespace-nowrap transition flex items-center space-x-1.5"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                preset.industryId === 'leather' ? 'bg-amber-400' :
                preset.industryId === 'cosmetics' ? 'bg-emerald-400' : 'bg-purple-400'
              }`} />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. THREE SELECTABLE INDUSTRY CARDS */}
      <div>
        <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Factory className="w-3.5 h-3.5 text-cyan-400" />
          <span>Step 1: Select Source Industry Category</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {WASTE_INDUSTRIES.map((ind) => {
            const isSelected = selectedIndustry === ind.id;
            const Icon = ind.id === 'leather' ? Layers : ind.id === 'cosmetics' ? Sparkles : FlaskConical;
            return (
              <div
                key={ind.id}
                onClick={() => handleIndustryChange(ind.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 relative overflow-hidden group ${
                  isSelected 
                    ? 'bg-[#0a1824] border-cyan-500 shadow-xl shadow-cyan-950/40 scale-[1.01]' 
                    : 'bg-[#08121a]/80 border-slate-800 hover:border-slate-700 hover:bg-[#091520]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl border ${
                    ind.id === 'leather' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                    ind.id === 'cosmetics' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    'bg-purple-500/10 border-purple-500/30 text-purple-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-700 font-mono">
                      Active Source
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition">
                    {ind.name}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                    {ind.badge}
                  </span>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {ind.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">
                    {stats.industryCounts[ind.id]} Verified Streams
                  </span>
                  <span className={`font-bold flex items-center gap-1 ${
                    isSelected ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}>
                    <span>Configure</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. WASTE INPUT & PARAMETERS FORM */}
      <div className="p-6 rounded-2xl bg-[#091117] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Step 2: Define Waste Stream &amp; Contamination Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select an established industrial byproduct or enter custom lot specifics for valorisation matching.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            Sector: <strong className="text-cyan-300">{WASTE_INDUSTRIES.find(i => i.id === selectedIndustry)?.name}</strong>
          </span>
        </div>

        <form onSubmit={handleRunAnalysis} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Field 1: Stream Dropdown */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Predefined Waste Category:
              </label>
              <select
                value={selectedWasteId}
                onChange={(e) => handleStreamSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-slate-200 text-xs font-medium"
              >
                {currentIndustryStreams.map(stream => (
                  <option key={stream.id} value={stream.id}>
                    {stream.name} ({stream.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Field 2: Custom Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Waste Material Name / Lot ID:
              </label>
              <input
                type="text"
                value={customWasteName}
                onChange={(e) => setCustomWasteName(e.target.value)}
                placeholder="e.g. Wet Blue Chrome Shavings, Spent IPA Mother Liquor"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-slate-200 text-xs font-medium"
              />
            </div>

            {/* Field 3: Quantity */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Generated Quantity &amp; Frequency:
              </label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 2,500 kg / batch, 50 kL / month"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-slate-200 text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field 4: Chemical Composition */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Chemical Composition / Assay (Known Constituents):
              </label>
              <textarea
                rows={2}
                value={customComposition}
                onChange={(e) => setCustomComposition(e.target.value)}
                placeholder="e.g. Type I Collagen 75%, Cr2O3 3.8%, Moisture 40%, Residual salts 4%"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-slate-200 text-xs font-medium font-mono"
              />
            </div>

            {/* Field 5: Known Contaminants */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Known Contaminants &amp; Toxicity Inhibitors:
              </label>
              <textarea
                rows={2}
                value={contaminants}
                onChange={(e) => setContaminants(e.target.value)}
                placeholder="e.g. Hexavalent Chromium traces, Active drug APIs, Silicone oils, Sodium sulfide"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-slate-200 text-xs font-medium font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400 font-mono">
              *Enforces CPCB/MPCB Hazardous Wastes Rules 2016, EPA RCRA, and REACH Annex XVII
            </span>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:opacity-95 text-slate-950 font-bold text-xs flex items-center space-x-2 transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Chemical Pathways...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Analyse Waste &amp; Match Reuse</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 4. ACTIVE SAFETY RESTRICTION ALERTS (If triggered) */}
      {analysisResult.safetyAudit.warnings.length > 0 && (
        <div className="space-y-3">
          {analysisResult.safetyAudit.warnings.map((warn, i) => (
            <div 
              key={i}
              className="p-4 rounded-2xl bg-red-950/60 border border-red-500/50 shadow-xl flex items-start space-x-3.5"
            >
              <div className="p-2 rounded-xl bg-red-900/60 border border-red-500 text-red-300 shrink-0">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-900 text-red-200 border border-red-700">
                    {warn.severity}: MANDATORY CHEMICAL SAFETY RESTRICTION
                  </span>
                  <span className="text-xs text-red-300 font-bold">{warn.title}</span>
                </div>
                <p className="text-xs text-red-200/90 mt-1 leading-relaxed">
                  {warn.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. MULTI-TAB RESULTS SYSTEM */}
      <div className="bg-[#08121a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        
        {/* Results Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-cyan-400">
                VALORISATION PROFILE:
              </span>
              <span className="text-sm font-bold text-white">
                {analysisResult.wasteProfile.wasteName}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                analysisResult.wasteProfile.hazardLevel.includes('Critical') 
                  ? 'bg-red-950 text-red-400 border border-red-800' 
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {analysisResult.wasteProfile.hazardLevel}
              </span>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {[
              { id: 'profile', label: 'A. Waste Profile' },
              { id: 'recovery', label: 'B. Recovery Method' },
              { id: 'reuse', label: 'C. Reuse Opportunities', badge: analysisResult.reuseOpportunities.length },
              { id: 'sustainability', label: 'D. Sustainability Impact' },
              { id: 'safety', label: 'E. Safety & Feasibility' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    activeTab === tab.id ? 'bg-slate-950 text-cyan-400' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION A: WASTE PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block">Source Industry</span>
                <span className="text-sm font-bold text-white mt-1 block">
                  {analysisResult.wasteProfile.sourceIndustry}
                </span>
                <span className="text-[10px] font-mono text-cyan-400 block mt-0.5">
                  {analysisResult.wasteProfile.industryBadge}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block">Waste Classification</span>
                <span className="text-sm font-bold text-white mt-1 block">
                  {analysisResult.wasteProfile.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                  State: {analysisResult.wasteProfile.physicalState}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block">Logged Quantity</span>
                <span className="text-sm font-bold text-white mt-1 block">
                  {analysisResult.wasteProfile.quantityLogged}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">
                  Industrial Secondary Sourcing
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block">Hazard Profile</span>
                <span className={`text-sm font-bold mt-1 block ${
                  analysisResult.wasteProfile.hazardLevel.includes('Critical') ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {analysisResult.wasteProfile.hazardLevel}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                  CPCB Schedule II / EPA RCRA
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Chemical Composition &amp; Molecular Matrix:</span>
              </span>
              <p className="text-xs font-mono text-slate-200 bg-black/40 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                {analysisResult.wasteProfile.chemicalComposition}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Environmental &amp; Ecological Concerns (If Unregulated):</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysisResult.wasteProfile.environmentalConcerns}
              </p>
            </div>
          </div>
        )}

        {/* SECTION B: RECOMMENDED RECOVERY METHOD */}
        {activeTab === 'recovery' && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    SCIENTIFICALLY ESTABLISHED RECOVERY PROCESS
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1.5 flex items-center gap-2">
                    <Recycle className="w-5 h-5 text-cyan-400" />
                    <span>{analysisResult.recoveryMethod.name}</span>
                  </h3>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  {analysisResult.recoveryMethod.technologyReadinessLevel}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <h4 className="text-xs font-mono font-bold text-slate-400 mb-1">
                  Chemical Principles &amp; Reaction Kinetics:
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed bg-black/40 p-3.5 rounded-lg border border-slate-800">
                  {analysisResult.recoveryMethod.scientificExplanation}
                </p>
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-mono font-bold text-slate-400 mb-1">
                  Required Operational Treatment Stages:
                </h4>
                <p className="text-xs font-mono text-cyan-200/90 leading-relaxed bg-cyan-950/20 p-3 rounded-lg border border-cyan-900/40">
                  {analysisResult.recoveryMethod.requiredProcessing}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION C: CROSS-INDUSTRY REUSE OPPORTUNITIES */}
        {activeTab === 'reuse' && (
          <div className="space-y-4">
            
            {/* Visual Cross-Industry Flow Banner */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                  Cross-Industry Material Flow Circuit:
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  {analysisResult.targetIndustriesList.length} Connected Destination Sectors
                </span>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 rounded-lg bg-black/40 border border-slate-800/80 text-xs font-mono">
                <div className="text-center md:text-left">
                  <span className="text-slate-500 text-[10px] block">SOURCE INDUSTRY</span>
                  <span className="font-bold text-amber-400">{analysisResult.wasteProfile.sourceIndustry}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 hidden md:block" />
                <div className="text-center">
                  <span className="text-slate-500 text-[10px] block">RECOVERY PROCESS</span>
                  <span className="font-bold text-cyan-300">{analysisResult.recoveryMethod.name.slice(0, 32)}...</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 hidden md:block" />
                <div className="text-center md:text-right">
                  <span className="text-slate-500 text-[10px] block">TARGET INDUSTRIAL SECTORS</span>
                  <span className="font-bold text-emerald-400">{analysisResult.targetIndustriesList.slice(0, 3).join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Reuse Opportunity Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {analysisResult.reuseOpportunities.map((opp, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 ${
                    opp.isBanned 
                      ? 'bg-red-950/20 border-red-500/40 opacity-70' 
                      : 'bg-slate-950 border-slate-800 hover:border-emerald-500/50 transition'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {opp.maturity}
                      </span>
                      {opp.isBanned && (
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-900 text-red-200">
                          RESTRICTED
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white mt-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{opp.recoveredMaterial}</span>
                    </h4>

                    {/* Cross-Industry Narrative */}
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-[#0a151f] p-3 rounded-lg border border-slate-800/80">
                      <strong className="text-cyan-400 font-mono block mb-1">Cross-Industry Pathway:</strong>
                      {opp.crossIndustryPathway}
                    </p>

                    {/* Specific Applications */}
                    <div className="mt-3 space-y-1.5">
                      <span className="text-[11px] font-mono text-slate-400 block font-bold">
                        Possible Industrial Applications:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {opp.possibleApplications.map((app, appIdx) => (
                          <li key={appIdx} className="flex items-start space-x-2">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{app}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-slate-500">Target Industries:</span>
                    <div className="flex flex-wrap gap-1">
                      {opp.targetIndustries.map((tInd, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 text-[10px]">
                          {tInd}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* SECTION D: SUSTAINABILITY IMPACT */}
        {activeTab === 'sustainability' && (
          <div className="space-y-4">
            
            {/* 4 Metric Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block">Circularity Index</span>
                <span className="text-3xl font-black font-mono text-purple-400 mt-1 block">
                  {analysisResult.sustainability.circularityIndex} / 100
                </span>
                <span className="text-[10px] font-mono text-purple-300/80 block mt-1">
                  {analysisResult.sustainability.circularEconomyTier}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block">Waste Reduction Potential</span>
                <span className="text-3xl font-black font-mono text-emerald-400 mt-1 block">
                  {analysisResult.sustainability.wasteReductionPct}%
                </span>
                <span className="text-[10px] font-mono text-slate-400 block mt-1">
                  Landfill &amp; TSDF Diversion Rate
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block">CO₂ Abatement Potential</span>
                <span className="text-3xl font-black font-mono text-cyan-400 mt-1 block">
                  ~{analysisResult.sustainability.co2AbatementKgPerTon}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block mt-1">
                  kg CO₂ eq / ton waste valorised
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block">Virgin Resource Status</span>
                <span className="text-sm font-bold text-white mt-1 block">
                  Primary Substitution
                </span>
                <span className="text-[10px] font-mono text-emerald-400 block mt-1">
                  High Net Fossil Offset
                </span>
              </div>
            </div>

            {/* Resource Conservation Narrative */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <Leaf className="w-4 h-4" />
                <span>Virgin Resource Conservation &amp; Carbon Neutrality Benefits:</span>
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {analysisResult.sustainability.resourceConservation}
              </p>
            </div>

          </div>
        )}

        {/* SECTION E: SAFETY & FEASIBILITY ASSESSMENT */}
        {activeTab === 'safety' && (
          <div className="space-y-4">
            
            {/* Feasibility Rating Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono text-slate-400 block">Commercial &amp; Technical Feasibility:</span>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xl font-black font-mono px-3 py-1 rounded-lg ${
                    analysisResult.safetyAndFeasibility.feasibilityRating === 'High'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : analysisResult.safetyAndFeasibility.feasibilityRating === 'Medium'
                      ? 'bg-amber-950 text-amber-300 border border-amber-700'
                      : 'bg-red-950 text-red-300 border border-red-700'
                  }`}>
                    {analysisResult.safetyAndFeasibility.feasibilityRating.toUpperCase()} FEASIBILITY
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 max-w-xl">
                {analysisResult.safetyAndFeasibility.feasibilityExplanation}
              </p>
            </div>

            {/* Restricted Applications Red Box */}
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 space-y-1.5">
              <div className="flex items-center space-x-2 text-red-300 font-bold text-xs font-mono">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>EXPLICITLY RESTRICTED / BANNED REUSE APPLICATIONS:</span>
              </div>
              <p className="text-xs text-red-200 leading-relaxed">
                {analysisResult.safetyAndFeasibility.restrictedApplications}
              </p>
            </div>

            {/* Contamination Risks & Mandatory Quality Checks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Contamination &amp; Cross-Reactivity Risks:</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysisResult.safetyAndFeasibility.contaminationRisks}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Mandatory Analytical Testing &amp; Quality Checks:</span>
                </span>
                <p className="text-xs font-mono text-cyan-200/90 leading-relaxed bg-black/40 p-2.5 rounded-lg border border-slate-800">
                  {analysisResult.safetyAndFeasibility.mandatoryQualityChecks}
                </p>
              </div>
            </div>

            {/* Regulatory Considerations */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-xs font-mono font-bold text-slate-400 block">
                Statutory Regulatory Mandates &amp; Manifest Tracking:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysisResult.safetyAndFeasibility.regulatoryConsiderations}
              </p>
            </div>

          </div>
        )}

      </div>

      {/* 6. CROSS-INDUSTRY SYNERGY MATRIX MODAL */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-4xl w-full bg-[#08121a] border border-cyan-500/50 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">
                  Cross-Industry Circular Economy Exchange Matrix
                </h3>
              </div>
              <button
                onClick={() => setShowMatrixModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Maps how secondary raw materials generated by Leather Tanning, Cosmetics, and Pharmaceutical manufacturing circulate into alternative industrial sectors.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <th className="p-2.5">Source Industry</th>
                    <th className="p-2.5">Waste Stream</th>
                    <th className="p-2.5">Recovered Secondary Material</th>
                    <th className="p-2.5">Target Absorbing Industry</th>
                    <th className="p-2.5">Primary Benefit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  <tr>
                    <td className="p-2.5 text-amber-400 font-bold">Leather Tanning</td>
                    <td className="p-2.5">Untanned trimmings</td>
                    <td className="p-2.5 text-cyan-300">Collagen peptides &amp; gelatin</td>
                    <td className="p-2.5 text-emerald-400">Agrochemicals &amp; Wood Adhesives</td>
                    <td className="p-2.5 text-slate-400">Replaces formaldehyde resins</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-amber-400 font-bold">Leather Tanning</td>
                    <td className="p-2.5">Wet blue shavings</td>
                    <td className="p-2.5 text-cyan-300">Basic Chromium Sulfate (BCS)</td>
                    <td className="p-2.5 text-emerald-400">Closed-Loop Tannery &amp; Pigments</td>
                    <td className="p-2.5 text-slate-400">Prevents chromite ore mining</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-amber-400 font-bold">Leather Tanning</td>
                    <td className="p-2.5">Limed fleshings</td>
                    <td className="p-2.5 text-cyan-300">Technical tallow &amp; Biogas</td>
                    <td className="p-2.5 text-emerald-400">Biofuels (FAME Biodiesel)</td>
                    <td className="p-2.5 text-slate-400">Offsets petroleum diesel</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-emerald-400 font-bold">Cosmetics</td>
                    <td className="p-2.5">Crude glycerol</td>
                    <td className="p-2.5 text-cyan-300">Technical-grade 99% Glycerol</td>
                    <td className="p-2.5 text-emerald-400">Polyurethanes &amp; Cement Grinding</td>
                    <td className="p-2.5 text-slate-400">Replaces fossil polyols</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-emerald-400 font-bold">Cosmetics</td>
                    <td className="p-2.5">Lipid washings</td>
                    <td className="p-2.5 text-cyan-300">Biolubricants &amp; Mold Release</td>
                    <td className="p-2.5 text-emerald-400">Construction Precast Formwork</td>
                    <td className="p-2.5 text-slate-400">Eliminates toxic petroleum mold oils</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-emerald-400 font-bold">Cosmetics</td>
                    <td className="p-2.5">Spent botanical marc</td>
                    <td className="p-2.5 text-cyan-300">Humic compost &amp; Bio-sorbent</td>
                    <td className="p-2.5 text-emerald-400">Commercial Agriculture &amp; Plating</td>
                    <td className="p-2.5 text-slate-400">Sequesters heavy metals</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-purple-400 font-bold">Pharmaceuticals</td>
                    <td className="p-2.5">Mother liquor solvents</td>
                    <td className="p-2.5 text-cyan-300">Distilled IPA, Toluene, EtOAc</td>
                    <td className="p-2.5 text-emerald-400">Paints, Resins &amp; Printing Inks</td>
                    <td className="p-2.5 text-slate-400">Saves 2.5 t CO₂/t recovered</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-purple-400 font-bold">Pharmaceuticals</td>
                    <td className="p-2.5">Blister pack scrap</td>
                    <td className="p-2.5 text-cyan-300">Secondary Aluminum Ingots</td>
                    <td className="p-2.5 text-emerald-400">Automotive Engine Die-Casting</td>
                    <td className="p-2.5 text-slate-400">Saves 95% smelting electricity</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-purple-400 font-bold">Pharmaceuticals</td>
                    <td className="p-2.5">Spent Pd/C catalysts</td>
                    <td className="p-2.5 text-cyan-300">Refined Palladium &amp; Platinum</td>
                    <td className="p-2.5 text-emerald-400">Automotive Catalytic Converters</td>
                    <td className="p-2.5 text-slate-400">Avoids deep-earth mining emissions</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-purple-400 font-bold">Pharmaceuticals</td>
                    <td className="p-2.5">Expired finished drugs</td>
                    <td className="p-2.5 text-cyan-300">Alternative Fuel &amp; Raw Material</td>
                    <td className="p-2.5 text-emerald-400">Cement Clinker Rotary Kilns</td>
                    <td className="p-2.5 text-slate-400">Zero AMR release; coal offset</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowMatrixModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Close Matrix View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
