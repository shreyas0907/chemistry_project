import React, { useState } from 'react';
import { 
  Layers, Search, Plus, Trash2, AlertTriangle, ShieldCheck, 
  ShieldAlert, CheckCircle2, Info, ArrowRight, Zap, X, 
  BookOpen, HelpCircle, AlertOctagon, Sparkles, RefreshCw
} from 'lucide-react';
import { 
  VERIFIED_REACTANT_SUBSTANCES, 
  evaluateChemicalReactants 
} from '../data/verifiedReactionsData';

export default function CompatibilityModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReactants, setSelectedReactants] = useState([
    VERIFIED_REACTANT_SUBSTANCES.find(s => s.formula === 'Na2S') || VERIFIED_REACTANT_SUBSTANCES[10],
    VERIFIED_REACTANT_SUBSTANCES.find(s => s.formula === 'H2SO4') || VERIFIED_REACTANT_SUBSTANCES[0]
  ]);

  const [analysisResult, setAnalysisResult] = useState(() => {
    return evaluateChemicalReactants([
      VERIFIED_REACTANT_SUBSTANCES.find(s => s.formula === 'Na2S') || VERIFIED_REACTANT_SUBSTANCES[10],
      VERIFIED_REACTANT_SUBSTANCES.find(s => s.formula === 'H2SO4') || VERIFIED_REACTANT_SUBSTANCES[0]
    ]);
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Filtered dropdown for adding new reactants
  const availableSubstances = VERIFIED_REACTANT_SUBSTANCES.filter(sub => {
    const term = searchTerm.toLowerCase().trim();
    const alreadySelected = selectedReactants.some(r => r.id === sub.id);
    if (alreadySelected) return false;
    if (!term) return true;
    return (
      sub.name.toLowerCase().includes(term) ||
      sub.formula.toLowerCase().includes(term) ||
      (sub.cas && sub.cas.toLowerCase().includes(term))
    );
  });

  const handleAddReactant = (substance) => {
    if (selectedReactants.some(r => r.id === substance.id)) return;
    const updated = [...selectedReactants, substance];
    setSelectedReactants(updated);
    setSearchTerm('');
  };

  const handleRemoveReactant = (id) => {
    const updated = selectedReactants.filter(r => r.id !== id);
    setSelectedReactants(updated);
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = evaluateChemicalReactants(selectedReactants);
      setAnalysisResult(res);
      setIsAnalyzing(false);
    }, 200);
  };

  // Quick preset pairings
  const handleApplyPreset = (formulaA, formulaB) => {
    const chemA = VERIFIED_REACTANT_SUBSTANCES.find(s => s.formula === formulaA);
    const chemB = VERIFIED_REACTANT_SUBSTANCES.find(s => s.formula === formulaB);
    if (chemA && chemB) {
      const pair = [chemA, chemB];
      setSelectedReactants(pair);
      setIsAnalyzing(true);
      setTimeout(() => {
        setAnalysisResult(evaluateChemicalReactants(pair));
        setIsAnalyzing(false);
      }, 150);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Description */}
      <div className="pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Layers className="w-6 h-6 text-teal-600" />
          <h1 className="text-2xl font-bold text-slate-900">
            Chemical Compatibility &amp; Reaction Product Prediction
          </h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Select multiple chemical reactants to check verified empirical compatibility, known reaction products, byproducts, and balanced equations.
        </p>
      </div>

      {/* Quick Test Presets */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-500 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Reaction Demos:</span>
        </span>
        {[
          { label: 'Na2S + H2SO4 (Fatal H2S Gas)', a: 'Na2S', b: 'H2SO4' },
          { label: 'KCN + HCl (Fatal HCN Poison)', a: 'KCN', b: 'HCl' },
          { label: 'NaOH + HCl (Neutralization)', a: 'NaOH', b: 'HCl' },
          { label: 'H2O2 + Isopropanol (Flash Redox)', a: 'H2O2', b: 'C3H8O' },
          { label: 'NaOCl + NH4OH (Chloramine Gas)', a: 'NaOCl', b: 'NH4OH' },
          { label: 'Basic Chrome + NaOH (Precipitation)', a: 'Cr(OH)SO4', b: 'NaOH' },
          { label: 'NaCl + Water (Non-Reactive)', a: 'NaCl', b: 'H2O' }
        ].map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleApplyPreset(preset.a, preset.b)}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-medium transition shadow-xs"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* 2. Reactant Selection Workspace */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">1. Select Reactants for Analysis</h2>
            <p className="text-xs text-slate-500">Choose two or more chemical substances from the verified industrial formulary.</p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold self-start sm:self-auto">
            {selectedReactants.length} Reactants Selected
          </span>
        </div>

        {/* Selected Reactants Tag Bar */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Current Reactant Chamber:
          </label>
          {selectedReactants.length === 0 ? (
            <div className="p-4 rounded-lg bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-400">
              No chemical substances selected. Search below to add reactants.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {selectedReactants.map((chem, idx) => (
                <div
                  key={chem.id || idx}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs shadow-sm"
                >
                  <span className="font-semibold">{chem.name}</span>
                  <span className="font-mono text-teal-300 text-[11px]">({chem.formula})</span>
                  <button
                    onClick={() => handleRemoveReactant(chem.id)}
                    className="p-0.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition"
                    title="Remove reactant"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search & Add Reactant Box */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700">
            Search Chemical Substance by Name or Formula:
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type to search (e.g. Sulfuric, Na2S, Sodium Hydroxide, H2O2, HCl)..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 bg-white"
            />
          </div>

          {/* Search Dropdown Results */}
          {searchTerm && (
            <div className="border border-slate-200 rounded-lg max-h-48 overflow-y-auto bg-white divide-y divide-slate-100 shadow-sm text-xs">
              {availableSubstances.length === 0 ? (
                <div className="p-3 text-slate-400 text-center text-xs">
                  No matching chemical found in the verified catalog.
                </div>
              ) : (
                availableSubstances.map(sub => (
                  <div
                    key={sub.id}
                    onClick={() => handleAddReactant(sub)}
                    className="p-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{sub.name}</span>
                      <span className="font-mono text-slate-500 ml-2">({sub.formula})</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">CAS: {sub.cas}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-[11px] text-slate-400 font-mono">
            *Verified against NOAA CAMEO, CRC Handbook &amp; NIOSH standards
          </span>

          <button
            onClick={handleRunAnalysis}
            disabled={selectedReactants.length < 2 || isAnalyzing}
            className="px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center space-x-2 transition shadow-sm"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Evaluating Reaction Chemistry...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Analyse Compatibility &amp; Predict Products</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Structured Analysis Results Interface */}
      {analysisResult && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          
          {/* Compatibility Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                COMPATIBILITY ASSESSMENT STATUS:
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-base font-bold px-3 py-1 rounded-lg inline-flex items-center gap-1.5 ${
                  analysisResult.compatibilityStatus === 'Known Incompatibility'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : analysisResult.compatibilityStatus === 'Known Reaction'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : analysisResult.compatibilityStatus === 'No known reaction found in the database'
                    ? 'bg-slate-100 text-slate-700 border border-slate-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {analysisResult.compatibilityStatus === 'Known Incompatibility' ? (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  ) : analysisResult.compatibilityStatus === 'Known Reaction' ? (
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Info className="w-4 h-4 text-slate-600" />
                  )}
                  <span>{analysisResult.compatibilityStatus.toUpperCase()}</span>
                </span>
              </div>
            </div>

            {analysisResult.reactionType && (
              <div className="text-right self-start sm:self-auto">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Reaction Classification</span>
                <span className="text-xs font-semibold text-slate-800 font-mono">
                  {analysisResult.reactionType}
                </span>
              </div>
            )}
          </div>

          {/* Hazardous Hazard Flags Alert */}
          {analysisResult.hazardFlags && analysisResult.hazardFlags.length > 0 && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-red-800 block">
                  CRITICAL ACCIDENT PRECAUTIONS:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {analysisResult.hazardFlags.map((flag, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 rounded bg-red-100 border border-red-300 text-red-800 text-[10px] font-mono font-bold uppercase"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Balanced Chemical Equation Box */}
          {analysisResult.balancedEquation && (
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1.5 font-mono">
              <span className="text-[10px] tracking-wider text-teal-300 uppercase block font-bold">
                Balanced Stoichiometric Chemical Equation:
              </span>
              <p className="text-sm sm:text-base font-bold text-white tracking-wide">
                {analysisResult.balancedEquation}
              </p>
            </div>
          )}

          {/* Products & Byproducts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Verified Products */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Major Reaction Products:</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {analysisResult.primaryProducts?.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-teal-600 font-bold">•</span>
                    <span className="font-medium">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Known Byproducts */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-600" />
                <span>Documented Byproducts &amp; Energy Dynamics:</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {analysisResult.byproducts?.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Scientific Explanation */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-slate-600" />
              <span>Scientific Explanation &amp; Mechanism:</span>
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {analysisResult.scientificExplanation}
            </p>
          </div>

          {/* Authoritative Source Reference */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 font-mono gap-1">
            <span>Authoritative Source &amp; Literature Reference:</span>
            <span className="text-slate-800 font-semibold">{analysisResult.authoritativeSource}</span>
          </div>

        </div>
      )}

      {/* Safety Notice */}
      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
        <strong>Scientific Accuracy and Chemical Safety Rules:</strong> ChemAssist uses an authoritative, curated reaction database. The platform does not generate unverified equations or assume that unverified mixtures are safe. Never physically mix unknown, untested, or incompatible chemical substances. The predictions displayed above are for industrial storage safety and containment decision support only.
      </div>

    </div>
  );
}
