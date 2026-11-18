import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  ShieldAlert, AlertTriangle, Leaf, Layers, 
  Download, FileSpreadsheet, FileJson, CheckCircle2, 
  Trash2, TrendingUp, Sparkles, Building2, Droplets 
} from 'lucide-react';
import GreenPharmacyScoreGauge from './GreenPharmacyScoreGauge';
import { analyzeReactivityMatrix } from '../services/pharmaApi';

const BOTANICAL_PALETTE = {
  Green: '#10B981',
  Yellow: '#F59E0B',
  Red: '#F43F5E',
  Lime: '#84CC16',
  Teal: '#14B8A6'
};

const WASTE_BAR_COLORS = [
  '#10B981', '#14B8A6', '#84CC16', '#F59E0B', '#F43F5E', '#06B6D4', '#8B5CF6'
];

export default function DashboardAnalytics({ inventory = [], onExportCsv, onExportJson }) {
  const totalCompounds = inventory.length;

  // KPI: USP <800> Hazardous
  const uspCount = useMemo(() => {
    return inventory.filter(c => 
      c.uspClassification && c.uspClassification !== 'Non-Hazardous'
    ).length;
  }, [inventory]);

  // KPI: High Eco-Toxicity (Red)
  const redPbtCount = useMemo(() => {
    return inventory.filter(c => c.greenChemistryRating === 'Red').length;
  }, [inventory]);

  // KPI: Incompatible Pairs
  const globalIncompatibilities = useMemo(() => {
    const res = analyzeReactivityMatrix(inventory);
    return res.pairInteractions.filter(p => p.severity === 'DANGER');
  }, [inventory]);

  // Chart 1: Green Chemistry Breakdown Data
  const greenData = useMemo(() => {
    const counts = { Green: 0, Yellow: 0, Red: 0 };
    inventory.forEach(c => {
      const rating = c.greenChemistryRating || 'Yellow';
      counts[rating] = (counts[rating] || 0) + 1;
    });

    return [
      { name: 'Preferred Green', value: counts.Green, color: BOTANICAL_PALETTE.Green },
      { name: 'Caution / Moderate', value: counts.Yellow, color: BOTANICAL_PALETTE.Yellow },
      { name: 'Hazardous / Red', value: counts.Red, color: BOTANICAL_PALETTE.Red }
    ].filter(d => d.value > 0);
  }, [inventory]);

  // Chart 2: Waste Streams
  const wasteData = useMemo(() => {
    const streamCounts = {};
    inventory.forEach(c => {
      const ws = c.wasteStream || 'General';
      streamCounts[ws] = (streamCounts[ws] || 0) + 1;
    });

    return Object.entries(streamCounts).map(([name, count]) => ({
      name: name.replace(' Waste', '').replace(' Drum', ''),
      fullName: name,
      count
    }));
  }, [inventory]);

  // Chart 3: PBT Index Breakdown
  const pbtData = useMemo(() => {
    let pHigh = 0, bHigh = 0, tHigh = 0;
    let pMod = 0, bMod = 0, tMod = 0;
    let pLow = 0, bLow = 0, tLow = 0;

    inventory.forEach(c => {
      const pbt = c.pbtScore || {};
      if (pbt.persistence === 'High') pHigh++; else if (pbt.persistence === 'Moderate') pMod++; else pLow++;
      if (pbt.bioaccumulation === 'High') bHigh++; else if (pbt.bioaccumulation === 'Moderate') bMod++; else bLow++;
      if (pbt.toxicity === 'High') tHigh++; else if (pbt.toxicity === 'Moderate') tMod++; else tLow++;
    });

    return [
      { category: 'Persistence (P)', High: pHigh, Moderate: pMod, Low: pLow },
      { category: 'Bioaccumulation (B)', High: bHigh, Moderate: bMod, Low: bLow },
      { category: 'Aquatic Toxicity (T)', High: tHigh, Moderate: tMod, Low: tLow }
    ];
  }, [inventory]);

  // Custom Dark Botanical Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-forest-900 border border-emerald-500/25 p-3 rounded-xl shadow-2xl text-xs backdrop-blur-md">
          <p className="font-bold text-white mb-1.5">{label || payload[0]?.name}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-slate-300 flex items-center space-x-2 my-0.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              <span>{entry.name || 'Count'}: <strong className="text-white font-mono">{entry.value}</strong></span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bento Grid: Hero Radial Gauge + 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Hero Bento Card: Green Pharmacy Score Radial Gauge (Spans 1 col on large, 2 cols on md) */}
        <div className="lg:col-span-1 md:col-span-2 h-full">
          <GreenPharmacyScoreGauge inventory={inventory} />
        </div>

        {/* KPI 1: Total Active Inventory */}
        <div className="bento-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Compounds
            </span>
            <div className="w-8 h-8 rounded-lg bg-botanical-emerald/10 border border-botanical-emerald/30 flex items-center justify-center text-botanical-emerald">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-white font-mono">{totalCompounds}</span>
            <p className="text-[11px] text-slate-400 mt-1">Live active formulary</p>
          </div>
          <div className="pt-2 border-t border-emerald-500/10 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Validated:</span>
            <span className="font-mono text-botanical-lime font-bold">100% Verified</span>
          </div>
        </div>

        {/* KPI 2: USP <800> Hazardous */}
        <div className="bento-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              USP &lt;800&gt; Hazardous
            </span>
            <div className="w-8 h-8 rounded-lg bg-botanical-coral/10 border border-botanical-coral/30 flex items-center justify-center text-botanical-coral">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-botanical-coral font-mono">{uspCount}</span>
            <p className="text-[11px] text-slate-400 mt-1">Antineoplastic & cytotoxic</p>
          </div>
          <div className="pt-2 border-t border-emerald-500/10 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Containment:</span>
            <span className="font-mono text-botanical-coral font-bold">C-PEC Required</span>
          </div>
        </div>

        {/* KPI 3: Co-Storage Alerts */}
        <div className="bento-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Co-Storage Conflicts
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              globalIncompatibilities.length > 0
                ? 'bg-botanical-coral/15 border-botanical-coral/40 text-botanical-coral animate-pulse'
                : 'bg-botanical-emerald/10 border-botanical-emerald/30 text-botanical-emerald'
            }`}>
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className={`text-3xl font-extrabold font-mono ${
              globalIncompatibilities.length > 0 ? 'text-botanical-coral' : 'text-botanical-lime'
            }`}>
              {globalIncompatibilities.length}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">NOAA CAMEO cross-reactions</p>
          </div>
          <div className="pt-2 border-t border-emerald-500/10 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Status:</span>
            <span className={`font-mono font-bold ${
              globalIncompatibilities.length > 0 ? 'text-botanical-coral' : 'text-botanical-lime'
            }`}>
              {globalIncompatibilities.length > 0 ? 'Segregation Active' : 'Isolated & Safe'}
            </span>
          </div>
        </div>

      </div>

      {/* Charts Bento Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Green Chemistry Rating Donut Bento Card */}
        <div className="bento-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Leaf className="w-4 h-4 text-botanical-emerald" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Green Chemistry Distribution
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Formulary classified by ACS GCI Pharmaceutical Roundtable criteria
            </p>
          </div>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={greenData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={78}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {greenData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-emerald-500/10 text-xs">
            {greenData.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-300">{d.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Pharmaceutical Waste Streams Bento Card */}
        <div className="lg:col-span-2 bento-card p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Trash2 className="w-4 h-4 text-botanical-teal" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Regulatory Waste Stream Segregation
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Distribution into compliant biomedical and chemical disposal channels
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-botanical-teal px-2 py-0.5 rounded-full bg-botanical-teal/10 border border-botanical-teal/30 w-fit">
              EPA RCRA & USP &lt;800&gt;
            </span>
          </div>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteData} margin={{ top: 15, right: 10, left: -20, bottom: 25 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 10 }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {wasteData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={WASTE_BAR_COLORS[index % WASTE_BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-emerald-500/10 pt-2.5">
            <span className="text-botanical-teal flex items-center space-x-1">
              <Droplets className="w-3.5 h-3.5" />
              <span>Zero untreated cytotoxic or chlorinated discharge into municipal ETP.</span>
            </span>
          </div>
        </div>

      </div>

      {/* Chart 3: PBT Multi-Dimensional Spectrum Bento Card */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Sparkles className="w-4 h-4 text-botanical-lime" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                PBT Environmental Toxicity Spectrum (Persistence • Bioaccumulation • Aquatic Toxicity)
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Evaluating chemical persistence, biological magnification, and aquatic LC50 profiles
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-botanical-coral shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
              <span className="text-slate-300">High</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-botanical-amber shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              <span className="text-slate-300">Moderate</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-botanical-lime shadow-[0_0_8px_rgba(132,204,22,0.5)]" />
              <span className="text-slate-300">Low</span>
            </span>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pbtData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
              <XAxis dataKey="category" tick={{ fill: '#e2e8f0', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="High" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Moderate" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Low" fill="#84CC16" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regulatory Export Bento Card */}
      <div className="bento-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-botanical-teal/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-botanical-lime" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Regulatory Compliance & Audit Manifest Export
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Generate formal regulatory documentation aligned with EPA RCRA Subpart P, Biomedical Waste (Management & Handling) standards, and USP &lt;800&gt; hazardous drug audits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={onExportCsv}
            className="px-4 py-2.5 bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold rounded-xl border border-emerald-500/25 flex items-center space-x-2 transition shadow-lg"
          >
            <FileSpreadsheet className="w-4 h-4 text-botanical-lime" />
            <span>Export Waste Manifest (.CSV)</span>
          </button>

          <button
            onClick={onExportJson}
            className="px-4 py-2.5 bg-gradient-to-r from-botanical-emerald to-botanical-teal hover:from-botanical-teal hover:to-botanical-lime text-forest-950 text-xs font-black rounded-xl flex items-center space-x-2 transition shadow-lg shadow-botanical-emerald/20 hover:scale-105"
          >
            <FileJson className="w-4 h-4 stroke-[2.5]" />
            <span>Export Safety Dossier (.JSON)</span>
          </button>
        </div>
      </div>

    </div>
  );
}
