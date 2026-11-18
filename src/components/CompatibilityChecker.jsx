import React, { useState, useMemo } from 'react';
import { 
  AlertOctagon, AlertTriangle, ShieldCheck, CheckCircle2, 
  Trash2, RefreshCw, Layers, ArrowRight, Flame, Skull, 
  HelpCircle, Sparkles, Filter, ExternalLink 
} from 'lucide-react';
import { analyzeReactivityMatrix } from '../services/pharmaApi';

export default function CompatibilityChecker({ inventory = [], onSelectCompoundForDetail }) {
  // Selected compound IDs
  const [selectedIds, setSelectedIds] = useState([]);

  // Toggle selection
  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(inventory.map(c => c.id));
  };

  const clearAll = () => {
    setSelectedIds([]);
  };

  // Preset quick scenarios
  const applyPreset = (presetName) => {
    if (presetName === 'acyl_water') {
      const sebacoyl = inventory.find(c => c.name.toLowerCase().includes('sebacoyl'));
      const aqueous = inventory.find(c => c.cameoGroups?.includes('water_aqueous') || c.cameoGroups?.includes('caustics_bases'));
      if (sebacoyl && aqueous) {
        setSelectedIds([sebacoyl.id, aqueous.id]);
      }
    } else if (presetName === 'dcm_caustic') {
      const dcm = inventory.find(c => c.name.toLowerCase().includes('dichloromethane') || c.name.toLowerCase().includes('dcm'));
      const caustic = inventory.find(c => c.name.toLowerCase().includes('sodium hydroxide') || c.cameoGroups?.includes('caustics_bases'));
      if (dcm && caustic) {
        setSelectedIds([dcm.id, caustic.id]);
      }
    } else if (presetName === 'cytotoxic_aqueous') {
      const cisplatin = inventory.find(c => c.name.toLowerCase().includes('cisplatin') || c.cameoGroups?.includes('cytotoxics'));
      const solvent = inventory.find(c => c.name.toLowerCase().includes('ethanol') || c.pharmaRole === 'Solvent');
      if (cisplatin && solvent) {
        setSelectedIds([cisplatin.id, solvent.id]);
      }
    } else if (presetName === 'solvents_safe') {
      const solvents = inventory.filter(c => c.pharmaRole === 'Solvent' && !c.cameoGroups?.includes('halogenated_organic')).slice(0, 3);
      if (solvents.length >= 2) {
        setSelectedIds(solvents.map(s => s.id));
      }
    }
  };

  // Selected compounds list
  const selectedCompounds = useMemo(() => {
    return inventory.filter(c => selectedIds.includes(c.id));
  }, [inventory, selectedIds]);

  // Run Reactivity Engine
  const analysis = useMemo(() => {
    return analyzeReactivityMatrix(selectedCompounds);
  }, [selectedCompounds]);

  // Distinct waste streams needed for current selection
  const wasteStreamRouting = useMemo(() => {
    const streams = {};
    selectedCompounds.forEach(c => {
      const ws = c.wasteStream || 'General Waste';
      if (!streams[ws]) streams[ws] = [];
      streams[ws].push(c);
    });
    return streams;
  }, [selectedCompounds]);

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bento Card */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-botanical-lime stroke-[2.2]" />
              <span>Multi-Compound Reactivity & Waste Segregation Engine</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select 2 or more compounds to simulate co-storage compatibility, compounding mixing safety, and waste drum routing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={selectAll}
              className="px-3.5 py-1.5 rounded-xl bg-forest-900 border border-emerald-500/20 hover:bg-forest-800 text-xs font-semibold text-slate-300 transition"
            >
              Select All ({inventory.length})
            </button>
            <button
              onClick={clearAll}
              className="px-3.5 py-1.5 rounded-xl bg-forest-900 border border-emerald-500/20 hover:bg-forest-800 text-xs font-semibold text-slate-300 transition"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="pt-3 border-t border-emerald-500/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex items-center space-x-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-botanical-lime" />
            <span>Preset Hazard Demonstrations:</span>
          </span>
          <button
            onClick={() => applyPreset('acyl_water')}
            className="px-3 py-1.5 rounded-xl bg-botanical-coral/15 hover:bg-botanical-coral/25 border border-botanical-coral/30 text-xs font-bold text-botanical-coral transition"
          >
            🔥 Acyl Halide + Aqueous Base (Violent Exotherm)
          </button>
          <button
            onClick={() => applyPreset('dcm_caustic')}
            className="px-3 py-1.5 rounded-xl bg-botanical-amber/15 hover:bg-botanical-amber/25 border border-botanical-amber/30 text-xs font-bold text-botanical-amber transition"
          >
            ⚠️ Halogenated + Strong Base (Dehydrohalogenation)
          </button>
          <button
            onClick={() => applyPreset('cytotoxic_aqueous')}
            className="px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/60 text-xs font-bold text-purple-300 transition"
          >
            ☣️ Cytotoxic Antineoplastic (USP &lt;800&gt; Segregation)
          </button>
          <button
            onClick={() => applyPreset('solvents_safe')}
            className="px-3 py-1.5 rounded-xl bg-botanical-emerald/15 hover:bg-botanical-emerald/25 border border-botanical-emerald/30 text-xs font-bold text-botanical-lime transition"
          >
            ✅ Preferred Green Solvents (Safe Co-Storage)
          </button>
        </div>

        {/* Compound Selector Chips Grid */}
        <div className="pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {inventory.map(comp => {
              const isSelected = selectedIds.includes(comp.id);

              return (
                <button
                  key={comp.id}
                  onClick={() => toggleSelection(comp.id)}
                  className={`p-3 rounded-xl text-left border transition relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-botanical-emerald/20 border-botanical-lime text-white shadow-lg shadow-botanical-emerald/20'
                      : 'bg-forest-950/80 border-emerald-500/15 text-slate-400 hover:border-emerald-500/35 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between w-full mb-1">
                    <span className="font-bold text-xs leading-tight line-clamp-1">{comp.name}</span>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ml-1 border ${
                      isSelected ? 'bg-botanical-lime border-botanical-lime text-forest-950 font-bold' : 'border-slate-700'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 w-full mt-2 font-mono">
                    <span className="text-botanical-lime">{comp.formula || comp.pharmaRole}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                      comp.greenChemistryRating === 'Green' ? 'text-botanical-lime bg-botanical-emerald/10' :
                      comp.greenChemistryRating === 'Yellow' ? 'text-botanical-amber bg-botanical-amber/10' : 'text-botanical-coral bg-botanical-coral/10'
                    }`}>
                      {comp.pharmaRole}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* When fewer than 2 compounds are selected */}
      {selectedCompounds.length < 2 && (
        <div className="bento-card p-10 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-forest-900 border border-emerald-500/20 flex items-center justify-center text-botanical-lime shadow-inner">
            <Layers className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Select At Least 2 Compounds</h3>
            <p className="text-xs text-slate-400 max-w-md mt-1">
              Select multiple compounds above or click one of the preset hazard scenarios to run pairwise CAMEO reactivity cross-referencing and drum segregation.
            </p>
          </div>
        </div>
      )}

      {/* Analysis Results Display */}
      {selectedCompounds.length >= 2 && (
        <div className="space-y-6">
          
          {/* Status Banner Bento Card */}
          <div className={`bento-card p-6 border transition shadow-2xl ${
            analysis.overallStatus === 'INCOMPATIBLE' 
              ? 'border-botanical-coral/60 bg-gradient-to-r from-botanical-coral/20 via-forest-900 to-botanical-coral/20 glow-coral' :
            analysis.overallStatus === 'CONDITIONAL'
              ? 'border-botanical-amber/60 bg-gradient-to-r from-botanical-amber/20 via-forest-900 to-botanical-amber/20 glow-amber' :
              'border-botanical-emerald/60 bg-gradient-to-r from-botanical-emerald/20 via-forest-900 to-botanical-emerald/20 glow-emerald'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-lg ${
                  analysis.overallStatus === 'INCOMPATIBLE' ? 'bg-botanical-coral/25 border-botanical-coral text-botanical-coral animate-pulse' :
                  analysis.overallStatus === 'CONDITIONAL' ? 'bg-botanical-amber/25 border-botanical-amber text-botanical-amber' :
                  'bg-botanical-emerald/25 border-botanical-lime text-botanical-lime'
                }`}>
                  {analysis.overallStatus === 'INCOMPATIBLE' ? <AlertOctagon className="w-8 h-8 stroke-[2.3]" /> :
                   analysis.overallStatus === 'CONDITIONAL' ? <AlertTriangle className="w-8 h-8 stroke-[2.3]" /> :
                   <ShieldCheck className="w-8 h-8 stroke-[2.3]" />}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md ${
                      analysis.overallStatus === 'INCOMPATIBLE' ? 'bg-botanical-coral text-white' :
                      analysis.overallStatus === 'CONDITIONAL' ? 'bg-botanical-amber text-black' :
                      'bg-botanical-lime text-forest-950'
                    }`}>
                      {analysis.overallBadgeText}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      ({selectedCompounds.length} compounds • {analysis.pairInteractions.length} pair checks)
                    </span>
                  </div>
                  <p className="text-base font-bold text-white mt-1.5">{analysis.summary}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-right hidden sm:block">
                  <span className="text-xs text-slate-400 block font-medium">Waste Isolation Channels:</span>
                  <span className="text-sm font-extrabold text-botanical-teal font-mono">
                    {Object.keys(wasteStreamRouting).length} Distinct Streams
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Compatibility Heatmap Matrix Bento Card (3+ Compounds Selected) */}
          {selectedCompounds.length >= 3 && (
            <div className="bento-card p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-botanical-lime" />
                  <span>Cross-Compatibility Interaction Matrix Grid</span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  Green: Safe • Yellow: Caution / Regulated • Red: Danger Incompatible
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2.5 border border-emerald-500/15 bg-forest-950 text-slate-400 font-mono">Matrix</th>
                      {selectedCompounds.map(c => (
                        <th key={c.id} className="p-2.5 border border-emerald-500/15 bg-forest-950 text-slate-300 font-bold max-w-[120px] truncate">
                          {c.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCompounds.map((rowComp, rIdx) => (
                      <tr key={rowComp.id}>
                        <td className="p-2.5 border border-emerald-500/15 bg-forest-950 font-bold text-slate-200 max-w-[120px] truncate">
                          {rowComp.name}
                        </td>
                        {selectedCompounds.map((colComp, cIdx) => {
                          if (rIdx === cIdx) {
                            return (
                              <td key={colComp.id} className="p-2.5 border border-emerald-500/15 bg-forest-900/50 text-center text-slate-600 font-mono">
                                —
                              </td>
                            );
                          }

                          // Find pairwise interaction
                          const pair = analysis.pairInteractions.find(
                            p => (p.compoundA.id === rowComp.id && p.compoundB.id === colComp.id) ||
                                 (p.compoundA.id === colComp.id && p.compoundB.id === rowComp.id)
                          );

                          const severity = pair?.severity || 'SAFE';

                          return (
                            <td 
                              key={colComp.id} 
                              className={`p-2.5 border border-emerald-500/15 text-center font-black transition cursor-help ${
                                severity === 'DANGER' ? 'bg-botanical-coral/30 text-botanical-coral hover:bg-botanical-coral/45' :
                                severity === 'CAUTION' ? 'bg-botanical-amber/30 text-botanical-amber hover:bg-botanical-amber/45' :
                                'bg-botanical-emerald/30 text-botanical-lime hover:bg-botanical-emerald/45'
                              }`}
                              title={`${rowComp.name} + ${colComp.name}: ${pair?.hazardTitle || 'Compatible'}`}
                            >
                              {severity === 'DANGER' ? '✕ DANGER' :
                               severity === 'CAUTION' ? '▲ CAUTION' :
                               '✓ SAFE'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pairwise Interaction Breakdown List Bento Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Flame className="w-4 h-4 text-botanical-coral" />
              <span>Pairwise Chemical Reaction Breakdown ({analysis.pairInteractions.length} Pairs Evaluated)</span>
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {analysis.pairInteractions.map((pair, idx) => {
                const isDanger = pair.severity === 'DANGER';
                const isCaution = pair.severity === 'CAUTION';

                return (
                  <div
                    key={idx}
                    className={`bento-card p-5 transition ${
                      isDanger ? 'border-botanical-coral/50 shadow-lg shadow-botanical-coral/10' :
                      isCaution ? 'border-botanical-amber/50 shadow-md shadow-botanical-amber/10' :
                      'border-emerald-500/15'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isDanger ? 'bg-botanical-coral text-white' :
                          isCaution ? 'bg-botanical-amber text-black' :
                          'bg-botanical-emerald/20 text-botanical-lime border border-botanical-emerald/40'
                        }`}>
                          {pair.status}
                        </span>
                        
                        <div className="flex items-center space-x-1.5 text-xs text-white font-bold">
                          <button
                            onClick={() => onSelectCompoundForDetail && onSelectCompoundForDetail(pair.compoundA)}
                            className="hover:text-botanical-lime underline decoration-dotted transition"
                          >
                            {pair.compoundA.name}
                          </button>
                          <span className="text-slate-500">+</span>
                          <button
                            onClick={() => onSelectCompoundForDetail && onSelectCompoundForDetail(pair.compoundB)}
                            className="hover:text-botanical-lime underline decoration-dotted transition"
                          >
                            {pair.compoundB.name}
                          </button>
                        </div>
                      </div>

                      {pair.hazardCode && pair.hazardCode !== 'None' && (
                        <div className="flex items-center space-x-1 text-xs font-mono text-slate-400">
                          <span className="text-slate-500">CAMEO Code:</span>
                          <span className="px-2 py-0.5 rounded bg-black/40 text-botanical-amber font-bold border border-botanical-amber/30">
                            [{pair.hazardCode}]
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Hazard Title & Chemical Explanation */}
                    <div className="space-y-1.5 text-xs my-2">
                      <p className={`font-bold ${isDanger ? 'text-botanical-coral' : isCaution ? 'text-botanical-amber' : 'text-slate-300'}`}>
                        {pair.hazardTitle}
                      </p>
                      <p className="text-slate-300 leading-relaxed">
                        {pair.description}
                      </p>
                    </div>

                    {/* Segregation Action Box */}
                    <div className="mt-3 p-3 rounded-xl bg-forest-950/90 border border-emerald-500/15 flex items-start space-x-2.5 text-xs">
                      <Trash2 className="w-4 h-4 text-botanical-teal flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-botanical-teal mr-1">Waste Segregation Mandate:</span>
                        <span className="text-slate-300">{pair.segregationAction}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Waste Stream Drum Allocation Bento Card */}
          <div className="bento-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Trash2 className="w-4 h-4 text-botanical-teal" />
              <span>Pharmaceutical Waste Drum Routing & Storage Allocation</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(wasteStreamRouting).map(([streamName, compounds]) => (
                <div key={streamName} className="p-4 rounded-xl bg-forest-950/80 border border-emerald-500/15 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-botanical-teal/15 border border-botanical-teal/30 text-botanical-teal text-xs font-bold">
                        {streamName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {compounds.length} Item{compounds.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    <ul className="space-y-1.5 my-3">
                      {compounds.map(c => (
                        <li key={c.id} className="text-xs text-slate-300 flex items-center justify-between">
                          <span className="truncate mr-2 font-medium">{c.name}</span>
                          <span className="text-[10px] text-botanical-lime font-mono flex-shrink-0">
                            {c.storageClass?.split(' ')?.[0] || 'Std'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-emerald-500/10 text-[11px] text-slate-400">
                    <span className="text-botanical-lime font-bold">Protocol: </span>
                    {streamName.includes('Cytotoxic') ? 'Double-glove, negative pressure compounding, yellow biohazard container.' :
                     streamName.includes('Halogenated') ? 'Dedicated chlorinated container; prevent vapor escape.' :
                     streamName.includes('Incineration') ? 'Maintain dry seals; dispatch to licensed high-temp facility.' :
                     streamName.includes('Neutralization') ? 'Controlled neutralization in jacketed dilution vessel.' :
                     'Follow institutional biomedical waste SOP.'}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
