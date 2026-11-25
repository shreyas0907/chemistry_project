import React from 'react';
import { 
  Package, Trash2, Layers, ArrowRight, ShieldCheck, 
  CheckCircle2, QrCode, Factory, AlertTriangle, Zap,
  Clock, Sparkles, FlaskConical
} from 'lucide-react';

export default function HomeOverview({ 
  onNavigate, 
  inventoryCount = 0,
  expiredCount = 0,
  expiringCount = 0
}) {
  return (
    <div className="space-y-8">
      
      {/* 1. Hero Introduction */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span>Industrial Chemical Safety Decision Support System</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Smart Chemical Inventory. <br />
            <span className="text-teal-600">Safer Waste Management.</span> Chemical Intelligence.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            CHEM-SHIELD is an industrial safety platform built to solve real-world problems in chemical manufacturing and processing facilities. Designed with scientific accuracy and ease of operation.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <button
              onClick={() => onNavigate('inventory')}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition flex items-center space-x-2 shadow-sm"
            >
              <Package className="w-4 h-4 text-teal-400" />
              <span>Chemical Inventory</span>
            </button>

            <button
              onClick={() => onNavigate('waste')}
              className="px-5 py-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold transition flex items-center space-x-2 shadow-xs"
            >
              <Trash2 className="w-4 h-4 text-amber-600" />
              <span>Waste Management</span>
            </button>

            <button
              onClick={() => onNavigate('compatibility')}
              className="px-5 py-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold transition flex items-center space-x-2 shadow-xs"
            >
              <Layers className="w-4 h-4 text-teal-600" />
              <span>Compatibility Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. THREE PROMINENT CORE FEATURE CARDS */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Three Core Industrial Modules:
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Chemical Inventory */}
          <div 
            onClick={() => onNavigate('inventory')}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center group-hover:scale-105 transition">
                <Package className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-bold font-mono text-teal-700 uppercase">Feature 1</span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition">
                  Chemical Inventory Management
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Maintain accurate digital stock records with automatic 30-day expiry tracking and QR code container scanning.
              </p>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Real camera QR code container scanning</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Container QR label generation &amp; printing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Automatic expiry status &amp; unusable stock alerts</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
              <span>Open Inventory ({inventoryCount} chemicals)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2: Industry Waste Management */}
          <div 
            onClick={() => onNavigate('waste')}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center group-hover:scale-105 transition">
                <Trash2 className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-bold font-mono text-amber-700 uppercase">Feature 2</span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition">
                  Industry-Specific Waste Management
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated chemical waste identification, segregation rules, and authorized treatment routes for exactly three industries.
              </p>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span><strong>Leather Industry:</strong> Chrome, sulfide, and liming streams</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span><strong>Pharmaceutical Industry:</strong> APIs, solvents, and packaging</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span><strong>Cosmetic Industry:</strong> Surfactants, lipids, and pigments</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
              <span>View Waste Guidance</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3: Chemical Compatibility */}
          <div 
            onClick={() => onNavigate('compatibility')}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center group-hover:scale-105 transition">
                <Layers className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-bold font-mono text-blue-700 uppercase">Feature 3</span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition">
                  Compatibility &amp; Reaction Prediction
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Empirical chemical reaction analysis. Search and select multiple reactants to identify known reaction products and balanced equations.
              </p>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Multiple reactant selection &amp; search</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Verified balanced equations &amp; products</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Authoritative sources (NOAA CAMEO, CRC, NIOSH)</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
              <span>Analyse Reactants</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

        </div>
      </div>

      {/* 3. Operational Integrity & Safety Standards */}
      <div className="p-6 bg-slate-900 rounded-2xl text-white space-y-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-teal-300">
            Industrial Operational Principles
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 pt-1">
          <div>
            <strong className="text-white block mb-0.5">1. Verified Data Only</strong>
            <p className="text-slate-400 leading-relaxed">
              Every reaction and compatibility record is cross-checked against NOAA CAMEO, CRC Handbook, and NIOSH literature. No AI-generated or invented reactions.
            </p>
          </div>
          <div>
            <strong className="text-white block mb-0.5">2. Practical Floor Utility</strong>
            <p className="text-slate-400 leading-relaxed">
              Real QR scanning, container label printing, and 30-day expiry threshold tracking help warehouse operators avoid accidental co-storage and stock obsolescence.
            </p>
          </div>
          <div>
            <strong className="text-white block mb-0.5">3. Regulatory Waste Compliance</strong>
            <p className="text-slate-400 leading-relaxed">
              Standardized identification and authorized disposal routes for Leather, Pharma, and Cosmetic wastes compliant with CPCB/MPCB and EPA RCRA guidelines.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
