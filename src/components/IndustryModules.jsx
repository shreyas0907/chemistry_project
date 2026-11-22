import React, { useState, useMemo } from 'react';
import { 
  Building2, ShieldAlert, AlertTriangle, CheckCircle2, 
  Droplet, Flame, Layers, Sparkles, ExternalLink, Leaf, ArrowRight, Skull 
} from 'lucide-react';

export default function IndustryModules({ inventory = [], onSelectChemical }) {
  const [activeIndustry, setActiveIndustry] = useState('leather'); // 'leather' | 'pharma' | 'cosmetics' | 'general'

  // Filter inventory by industry
  const leatherChems = useMemo(() => inventory.filter(c => c.industry === 'Leather Tanning'), [inventory]);
  const pharmaChems = useMemo(() => inventory.filter(c => c.industry === 'Pharmaceuticals'), [inventory]);
  const cosmeticsChems = useMemo(() => inventory.filter(c => c.industry === 'Cosmetics'), [inventory]);
  const generalChems = useMemo(() => inventory.filter(c => c.industry === 'General Chemical'), [inventory]);

  return (
    <div className="space-y-6">
      
      {/* Industry Sector Selector Bar */}
      <div className="p-4 rounded-2xl bg-[#0b1324] border border-emerald-500/20 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>Industrial Safety Protocols & Process Stream Directives</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Industry-tailored chemical reactivity matrices, process hazards, and wastewater segregation mandates
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#070d1a] p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveIndustry('leather')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeIndustry === 'leather'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Leather Tanning</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 font-mono">
              {leatherChems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveIndustry('pharma')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeIndustry === 'pharma'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Pharmaceuticals</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 font-mono">
              {pharmaChems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveIndustry('cosmetics')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeIndustry === 'cosmetics'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Cosmetics & Personal Care</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 font-mono">
              {cosmeticsChems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveIndustry('general')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeIndustry === 'general'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>General Chemical</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 font-mono">
              {generalChems.length}
            </span>
          </button>
        </div>
      </div>

      {/* Module A: LEATHER TANNING */}
      {activeIndustry === 'leather' && (
        <div className="space-y-6">
          {/* Critical Hazard Callout: Sulfide + Acid */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border-2 border-red-500/80 shadow-2xl relative overflow-hidden">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-red-600/30 border border-red-500 text-red-400 flex items-center justify-center flex-shrink-0 animate-pulse">
                <Skull className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-600 text-white">
                    PRIMARY TANNERY FATALITY PRECURSOR
                  </span>
                  <span className="text-xs text-red-300 font-mono">OSHA / IULTCS Directive</span>
                </div>
                <h3 className="text-base font-black text-white">
                  Fatal Hydrogen Sulfide (H2S) Gas Release via Acidification of Sulfide Streams
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                  Accidental contact between liming/unhairing sulfides (Sodium Sulfide, NaHS) and pickling acids (Sulfuric Acid, Formic Acid) is the single most common cause of multiple fatalities in tanneries. Rapid acidification drops pH below 9.0, triggering instantaneous degassing of lethal H2S vapor with immediate olfactory knockdown.
                </p>
                <div className="p-3 rounded-xl bg-black/60 border border-red-500/30 text-xs text-red-200 font-mono mt-2 flex items-center space-x-3">
                  <span className="text-red-400 font-bold">REACTION:</span>
                  <span>Na2S(aq) + H2SO4(aq) ➔ Na2SO4(aq) + H2S(g) ↑ (Lethal at &gt;500 ppm in 1 breath)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Core Tannery Safety Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Pillar 1: Sulfide Liming Protocols */}
            <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  Liming & Unhairing
                </span>
                <span className="text-xs font-mono text-slate-400">Section 1</span>
              </div>
              <h4 className="text-sm font-bold text-white">Sulfide & Lime Alkaline Handling</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sodium sulfide and hydrated lime must remain in dedicated alkaline storage (pH &gt; 10). Storage bays must feature continuous electrochemical H2S sensors calibrated to 10 ppm alarm threshold interlocked to active ventilation.
              </p>
              <div className="text-[11px] text-emerald-400 font-semibold pt-2 border-t border-slate-800">
                Mandate: Minimum 6-meter physical separation from acid tanks.
              </div>
            </div>

            {/* Pillar 2: Chrome Tanning & Cr(VI) Prevention */}
            <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                  Chrome Tanning
                </span>
                <span className="text-xs font-mono text-slate-400">Section 2</span>
              </div>
              <h4 className="text-sm font-bold text-white">Basic Chromium Sulfate & Cr(VI) Control</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Trivalent chromium Cr(III) tanning powder must be isolated from strong oxidizers (hydrogen peroxide, hypochlorite bleach). Contact oxidizes Cr(III) into carcinogenic Hexavalent Chromium Cr(VI), which is banned under EU REACH Annex XVII.
              </p>
              <div className="text-[11px] text-purple-300 font-semibold pt-2 border-t border-slate-800">
                Effluent: Route spent bath to dedicated chrome recycling loop.
              </div>
            </div>

            {/* Pillar 3: Tannery ETP Wastewater Routing */}
            <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  ETP Wastewater
                </span>
                <span className="text-xs font-mono text-slate-400">Section 3</span>
              </div>
              <h4 className="text-sm font-bold text-white">Segregated Effluent Stream Treatment</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tannery effluent MUST be segregated into 3 distinct sewer pipes: (1) Sulfide stream to catalytic manganese oxidation tank, (2) Chrome tanning stream to alkali precipitation reactor, (3) General beamhouse effluent to biological treatment.
              </p>
              <div className="text-[11px] text-cyan-300 font-semibold pt-2 border-t border-slate-800">
                Rule: Never mix raw sulfide liquor into general ETP equalization pit.
              </div>
            </div>

          </div>

          {/* Current Tannery Chemicals in Inventory */}
          <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white">Registered Leather Tanning Chemicals in Facility</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {leatherChems.map(c => (
                <div 
                  key={c.id}
                  onClick={() => onSelectChemical && onSelectChemical(c)}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs truncate mr-1">{c.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400">{c.formula}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>CAS: {c.cas}</span>
                    <span className="text-amber-400">{c.quantity} {c.unit}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate">
                    Loc: {c.storageLocation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Module B: PHARMACEUTICALS */}
      {activeIndustry === 'pharma' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-xl space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                USP &lt;800&gt; &amp; ICH Q3C Guidelines
              </span>
              <h3 className="text-base font-bold text-white">
                Pharmaceutical Compounding, Cleanroom Controls &amp; Solvent Segregation
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Focuses on containment of hazardous drugs (antineoplastic cytotoxics), containment of Class 1 and Class 2 residual solvents (Dichloromethane, Chloroform), and reactive synthesis intermediates (acyl halides).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#0b1324] border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">Cytotoxic Antineoplastics</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Drugs like Cisplatin and Methotrexate require negative pressure containment (C-PEC) per USP &lt;800&gt;. Waste must be routed into rigid Yellow Cytotoxic bins for high-temp destruction (&gt;1100°C).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0b1324] border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Halogenated Solvent Control</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dichloromethane (DCM) and Chloroform must never enter standard organic solvent drums. Segregate into dedicated fluoropolymer drums to prevent incinerator hydrochloric acid corrosion and high processing surcharges.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0b1324] border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Green Synthesis Shifts</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Transition to ACS GCI preferred Class 3 solvents (Ethanol, Ethyl Acetate, 2-MeTHF) to reduce occupational exposure limits, volatile emissions, and persistence in groundwater.
              </p>
            </div>
          </div>

          {/* Current Pharma Chemicals in Inventory */}
          <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white">Registered Pharmaceutical Formulations in Facility</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pharmaChems.map(c => (
                <div 
                  key={c.id}
                  onClick={() => onSelectChemical && onSelectChemical(c)}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs truncate mr-1">{c.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400">{c.formula}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>CAS: {c.cas}</span>
                    <span className="text-purple-400">{c.pharmaRole}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate">
                    Loc: {c.storageLocation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Module C: COSMETICS */}
      {activeIndustry === 'cosmetics' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-xl space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Formulation vs Bulk Storage Distinction
              </span>
              <h3 className="text-base font-bold text-white">
                Cosmetics &amp; Personal Care Industrial Risk Management
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>CRITICAL SCIENTIFIC DISTINCTION:</strong> Formulation compatibility (micellar phase stability, emulsion HLB balance, pH buffering) must NOT be confused with industrial storage compatibility. Bulk warehouse barrels of hydrogen peroxide, fragrance terpenes, and active organic acids present catastrophic fire, deflagration, and corrosive rupture hazards if co-stored improperly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#0b1324] border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">35% Peroxide Bleaches</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hair oxidation agents (35% H2O2, persulfates) are aggressive Class 5.1 oxidizers. Must be isolated from fragrance volatile terpenes (limonene) and alcohols to prevent spontaneous combustion.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0b1324] border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">Fragrance Terpene Auto-Oxidation</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bulk citrus oils and d-limonene auto-oxidize upon exposure to air, forming unstable organic hydroperoxides that cause severe contact dermatitis and flammable vapor accumulation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0b1324] border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">AHA / BHA Organic Acids</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Concentrated 70% Glycolic acid and Salicylic acid require acid-resistant containment segregated from strong alkanolamines (Triethanolamine) used for pH adjustment during batch compounding.
              </p>
            </div>
          </div>

          {/* Current Cosmetics Chemicals in Inventory */}
          <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white">Registered Cosmetics Ingredients in Facility</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cosmeticsChems.map(c => (
                <div 
                  key={c.id}
                  onClick={() => onSelectChemical && onSelectChemical(c)}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs truncate mr-1">{c.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400">{c.formula}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>CAS: {c.cas}</span>
                    <span className="text-emerald-400">{c.pharmaRole}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate">
                    Loc: {c.storageLocation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Module D: GENERAL CHEMICAL */}
      {activeIndustry === 'general' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                NFPA 400 &amp; OSHA 1910.1200
              </span>
              <h3 className="text-base font-bold text-white">
                Universal Industrial Storage Class Segregation
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard chemical storage classes dictate strict secondary containment, minimum separation distances (minimum 6 meters or fire-rated partitioning), and dedicated emergency response actions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-blue-500/30 text-xs space-y-1">
              <span className="font-bold text-blue-400 block">Class 8A: Corrosive Acids</span>
              <p className="text-slate-300 text-[11px]">Store in dedicated acid cabinet with polyethylene bunding. Never store with bases, cyanides, or sulfides.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-red-500/30 text-xs space-y-1">
              <span className="font-bold text-red-400 block">Class 8B: Corrosive Alkalis</span>
              <p className="text-slate-300 text-[11px]">Separate from mineral acids. Secondary containment must hold at least 110% of largest container volume.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 text-xs space-y-1">
              <span className="font-bold text-amber-400 block">Class 3: Flammable Liquids</span>
              <p className="text-slate-300 text-[11px]">Store in certified flameproof cabinets with grounding clamps. Separate by &gt;6m from oxidizers.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-yellow-500/30 text-xs space-y-1">
              <span className="font-bold text-yellow-400 block">Class 5.1: Strong Oxidizers</span>
              <p className="text-slate-300 text-[11px]">Keep completely away from organics, paper, wood, solvents, and reducers. High fire intensity hazard.</p>
            </div>
          </div>

          {/* Current General Chemicals in Inventory */}
          <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white">General Chemical Inventory Records</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {generalChems.map(c => (
                <div 
                  key={c.id}
                  onClick={() => onSelectChemical && onSelectChemical(c)}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs truncate mr-1">{c.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400">{c.formula}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>CAS: {c.cas}</span>
                    <span className="text-blue-400">{c.storageClass}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate">
                    Loc: {c.storageLocation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
