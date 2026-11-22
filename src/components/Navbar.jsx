import React from 'react';
import { 
  ShieldCheck, FlaskConical, Layers, Leaf, 
  BarChart3, Plus, Sparkles, AlertOctagon,
  Building2, SplitSquareVertical, Flame, Bot,
  FileText, Bell
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenAddModal, 
  onOpenReportModal,
  inventoryCount = 0,
  incompatibleCount = 0,
  bayViolationCount = 0
}) {
  const totalAlerts = incompatibleCount + bayViolationCount;

  return (
    <header className="sticky top-0 z-40 bg-[#070e0b]/95 backdrop-blur-md border-b border-emerald-500/20 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center space-x-3 cursor-pointer select-none group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-botanical-emerald via-botanical-lime to-botanical-teal flex items-center justify-center text-forest-950 shadow-lg shadow-botanical-emerald/25 font-black group-hover:scale-105 transition">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-white">
                  CHEM-<span className="text-botanical-lime">SHIELD</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase bg-botanical-emerald/15 text-botanical-lime border border-botanical-emerald/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  Industrial v3.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Chemical Compatibility, Segregation & Industrial Safety Platform
              </p>
            </div>
          </div>

          {/* Navigation Tabs Bento Group - Desktop */}
          <nav className="hidden xl:flex items-center space-x-1 bg-forest-950/80 p-1 rounded-2xl border border-emerald-500/20 backdrop-blur-md">
            
            {/* Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-botanical-emerald to-botanical-teal text-forest-950 shadow-md shadow-botanical-emerald/20'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            {/* Compatibility Engine */}
            <button
              onClick={() => setActiveTab('compatibility')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition relative ${
                activeTab === 'compatibility'
                  ? 'bg-gradient-to-r from-botanical-emerald to-botanical-teal text-forest-950 shadow-md shadow-botanical-emerald/20'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compatibility</span>
              {incompatibleCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>

            {/* Smart Inventory */}
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                activeTab === 'inventory'
                  ? 'bg-gradient-to-r from-botanical-emerald to-botanical-teal text-forest-950 shadow-md shadow-botanical-emerald/20'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Inventory</span>
              <span className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] ${
                activeTab === 'inventory' ? 'bg-forest-950/40 text-forest-950 font-black' : 'bg-forest-900 text-slate-300'
              }`}>
                {inventoryCount}
              </span>
            </button>

            {/* Industry Modules */}
            <button
              onClick={() => setActiveTab('industries')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                activeTab === 'industries'
                  ? 'bg-gradient-to-r from-botanical-emerald to-botanical-teal text-forest-950 shadow-md shadow-botanical-emerald/20'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Industries</span>
            </button>

            {/* Segregation & Bay Audits */}
            <button
              onClick={() => setActiveTab('segregation')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition relative ${
                activeTab === 'segregation'
                  ? 'bg-gradient-to-r from-botanical-emerald to-botanical-teal text-forest-950 shadow-md shadow-botanical-emerald/20'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Segregation</span>
              {bayViolationCount > 0 && (
                <span className="px-1 py-0.2 rounded-full font-mono text-[9px] bg-rose-500 text-white font-bold ml-1">
                  {bayViolationCount}
                </span>
              )}
            </button>

            {/* Accident Simulator */}
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                activeTab === 'simulator'
                  ? 'bg-gradient-to-r from-botanical-emerald to-botanical-teal text-forest-950 shadow-md shadow-botanical-emerald/20'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Accident Sim</span>
            </button>

            {/* AI Assistant */}
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-botanical-emerald to-botanical-teal text-forest-950 shadow-md shadow-botanical-emerald/20'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-botanical-lime" />
              <span>AI Copilot</span>
            </button>

            {/* Environmental & Green */}
            <button
              onClick={() => setActiveTab('environmental')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                activeTab === 'environmental'
                  ? 'bg-gradient-to-r from-botanical-emerald to-botanical-teal text-forest-950 shadow-md shadow-botanical-emerald/20'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-botanical-lime" />
              <span>Eco & Green</span>
            </button>

          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            
            {/* Reports Modal Trigger */}
            <button
              onClick={onOpenReportModal}
              className="px-3 py-2 bg-forest-950 border border-emerald-500/25 hover:border-emerald-500/50 text-slate-200 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition"
              title="Generate Scientific & Regulatory Compliance Reports"
            >
              <FileText className="w-3.5 h-3.5 text-botanical-lime" />
              <span className="hidden md:inline">Audit Reports</span>
            </button>

            {/* Register Chemical Trigger */}
            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-2 bg-gradient-to-r from-botanical-emerald via-botanical-lime to-botanical-teal text-forest-950 text-xs font-black rounded-xl flex items-center space-x-1.5 shadow-lg shadow-botanical-emerald/20 hover:scale-105 transition"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Register Chemical</span>
            </button>

          </div>

        </div>

        {/* Medium and Mobile Navigation Bar */}
        <div className="flex xl:hidden items-center justify-between py-2 border-t border-emerald-500/15 overflow-x-auto text-[11px] font-bold gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-botanical-emerald text-forest-950 font-black' : 'text-slate-400'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('compatibility')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${activeTab === 'compatibility' ? 'bg-botanical-emerald text-forest-950 font-black' : 'text-slate-400'}`}
          >
            Compatibility
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${activeTab === 'inventory' ? 'bg-botanical-emerald text-forest-950 font-black' : 'text-slate-400'}`}
          >
            Inventory ({inventoryCount})
          </button>
          <button
            onClick={() => setActiveTab('industries')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${activeTab === 'industries' ? 'bg-botanical-emerald text-forest-950 font-black' : 'text-slate-400'}`}
          >
            Industries
          </button>
          <button
            onClick={() => setActiveTab('segregation')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${activeTab === 'segregation' ? 'bg-botanical-emerald text-forest-950 font-black' : 'text-slate-400'}`}
          >
            Segregation
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${activeTab === 'simulator' ? 'bg-botanical-emerald text-forest-950 font-black' : 'text-slate-400'}`}
          >
            Accident Sim
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${activeTab === 'ai' ? 'bg-botanical-emerald text-forest-950 font-black' : 'text-slate-400'}`}
          >
            AI Copilot
          </button>
          <button
            onClick={() => setActiveTab('environmental')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${activeTab === 'environmental' ? 'bg-botanical-emerald text-forest-950 font-black' : 'text-slate-400'}`}
          >
            Eco & Green
          </button>
        </div>

      </div>
    </header>
  );
}
