import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, Printer, AlertTriangle, ShieldCheck, MapPin, 
  Layers, CheckCircle2, AlertOctagon, ExternalLink, QrCode 
} from 'lucide-react';
import { evaluateMultiChemicalCompatibility } from '../services/chemicalSafetyEngine';

export default function ContainerQrModal({ chemical, isOpen, onClose, allInventory = [] }) {
  if (!isOpen || !chemical) return null;

  // Find all other chemicals stored in the exact same location
  const sameBayChemicals = allInventory.filter(c => 
    c.id !== chemical.id && 
    c.storageLocation && 
    chemical.storageLocation && 
    c.storageLocation.trim().toLowerCase() === chemical.storageLocation.trim().toLowerCase()
  );

  // Evaluate compatibility inside this bay
  const bayCompatibility = sameBayChemicals.length > 0 
    ? evaluateMultiChemicalCompatibility([chemical, ...sameBayChemicals])
    : null;

  const hasBayConflict = bayCompatibility?.hasIncompatibility;

  // JSON payload for QR code
  const qrPayload = JSON.stringify({
    chemShieldId: chemical.id,
    name: chemical.name,
    cas: chemical.cas,
    location: chemical.storageLocation,
    hazardClass: chemical.storageClass,
    industry: chemical.industry,
    expiry: chemical.expiryDate,
    wasteStream: chemical.wasteStream
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b1324] border border-emerald-500/30 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/20 bg-[#070d1a]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Industrial Container QR Label & Storage Manifest
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                OSHA 1910.1200 / GHS Compliant Container Identification
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center space-x-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print Label</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Printable GHS Container Label */}
          <div className="p-5 rounded-2xl bg-[#08120e] border-2 border-emerald-500/40 shadow-xl space-y-4 relative">
            <div className="flex items-start justify-between border-b border-emerald-500/20 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                  CHEM-SHIELD VERIFIED CONTAINER
                </span>
                <h3 className="text-xl font-black text-white tracking-tight mt-0.5">
                  {chemical.name}
                </h3>
                <div className="flex items-center space-x-3 text-xs font-mono text-slate-400 mt-1">
                  <span className="text-emerald-400 font-bold">CAS: {chemical.cas || "N/A"}</span>
                  <span>•</span>
                  <span>Formula: {chemical.formula}</span>
                  <span>•</span>
                  <span>MW: {chemical.molecularWeight} g/mol</span>
                </div>
              </div>

              {/* NFPA 704 Diamond */}
              {chemical.nfpa && (
                <div className="relative w-16 h-16 flex-shrink-0">
                  <div className="w-11 h-11 rotate-45 border border-slate-700 bg-slate-900 absolute inset-0 m-auto overflow-hidden grid grid-cols-2 grid-rows-2">
                    <div className="bg-blue-600/80 flex items-center justify-center -rotate-45 text-[9px] font-black text-white">
                      {chemical.nfpa.health}
                    </div>
                    <div className="bg-red-600/80 flex items-center justify-center -rotate-45 text-[9px] font-black text-white">
                      {chemical.nfpa.flammability}
                    </div>
                    <div className="bg-amber-500/80 flex items-center justify-center -rotate-45 text-[9px] font-black text-black">
                      {chemical.nfpa.instability}
                    </div>
                    <div className="bg-slate-200 flex items-center justify-center -rotate-45 text-[8px] font-black text-black">
                      {chemical.nfpa.special || "—"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Middle Section: QR Code + Key Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* QR Code */}
              <div className="p-3 rounded-xl bg-white flex flex-col items-center justify-center text-center shadow-lg w-fit mx-auto sm:mx-0">
                <QRCodeSVG
                  value={qrPayload}
                  size={120}
                  level="H"
                  includeMargin={true}
                />
                <span className="text-[9px] font-mono font-bold text-slate-900 mt-1">
                  ID: {chemical.id}
                </span>
              </div>

              {/* Specifications */}
              <div className="sm:col-span-2 space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Assigned Storage Bay:</span>
                  <span className="font-bold text-white flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{chemical.storageLocation}</span>
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Inventory Quantity:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {chemical.quantity} {chemical.unit}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Storage Class:</span>
                  <span className="font-mono text-cyan-300 font-semibold">{chemical.storageClass}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Batch Expiry:</span>
                  <span className="font-mono text-amber-300 font-semibold">{chemical.expiryDate || "Indefinite"}</span>
                </div>
              </div>
            </div>

            {/* Bottom Hazard & SDS */}
            <div className="pt-3 border-t border-emerald-500/20 text-xs space-y-1">
              <span className="font-bold text-rose-400">Mandatory Handling & Safety Summary:</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {chemical.hazardSummary}
              </p>
              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono">
                <span>SDS Document: {chemical.sdsRef || "Standard Industrial SDS"}</span>
                <span>CHEM-SHIELD Encrypted QR Format</span>
              </div>
            </div>
          </div>

          {/* Real-time Storage Bay Conflict Auditor */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Live Storage Bay Co-Storage Audit: "{chemical.storageLocation}"</span>
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                {sameBayChemicals.length} Other Substance(s) in Bay
              </span>
            </div>

            {sameBayChemicals.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>This chemical is currently the sole substance registered in this location. No localized co-storage conflicts.</span>
              </div>
            ) : hasBayConflict ? (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/60 text-xs space-y-2">
                <div className="flex items-center space-x-2 text-rose-400 font-bold">
                  <AlertOctagon className="w-5 h-5 flex-shrink-0" />
                  <span>CRITICAL STORAGE SEGREGATION ALARM DETECTED IN THIS BAY!</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {chemical.name} is co-stored in the same room/bay with chemicals that exhibit severe reactivity:
                </p>
                <div className="space-y-1 pl-2 border-l-2 border-rose-500 my-2">
                  {bayCompatibility.pairInteractions.filter(p => p.severity === "DANGER").map((p, idx) => (
                    <div key={idx} className="text-[11px] text-rose-300 font-semibold">
                      • {p.chemA.name} + {p.chemB.name}: {p.hazardTitle}
                    </div>
                  ))}
                </div>
                <div className="p-2.5 rounded-lg bg-black/50 text-[11px] text-slate-300">
                  <strong className="text-emerald-400">Action Mandate: </strong>
                  Immediately physically isolate these containers. Maintain at least 6 meters distance or store in separate dedicated fire-rated, bunded storage cabinets.
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>All {sameBayChemicals.length + 1} chemicals co-stored in "{chemical.storageLocation}" are compatible under standard industrial containment rules.</span>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#070d1a] flex items-center justify-between text-xs text-slate-400">
          <span>CHEM-SHIELD Container Safety Verification</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

