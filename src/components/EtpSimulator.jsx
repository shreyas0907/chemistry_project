import React, { useState, useMemo } from 'react';
import { 
  Droplets, 
  Activity, 
  Sliders, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  RotateCcw, 
  Zap, 
  Layers, 
  Wind, 
  FileText 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export default function EtpSimulator({ onNavigate }) {
  // Active stream: 'sulfide' | 'chrome' | 'acidic'
  const [activeStream, setActiveStream] = useState('sulfide');

  // Interactive Process Variables
  // Stream A: Sulfide Oxidation
  const [aerationRate, setAerationRate] = useState(1200); // Nm³/h (0 - 2000)
  const [catalystDose, setCatalystDose] = useState(50); // mg/L MnSO4 (0 - 100)
  const [sulfideInflowPh, setSulfideInflowPh] = useState(11.8); // pH (8.0 - 13.0)

  // Stream B: Chrome Precipitation
  const [precipitationAgent, setPrecipitationAgent] = useState('MgO'); // 'MgO' | 'Ca(OH)2' | 'NaOH'
  const [alkaliDose, setAlkaliDose] = useState(4.5); // kg/m³ (0.5 - 10)
  const [precipitationPh, setPrecipitationPh] = useState(8.8); // target pH (6.0 - 11.0)

  // Stream C: Acidic Neutralization
  const [neutralizerDose, setNeutralizerDose] = useState(3.2); // kg/m³
  const [acidInflowPh, setAcidInflowPh] = useState(2.2);

  // Reaction Residence Time (0 to 6 hours)
  const [retentionHours, setRetentionHours] = useState(4.0);

  // Compute Kinetic Simulation Curves for Stream A (Sulfide Catalytic Oxidation)
  const sulfideKinetics = useMemo(() => {
    const data = [];
    const initialSulfide = 1250; // mg/L
    // Kinetic constant k depends heavily on aeration (O2) and MnSO4 catalyst
    const kEff = (aerationRate / 1200) * (catalystDose / 50) * 0.95;

    for (let t = 0; t <= 6; t += 0.5) {
      // First-order decay: C(t) = C0 * exp(-k * t)
      const conc = Math.max(0.4, initialSulfide * Math.exp(-kEff * t));
      // pH drops slightly as sulfide oxidizes to thiosulfate/sulfate
      const currentPh = Math.max(7.2, sulfideInflowPh - (t * 0.45));
      // Dissolved oxygen rises as demand is satisfied
      const dissolvedOxygen = Math.min(6.8, 0.2 + (t * (aerationRate / 800) * 0.9));

      data.push({
        time: `${t}h`,
        sulfide: parseFloat(conc.toFixed(1)),
        pH: parseFloat(currentPh.toFixed(2)),
        dissolvedOxygen: parseFloat(dissolvedOxygen.toFixed(2)),
        epaLimit: 2.0
      });
    }
    return data;
  }, [aerationRate, catalystDose, sulfideInflowPh]);

  // Compute Kinetic Simulation Curves for Stream B (Chromium Precipitation)
  const chromeKinetics = useMemo(() => {
    const data = [];
    const initialCr = 2400; // mg/L Cr3+
    // Efficacy multiplier based on reagent
    const reagentFactor = precipitationAgent === 'MgO' ? 1.2 : precipitationAgent === 'NaOH' ? 1.05 : 0.9;
    const phEffect = Math.max(0.1, 1 - Math.abs(precipitationPh - 8.8) * 0.45);
    const kPrecip = (alkaliDose / 4.0) * reagentFactor * phEffect * 1.4;

    for (let t = 0; t <= 5; t += 0.5) {
      // Fast precipitation curve
      const conc = Math.max(0.2, initialCr * Math.exp(-kPrecip * t * 1.8));
      const sludgeFormedKg = (initialCr - conc) * 0.0035; // kg dry sludge/m³

      data.push({
        time: `${t}h`,
        chromium: parseFloat(conc.toFixed(2)),
        sludge: parseFloat(sludgeFormedKg.toFixed(1)),
        epaLimit: 2.0
      });
    }
    return data;
  }, [precipitationAgent, alkaliDose, precipitationPh]);

  // Final Effluent Telemetry & Compliance Evaluation
  const currentSulfideEffluent = sulfideKinetics[sulfideKinetics.length - 1].sulfide;
  const currentChromeEffluent = chromeKinetics[chromeKinetics.length - 1].chromium;
  const finalPh = sulfideInflowPh < 8.5 ? 6.2 : 7.6;

  // Regulatory Standards Comparison (EPA / CPCB)
  const complianceChecklist = [
    {
      parameter: 'Sulfide (S²⁻)',
      measured: `${currentSulfideEffluent} mg/L`,
      standard: '≤ 2.0 mg/L',
      isCompliant: currentSulfideEffluent <= 2.0,
      riskNote: currentSulfideEffluent > 2.0 ? 'Toxic odor, corrosion of municipal sewers, high aquatic toxicity' : 'Optimal catalytic destruction'
    },
    {
      parameter: 'Total Chromium (Cr)',
      measured: `${currentChromeEffluent} mg/L`,
      standard: '≤ 2.0 mg/L (EPA Guideline)',
      isCompliant: currentChromeEffluent <= 2.0,
      riskNote: currentChromeEffluent > 2.0 ? 'Heavy metal ecotoxicity, severe bioaccumulation in fish' : 'Fully precipitated as Cr(OH)₃ sludge'
    },
    {
      parameter: 'Discharge pH',
      measured: `${finalPh}`,
      standard: '6.5 – 8.5',
      isCompliant: finalPh >= 6.5 && finalPh <= 8.5,
      riskNote: finalPh < 6.5 ? 'Acid shock to aquatic biology' : 'Neutral effluent buffer'
    },
    {
      parameter: 'Chemical Oxygen Demand (COD)',
      measured: `${Math.round(currentSulfideEffluent * 1.6 + 180)} mg/L`,
      standard: '≤ 250 mg/L',
      isCompliant: (currentSulfideEffluent * 1.6 + 180) <= 250,
      riskNote: 'Oxygen depletion in receiving water bodies'
    }
  ];

  const allCompliant = complianceChecklist.every(c => c.isCompliant);

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold uppercase flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-emerald-400" />
              MODULE 5: EFFLUENT TREATMENT PLANT (ETP)
            </span>
            <span className="text-slate-400 text-xs font-mono">Tannery & Chemical Wastewater Twin</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2 mt-1">
            <Activity className="w-6 h-6 text-emerald-400" />
            3-Stream Industrial Wastewater Treatment Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Model catalytic sulfide oxidation, heavy metal chromium precipitation, and effluent discharge compliance.
          </p>
        </div>

        {/* Global Compliance Status Badge */}
        <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">DISCHARGE REGULATORY STATUS</span>
            <span className={`text-base font-black font-mono flex items-center justify-end gap-1.5 ${
              allCompliant ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {allCompliant ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  EPA COMPLIANT (PASS)
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-400 animate-pulse" />
                  VIOLATION: NON-COMPLIANT
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* STREAM SELECTOR TABS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => setActiveStream('sulfide')}
          className={`p-4 rounded-xl border text-left transition ${
            activeStream === 'sulfide'
              ? 'bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-950/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 uppercase font-bold">
              STREAM A
            </span>
            <span className={`text-xs font-mono font-bold ${currentSulfideEffluent <= 2.0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {currentSulfideEffluent} mg/L S²⁻
            </span>
          </div>
          <h4 className="font-bold text-slate-100 text-sm mt-1">Beamhouse Sulfide Liquor</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Catalytic oxidation with MnSO₄ & diffused aeration.</p>
        </button>

        <button
          onClick={() => setActiveStream('chrome')}
          className={`p-4 rounded-xl border text-left transition ${
            activeStream === 'chrome'
              ? 'bg-cyan-950/40 border-cyan-500/80 shadow-lg shadow-cyan-950/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 uppercase font-bold">
              STREAM B
            </span>
            <span className={`text-xs font-mono font-bold ${currentChromeEffluent <= 2.0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {currentChromeEffluent} mg/L Cr³⁺
            </span>
          </div>
          <h4 className="font-bold text-slate-100 text-sm mt-1">Chrome Tanning Float</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Alkali precipitation to insoluble Cr(OH)₃ sludge cake.</p>
        </button>

        <button
          onClick={() => setActiveStream('acidic')}
          className={`p-4 rounded-xl border text-left transition ${
            activeStream === 'acidic'
              ? 'bg-purple-950/40 border-purple-500/80 shadow-lg shadow-purple-950/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 uppercase font-bold">
              STREAM C
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400">
              pH {finalPh}
            </span>
          </div>
          <h4 className="font-bold text-slate-100 text-sm mt-1">Acidic Deliming & Pickling</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Strictly segregated stream. Neutralized before clarifier.</p>
        </button>
      </div>

      {/* STREAM DETAIL & INTERACTIVE SLIDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 1 COL: INTERACTIVE PROCESS CONTROLS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-sm">
              Operational Process Variables ({activeStream.toUpperCase()})
            </h3>
          </div>

          {activeStream === 'sulfide' && (
            <div className="space-y-4 text-xs">
              
              {/* Aeration Airflow Rate Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-slate-400">Diffused Airflow Rate:</span>
                  <span className="font-bold text-cyan-300">{aerationRate} Nm³/h</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="50"
                  value={aerationRate}
                  onChange={(e) => setAerationRate(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Higher aeration accelerates oxygen transfer to oxidizer catalyst.</span>
              </div>

              {/* MnSO4 Catalyst Dosage */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-slate-400">MnSO₄ Catalyst Dosage:</span>
                  <span className="font-bold text-emerald-300">{catalystDose} mg/L</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={catalystDose}
                  onChange={(e) => setCatalystDose(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Optimal dosage is 50 mg/L. Below 20 mg/L reaction rate drops 80%.</span>
              </div>

              {/* Inflow pH Control */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-slate-400">Initial Inflow pH:</span>
                  <span className={`font-bold ${sulfideInflowPh < 9.0 ? 'text-red-400' : 'text-emerald-300'}`}>
                    pH {sulfideInflowPh}
                  </span>
                </div>
                <input
                  type="range"
                  min="8.0"
                  max="13.0"
                  step="0.1"
                  value={sulfideInflowPh}
                  onChange={(e) => setSulfideInflowPh(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                {sulfideInflowPh < 9.0 && (
                  <p className="text-[10px] text-red-400 font-bold bg-red-950/40 p-2 rounded border border-red-500/40">
                    CRITICAL DANGER: Sulfide wastewater below pH 9.0 liberates toxic H₂S gas into ambient air!
                  </p>
                )}
              </div>

              {/* Chemical Equation Card */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 block">CATALYTIC REACTION EQUATION</span>
                <code className="text-[11px] font-mono text-emerald-300 font-bold block">
                  2 S²⁻ + 2 O₂ + H₂O ──[MnSO₄]──&gt; S₂O₃²⁻ + 2 OH⁻
                </code>
              </div>

            </div>
          )}

          {activeStream === 'chrome' && (
            <div className="space-y-4 text-xs">
              
              {/* Alkali Reagent Choice */}
              <div className="space-y-1.5">
                <span className="text-slate-400 block font-mono">Alkali Precipitation Agent:</span>
                <div className="grid grid-cols-3 gap-2">
                  {['MgO', 'Ca(OH)2', 'NaOH'].map((agent) => (
                    <button
                      key={agent}
                      onClick={() => setPrecipitationAgent(agent)}
                      className={`py-2 rounded-lg font-mono text-xs font-bold border transition ${
                        precipitationAgent === agent
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      {agent}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 block">
                  {precipitationAgent === 'MgO' ? 'Technical MgO forms dense, easily filterable sludge cake.' :
                   precipitationAgent === 'Ca(OH)2' ? 'Hydrated lime forms heavy calcium sulfate gypsum co-precipitate.' :
                   'Caustic soda gives gelatinous sludge that is difficult to dewater.'}
                </span>
              </div>

              {/* Target pH Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-slate-400">Target Precipitation pH:</span>
                  <span className="font-bold text-cyan-300">pH {precipitationPh}</span>
                </div>
                <input
                  type="range"
                  min="7.0"
                  max="11.0"
                  step="0.1"
                  value={precipitationPh}
                  onChange={(e) => setPrecipitationPh(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Minimum solubility for Cr(OH)₃ occurs between pH 8.5 and 9.2.</span>
              </div>

              {/* Dosage */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-slate-400">Alkali Dosage:</span>
                  <span className="font-bold text-emerald-300">{alkaliDose} kg/m³</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="8.0"
                  step="0.2"
                  value={alkaliDose}
                  onChange={(e) => setAlkaliDose(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Chemical Equation Card */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 block">PRECIPITATION EQUATION</span>
                <code className="text-[11px] font-mono text-cyan-300 font-bold block">
                  Cr³⁺ + 3 OH⁻ ──[pH 8.8]──&gt; Cr(OH)₃ (s) ↓ (Green Sludge)
                </code>
              </div>

            </div>
          )}

          {activeStream === 'acidic' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40 text-purple-200 space-y-2">
                <span className="font-bold block">Acidic Pickle Float Segregation Rule</span>
                <p className="text-[11px] leading-relaxed">
                  Acidic effluent (H₂SO₄ + HCOOH) must NEVER be co-mingled with un-oxidized beamhouse sulfide streams.
                  It must be neutralized separately with lime before being directed to the biological secondary treatment stage.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-slate-400">Neutralizing Lime Slurry:</span>
                  <span className="font-bold text-cyan-300">{neutralizerDose} kg/m³</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="6.0"
                  step="0.1"
                  value={neutralizerDose}
                  onChange={(e) => setNeutralizerDose(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Reset Defaults */}
          <button
            onClick={() => {
              setAerationRate(1200);
              setCatalystDose(50);
              setSulfideInflowPh(11.8);
              setPrecipitationAgent('MgO');
              setAlkaliDose(4.5);
              setPrecipitationPh(8.8);
            }}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-xl flex items-center justify-center space-x-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standard Operating Parameters</span>
          </button>
        </div>

        {/* RIGHT 2 COLS: RECHARTS DYNAMIC KINETICS & COMPLIANCE TABLE */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Reaction Kinetics Chart */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  REAL-TIME REACTION KINETICS
                </span>
                <h3 className="font-bold text-slate-100 text-base">
                  {activeStream === 'sulfide' ? 'Sulfide Degradation & Dissolved Oxygen vs Time' : 'Chromium Precipitation Rate vs Time'}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">Residence Time: 6 Hours</span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {activeStream === 'sulfide' ? (
                  <LineChart data={sulfideKinetics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#090f14', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Line type="monotone" dataKey="sulfide" stroke="#10b981" strokeWidth={2.5} name="Sulfide (mg/L)" dot={false} />
                    <Line type="monotone" dataKey="epaLimit" stroke="#ef4444" strokeDasharray="5 5" name="EPA Limit (2.0 mg/L)" dot={false} />
                    <Line type="monotone" dataKey="pH" stroke="#06b6d4" strokeWidth={1.8} name="Bath pH" dot={false} />
                  </LineChart>
                ) : (
                  <LineChart data={chromeKinetics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#090f14', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Line type="monotone" dataKey="chromium" stroke="#06b6d4" strokeWidth={2.5} name="Dissolved Cr³⁺ (mg/L)" dot={false} />
                    <Line type="monotone" dataKey="epaLimit" stroke="#ef4444" strokeDasharray="5 5" name="EPA Limit (2.0 mg/L)" dot={false} />
                    <Line type="monotone" dataKey="sludge" stroke="#f59e0b" strokeWidth={1.8} name="Cr(OH)₃ Sludge (kg/m³)" dot={false} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Effluent Compliance Radar / Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Effluent Quality Discharge Verification (EPA / CPCB Norms)
              </h3>
              <span className="text-xs font-mono text-slate-500">Automated Effluent Sensor Array</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-2">Parameter</th>
                    <th className="pb-2">Simulated Effluent</th>
                    <th className="pb-2">Regulatory Standard</th>
                    <th className="pb-2">Compliance Status</th>
                    <th className="pb-2">Ecotoxicological Risk Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {complianceChecklist.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      <td className="py-2.5 font-bold text-slate-200">{item.parameter}</td>
                      <td className={`py-2.5 font-black ${item.isCompliant ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.measured}
                      </td>
                      <td className="py-2.5 text-slate-400">{item.standard}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.isCompliant 
                            ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' 
                            : 'bg-red-950 border border-red-800 text-red-300 animate-pulse'
                        }`}>
                          {item.isCompliant ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                      <td className="py-2.5 text-[11px] text-slate-400 font-sans">{item.riskNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
