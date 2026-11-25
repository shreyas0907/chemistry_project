import React, { useState } from 'react';
import { 
  Trash2, Layers, FlaskConical, Sparkles, AlertTriangle, 
  ShieldAlert, ShieldCheck, CheckCircle2, ChevronRight, 
  Info, ArrowRight, FileText, Check, AlertOctagon, ExternalLink
} from 'lucide-react';
import { INDUSTRY_WASTE_SECTORS } from '../data/industryWasteData';

export default function IndustryWasteModule() {
  const [selectedIndustryId, setSelectedIndustryId] = useState('leather');
  const [selectedCategoryId, setSelectedCategoryId] = useState('leather-chromium');

  const currentSector = INDUSTRY_WASTE_SECTORS.find(s => s.id === selectedIndustryId) || INDUSTRY_WASTE_SECTORS[0];
  const currentCategory = currentSector.categories.find(c => c.id === selectedCategoryId) || currentSector.categories[0];

  const handleSelectIndustry = (indId) => {
    setSelectedIndustryId(indId);
    const sector = INDUSTRY_WASTE_SECTORS.find(s => s.id === indId);
    if (sector && sector.categories.length > 0) {
      setSelectedCategoryId(sector.categories[0].id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Executive Description */}
      <div className="pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Trash2 className="w-6 h-6 text-teal-600" />
          <h1 className="text-2xl font-bold text-slate-900">Industry-Specific Waste Management</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Standardized segregation guidelines, hazard evaluations, and approved disposal pathways across three regulated processing sectors.
        </p>
      </div>

      {/* 2. THREE INDUSTRY SELECTION CARDS */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Select Industrial Sector (Exactly 3 Covered Industries):
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INDUSTRY_WASTE_SECTORS.map((sector) => {
            const isSelected = selectedIndustryId === sector.id;
            const Icon = sector.id === 'leather' ? Layers : sector.id === 'pharma' ? FlaskConical : Sparkles;

            return (
              <div
                key={sector.id}
                onClick={() => handleSelectIndustry(sector.id)}
                className={`rounded-xl border p-4 cursor-pointer transition-all duration-200 bg-white relative overflow-hidden group ${
                  isSelected 
                    ? 'border-teal-600 shadow-md ring-1 ring-teal-600' 
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-lg ${
                    isSelected ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {isSelected && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-600 text-white tracking-wider">
                      Active
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="font-bold text-slate-900 text-base">{sector.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {sector.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {sector.categories.length} Waste Categories
                  </span>
                  <span className={`font-semibold flex items-center gap-0.5 ${
                    isSelected ? 'text-teal-600' : 'text-slate-500'
                  }`}>
                    <span>Explore Waste</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. DEDICATED INDUSTRY WASTE MANAGEMENT WORKSPACE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        
        {/* Industry Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block">
              DEDICATED COMPLIANCE PROTOCOL
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              {currentSector.name} Waste Management
            </h2>
            <p className="text-xs text-slate-500">{currentSector.tagline}</p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-slate-600 font-mono self-start sm:self-auto">
            CPCB / EPA RCRA / REACH Aligned
          </span>
        </div>

        {/* Categories Strip */}
        <div>
          <span className="text-xs font-semibold text-slate-600 block mb-2">
            Select Chemical Waste Stream Category:
          </span>
          <div className="flex flex-wrap gap-2">
            {currentSector.categories.map((cat) => {
              const isActive = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.isHazardousPriority && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Waste Stream Detailed Guide */}
        <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-5 space-y-5">
          
          {/* Header & Hazard Level */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{currentCategory.title}</h3>
                {currentCategory.isHazardousPriority && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700 border border-red-200">
                    High Hazard Priority
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Ref: {currentCategory.regulatoryRef}
              </p>
            </div>
          </div>

          {/* Section 1: Examples & Main Hazards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Chemical Examples */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-600" />
                <span>Typical Waste Stream Examples:</span>
              </span>
              <ul className="space-y-1 text-xs text-slate-600">
                {currentCategory.examples.map((ex, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Hazards */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Main Chemical Hazards:</span>
              </span>
              <ul className="space-y-1 text-xs text-slate-700">
                {currentCategory.mainHazards.map((hz, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{hz}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Section 2: Why Special Handling & Segregation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Why Special Handling */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-600" />
                <span>Why Special Handling is Required:</span>
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentCategory.whySpecialHandling}
              </p>
            </div>

            {/* Segregation Considerations */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-teal-600" />
                <span>Required Segregation Considerations:</span>
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentCategory.segregationConsiderations}
              </p>
            </div>

          </div>

          {/* Section 3: Environmental & Safety Concerns */}
          <div className="bg-amber-50/60 p-4 rounded-lg border border-amber-200 space-y-1">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-amber-700" />
              <span>Environmental &amp; Human Safety Concerns:</span>
            </span>
            <p className="text-xs text-amber-800 leading-relaxed">
              {currentCategory.environmentalSafetyConcerns}
            </p>
          </div>

          {/* Section 4: 4-Stage Management Pathway */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Standard 4-Stage Waste Management Pathway:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Stage 1 */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Identification</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {currentCategory.pathway.identification}
                </p>
              </div>

              {/* Stage 2 */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Segregation</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {currentCategory.pathway.segregation}
                </p>
              </div>

              {/* Stage 3 */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Safe Storage</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {currentCategory.pathway.safeStorage}
                </p>
              </div>

              {/* Stage 4 */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">4</span>
                  <span>Approved Treatment</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {currentCategory.pathway.treatmentDisposal}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* 4. Mandatory Regulatory Disclaimer */}
        <div className="p-4 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-800">
            Mandatory Industrial Chemical Safety Restrictions:
          </p>
          <p className="text-[11px] leading-relaxed">
            The guidance displayed above is based on verified official industrial safety references (CPCB/MPCB Hazardous Wastes Rules 2016, EPA RCRA, and REACH regulations). Do not attempt ad-hoc chemical neutralization without certified laboratory verification. Hazardous waste streams must be transferred strictly to authorized Common Hazardous Waste Treatment, Storage, and Disposal Facilities (TSDF) using regulatory manifests.
          </p>
        </div>

      </div>

    </div>
  );
}
