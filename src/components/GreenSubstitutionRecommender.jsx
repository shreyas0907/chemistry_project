import React, { useState, useMemo } from 'react';
import { 
  Leaf, AlertTriangle, ArrowRight, CheckCircle2, 
  Sparkles, ExternalLink, ShieldCheck, Zap, Droplet, Plus 
} from 'lucide-react';
import { GREEN_SUBSTITUTIONS } from '../data/greenSubstitutions';

export default function GreenSubstitutionRecommender({ inventory = [], onAddCompound }) {
  const [activeTab, setActiveTab] = useState('inventory_flags'); // 'inventory_flags' | 'all_library'
  const [selectedSubIndex, setSelectedSubIndex] = useState(0);

  // Scan current inventory for compounds matching our substitution library
  const flaggedInventory = useMemo(() => {
    const list = [];
    inventory.forEach(comp => {
      // Check if Red rating or match target alias
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
      } else if (comp.greenChemistryRating === 'Red') {
        // Generic red compound without specific library match
        list.push({
          compound: comp,
          substitutionPlan: null
        });
      }
    });
    return list;
  }, [inventory]);

  const activeSub = GREEN_SUBSTITUTIONS[selectedSubIndex] || GREEN_SUBSTITUTIONS[0];

  const handleAdoptAlternative = (alt, originalName) => {
    if (!onAddCompound) return;

    const newCompound = {
      id: 'comp-green-' + Date.now(),
      name: alt.name + ' (Green Substitute)',
      formula: alt.formula,
      molecularWeight: 88.0,
      cas: alt.cas,
      smiles: '',
      cid: null,
      structureUrl: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(alt.name.split(' ')[0])}/PNG`,
      physicalState: 'Liquid',
      pharmaRole: 'Solvent',
      cameoGroups: ['flammables', 'water_aqueous'],
      uspClassification: 'Non-Hazardous',
      storageClass: '3 (Flammable Liquid)',
      storageConditions: 'Room Temp (20°C–25°C)',
      pbtScore: {
        persistence: 'Low',
        bioaccumulation: 'Low',
        toxicity: 'Low'
      },
      greenChemistryRating: 'Green',
      wasteStream: alt.wasteBenefit.includes('Non-halogenated') ? 'Non-Halogenated Organic Solvent Waste' : 'Effluent Treatment Plant [ETP]',
      ghsPictograms: ['Flammable'],
      hazardSummary: `Adopted green pharmaceutical alternative to ${originalName}. ${alt.guidance}`,
      fdaNotes: 'USP <467> Class 3 preferred solvent with high daily exposure limit (PDE: 50 mg/day).'
    };

    onAddCompound(newCompound);
    alert(`Added "${alt.name}" to your active inventory as an eco-certified green substitute!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Bento Card */}
      <div className="bento-card p-6 relative overflow-hidden border-emerald-500/30">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-botanical-emerald/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-2.5 rounded-xl bg-botanical-emerald/10 border border-botanical-emerald/30 text-botanical-lime shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Leaf className="w-5 h-5 stroke-[2.2]" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Green Chemistry & Solvent Substitution Recommender
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Aligned with the American Chemical Society Green Chemistry Institute (ACS GCI) Pharmaceutical Roundtable guidelines.
              Automatically flags hazardous (Red) solvents/reagents and provides lower-toxicity, high-efficiency green replacements.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-forest-950 p-1.5 rounded-2xl border border-emerald-500/20">
            <button
              onClick={() => setActiveTab('inventory_flags')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'inventory_flags'
                  ? 'bg-gradient-to-r from-botanical-emerald to-botanical-lime text-forest-950 shadow-md shadow-botanical-emerald/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Flagged in Inventory ({flaggedInventory.length})
            </button>
            <button
              onClick={() => setActiveTab('all_library')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'all_library'
                  ? 'bg-gradient-to-r from-botanical-emerald to-botanical-lime text-forest-950 shadow-md shadow-botanical-emerald/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Substitution Guides ({GREEN_SUBSTITUTIONS.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Inventory Flags */}
      {activeTab === 'inventory_flags' && (
        <div className="space-y-6">
          {flaggedInventory.length === 0 ? (
            <div className="bento-card p-10 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-botanical-emerald/10 border border-botanical-emerald/30 flex items-center justify-center text-botanical-lime shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-white">No Critical Hazardous Solvents Flagged</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Your active inventory does not contain any high-hazard (Red) solvents requiring urgent replacement. Switch to the Complete Guides tab to explore green chemistry options!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-botanical-coral" />
                  <span>Hazardous Compounds Detected in Active Facility Formulary</span>
                </h3>
                <span className="text-xs text-botanical-coral font-mono font-bold">
                  {flaggedInventory.length} High-Risk Compounds Requiring Green Review
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {flaggedInventory.map((item, idx) => {
                  const comp = item.compound;
                  const plan = item.substitutionPlan;

                  return (
                    <div 
                      key={comp.id || idx}
                      className="bento-card p-6 border-botanical-coral/40 space-y-4"
                    >
                      {/* Flagged Item Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-emerald-500/10">
                        <div className="flex items-center space-x-3.5">
                          <span className="px-3 py-1 rounded-full bg-botanical-coral/15 border border-botanical-coral/40 text-botanical-coral text-xs font-black uppercase tracking-wider">
                            Red / Hazardous
                          </span>
                          <div>
                            <h4 className="text-base font-bold text-white flex items-center space-x-2">
                              <span>{comp.name}</span>
                              <span className="text-xs text-botanical-lime font-mono">({comp.formula})</span>
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Role: <span className="text-white font-medium">{comp.pharmaRole}</span> • CAS: <span className="font-mono text-slate-300">{comp.cas || 'N/A'}</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-left md:text-right text-xs">
                          <span className="text-slate-400 block">Current Waste Stream:</span>
                          <span className="font-bold text-botanical-coral font-mono">{comp.wasteStream}</span>
                        </div>
                      </div>

                      {/* Toxicity & Hazard Rationale */}
                      <div className="p-3.5 rounded-xl bg-botanical-coral/10 border border-botanical-coral/25 text-xs space-y-1">
                        <span className="font-bold text-botanical-coral">Environmental & Occupational Concern:</span>
                        <p className="text-slate-300 leading-relaxed">
                          {plan?.primaryHazard || comp.hazardSummary || "High environmental persistence and acute/chronic human toxicity profile."}
                        </p>
                      </div>

                      {/* Green Alternatives List */}
                      {plan ? (
                        <div className="space-y-3">
                          <h5 className="text-xs font-bold text-botanical-lime uppercase tracking-wider flex items-center space-x-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-botanical-emerald" />
                            <span>Recommended Green Pharmaceutical Alternatives</span>
                          </h5>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {plan.alternatives.map((alt, aIdx) => (
                              <div
                                key={aIdx}
                                className="p-4 rounded-xl bg-forest-950 border border-emerald-500/20 hover:border-emerald-500/50 transition space-y-3 flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-bold text-white">{alt.name}</span>
                                      <span className="text-[11px] font-mono text-botanical-lime">{alt.formula}</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-botanical-emerald/15 text-botanical-lime border border-botanical-emerald/30">
                                      {alt.greenScore}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-[11px] my-2">
                                    <div className="p-2.5 rounded-lg bg-forest-900 border border-emerald-500/10">
                                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Carbon Footprint:</span>
                                      <span className="font-bold text-botanical-lime font-mono">{alt.lcaCarbonSaving}</span>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-forest-900 border border-emerald-500/10">
                                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Aquatic PBT:</span>
                                      <span className="font-bold text-botanical-teal font-mono truncate">{alt.pbtComparison.p}</span>
                                    </div>
                                  </div>

                                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                                    <span className="text-botanical-lime font-bold">Implementation Guide: </span>
                                    {alt.guidance}
                                  </p>
                                </div>

                                <div className="pt-3 border-t border-emerald-500/10 flex items-center justify-between">
                                  <span className="text-[11px] text-slate-400 truncate mr-2 font-mono">
                                    Waste: {alt.wasteBenefit}
                                  </span>
                                  <button
                                    onClick={() => handleAdoptAlternative(alt, comp.name)}
                                    className="px-3.5 py-1.5 bg-gradient-to-r from-botanical-emerald to-botanical-lime text-forest-950 text-xs font-black rounded-xl flex items-center space-x-1 transition flex-shrink-0 hover:scale-105"
                                  >
                                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                    <span>Adopt to Inventory</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-forest-950 border border-emerald-500/20 text-xs text-slate-400">
                          <p>
                            Consider non-chlorinated bio-based solvents (e.g. Ethyl Acetate, 2-MeTHF) or aqueous enzymatic syntheses to mitigate the high toxicity of this compound.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Complete Substitution Guides Library */}
      {activeTab === 'all_library' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: List of Hazardous Chemicals Bento Card */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Hazardous Pharmaceutical Solvents & Reagents
            </h3>
            <div className="space-y-2">
              {GREEN_SUBSTITUTIONS.map((item, idx) => {
                const isSelected = selectedSubIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedSubIndex(idx)}
                    className={`w-full p-4 rounded-2xl text-left border transition flex flex-col space-y-1 ${
                      isSelected
                        ? 'bg-botanical-emerald/20 border-botanical-lime text-white shadow-lg shadow-botanical-emerald/20'
                        : 'bg-forest-900/60 border-emerald-500/15 text-slate-400 hover:border-emerald-500/35 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{item.targetCompound}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-botanical-coral/15 text-botanical-coral border border-botanical-coral/30">
                        {item.hazardLevel.split('/')[0]}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{item.category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Scientific Comparison Bento Card */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bento-card p-6 space-y-5">
              
              {/* Header of Active Selection */}
              <div className="pb-4 border-b border-emerald-500/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <span>{activeSub.targetCompound}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest-950 border border-emerald-500/20 text-slate-300 font-mono">
                      {activeSub.category}
                    </span>
                  </h3>
                  <span className="text-xs font-bold text-botanical-coral bg-botanical-coral/15 px-2.5 py-0.5 rounded-full border border-botanical-coral/30">
                    High Regulatory Scrutiny (ICH Q3C / USP &lt;467&gt;)
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  <strong className="text-botanical-coral">Hazard Profile: </strong>
                  {activeSub.primaryHazard}
                </p>
              </div>

              {/* Proposed Greener Alternatives */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-botanical-lime uppercase tracking-wider flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-botanical-emerald" />
                  <span>ACS GCI Validated Green Replacements ({activeSub.alternatives.length})</span>
                </h4>

                <div className="space-y-4">
                  {activeSub.alternatives.map((alt, idx) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-2xl bg-forest-950 border border-emerald-500/20 hover:border-botanical-emerald/50 transition space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{alt.name}</span>
                          <span className="text-xs font-mono text-botanical-lime">{alt.formula}</span>
                          <span className="text-xs text-slate-400 font-mono">(CAS: {alt.cas})</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-botanical-emerald/15 text-botanical-lime border border-botanical-emerald/30 w-fit">
                          {alt.greenScore}
                        </span>
                      </div>

                      {/* Scientific Metrics Table */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        <div className="p-3 rounded-xl bg-forest-900 border border-emerald-500/10">
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">LCA Carbon Footprint</span>
                          <span className="font-bold text-botanical-lime font-mono">{alt.lcaCarbonSaving}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-forest-900 border border-emerald-500/10">
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Aquatic PBT Profile</span>
                          <span className="text-slate-300 font-mono text-[11px] truncate block">{alt.pbtComparison.p}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-forest-900 border border-emerald-500/10">
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Waste Segregation</span>
                          <span className="text-botanical-teal font-mono text-[11px] truncate block">{alt.wasteBenefit}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 leading-relaxed bg-forest-900/50 p-3.5 rounded-xl border border-emerald-500/10">
                        <span className="font-bold text-botanical-lime block mb-1">Process Chemistry & Formulation Guidance:</span>
                        {alt.guidance}
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleAdoptAlternative(alt, activeSub.targetCompound)}
                          className="px-4 py-2 bg-gradient-to-r from-botanical-emerald to-botanical-lime text-forest-950 text-xs font-black rounded-xl flex items-center space-x-1.5 transition hover:scale-105"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Add to Active Inventory</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
