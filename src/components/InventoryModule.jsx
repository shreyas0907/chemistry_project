import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Package, Search, Plus, QrCode, Filter, AlertTriangle, 
  CheckCircle2, XCircle, Clock, Calendar, MapPin, 
  Printer, Camera, Edit2, Trash2, ArrowUpDown, X, 
  Upload, Save, RefreshCw, FileText, Check, ShieldAlert
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import jsQR from 'jsqr';

export default function InventoryModule({
  inventory = [],
  onAddChemical,
  onUpdateChemical,
  onDeleteChemical
}) {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'EXPIRING' | 'EXPIRED'
  const [sortField, setSortField] = useState('expiryDate');
  const [sortAsc, setSortAsc] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [qrLabelChemical, setQrLabelChemical] = useState(null);
  const [editingChemical, setEditingChemical] = useState(null);

  // Helper: calculate expiry status
  // Warning period: 30 days
  const getExpiryDetails = (expiryDateStr) => {
    if (!expiryDateStr) return { status: 'ACTIVE', daysLeft: 999, label: 'Active' };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(expiryDateStr);
    exp.setHours(0, 0, 0, 0);

    const diffTime = exp.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { 
        status: 'EXPIRED', 
        daysLeft: diffDays, 
        label: `Expired (${Math.abs(diffDays)}d ago)`,
        isUsable: false 
      };
    } else if (diffDays <= 30) {
      return { 
        status: 'EXPIRING', 
        daysLeft: diffDays, 
        label: `Expiring Soon (${diffDays}d left)`,
        isUsable: true 
      };
    } else {
      return { 
        status: 'ACTIVE', 
        daysLeft: diffDays, 
        label: 'Active (In Date)',
        isUsable: true 
      };
    }
  };

  // Compute aggregated inventory metrics
  const metrics = useMemo(() => {
    let activeCount = 0;
    let expiringCount = 0;
    let expiredCount = 0;
    let totalQtyKg = 0;

    inventory.forEach(chem => {
      const exp = getExpiryDetails(chem.expiryDate);
      if (exp.status === 'EXPIRED') expiredCount++;
      else if (exp.status === 'EXPIRING') expiringCount++;
      else activeCount++;

      const qty = parseFloat(chem.quantity) || 0;
      if (chem.unit === 'g' || chem.unit === 'mL') totalQtyKg += qty / 1000;
      else totalQtyKg += qty;
    });

    return {
      total: inventory.length,
      active: activeCount,
      expiring: expiringCount,
      expired: expiredCount,
      totalWeightApprox: Math.round(totalQtyKg)
    };
  }, [inventory]);

  // Filtered and sorted inventory list
  const filteredList = useMemo(() => {
    return inventory
      .filter(chem => {
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch = 
          !term ||
          chem.name.toLowerCase().includes(term) ||
          (chem.formula && chem.formula.toLowerCase().includes(term)) ||
          (chem.cas && chem.cas.toLowerCase().includes(term)) ||
          (chem.batchNumber && chem.batchNumber.toLowerCase().includes(term)) ||
          (chem.storageLocation && chem.storageLocation.toLowerCase().includes(term));

        if (!matchesSearch) return false;

        const exp = getExpiryDetails(chem.expiryDate);
        if (statusFilter === 'ACTIVE' && exp.status !== 'ACTIVE') return false;
        if (statusFilter === 'EXPIRING' && exp.status !== 'EXPIRING') return false;
        if (statusFilter === 'EXPIRED' && exp.status !== 'EXPIRED') return false;

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField] || '';
        let valB = b[sortField] || '';
        if (sortField === 'quantity') {
          valA = parseFloat(valA) || 0;
          valB = parseFloat(valB) || 0;
        }
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [inventory, searchTerm, statusFilter, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Metric Summary Cards */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-teal-600" />
            <span>Chemical Inventory Management</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Maintain accurate digital stock records, monitor chemical shelf-life, and generate container QR labels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsScannerModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-white border border-slate-300 hover:border-teal-500 text-slate-700 text-xs font-semibold flex items-center space-x-2 transition shadow-sm hover:bg-slate-50"
          >
            <Camera className="w-4 h-4 text-teal-600" />
            <span>Scan QR Code</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center space-x-2 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Chemical</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Summary Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block">Total Chemicals</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{metrics.total}</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Stored across facility</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-emerald-700 block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active &amp; Usable</span>
          </span>
          <span className="text-2xl font-bold text-emerald-600 mt-1 block">{metrics.active}</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Within valid shelf life</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-amber-700 block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Expiring Soon</span>
          </span>
          <span className="text-2xl font-bold text-amber-600 mt-1 block">{metrics.expiring}</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Within next 30 days</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-red-700 block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Expired Stock</span>
          </span>
          <span className="text-2xl font-bold text-red-600 mt-1 block">{metrics.expired}</span>
          <span className="text-[11px] text-red-500 mt-0.5 block font-medium">Unusable • Segregate</span>
        </div>
      </div>

      {/* 2. Search, Status Filter & Controls Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by chemical name, formula, CAS #, batch, or location..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Expiry Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-500 text-xs font-medium mr-1 hidden sm:inline">Filter:</span>
          {[
            { id: 'ALL', label: `All (${metrics.total})` },
            { id: 'ACTIVE', label: `Active (${metrics.active})` },
            { id: 'EXPIRING', label: `Expiring Soon (${metrics.expiring})` },
            { id: 'EXPIRED', label: `Expired (${metrics.expired})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                statusFilter === tab.id
                  ? tab.id === 'EXPIRED'
                    ? 'bg-red-50 text-red-700 border border-red-300 font-bold'
                    : tab.id === 'EXPIRING'
                    ? 'bg-amber-50 text-amber-700 border border-amber-300 font-bold'
                    : tab.id === 'ACTIVE'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold'
                    : 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Chemical Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 cursor-pointer hover:text-slate-900" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Chemical &amp; Formula</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">CAS Number</th>
                <th className="py-3 px-3 cursor-pointer hover:text-slate-900" onClick={() => handleSort('quantity')}>
                  <div className="flex items-center gap-1">
                    <span>Quantity</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Storage Location</th>
                <th className="py-3 px-3">Batch / Lot #</th>
                <th className="py-3 px-3 cursor-pointer hover:text-slate-900" onClick={() => handleSort('expiryDate')}>
                  <div className="flex items-center gap-1">
                    <span>Expiry Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Expiry Status</th>
                <th className="py-3 px-3 text-center">QR Code</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">No chemical records match your search or filter.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try resetting the filter or add a new chemical substance.</p>
                  </td>
                </tr>
              ) : (
                filteredList.map((chem) => {
                  const expDetails = getExpiryDetails(chem.expiryDate);
                  const isExpired = expDetails.status === 'EXPIRED';
                  const isExpiring = expDetails.status === 'EXPIRING';

                  return (
                    <tr 
                      key={chem.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isExpired ? 'bg-red-50/40' : ''
                      }`}
                    >
                      {/* Name & Formula */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{chem.name}</div>
                        <div className="text-[11px] font-mono text-slate-500">{chem.formula || '—'}</div>
                      </td>

                      {/* CAS Number */}
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {chem.cas || 'N/A'}
                      </td>

                      {/* Quantity & Unit */}
                      <td className="py-3 px-3 font-medium text-slate-900 whitespace-nowrap">
                        {chem.quantity} {chem.unit || 'kg'}
                      </td>

                      {/* Storage Location */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{chem.storageLocation || 'Unassigned'}</span>
                        </span>
                      </td>

                      {/* Batch Number */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                        {chem.batchNumber || chem.sdsRef || `LOT-${chem.id.slice(-6).toUpperCase()}`}
                      </td>

                      {/* Expiry Date */}
                      <td className="py-3 px-3 font-mono whitespace-nowrap">
                        <span className={`font-medium ${
                          isExpired ? 'text-red-700 font-bold' : isExpiring ? 'text-amber-700 font-semibold' : 'text-slate-700'
                        }`}>
                          {chem.expiryDate || 'Not recorded'}
                        </span>
                      </td>

                      {/* Expiry Status Badge */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700 border border-red-200">
                            <XCircle className="w-3 h-3 text-red-600" />
                            <span>Expired • Do Not Use</span>
                          </span>
                        ) : isExpiring ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Expiring ({expDetails.daysLeft}d)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Active</span>
                          </span>
                        )}
                      </td>

                      {/* QR Code Action */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => setQrLabelChemical(chem)}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-teal-700 transition"
                          title="Generate &amp; Print Container QR Code"
                        >
                          <QrCode className="w-4 h-4 text-slate-700" />
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => setEditingChemical(chem)}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                            title="Update Quantity or Location"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to remove "${chem.name}" from the active chemical inventory?`)) {
                                onDeleteChemical(chem.id);
                              }
                            }}
                            className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
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
      </div>

      {/* 4. MODAL: Add Chemical Manually */}
      {isAddModalOpen && (
        <AddChemicalDialog
          onClose={() => setIsAddModalOpen(false)}
          onSave={(newChem) => {
            onAddChemical(newChem);
            setIsAddModalOpen(false);
          }}
        />
      )}

      {/* 5. MODAL: QR Scanner with Camera & Manual Entry */}
      {isScannerModalOpen && (
        <QrScannerDialog
          inventory={inventory}
          onClose={() => setIsScannerModalOpen(false)}
          onUpdateStock={(chemId, updates) => {
            onUpdateChemical(chemId, updates);
          }}
        />
      )}

      {/* 6. MODAL: Print Container QR Label */}
      {qrLabelChemical && (
        <PrintQrDialog
          chemical={qrLabelChemical}
          onClose={() => setQrLabelChemical(null)}
        />
      )}

      {/* 7. MODAL: Quick Update Quantity / Location */}
      {editingChemical && (
        <QuickUpdateDialog
          chemical={editingChemical}
          onClose={() => setEditingChemical(null)}
          onSave={(updates) => {
            onUpdateChemical(editingChemical.id, updates);
            setEditingChemical(null);
          }}
        />
      )}

    </div>
  );
}

// =========================================================================
// SUBCOMPONENT: ADD CHEMICAL DIALOG
// =========================================================================
function AddChemicalDialog({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    formula: '',
    cas: '',
    quantity: '',
    unit: 'kg',
    purchaseDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    storageLocation: '',
    batchNumber: `LOT-${Math.floor(100000 + Math.random() * 900000)}`
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Chemical name is required';
    if (!formData.formula.trim()) errs.formula = 'Chemical formula is required';
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) errs.quantity = 'Valid quantity is required';
    if (!formData.expiryDate) errs.expiryDate = 'Expiry date is required';
    if (!formData.storageLocation.trim()) errs.storageLocation = 'Storage location is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newChemical = {
      id: `chem-manual-${Date.now()}`,
      name: formData.name.trim(),
      formula: formData.formula.trim(),
      cas: formData.cas.trim() || 'N/A',
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      purchaseDate: formData.purchaseDate,
      expiryDate: formData.expiryDate,
      storageLocation: formData.storageLocation.trim(),
      batchNumber: formData.batchNumber.trim(),
      qrIdentifier: `CS-LOT-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString()
    };

    onSave(newChemical);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add Chemical to Inventory</h2>
            <p className="text-xs text-slate-500">Record incoming chemical stock with batch tracking and expiry dates.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Chemical Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chemical Substance Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sodium Sulfide, Isopropanol, Sulfuric Acid"
                className={`w-full px-3.5 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none focus:border-teal-500 ${
                  errors.name ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                }`}
              />
              {errors.name && <p className="text-[11px] text-red-600 mt-0.5">{errors.name}</p>}
            </div>

            {/* Formula */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chemical Formula *
              </label>
              <input
                type="text"
                value={formData.formula}
                onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                placeholder="e.g. Na2S, C3H8O, H2SO4"
                className={`w-full px-3.5 py-2 rounded-lg border text-xs text-slate-800 font-mono focus:outline-none focus:border-teal-500 ${
                  errors.formula ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                }`}
              />
              {errors.formula && <p className="text-[11px] text-red-600 mt-0.5">{errors.formula}</p>}
            </div>

            {/* CAS Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CAS Number (Optional)
              </label>
              <input
                type="text"
                value={formData.cas}
                onChange={(e) => setFormData({ ...formData, cas: e.target.value })}
                placeholder="e.g. 1313-82-2, 67-63-0"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Available Quantity *
              </label>
              <input
                type="number"
                step="any"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="e.g. 500, 25.5"
                className={`w-full px-3.5 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none focus:border-teal-500 ${
                  errors.quantity ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                }`}
              />
              {errors.quantity && <p className="text-[11px] text-red-600 mt-0.5">{errors.quantity}</p>}
            </div>

            {/* Unit */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unit of Measurement *
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-500 bg-white"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="L">Liters (L)</option>
                <option value="mL">Milliliters (mL)</option>
              </select>
            </div>

            {/* Storage Location */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Storage Location / Bay *
              </label>
              <input
                type="text"
                value={formData.storageLocation}
                onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                placeholder="e.g. Warehouse Bay 3, Flammable Cabinet A-1, Acid Bund 2"
                className={`w-full px-3.5 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none focus:border-teal-500 ${
                  errors.storageLocation ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                }`}
              />
              {errors.storageLocation && <p className="text-[11px] text-red-600 mt-0.5">{errors.storageLocation}</p>}
            </div>

            {/* Batch / Lot Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Batch / Lot Number *
              </label>
              <input
                type="text"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                placeholder="e.g. LOT-2026-448"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Purchase / Receipt Date *
              </label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Expiry Date */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expiry Date *
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className={`w-full px-3.5 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none focus:border-teal-500 ${
                  errors.expiryDate ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                }`}
              />
              {errors.expiryDate && <p className="text-[11px] text-red-600 mt-0.5">{errors.expiryDate}</p>}
              <p className="text-[11px] text-slate-400 mt-1">
                Automatic expiry tracking flags stock as Expiring Soon (&le;30 days) and Expired once passed.
              </p>
            </div>

          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-600 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm"
            >
              Save Chemical to Inventory
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

// =========================================================================
// SUBCOMPONENT: QR SCANNER DIALOG (CAMERA + IMAGE + MANUAL INPUT)
// =========================================================================
function QrScannerDialog({ inventory = [], onClose, onUpdateStock }) {
  const [scanMode, setScanMode] = useState('camera'); // 'camera' | 'upload' | 'manual'
  const [manualCode, setManualCode] = useState('');
  const [matchedChemical, setMatchedChemical] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Edit stock inline
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustLocation, setAdjustLocation] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);

  // Camera Scanning Loop with jsQR
  useEffect(() => {
    if (scanMode !== 'camera') {
      stopCamera();
      return;
    }

    let isRunning = true;

    async function startCamera() {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', true);
          await videoRef.current.play();
          requestAnimationFrame(scanFrame);
        }
      } catch (err) {
        console.warn('Camera access could not be initialized:', err);
        setCameraError('Camera access unavailable. You can upload an image or type the chemical name/code below.');
        setScanMode('manual');
      }
    }

    function scanFrame() {
      if (!isRunning || !videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (code && code.data) {
          handleFoundCode(code.data);
          return; // pause scan
        }
      }
      animFrameRef.current = requestAnimationFrame(scanFrame);
    }

    startCamera();

    return () => {
      isRunning = false;
      stopCamera();
    };
  }, [scanMode]);

  const stopCamera = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleFoundCode = (dataString) => {
    // Try parsing JSON payload or matching string
    let found = null;
    try {
      const parsed = JSON.parse(dataString);
      if (parsed.chemShieldId || parsed.id) {
        found = inventory.find(c => c.id === (parsed.chemShieldId || parsed.id));
      }
      if (!found && parsed.name) {
        found = inventory.find(c => c.name.toLowerCase() === parsed.name.toLowerCase());
      }
    } catch {
      // Plain text search
      const term = dataString.toLowerCase().trim();
      found = inventory.find(c => 
        c.id.toLowerCase() === term ||
        c.name.toLowerCase() === term ||
        (c.cas && c.cas.toLowerCase() === term) ||
        (c.batchNumber && c.batchNumber.toLowerCase() === term)
      );
    }

    if (found) {
      setMatchedChemical(found);
      setAdjustQty(found.quantity.toString());
      setAdjustLocation(found.storageLocation || '');
    } else {
      alert(`Scanned code: "${dataString.slice(0, 50)}" did not match any stored chemical record.`);
    }
  };

  // Image Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          handleFoundCode(code.data);
        } else {
          alert('No readable QR code found in this image. Try another photo or enter the code manually.');
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Manual Submit
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleFoundCode(manualCode.trim());
  };

  // Save updated quantity/location
  const handleSaveStockUpdate = () => {
    if (!matchedChemical) return;
    const newQty = parseFloat(adjustQty);
    if (isNaN(newQty) || newQty < 0) {
      alert('Please enter a valid non-negative quantity');
      return;
    }

    onUpdateStock(matchedChemical.id, {
      quantity: newQty,
      storageLocation: adjustLocation.trim()
    });

    setMatchedChemical({
      ...matchedChemical,
      quantity: newQty,
      storageLocation: adjustLocation.trim()
    });
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-teal-600" />
              <span>Chemical Container QR Scanner</span>
            </h2>
            <p className="text-xs text-slate-500">Scan container label to instantly identify stock and update quantities.</p>
          </div>
          <button 
            onClick={() => { stopCamera(); onClose(); }} 
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Scan Mode Switcher */}
          <div className="flex rounded-lg border border-slate-200 p-1 bg-slate-50 text-xs">
            <button
              onClick={() => { setMatchedChemical(null); setScanMode('camera'); }}
              className={`flex-1 py-1.5 rounded-md font-medium text-center transition ${
                scanMode === 'camera' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Live Camera
            </button>
            <button
              onClick={() => { setMatchedChemical(null); setScanMode('upload'); }}
              className={`flex-1 py-1.5 rounded-md font-medium text-center transition ${
                scanMode === 'upload' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Upload Photo
            </button>
            <button
              onClick={() => { setMatchedChemical(null); setScanMode('manual'); }}
              className={`flex-1 py-1.5 rounded-md font-medium text-center transition ${
                scanMode === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Manual Code
            </button>
          </div>

          {/* Camera Viewport */}
          {scanMode === 'camera' && !matchedChemical && (
            <div className="space-y-2">
              <div className="relative w-full h-64 bg-black rounded-xl overflow-hidden flex items-center justify-center border border-slate-300">
                <video ref={videoRef} className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />

                {/* Target overlay reticle */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-44 h-44 border-2 border-teal-400 rounded-xl relative shadow-sm">
                    <div className="w-4 h-4 border-t-2 border-l-2 border-white absolute -top-1 -left-1" />
                    <div className="w-4 h-4 border-t-2 border-r-2 border-white absolute -top-1 -right-1" />
                    <div className="w-4 h-4 border-b-2 border-l-2 border-white absolute -bottom-1 -left-1" />
                    <div className="w-4 h-4 border-b-2 border-r-2 border-white absolute -bottom-1 -right-1" />
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-center text-slate-500">
                Point your camera at a CHEM-SHIELD container QR code label.
              </p>
            </div>
          )}

          {/* Upload Viewport */}
          {scanMode === 'upload' && !matchedChemical && (
            <div className="p-8 border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl text-center space-y-3 cursor-pointer relative bg-slate-50/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 mx-auto text-slate-400" />
              <div>
                <p className="text-xs font-semibold text-slate-700">Click or drag an image of the QR label</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Supports JPG, PNG, and mobile camera screenshots</p>
              </div>
            </div>
          )}

          {/* Manual Input Viewport */}
          {scanMode === 'manual' && !matchedChemical && (
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enter Chemical ID, Name, or Batch Number:
                </label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="e.g. Sodium Sulfide, 1313-82-2, or LOT-12345"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Find Chemical Record
              </button>

              {/* Quick sample chips */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 block mb-1.5">Quick Demo Samples in Stock:</span>
                <div className="flex flex-wrap gap-1.5">
                  {inventory.slice(0, 4).map(chem => (
                    <button
                      key={chem.id}
                      type="button"
                      onClick={() => handleFoundCode(chem.name)}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-[11px] text-slate-700 border border-slate-200 transition"
                    >
                      {chem.name}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* Matched Chemical Record Card */}
          {matchedChemical && (
            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/30 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono">
                    VERIFIED CONTAINER IDENTIFIED
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{matchedChemical.name}</h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mt-0.5">
                    <span>Formula: {matchedChemical.formula}</span>
                    <span>•</span>
                    <span>CAS: {matchedChemical.cas || 'N/A'}</span>
                  </div>
                </div>
                <button
                  onClick={() => setMatchedChemical(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 underline"
                >
                  Scan Another
                </button>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Batch / Lot #:</span>
                  <span className="font-mono font-medium text-slate-800">{matchedChemical.batchNumber || 'LOT-2024'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Expiry Date:</span>
                  <span className="font-mono font-medium text-slate-800">{matchedChemical.expiryDate || 'N/A'}</span>
                </div>
              </div>

              {/* Inline Stock Adjustment Form */}
              <div className="pt-2 border-t border-teal-200/60 space-y-2">
                <span className="text-xs font-semibold text-slate-800 block">
                  Update Container Stock &amp; Location:
                </span>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Quantity ({matchedChemical.unit}):</label>
                    <input
                      type="number"
                      step="any"
                      value={adjustQty}
                      onChange={(e) => setAdjustQty(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Storage Location:</label>
                    <input
                      type="text"
                      value={adjustLocation}
                      onChange={(e) => setAdjustLocation(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  {updateSuccess ? (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Stock Updated Successfully!</span>
                    </span>
                  ) : <span />}

                  <button
                    onClick={handleSaveStockUpdate}
                    className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save to Database</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

// =========================================================================
// SUBCOMPONENT: PRINT CONTAINER QR LABEL DIALOG
// =========================================================================
function PrintQrDialog({ chemical, onClose }) {
  if (!chemical) return null;

  const qrPayload = JSON.stringify({
    id: chemical.id,
    name: chemical.name,
    formula: chemical.formula,
    cas: chemical.cas,
    batch: chemical.batchNumber,
    expiry: chemical.expiryDate,
    location: chemical.storageLocation
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Container QR Label</h2>
            <p className="text-xs text-slate-500">Official printable container label with QR identifier.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Label Preview Card */}
        <div className="p-6 space-y-4">
          <div className="p-5 border-2 border-slate-900 rounded-xl bg-white shadow-sm space-y-3 font-sans">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <div>
                <span className="text-[10px] font-bold font-mono tracking-widest text-slate-500 block uppercase">
                  CHEM-SHIELD INVENTORY
                </span>
                <span className="text-xs font-bold text-slate-900">INDUSTRIAL CONTAINER LABEL</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded">
                GHS / OSHA
              </span>
            </div>

            <div className="flex items-start justify-between gap-4 pt-1">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 leading-tight">{chemical.name}</h3>
                <p className="text-xs font-mono text-slate-600">Formula: {chemical.formula}</p>
                <p className="text-xs font-mono text-slate-600">CAS: {chemical.cas || 'N/A'}</p>
                <p className="text-xs font-medium text-slate-700">Quantity: {chemical.quantity} {chemical.unit}</p>
              </div>

              {/* QR Code */}
              <div className="p-2 border border-slate-200 rounded-lg bg-white shrink-0">
                <QRCodeSVG
                  value={qrPayload}
                  size={96}
                  level="M"
                  includeMargin={false}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Batch / Lot:</span>
                <span>{chemical.batchNumber || 'LOT-2024'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Expiry Date:</span>
                <span className="font-bold text-slate-900">{chemical.expiryDate || 'N/A'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[9px] uppercase">Storage Location:</span>
                <span className="text-slate-800">{chemical.storageLocation || 'Warehouse Floor'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-600 text-xs font-medium"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Container Label</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// =========================================================================
// SUBCOMPONENT: QUICK UPDATE DIALOG
// =========================================================================
function QuickUpdateDialog({ chemical, onClose, onSave }) {
  const [qty, setQty] = useState(chemical.quantity || '');
  const [loc, setLoc] = useState(chemical.storageLocation || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedQty = parseFloat(qty);
    if (isNaN(parsedQty) || parsedQty < 0) {
      alert('Please enter a valid quantity');
      return;
    }
    onSave({
      quantity: parsedQty,
      storageLocation: loc.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-xl border border-slate-200 overflow-hidden text-slate-800">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-900">Update Chemical Stock</h3>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div>
            <span className="text-xs font-bold text-slate-900 block">{chemical.name}</span>
            <span className="text-[11px] font-mono text-slate-500">{chemical.formula} • CAS: {chemical.cas}</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Quantity Available ({chemical.unit || 'kg'}):
            </label>
            <input
              type="number"
              step="any"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-teal-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Storage Location / Bay:
            </label>
            <input
              type="text"
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
            >
              Save Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
