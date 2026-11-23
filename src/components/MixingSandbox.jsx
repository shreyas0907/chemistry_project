import React, { useState, useEffect, useMemo } from 'react';
import { 
  FlaskConical, 
  Flame, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Thermometer, 
  Droplets, 
  Activity, 
  Zap, 
  RotateCcw, 
  Info, 
  Layers, 
  Wind, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function MixingSandbox({ inventory = [], onSelectChemical }) {
  // Industrial High-Hazard Presets
  const PRESETS = [
    {
      id: 'leather-h2s',
      name: 'Leather Tanning: Sulfide Float + Pickling Acid',
      sector: 'Leather Tanning',
      chemAId: inventory.find(c => c.name.toLowerCase().includes('sodium sulfide'))?.id || inventory[0]?.id,
      chemBId: inventory.find(c => c.name.toLowerCase().includes('sulfuric acid'))?.id || inventory[1]?.id,
      concA: 60,
      concB: 98,
      volA: 500,
      volB: 300,
      temp: 28,
      ph: 1.8,
      scenarioDesc: 'Operator mixes spent beamhouse unhairing float directly with pickling acid. Instantaneous fatal H₂S gas release.'
    },
    {
      id: 'electro-hcn',
      name: 'Electroplating: Cyanide Bath + Hydrochloric Acid',
      sector: 'Electroplating',
      chemAId: inventory.find(c => c.name.toLowerCase().includes('potassium cyanide'))?.id || inventory[0]?.id,
      chemBId: inventory.find(c => c.name.toLowerCase().includes('hydrochloric acid'))?.id || inventory[1]?.id,
      concA: 98,
      concB: 35,
      volA: 200,
      volB: 150,
      temp: 25,
      ph: 1.0,
      scenarioDesc: 'Acid rinse drag-in into cyanide plating sump. Extreme lethal Hydrogen Cyanide (HCN) gas liberation.'
    },
    {
      id: 'leather-cr6',
      name: 'Tannery Effluent: Chrome Float + Hydrogen Peroxide',
      sector: 'Leather Tanning',
      chemAId: inventory.find(c => c.name.toLowerCase().includes('chromium'))?.id || inventory[0]?.id,
      chemBId: inventory.find(c => c.name.toLowerCase().includes('hydrogen peroxide'))?.id || inventory[1]?.id,
      concA: 40,
      concB: 50,
      volA: 1000,
      volB: 200,
      temp: 32,
      ph: 10.5,
      scenarioDesc: 'Peroxide bleach oxidizes benign trivalent Cr(III) into highly toxic, carcinogenic Hexavalent Chromium Cr(VI).'
    },
    {
      id: 'pharma-exotherm',
      name: 'Pharma Synthesis: Sulfuric Acid + Caustic Lye',
      sector: 'Pharmaceutical',
      chemAId: inventory.find(c => c.name.toLowerCase().includes('sulfuric acid'))?.id || inventory[0]?.id,
      chemBId: inventory.find(c => c.name.toLowerCase().includes('sodium hydroxide'))?.id || inventory[1]?.id,
      concA: 98,
      concB: 50,
      volA: 400,
      volB: 400,
      temp: 24,
      ph: 13.5,
      scenarioDesc: 'Violent exothermic acid-base neutralization. Boiling geyser ejection and reactor thermal runaway.'
    },
    {
      id: 'agro-anfo',
      name: 'Agrochemical: Ammonium Nitrate + Flammable Solvent',
      sector: 'Agrochemicals',
      chemAId: inventory.find(c => c.name.toLowerCase().includes('ammonium nitrate'))?.id || inventory[0]?.id,
      chemBId: inventory.find(c => c.name.toLowerCase().includes('isopropanol'))?.id || inventory[1]?.id,
      concA: 95,
      concB: 99,
      volA: 800,
      volB: 200,
      temp: 35,
      ph: 6.0,
      scenarioDesc: 'Oxidizer contamination with organic solvent fuel. Rapid sensitization and severe blast detonation hazard.'
    }
  ];

  // Active Reactants & Parameters
  const [selectedPresetId, setSelectedPresetId] = useState(PRESETS[0].id);
  const [chemAId, setChemAId] = useState(PRESETS[0].chemAId);
  const [chemBId, setChemBId] = useState(PRESETS[0].chemBId);
  const [concentrationA, setConcentrationA] = useState(60);
  const [concentrationB, setConcentrationB] = useState(98);
  const [volumeA, setVolumeA] = useState(500);
  const [volumeB, setVolumeB] = useState(300);
  const [ambientTemp, setAmbientTemp] = useState(28);
  const [phLevel, setPhLevel] = useState(1.8);
  
  // Real-time API / Deterministic Reaction Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [reactionResult, setReactionResult] = useState(null);

  const chemA = inventory.find(c => c.id === chemAId) || inventory[0];
  const chemB = inventory.find(c => c.id === chemBId) || inventory[1];

  // Apply Preset
  const handleApplyPreset = (preset) => {
    setSelectedPresetId(preset.id);
    if (preset.chemAId) setChemAId(preset.chemAId);
    if (preset.chemBId) setChemBId(preset.chemBId);
    setConcentrationA(preset.concA);
    setConcentrationB(preset.concB);
    setVolumeA(preset.volA);
    setVolumeB(preset.volB);
    setAmbientTemp(preset.temp);
    setPhLevel(preset.ph);
  };

  // Run Reaction Modeling (Netlify Function backend proxy or local fallback)
  useEffect(() => {
    let isCancelled = false;
    setIsSimulating(true);

    const controller = new AbortController();
    const payload = {
      mode: 'reaction-model',
      chemicalA: chemA,
      chemicalB: chemB,
      concentrationA,
      concentrationB,
      volumeA,
      volumeB,
      tempC: ambientTemp,
      ph: phLevel
    };

    fetch('/api/analyze-hazard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    })
      .then(res => res.json())
      .then(data => {
        if (!isCancelled) {
          setReactionResult(data);
          setIsSimulating(false);
        }
      })
      .catch(err => {
        if (!isCancelled && err.name !== 'AbortError') {
          // Client-side fallback if server offline
          setReactionResult(computeLocalFallbackReaction(chemA, chemB, concentrationA, concentrationB, volumeA, volumeB, ambientTemp, phLevel));
          setIsSimulating(false);
        }
      });

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [chemAId, chemBId, concentrationA, concentrationB, volumeA, volumeB, ambientTemp, phLevel]);

  // Local fallback calculation
  function computeLocalFallbackReaction(a, b, cA, cB, vA, vB, temp, ph) {
    const nameA = (a?.name || '').toLowerCase();
    const nameB = (b?.name || '').toLowerCase();
    const isSulfideAcid = (nameA.includes('sulfide') && nameB.includes('acid')) || (nameB.includes('sulfide') && nameA.includes('acid'));
    const isCyanideAcid = (nameA.includes('cyanide') && nameB.includes('acid')) || (nameB.includes('cyanide') && nameA.includes('acid'));
    const isChromePeroxide = (nameA.includes('chromium') && nameB.includes('peroxide')) || (nameB.includes('chromium') && nameA.includes('peroxide'));
    const isAcidBase = (nameA.includes('sulfuric') && nameB.includes('hydroxide')) || (nameB.includes('sulfuric') && nameA.includes('hydroxide'));

    if (isSulfideAcid) {
      return {
        source: 'CAMEO Precautionary Deterministic Engine',
        balancedEquation: 'Na₂S + H₂SO₄ → H₂S (g) ↑ + Na₂SO₄ (ΔH = -88.4 kJ/mol)',
        hazardSeverity: 'CATASTROPHIC',
        temperatureRiseC: Math.round(26 * (cA * cB / 2500)),
        lethalGasName: 'Hydrogen Sulfide (H₂S)',
        gasConcentrationPpm: Math.round(850 * (vA + vB) / 800),
        cr6OxidationRisk: false,
        reactionSummary: 'Catastrophic release of fatal, asphyxiating Hydrogen Sulfide gas. Olfactory nerve paralysis occurs rapidly above 50 ppm, followed by fatal respiratory failure.',
        etp3PipeValidation: {
          sulfidePipeCompliant: ph >= 10.0,
          chromePipeCompliant: true,
          acidPipeCompliant: false,
          operationalInstruction: 'CRITICAL ETP VIOLATION: Sulfide streams must be kept strictly at pH >= 10.0 and routed to the Catalytic Oxidation Pipe with MnSO4 catalyst before mixing with any acid.'
        },
        firstAidProtocol: 'Immediately evacuate upwind. Positive pressure SCBA required. Administer 100% oxygen.'
      };
    }

    if (isCyanideAcid) {
      return {
        source: 'CAMEO Precautionary Deterministic Engine',
        balancedEquation: '2 KCN + 2 HCl → 2 HCN (g) ↑ + 2 KCl',
        hazardSeverity: 'CATASTROPHIC',
        temperatureRiseC: Math.round(30 * (cA * cB / 2500)),
        lethalGasName: 'Hydrogen Cyanide (HCN)',
        gasConcentrationPpm: Math.round(920 * (vA + vB) / 600),
        cr6OxidationRisk: false,
        reactionSummary: 'Instantaneous release of lethal Hydrogen Cyanide gas. Cellular asphyxiation through cytochrome oxidase inhibition.',
        etp3PipeValidation: {
          sulfidePipeCompliant: false,
          chromePipeCompliant: false,
          acidPipeCompliant: false,
          operationalInstruction: 'ELECTROPLATING MANDATE: Cyanide plating baths must be isolated in locked vaults and treated by alkaline chlorination (pH > 11.5) before combining with acid effluents.'
        },
        firstAidProtocol: 'Level A SCBA entry. Keep Cyanokit (hydroxocobalamin) or amyl nitrite inhalant on standby.'
      };
    }

    if (isChromePeroxide) {
      return {
        source: 'CAMEO Precautionary Deterministic Engine',
        balancedEquation: '2 Cr³⁺ + 3 H₂O₂ + 10 OH⁻ → 2 CrO₄²⁻ (Hexavalent) + 8 H₂O',
        hazardSeverity: 'SEVERE',
        temperatureRiseC: Math.round(38 * (cA * cB / 2000)),
        lethalGasName: 'Oxygen Exotherm / Toxic Aerosol',
        gasConcentrationPpm: 120,
        cr6OxidationRisk: true,
        reactionSummary: 'Oxidation of benign trivalent chromium Cr(III) to carcinogenic, mutagentic Hexavalent Chromium Cr(VI). Significant heat generation.',
        etp3PipeValidation: {
          sulfidePipeCompliant: true,
          chromePipeCompliant: false,
          acidPipeCompliant: true,
          operationalInstruction: 'ETP VIOLATION: Spent tanning float must be precipitated with MgO at pH 8.5 to recover Cr(OH)3. Never allow oxidizer contact.'
        },
        firstAidProtocol: 'Flush eyes and skin for 15 minutes. Heavy metal chelation protocol.'
      };
    }

    if (isAcidBase) {
      return {
        source: 'CAMEO Precautionary Deterministic Engine',
        balancedEquation: 'H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O (ΔH = -133.5 kJ/mol)',
        hazardSeverity: 'SEVERE',
        temperatureRiseC: Math.round(62 * (cA * cB / 2500)),
        lethalGasName: 'Superheated Acid/Caustic Mist',
        gasConcentrationPpm: 60,
        cr6OxidationRisk: false,
        reactionSummary: 'Violent neutralization exotherm. Rapid boiling causes geyser ejection of corrosive caustic and acid mist.',
        etp3PipeValidation: {
          sulfidePipeCompliant: true,
          chromePipeCompliant: true,
          acidPipeCompliant: true,
          operationalInstruction: 'Neutralization must only occur in agitated chilled equalization basins with metered peristaltic dosing.'
        },
        firstAidProtocol: 'Copious emergency shower flush for at least 15 minutes.'
      };
    }

    return {
      source: 'Deterministic CAMEO Matrix Baseline',
      balancedEquation: 'No spontaneous violent cross-reaction documented.',
      hazardSeverity: 'SAFE',
      temperatureRiseC: 1.5,
      lethalGasName: 'None',
      gasConcentrationPpm: 0,
      cr6OxidationRisk: false,
      reactionSummary: 'Substances exhibit thermodynamic equilibrium under ambient conditions. Standard containment applies.',
      etp3PipeValidation: {
        sulfidePipeCompliant: true,
        chromePipeCompliant: true,
        acidPipeCompliant: true,
        operationalInstruction: 'Effluent may be routed to primary equalization provided pH is maintained between 6.5 and 8.5.'
      },
      firstAidProtocol: 'Standard industrial PPE (nitrile gloves, splash goggles).'
    };
  }

  // Calculated Vessel Peak Temperature
  const peakTemp = reactionResult ? Math.min(195, ambientTemp + (reactionResult.temperatureRiseC || 0)) : ambientTemp;
  const severity = reactionResult?.hazardSeverity || 'SAFE';

  // Dynamic Vessel Visual Styling
  const vesselGlow = 
    severity === 'CATASTROPHIC' ? 'shadow-[0_0_50px_rgba(239,68,68,0.6)] border-red-500' :
    severity === 'SEVERE' ? 'shadow-[0_0_35px_rgba(249,115,22,0.5)] border-orange-500' :
    severity === 'CAUTION' ? 'shadow-[0_0_25px_rgba(234,179,8,0.4)] border-amber-500' :
    'shadow-[0_0_20px_rgba(16,185,129,0.3)] border-emerald-500';

  const plumeColor = 
    reactionResult?.lethalGasName?.includes('Chlorine') ? 'from-yellow-400/80 to-emerald-500/0' :
    reactionResult?.lethalGasName?.includes('Cyanide') ? 'from-purple-400/90 to-blue-500/0' :
    reactionResult?.lethalGasName?.includes('Sulfide') ? 'from-amber-600/90 to-red-600/0' :
    severity === 'SEVERE' ? 'from-orange-500/70 to-red-500/0' :
    'from-cyan-400/30 to-blue-500/0';

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#08151f] via-[#091b26] to-[#0e2738] border border-cyan-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 text-xs font-mono font-bold uppercase flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
              MODULE A: REACTION &amp; ETP SANDBOX
            </span>
            <span className="text-slate-400 text-xs font-mono">Dynamic Multi-Variable &amp; 3-Pipe Verification</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2 mt-1">
            <Zap className="w-6 h-6 text-cyan-400" />
            Interactive Chemical Mixing &amp; ETP "What-If" Simulation Chamber
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Model fluid concentration, volume, temperature, and pH to simulate thermodynamic runaways, toxic gas plumes, and mandatory ETP effluent pipe segregation.
          </p>
        </div>

        {/* Hazard Severity Meter */}
        <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">SIMULATED HAZARD SEVERITY</span>
            <span className={`text-base font-black font-mono flex items-center justify-end gap-1.5 ${
              severity === 'CATASTROPHIC' ? 'text-red-400 animate-pulse' :
              severity === 'SEVERE' ? 'text-orange-400' :
              severity === 'CAUTION' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {severity === 'CATASTROPHIC' && <AlertTriangle className="w-4 h-4 text-red-400" />}
              {severity === 'SEVERE' && <Flame className="w-4 h-4 text-orange-400" />}
              {severity === 'SAFE' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
              {severity}
            </span>
          </div>
        </div>
      </div>

      {/* INDUSTRIAL PRESET BUTTONS */}
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
          One-Click High-Hazard Sector Presets:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {PRESETS.map((p) => {
            const isSelected = selectedPresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleApplyPreset(p)}
                className={`p-3 rounded-xl border text-left transition ${
                  isSelected
                    ? 'bg-cyan-950/50 border-cyan-400 shadow-md shadow-cyan-950 text-slate-100'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300 uppercase block w-fit mb-1 font-bold">
                  {p.sector}
                </span>
                <h5 className="font-bold text-xs truncate leading-snug text-slate-100">{p.name}</h5>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">{p.scenarioDesc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN SIMULATION CHAMBER & CONTROLS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT 4 COLS: PARAMETER CONTROLS */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              Chamber Charge Parameters
            </span>
            <span className="text-[10px] font-mono text-cyan-400">Live Dual Feed</span>
          </div>

          {/* Reagent A Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-mono block">Primary Substance A:</label>
            <select
              value={chemAId}
              onChange={(e) => { setChemAId(e.target.value); setSelectedPresetId(null); }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              {inventory.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.formula || c.cas})
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2 font-mono pt-1">
              <div>
                <span className="text-[10px] text-slate-500 block">Concentration (%): {concentrationA}%</span>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={concentrationA}
                  onChange={(e) => setConcentrationA(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Volume (Liters): {volumeA}L</span>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={volumeA}
                  onChange={(e) => setVolumeA(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Reagent B Selector */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <label className="text-slate-400 font-mono block">Secondary Substance B / Inflow:</label>
            <select
              value={chemBId}
              onChange={(e) => { setChemBId(e.target.value); setSelectedPresetId(null); }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              {inventory.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.formula || c.cas})
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2 font-mono pt-1">
              <div>
                <span className="text-[10px] text-slate-500 block">Concentration (%): {concentrationB}%</span>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={concentrationB}
                  onChange={(e) => setConcentrationB(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Volume (Liters): {volumeB}L</span>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={volumeB}
                  onChange={(e) => setVolumeB(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Environmental Conditions */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div>
              <div className="flex justify-between items-center font-mono">
                <span className="text-slate-400">Ambient Temperature:</span>
                <span className="font-bold text-amber-300">{ambientTemp} °C</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(parseInt(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between items-center font-mono">
                <span className="text-slate-400">Initial Liquid pH:</span>
                <span className={`font-bold ${phLevel < 7 ? 'text-red-400' : 'text-cyan-300'}`}>
                  pH {phLevel.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="14.0"
                step="0.1"
                value={phLevel}
                onChange={(e) => setPhLevel(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

        </div>

        {/* CENTER 4 COLS: DYNAMIC REACTION VESSEL VISUALIZATION */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between items-center relative overflow-hidden">
          
          <div className="w-full flex items-center justify-between pb-2 border-b border-slate-800 z-10">
            <span className="font-bold text-slate-100 text-sm flex items-center gap-1.5 font-mono">
              <Thermometer className="w-4 h-4 text-amber-400" />
              Reaction Chamber Simulator
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              severity === 'CATASTROPHIC' ? 'bg-red-950 text-red-300' :
              severity === 'SEVERE' ? 'bg-orange-950 text-orange-300' : 'bg-emerald-950 text-emerald-300'
            }`}>
              Peak: {peakTemp} °C
            </span>
          </div>

          {/* ANIMATED VESSEL GRAPHIC */}
          <div className="my-6 relative flex flex-col items-center">
            
            {/* Toxic Vapor Plume (Animated) */}
            <div className={`w-32 h-24 rounded-full blur-xl bg-gradient-to-t ${plumeColor} animate-pulse -mb-6 z-0`} />

            {/* Vessel Tank Shell */}
            <div className={`w-44 h-60 rounded-3xl border-4 bg-slate-950/80 backdrop-blur-md relative overflow-hidden flex flex-col justify-end p-2 transition-all duration-500 z-10 ${vesselGlow}`}>
              
              {/* Boiling Bubbles & Liquid */}
              <div 
                className={`w-full rounded-2xl transition-all duration-700 relative overflow-hidden flex items-end justify-center ${
                  severity === 'CATASTROPHIC' ? 'bg-gradient-to-t from-red-600 via-orange-500 to-amber-400' :
                  severity === 'SEVERE' ? 'bg-gradient-to-t from-orange-600 via-amber-500 to-yellow-300' :
                  severity === 'CAUTION' ? 'bg-gradient-to-t from-amber-600 to-yellow-500' :
                  'bg-gradient-to-t from-cyan-600 to-emerald-400'
                }`}
                style={{ height: `${Math.min(90, Math.max(30, (volumeA + volumeB) / 25))}%` }}
              >
                {/* Boiling bubbles if exothermic or severe */}
                {(severity === 'CATASTROPHIC' || severity === 'SEVERE') && (
                  <div className="absolute inset-0 flex justify-around items-center opacity-70">
                    <span className="w-3 h-3 rounded-full bg-white animate-ping" />
                    <span className="w-2 h-2 rounded-full bg-yellow-200 animate-bounce" />
                    <span className="w-4 h-4 rounded-full bg-white animate-pulse" />
                  </div>
                )}
                
                <span className="text-[10px] font-mono font-bold text-slate-950 pb-1 z-10">
                  {volumeA + volumeB}L Charged
                </span>
              </div>

              {/* Vessel Sight Glass Lines */}
              <div className="absolute top-4 right-2 space-y-2 pointer-events-none opacity-40">
                <div className="w-3 h-0.5 bg-slate-300" />
                <div className="w-2 h-0.5 bg-slate-400" />
                <div className="w-3 h-0.5 bg-slate-300" />
                <div className="w-2 h-0.5 bg-slate-400" />
              </div>
            </div>

            {/* Vessel Base Plinth */}
            <div className="w-48 h-4 bg-slate-800 rounded-lg mt-1 border border-slate-700 shadow-lg" />
          </div>

          {/* Quick Telemetry Chips */}
          <div className="w-full grid grid-cols-2 gap-2 font-mono text-[11px] z-10">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[9px] text-slate-500 block uppercase">THERMAL DELTA</span>
              <span className={`font-bold ${reactionResult?.temperatureRiseC > 20 ? 'text-red-400' : 'text-emerald-400'}`}>
                +{reactionResult?.temperatureRiseC || 0} °C
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[9px] text-slate-500 block uppercase">GAS EVOLUTION</span>
              <span className={`font-bold ${reactionResult?.gasConcentrationPpm > 50 ? 'text-red-400' : 'text-cyan-400'}`}>
                {reactionResult?.gasConcentrationPpm || 0} ppm
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT 4 COLS: REACTION EQUATION & MANDATORY ETP 3-PIPE VALIDATION */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-slate-100 text-sm flex items-center gap-1.5 font-mono">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              Thermodynamic &amp; ETP Breakdown
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {reactionResult?.source?.split(' ')[0] || 'Engine'}
            </span>
          </div>

          {/* Balanced Reaction Equation */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Balanced Reaction Pathway:</span>
            <code className="text-[11px] font-mono font-bold text-cyan-300 block leading-relaxed">
              {reactionResult?.balancedEquation || 'Evaluating stoichiometric pathway...'}
            </code>
          </div>

          {/* Toxic Gas / Cr6 Alerts */}
          {reactionResult?.lethalGasName && reactionResult.lethalGasName !== 'None' && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/60 text-red-200 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-red-300">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Lethal Vapor Emission: {reactionResult.lethalGasName}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                Simulated concentration reaches <strong>{reactionResult.gasConcentrationPpm} ppm</strong>. Exceeds standard NIOSH IDLH thresholds! Immediate upwind evacuation required.
              </p>
            </div>
          )}

          {reactionResult?.cr6OxidationRisk && (
            <div className="p-3 rounded-xl bg-orange-950/40 border border-orange-500/60 text-orange-200 space-y-1">
              <span className="font-bold text-orange-300 block">⚠️ Cr(VI) Hexavalent Chromium Formation Risk!</span>
              <p className="text-[11px] leading-relaxed text-slate-300">
                Peroxide contact oxidizes trivalent chromium to carcinogenic hexavalent chromate (CrO₄²⁻). Extreme ecological and carcinogenic violation.
              </p>
            </div>
          )}

          {/* Summary */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
            <span className="font-bold text-cyan-400 block mb-0.5">Physical Consequence:</span>
            {reactionResult?.reactionSummary}
          </div>

          {/* MANDATORY ETP 3-PIPE SEGREGATION VALIDATION */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="font-bold font-mono text-slate-200 block text-[11px] uppercase tracking-wider">
              Mandatory ETP 3-Pipe Effluent Validation:
            </span>

            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span>Pipe 1: Sulfide Catalytic Oxidation (pH &ge; 10.0)</span>
                {reactionResult?.etp3PipeValidation?.sulfidePipeCompliant ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> COMPLIANT
                  </span>
                ) : (
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> VIOLATION
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span>Pipe 2: Chromium Precipitation (pH &sim; 8.5)</span>
                {reactionResult?.etp3PipeValidation?.chromePipeCompliant ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> COMPLIANT
                  </span>
                ) : (
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> VIOLATION
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span>Pipe 3: Acid Pickle Balancing &amp; Neutralization</span>
                {reactionResult?.etp3PipeValidation?.acidPipeCompliant ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> COMPLIANT
                  </span>
                ) : (
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> VIOLATION
                  </span>
                )}
              </div>
            </div>

            <p className="text-[10px] text-cyan-300 bg-cyan-950/30 p-2 rounded border border-cyan-800/40">
              {reactionResult?.etp3PipeValidation?.operationalInstruction}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
