import React, { useMemo } from 'react';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, MapPin, 
  Layers, ArrowRight, Download, FileSpreadsheet, Building2, Trash2 
} from 'lucide-react';
import { detectStorageBayViolations, evaluateMultiChemicalCompatibility } from '../services/chemicalSafetyEngine';

const STORAGE_CLASS_RULES = [
  { classA: "8A (Corrosive Acids)", classB: "8B (Corrosive Alkalis)", distance: "Min 6 meters or separate bunds", rationale: "Violent neutralization boiling and splattering" },
  { classA: "8A (Corrosive Acids)", classB: "Sulfides / Cyanides", distance: "Strict Physical Isolation (Separate Rooms)", rationale: "Instantaneous lethal H2S / HCN gas release" },
  { classA: "5.1 (Strong Oxidizers)", classB: "3 (Flammable Liquids)", distance: "Min 6 meters or 2-hour fire-rated wall", rationale: "Spontaneous combustion and explosion" },
  { classA: "5.1 (Strong Oxidizers)", classB: "Reducing Agents (NaBH4)", distance: "Strict Physical Isolation", rationale: "Violent redox deflagration / detonation" },
  { classA: "4.3 (Water-Reactive)", classB: "Aqueous Solutions / Acids", distance: "Hermetically sealed dry room", rationale: "Explosive H2 gas liberation and thermal eruption" },
  { classA: "6.1A (Cytotoxics)", classB: "General Chemicals", distance: "Negative-pressure oncology cleanroom (C-PEC)", rationale: "Carcinogenic and mutagenic aerosol contamination" }
];

export default function SegregationSystem({ inventory = [], onSelectChemical }) {
  // Run bay audit
  const bayViolations = useMemo(() => {
    return detectStorageBayViolations(inventory);
  }, [inventory]);

  // Waste stream segregation mapping
  const wasteStreamRouting = useMemo(() => {
    const streams = {};
    inventory.forEach(c => {
      const ws = c.wasteStream || 'General Waste Stream';
      if (!streams[ws]) streams[ws] = [];
      streams[ws].push(c);
    });
    return streams;
  }, [inventory]);

  // Download Segregation Plan CSV
  const handleExportSegregation = () => {
    const headers = [
      "Storage Location / Bay",
      "Severity Status",
      "Chemicals in Bay",
      "Segregation Mandate"
    ];

    const rows = bayViolations.map(bv => [
      `"${bv.location}"`,
      `"${bv.severity}"`,
      `"${bv.totalChemicalsInBay} Chemicals"`,
      `"${bv.recommendation.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CHEM-SHIELD_Segregation_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0b1324] border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Industrial Storage Segregation &amp; Waste Stream Allocation
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
            Automated detection of localized co-storage violations across facility bays, minimum physical distance rules, and segregated chemical waste drum routing based on NOAA CAMEO and NFPA 400.
          </p>
        </div>

        <button
          onClick={handleExportSegregation}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 flex items-center space-x-2 transition shadow-md w-fit"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export Segregation Audit (.CSV)</span>
        </button>
      </div>

      {/* Live Warehouse Bay Violations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>Active Storage Bay Compatibility Audits</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {bayViolations.filter(v => v.severity === 'CRITICAL').length} Critical Alarms Detected
          </span>
        </div>

        {bayViolations.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0b1324] border border-emerald-500/20 text-center flex flex-col items-center justify-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">All Warehouse Storage Bays Fully Segregated</h4>
            <p className="text-xs text-slate-400">No co-storage violations detected across assigned facility rooms or bays.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bayViolations.map((bv, idx) => {
              const isCrit = bv.severity === 'CRITICAL';
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition shadow-xl ${
                    isCrit 
                      ? 'bg-red-950/20 border-red-500/60 shadow-red-950/20' 
                      : 'bg-amber-950/20 border-amber-500/50 shadow-amber-950/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isCrit ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-500 text-black'
                      }`}>
                        {bv.severity} CO-STORAGE ALARM
                      </span>
                      <h4 className="text-base font-bold text-white flex items-center space-x-1.5">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{bv.location}</span>
                      </h4>
                    </div>

                    <span className="text-xs font-mono text-slate-400">
                      {bv.totalChemicalsInBay} Substances in this Bay
                    </span>
                  </div>

                  {/* Conflicting Pairs */}
                  {bv.dangerPairs && (
                    <div className="my-3 space-y-1.5">
                      <span className="text-[11px] font-bold text-red-300 uppercase tracking-wider block">
                        Conflicting Chemical Interactions:
                      </span>
                      {bv.dangerPairs.map((dp, pIdx) => (
                        <div key={pIdx} className="p-2.5 rounded-lg bg-black/40 border border-red-500/30 text-xs flex items-center justify-between">
                          <span className="text-white font-bold">{dp.chemA.name} + {dp.chemB.name}</span>
                          <span className="text-red-300 font-mono text-[11px]">{dp.hazardTitle}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Mandate */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                    <strong className="text-emerald-400 block font-bold">Recommended Physical Segregation:</strong>
                    <p className="text-slate-300 leading-relaxed">
                      {bv.recommendation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Industrial Chemical Storage Class Separation Reference Table */}
      <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Industrial Storage Class Separation Distance Standards</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">NFPA 400 Hazardous Materials Code</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#070d1a] text-slate-400 uppercase text-[10px] font-mono">
                <th className="p-3">Primary Chemical Class</th>
                <th className="p-3">Incompatible Counterpart</th>
                <th className="p-3">Minimum Separation Distance</th>
                <th className="p-3">Hazard Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {STORAGE_CLASS_RULES.map((rule, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-bold text-white">{rule.classA}</td>
                  <td className="p-3 font-bold text-red-300">{rule.classB}</td>
                  <td className="p-3 text-emerald-400 font-semibold">{rule.distance}</td>
                  <td className="p-3 text-slate-300 text-[11px]">{rule.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Waste Drum Segregation Routing */}
      <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Trash2 className="w-4 h-4 text-cyan-400" />
          <span>Compliant Industrial Waste Stream Allocation ({Object.keys(wasteStreamRouting).length} Distinct Streams)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(wasteStreamRouting).map(([streamName, chems]) => (
            <div key={streamName} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {streamName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {chems.length} Item{chems.length > 1 ? 's' : ''}
                  </span>
                </div>

                <ul className="space-y-1.5 my-3">
                  {chems.map(c => (
                    <li key={c.id} className="text-xs text-slate-300 flex items-center justify-between">
                      <span className="truncate mr-2 font-medium">{c.name}</span>
                      <span className="text-[10px] text-emerald-400 font-mono flex-shrink-0">
                        {c.industry.split(' ')[0]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="text-emerald-400 font-semibold">Handling: </span>
                {streamName.includes('Sulfide') ? 'Continuous alkaline aeration/catalytic oxidation before discharge.' :
                 streamName.includes('Chrome') ? 'Chemical precipitation with soda ash; precipitate cake for recovery.' :
                 streamName.includes('Cytotoxic') ? 'Double-glove, C-PEC compounding, rigid yellow biohazard incineration at 1100°C.' :
                 streamName.includes('Halogenated') ? 'Dedicated chlorinated container; prevent vapor emission.' :
                 streamName.includes('Incineration') ? 'Maintain dry seals; dispatch to licensed high-temp facility (>1200°C).' :
                 streamName.includes('Neutralization') ? 'Controlled stoichiometry in acid/base dilution vessel.' :
                 'Standard industrial ETP biological treatment.'}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
