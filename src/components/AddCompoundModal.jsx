import React, { useState } from 'react';
import { 
  X, Search, Sparkles, Loader2, AlertTriangle, ShieldCheck, 
  FlaskConical, Leaf, Trash2, Info, CheckCircle2, AlertOctagon, HelpCircle 
} from 'lucide-react';
import { fetchPubChemData, fetchOpenFdaData, fetchEpaCompToxData } from '../services/pharmaApi';
import cameoRules from '../data/cameoRules.json';

const STORAGE_CLASSES = [
  "8A (Corrosive Acidic)",
  "8B (Corrosive Basic)",
  "6.1A (Toxic / Carcinogen)",
  "3 (Flammable Liquid)",
  "4.1 (Flammable Solid)",
  "5.1 (Strong Oxidizer)",
  "11 (General Chemical Storage)",
  "Custom Pharma Class"
];

const STORAGE_CONDITIONS = [
  "Room Temp (20°C–25°C)",
  "2°C–8°C Cold Chain",
  "-20°C Frozen",
  "-80°C Ultra-Cold",
  "Protect from Light",
  "Desiccated / Dry Inert Gas"
];

const WASTE_STREAMS = [
  "High-Temp Incineration",
  "Chemical Neutralization",
  "Autoclave",
  "Effluent Treatment Plant [ETP]",
  "Cytotoxic Yellow Bin",
  "Halogenated Solvent Waste Drum",
  "Non-Halogenated Organic Solvent Waste"
];

