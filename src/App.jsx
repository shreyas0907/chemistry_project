import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import InventoryTable from './components/InventoryTable';
import CompatibilityChecker from './components/CompatibilityChecker';
import GreenSubstitutionRecommender from './components/GreenSubstitutionRecommender';
import DashboardAnalytics from './components/DashboardAnalytics';
import AddCompoundModal from './components/AddCompoundModal';
import CompoundDetailModal from './components/CompoundDetailModal';
import { STARTER_INVENTORY } from './data/starterInventory';
import { analyzeReactivityMatrix } from './services/pharmaApi';

const STORAGE_KEY = 'pharma_eco_shield_inventory_v1';

export default function App() {
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read local storage, using default starter inventory:', e);
    }
    return STARTER_INVENTORY;
  });

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'compatibility' | 'green' | 'analytics'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailCompound, setDetailCompound] = useState(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
    } catch (e) {
      console.error('Failed to persist inventory to local storage:', e);
    }
  }, [inventory]);

  // Global Incompatibility count for top indicator
  const globalIncompatibilities = useMemo(() => {
    const res = analyzeReactivityMatrix(inventory);
    return res.pairInteractions.filter(p => p.severity === 'DANGER');
  }, [inventory]);

  // Handlers
  const handleAddCompound = (newCompound) => {
    setInventory(prev => [newCompound, ...prev]);
  };

  const handleDeleteCompound = (id) => {
    if (window.confirm('Are you sure you want to remove this compound from active formulary?')) {
      setInventory(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset inventory back to the 6 initial validated pharmaceutical compounds? Custom additions will be overwritten.')) {
      setInventory(STARTER_INVENTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(STARTER_INVENTORY));
    }
  };

  // CSV Export (EPA RCRA & Biomedical Waste Standard format)
  const handleExportCsv = () => {
    const headers = [
      "Compound Name",
      "Chemical Formula",
      "CAS Number",
      "Molecular Weight (g/mol)",
      "Pharma Role",
      "Physical State",
      "USP <800> Class",
      "Storage Class",
      "Storage Conditions",
      "Green Rating",
      "Waste Stream Category",
      "Persistence (P)",
      "Bioaccumulation (B)",
      "Aquatic Toxicity (T)",
      "Hazard Summary"
    ];

    const rows = inventory.map(c => [
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.formula || '').replace(/"/g, '""')}"`,
      `"${(c.cas || '').replace(/"/g, '""')}"`,
      c.molecularWeight || 0,
      `"${(c.pharmaRole || '').replace(/"/g, '""')}"`,
      `"${(c.physicalState || '').replace(/"/g, '""')}"`,
      `"${(c.uspClassification || '').replace(/"/g, '""')}"`,
      `"${(c.storageClass || '').replace(/"/g, '""')}"`,
      `"${(c.storageConditions || '').replace(/"/g, '""')}"`,
      `"${(c.greenChemistryRating || '').replace(/"/g, '""')}"`,
      `"${(c.wasteStream || '').replace(/"/g, '""')}"`,
      `"${(c.pbtScore?.persistence || '').replace(/"/g, '""')}"`,
      `"${(c.pbtScore?.bioaccumulation || '').replace(/"/g, '""')}"`,
      `"${(c.pbtScore?.toxicity || '').replace(/"/g, '""')}"`,
      `"${(c.hazardSummary || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PharmaEcoShield_Waste_Manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Export (Full Scientific Compliance Dossier)
  const handleExportJson = () => {
    const dossier = {
      facilitySystem: "PharmaEcoShield Chemical Reactivity & Environmental Tracker",
      theme: "Eco-Botanical Bento Dashboard",
      exportTimestamp: new Date().toISOString(),
      standardsCompliance: [
        "USP <800> Hazardous Drugs in Healthcare Settings",
        "EPA RCRA Subpart P (Pharmaceutical Hazardous Waste)",
        "ICH Q3C Impurities: Guideline for Residual Solvents",
        "NOAA CAMEO Chemicals Reactivity Compatibility Matrix"
      ],
      totalInventoryRecords: inventory.length,
      inventory
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dossier, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `PharmaEcoShield_Compliance_Dossier_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08120E] text-slate-100">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        inventoryCount={inventory.length}
        incompatibleCount={globalIncompatibilities.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {activeTab === 'inventory' && (
          <InventoryTable
            inventory={inventory}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onSelectCompound={(comp) => setDetailCompound(comp)}
            onDeleteCompound={handleDeleteCompound}
            onResetDefaults={handleResetDefaults}
            onNavigateToCompatibility={() => setActiveTab('compatibility')}
          />
        )}

        {activeTab === 'compatibility' && (
          <CompatibilityChecker
            inventory={inventory}
            onSelectCompoundForDetail={(comp) => setDetailCompound(comp)}
          />
        )}

        {activeTab === 'green' && (
          <GreenSubstitutionRecommender
            inventory={inventory}
            onAddCompound={handleAddCompound}
          />
        )}

        {activeTab === 'analytics' && (
          <DashboardAnalytics
            inventory={inventory}
            onExportCsv={handleExportCsv}
            onExportJson={handleExportJson}
          />
        )}

      </main>

      {/* Add Custom Compound Modal with Live PubChem/openFDA/EPA integration */}
      <AddCompoundModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCompound}
      />

      {/* Chemical Dossier Slide-Over Inspector */}
      <CompoundDetailModal
        compound={detailCompound}
        isOpen={!!detailCompound}
        onClose={() => setDetailCompound(null)}
      />

      {/* Footer */}
      <footer className="border-t border-emerald-500/10 bg-[#08120E]/90 backdrop-blur-md py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-slate-400">
            PharmaEcoShield • Eco-Botanical Bento Dashboard for Hospital Pharmacy & Hazardous Drug Safety
          </span>
          <span className="font-mono text-botanical-lime text-[11px]">
            NOAA CAMEO • PubChem PUG REST • openFDA • EPA CTX Estimator
          </span>
        </div>
      </footer>

    </div>
  );
}
