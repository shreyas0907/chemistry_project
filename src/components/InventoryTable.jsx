import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Plus, Trash2, Eye, ShieldCheck, 
  AlertTriangle, Leaf, ExternalLink, RefreshCw, FlaskConical, 
  Sparkles, Layers 
} from 'lucide-react';
import PbtPillBar from './PbtPillBar';
import cameoRules from '../data/cameoRules.json';

export default function InventoryTable({ 
  inventory = [], 
  onOpenAddModal, 
  onSelectCompound, 
  onDeleteCompound,
  onResetDefaults,
  onNavigateToCompatibility
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterGreen, setFilterGreen] = useState('ALL');
  const [filterUspOnly, setFilterUspOnly] = useState(false);

  // Group names dictionary for easy label lookup
  const groupNameMap = useMemo(() => {
    const map = {};
    cameoRules.groups.forEach(g => {
      map[g.id] = g.name.split(' ')[0]; // short name
    });
    return map;
  }, []);

  // Filtered Inventory
  const filteredList = useMemo(() => {
    return inventory.filter(comp => {
      // Search text
      const term = searchTerm.toLowerCase();
      const matchSearch = 
        comp.name.toLowerCase().includes(term) ||
        comp.formula.toLowerCase().includes(term) ||
        (comp.cas && comp.cas.toLowerCase().includes(term)) ||
        comp.pharmaRole.toLowerCase().includes(term) ||
        (comp.wasteStream && comp.wasteStream.toLowerCase().includes(term));

      if (!matchSearch) return false;

      // Filter Role
      if (filterRole !== 'ALL' && comp.pharmaRole !== filterRole) return false;

      // Filter Green
      if (filterGreen !== 'ALL' && comp.greenChemistryRating !== filterGreen) return false;

      // Filter USP <800>
      if (filterUspOnly && (!comp.uspClassification || comp.uspClassification === 'Non-Hazardous')) return false;

      return true;
    });
  }, [inventory, searchTerm, filterRole, filterGreen, filterUspOnly]);

  return (
    <div className="space-y-4">
      
      {/* Search & Filter Toolbar Bento Card */}
      <div className="bento-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, formula, CAS, or waste stream..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-forest-950/80 border border-emerald-500/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-botanical-emerald transition"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-forest-950/80 border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-botanical-emerald"
          >
            <option value="ALL">All Pharma Roles</option>
            <option value="API">API</option>
            <option value="Solvent">Solvent</option>
            <option value="Reagent">Reagent</option>
            <option value="Excipient">Excipient</option>
            <option value="Disinfectant">Disinfectant</option>
          </select>

          <select
            value={filterGreen}
            onChange={(e) => setFilterGreen(e.target.value)}
            className="bg-forest-950/80 border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-botanical-emerald"
          >
            <option value="ALL">All Green Scores</option>
            <option value="Green">Green / Preferred</option>
            <option value="Yellow">Yellow / Caution</option>
            <option value="Red">Red / Hazardous</option>
          </select>

          <button
            onClick={() => setFilterUspOnly(!filterUspOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              filterUspOnly
                ? 'bg-botanical-coral/15 border-botanical-coral/40 text-botanical-coral'
                : 'bg-forest-950/80 border-emerald-500/20 text-slate-400 hover:text-white'
            }`}
          >
            USP &lt;800&gt; Only
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-gradient-to-r from-botanical-emerald to-botanical-lime hover:from-botanical-lime hover:to-botanical-teal text-forest-950 text-xs font-extrabold rounded-xl flex items-center space-x-1.5 shadow-lg shadow-botanical-emerald/20 transition hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Custom Compound</span>
          </button>

        </div>
      </div>

      {/* Inventory Bento Table */}
      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-emerald-500/10 bg-forest-900/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Compound & Structure</th>
                <th className="py-3.5 px-3">Role / State</th>
                <th className="py-3.5 px-3">NOAA CAMEO Groups</th>
                <th className="py-3.5 px-3">USP &lt;800&gt; Class</th>
                <th className="py-3.5 px-3">PBT Eco-Toxicity</th>
                <th className="py-3.5 px-3">Waste Routing</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <FlaskConical className="w-8 h-8 text-forest-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-300">No matching compounds found</p>
                    <p className="text-[11px] text-slate-500 mt-1">Try resetting your search query or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredList.map((comp) => {
                  const isCytotoxic = comp.uspClassification?.includes('Antineoplastic');
                  const isRed = comp.greenChemistryRating === 'Red';
                  const isGreen = comp.greenChemistryRating === 'Green';

                  return (
                    <tr 
                      key={comp.id}
                      className="hover:bg-forest-800/35 transition group"
                    >
                      {/* Compound Name + Glowing 2D Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3.5">
                          <div 
                            onClick={() => onSelectCompound(comp)}
                            className="w-12 h-12 rounded-xl bg-forest-950 p-1 border border-emerald-500/20 flex-shrink-0 cursor-pointer overflow-hidden group-hover:border-botanical-emerald/50 transition relative flex items-center justify-center shadow-inner"
                            title="Click to inspect complete chemical dossier"
                          >
                            <img 
                              src={comp.structureUrl || `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(comp.name)}/PNG`}
                              alt={comp.name}
                              className="w-full h-full object-contain mol-structure-glow"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%2310b981" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
                              }}
                            />
                          </div>

                          <div>
                            <button
                              onClick={() => onSelectCompound(comp)}
                              className="font-bold text-white hover:text-botanical-lime text-left transition flex items-center space-x-1.5"
                            >
                              <span>{comp.name}</span>
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider border ${
                                isGreen ? 'bg-botanical-emerald/10 text-botanical-emerald border-botanical-emerald/30' :
                                isRed ? 'bg-botanical-coral/10 text-botanical-coral border-botanical-coral/30' :
                                'bg-botanical-amber/10 text-botanical-amber border-botanical-amber/30'
                              }`}>
                                {comp.greenChemistryRating}
                              </span>
                            </button>
                            <div className="flex items-center space-x-2 text-[11px] font-mono mt-0.5">
                              <span className="text-botanical-lime font-bold">{comp.formula}</span>
                              {comp.cas && (
                                <>
                                  <span className="text-slate-600">•</span>
                                  <span className="text-slate-400">CAS: {comp.cas}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Physical State */}
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-white block">{comp.pharmaRole}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{comp.physicalState}</span>
                      </td>

                      {/* NOAA CAMEO Groups */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {(comp.cameoGroups || []).map(gid => (
                            <span 
                              key={gid}
                              className="px-2 py-0.5 rounded-full text-[10px] bg-forest-950 border border-emerald-500/15 text-botanical-amber font-mono"
                            >
                              {groupNameMap[gid] || gid}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* USP <800> */}
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block border ${
                          isCytotoxic ? 'bg-botanical-coral/15 text-botanical-coral border-botanical-coral/30' :
                          comp.uspClassification?.includes('Hazardous') ? 'bg-botanical-amber/15 text-botanical-amber border-botanical-amber/30' :
                          'bg-forest-950 text-slate-400 border-emerald-500/10'
                        }`}>
                          {comp.uspClassification || 'Non-Hazardous'}
                        </span>
                      </td>

                      {/* PBT Segmented Pill Bar */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          <PbtPillBar pbtScore={comp.pbtScore} size="sm" />
                          <span className="text-[10px] text-slate-400 font-mono block">
                            MW: {comp.molecularWeight} g/mol
                          </span>
                        </div>
                      </td>

                      {/* Waste Stream */}
                      <td className="py-3.5 px-3">
                        <span className="text-botanical-teal font-medium block truncate max-w-[170px]" title={comp.wasteStream}>
                          {comp.wasteStream}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {comp.storageClass?.split(' ')?.[0] || 'Class 11'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onSelectCompound(comp)}
                            className="p-1.5 rounded-lg bg-forest-900 border border-emerald-500/15 hover:bg-forest-800 text-slate-300 hover:text-white transition"
                            title="Inspect Complete Chemical Dossier"
                          >
                            <Eye className="w-3.5 h-3.5 text-botanical-lime" />
                          </button>
                          <button
                            onClick={() => onDeleteCompound(comp.id)}
                            className="p-1.5 rounded-lg bg-forest-900 border border-emerald-500/15 hover:bg-botanical-coral/20 text-slate-400 hover:text-botanical-coral transition"
                            title="Remove from inventory"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-emerald-500/10 bg-forest-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
          <div>
            Showing <strong className="text-white font-mono">{filteredList.length}</strong> of <strong className="text-white font-mono">{inventory.length}</strong> pharmaceutical compounds
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onResetDefaults}
              className="text-xs text-slate-400 hover:text-botanical-lime flex items-center space-x-1.5 transition"
            >
              <RefreshCw className="w-3 h-3 text-botanical-emerald" />
              <span>Reset to Standard 6 Starter Compounds</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
