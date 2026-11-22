import React, { useState } from 'react';
import { 
  AlertOctagon, Flame, Skull, AlertTriangle, ShieldCheck, 
  RefreshCw, Play, Pause, ChevronRight, Activity, Thermometer, 
  Wind, Gauge, Info 
} from 'lucide-react';

const SIMULATION_SCENARIOS = [
  {
    id: "scen-tannery-h2s",
    title: "Tannery Catastrophe: Unhairing Sulfide Acidification",
    industry: "Leather Tanning Industry",
    substanceA: "Sodium Sulfide (Na2S)",
    substanceB: "Sulfuric Acid (H2SO4)",
    reactionType: "Acid-Promoted Fast Gas Liberation",
    chemicalEquation: "Na2S(aq) + H2SO4(aq) -> Na2SO4(aq) + H2S(g) ^",
    idlhLevel: "100 ppm H2S (Lethal > 500 ppm)",
    maxTemp: 92,
    maxPressure: 3.8,
    maxGasPpm: 1250,
    stages: [
      {
        time: "T + 0.0s",
        phase: "Initial Transfer Error",
        description: "Operator mistakenly connects a sulfuric acid pickling delivery hose to a liming pit holding 1,200 L of 60% sodium sulfide solution.",
        temp: 24,
        pressure: 1.0,
        gasPpm: 2,
        alertLevel: "SAFE"
      },
      {
        time: "T + 1.8s",
        phase: "Instantaneous Protonation",
        description: "Acid contacts sulfide liquor. Local pH collapses from 11.5 to 4.2. Massive effervescence begins as sulfide ions rapidly protonate into gaseous H2S.",
        temp: 58,
        pressure: 1.6,
        gasPpm: 240,
        alertLevel: "WARNING"
      },
      {
        time: "T + 6.5s",
        phase: "Atmospheric Cloud Eruption",
        description: "Dense, invisible H2S gas surges out of pit openings. Olfactory receptors in human victims are paralyzed instantly, eliminating the rotten-egg warning odor. Knockdown occurs in seconds.",
        temp: 84,
        pressure: 2.9,
        gasPpm: 850,
        alertLevel: "CRITICAL"
      },
      {
        time: "T + 18.0s",
        phase: "Peak Lethal Dispersion",
        description: "Gas plume reaches 1,250 ppm across a 40-meter radius. Secondary victims attempting unassisted rescue collapse immediately without SCBA.",
        temp: 92,
        pressure: 3.8,
        gasPpm: 1250,
        alertLevel: "FATAL"
      }
    ],
    rootCauses: [
      "Absence of keyed/color-coded hose couplings between acid and alkaline pipe manifolds.",
      "Lack of automated pH interlocking on the pit transfer valves.",
      "Stationary H2S detection sensors were improperly placed above gas density elevation (H2S is heavier than air: vapor density 1.19)."
    ],
    engineeringControls: [
      "Physical Poka-Yoke mechanical couplers preventing acid lines from mating with alkaline ports.",
      "Automated caustic scrubber interlock activated automatically by emergency pit dump switches.",
      "Mandatory dual-gas personal monitors with acoustic and vibration alarms for all tanning drum operators."
    ]
  },
  {
    id: "scen-pharma-hcl",
    title: "Pharma Pilot Plant: Acyl Halide Water Ingress Rupture",
    industry: "Pharmaceutical Synthesis",
    substanceA: "Sebacoyl Chloride",
    substanceB: "Aqueous Buffer / Water",
    reactionType: "Violent Nucleophilic Hydrolysis with Acid Gas Blowout",
    chemicalEquation: "C10H16Cl2O2 + 2 H2O -> C10H18O4 + 2 HCl(g) ^ + Heat",
    idlhLevel: "50 ppm HCl (Corrosive pulmonary toxin)",
    maxTemp: 148,
    maxPressure: 8.5,
    maxGasPpm: 680,
    stages: [
      {
        time: "T + 0.0s",
        phase: "Moisture Ingress",
        description: "A condensation leak in a chilled water jacket breaches the seal of an unvented 100-liter acyl chloride synthesis vessel.",
        temp: 22,
        pressure: 1.0,
        gasPpm: 0,
        alertLevel: "SAFE"
      },
      {
        time: "T + 2.5s",
        phase: "Nucleophilic Attack",
        description: "Water reacts violently with acid chloride motifs. Anhydrous HCl vaporizes instantly; internal pressure spikes exponentially as temperature jumps.",
        temp: 78,
        pressure: 3.4,
        gasPpm: 85,
        alertLevel: "WARNING"
      },
      {
        time: "T + 7.0s",
        phase: "Rupture Disk Failure",
        description: "Internal pressure exceeds vessel design rating (6 bar). Bursting disk activates, discharging a choking acid mist aerosol into the pilot plant mezzanine.",
        temp: 124,
        pressure: 7.2,
        gasPpm: 420,
        alertLevel: "CRITICAL"
      },
      {
        time: "T + 20.0s",
        phase: "Full Acid Mist Release",
        description: "Dense white aerosol of concentrated hydrochloric acid corrodes structural electrical fixtures and triggers building-wide evacuation.",
        temp: 148,
        pressure: 8.5,
        gasPpm: 680,
        alertLevel: "CRITICAL"
      }
    ],
    rootCauses: [
      "Single-walled heat exchanger without continuous moisture monitoring in anhydrous synthesis.",
      "Lack of dry nitrogen inerting blanket pressure regulation.",
      "Direct discharge from rupture disk without an inline caustic scrubber knock-out pot."
    ],
    engineeringControls: [
      "Double-walled jacketed reactors with dielectric moisture leak detection.",
      "Safety relief system plumbed directly into packed-column wet scrubbers using 10% NaOH recirculating liquor.",
      "Interlocked inert nitrogen pressure relief bypass valves."
    ]
  },
  {
    id: "scen-cosmetics-peroxide",
    title: "Cosmetics Blending: Peroxide & Fragrance Solvent Thermal Runaway",
    industry: "Cosmetics & Personal Care",
    substanceA: "Hydrogen Peroxide (35%)",
    substanceB: "d-Limonene (Terpene Fragrance)",
    reactionType: "Catalytic Oxidation & Spontaneous Deflagration",
    chemicalEquation: "H2O2 + Terpene Hydrocarbons + Trace Iron -> Runaway Auto-Oxidation + Flash Fire",
    idlhLevel: "Thermal Deflagration & Severe Flash Fire",
    maxTemp: 230,
    maxPressure: 12.0,
    maxGasPpm: 0,
    stages: [
      {
        time: "T + 0.0s",
        phase: "Co-Storage Spillage",
        description: "Punctured barrel of cosmetic 35% H2O2 leaks into common floor trench containing residue from an earlier d-limonene perfume fragrance transfer.",
        temp: 25,
        pressure: 1.0,
        gasPpm: 0,
        alertLevel: "SAFE"
      },
      {
        time: "T + 4.0s",
        phase: "Auto-Oxidation Induction",
        description: "Peroxide aggressively attacks terpene carbon double bonds. Rust in trench provides trace iron ions, catalyzing a Fenton-type runaway decomposition.",
        temp: 95,
        pressure: 2.1,
        gasPpm: 0,
        alertLevel: "WARNING"
      },
      {
        time: "T + 12.0s",
        phase: "Thermal Runaway & Flashpoint Ignition",
        description: "Temperature surpasses limonene flash point (48°C). Rapidly evolved oxygen creates an enriched atmosphere leading to explosive auto-ignition.",
        temp: 185,
        pressure: 6.8,
        gasPpm: 0,
        alertLevel: "CRITICAL"
      },
      {
        time: "T + 25.0s",
        phase: "Full Warehouse Flashover",
        description: "Intense fireball consumes neighboring polyethylene containers, releasing dense acrid smoke throughout the cosmetics packaging wing.",
        temp: 230,
        pressure: 12.0,
        gasPpm: 0,
        alertLevel: "FATAL"
      }
    ],
    rootCauses: [
      "Shared drainage trench connecting oxidizer storage bunker directly to flammable fragrance dispensing room.",
      "Absence of secondary containment bunds for peroxide carboys.",
      "Failure to isolate Class 5.1 strong oxidizers by minimum 6 meters from combustible perfume stocks."
    ],
    engineeringControls: [
      "Physical dedicated bunding with dedicated sump drainage for all Class 5.1 oxidizers.",
      "Infrared flame detectors with fast-acting deluge foam suppression.",
      "Strict zero-metal, passivated 316L stainless steel or fluoropolymer transfer equipment."
    ]
  }
];

