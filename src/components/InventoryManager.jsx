import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Plus, Trash2, Eye, QrCode, 
  RefreshCw, FileSpreadsheet, ShieldAlert, Sparkles, 
  MapPin, AlertTriangle, Layers, Building2, Check,
  Edit2, Package, ArrowUpDown
} from 'lucide-react';
import PbtPillBar from './PbtPillBar';

export default function InventoryManager({
  inventory = [],
  onOpenAddModal,
  onOpenQrModal,
  onSelectCompound,
  onDeleteCompound,
  onUpdateCompound,
  onResetDefaults,
  onNavigateToCompatibility
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [selectedBay, setSelectedBay] = useState('ALL');
  const [selectedHazard, setSelectedHazard] = useState('ALL');
  const [editingChemId, setEditingChemId] = useState(null);
  const [editQty, setEditQty] = useState('');
  const [editBay, setEditBay] = useState('');

  // Extract distinct bays from current inventory
  const distinctBays = useMemo(() => {
    const bays = new Set();
    inventory.forEach(c => {
      if (c.storageLocation) bays.add(c.storageLocation);
    });
    return Array.from(bays);
  }, [inventory]);

  // Aggregate stats
  const stats = useMemo(() => {
    let totalQtyKg = 0;
    let highRiskCount = 0;
    let industries = new Set();

    inventory.forEach(c => {
      if (c.industry) industries.add(c.industry);
      if (c.greenChemistryRating === 'Red' || (c.nfpa?.health >= 3) || (c.nfpa?.flammability >= 3)) {
        highRiskCount++;
      }
      totalQtyKg += (Number(c.quantity) || 0);
    });

    return {
      total: inventory.length,
      highRiskCount,
      totalBays: distinctBays.length,
      distinctIndustries: industries.size,
      totalQtyKg: Math.round(totalQtyKg)
    };
  }, [inventory, distinctBays]);

  // Filtered chemical list
  const filteredInventory = useMemo(() => {
    return inventory.filter(chem => {
      const term = searchTerm.toLowerCase();
      const matchSearch = 
        chem.name.toLowerCase().includes(term) ||
        chem.formula.toLowerCase().includes(term) ||
        (chem.cas && chem.cas.toLowerCase().includes(term)) ||
        (chem.storageLocation && chem.storageLocation.toLowerCase().includes(term)) ||
        (chem.pharmaRole && chem.pharmaRole.toLowerCase().includes(term));

      if (!matchSearch) return false;

      if (selectedIndustry !== 'ALL' && chem.industry !== selectedIndustry) return false;
      if (selectedBay !== 'ALL' && chem.storageLocation !== selectedBay) return false;
      if (selectedHazard !== 'ALL' && chem.greenChemistryRating !== selectedHazard) return false;

      return true;
    });
  }, [inventory, searchTerm, selectedIndustry, selectedBay, selectedHazard]);

  const handleStartEdit = (chem) => {
    setEditingChemId(chem.id);
    setEditQty(chem.quantity || '');
    setEditBay(chem.storageLocation || '');
  };

  const handleSaveEdit = (chemId) => {
    if (onUpdateCompound) {
      onUpdateCompound(chemId, {
        quantity: parseFloat(editQty) || 0,
        storageLocation: editBay
      });
    }
    setEditingChemId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Hero */}
      <div className="bento-card p-6 border-emerald-500/20 bg-gradient-to-r from-forest-950 via-[#0a1813] to-forest-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="p-2 rounded-xl bg-botanical-emerald/15 text-botanical-emerald border border-botanical-emerald/30">
              <Package className="w-5 h-5 stroke-[2.2]" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Smart Chemical Inventory & Storage Bay Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Industrial hazardous materials registry with container QR code labeling, storage class separation, 
            GHS / NFPA 704 classifications, and real-time bay conflict auditing.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 bg-gradient-to-r from-botanical-emerald via-botanical-lime to-botanical-teal text-forest-950 text-xs font-black rounded-xl flex items-center space-x-1.5 shadow-lg shadow-botanical-emerald/20 hover:scale-105 transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Register Chemical</span>
          </button>

          <button
            onClick={onResetDefaults}
            className="px-3.5 py-2.5 bg-forest-900 border border-emerald-500/20 text-slate-300 text-xs font-bold rounded-xl flex items-center space-x-1.5 hover:text-white hover:border-emerald-500/40 transition"
            title="Reload verified multi-industry starter chemicals"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bento-card p-4 border-emerald-500/20 bg-forest-950">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Registered Chemicals</span>
          <div className="text-2xl font-black text-white font-mono mt-1">{stats.total}</div>
          <div className="text-[11px] text-botanical-lime mt-1 font-medium">{stats.distinctIndustries} Industry Sectors</div>
        </div>

        <div className="bento-card p-4 border-rose-500/20 bg-forest-950">
          <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">High-Hazard Substances</span>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">{stats.highRiskCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">NFPA Level 3+ or Red Eco</div>
        </div>

        <div className="bento-card p-4 border-cyan-500/20 bg-forest-950">
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Active Storage Bays</span>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-1">{stats.totalBays}</div>
          <div className="text-[11px] text-slate-400 mt-1">Separated Containment Bays</div>
        </div>

        <div className="bento-card p-4 border-emerald-500/20 bg-forest-950">
          <span className="text-[10px] uppercase font-bold text-botanical-lime tracking-wider">Total Inventory Mass</span>
          <div className="text-2xl font-black text-botanical-lime font-mono mt-1">{stats.totalQtyKg} <span className="text-xs text-slate-400 font-sans font-normal">kg/L</span></div>
          <div className="text-[11px] text-slate-400 mt-1">Managed Bulk Inventory</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bento-card p-4 border-emerald-500/20 bg-forest-950/80 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Chemical Name, CAS RN (e.g. 1313-82-2), Formula (Na2S), Storage Bay, or Role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-forest-900 border border-emerald-500/20 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-botanical-emerald transition"
            />
          </div>

          {/* Industry Filter */}
          <div className="w-full md:w-56">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full bg-forest-900 border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-emerald"
            >
              <option value="ALL">All Industries (All Sectors)</option>
              <option value="Leather Tanning">Leather Tanning & Processing</option>
              <option value="Pharmaceutical">Pharmaceutical Manufacturing</option>
              <option value="Cosmetics & Personal Care">Cosmetics & Personal Care</option>
              <option value="General Chemical">General Chemical Processing</option>
            </select>
          </div>

          {/* Storage Bay Filter */}
          <div className="w-full md:w-52">
            <select
              value={selectedBay}
              onChange={(e) => setSelectedBay(e.target.value)}
              className="w-full bg-forest-900 border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-emerald"
            >
              <option value="ALL">All Storage Bays</option>
              {distinctBays.map(bay => (
                <option key={bay} value={bay}>{bay}</option>
              ))}
            </select>
          </div>

          {/* Hazard Class Filter */}
          <div className="w-full md:w-44">
            <select
              value={selectedHazard}
              onChange={(e) => setSelectedHazard(e.target.value)}
              className="w-full bg-forest-900 border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-emerald"
            >
              <option value="ALL">All Hazard Ratings</option>
              <option value="Red">Red / Hazardous</option>
              <option value="Yellow">Yellow / Moderate</option>
              <option value="Green">Green / Preferred</option>
            </select>
          </div>

        </div>
      </div>

      {/* Chemical Inventory Table */}
      <div className="bento-card border-emerald-500/15 bg-forest-950 overflow-hidden">
        <div className="p-4 border-b border-emerald-500/15 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Inventory Formulary
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-forest-900 border border-emerald-500/20 text-botanical-lime">
              Showing {filteredInventory.length} of {inventory.length}
            </span>
          </div>

          {onNavigateToCompatibility && (
            <button
              onClick={onNavigateToCompatibility}
              className="text-xs text-botanical-lime hover:underline flex items-center space-x-1 font-medium"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Test Pairwise Compatibility &rarr;</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-emerald-500/15 bg-forest-900/60 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Chemical Identity</th>
                <th className="py-3 px-3">Industry / Role</th>
                <th className="py-3 px-3">Quantity & Stock</th>
                <th className="py-3 px-3">Storage Bay & Class</th>
                <th className="py-3 px-3 text-center">NFPA 704</th>
                <th className="py-3 px-3">PBT Profile</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No chemicals match the active search criteria.</p>
                    <button
                      onClick={() => { setSearchTerm(''); setSelectedIndustry('ALL'); setSelectedBay('ALL'); setSelectedHazard('ALL'); }}
                      className="mt-2 text-xs text-botanical-lime underline"
                    >
                      Clear all search filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredInventory.map(chem => (
                  <tr key={chem.id} className="hover:bg-forest-900/40 transition">
                    
                    {/* Identity */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs sm:text-sm">{chem.name}</div>
                      <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-400 mt-0.5">
                        <span className="text-botanical-lime font-bold">{chem.formula}</span>
                        <span>•</span>
                        <span>CAS: {chem.cas || 'Unassigned'}</span>
                        {chem.molecularWeight > 0 && (
                          <>
                            <span>•</span>
                            <span>MW: {chem.molecularWeight} g/mol</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Industry */}
                    <td className="py-3.5 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-1 ${
                        chem.industry === 'Leather Tanning' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                        chem.industry === 'Pharmaceutical' ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30' :
                        chem.industry === 'Cosmetics & Personal Care' ? 'bg-pink-500/15 text-pink-300 border border-pink-500/30' :
                        'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {chem.industry || 'General Chemical'}
                      </span>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{chem.pharmaRole}</div>
                    </td>

                    {/* Quantity */}
                    <td className="py-3.5 px-3 font-mono">
                      {editingChemId === chem.id ? (
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            value={editQty}
                            onChange={(e) => setEditQty(e.target.value)}
                            className="w-16 bg-forest-900 border border-emerald-500 rounded px-1.5 py-1 text-xs text-white"
                          />
                          <span className="text-slate-400 text-xs">{chem.unit || 'kg'}</span>
                          <button
                            onClick={() => handleSaveEdit(chem.id)}
                            className="p-1 bg-botanical-emerald text-forest-950 rounded hover:scale-105"
                            title="Save"
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-bold text-xs">{chem.quantity || 0}</span>
                          <span className="text-slate-400 text-[11px]">{chem.unit || 'kg'}</span>
                          <button
                            onClick={() => handleStartEdit(chem)}
                            className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 transition"
                            title="Quick Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Storage Bay & Class */}
                    <td className="py-3.5 px-3">
                      {editingChemId === chem.id ? (
                        <input
                          type="text"
                          value={editBay}
                          onChange={(e) => setEditBay(e.target.value)}
                          className="w-full bg-forest-900 border border-emerald-500 rounded px-1.5 py-1 text-xs text-white"
                        />
                      ) : (
                        <div>
                          <div className="flex items-center space-x-1 text-slate-200 font-medium">
                            <MapPin className="w-3 h-3 text-botanical-emerald flex-shrink-0" />
                            <span className="line-clamp-1">{chem.storageLocation || 'Unassigned Bay'}</span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            Class: {chem.storageClass ? chem.storageClass.split(' ')[0] : '11'}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* NFPA 704 Diamond */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-grid grid-cols-2 gap-0.5 p-1 bg-forest-900 rounded border border-emerald-500/20 font-mono text-[10px] font-bold">
                        <div className="w-4 h-4 bg-blue-600/60 text-blue-200 flex items-center justify-center rounded-tl" title="Health">
                          {chem.nfpa?.health ?? 1}
                        </div>
                        <div className="w-4 h-4 bg-red-600/60 text-red-200 flex items-center justify-center rounded-tr" title="Flammability">
                          {chem.nfpa?.flammability ?? 0}
                        </div>
                        <div className="w-4 h-4 bg-amber-600/60 text-amber-200 flex items-center justify-center rounded-bl" title="Instability">
                          {chem.nfpa?.instability ?? 0}
                        </div>
                        <div className="w-4 h-4 bg-slate-700/60 text-slate-300 flex items-center justify-center rounded-br text-[8px]" title="Special">
                          {chem.nfpa?.special || '-'}
                        </div>
                      </div>
                    </td>

                    {/* PBT */}
                    <td className="py-3.5 px-3">
                      <PbtPillBar pbtScore={chem.pbtScore} />
                      <div className="text-[10px] font-mono text-slate-400 mt-1">
                        {chem.wgkClass ? chem.wgkClass.split(' ')[0] : 'WGK 1'}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        
                        {/* Container QR Code Modal Button */}
                        <button
                          onClick={() => onOpenQrModal && onOpenQrModal(chem)}
                          className="p-1.5 rounded-lg bg-forest-900 border border-emerald-500/20 text-botanical-lime hover:bg-forest-800 hover:text-white transition shadow-sm"
                          title="Generate Container Drum QR Label & Live Bay Audit"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        {/* Dossier Detail Button */}
                        <button
                          onClick={() => onSelectCompound && onSelectCompound(chem)}
                          className="p-1.5 rounded-lg bg-forest-900 border border-emerald-500/20 text-slate-300 hover:bg-forest-800 hover:text-white transition"
                          title="Inspect Chemical Safety Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => onDeleteCompound && onDeleteCompound(chem.id)}
                          className="p-1.5 rounded-lg bg-forest-900 border border-rose-500/20 text-rose-400 hover:bg-rose-950/60 hover:text-rose-200 transition"
                          title="Remove from Formulary"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
