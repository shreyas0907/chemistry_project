import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import DashboardOverview from './components/DashboardOverview';
import ThreeDigitalTwin from './components/ThreeDigitalTwin';
import CompatibilityChecker from './components/CompatibilityChecker';
import InventoryManager from './components/InventoryManager';
import WarehousePlanner from './components/WarehousePlanner';
import EmergencyResponseTrainer from './components/EmergencyResponseTrainer';
import EtpSimulator from './components/EtpSimulator';
import AiRiskEngine from './components/AiRiskEngine';
import IndustryModules from './components/IndustryModules';
import SegregationSystem from './components/SegregationSystem';
import AccidentSimulator from './components/AccidentSimulator';
import AiSafetyAssistant from './components/AiSafetyAssistant';
import EnvironmentalModule from './components/EnvironmentalModule';
import AddCompoundModal from './components/AddCompoundModal';
import ContainerQrModal from './components/ContainerQrModal';
import ReportGeneratorModal from './components/ReportGeneratorModal';
import CompoundDetailModal from './components/CompoundDetailModal';
import { INITIAL_INDUSTRIAL_INVENTORY } from './data/industryChemicals';
import { evaluateMultiChemicalCompatibility, detectStorageBayViolations } from './services/chemicalSafetyEngine';
import { FileText, Download, ShieldCheck, AlertTriangle, Layers, Building2, Flame } from 'lucide-react';

const STORAGE_KEY = 'chem_shield_industrial_inventory_v5_master';

