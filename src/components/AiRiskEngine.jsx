import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Brain, 
  Flame, 
  Skull, 
  Droplets, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Sliders, 
  FileText, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Thermometer, 
  Wind, 
  Copy, 
  Check 
} from 'lucide-react';
import { evaluatePairCompatibility } from '../services/chemicalSafetyEngine';

const STORAGE_ENVIRONMENTS = [
  { id: 'rack', name: 'Indoor Pallet Racks (Open Warehouse)', riskMultiplier: 1.2 },
  { id: 'tank', name: 'Dedicated Bunded Tank Farm (Outdoor)', riskMultiplier: 0.9 },
  { id: 'vault', name: 'Flammable/Solvent Fire Vault (ATEX Zone 1)', riskMultiplier: 0.8 },
  { id: 'trench', name: 'Floor Drainage Sump / Open Trench', riskMultiplier: 1.8 },
  { id: 'cleanroom', name: 'Pharma GMP Cleanroom Suite', riskMultiplier: 0.7 }
];

const APPLICATIONS = [
  'Leather Tanning & Beamhouse Processing',
  'Pharmaceutical API Chemical Synthesis',
  'Cosmetics & Personal Care Formulation',
  'General Bulk Chemical Processing'
];

export default function AiRiskEngine({ inventory = [], onSelectChemical }) {
  const [primaryChemId, setPrimaryChemId] = useState(inventory[0]?.id || '');
  const [nearbyChemIds, setNearbyChemIds] = useState(() => [inventory[1]?.id, inventory[2]?.id].filter(Boolean));
  const [storageEnvId, setStorageEnvId] = useState('rack');
  const [ambientTemp, setAmbientTemp] = useState(28); // °C
  const [ventilation, setVentilation] = useState('forced'); // 'forced' | 'natural' | 'enclosed'
  const [application, setApplication] = useState(APPLICATIONS[0]);
  const [copied, setCopied] = useState(false);

  // Retrieve primary and nearby chemicals
  const primaryChem = inventory.find(c => c.id === primaryChemId) || inventory[0];
  const nearbyChems = inventory.filter(c => nearbyChemIds.includes(c.id));
  const storageEnv = STORAGE_ENVIRONMENTS.find(e => e.id === storageEnvId) || STORAGE_ENVIRONMENTS[0];

  // Evaluate Deterministic Pairwise Risks
  const pairAssessments = useMemo(() => {
    if (!primaryChem) return [];
    return nearbyChems.map(nearby => {
      const comp = evaluatePairCompatibility(primaryChem, nearby);
      return {
        nearby,
        compatibility: comp
      };
    });
  }, [primaryChem, nearbyChems]);

  // Compute Traceable Industrial Risk Indices (0 - 10)
  const riskAnalysis = useMemo(() => {
    if (!primaryChem) return null;

    let fireIndex = 2.0;
    let toxIndex = 2.0;
    let corrIndex = 2.0;
    let ecoIndex = 2.0;

    const g = primaryChem.cameoGroups || [];
    const n = primaryChem.name.toLowerCase();

    // Fire index
    if (g.includes('flammables') || n.includes('isopropanol') || n.includes('ethanol')) fireIndex += 5.5;
    if (g.includes('oxidizers_strong') || g.includes('peroxides_organic')) fireIndex += 4.5;
    if (ambientTemp > 40) fireIndex += 1.5;

    // Toxicity index
    if (g.includes('cytotoxics') || n.includes('cisplatin') || n.includes('dcm')) toxIndex += 6.0;
    if (g.includes('sulfides') || n.includes('sulfide')) toxIndex += 5.0;
    if (ventilation === 'enclosed') toxIndex += 2.5;

    // Corrosivity index
    if (g.includes('acids_strong_inorganic') || g.includes('bases_strong')) corrIndex += 6.5;

    // Eco index
    if (primaryChem.wgk && primaryChem.wgk.includes('3')) ecoIndex += 6.0;
    else if (primaryChem.wgk && primaryChem.wgk.includes('2')) ecoIndex += 4.0;

    // Compound by pairwise interactions
    const criticalPairs = pairAssessments.filter(p => p.compatibility.status === 'RED');
    const warningPairs = pairAssessments.filter(p => p.compatibility.status === 'AMBER');

    if (criticalPairs.length > 0) {
      fireIndex = Math.min(10, fireIndex + 3.0);
      toxIndex = Math.min(10, toxIndex + 3.5);
      corrIndex = Math.min(10, corrIndex + 2.5);
    }

    // Multiply by storage environment factor
    const compositeScore = Math.min(100, Math.round(
      ((fireIndex * 2.5) + (toxIndex * 3.0) + (corrIndex * 2.5) + (ecoIndex * 2.0)) * storageEnv.riskMultiplier
    ));

    return {
      fireIndex: Math.min(10, parseFloat(fireIndex.toFixed(1))),
      toxIndex: Math.min(10, parseFloat(toxIndex.toFixed(1))),
      corrIndex: Math.min(10, parseFloat(corrIndex.toFixed(1))),
      ecoIndex: Math.min(10, parseFloat(ecoIndex.toFixed(1))),
      compositeScore,
      criticalPairs,
      warningPairs
    };
  }, [primaryChem, nearbyChems, storageEnv, ambientTemp, ventilation, pairAssessments]);

  // Handle Nearby Selection Toggle
  const toggleNearbyChem = (id) => {
    setNearbyChemIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Copy Briefing to Clipboard
  const handleCopyDossier = () => {
    if (!riskAnalysis || !primaryChem) return;
    const text = `CHEM-SHIELD INDUSTRIAL CHEMICAL RISK INTELLIGENCE REPORT
Date: ${new Date().toISOString()}
Target Substance: ${primaryChem.name} (${primaryChem.formula}, CAS: ${primaryChem.cas})
Storage Environment: ${storageEnv.name}
Ambient Conditions: ${ambientTemp}°C | Ventilation: ${ventilation}
Application Sector: ${application}
Composite Risk Score: ${riskAnalysis.compositeScore}/100
- Fire Risk Index: ${riskAnalysis.fireIndex}/10
- Toxicity & Inhalation Index: ${riskAnalysis.toxIndex}/10
- Corrosivity Index: ${riskAnalysis.corrIndex}/10
- Aquatic Ecotoxicity Index: ${riskAnalysis.ecoIndex}/10
Critical Incompatibilities Detected: ${riskAnalysis.criticalPairs.length}
Authoritative Citations: OSHA 1910.1200 / NFPA 400 / NOAA CAMEO / REACH Annex XVII`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold uppercase flex items-center gap-1">
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              MODULE 6: AI CHEMICAL RISK ENGINE
            </span>
            <span className="text-slate-400 text-xs font-mono">Deterministic Rules + AI Synthesis</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2 mt-1">
            <Cpu className="w-6 h-6 text-cyan-400" />
            Industrial Chemical Risk Intelligence & Scenario Analyzer
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Traceable multi-variable risk scoring, hazard heatmap, and AI engineering controls generator.
          </p>
        </div>

        {/* Composite Risk Score Badge */}
        {riskAnalysis && (
          <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">COMPOSITE RISK RATING</span>
              <div className="flex items-center justify-end space-x-1.5 font-mono">
                <span className={`text-2xl font-black ${
                  riskAnalysis.compositeScore >= 70 ? 'text-red-400' :
                  riskAnalysis.compositeScore >= 40 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {riskAnalysis.compositeScore}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <span className={`text-[10px] font-bold font-mono ${
                riskAnalysis.compositeScore >= 70 ? 'text-red-400' :
                riskAnalysis.compositeScore >= 40 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {riskAnalysis.compositeScore >= 70 ? 'HIGH / CRITICAL HAZARD' :
                 riskAnalysis.compositeScore >= 40 ? 'MODERATE / CONDITIONAL' : 'LOW RISK CONTROLLED'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* INPUT SCENARIO CONFIGURATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COL 1: PRIMARY SUBSTANCE & STORAGE FACILITY */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-sm">Target Chemical & Facility Setting</h3>
          </div>

          {/* Primary Substance */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-mono block">Primary Target Chemical:</label>
            <select
              value={primaryChemId}
              onChange={(e) => setPrimaryChemId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              {inventory.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.formula || c.cas})
                </option>
              ))}
            </select>
          </div>

          {/* Storage Environment */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-mono block">Storage Architecture:</label>
            <select
              value={storageEnvId}
              onChange={(e) => setStorageEnvId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {STORAGE_ENVIRONMENTS.map(env => (
                <option key={env.id} value={env.id}>
                  {env.name}
                </option>
              ))}
            </select>
          </div>

          {/* Industrial Application */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-mono block">Industrial Application:</label>
            <select
              value={application}
              onChange={(e) => setApplication(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {APPLICATIONS.map((app, i) => (
                <option key={i} value={app}>
                  {app}
                </option>
              ))}
            </select>
          </div>

          {/* Environmental Controls */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center font-mono">
                <span className="text-slate-400">Ambient Temperature:</span>
                <span className="font-bold text-amber-300">{ambientTemp} °C</span>
              </div>
              <input
                type="range"
                min="10"
                max="55"
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-mono block">Facility Ventilation:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'forced', label: 'Forced ATEX' },
                  { id: 'natural', label: 'Natural Open' },
                  { id: 'enclosed', label: 'Enclosed/None' }
                ].map(v => (
                  <button
                    key={v.id}
                    onClick={() => setVentilation(v.id)}
                    className={`py-1.5 rounded-lg font-mono text-[11px] border transition ${
                      ventilation === v.id
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* COL 2: NEARBY CHEMICAL SUBSTANCES MULTI-PICKER */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-slate-100 text-sm">Nearby Co-Stored Substances</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              {nearbyChemIds.length} Selected
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Select chemicals stored within the same warehouse bay, drainage trench, or adjacent pipeline racks:
          </p>

          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            {inventory
              .filter(c => c.id !== primaryChemId)
              .map(chem => {
                const isSelected = nearbyChemIds.includes(chem.id);
                return (
                  <div
                    key={chem.id}
                    onClick={() => toggleNearbyChem(chem.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                        : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">{chem.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">{chem.formula || chem.cas}</span>
                    </div>

                    <span className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* COL 3: RISK INDICES & HAZARD RADAR */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-sm">Hazard Dimension Indices</h3>
          </div>

          {riskAnalysis && (
            <div className="space-y-3 font-mono">
              
              {/* Fire Index */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Fire & Vapor Flash Index:
                  </span>
                  <span className="font-bold text-amber-400">{riskAnalysis.fireIndex} / 10</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full" style={{ width: `${riskAnalysis.fireIndex * 10}%` }}></div>
                </div>
              </div>

              {/* Toxicity Index */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Skull className="w-3.5 h-3.5 text-red-400" />
                    Toxic Inhalation / IDLH Index:
                  </span>
                  <span className="font-bold text-red-400">{riskAnalysis.toxIndex} / 10</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full" style={{ width: `${riskAnalysis.toxIndex * 10}%` }}></div>
                </div>
              </div>

              {/* Corrosivity Index */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    Corrosive & Exotherm Index:
                  </span>
                  <span className="font-bold text-cyan-400">{riskAnalysis.corrIndex} / 10</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" style={{ width: `${riskAnalysis.corrIndex * 10}%` }}></div>
                </div>
              </div>

              {/* Eco Index */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Aquatic / WGK Eco-Impact Index:
                  </span>
                  <span className="font-bold text-emerald-400">{riskAnalysis.ecoIndex} / 10</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: `${riskAnalysis.ecoIndex * 10}%` }}></div>
                </div>
              </div>

              {/* Summary note */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-sans leading-relaxed">
                <span className="font-bold text-cyan-300 block mb-0.5">Automated Precautionary Rule:</span>
                Evaluated against NOAA CAMEO reactivity database. Storage multi-risk factor reflects facility ventilation ({ventilation}) and ambient temperature ({ambientTemp}°C).
              </div>

            </div>
          )}

        </div>

      </div>

      {/* HAZARD HEATMAP & INCOMPATIBILITY AUDIT */}
      {riskAnalysis && pairAssessments.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                INTERACTIVE HAZARD HEATMAP
              </span>
              <h3 className="font-bold text-slate-100 text-sm">
                Pairwise Reactive Compatibility Matrix with {primaryChem?.name}
              </h3>
            </div>
            <button
              onClick={handleCopyDossier}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center space-x-1.5 transition font-mono"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Dossier Copied!' : 'Copy Dossier'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pairAssessments.map((item, idx) => {
              const comp = item.compatibility;
              const isRed = comp.status === 'RED';
              const isAmber = comp.status === 'AMBER';

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs space-y-2 transition ${
                    isRed
                      ? 'bg-red-950/40 border-red-500/80 shadow-md shadow-red-950/40'
                      : isAmber
                      ? 'bg-amber-950/30 border-amber-500/60'
                      : 'bg-emerald-950/20 border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 truncate max-w-[180px]">
                      {item.nearby.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      isRed ? 'bg-red-900 text-red-200' : isAmber ? 'bg-amber-900 text-amber-200' : 'bg-emerald-900 text-emerald-200'
                    }`}>
                      {comp.status}
                    </span>
                  </div>

                  <p className="text-slate-300 text-[11px] font-mono leading-tight">
                    {comp.hazardTitle || 'Verified CAMEO Interaction'}
                  </p>

                  <p className="text-[10px] text-slate-400 line-clamp-2">
                    {comp.description}
                  </p>

                  <div className="pt-1 border-t border-slate-800/80 text-[10px] text-cyan-400 font-mono">
                    <span className="font-bold">Required Action:</span> {comp.segregationAction || 'Standard Storage'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI SYNTHESIZED ENGINEERING CONTROLS & REGULATORY REFERENCES */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
          <FileText className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm">
            AI Technical Safety Dossier & Mandatory Engineering Safeguards
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-cyan-300 block uppercase font-mono text-[10px]">
              Mandatory Engineering Controls (OSHA 1910.1200 / NFPA 400)
            </span>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Secondary Containment:</strong> Impermeable epoxy-lined bunding sized for 110% of largest vessel capacity.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Gas Detection Interlock:</strong> Continuous multi-channel electrochemical toxic gas sniffers interlocked to auto-scrubber fan.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Emergency Deluge:</strong> ANSI Z358.1 emergency eyewash/shower within 10 seconds (15 meters) unobstructed walking path.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-amber-300 block uppercase font-mono text-[10px]">
              Scientific Citations & Safety Standards
            </span>
            <ul className="space-y-1 text-slate-400 text-[11px] font-mono">
              <li>• NOAA CAMEO Chemicals Reactivity Worksheet v2.8</li>
              <li>• NFPA 400: Hazardous Materials Code (2022 Edition)</li>
              <li>• OSHA 29 CFR 1910.1200: Hazard Communication Standard</li>
              <li>• ECHA REACH Regulation (EC) No 1907/2006 Annex XVII</li>
              <li>• German AwSV: Ordinance on Facilities for Handling Substances Hazardous to Water</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}
