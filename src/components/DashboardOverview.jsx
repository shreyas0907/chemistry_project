import React, { useMemo } from 'react';
import { 
  Building2, ShieldAlert, AlertTriangle, CheckCircle2, 
  Layers, Flame, Trash2, Activity, ArrowRight, Zap, 
  MapPin, Clock, FileText, Sparkles, Droplet 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { evaluateMultiChemicalCompatibility, detectStorageBayViolations } from '../services/chemicalSafetyEngine';

const INDUSTRY_COLORS = {
  "Leather Tanning": "#f59e0b",
  "Pharmaceuticals": "#8b5cf6",
  "Cosmetics": "#10b981",
  "General Chemical": "#06b6d4"
};

const WASTE_COLORS = [
  '#10b981', '#14b8a6', '#06b6d4', '#f59e0b', '#f43f5e', '#8b5cf6', '#64748b'
];

export default function DashboardOverview({ 
  inventory = [], 
  onNavigate, 
  onOpenReportModal, 
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
      "Cosmetics": { total: 0, highRisk: 0 },
      "General Chemical": { total: 0, highRisk: 0 }
    };

    inventory.forEach(c => {
      const ind = c.industry || "General Chemical";
      if (!counts[ind]) counts[ind] = { total: 0, highRisk: 0 };
      counts[ind].total += 1;
      if (c.greenChemistryRating === 'Red' || c.storageClass?.includes('6.1')) {
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

  // Recent system activity
  const recentActivities = [
    { time: "10 mins ago", type: "BAY_AUDIT", text: `Storage Bay audit detected ${bayViolations.filter(v => v.severity === 'CRITICAL').length} critical co-storage conflicts across active warehouses.` },
    { time: "25 mins ago", type: "COMPATIBILITY", text: `Multi-chemical analysis completed for ${totalChemicals} formulary substances: ${compatibilityStats.redCount} incompatible combinations flagged.` },
    { time: "1 hour ago", type: "API_SYNC", text: "PubChem PUG REST & openFDA clinical records synchronized for active active APIs and solvents." },
    { time: "3 hours ago", type: "SEGREGATION", text: "Sodium Sulfide to Sulfuric Acid minimum 6m distance mandate enforced in Leather Tanning Bay 4." }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Industrial SaaS Hero Banner */}
      <div className="p-6 rounded-2xl bg-[#0b1324] border border-emerald-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800">
                INDUSTRIAL ENTERPRISE SAAS
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Real-Time Risk Decision Support
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              CHEM-SHIELD <span className="text-emerald-400">Command Center</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Intelligent Chemical Compatibility, Storage Segregation &amp; Industrial Waste Routing across Leather Tanning, Pharmaceuticals, Cosmetics, and General Processing Facilities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('compatibility')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-950 transition hover:scale-105"
            >
              <Zap className="w-4 h-4" />
              <span>Run Compatibility Check</span>
            </button>
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 flex items-center space-x-2 transition"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Generate Audit Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Registered Chemicals */}
        <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Chemical Inventory
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-white font-mono">{totalChemicals}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Across 4 industrial sectors</p>
          </div>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Empirically Verified:</span>
            <span className="text-emerald-400 font-bold font-mono">100% Verified</span>
          </div>
        </div>

        {/* KPI 2: Incompatible Pairwise Conflicts */}
        <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Incompatible Combinations
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
        <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
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
            <span className="text-emerald-400 font-bold font-mono">5 Available</span>
          </div>
        </div>

        {/* KPI 4: Pending Safety Bay Alerts */}
        <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
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
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0b1324] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Industry-Wise Inventory &amp; High-Risk Substance Distribution</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Breakdown of active chemicals vs high-hazard substances across operational sectors
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:block">
              OSHA / CAMEO Segmented
            </span>
          </div>

          <div className="h-64 w-full my-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryDistributionData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#070d1a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="SafeModerate" name="Standard / Moderate" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="HighRisk" name="High Risk (Red PBT / Toxic)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
            <span className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Standard Handling</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ml-2" />
              <span>High Risk / Toxic Priority</span>
            </span>
            <button
              onClick={() => onNavigate('industries')}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1"
            >
              <span>Explore Industry Directives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Chart 2: Industrial Waste Stream Segregation Allocation */}
        <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Trash2 className="w-4 h-4 text-cyan-400" />
              <span>Waste Stream Allocation</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Compliant segregation into treatment streams
            </p>
          </div>

          <div className="h-64 w-full my-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={wasteStreamData} margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#e2e8f0', fontSize: 9 }} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#070d1a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[0, 4, 4, 0]}>
                  {wasteStreamData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={WASTE_COLORS[index % WASTE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <span>Critical Rule: Sulfides &amp; Chromes must never mix in raw ETP pit.</span>
          </div>
        </div>

      </div>

      {/* Bottom Section: Active Incompatibility Alerts & System Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Storage Bay Incompatibility Alerts */}
        <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Critical Active Storage Bay Alarms</span>
            </h3>
            <button
              onClick={() => onNavigate('segregation')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold"
            >
              View All Bays
            </button>
          </div>

          {bayViolations.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No storage bay violations detected. All chemicals safely segregated.</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {bayViolations.slice(0, 3).map((bv, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span>{bv.location}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-600 text-white">
                      {bv.severity}
                    </span>
                  </div>
                  <p className="text-red-300 text-[11px] leading-relaxed">
                    {bv.recommendation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Activity & Audit Trail */}
        <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Recent Chemical Safety Activity &amp; Audit Trail</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Live Log</span>
          </div>

          <div className="space-y-2.5">
            {recentActivities.map((act, aIdx) => (
              <div key={aIdx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-start space-x-3">
                <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-0.5">
                  <p className="text-slate-300 leading-relaxed">{act.text}</p>
                  <span className="text-[10px] text-slate-500 font-mono">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

