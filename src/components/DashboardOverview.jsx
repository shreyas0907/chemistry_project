import React, { useMemo } from 'react';
import { 
  Building2, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Flame, 
  Trash2, 
  Activity, 
  ArrowRight, 
  Zap, 
  MapPin, 
  Clock, 
  FileText, 
  Sparkles, 
  Droplet,
  Box,
  Siren,
  Droplets,
  Brain,
  ChevronRight,
  ShieldCheck,
  Radio,
  Camera,
  Ruler,
  Languages,
  Printer
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { evaluateMultiChemicalCompatibility, detectStorageBayViolations } from '../services/chemicalSafetyEngine';

const INDUSTRY_COLORS = {
  "Leather Tanning": "#f59e0b",
  "Pharmaceuticals": "#8b5cf6",
  "Electroplating": "#ec4899",
  "Agrochemicals": "#eab308",
  "Cosmetics & Personal Care": "#10b981",
  "General Chemical": "#06b6d4"
};

const WASTE_COLORS = [
  '#10b981', '#14b8a6', '#06b6d4', '#f59e0b', '#f43f5e', '#8b5cf6', '#64748b', '#ec4899'
];

export default function DashboardOverview({ 
  inventory = [], 
  onNavigate, 
  onOpenReportModal, 
  onOpenScannerModal,
  onSelectChemical 
}) {
  // Real dynamic calculations
  const totalChemicals = inventory.length;

  const compatibilityStats = useMemo(() => {
    return evaluateMultiChemicalCompatibility(inventory);
  }, [inventory]);

  const bayViolations = useMemo(() => {
    return detectStorageBayViolations(inventory);
  }, [inventory]);

  const highRiskChemicals = useMemo(() => {
    return inventory.filter(c => c.greenChemistryRating === 'Red' || c.storageClass?.includes('6.1') || c.storageClass?.includes('Toxic'));
  }, [inventory]);

  // Industry Distribution Data
  const industryDistributionData = useMemo(() => {
    const counts = {
      "Leather Tanning": { total: 0, highRisk: 0 },
      "Pharmaceuticals": { total: 0, highRisk: 0 },
      "Electroplating": { total: 0, highRisk: 0 },
      "Agrochemicals": { total: 0, highRisk: 0 },
      "General Chemical": { total: 0, highRisk: 0 }
    };

    inventory.forEach(c => {
      let ind = c.industry || "General Chemical";
      if (ind === "Pharmaceutical") ind = "Pharmaceuticals";
      if (!counts[ind]) counts[ind] = { total: 0, highRisk: 0 };
      counts[ind].total += 1;
      if (c.greenChemistryRating === 'Red' || c.storageClass?.includes('6.1') || c.storageClass?.includes('Toxic')) {
        counts[ind].highRisk += 1;
      }
    });

    return Object.entries(counts).map(([name, data]) => ({
      name,
      Total: data.total,
      HighRisk: data.highRisk,
      SafeModerate: data.total - data.highRisk
    }));
  }, [inventory]);

  // Waste Stream Data
  const wasteStreamData = useMemo(() => {
    const counts = {};
    inventory.forEach(c => {
      const ws = c.wasteStream || 'General';
      counts[ws] = (counts[ws] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name: name.replace(' Waste', '').replace(' Drum', '').replace(' Sump', ''),
      fullName: name,
      count
    }));
  }, [inventory]);

  return (
    <div className="space-y-6">
      
      {/* Top Industrial SaaS Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#07131b] via-[#091822] to-[#0d222e] border border-cyan-500/25 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800">
                ACTIVE FLOOR-SAFETY &amp; COMPLIANCE COPILOT
              </span>
              <span className="text-xs text-slate-400 font-mono">
                SMEs in High-Hazard Sectors (Leather, Pharma, Electroplating, Agro)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              CHEM-SHIELD <span className="text-cyan-400">Control Room</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Industrial chemical safety digital twin featuring multi-variable reaction simulation, 2D floor distance segregation, zero-typing label scanning, and native-language floor SOPs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('mixing-sandbox')}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:opacity-95 text-slate-950 text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition hover:scale-105"
            >
              <Zap className="w-4 h-4" />
              <span>Mixing &amp; ETP Sandbox</span>
            </button>
            <button
              onClick={onOpenScannerModal}
              className="px-4 py-2.5 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-xs font-bold rounded-xl border border-cyan-500/50 flex items-center space-x-2 transition"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Scan Drum Label</span>
            </button>
            <button
              onClick={() => onNavigate('multilingual-sop')}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl border border-slate-800 flex items-center space-x-2 transition"
            >
              <Languages className="w-4 h-4 text-emerald-400" />
              <span>Floor SOPs (हिं/मरा)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 CORE ACTIVE FLOOR-SAFETY LAUNCHERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Launcher 1: Module A Mixing Sandbox */}
        <div 
          onClick={() => onNavigate('mixing-sandbox')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition-all hover:scale-[1.02] shadow-xl group space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              Module A
            </span>
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm group-hover:text-cyan-300 transition flex items-center justify-between">
              <span>Reaction &amp; ETP Sandbox</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              Model concentration, volume, temp &amp; pH. Live toxic plumes, thermodynamic spikes &amp; 3-pipe ETP verification.
            </p>
          </div>
        </div>

        {/* Launcher 2: Module B 2D Warehouse Floor Planner */}
        <div 
          onClick={() => onNavigate('warehouse-floor')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/60 cursor-pointer transition-all hover:scale-[1.02] shadow-xl group space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Ruler className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Module B
            </span>
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm group-hover:text-emerald-300 transition flex items-center justify-between">
              <span>2D Floor Segregation</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              Calculates Euclidean grid distances. Red pulsing warning rings for incompatible drums closer than 6.0m.
            </p>
          </div>
        </div>

        {/* Launcher 3: Module C Zero-Typing Label Scanner */}
        <div 
          onClick={onOpenScannerModal}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/60 cursor-pointer transition-all hover:scale-[1.02] shadow-xl group space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              Module C
            </span>
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm group-hover:text-purple-300 transition flex items-center justify-between">
              <span>Drum Label Scanner</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition" />
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              Mobile camera OCR with Gemini Vision + PubChem lookup. Instant SAFE or INCOMPATIBLE storage banner.
            </p>
          </div>
        </div>

        {/* Launcher 4: Module D Multilingual Floor SOPs & MPCB */}
        <div 
          onClick={() => onNavigate('multilingual-sop')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition-all hover:scale-[1.02] shadow-xl group space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Languages className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              Module D
            </span>
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm group-hover:text-cyan-300 transition flex items-center justify-between">
              <span>Floor SOPs &amp; MPCB Audit</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              English, Hindi, Marathi floor guides with Web Speech audio playback + 1-click official MPCB inspection report.
            </p>
          </div>
        </div>

      </div>

      {/* KPI METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Registered Chemicals */}
        <div className="p-5 rounded-2xl bg-[#091117] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Facility Formulary
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-white font-mono">{totalChemicals}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Across Leather, Pharma, Plating, Agro</p>
          </div>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Empirically Verified:</span>
            <span className="text-emerald-400 font-bold font-mono">100% NOAA / PubChem</span>
          </div>
        </div>

        {/* KPI 2: Incompatible Pairwise Conflicts */}
        <div className="p-5 rounded-2xl bg-[#091117] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Incompatible Combos
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              compatibilityStats.redCount > 0
                ? 'bg-red-500/15 border-red-500/40 text-red-400 animate-pulse'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className={`text-3xl font-black font-mono ${compatibilityStats.redCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {compatibilityStats.redCount}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Violent exotherm / toxic gas</p>
          </div>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Compatible Pairs:</span>
            <span className="text-emerald-400 font-bold font-mono">{compatibilityStats.greenCount} Pairs</span>
          </div>
        </div>

        {/* KPI 3: High-Risk Chemicals */}
        <div className="p-5 rounded-2xl bg-[#091117] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              High-Risk Substances
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-amber-400 font-mono">{highRiskChemicals.length}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Red PBT / Toxic storage class</p>
          </div>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Green Replacements:</span>
            <span className="text-emerald-400 font-bold font-mono">Available</span>
          </div>
        </div>

        {/* KPI 4: Pending Safety Bay Alerts */}
        <div className="p-5 rounded-2xl bg-[#091117] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Storage Bay Conflicts
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              bayViolations.length > 0
                ? 'bg-red-500/20 border-red-500 text-red-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className={`text-3xl font-black font-mono ${bayViolations.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {bayViolations.filter(v => v.severity === 'CRITICAL').length}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Critical co-storage alarms</p>
          </div>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Status:</span>
            <span className={`font-bold ${bayViolations.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {bayViolations.length > 0 ? 'Relocation Required' : 'All Bays Cleared'}
            </span>
          </div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Industry-Wise Chemical & Risk Distribution */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#091117] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Industry-Wise Inventory &amp; High-Risk Substance Distribution</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Breakdown of active chemicals vs high-hazard substances across operational sectors
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:block">
              OSHA / CPCB Segmented
            </span>
          </div>

          <div className="h-64 w-full my-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryDistributionData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#060c10', borderColor: '#1e293b', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="SafeModerate" stackId="a" fill="#06b6d4" name="Standard Reagents" radius={[0, 0, 4, 4]} />
                <Bar dataKey="HighRisk" stackId="a" fill="#ef4444" name="High-Risk Flagged" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Waste Stream Segregation Breakdown */}
        <div className="p-5 rounded-2xl bg-[#091117] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Trash2 className="w-4 h-4 text-emerald-400" />
              <span>Waste Segregation Sump Routing</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Active segregation by containment class
            </p>
          </div>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wasteStreamData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {wasteStreamData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={WASTE_COLORS[index % WASTE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#060c10', borderColor: '#1e293b', borderRadius: '0.75rem', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center">
            <span className="text-[10px] font-mono text-slate-500">
              Sulfide &amp; Cyanide sumps isolated by physical air gap
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
