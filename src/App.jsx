import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeOverview from './components/HomeOverview';
import InventoryModule from './components/InventoryModule';
import IndustryWasteModule from './components/IndustryWasteModule';
import CompatibilityModule from './components/CompatibilityModule';
import { INITIAL_INDUSTRIAL_INVENTORY } from './data/industryChemicals';
import { ShieldCheck, Package, Trash2, Layers } from 'lucide-react';

const STORAGE_KEY = 'chem_shield_inventory_v8_redesign_core3';

// Enriches baseline chemicals with realistic batch numbers and expiry mix
function getInitialInventoryWithExpiryMix() {
  const today = new Date();
  
  return INITIAL_INDUSTRIAL_INVENTORY.map((chem, idx) => {
    let expDate = chem.expiryDate || '2027-12-31';
    
    // Inject a realistic spread: 
    // Chemicals at index 3 and 7 are expired
    // Chemicals at index 1 and 5 are expiring soon (within 20 days)
    if (idx === 3) {
      const past = new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000);
      expDate = past.toISOString().split('T')[0];
    } else if (idx === 7) {
      const past = new Date(today.getTime() - 120 * 24 * 60 * 60 * 1000);
      expDate = past.toISOString().split('T')[0];
    } else if (idx === 1) {
      const soon = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
      expDate = soon.toISOString().split('T')[0];
    } else if (idx === 5) {
      const soon = new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000);
      expDate = soon.toISOString().split('T')[0];
    }

    return {
      ...chem,
      batchNumber: chem.batchNumber || chem.sdsRef || `LOT-2024-${String(idx + 101).padStart(3, '0')}`,
      purchaseDate: chem.purchaseDate || '2024-03-15',
      expiryDate: expDate,
      qrIdentifier: `CS-LOT-${chem.id.slice(-6).toUpperCase()}`
    };
  });
}

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
      console.warn('Could not load localStorage inventory, falling back to verified baseline:', e);
    }
    return getInitialInventoryWithExpiryMix();
  });

  // Active view tab: ONLY 'home' | 'inventory' | 'waste' | 'compatibility'
  const [activeTab, setActiveTab] = useState('home');

  // Sync inventory changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
    } catch (e) {
      console.error('Failed to persist inventory state to localStorage:', e);
    }
  }, [inventory]);

  // Inventory CRUD Handlers
  const handleAddChemical = (newChem) => {
    setInventory(prev => [newChem, ...prev]);
  };

  const handleUpdateChemical = (id, updates) => {
    setInventory(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleDeleteChemical = (id) => {
    setInventory(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      
      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 0: Homepage Executive Overview */}
        {activeTab === 'home' && (
          <HomeOverview
            onNavigate={(tab) => setActiveTab(tab)}
            inventoryCount={inventory.length}
          />
        )}

        {/* VIEW 1: Chemical Inventory Management with QR Scanning */}
        {activeTab === 'inventory' && (
          <InventoryModule
            inventory={inventory}
            onAddChemical={handleAddChemical}
            onUpdateChemical={handleUpdateChemical}
            onDeleteChemical={handleDeleteChemical}
          />
        )}

        {/* VIEW 2: Industry-Specific Waste Management (Leather, Pharma, Cosmetics) */}
        {activeTab === 'waste' && (
          <IndustryWasteModule />
        )}

        {/* VIEW 3: Chemical Compatibility and Reaction Product Prediction */}
        {activeTab === 'compatibility' && (
          <CompatibilityModule />
        )}

      </main>

      {/* Industrial Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center text-teal-400 font-bold text-[10px]">
              CS
            </div>
            <span className="font-semibold text-slate-800">CHEM-SHIELD</span>
            <span>•</span>
            <span>Smart Chemical Inventory &bull; Safer Waste Management &bull; Chemical Intelligence</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] font-mono">
            <span>OSHA 1910.1200</span>
            <span>•</span>
            <span>CPCB / MPCB Waste Rules</span>
            <span>•</span>
            <span>NOAA CAMEO Reference</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
