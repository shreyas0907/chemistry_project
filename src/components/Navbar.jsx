import React from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Box, 
  FlaskConical, 
  Layers, 
  Building2, 
  Flame, 
  Droplets, 
  Brain, 
  FileText, 
  Plus, 
  AlertOctagon, 
  Siren, 
  Bell 
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

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'digital-twin', label: '3D Digital Twin', icon: Box, badge: 'WebGL' },
    { id: 'inventory', label: 'Chemical Laboratory', icon: FlaskConical, count: inventoryCount },
    { id: 'compatibility', label: 'Compatibility Analyzer', icon: Layers, alert: incompatibleCount > 0 },
    { id: 'warehouse-planner', label: 'Warehouse Planner', icon: Building2, alert: bayViolationCount > 0 },
    { id: 'emergency', label: 'Emergency Response', icon: Flame, badge: 'Drill' },
    { id: 'etp', label: 'ETP Simulator', icon: Droplets, badge: 'Kinetics' },
    { id: 'ai-risk', label: 'AI Risk Intelligence', icon: Brain },
    { id: 'reports', label: 'Reports & Analytics', icon: FileText }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#060c10]/95 backdrop-blur-md border-b border-cyan-500/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center space-x-3 cursor-pointer select-none group flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-cyan-300 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20 font-black group-hover:scale-105 transition">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white font-sans">
                  CHEM-<span className="text-cyan-400">SHIELD</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 font-mono">
                  3D TWIN v4.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden md:block">
                Industrial Safety & Simulation Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation Scrollable Strip */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-950/90 p-1 rounded-2xl border border-slate-800/80 backdrop-blur-md overflow-x-auto max-w-[62%]">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all whitespace-nowrap relative ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>

                  {item.count !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full font-mono text-[9px] ${
                      isActive ? 'bg-slate-950/30 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
                    }`}>
                      {item.count}
                    </span>
                  )}

                  {item.badge && !isActive && (
                    <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-slate-900 text-cyan-300 border border-cyan-800/40">
                      {item.badge}
                    </span>
                  )}

                  {item.alert && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons Right Strip */}
          <div className="flex items-center space-x-2">
            
            {/* Alert Indicator */}
            {totalAlerts > 0 && (
              <button
                onClick={() => setActiveTab('compatibility')}
                className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-mono font-bold hover:bg-red-900/60 transition"
                title={`${incompatibleCount} incompatibilities & ${bayViolationCount} storage bay violations active`}
              >
                <AlertOctagon className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span>{totalAlerts} ALERTS</span>
              </button>
            )}

            {/* Quick Add Substance */}
            <button
              onClick={onOpenAddModal}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Register Chemical</span>
            </button>

            {/* Quick Export Report */}
            <button
              onClick={onOpenReportModal}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:opacity-95 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow-lg shadow-cyan-500/20"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Audit Dossier</span>
            </button>

          </div>

        </div>

        {/* Mobile / Tablet Scrollable Secondary Subnav */}
        <div className="flex lg:hidden items-center space-x-1.5 py-2 overflow-x-auto border-t border-slate-900">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1 whitespace-nowrap shrink-0 transition ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-900'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
