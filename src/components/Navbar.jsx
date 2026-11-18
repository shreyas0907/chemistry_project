import React from 'react';
import { 
  ShieldCheck, FlaskConical, Layers, Leaf, 
  BarChart3, Plus, Sparkles, AlertOctagon 
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenAddModal, 
  inventoryCount = 0,
  incompatibleCount = 0 
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#08120E]/90 backdrop-blur-md border-b border-emerald-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-botanical-emerald via-botanical-lime to-botanical-teal flex items-center justify-center text-forest-950 shadow-lg shadow-botanical-emerald/25 font-black">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-white">
                  Pharma<span className="text-botanical-lime">EcoShield</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase bg-botanical-emerald/15 text-botanical-lime border border-botanical-emerald/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  Eco-Bento v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Hospital Pharmacy Safety, CAMEO Reactivity & Green Formularies
              </p>
            </div>
          </div>

          {/* Navigation Tabs Bento Group */}
          <nav className="hidden md:flex items-center space-x-1 bg-forest-900/80 p-1 rounded-2xl border border-emerald-500/15 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
                activeTab === 'inventory'
                  ? 'bg-gradient-to-r from-botanical-emerald to-botanical-teal text-forest-950 shadow-md shadow-botanical-emerald/20'
                  : 'text-slate-400 hover:text-white hover:bg-forest-800/60'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Inventory</span>
              <span className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] ${
                activeTab === 'inventory' ? 'bg-forest-950/40 text-forest-950 font-black' : 'bg-forest-950 text-slate-400'
              }`}>
                {inventoryCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('compatibility')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition relative ${
                activeTab === 'compatibility'
                  ? 'bg-gradient-to-r from-botanical-emerald to-botanical-teal text-forest-950 shadow-md shadow-botanical-emerald/20'
                  : 'text-slate-400 hover:text-white hover:bg-forest-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Reactivity Checker</span>
              {incompatibleCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-botanical-coral animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('green')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
                activeTab === 'green'
                  ? 'bg-gradient-to-r from-botanical-emerald to-botanical-teal text-forest-950 shadow-md shadow-botanical-emerald/20'
                  : 'text-slate-400 hover:text-white hover:bg-forest-800/60'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Green Substitution</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-botanical-emerald to-botanical-teal text-forest-950 shadow-md shadow-botanical-emerald/20'
                  : 'text-slate-400 hover:text-white hover:bg-forest-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Analytics & Compliance</span>
            </button>
          </nav>

          {/* Right Action */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-gradient-to-r from-botanical-emerald via-botanical-lime to-botanical-teal hover:opacity-95 text-forest-950 text-xs font-black rounded-xl flex items-center space-x-1.5 shadow-lg shadow-botanical-emerald/20 transition hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Add Custom Compound</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-emerald-500/10 text-xs">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-2 py-1 rounded font-bold ${activeTab === 'inventory' ? 'text-botanical-lime font-black' : 'text-slate-400'}`}
          >
            Inventory ({inventoryCount})
          </button>
          <button
            onClick={() => setActiveTab('compatibility')}
            className={`px-2 py-1 rounded font-bold ${activeTab === 'compatibility' ? 'text-botanical-lime font-black' : 'text-slate-400'}`}
          >
            Reactivity
          </button>
          <button
            onClick={() => setActiveTab('green')}
            className={`px-2 py-1 rounded font-bold ${activeTab === 'green' ? 'text-botanical-lime font-black' : 'text-slate-400'}`}
          >
            Green
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-2 py-1 rounded font-bold ${activeTab === 'analytics' ? 'text-botanical-lime font-black' : 'text-slate-400'}`}
          >
            Compliance
          </button>
        </div>

      </div>
    </header>
  );
}
