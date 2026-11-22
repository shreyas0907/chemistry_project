import React, { useState, useMemo } from 'react';
import { 
  Leaf, Droplet, ShieldCheck, AlertTriangle, ArrowRight, 
  ExternalLink, CheckCircle2, Waves, Sparkles, Plus, 
  Layers, Info, FileSpreadsheet, Recycle, Activity
} from 'lucide-react';
import PbtPillBar from './PbtPillBar';
import { GREEN_SUBSTITUTIONS } from '../data/greenSubstitutions';

export default function EnvironmentalModule({ inventory = [], onAddCompound }) {
  const [activeSubTab, setActiveSubTab] = useState('pbt'); // 'pbt' | 'wgk' | 'etp' | 'substitutions'
  const [selectedSubIndex, setSelectedSubIndex] = useState(0);
  const [selectedWgkFilter, setSelectedWgkFilter] = useState('ALL');

  // Compute metrics across inventory
  const envMetrics = useMemo(() => {
    let wgk3Count = 0;
    let wgk2Count = 0;
    let wgk1Count = 0;
    let highPbtCount = 0;
    let highToxCount = 0;
    let persistentCount = 0;

    inventory.forEach(c => {
      const wgk = c.wgkClass || '';
      if (wgk.includes('WGK 3')) wgk3Count++;
      else if (wgk.includes('WGK 2')) wgk2Count++;
      else if (wgk.includes('WGK 1')) wgk1Count++;

      const pbt = c.pbtScore || {};
      if (pbt.persistence === 'High' || pbt.bioaccumulation === 'High' || pbt.toxicity === 'High') {
        highPbtCount++;
      }
      if (pbt.persistence === 'High') persistentCount++;
      if (pbt.toxicity === 'High') highToxCount++;
    });

    return {
      wgk3Count,
      wgk2Count,
      wgk1Count,
      highPbtCount,
      highToxCount,
      persistentCount
    };
  }, [inventory]);

  // Inventory matches for substitution
  const flaggedInventory = useMemo(() => {
    const list = [];
    inventory.forEach(comp => {
      const nameLower = comp.name.toLowerCase();
      const match = GREEN_SUBSTITUTIONS.find(sub => 
        sub.targetAliases.some(alias => nameLower.includes(alias)) ||
        nameLower.includes(sub.targetCompound.toLowerCase())
      );

      if (match) {
        list.push({
          compound: comp,
          substitutionPlan: match
        });
      }
    });
    return list;
  }, [inventory]);

  const activeSubstitution = GREEN_SUBSTITUTIONS[selectedSubIndex] || GREEN_SUBSTITUTIONS[0];

  const handleAdoptAlternative = (alt, originalName) => {
    if (!onAddCompound) return;

    const newCompound = {
      id: 'chem-green-' + Date.now(),
      name: alt.name + ' (Green Substitute)',
      formula: alt.formula,
      molecularWeight: 88.0,
      cas: alt.cas,
      industry: "General Chemical",
      physicalState: 'Liquid',
      pharmaRole: 'Green Solvent / Reagent',
      quantity: 100,
      unit: "L",
      storageLocation: "Bay 2 - Eco Solvent Drum Rack",
      cameoGroups: ['flammables', 'water_aqueous'],
      storageClass: '3 (Flammable Liquid)',
      storageConditions: 'Ambient Vent, Sealed Drum',
      expiryDate: '2028-12-31',
      sdsRef: `SDS-GREEN-${alt.name.split(' ')[0]}`,
      nfpa: { health: 1, flammability: 2, instability: 0, special: "" },
      ghsPictograms: ['Flammable'],
      pbtScore: {
        persistence: alt.pbtComparison.p.toLowerCase().includes('high') ? 'High' : 'Low',
        bioaccumulation: alt.pbtComparison.b.toLowerCase().includes('high') ? 'High' : 'Low',
        toxicity: alt.pbtComparison.t.toLowerCase().includes('high') ? 'High' : 'Low'
      },
      wgkClass: 'WGK 1 (Slightly Hazardous to Water)',
      greenChemistryRating: 'Green',
      wasteStream: 'Standard Non-Halogenated Solvent Recycling',
      hazardSummary: `Green substitute for ${originalName}. Lower carbon footprint, readily biodegradable, reduced aquatic toxicity.`,
      handlingNotes: 'Store in standard flammable storage bay with grounding strap.'
    };

    onAddCompound(newCompound);
    alert(`Successfully registered ${alt.name} into Active Chemical Inventory! Check Inventory Bay 2.`);
  };

  // Filtered inventory for WGK tab
  const wgkFilteredChemicals = useMemo(() => {
    if (selectedWgkFilter === 'ALL') return inventory;
    return inventory.filter(c => (c.wgkClass || '').includes(selectedWgkFilter));
  }, [inventory, selectedWgkFilter]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Hero */}
      <div className="bento-card p-6 border-emerald-500/20 bg-gradient-to-r from-forest-950 via-[#0a1813] to-forest-900 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="p-2 rounded-xl bg-botanical-emerald/15 text-botanical-emerald border border-botanical-emerald/30">
                <Leaf className="w-5 h-5 stroke-[2.2]" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                Environmental Impact & Green Substitution Platform
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Industrial eco-toxicology screening adhering to the German Federal Water Act (AwSV WGK), 
              REACH Annex XIII PBT criteria, EPA Effluent Treatment Guidelines, and ACS Green Chemistry Institute solvent substitution guides.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-forest-900/90 border border-emerald-500/20 text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">WGK 3 High Risk</span>
              <span className="text-lg font-black text-rose-400 font-mono">{envMetrics.wgk3Count}</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-forest-900/90 border border-emerald-500/20 text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">High PBT Load</span>
              <span className="text-lg font-black text-amber-400 font-mono">{envMetrics.highPbtCount}</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-forest-900/90 border border-emerald-500/20 text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Green Alternatives</span>
              <span className="text-lg font-black text-botanical-lime font-mono">{GREEN_SUBSTITUTIONS.length}</span>
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-emerald-500/15 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('pbt')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeSubTab === 'pbt'
                ? 'bg-gradient-to-r from-botanical-emerald to-botanical-teal text-forest-950 shadow-md shadow-botanical-emerald/20'
                : 'text-slate-400 hover:text-white hover:bg-forest-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>PBT Hazard Profiler</span>
          </button>

          <button
            onClick={() => setActiveSubTab('wgk')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeSubTab === 'wgk'
                ? 'bg-gradient-to-r from-botanical-emerald to-botanical-teal text-forest-950 shadow-md shadow-botanical-emerald/20'
                : 'text-slate-400 hover:text-white hover:bg-forest-900'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>German WGK Water Hazard Classes</span>
          </button>

          <button
            onClick={() => setActiveSubTab('etp')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeSubTab === 'etp'
                ? 'bg-gradient-to-r from-botanical-emerald to-botanical-teal text-forest-950 shadow-md shadow-botanical-emerald/20'
                : 'text-slate-400 hover:text-white hover:bg-forest-900'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>ETP Wastewater Stream Segregation</span>
          </button>

          <button
            onClick={() => setActiveSubTab('substitutions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeSubTab === 'substitutions'
                ? 'bg-gradient-to-r from-botanical-emerald to-botanical-teal text-forest-950 shadow-md shadow-botanical-emerald/20'
                : 'text-slate-400 hover:text-white hover:bg-forest-900'
            }`}
          >
            <Recycle className="w-3.5 h-3.5" />
            <span>ACS GCI Green Substitutions</span>
            {flaggedInventory.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/20 text-rose-300 font-bold">
                {flaggedInventory.length} In Inventory
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. PBT HAZARD PROFILER TAB                               */}
      {/* ======================================================== */}
      {activeSubTab === 'pbt' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bento-card p-5 border-amber-500/20 bg-forest-950">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Persistence (P)</span>
                <span className="text-xs font-mono text-slate-400">Half-Life &gt; 60 Days</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Substances that resist chemical hydrolysis, microbial breakdown, and photodegradation in surface waters.
              </p>
              <div className="text-2xl font-black text-amber-300 font-mono">
                {envMetrics.persistentCount} <span className="text-xs font-sans text-slate-400 font-normal">compounds flagged</span>
              </div>
            </div>

            <div className="bento-card p-5 border-rose-500/20 bg-forest-950">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Bioaccumulation (B)</span>
                <span className="text-xs font-mono text-slate-400">BCF &gt; 2000 / Log Kow &gt; 4.5</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Lipophilic chemicals that accumulate in aquatic trophic chains, concentrating in predatory organisms.
              </p>
              <div className="text-2xl font-black text-rose-300 font-mono">
                {inventory.filter(c => c.pbtScore?.bioaccumulation === 'High').length} <span className="text-xs font-sans text-slate-400 font-normal">compounds flagged</span>
              </div>
            </div>

            <div className="bento-card p-5 border-purple-500/20 bg-forest-950">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Aquatic Toxicity (T)</span>
                <span className="text-xs font-mono text-slate-400">EC50 / LC50 &lt; 0.1 mg/L</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Acute and chronic toxicity to aquatic micro-crustaceans (Daphnia magna) and river micro-fauna.
              </p>
              <div className="text-2xl font-black text-purple-300 font-mono">
                {envMetrics.highToxCount} <span className="text-xs font-sans text-slate-400 font-normal">compounds flagged</span>
              </div>
            </div>
          </div>

          {/* Inventory PBT Audit Table */}
          <div className="bento-card p-6 border-emerald-500/15 bg-forest-950">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Facility Inventory PBT Profiling Matrix</h3>
                <p className="text-xs text-slate-400">Evaluated under REACH Annex XIII, EPA TSCA, and Stockholm POP Convention</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-emerald-500/15 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Chemical Name</th>
                    <th className="py-3 px-3">Industry</th>
                    <th className="py-3 px-3">CAS RN</th>
                    <th className="py-3 px-3">PBT Segmented Rating</th>
                    <th className="py-3 px-3">Eco Rating</th>
                    <th className="py-3 px-3">Effluent Fate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/10">
                  {inventory.map(chem => (
                    <tr key={chem.id} className="hover:bg-forest-900/40 transition">
                      <td className="py-3 px-3">
                        <span className="font-bold text-white block">{chem.name}</span>
                        <span className="font-mono text-[11px] text-slate-400">{chem.formula}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-medium">
                        {chem.industry || "General"}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300">
                        {chem.cas || "N/A"}
                      </td>
                      <td className="py-3 px-3">
                        <PbtPillBar pbtScore={chem.pbtScore} />
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          chem.greenChemistryRating === 'Green' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          chem.greenChemistryRating === 'Yellow' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {chem.greenChemistryRating || 'Unrated'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                        {chem.wasteStream || 'General ETP'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. GERMAN WGK WATER HAZARD CLASSES TAB                   */}
      {/* ======================================================== */}
      {activeSubTab === 'wgk' && (
        <div className="space-y-6">
          <div className="bento-card p-6 border-cyan-500/20 bg-forest-950">
            <h3 className="text-base font-bold text-white mb-2 flex items-center space-x-2">
              <Droplet className="w-5 h-5 text-cyan-400" />
              <span>German AwSV / VwVwS Water Hazard Framework</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl mb-6">
              The German Federal Ordinance on Facilities Handling Substances Hazardous to Water (AwSV) mandates rigorous secondary containment bunding, leak detection, and catchment trays calculated according to the assigned Wassergefährdungsklasse (WGK).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <button
                onClick={() => setSelectedWgkFilter('ALL')}
                className={`p-4 rounded-xl border text-left transition ${
                  selectedWgkFilter === 'ALL'
                    ? 'bg-forest-900 border-cyan-500/40 text-white shadow-lg'
                    : 'bg-forest-950 border-emerald-500/15 text-slate-400 hover:bg-forest-900/60'
                }`}
              >
                <div className="text-xs font-bold uppercase mb-1">All Classes</div>
                <div className="text-2xl font-black font-mono text-cyan-300">{inventory.length}</div>
                <div className="text-[10px] text-slate-400 mt-1">Total Registered Chemicals</div>
              </button>

              <button
                onClick={() => setSelectedWgkFilter('WGK 1')}
                className={`p-4 rounded-xl border text-left transition ${
                  selectedWgkFilter === 'WGK 1'
                    ? 'bg-forest-900 border-emerald-500/40 text-white shadow-lg'
                    : 'bg-forest-950 border-emerald-500/15 text-slate-400 hover:bg-forest-900/60'
                }`}
              >
                <div className="text-xs font-bold uppercase text-emerald-400 mb-1">WGK 1: Low Hazard</div>
                <div className="text-2xl font-black font-mono text-emerald-300">{envMetrics.wgk1Count}</div>
                <div className="text-[10px] text-slate-400 mt-1">Standard bunding volume (10%)</div>
              </button>

              <button
                onClick={() => setSelectedWgkFilter('WGK 2')}
                className={`p-4 rounded-xl border text-left transition ${
                  selectedWgkFilter === 'WGK 2'
                    ? 'bg-forest-900 border-amber-500/40 text-white shadow-lg'
                    : 'bg-forest-950 border-emerald-500/15 text-slate-400 hover:bg-forest-900/60'
                }`}
              >
                <div className="text-xs font-bold uppercase text-amber-400 mb-1">WGK 2: Water Hazardous</div>
                <div className="text-2xl font-black font-mono text-amber-300">{envMetrics.wgk2Count}</div>
                <div className="text-[10px] text-slate-400 mt-1">Secondary containment (100% capacity)</div>
              </button>

              <button
                onClick={() => setSelectedWgkFilter('WGK 3')}
                className={`p-4 rounded-xl border text-left transition ${
                  selectedWgkFilter === 'WGK 3'
                    ? 'bg-forest-900 border-rose-500/40 text-white shadow-lg'
                    : 'bg-forest-950 border-emerald-500/15 text-slate-400 hover:bg-forest-900/60'
                }`}
              >
                <div className="text-xs font-bold uppercase text-rose-400 mb-1">WGK 3: Highly Hazardous</div>
                <div className="text-2xl font-black font-mono text-rose-300">{envMetrics.wgk3Count}</div>
                <div className="text-[10px] text-slate-400 mt-1">Double-walled tanks + automated shutoff</div>
              </button>
            </div>

            {/* Filtered Chemicals List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Showing {wgkFilteredChemicals.length} Chemicals in Category: <span className="text-cyan-400">{selectedWgkFilter}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {wgkFilteredChemicals.map(chem => (
                  <div key={chem.id} className="p-3.5 rounded-xl bg-forest-900/70 border border-emerald-500/15 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-white text-xs">{chem.name}</div>
                        <div className="font-mono text-[11px] text-slate-400">{chem.cas || 'No CAS'} • {chem.formula}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono whitespace-nowrap ${
                        (chem.wgkClass || '').includes('WGK 3') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        (chem.wgkClass || '').includes('WGK 2') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {chem.wgkClass ? chem.wgkClass.split(' ')[0] + ' ' + chem.wgkClass.split(' ')[1] : 'WGK 1'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 bg-forest-950 p-2 rounded border border-emerald-500/10">
                      <span className="text-slate-400 font-medium">Bunding Requirement: </span>
                      {(chem.wgkClass || '').includes('WGK 3') 
                        ? '110% bund capacity, stainless steel catchment tray, dual leak sensors.' 
                        : (chem.wgkClass || '').includes('WGK 2')
                        ? '100% drum spill pallet, impermeable chemical-resistant floor coating.'
                        : 'Standard containment, drip tray under transfer taps.'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. ETP WASTEWATER STREAM SEGREGATION TAB                 */}
      {/* ======================================================== */}
      {activeSubTab === 'etp' && (
        <div className="space-y-6">
          <div className="bento-card p-6 border-emerald-500/20 bg-forest-950">
            <div className="flex items-center space-x-2.5 mb-2">
              <Waves className="w-5 h-5 text-botanical-teal" />
              <h3 className="text-base font-bold text-white tracking-wide">
                4-Stream Industrial Effluent Treatment Plant (ETP) Architecture
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl mb-6">
              Preventing catastrophic runaway reactions, hazardous gas generation, and biological filter poisonings in centralized wastewater infrastructure.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Stream 1 */}
              <div className="p-5 rounded-xl bg-forest-900/60 border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    Stream 1: Sulfide Oxidation (ETP-S)
                  </span>
                  <span className="text-[11px] font-mono text-rose-400 font-bold">MANDATORY SEGREGATION</span>
                </div>
                <div className="text-xs text-slate-200 leading-relaxed">
                  <strong className="text-white">Chemistry:</strong> Unhairing / liming spent baths containing <code className="text-amber-300">Na2S / NaHS</code>.
                </div>
                <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200">
                  <strong className="block text-rose-300 mb-1">Fatal Accident Prevention Protocol:</strong>
                  MUST NEVER mix with acidic pickle effluent or general acidic sewer. Must be aerated with 
                  catalytic <span className="font-mono text-amber-300">MnSO4</span> at <span className="font-mono text-amber-300">pH &ge; 10.0</span> for 6–8 hours to oxidize 
                  <span className="font-mono"> S²⁻ &rarr; SO₄²⁻</span> before discharge to equalization tank.
                </div>
              </div>

              {/* Stream 2 */}
              <div className="p-5 rounded-xl bg-forest-900/60 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    Stream 2: Chrome Recovery (ETP-Cr)
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">CIRCULAR CLOSED-LOOP</span>
                </div>
                <div className="text-xs text-slate-200 leading-relaxed">
                  <strong className="text-white">Chemistry:</strong> Spent chrome tanning liquors with trivalent chromium <code className="text-cyan-300">Cr(OH)SO4</code>.
                </div>
                <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200">
                  <strong className="block text-cyan-300 mb-1">Circular Recovery Process:</strong>
                  Precipitated using <span className="font-mono text-cyan-300">MgO</span> or <span className="font-mono text-cyan-300">NaOH</span> at <span className="font-mono">pH 8.5–9.0</span> to form dense <span className="font-mono">Cr(OH)₃</span> cake. Dewatered, filter-pressed, and re-dissolved with technical <span className="font-mono">H₂SO₄</span> for 100% recycling back to tanning drums.
                </div>
              </div>

              {/* Stream 3 */}
              <div className="p-5 rounded-xl bg-forest-900/60 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Stream 3: High-COD & Solvents (ETP-ORG)
                  </span>
                  <span className="text-[11px] font-mono text-amber-400 font-bold">SOLVENT ISOLATION</span>
                </div>
                <div className="text-xs text-slate-200 leading-relaxed">
                  <strong className="text-white">Chemistry:</strong> Concentrated mother liquors, fragrance terpene washes, and solvent residues (IPA, acetone, ethanol).
                </div>
                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
                  <strong className="block text-amber-300 mb-1">Pre-treatment Protocol:</strong>
                  Pass through flash distillation column for solvent recovery. Remaining high-COD sludge routed to anaerobic UASB reactor rather than directly shocking aerobic activated sludge aeration basins.
                </div>
              </div>

              {/* Stream 4 */}
              <div className="p-5 rounded-xl bg-forest-900/60 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Stream 4: General Equalization & Bio (ETP-GEN)
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">FINAL POLISHING</span>
                </div>
                <div className="text-xs text-slate-200 leading-relaxed">
                  <strong className="text-white">Chemistry:</strong> Rinsing waters, beamhouse wash waters, and pre-treated composite streams.
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200">
                  <strong className="block text-emerald-300 mb-1">Biological & Tertiary Treatment:</strong>
                  Mechanical screening &rarr; Dissolved Air Flotation (DAF) for fat/grease removal &rarr; Coagulation with Alum/Polyelectrolyte &rarr; Extended aeration activated sludge &rarr; Sand/Carbon filtration polishing.
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. ACS GCI GREEN SUBSTITUTIONS TAB                       */}
      {/* ======================================================== */}
      {activeSubTab === 'substitutions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Substitution Selection Library */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bento-card p-4 border-emerald-500/20 bg-forest-950">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                ACS GCI Industrial Substitution Profiles ({GREEN_SUBSTITUTIONS.length})
              </h3>
              
              <div className="space-y-2">
                {GREEN_SUBSTITUTIONS.map((sub, idx) => {
                  const isInInventory = flaggedInventory.some(f => f.substitutionPlan?.targetCompound === sub.targetCompound);
                  return (
                    <button
                      key={sub.targetCompound}
                      onClick={() => setSelectedSubIndex(idx)}
                      className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                        selectedSubIndex === idx
                          ? 'bg-forest-900 border-botanical-emerald text-white shadow-lg shadow-botanical-emerald/15'
                          : 'bg-forest-950/80 border-emerald-500/10 text-slate-300 hover:bg-forest-900/50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs flex items-center space-x-1.5">
                          <span>{sub.targetCompound}</span>
                          {isInInventory && (
                            <span className="w-2 h-2 rounded-full bg-rose-500" title="Present in your inventory" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{sub.category}</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Detailed Alternative Plan */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bento-card p-6 border-emerald-500/25 bg-forest-950">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-emerald-500/15 pb-4 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Hazardous Baseline Reagent</span>
                  <h2 className="text-lg font-black text-white">{activeSubstitution.targetCompound}</h2>
                  <p className="text-xs text-rose-300 mt-1 font-medium">{activeSubstitution.primaryHazard}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                  {activeSubstitution.hazardLevel}
                </span>
              </div>

              {/* Recommended Alternatives */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-botanical-lime flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-botanical-emerald" />
                  <span>Scientifically Verified Drop-In Alternatives ({activeSubstitution.alternatives.length})</span>
                </h4>

                {activeSubstitution.alternatives.map((alt, aIdx) => (
                  <div key={alt.name} className="p-4 rounded-xl bg-forest-900/60 border border-emerald-500/20 space-y-3">
                    
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-bold text-sm text-white flex items-center space-x-2">
                          <span>{alt.name}</span>
                          <span className="font-mono text-xs text-botanical-lime font-normal">({alt.formula})</span>
                        </h5>
                        <div className="text-[11px] font-mono text-slate-400">CAS: {alt.cas}</div>
                      </div>

                      <button
                        onClick={() => handleAdoptAlternative(alt, activeSubstitution.targetCompound)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-botanical-emerald to-botanical-teal text-forest-950 text-xs font-bold hover:scale-105 transition flex items-center space-x-1 shadow-md shadow-botanical-emerald/20"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Adopt to Inventory</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-forest-950 border border-emerald-500/10">
                        <span className="text-slate-400 block font-medium">LCA Carbon Benefit:</span>
                        <span className="text-botanical-lime font-bold">{alt.lcaCarbonSaving}</span>
                      </div>
                      <div className="p-2 rounded bg-forest-950 border border-emerald-500/10">
                        <span className="text-slate-400 block font-medium">Waste Benefit:</span>
                        <span className="text-slate-200">{alt.wasteBenefit}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-forest-950/80 border border-emerald-500/15 text-xs text-slate-300">
                      <strong className="text-botanical-emerald font-semibold">Technical Guidance: </strong>
                      {alt.guidance}
                    </div>

                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
