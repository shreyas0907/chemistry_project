import React, { useState } from 'react';
import { 
  X, Printer, Download, FileText, FileSpreadsheet, 
  CheckCircle2, ShieldCheck, AlertTriangle, Building2, Calendar 
} from 'lucide-react';
import { detectStorageBayViolations, evaluateMultiChemicalCompatibility } from '../services/chemicalSafetyEngine';

export default function ReportGeneratorModal({ isOpen, onClose, inventory = [] }) {
  const [reportType, setReportType] = useState('inventory'); // 'compatibility' | 'inventory' | 'alerts' | 'segregation' | 'environmental'

  if (!isOpen) return null;

  const timestamp = new Date().toLocaleString();
  const bayViolations = detectStorageBayViolations(inventory);
  const compatibilityAll = evaluateMultiChemicalCompatibility(inventory);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    let headers = [];
    let rows = [];
    let filename = `CHEM-SHIELD_${reportType}_Report_${new Date().toISOString().slice(0, 10)}.csv`;

    if (reportType === 'inventory') {
      headers = ["Chemical Name", "Formula", "CAS Number", "Industry", "Quantity", "Unit", "Location", "Storage Class", "Green Chemistry", "Waste Stream"];
      rows = inventory.map(c => [
        `"${c.name}"`, `"${c.formula}"`, `"${c.cas}"`, `"${c.industry}"`, c.quantity, `"${c.unit}"`, `"${c.storageLocation}"`, `"${c.storageClass}"`, `"${c.greenChemistryRating}"`, `"${c.wasteStream}"`
      ]);
    } else if (reportType === 'compatibility') {
      headers = ["Chemical A", "Chemical B", "Status", "Severity", "Incompatibility Type", "Hazard Title", "Recommended Action", "Authoritative Source"];
      rows = compatibilityAll.pairInteractions.map(p => [
        `"${p.chemA.name}"`, `"${p.chemB.name}"`, `"${p.status}"`, `"${p.severity}"`, `"${p.incompatibilityType}"`, `"${p.hazardTitle.replace(/"/g, '""')}"`, `"${p.segregationAction.replace(/"/g, '""')}"`, `"${p.authoritativeSource}"`
      ]);
    } else if (reportType === 'alerts') {
      headers = ["Location", "Severity", "Description", "Hazard Action Mandate"];
      rows = bayViolations.map(bv => [
        `"${bv.location}"`, `"${bv.severity}"`, `"${bv.totalChemicalsInBay} chemicals in bay"`, `"${bv.recommendation.replace(/"/g, '""')}"`
      ]);
    } else if (reportType === 'segregation') {
      headers = ["Chemical Name", "Location", "Storage Class", "Storage Conditions", "Waste Stream"];
      rows = inventory.map(c => [
        `"${c.name}"`, `"${c.storageLocation}"`, `"${c.storageClass}"`, `"${c.storageConditions}"`, `"${c.wasteStream}"`
      ]);
    } else if (reportType === 'environmental') {
      headers = ["Chemical Name", "Formula", "Persistence", "Bioaccumulation", "Aquatic Toxicity", "Green Chemistry", "Waste Stream"];
      rows = inventory.map(c => [
        `"${c.name}"`, `"${c.formula}"`, `"${c.pbtScore?.persistence}"`, `"${c.pbtScore?.bioaccumulation}"`, `"${c.pbtScore?.toxicity}"`, `"${c.greenChemistryRating}"`, `"${c.wasteStream}"`
      ]);
    }

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b1324] border border-emerald-500/30 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/20 bg-[#070d1a]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Regulatory Safety Report &amp; Audit Document Generator
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Official Compliance Export • EPA / OSHA / IULTCS / USP &lt;800&gt; Aligned
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center space-x-1.5 transition shadow-md shadow-emerald-950"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleDownloadCsv}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center space-x-1.5 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Type Selector Tabs */}
        <div className="px-6 py-3 bg-[#08101e] border-b border-slate-800 flex flex-wrap gap-2 text-xs">
          {[
            { id: 'inventory', label: '1. Chemical Inventory & Location Audit' },
            { id: 'compatibility', label: '2. Multi-Chemical Compatibility Report' },
            { id: 'alerts', label: '3. Storage Incompatibility & Violation Alerts' },
            { id: 'segregation', label: '4. Industrial Segregation & Drum Routing' },
            { id: 'environmental', label: '5. Environmental Eco-Toxicity (PBT) Report' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setReportType(t.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                reportType === t.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Printable Document Body */}
        <div id="printableReport" className="flex-1 overflow-y-auto p-8 space-y-6 bg-white text-slate-900 font-sans">
          
          {/* Document Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  CHEM-SHIELD
                </span>
                <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                  Industrial Safety Platform
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Facility Chemical Safety, Multi-Chemical Reactivity &amp; Segregation Audit
              </p>
            </div>

            <div className="text-right text-xs text-slate-600 space-y-0.5">
              <p><strong>Report Date:</strong> {timestamp}</p>
              <p><strong>Audit Standard:</strong> OSHA 1910.1200 / NFPA 400</p>
              <p><strong>Total Substances:</strong> {inventory.length} Records</p>
            </div>
          </div>

          {/* Report Title */}
          <div>
            <h3 className="text-lg font-extrabold uppercase text-slate-900 tracking-wide">
              {reportType === 'inventory' && 'Chemical Inventory & Facility Storage Manifest'}
              {reportType === 'compatibility' && 'Multi-Chemical Compatibility & Reaction Analysis'}
              {reportType === 'alerts' && 'Storage Incompatibility & Active Violation Audit'}
              {reportType === 'segregation' && 'Industrial Storage Segregation & Waste Stream Protocols'}
              {reportType === 'environmental' && 'Environmental Risk, PBT & Aquatic Ecotoxicity Assessment'}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Authoritative validation powered by NOAA CAMEO Chemicals, US EPA CompTox, and ECHA dossiers.
            </p>
          </div>

          {/* Table Content depending on Report Type */}
          {reportType === 'inventory' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="p-2 border border-slate-300">Chemical Name</th>
                    <th className="p-2 border border-slate-300">Formula</th>
                    <th className="p-2 border border-slate-300">CAS RN</th>
                    <th className="p-2 border border-slate-300">Industry</th>
                    <th className="p-2 border border-slate-300">Quantity</th>
                    <th className="p-2 border border-slate-300">Storage Location</th>
                    <th className="p-2 border border-slate-300">Storage Class</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(c => (
                    <tr key={c.id} className="border-b border-slate-200">
                      <td className="p-2 font-bold text-slate-900">{c.name}</td>
                      <td className="p-2 font-mono text-slate-700">{c.formula}</td>
                      <td className="p-2 font-mono text-slate-700">{c.cas}</td>
                      <td className="p-2 text-slate-700">{c.industry}</td>
                      <td className="p-2 font-mono text-slate-900">{c.quantity} {c.unit}</td>
                      <td className="p-2 text-slate-700">{c.storageLocation}</td>
                      <td className="p-2 font-mono text-slate-800">{c.storageClass}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportType === 'compatibility' && (
            <div className="space-y-3">
              <div className="p-3 rounded bg-slate-100 border border-slate-300 text-xs">
                <strong>Executive Summary: </strong>
                {compatibilityAll.summary} ({compatibilityAll.redCount} Danger Incompatibilities, {compatibilityAll.amberCount} Cautions, {compatibilityAll.greenCount} Compatible Pairs).
              </div>
              <div className="space-y-2">
                {compatibilityAll.pairInteractions.map((pair, idx) => (
                  <div key={idx} className="p-3 rounded border border-slate-300 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span>{pair.chemA.name} + {pair.chemB.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        pair.severity === 'DANGER' ? 'bg-red-100 text-red-800 border border-red-300' :
                        pair.severity === 'CAUTION' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {pair.status}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium">{pair.hazardTitle}</p>
                    <p className="text-slate-600 text-[11px]">{pair.description}</p>
                    <p className="text-slate-800 font-bold text-[11px]">Action: {pair.segregationAction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reportType === 'alerts' && (
            <div className="space-y-3">
              {bayViolations.map((bv, idx) => (
                <div key={idx} className="p-3.5 rounded border border-red-300 bg-red-50 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-red-900">
                    <span>{bv.location}</span>
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px]">{bv.severity}</span>
                  </div>
                  <p className="text-red-800">{bv.recommendation}</p>
                </div>
              ))}
            </div>
          )}

          {reportType === 'segregation' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="p-2 border border-slate-300">Chemical Name</th>
                    <th className="p-2 border border-slate-300">Storage Location</th>
                    <th className="p-2 border border-slate-300">Storage Class</th>
                    <th className="p-2 border border-slate-300">Waste Stream Routing</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(c => (
                    <tr key={c.id} className="border-b border-slate-200">
                      <td className="p-2 font-bold text-slate-900">{c.name}</td>
                      <td className="p-2 text-slate-700">{c.storageLocation}</td>
                      <td className="p-2 font-mono text-slate-800">{c.storageClass}</td>
                      <td className="p-2 text-slate-800 font-medium">{c.wasteStream}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportType === 'environmental' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="p-2 border border-slate-300">Chemical Name</th>
                    <th className="p-2 border border-slate-300">Persistence</th>
                    <th className="p-2 border border-slate-300">Bioaccumulation</th>
                    <th className="p-2 border border-slate-300">Aquatic Toxicity</th>
                    <th className="p-2 border border-slate-300">Green Score</th>
                    <th className="p-2 border border-slate-300">WGK Class</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(c => (
                    <tr key={c.id} className="border-b border-slate-200">
                      <td className="p-2 font-bold text-slate-900">{c.name}</td>
                      <td className="p-2 text-slate-700">{c.pbtScore?.persistence}</td>
                      <td className="p-2 text-slate-700">{c.pbtScore?.bioaccumulation}</td>
                      <td className="p-2 text-slate-700">{c.pbtScore?.toxicity}</td>
                      <td className="p-2 font-bold text-slate-900">{c.greenChemistryRating}</td>
                      <td className="p-2 font-mono text-slate-700">{c.wgkClass || "WGK 1"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Legal & Data Limitation Disclaimer */}
          <div className="pt-4 border-t border-slate-300 text-[10px] text-slate-500 space-y-1">
            <p><strong>Data Limitations &amp; Regulatory Transparency:</strong> CHEM-SHIELD uses authoritative chemical reactivity matrices from NOAA CAMEO, EPA 40 CFR, and OSHA 1910.1200. In industrial hygiene, absence of an incompatibility rule does NOT guarantee safety under extreme conditions (elevated temperature, high pressure, catalytic contaminants). Always verify with official manufacturer Safety Data Sheets (SDS) Section 10 prior to high-volume mixing or co-storage.</p>
            <p>Certified by CHEM-SHIELD Industrial Safety Intelligence System • Confidential Facility Audit Record</p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-[#070d1a] flex items-center justify-between text-xs text-slate-400">
          <span>Official Industrial Safety Audit Manifest</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
}