export default function App() {
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_INDUSTRIAL_INVENTORY.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read local storage, using initial industrial formulary:', e);
    }
    return INITIAL_INDUSTRIAL_INVENTORY;
  });

  // Active view tab:
  // 'dashboard' | 'digital-twin' | 'inventory' | 'compatibility' | 'warehouse-planner' | 'emergency' | 'etp' | 'ai-risk' | 'reports'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [qrModalChemical, setQrModalChemical] = useState(null);
  const [detailCompound, setDetailCompound] = useState(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
    } catch (e) {
      console.error('Failed to persist inventory to local storage:', e);
    }
  }, [inventory]);

  // Global Incompatibility count for navbar alert badge
  const globalIncompatibilities = useMemo(() => {
    const res = evaluateMultiChemicalCompatibility(inventory);
    const pairs = res?.pairInteractions || res?.pairAssessments || [];
    return pairs.filter(p => p && p.status === 'RED');
  }, [inventory]);

  // Storage bay conflict violations count
  const bayViolations = useMemo(() => {
    return detectStorageBayViolations(inventory);
  }, [inventory]);

  // Handlers
  const handleAddCompound = (newCompound) => {
    setInventory(prev => [newCompound, ...prev]);
  };

  const handleUpdateCompound = (id, updates) => {
    setInventory(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleDeleteCompound = (id) => {
    if (window.confirm('Are you sure you want to remove this chemical substance from the facility inventory?')) {
      setInventory(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset inventory back to the verified industrial formulary (covering Leather Tanning, Pharma, Cosmetics, and General Chemical)? Custom additions will be replaced.')) {
      setInventory(INITIAL_INDUSTRIAL_INVENTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INDUSTRIAL_INVENTORY));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050a0e] text-slate-100 selection:bg-cyan-500 selection:text-black">
      
      {/* Top Industrial Control Room Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        inventoryCount={inventory.length}
        incompatibleCount={globalIncompatibilities.length}
        bayViolationCount={bayViolations.length}
      />

      {/* Main Container Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Tab 1: Command Center */}
        {activeTab === 'dashboard' && (
          <DashboardOverview
            inventory={inventory}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onSelectChemical={(chem) => setDetailCompound(chem)}
          />
        )}

        {/* Tab 2: 3D Digital Twin (Three.js WebGL Facility) */}
        {activeTab === 'digital-twin' && (
          <ThreeDigitalTwin
            onSelectChemical={(chem) => setDetailCompound(chem)}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Tab 3: Chemical Laboratory & Inventory Management */}
        {activeTab === 'inventory' && (
          <InventoryManager
            inventory={inventory}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenQrModal={(chem) => setQrModalChemical(chem)}
            onSelectCompound={(chem) => setDetailCompound(chem)}
            onDeleteCompound={handleDeleteCompound}
            onUpdateCompound={handleUpdateCompound}
            onResetDefaults={handleResetDefaults}
            onNavigateToCompatibility={() => setActiveTab('compatibility')}
          />
        )}

        {/* Tab 4: Chemical Compatibility Analyzer Engine */}
        {activeTab === 'compatibility' && (
          <CompatibilityChecker
            inventory={inventory}
            onSelectCompoundForDetail={(comp) => setDetailCompound(comp)}
          />
        )}

        {/* Tab 5: 3D Chemical Warehouse Segregation Planner */}
        {activeTab === 'warehouse-planner' && (
          <WarehousePlanner
            inventory={inventory}
            onSelectChemical={(chem) => setDetailCompound(chem)}
          />
        )}

        {/* Tab 6: Industrial Emergency Response Trainer */}
        {activeTab === 'emergency' && (
          <EmergencyResponseTrainer
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Tab 7: Wastewater Treatment (ETP) Simulator */}
        {activeTab === 'etp' && (
          <EtpSimulator
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Tab 8: AI Chemical Risk Intelligence */}
        {activeTab === 'ai-risk' && (
          <AiRiskEngine
            inventory={inventory}
            onSelectChemical={(chem) => setDetailCompound(chem)}
          />
        )}

        {/* Tab 9: Safety Reports & Compliance Analytics */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold uppercase">
                      AUDIT &amp; REGULATORY COMPLIANCE
                    </span>
                    <span className="text-slate-400 text-xs font-mono">OSHA 1910.1200 / EPA RMP / ECHA REACH</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2 mt-1">
                    <FileText className="w-6 h-6 text-cyan-400" />
                    Industrial Safety Dossiers &amp; Analytics
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Generate, preview, and download official chemical safety audits, segregation reports, and emergency drill dossiers.
                  </p>
                </div>

                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:opacity-95 text-slate-950 font-bold text-xs flex items-center space-x-2 transition shadow-lg shadow-cyan-500/20"
                >
                  <FileText className="w-4 h-4" />
                  <span>Configure Custom Audit Report</span>
                </button>
              </div>

              {/* 5 Downloadable Report Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {[
                  {
                    title: 'Chemical Compatibility Audit',
                    code: 'CCA-2026',
                    desc: 'Full pairwise matrix report covering all active inventory substances with CAMEO reactivity flags and reaction equations.',
                    type: 'PDF / CSV',
                    icon: Layers,
                    color: 'text-cyan-400'
                  },
                  {
                    title: 'Warehouse Segregation Plan',
                    code: 'WSP-NFPA400',
                    desc: 'Storage bay allocation audit with adjacent conflict detection, TRGS 510 class segregation, and safety scores.',
                    type: 'PDF / CSV',
                    icon: Building2,
                    color: 'text-emerald-400'
                  },
                  {
                    title: 'Critical Incompatibility Alert File',
                    code: 'CIA-RED',
                    desc: 'Emergency dossier listing all RED-status critical reaction hazards (H2S gas, runaway exotherm, flash fires).',
                    type: 'JSON / CSV',
                    icon: AlertTriangle,
                    color: 'text-red-400'
                  },
                  {
                    title: 'Effluent ETP Compliance Summary',
                    code: 'ETP-EPA',
                    desc: 'Sulfide catalytic oxidation and chromium precipitation kinetic verification against EPA/CPCB industrial limits.',
                    type: 'PDF / Data Table',
                    icon: ShieldCheck,
                    color: 'text-cyan-400'
                  },
                  {
                    title: 'HAZWOPER Emergency Drill Report',
                    code: 'EM-DRILL-06',
                    desc: 'Incident response drill scores, decision trees, chronological action logs, and OSHA commander ratings.',
                    type: 'JSON / Text',
                    icon: Flame,
                    color: 'text-amber-400'
                  }
                ].map((rep, idx) => {
                  const Icon = rep.icon;
                  return (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            {rep.code}
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400">{rep.type}</span>
                        </div>
                        <h4 className="font-bold text-slate-100 text-sm mt-2 flex items-center gap-1.5">
                          <Icon className={`w-4 h-4 ${rep.color}`} />
                          <span>{rep.title}</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{rep.desc}</p>
                      </div>

                      <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition"
                      >
                        <Download className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Download Dossier</span>
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Add Custom Chemical Modal */}
      <AddCompoundModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCompound}
      />

      {/* Container QR Label & Live Bay Audit Modal */}
      <ContainerQrModal
        chemical={qrModalChemical}
        isOpen={!!qrModalChemical}
        onClose={() => setQrModalChemical(null)}
        allInventory={inventory}
      />

      {/* Scientific & Regulatory Audit Report Generator Modal */}
      <ReportGeneratorModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        inventory={inventory}
      />

      {/* Chemical Dossier Slide-Over Inspector */}
      <CompoundDetailModal
        compound={detailCompound}
        isOpen={!!detailCompound}
        onClose={() => setDetailCompound(null)}
      />

      {/* Industrial Control Room Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060c10]/95 backdrop-blur-md py-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="font-bold text-white">CHEM-SHIELD</span>
            <span>•</span>
            <span>Intelligent Chemical Compatibility, 3D Digital Twin & Industrial Safety Platform</span>
          </div>
          <div className="font-mono text-cyan-400 text-[11px] flex items-center space-x-2">
            <span>Three.js WebGL</span>
            <span>•</span>
            <span>NOAA CAMEO</span>
            <span>•</span>
            <span>PubChem PUG REST</span>
            <span>•</span>
            <span>OSHA 1910.1200</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
