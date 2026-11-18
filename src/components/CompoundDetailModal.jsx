import React from 'react';
import { 
  X, FlaskConical, ExternalLink, ShieldCheck, 
  AlertTriangle, Leaf, Trash2, Box, Info, AlertOctagon, 
  Sparkles, Layers, Droplet 
} from 'lucide-react';
import PbtPillBar from './PbtPillBar';
import cameoRules from '../data/cameoRules.json';

export default function CompoundDetailModal({ compound, isOpen, onClose }) {
  if (!isOpen || !compound) return null;

  // Resolve CAMEO groups
  const resolvedGroups = (compound.cameoGroups || []).map(gid => {
    return cameoRules.groups.find(g => g.id === gid) || { id: gid, name: gid, cameoId: '?' };
  });

  const isGreen = compound.greenChemistryRating === 'Green';
  const isYellow = compound.greenChemistryRating === 'Yellow';
  const isRed = compound.greenChemistryRating === 'Red';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex justify-end transition-opacity duration-300">
      
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-2xl bg-forest-950/95 border-l border-emerald-500/20 shadow-2xl h-full flex flex-col z-10 overflow-hidden">
        
        {/* Top Header */}
        <div className="p-6 border-b border-emerald-500/15 bg-forest-900/80 backdrop-blur-md flex items-start justify-between">
          <div className="flex items-start space-x-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 ${
              isGreen ? 'bg-botanical-emerald/10 border-botanical-emerald/30 text-botanical-emerald shadow-[0_0_15px_rgba(16,185,129,0.2)]' :
              isYellow ? 'bg-botanical-amber/10 border-botanical-amber/30 text-botanical-amber shadow-[0_0_15px_rgba(245,158,11,0.2)]' :
              'bg-botanical-coral/10 border-botanical-coral/30 text-botanical-coral shadow-[0_0_15px_rgba(244,63,94,0.25)]'
            }`}>
              <FlaskConical className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{compound.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  isGreen ? 'bg-botanical-emerald/10 text-botanical-emerald border-botanical-emerald/30' :
                  isYellow ? 'bg-botanical-amber/10 text-botanical-amber border-botanical-amber/30' :
                  'bg-botanical-coral/10 text-botanical-coral border-botanical-coral/30'
                }`}>
                  {compound.greenChemistryRating}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-mono text-slate-400">
                <span className="text-botanical-lime font-bold">{compound.formula}</span>
                <span>•</span>
                <span>MW: {compound.molecularWeight} g/mol</span>
                {compound.cas && (
                  <>
                    <span>•</span>
                    <span className="text-slate-300">CAS: {compound.cas}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-forest-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Bento Block 1: Glowing Botanical 2D Molecular Structure */}
          <div className="bento-card p-5 relative overflow-hidden flex flex-col sm:flex-row items-center gap-5">
            {/* Molecular Structure with glowing filter */}
            <div className="w-44 h-44 rounded-xl bg-forest-950 p-2.5 border border-emerald-500/20 flex items-center justify-center relative overflow-hidden shadow-inner group">
              <div className="absolute inset-0 bg-botanical-emerald/5 opacity-50 pointer-events-none" />
              <img 
                src={compound.structureUrl || `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(compound.name)}/PNG`}
                alt={`${compound.name} Molecular Structure`}
                className="max-h-full max-w-full object-contain mol-structure-glow"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2310b981" stroke-width="1.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/></svg>';
                }}
              />
            </div>

            {/* Quick Properties */}
            <div className="flex-1 space-y-3 w-full">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  PubChem Live Chemical ID
                </span>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="font-mono text-sm font-bold text-botanical-sage">
                    {compound.cid ? `CID #${compound.cid}` : 'Custom Formulation'}
                  </span>
                  {compound.cid && (
                    <a
                      href={`https://pubchem.ncbi.nlm.nih.gov/compound/${compound.cid}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-botanical-emerald hover:text-botanical-lime transition"
                      title="Open in PubChem"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Segmented PBT Pill Bar */}
              <div className="pt-2 border-t border-emerald-500/10">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                  Eco-Toxicity PBT Rating
                </span>
                <PbtPillBar pbtScore={compound.pbtScore} size="md" />
              </div>

              <div className="pt-2 border-t border-emerald-500/10 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Role</span>
                  <span className="font-semibold text-white">{compound.pharmaRole}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Physical State</span>
                  <span className="font-semibold text-white">{compound.physicalState}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Block 2: Regulatory & Storage Classification */}
          <div className="bento-card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-botanical-teal" />
              <span>Hospital Pharmacy & USP &lt;800&gt; Regulatory Classification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-forest-900/60 border border-emerald-500/10">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                  USP &lt;800&gt; / NIOSH Class
                </span>
                <span className={`font-bold ${
                  compound.uspClassification?.includes('Antineoplastic') ? 'text-botanical-coral' :
                  compound.uspClassification?.includes('Hazardous') ? 'text-botanical-amber' :
                  'text-botanical-lime'
                }`}>
                  {compound.uspClassification || 'Non-Hazardous'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-forest-900/60 border border-emerald-500/10">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                  Storage Class Code
                </span>
                <span className="font-mono font-bold text-botanical-cyan">
                  {compound.storageClass || '11 (General)'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-forest-900/60 border border-emerald-500/10">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                  Climate Storage Conditions
                </span>
                <span className="text-slate-200 font-medium">
                  {compound.storageConditions}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-forest-900/60 border border-emerald-500/10">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                  Disposal Waste Stream
                </span>
                <span className="font-semibold text-botanical-coral">
                  {compound.wasteStream}
                </span>
              </div>

              {compound.smiles && (
                <div className="sm:col-span-2 p-3 rounded-xl bg-forest-900/60 border border-emerald-500/10">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Canonical SMILES Notation
                  </span>
                  <p className="font-mono text-xs text-botanical-sage break-all select-all">
                    {compound.smiles}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bento Block 3: NOAA CAMEO Reactivity Profiles */}
          <div className="bento-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-botanical-amber" />
                <span>NOAA CAMEO Reactive Groups ({resolvedGroups.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {resolvedGroups.map((grp, i) => (
                <div key={i} className="p-3 rounded-xl bg-forest-900/70 border border-emerald-500/10 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-botanical-amber">{grp.name}</span>
                    <span className="font-mono text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-black/40">
                      CAMEO #{grp.cameoId}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {grp.description || 'Active reactivity functional motif.'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bento Block 4: GHS Hazard Summary & openFDA Monograph */}
          <div className="bento-card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Info className="w-4 h-4 text-botanical-teal" />
              <span>GHS Safety Warnings & openFDA Drug Monograph</span>
            </h3>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 rounded-xl bg-forest-900/60 border border-emerald-500/10">
                <span className="font-bold text-botanical-coral block mb-1">
                  Chemical Reactivity & Hazard Profile:
                </span>
                <p className="text-slate-300">
                  {compound.hazardSummary || 'No acute reactivity hazards documented. Handle with standard laboratory PPE.'}
                </p>
              </div>

              {compound.fdaNotes && (
                <div className="p-3.5 rounded-xl bg-forest-900/60 border border-emerald-500/10">
                  <span className="font-bold text-botanical-cyan block mb-1">
                    openFDA Boxed Warning & Pharmaceutical Compounding Controls:
                  </span>
                  <p className="text-slate-300">
                    {compound.fdaNotes}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-emerald-500/15 bg-forest-900/80 backdrop-blur-md flex items-center justify-between text-xs text-slate-400">
          <span>PharmaEcoShield • Chemical Dossier Inspector</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-medium transition"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