export default function AddCompoundModal({ isOpen, onClose, onSave }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [apiSourceInfo, setApiSourceInfo] = useState(null);
  const [searchError, setSearchError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    formula: '',
    molecularWeight: '',
    cas: '',
    smiles: '',
    cid: null,
    structureUrl: '',
    physicalState: 'Liquid',
    pharmaRole: 'API',
    cameoGroups: ['water_aqueous'],
    uspClassification: 'Non-Hazardous',
    storageClass: '11 (General Chemical Storage)',
    storageConditions: 'Room Temp (20°C–25°C)',
    pbtScore: {
      persistence: 'Low',
      bioaccumulation: 'Low',
      toxicity: 'Low'
    },
    greenChemistryRating: 'Green',
    wasteStream: 'Non-Halogenated Organic Solvent Waste',
    ghsPictograms: ['Irritant'],
    hazardSummary: '',
    fdaNotes: ''
  });

  if (!isOpen) return null;

  const handleAutoFill = async () => {
    if (!searchQuery.trim()) {
      setSearchError('Please enter a compound or drug name to search.');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setApiSourceInfo(null);

    try {
      // 1. PubChem Search
      const pubChemData = await fetchPubChemData(searchQuery);

      // 2. openFDA Search
      const fdaData = await fetchOpenFdaData(searchQuery);

      // 3. EPA CompTox Search / Estimator
      const epaData = await fetchEpaCompToxData(pubChemData.cas || '', searchQuery);

      // Consolidate FDA notes
      let consolidatedFdaNotes = '';
      if (fdaData?.boxedWarning) {
        consolidatedFdaNotes += `[FDA BOXED WARNING]: ${fdaData.boxedWarning} `;
      }
      if (fdaData?.storageHandling) {
        consolidatedFdaNotes += `[Storage & Handling]: ${fdaData.storageHandling} `;
      }
      if (!consolidatedFdaNotes && pubChemData.fdaNotes) {
        consolidatedFdaNotes = pubChemData.fdaNotes;
      }

      // Determine initial waste stream based on rules
      let suggestedWasteStream = 'Non-Halogenated Organic Solvent Waste';
      if (pubChemData.cameoGroups?.includes('cytotoxics') || pubChemData.uspClassification?.includes('Antineoplastic')) {
        suggestedWasteStream = 'Cytotoxic Yellow Bin';
      } else if (pubChemData.cameoGroups?.includes('acyl_halides')) {
        suggestedWasteStream = 'High-Temp Incineration';
      } else if (pubChemData.cameoGroups?.includes('halogenated_organic')) {
        suggestedWasteStream = 'Halogenated Solvent Waste Drum';
      } else if (pubChemData.cameoGroups?.includes('caustics_bases') || pubChemData.cameoGroups?.includes('acids_inorganic')) {
        suggestedWasteStream = 'Chemical Neutralization';
      }

      setFormData(prev => ({
        ...prev,
        name: pubChemData.name || searchQuery,
        formula: pubChemData.formula || prev.formula,
        molecularWeight: pubChemData.molecularWeight || prev.molecularWeight,
        cas: pubChemData.cas || prev.cas,
        smiles: pubChemData.smiles || prev.smiles,
        cid: pubChemData.cid || prev.cid,
        structureUrl: pubChemData.structureUrl || `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(searchQuery)}/PNG`,
        physicalState: pubChemData.physicalState || prev.physicalState,
        pharmaRole: pubChemData.pharmaRole || prev.pharmaRole,
        cameoGroups: pubChemData.cameoGroups || prev.cameoGroups,
        uspClassification: pubChemData.uspClassification || prev.uspClassification,
        storageClass: pubChemData.storageClass || prev.storageClass,
        storageConditions: pubChemData.storageConditions || prev.storageConditions,
        pbtScore: pubChemData.pbtScore || epaData?.pbtScore || prev.pbtScore,
        greenChemistryRating: pubChemData.greenChemistryRating || prev.greenChemistryRating,
        wasteStream: pubChemData.wasteStream || suggestedWasteStream,
        hazardSummary: pubChemData.hazardSummary || prev.hazardSummary,
        fdaNotes: consolidatedFdaNotes || 'No restrictive FDA boxed warnings identified. Consult institution compounding SOP.'
      }));

      setApiSourceInfo({
        pubChem: pubChemData.source,
        fda: fdaData ? (fdaData.source || 'Found Label Record') : 'No openFDA Monograph Found',
        epa: epaData.source
      });
    } catch (err) {
      setSearchError('Error querying public APIs: ' + err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleCameoGroup = (groupId) => {
    setFormData(prev => {
      const exists = prev.cameoGroups.includes(groupId);
      const updated = exists 
        ? prev.cameoGroups.filter(g => g !== groupId)
        : [...prev.cameoGroups, groupId];
      return { ...prev, cameoGroups: updated };
    });
  };

  const handlePbtChange = (dimension, value) => {
    setFormData(prev => {
      const newScore = { ...prev.pbtScore, [dimension]: value };
      
      // Auto-compute Green Rating based on PBT
      let rating = 'Green';
      const highCount = Object.values(newScore).filter(v => v === 'High').length;
      const modCount = Object.values(newScore).filter(v => v === 'Moderate').length;

      if (highCount >= 1 || modCount >= 2) {
        rating = 'Red';
      } else if (modCount === 1) {
        rating = 'Yellow';
      }

      return {
        ...prev,
        pbtScore: newScore,
        greenChemistryRating: rating
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Compound Name is required.');
      return;
    }

    const newCompound = {
      ...formData,
      id: 'comp-' + Date.now(),
      molecularWeight: parseFloat(formData.molecularWeight) || 0
    };

    onSave(newCompound);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-forest-950 border border-emerald-500/20 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/15 bg-forest-900/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-botanical-emerald/10 border border-botanical-emerald/30 flex items-center justify-center text-botanical-emerald">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">Register New Pharmaceutical Compound</h2>
              <p className="text-xs text-slate-400">Powered by PubChem PUG REST, openFDA, & NOAA CAMEO Reactivity Engine</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-forest-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Top Search Auto-Fill Bento Bar */}
          <div className="bento-card p-4 border-emerald-500/30">
            <label className="block text-xs font-bold text-botanical-lime uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-botanical-emerald" />
              <span>Live Chemical API Auto-Fill (PubChem & openFDA)</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Type compound or drug name (e.g. Sebacoyl chloride, Cisplatin, Dichloromethane)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAutoFill())}
                  className="w-full bg-forest-950 border border-emerald-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-botanical-emerald transition"
                />
              </div>
              <button
                type="button"
                onClick={handleAutoFill}
                disabled={isSearching}
                className="px-5 py-2.5 bg-gradient-to-r from-botanical-emerald to-botanical-lime hover:opacity-95 text-forest-950 text-xs font-black rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-botanical-emerald/20 disabled:opacity-60"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Querying Live APIs...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Auto-Fill from PubChem & openFDA</span>
                  </>
                )}
              </button>
            </div>

            {searchError && (
              <div className="mt-2.5 p-2.5 bg-botanical-coral/15 border border-botanical-coral/30 rounded-lg text-xs text-botanical-coral flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            {apiSourceInfo && (
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-botanical-emerald/15 border border-botanical-emerald/30 text-botanical-lime flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-botanical-emerald" />
                  <span>PubChem: {apiSourceInfo.pubChem}</span>
                </span>
                <span className="px-2.5 py-1 rounded-md bg-botanical-teal/15 border border-botanical-teal/30 text-botanical-teal flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-botanical-teal" />
                  <span>FDA: {apiSourceInfo.fda}</span>
                </span>
                <span className="px-2.5 py-1 rounded-md bg-botanical-amber/15 border border-botanical-amber/30 text-botanical-amber flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-botanical-amber" />
                  <span>EPA: {apiSourceInfo.epa}</span>
                </span>
              </div>
            )}
          </div>

          <form id="compoundForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Bento Block 1: Identity & Glowing 2D Structure */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Structure Preview Card */}
              <div className="bento-card p-4 flex flex-col items-center justify-center text-center">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  2D Molecular Structure
                </label>
                <div className="w-40 h-40 rounded-xl bg-forest-950 p-2.5 border border-emerald-500/20 flex items-center justify-center overflow-hidden shadow-inner relative">
                  {formData.structureUrl ? (
                    <img 
                      src={formData.structureUrl} 
                      alt="2D Structure" 
                      className="max-h-full max-w-full object-contain mol-structure-glow"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2310b981" stroke-width="1.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/></svg>';
                      }}
                    />
                  ) : (
                    <div className="text-xs text-slate-400 flex flex-col items-center">
                      <FlaskConical className="w-8 h-8 text-forest-600 mb-1" />
                      <span>Search compound to load structure</span>
                    </div>
                  )}
                </div>
                {formData.cid && (
                  <span className="mt-2 text-xs text-slate-400 font-mono">
                    PubChem CID: <span className="text-botanical-lime font-bold">{formData.cid}</span>
                  </span>
                )}
              </div>

              {/* Form Fields Column */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Compound / Drug Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-forest-950 border border-emerald-500/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-botanical-emerald"
                    placeholder="e.g. Sebacoyl Chloride"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Chemical Formula</label>
                  <input
                    type="text"
                    value={formData.formula}
                    onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                    className="w-full bg-forest-950 border border-emerald-500/20 rounded-xl px-3 py-2 text-sm font-mono text-botanical-lime focus:outline-none focus:border-botanical-emerald"
                    placeholder="e.g. C10H16Cl2O2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Molecular Weight (g/mol)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.molecularWeight}
                    onChange={(e) => setFormData({ ...formData, molecularWeight: e.target.value })}
                    className="w-full bg-forest-950 border border-emerald-500/20 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-botanical-emerald"
                    placeholder="e.g. 239.14"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">CAS Registry Number</label>
                  <input
                    type="text"
                    value={formData.cas}
                    onChange={(e) => setFormData({ ...formData, cas: e.target.value })}
                    className="w-full bg-forest-950 border border-emerald-500/20 rounded-xl px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-botanical-emerald"
                    placeholder="e.g. 111-19-3"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Physical State</label>
                  <select
                    value={formData.physicalState}
                    onChange={(e) => setFormData({ ...formData, physicalState: e.target.value })}
                    className="w-full bg-forest-950 border border-emerald-500/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-botanical-emerald"
                  >
                    <option value="Liquid">Liquid</option>
                    <option value="Solid">Solid</option>
                    <option value="Gas">Gas</option>
                    <option value="Powder">Powder / Lyophilized</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Pharma Operational Role</label>
                  <select
                    value={formData.pharmaRole}
                    onChange={(e) => setFormData({ ...formData, pharmaRole: e.target.value })}
                    className="w-full bg-forest-950 border border-emerald-500/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-botanical-emerald"
                  >
                    <option value="API">API (Active Pharmaceutical Ingredient)</option>
                    <option value="Excipient">Excipient / Stabilizer</option>
                    <option value="Solvent">Solvent / Mobile Phase</option>
                    <option value="Reagent">Synthetic Reagent / Cross-linker</option>
                    <option value="Disinfectant">Disinfectant / Sterilant</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Canonical SMILES Notation</label>
                  <input
                    type="text"
                    value={formData.smiles}
                    onChange={(e) => setFormData({ ...formData, smiles: e.target.value })}
                    className="w-full bg-forest-950 border border-emerald-500/20 rounded-xl px-3 py-2 text-xs font-mono text-botanical-sage focus:outline-none focus:border-botanical-emerald"
                    placeholder="e.g. C(CCCC(=O)Cl)CCCC(=O)Cl"
                  />
                </div>

              </div>
            </div>

            {/* Bento Block 2: NOAA CAMEO Reactivity Groups Checklist */}
            <div className="bento-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-botanical-amber" />
                    <span>NOAA CAMEO Reactivity Matrix Groups</span>
                  </h3>
                  <p className="text-xs text-slate-400">Select reactive groups to evaluate local pairwise cross-compatibility</p>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest-900 border border-emerald-500/20 text-botanical-lime font-mono font-bold">
                  {formData.cameoGroups.length} Selected
                </span>
              </div>

              {/* CAMEO Groups Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {cameoRules.groups.map(grp => {
                  const isChecked = formData.cameoGroups.includes(grp.id);
                  return (
                    <button
                      type="button"
                      key={grp.id}
                      onClick={() => toggleCameoGroup(grp.id)}
                      className={`px-3 py-2 rounded-xl text-left text-xs font-medium transition border flex flex-col justify-between ${
                        isChecked 
                          ? 'bg-botanical-amber/15 border-botanical-amber/40 text-botanical-amber' 
                          : 'bg-forest-900/60 border-emerald-500/10 text-slate-400 hover:border-emerald-500/30 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-semibold truncate mr-1">{grp.name}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-botanical-amber flex-shrink-0" />}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">CAMEO #{grp.cameoId}</span>
                    </button>
                  );
                })}
              </div>

              {/* Hazardous Drug & Storage Codes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-emerald-500/10">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    USP &lt;800&gt; / NIOSH Classification
                  </label>
                  <select
                    value={formData.uspClassification}
                    onChange={(e) => setFormData({ ...formData, uspClassification: e.target.value })}
                    className="w-full bg-forest-950 border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-botanical-emerald"
                  >
                    <option value="Non-Hazardous">Non-Hazardous</option>
                    <option value="Antineoplastic Hazardous">Antineoplastic Hazardous (Table 1)</option>
                    <option value="Non-Antineoplastic Hazardous">Non-Antineoplastic Hazardous (Table 2)</option>
                    <option value="Reproductive Risk">Reproductive Risk (Table 3)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Storage Class Code
                  </label>
                  <select
                    value={formData.storageClass}
                    onChange={(e) => setFormData({ ...formData, storageClass: e.target.value })}
                    className="w-full bg-forest-950 border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-botanical-emerald"
                  >
                    {STORAGE_CLASSES.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Storage Climate Conditions
                  </label>
                  <select
                    value={formData.storageConditions}
                    onChange={(e) => setFormData({ ...formData, storageConditions: e.target.value })}
                    className="w-full bg-forest-950 border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-botanical-emerald"
                  >
                    {STORAGE_CONDITIONS.map(cond => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Bento Block 3: Environmental Eco-Toxicity (PBT Index) */}
            <div className="bento-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Leaf className="w-4 h-4 text-botanical-emerald" />
                    <span>PBT Eco-Toxicity Spectrum & Green Chemistry Rating</span>
                  </h3>
                  <p className="text-xs text-slate-400">Persistence, Bioaccumulation, and Aquatic Toxicity environmental footprint</p>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  formData.greenChemistryRating === 'Green' ? 'bg-botanical-emerald/15 border-botanical-emerald/30 text-botanical-lime' :
                  formData.greenChemistryRating === 'Yellow' ? 'bg-botanical-amber/15 border-botanical-amber/30 text-botanical-amber' :
                  'bg-botanical-coral/15 border-botanical-coral/30 text-botanical-coral'
                }`}>
                  {formData.greenChemistryRating} Chemistry
                </span>
              </div>

              {/* PBT Segmented Pill Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Persistence */}
                <div className="p-3.5 rounded-xl bg-forest-900/70 border border-emerald-500/15">
                  <span className="block text-xs font-bold text-slate-300 mb-2">Persistence (P)</span>
                  <div className="grid grid-cols-3 gap-1">
                    {['Low', 'Moderate', 'High'].map(level => (
                      <button
                        type="button"
                        key={level}
                        onClick={() => handlePbtChange('persistence', level)}
                        className={`py-1 text-xs rounded-lg font-bold transition ${
                          formData.pbtScore.persistence === level
                            ? level === 'High' ? 'bg-botanical-coral text-white shadow-md' : level === 'Moderate' ? 'bg-botanical-amber text-black shadow-md' : 'bg-botanical-lime text-black shadow-md'
                            : 'bg-forest-950 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bioaccumulation */}
                <div className="p-3.5 rounded-xl bg-forest-900/70 border border-emerald-500/15">
                  <span className="block text-xs font-bold text-slate-300 mb-2">Bioaccumulation (B)</span>
                  <div className="grid grid-cols-3 gap-1">
                    {['Low', 'Moderate', 'High'].map(level => (
                      <button
                        type="button"
                        key={level}
                        onClick={() => handlePbtChange('bioaccumulation', level)}
                        className={`py-1 text-xs rounded-lg font-bold transition ${
                          formData.pbtScore.bioaccumulation === level
                            ? level === 'High' ? 'bg-botanical-coral text-white shadow-md' : level === 'Moderate' ? 'bg-botanical-amber text-black shadow-md' : 'bg-botanical-lime text-black shadow-md'
                            : 'bg-forest-950 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aquatic Toxicity */}
                <div className="p-3.5 rounded-xl bg-forest-900/70 border border-emerald-500/15">
                  <span className="block text-xs font-bold text-slate-300 mb-2">Aquatic Toxicity (T)</span>
                  <div className="grid grid-cols-3 gap-1">
                    {['Low', 'Moderate', 'High'].map(level => (
                      <button
                        type="button"
                        key={level}
                        onClick={() => handlePbtChange('toxicity', level)}
                        className={`py-1 text-xs rounded-lg font-bold transition ${
                          formData.pbtScore.toxicity === level
                            ? level === 'High' ? 'bg-botanical-coral text-white shadow-md' : level === 'Moderate' ? 'bg-botanical-amber text-black shadow-md' : 'bg-botanical-lime text-black shadow-md'
                            : 'bg-forest-950 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Bento Block 4: Disposal Waste Stream & Notes */}
            <div className="bento-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Trash2 className="w-4 h-4 text-botanical-teal" />
                <span>Pharmaceutical Waste Stream Routing & Safety Monograph</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Designated Waste Stream Category
                  </label>
                  <select
                    value={formData.wasteStream}
                    onChange={(e) => setFormData({ ...formData, wasteStream: e.target.value })}
                    className="w-full bg-forest-950 border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-botanical-teal focus:outline-none focus:border-botanical-teal"
                  >
                    {WASTE_STREAMS.map(ws => (
                      <option key={ws} value={ws}>{ws}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Override Green Chemistry Rating
                  </label>
                  <select
                    value={formData.greenChemistryRating}
                    onChange={(e) => setFormData({ ...formData, greenChemistryRating: e.target.value })}
                    className="w-full bg-forest-950 border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-botanical-emerald"
                  >
                    <option value="Green">Green / Preferred</option>
                    <option value="Yellow">Yellow / Caution</option>
                    <option value="Red">Red / Hazardous</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    GHS Hazard & Reactivity Summary Notes
                  </label>
                  <textarea
                    rows="2"
                    value={formData.hazardSummary}
                    onChange={(e) => setFormData({ ...formData, hazardSummary: e.target.value })}
                    className="w-full bg-forest-950 border border-emerald-500/20 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-botanical-emerald"
                    placeholder="Describe specific hazards, vapor pressures, or neutralizing behaviors..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    openFDA Clinical / Boxed Warning & Compounding SOP Notes
                  </label>
                  <textarea
                    rows="2"
                    value={formData.fdaNotes}
                    onChange={(e) => setFormData({ ...formData, fdaNotes: e.target.value })}
                    className="w-full bg-forest-950 border border-emerald-500/20 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none focus:border-botanical-emerald"
                    placeholder="FDA boxed warnings, handling precautions, compounding cleanroom controls..."
                  />
                </div>
              </div>
            </div>

          </form>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-emerald-500/15 bg-forest-900/80 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-forest-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="compoundForm"
            className="px-6 py-2.5 bg-gradient-to-r from-botanical-emerald via-botanical-lime to-botanical-teal text-forest-950 text-xs font-black rounded-xl shadow-lg shadow-botanical-emerald/20 transition hover:scale-105"
          >
            Save to Active Inventory
          </button>
        </div>

      </div>
    </div>
  );
}