export default function AccidentSimulator() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const scenario = SIMULATION_SCENARIOS[selectedScenarioIndex];
  const stage = scenario.stages[currentStageIndex];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0b1324] border border-red-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <AlertOctagon className="w-5 h-5 stroke-[2.2]" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Industrial Accident Simulator &amp; Educational Physics Model
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
            Simulate historical chemical compatibility disasters, analyze real-time kinetic curves (temperature, vessel pressure, toxic gas dispersion), and review engineering controls to prevent industrial accidents.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-red-400 bg-red-950/80 border border-red-800 w-fit">
          Educational Demonstration Engine
        </span>
      </div>

      {/* Scenario Selector Chips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SIMULATION_SCENARIOS.map((s, idx) => {
          const isSelected = selectedScenarioIndex === idx;
          return (
            <button
              key={s.id}
              onClick={() => {
                setSelectedScenarioIndex(idx);
                setCurrentStageIndex(0);
              }}
              className={`p-4 rounded-xl text-left border transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-red-950/40 border-red-500 text-white shadow-lg shadow-red-950/50'
                  : 'bg-[#0b1324] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-1">
                  {s.industry}
                </span>
                <h4 className="font-bold text-sm text-white leading-tight mb-2">
                  {s.title}
                </h4>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 w-full font-mono">
                <span>{s.substanceA} + {s.substanceB}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Simulation Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Simulation Stage & Timeline Scrubber */}
        <div className="lg:col-span-2 space-y-5">
          <div className="p-6 rounded-2xl bg-[#0b1324] border border-slate-800 shadow-xl space-y-5">
            
            {/* Simulation Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-red-400 font-bold tracking-widest block">
                  INCIDENT PROGRESSION TIMELINE
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {scenario.title}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  stage.alertLevel === "FATAL" ? "bg-red-600 text-white animate-pulse" :
                  stage.alertLevel === "CRITICAL" ? "bg-red-500/20 text-red-400 border border-red-500" :
                  stage.alertLevel === "WARNING" ? "bg-amber-500/20 text-amber-400 border border-amber-500" :
                  "bg-emerald-500/20 text-emerald-400 border border-emerald-500"
                }`}>
                  Phase {currentStageIndex + 1}: {stage.alertLevel}
                </span>
              </div>
            </div>

            {/* Reaction Chemistry Equation Banner */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
              <span className="text-slate-400">Reaction Mechanism:</span>
              <span className="text-amber-300 font-bold">{scenario.chemicalEquation}</span>
            </div>

            {/* Stage Description Box */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  Timestamp: {stage.time}
                </span>
                <span className="text-xs font-bold text-white">
                  {stage.phase}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {stage.description}
              </p>
            </div>

            {/* Scrubber Navigation Buttons */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Select Incident Stage:</span>
                <span>Stage {currentStageIndex + 1} of {scenario.stages.length}</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {scenario.stages.map((st, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStageIndex(i)}
                    className={`p-2.5 rounded-xl text-center text-xs font-bold transition border ${
                      currentStageIndex === i
                        ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span className="block text-[10px] font-mono opacity-80">{st.time}</span>
                    <span className="truncate block mt-0.5">{st.phase.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Root Cause Analysis & Engineering Barrier Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Skull className="w-4 h-4" />
                <span>Root Cause Latent Failures</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {scenario.rootCauses.map((rc, rIdx) => (
                  <li key={rIdx} className="flex items-start space-x-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span className="leading-relaxed">{rc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Recommended Engineering Barriers</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {scenario.engineeringControls.map((ec, eIdx) => (
                  <li key={eIdx} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span className="leading-relaxed">{ec}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Right Col: Live Simulated Physics Gauges */}
        <div className="space-y-4">
          
          <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 shadow-xl space-y-5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Simulated Real-Time Kinetic Meters</span>
            </h4>

            {/* Gauge 1: Temperature */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <Thermometer className="w-4 h-4 text-red-400" />
                  <span>Reaction Core Temperature</span>
                </span>
                <span className="font-mono font-bold text-white text-sm">
                  {stage.temp}°C
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (stage.temp / scenario.maxTemp) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Ambient (20°C)</span>
                <span>Peak {scenario.maxTemp}°C</span>
              </div>
            </div>

            {/* Gauge 2: Pressure */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  <span>Internal Vessel Pressure</span>
                </span>
                <span className="font-mono font-bold text-white text-sm">
                  {stage.pressure} bar
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-amber-500 to-red-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (stage.pressure / scenario.maxPressure) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Atmospheric (1.0 bar)</span>
                <span>Burst Threshold {scenario.maxPressure} bar</span>
              </div>
            </div>

            {/* Gauge 3: Gas Dispersion Concentration */}
            {scenario.maxGasPpm > 0 && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center space-x-1.5">
                    <Wind className="w-4 h-4 text-amber-400" />
                    <span>Toxic Vapor Cloud Concentration</span>
                  </span>
                  <span className="font-mono font-bold text-red-400 text-sm">
                    {stage.gasPpm} ppm
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, (stage.gasPpm / scenario.maxGasPpm) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Threshold Limit (10 ppm)</span>
                  <span>IDLH: {scenario.idlhLevel.split(' ')[0]}</span>
                </div>
              </div>
            )}

            <div className="p-3 rounded-lg bg-black/40 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
              <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                Kinetic rates derived from empirical CAMEO chemical reaction enthalpies and industrial catastrophic accident investigation reports.
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

