import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import DashboardOverview from './components/DashboardOverview';
import CompatibilityChecker from './components/CompatibilityChecker';
import InventoryManager from './components/InventoryManager';
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

const STORAGE_KEY = 'chem_shield_industrial_inventory_v3';

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
      console.warn('Could not read local storage, using initial industrial formulary:', e);
    }
    return INITIAL_INDUSTRIAL_INVENTORY;
  });

  // Active view tab: 'dashboard' | 'compatibility' | 'inventory' | 'industries' | 'segregation' | 'simulator' | 'ai' | 'environmental'
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
    <div className="min-h-screen flex flex-col bg-[#070e0b] text-slate-100 selection:bg-emerald-500 selection:text-black">
      
      {/* Top Industrial Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        inventoryCount={inventory.length}
        incompatibleCount={globalIncompatibilities.length}
        bayViolationCount={bayViolations.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Tab 1: Dashboard Command Center */}
        {activeTab === 'dashboard' && (
          <DashboardOverview
            inventory={inventory}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onSelectChemical={(chem) => setDetailCompound(chem)}
          />
        )}

        {/* Tab 2: Chemical Compatibility Engine */}
        {activeTab === 'compatibility' && (
          <CompatibilityChecker
            inventory={inventory}
            onSelectCompoundForDetail={(comp) => setDetailCompound(comp)}
          />
        )}

        {/* Tab 3: Smart Chemical Inventory & Storage Bays */}
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

        {/* Tab 4: Industry Specific Modules */}
        {activeTab === 'industries' && (
          <IndustryModules
            inventory={inventory}
            onSelectChemical={(chem) => setDetailCompound(chem)}
          />
        )}

        {/* Tab 5: Industrial Segregation & Bay Audit */}
        {activeTab === 'segregation' && (
          <SegregationSystem
            inventory={inventory}
            onSelectChemical={(chem) => setDetailCompound(chem)}
          />
        )}

        {/* Tab 6: Industrial Accident Simulator */}
        {activeTab === 'simulator' && (
          <AccidentSimulator />
        )}

        {/* Tab 7: AI Safety Assistant Copilot */}
        {activeTab === 'ai' && (
          <AiSafetyAssistant
            inventory={inventory}
          />
        )}

        {/* Tab 8: Environmental & Green Chemistry */}
        {activeTab === 'environmental' && (
          <EnvironmentalModule
            inventory={inventory}
            onAddCompound={handleAddCompound}
          />
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

      {/* Industrial Footer */}
      <footer className="border-t border-emerald-500/15 bg-[#050b08]/90 backdrop-blur-md py-5 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="font-bold text-white">CHEM-SHIELD</span>
            <span>•</span>
            <span>Intelligent Chemical Compatibility, Segregation & Industrial Safety Platform</span>
          </div>
          <div className="font-mono text-botanical-lime text-[11px] flex items-center space-x-2">
            <span>NOAA CAMEO</span>
            <span>•</span>
            <span>PubChem PUG REST</span>
            <span>•</span>
            <span>EPA AwSV WGK</span>
            <span>•</span>
            <span>OSHA 1910.1200</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
