import React, { useState, useMemo } from 'react';
import { 
  Layers, AlertTriangle, AlertOctagon, CheckCircle2, 
  HelpCircle, Sparkles, Search, Trash2, ArrowRight, 
  Flame, Skull, Droplets, Info, ExternalLink, ShieldCheck 
} from 'lucide-react';
import { evaluateMultiChemicalCompatibility } from '../services/chemicalSafetyEngine';

export default function CompatibilityChecker({ inventory = [], onSelectChemicalForDetail }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('ALL');

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

  // Preset Demonstrations across industries
  const applyPreset = (presetKey) => {
    if (presetKey === 'leather_sulfide_acid') {
      const sulfide = inventory.find(c => c.name.toLowerCase().includes('sulfide'));
      const acid = inventory.find(c => c.name.toLowerCase().includes('sulfuric') || c.cameoGroups?.includes('acids_inorganic'));
      if (sulfide && acid) setSelectedIds([sulfide.id, acid.id]);
    } else if (presetKey === 'pharma_acyl_water') {
      const acyl = inventory.find(c => c.name.toLowerCase().includes('sebacoyl') || c.cameoGroups?.includes('acyl_halides'));
      const water = inventory.find(c => c.name.toLowerCase().includes('hydroxide') || c.cameoGroups?.includes('water_aqueous'));
      if (acyl && water) setSelectedIds([acyl.id, water.id]);
    } else if (presetKey === 'cosmetics_peroxide_terpene') {
      const peroxide = inventory.find(c => c.name.toLowerCase().includes('peroxide'));
      const terpene = inventory.find(c => c.name.toLowerCase().includes('limonene') || c.cameoGroups?.includes('flammables'));
      if (peroxide && terpene) setSelectedIds([peroxide.id, terpene.id]);
    } else if (presetKey === 'general_oxidizer_solvent') {
      const oxidizer = inventory.find(c => c.name.toLowerCase().includes('nitric'));
      const solvent = inventory.find(c => c.name.toLowerCase().includes('toluene') || c.pharmaRole === 'Solvent');
      if (oxidizer && solvent) setSelectedIds([oxidizer.id, solvent.id]);
    } else if (presetKey === 'safe_green_solvents') {
      const safeSolvents = inventory.filter(c => c.greenChemistryRating === 'Green' && c.pharmaRole?.includes('Solvent')).slice(0, 3);
      if (safeSolvents.length >= 2) {
        setSelectedIds(safeSolvents.map(s => s.id));
      } else {
        const anyGreen = inventory.filter(c => c.greenChemistryRating === 'Green').slice(0, 3);
        setSelectedIds(anyGreen.map(g => g.id));
      }
    }
  };

  // Filter chemicals to pick from
  const selectableChemicals = useMemo(() => {
    return inventory.filter(chem => {
      const term = searchTerm.toLowerCase().trim();
      const matchSearch = !term ||
        chem.name.toLowerCase().includes(term) ||
        (chem.cas && chem.cas.toLowerCase().includes(term)) ||
        (chem.formula && chem.formula.toLowerCase().includes(term)) ||
        chem.storageLocation.toLowerCase().includes(term);

      const matchIndustry = filterIndustry === 'ALL' || chem.industry === filterIndustry;

      return matchSearch && matchIndustry;
    });
  }, [inventory, searchTerm, filterIndustry]);

  // Selected chemicals objects
  const selectedChemicals = useMemo(() => {
    return inventory.filter(c => selectedIds.includes(c.id));
  }, [inventory, selectedIds]);

  // Execute Multi-Chemical Compatibility Engine
  const evaluation = useMemo(() => {
    return evaluateMultiChemicalCompatibility(selectedChemicals);
  }, [selectedChemicals]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#0b1324] border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Layers className="w-5 h-5 stroke-[2.2]" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Chemical Compatibility &amp; Cross-Reactivity Engine
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
            Multi-chemical assessment evaluating chemical reactivity, storage segregation, process hazards, and waste compatibility based on authoritative NOAA CAMEO and OSHA standards.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={selectAll}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
          >
            Select All ({inventory.length})
          </button>
          <button
            onClick={clearAll}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Preset Demonstrations Row */}
      <div className="p-4 rounded-xl bg-[#0b1324] border border-slate-800 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-400 flex items-center space-x-1.5 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Industry Hazard Presets:</span>
        </span>
        <button
          onClick={() => applyPreset('leather_sulfide_acid')}
          className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-300 font-bold transition"
        >
          ☠️ Leather: Sulfide + Acid (Lethal H2S Gas)
        </button>
        <button
          onClick={() => applyPreset('pharma_acyl_water')}
          className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-300 font-bold transition"
        >
          🔥 Pharma: Acyl Halide + Base (HCl Gas Overpressure)
        </button>
        <button
          onClick={() => applyPreset('cosmetics_peroxide_terpene')}
          className="px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-700/60 text-amber-300 font-bold transition"
        >
          ⚠️ Cosmetics: 35% H2O2 + Fragrance (Deflagration)
        </button>
        <button
          onClick={() => applyPreset('general_oxidizer_solvent')}
          className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-300 font-bold transition"
        >
          💥 General: Nitric Acid + Toluene (Spontaneous Fire)
        </button>
        <button
          onClick={() => applyPreset('safe_green_solvents')}
          className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 font-bold transition"
        >
          ✅ Preferred Green Solvents (Verified Safe)
        </button>
      </div>

      {/* Chemical Selection Tray */}
      <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Chemical Name, CAS RN (e.g. 1313-82-2), or Formula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Target Industries</option>
              <option value="Leather Tanning">Leather Tanning</option>
              <option value="Pharmaceuticals">Pharmaceuticals</option>
              <option value="Cosmetics">Cosmetics &amp; Personal Care</option>
              <option value="General Chemical">General Chemical</option>
            </select>
            <span className="text-xs font-mono text-emerald-400 font-bold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              {selectedIds.length} Selected
            </span>
          </div>
        </div>

        {/* Chemical Cards Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 max-h-56 overflow-y-auto p-1">
          {selectableChemicals.map(chem => {
            const isSelected = selectedIds.includes(chem.id);
            return (
              <button
                key={chem.id}
                onClick={() => toggleSelection(chem.id)}
                className={`p-3 rounded-xl text-left border transition relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-950/50'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between w-full mb-1">
                    <span className="font-bold text-xs leading-tight line-clamp-1">{chem.name}</span>
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 ml-1 border ${
                      isSelected ? 'bg-emerald-500 border-emerald-400 text-black font-bold' : 'border-slate-700'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-400 block truncate">
                    {chem.formula || chem.cas}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[9px] text-slate-400 mt-2 font-mono w-full">
                  <span className="truncate">{chem.industry.split(' ')[0]}</span>
                  <span className={`px-1 rounded ${
                    chem.greenChemistryRating === 'Green' ? 'text-emerald-400 bg-emerald-950' :
                    chem.greenChemistryRating === 'Red' ? 'text-red-400 bg-red-950' : 'text-amber-400 bg-amber-950'
                  }`}>
                    {chem.greenChemistryRating}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* State A: Less than 2 chemicals selected */}
      {selectedChemicals.length < 2 && (
        <div className="p-8 rounded-2xl bg-[#0b1324] border border-dashed border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Select at Least 2 Chemicals to Run Compatibility Evaluation</h3>
            <p className="text-xs text-slate-400 max-w-md mt-1">
              Pick substances from the cards above or click any preset button (such as Leather Sulfide + Acid or Pharma Acyl Halide) to evaluate cross-reactivity and segregation mandates.
            </p>
          </div>
        </div>
      )}

      {/* State B: 2+ Chemicals Selected - Evaluation Results */}
      {selectedChemicals.length >= 2 && (
        <div className="space-y-6">
          
          {/* Overall Status Banner */}
          <div className={`p-6 rounded-2xl border transition shadow-2xl ${
            evaluation.overallCategory === 'RED'
              ? 'bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border-red-500 text-white' :
            evaluation.overallCategory === 'UNKNOWN'
              ? 'bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-slate-600 text-white' :
            evaluation.overallCategory === 'AMBER'
              ? 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-amber-500 text-white' :
              'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-emerald-500 text-white'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-lg ${
                  evaluation.overallCategory === 'RED' ? 'bg-red-600/30 border-red-500 text-red-400 animate-pulse' :
                  evaluation.overallCategory === 'UNKNOWN' ? 'bg-slate-700/30 border-slate-500 text-slate-300' :
                  evaluation.overallCategory === 'AMBER' ? 'bg-amber-600/30 border-amber-500 text-amber-400' :
                  'bg-emerald-600/30 border-emerald-500 text-emerald-400'
                }`}>
                  {evaluation.overallCategory === 'RED' ? <AlertOctagon className="w-8 h-8 stroke-[2.2]" /> :
                   evaluation.overallCategory === 'UNKNOWN' ? <HelpCircle className="w-8 h-8 stroke-[2.2]" /> :
                   evaluation.overallCategory === 'AMBER' ? <AlertTriangle className="w-8 h-8 stroke-[2.2]" /> :
                   <ShieldCheck className="w-8 h-8 stroke-[2.2]" />}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      evaluation.overallCategory === 'RED' ? 'bg-red-600 text-white' :
                      evaluation.overallCategory === 'UNKNOWN' ? 'bg-slate-700 text-white' :
                      evaluation.overallCategory === 'AMBER' ? 'bg-amber-500 text-black' :
                      'bg-emerald-500 text-black'
                    }`}>
                      {evaluation.overallBadgeText}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      ({selectedChemicals.length} Substances • {evaluation.pairInteractions.length} Pair Checks)
                    </span>
                  </div>
                  <p className="text-base font-bold text-white mt-1.5">{evaluation.summary}</p>
                </div>
              </div>

              <div className="text-right hidden sm:block font-mono text-xs">
                <span className="text-slate-400 block">Verdict Breakdown:</span>
                <span className="text-red-400 font-bold">{evaluation.redCount} Red</span> •{' '}
                <span className="text-amber-400 font-bold">{evaluation.amberCount} Amber</span> •{' '}
                <span className="text-emerald-400 font-bold">{evaluation.greenCount} Green</span>
              </div>
            </div>
          </div>

          {/* Multi-Chemical Compatibility Heatmap Matrix (When 3+ Chemicals Selected) */}
          {selectedChemicals.length >= 3 && (
            <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Multi-Chemical Pairwise Compatibility Matrix Grid</span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  Green: Safe • Amber: Caution • Red: Hazard • Grey: Unknown/Missing Data
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2.5 border border-slate-800 bg-slate-950 text-slate-400 font-mono">Matrix</th>
                      {selectedChemicals.map(c => (
                        <th key={c.id} className="p-2.5 border border-slate-800 bg-slate-950 text-slate-300 font-bold max-w-[120px] truncate">
                          {c.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedChemicals.map((rowChem, rIdx) => (
                      <tr key={rowChem.id}>
                        <td className="p-2.5 border border-slate-800 bg-slate-950 font-bold text-slate-200 max-w-[120px] truncate">
                          {rowChem.name}
                        </td>
                        {selectedChemicals.map((colChem, cIdx) => {
                          if (rIdx === cIdx) {
                            return (
                              <td key={colChem.id} className="p-2.5 border border-slate-800 bg-slate-900/50 text-center text-slate-600 font-mono">
                                —
                              </td>
                            );
                          }

                          const pair = evaluation.pairInteractions.find(
                            p => (p.chemA.id === rowChem.id && p.chemB.id === colChem.id) ||
                                 (p.chemA.id === colChem.id && p.chemB.id === rowChem.id)
                          );

                          const sev = pair?.severity || 'SAFE';
                          const isUnknown = pair?.status === 'UNKNOWN';

                          return (
                            <td 
                              key={colChem.id}
                              className={`p-2.5 border border-slate-800 text-center font-black transition cursor-help ${
                                isUnknown ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700' :
                                sev === 'DANGER' ? 'bg-red-950/80 text-red-300 hover:bg-red-900' :
                                sev === 'CAUTION' ? 'bg-amber-950/80 text-amber-300 hover:bg-amber-900' :
                                'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900'
                              }`}
                              title={`${rowChem.name} + ${colChem.name}: ${pair?.hazardTitle || 'Compatible'}`}
                            >
                              {isUnknown ? '? UNKNOWN' :
                               sev === 'DANGER' ? '✕ RED' :
                               sev === 'CAUTION' ? '▲ AMBER' :
                               '✓ GREEN'}
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

          {/* Pairwise Reaction Hazard Breakdown Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Flame className="w-4 h-4 text-emerald-400" />
              <span>Scientific Reaction Mechanism Breakdown ({evaluation.pairInteractions.length} Pairs Evaluated)</span>
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {evaluation.pairInteractions.map((pair, idx) => {
                const isRed = pair.severity === 'DANGER';
                const isAmber = pair.severity === 'CAUTION';
                const isUnknown = pair.status === 'UNKNOWN';

                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border transition ${
                      isRed ? 'bg-red-950/20 border-red-500/60 shadow-lg shadow-red-950/20' :
                      isUnknown ? 'bg-slate-900/90 border-slate-700' :
                      isAmber ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-950/20' :
                      'bg-emerald-950/15 border-emerald-500/30'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isRed ? 'bg-red-600 text-white' :
                          isUnknown ? 'bg-slate-700 text-white' :
                          isAmber ? 'bg-amber-500 text-black' :
                          'bg-emerald-500 text-black'
                        }`}>
                          {pair.category || pair.status}
                        </span>

                        <div className="flex items-center space-x-2 text-xs text-white font-bold">
                          <button
                            onClick={() => onSelectChemicalForDetail && onSelectChemicalForDetail(pair.chemA)}
                            className="hover:text-emerald-400 underline decoration-dotted transition"
                          >
                            {pair.chemA.name} ({pair.chemA.formula})
                          </button>
                          <span className="text-slate-500">+</span>
                          <button
                            onClick={() => onSelectChemicalForDetail && onSelectChemicalForDetail(pair.chemB)}
                            className="hover:text-emerald-400 underline decoration-dotted transition"
                          >
                            {pair.chemB.name} ({pair.chemB.formula})
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
                        <span>Class: <strong>{pair.incompatibilityType}</strong></span>
                        {pair.hazardCode && pair.hazardCode !== 'None' && (
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 font-bold">
                            [{pair.hazardCode}]
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Hazard Title & Chemical Equation */}
                    <div className="my-2.5 space-y-1 text-xs">
                      <h4 className={`font-bold ${isRed ? 'text-red-400' : isAmber ? 'text-amber-400' : 'text-slate-200'}`}>
                        {pair.hazardTitle}
                      </h4>
                      {pair.chemicalEquation && (
                        <p className="font-mono text-cyan-300 text-[11px] bg-black/40 p-2 rounded-lg border border-slate-800">
                          <strong>Equation: </strong>{pair.chemicalEquation}
                        </p>
                      )}
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        {pair.description}
                      </p>
                    </div>

                    {/* Segregation Action & Emergency Precautions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <strong className="text-emerald-400 block mb-0.5">Segregation &amp; Preventive Protocol:</strong>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{pair.segregationAction}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <strong className="text-amber-400 block mb-0.5">Handling &amp; Emergency PPE:</strong>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{pair.emergencyPrecautions}</p>
                      </div>
                    </div>

                    {/* Sources & Confidence */}
                    <div className="pt-2 text-[10px] text-slate-500 flex items-center justify-between font-mono">
                      <span>Source: {pair.authoritativeSource}</span>
                      <span>Confidence: {pair.confidence}</span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
