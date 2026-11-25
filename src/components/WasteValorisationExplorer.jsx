import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Beaker,
  CheckCircle2,
  Database,
  FlaskConical,
  Leaf,
  Recycle,
  Search,
  ShieldAlert
} from 'lucide-react';
import { SAMPLE_PRESETS, WASTE_INDUSTRIES, WASTE_STREAMS } from '../data/wasteValorisationDB.js';
import { analyzeWasteStream } from '../services/wasteValorisationRules.js';

const fieldClass = 'w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500';

function InfoCard({ title, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-100">
        <Icon className="h-4 w-4 text-emerald-400" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-2 text-xs leading-relaxed text-slate-300">
      {items.map((item, index) => <li key={`${index}-${item}`} className="flex gap-2"><span className="text-emerald-400">•</span><span>{item}</span></li>)}
    </ul>
  );
}

export default function WasteValorisationExplorer() {
  const [industryId, setIndustryId] = useState('leather');
  const [wasteId, setWasteId] = useState('leather-chromium-waste');
  const [quantity, setQuantity] = useState('250 kg / batch');
  const [contaminants, setContaminants] = useState('Cr(III), residual sulfide, tanning dyes');
  const [search, setSearch] = useState('');

  const industryStreams = useMemo(
    () => WASTE_STREAMS.filter((stream) => stream.industryId === industryId),
    [industryId]
  );
  const selectedStream = WASTE_STREAMS.find((stream) => stream.id === wasteId) || industryStreams[0];
  const assessment = useMemo(
    () => analyzeWasteStream(selectedStream.id, contaminants),
    [selectedStream, contaminants]
  );
  const selectedIndustry = WASTE_INDUSTRIES.find((industry) => industry.id === industryId);

  const changeIndustry = (nextIndustryId) => {
    const firstStream = WASTE_STREAMS.find((stream) => stream.industryId === nextIndustryId);
    setIndustryId(nextIndustryId);
    setWasteId(firstStream.id);
    setContaminants('');
    setSearch('');
  };

  const applyPreset = (preset) => {
    setIndustryId(preset.industryId);
    setWasteId(preset.wasteId);
    setQuantity(preset.quantity);
    setContaminants(preset.contaminants);
    setSearch('');
  };

  const chooseWaste = (nextWasteId) => {
    setWasteId(nextWasteId);
    setContaminants('');
  };

  const visibleStreams = industryStreams.filter((stream) => {
    const query = search.trim().toLowerCase();
    return !query || `${stream.categoryName} ${stream.aliases.join(' ')}`.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-[#081610] via-[#0b1c16] to-[#10251d] p-5 shadow-xl sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              <Recycle className="h-7 w-7 text-emerald-400" />
              Industrial Waste Reuse Guide
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
              Explore evidence-informed recovery routes, cross-industry applications and batch-specific safety guardrails. Presets load local examples; results do not depend on network or AI services.
            </p>
            <p className="mt-2 font-mono text-xs text-slate-400">3 industries · {WASTE_STREAMS.length} waste streams</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-2 rounded-xl border border-emerald-800/70 bg-emerald-950/50 px-3 py-2 text-xs text-emerald-200">
              <Database className="h-4 w-4 text-emerald-400" />
              Local knowledge base
            </span>
            <span className="rounded-xl border border-slate-700/80 bg-slate-950/50 px-3 py-2 text-xs text-slate-300">
              Offline · deterministic
            </span>
          </div>
        </div>
      </header>

      <section className="bento-card space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <label className="min-w-48 flex-1 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Industry</span>
            <select className={fieldClass} value={industryId} onChange={(event) => changeIndustry(event.target.value)}>
              {WASTE_INDUSTRIES.map((industry) => <option key={industry.id} value={industry.id}>{industry.name}</option>)}
            </select>
          </label>
          <label className="min-w-64 flex-[2] space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Waste stream</span>
            <select className={fieldClass} value={selectedStream.id} onChange={(event) => chooseWaste(event.target.value)}>
              {visibleStreams.map((stream) => <option key={stream.id} value={stream.id}>{stream.categoryName}</option>)}
            </select>
          </label>
          <label className="min-w-36 flex-1 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Batch quantity</span>
            <input className={fieldClass} value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="e.g. 250 kg / batch" />
          </label>
        </div>

        <label className="relative block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            className={`${fieldClass} pl-9`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${industryStreams.length} ${selectedIndustry.name.toLowerCase()} streams or aliases`}
          />
        </label>
        {visibleStreams.length === 0 && (
          <p role="status" className="text-xs text-amber-300">No stream matches that search. Clear the search to choose from this industry.</p>
        )}

        <div className="border-t border-slate-800 pt-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
            <Beaker className="h-4 w-4 text-cyan-400" />
            One-click sample presets
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PRESETS.map((preset) => (
              <button
                type="button"
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`rounded-lg border px-3 py-2 text-left text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  preset.wasteId === wasteId
                    ? 'border-emerald-500/60 bg-emerald-950/60 text-emerald-200'
                    : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-emerald-700 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <InfoCard title="Waste profile" icon={FlaskConical}>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-cyan-800/60 bg-cyan-950/50 px-2 py-1 text-[10px] font-bold uppercase text-cyan-300">{selectedIndustry.name}</span>
              <span className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 font-mono text-[10px] text-slate-400">{selectedStream.wasteProfile.typicalPhysicalState}</span>
              <span className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 font-mono text-[10px] text-slate-400">{selectedStream.id}</span>
            </div>
            <h2 className="mb-2 text-lg font-bold text-white">{selectedStream.categoryName}</h2>
            <p className="text-xs leading-relaxed text-slate-300">{selectedStream.wasteProfile.chemicalComposition}</p>
            <p className="mt-3 text-xs leading-relaxed text-amber-200/90"><span className="font-bold">Environmental concern: </span>{selectedStream.wasteProfile.environmentalConcerns}</p>
            <p className="mt-3 border-t border-slate-800 pt-3 text-[11px] text-slate-500"><span className="font-bold text-slate-400">Also known as: </span>{selectedStream.aliases.join(' · ')}</p>
          </InfoCard>

          <InfoCard title={selectedStream.recoveryMethod.methodName} icon={Recycle}>
            <p className="text-xs leading-relaxed text-slate-300">{selectedStream.recoveryMethod.scientificExplanation}</p>
            <p className="mt-3 rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-xs leading-relaxed text-slate-400">
              <span className="font-bold text-slate-300">Processing considerations: </span>{selectedStream.recoveryMethod.processingConsiderations}
            </p>
          </InfoCard>

          <InfoCard title="Cross-industry reuse pathways" icon={Leaf}>
            <div className="space-y-3">
              {selectedStream.crossIndustryReuse.map((pathway) => (
                <article key={pathway.recoveredMaterial} className="border-t border-slate-800 pt-3 first:border-t-0 first:pt-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-emerald-200">{pathway.recoveredMaterial}</h4>
                    <span className="rounded bg-slate-950 px-2 py-1 text-[9px] font-mono text-slate-400">{pathway.maturityLevel}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">{pathway.applications}</p>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{pathway.suitabilityRationale}</p>
                  <p className="mt-2 text-[10px] font-mono text-cyan-300">Target: {pathway.targetIndustries.join(' · ')}</p>
                </article>
              ))}
            </div>
          </InfoCard>
        </div>

        <div className="space-y-5">
          <InfoCard title="Batch safety assessment" icon={ShieldAlert}>
            <label className="block space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Known contaminants (rule-based checks)</span>
              <textarea
                className={`${fieldClass} min-h-24 resize-y`}
                value={contaminants}
                onChange={(event) => setContaminants(event.target.value)}
                placeholder="Record known contaminants; blank does not mean uncontaminated."
              />
            </label>
            <p className="mt-2 text-[10px] leading-relaxed text-slate-500">{assessment.contaminantNote}</p>
            <div className="mt-4 space-y-2">
              {assessment.warnings.length > 0 ? assessment.warnings.map((warning) => (
                <div key={warning.title} role="alert" className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-200"><AlertTriangle className="h-4 w-4" />{warning.title}</div>
                  <p className="mt-1.5 text-xs leading-relaxed text-rose-100/80">{warning.message}</p>
                </div>
              )) : (
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-200"><AlertTriangle className="h-4 w-4" />Verify before recovery</div>
                  <p className="mt-1.5 text-xs leading-relaxed text-amber-100/80">No special rule was triggered by the entered contaminants. This is not a clearance or substitute for representative sampling, regulatory classification or process-specific review.</p>
                </div>
              )}
            </div>
            <div className="mt-4 border-t border-slate-800 pt-4">
              <h4 className="mb-2 text-xs font-bold text-slate-200">Hard safety restrictions</h4>
              <p className="text-xs leading-relaxed text-rose-100/80">{selectedStream.safetyAndFeasibility.hardSafetyRestrictions}</p>
            </div>
          </InfoCard>

          <InfoCard title="Feasibility and analytical release checks" icon={CheckCircle2}>
            <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2">
              <span className="text-xs font-bold text-slate-300">Feasibility rating</span>
              <span className={`rounded-md px-2.5 py-1 text-xs font-black ${
                selectedStream.safetyAndFeasibility.feasibilityRating === 'High'
                  ? 'bg-emerald-950 text-emerald-300'
                  : selectedStream.safetyAndFeasibility.feasibilityRating === 'Medium'
                    ? 'bg-amber-950 text-amber-300'
                    : 'bg-rose-950 text-rose-300'
              }`}>{selectedStream.safetyAndFeasibility.feasibilityRating}</span>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-slate-400">{selectedStream.safetyAndFeasibility.feasibilityRationale}</p>
            <BulletList items={[
              `Required checks: ${selectedStream.safetyAndFeasibility.requiredQualityChecks}`,
              `Contamination risks: ${selectedStream.safetyAndFeasibility.contaminationRisks}`,
              `Regulatory: ${selectedStream.safetyAndFeasibility.regulatoryConsiderations}`
            ]} />
          </InfoCard>

          <InfoCard title="Potential sustainability impact" icon={Leaf}>
            <div className="space-y-3 text-xs leading-relaxed">
              <p className="text-slate-300"><span className="font-bold text-emerald-300">Waste reduction: </span>{selectedStream.sustainabilityImpact.wasteReductionPotential}</p>
              <p className="text-slate-300"><span className="font-bold text-cyan-300">Resource conservation: </span>{selectedStream.sustainabilityImpact.resourceConservation}</p>
              <p className="text-slate-300"><span className="font-bold text-lime-300">Environmental advantage: </span>{selectedStream.sustainabilityImpact.environmentalAdvantages}</p>
            </div>
          </InfoCard>
        </div>
      </section>

      <p className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-[10px] leading-relaxed text-slate-500">
        Quantity entered: <span className="text-slate-400">{quantity || 'not specified'}</span>. This knowledge base is a screening aid, not a waste classification, engineering design, permit determination or authorization to reuse. Verify current local regulations and obtain representative laboratory data before handling or recovery.
      </p>
    </div>
  );
}
