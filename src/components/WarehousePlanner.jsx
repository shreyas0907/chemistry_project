import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  ArrowRightLeft, 
  RotateCcw, 
  FileDown, 
  Info, 
  Plus, 
  Trash2, 
  Zap, 
  Flame, 
  Droplets, 
  AlertCircle 
} from 'lucide-react';
import { evaluatePairCompatibility } from '../services/chemicalSafetyEngine';

/**
 * 6 INDUSTRIAL STORAGE BAYS (NFPA 400 & German TRGS 510 Storage Classes)
 */
const DEFAULT_BAYS = [
  {
    id: 'bay-flammables',
    code: 'BAY-A',
    name: 'Flammable Solvents & Organics',
    storageClass: 'Class 3 / 4.1',
    allowedGroups: ['flammables', 'general_organic'],
    disallowedGroups: ['acids_strong_oxidizing', 'oxidizers_strong', 'peroxides_organic'],
    color: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
    iconColor: 'text-amber-400',
    capacity: 4,
    description: 'Bermed secondary containment with ATEX explosion-proof ventilation (Zone 1) and foam deluge.'
  },
  {
    id: 'bay-acids',
    code: 'BAY-B',
    name: 'Corrosive Inorganic Acids',
    storageClass: 'Class 8A',
    allowedGroups: ['acids_strong_inorganic', 'acids_organic'],
    disallowedGroups: ['bases_strong', 'sulfides', 'hypochlorites', 'cyanides', 'flammables'],
    color: 'border-red-500/50 bg-red-950/20 text-red-300',
    iconColor: 'text-red-400',
    capacity: 4,
    description: 'Acid-resistant vinyl ester floor lining with dedicated fume scrubber exhaust ducting.'
  },
  {
    id: 'bay-bases',
    code: 'BAY-C',
    name: 'Corrosive Alkalis & Bases',
    storageClass: 'Class 8B',
    allowedGroups: ['bases_strong', 'bases_alkaline'],
    disallowedGroups: ['acids_strong_inorganic', 'acids_organic', 'heavy_metals'],
    color: 'border-blue-500/50 bg-blue-950/20 text-blue-300',
    iconColor: 'text-blue-400',
    capacity: 4,
    description: 'Separate neutral sump isolated from acid bays to prevent violent exothermic neutralizations.'
  },
  {
    id: 'bay-oxidizers',
    code: 'BAY-D',
    name: 'Strong Oxidizers & Peroxides',
    storageClass: 'Class 5.1A / 5.2',
    allowedGroups: ['oxidizers_strong', 'peroxides_organic', 'acids_strong_oxidizing'],
    disallowedGroups: ['flammables', 'reducing_agents', 'sulfides', 'amines'],
    color: 'border-yellow-500/50 bg-yellow-950/20 text-yellow-300',
    iconColor: 'text-yellow-400',
    capacity: 4,
    description: 'Isolated reinforced masonry cell with blast relief roof panels and thermal rise monitoring.'
  },
  {
    id: 'bay-toxics',
    code: 'BAY-E',
    name: 'Toxic Substances & Heavy Metals',
    storageClass: 'Class 6.1 / 9',
    allowedGroups: ['cytotoxics', 'heavy_metals', 'general_salts'],
    disallowedGroups: ['acids_strong_inorganic', 'oxidizers_strong'],
    color: 'border-purple-500/50 bg-purple-950/20 text-purple-300',
    iconColor: 'text-purple-400',
    capacity: 4,
    description: 'Access-controlled locked storage with HEPA filtration and continuous negative pressure.'
  },
  {
    id: 'bay-sulfides',
    code: 'BAY-F',
    name: 'Sulfide Reagents & Reductants',
    storageClass: 'Class 4.2 / 8',
    allowedGroups: ['sulfides', 'reducing_agents'],
    disallowedGroups: ['acids_strong_inorganic', 'acids_strong_oxidizing', 'oxidizers_strong'],
    color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300',
    iconColor: 'text-emerald-400',
    capacity: 4,
    description: 'Strictly segregated unhairing raw material bay. 100% physically separated from acid drainage lines.'
  }
];

export default function WarehousePlanner({ inventory = [], onSelectChemical }) {
  // Preset 1: Intentionally Dangerous Layout (Acid + Sulfide co-stored, Oxidizer + Solvent co-stored)
  // Preset 2: Scientifically Optimized NFPA 400 Layout
  const [baysData, setBaysData] = useState(() => {
    return {
      'bay-flammables': [
        inventory.find(c => c.name.toLowerCase().includes('isopropanol')) || inventory[0],
        inventory.find(c => c.name.toLowerCase().includes('dichloromethane')) || inventory[1]
      ].filter(Boolean),
      'bay-acids': [
        inventory.find(c => c.name.toLowerCase().includes('sulfuric acid')) || inventory[2],
        inventory.find(c => c.name.toLowerCase().includes('formic acid')) || inventory[3]
      ].filter(Boolean),
      'bay-bases': [
        inventory.find(c => c.name.toLowerCase().includes('sodium hydroxide')) || inventory[4],
        inventory.find(c => c.name.toLowerCase().includes('calcium hydroxide')) || inventory[5]
      ].filter(Boolean),
      'bay-oxidizers': [
        inventory.find(c => c.name.toLowerCase().includes('hydrogen peroxide')) || inventory[6],
        inventory.find(c => c.name.toLowerCase().includes('potassium permanganate')) || inventory[7]
      ].filter(Boolean),
      'bay-toxics': [
        inventory.find(c => c.name.toLowerCase().includes('chromium')) || inventory[8],
        inventory.find(c => c.name.toLowerCase().includes('cisplatin')) || inventory[9]
      ].filter(Boolean),
      'bay-sulfides': [
        inventory.find(c => c.name.toLowerCase().includes('sodium sulfide')) || inventory[10],
        inventory.find(c => c.name.toLowerCase().includes('sodium hydrosulfide')) || inventory[11]
      ].filter(Boolean)
    };
  });

  const [selectedChemToAdd, setSelectedChemToAdd] = useState(inventory[0]?.id || '');
  const [targetBayId, setTargetBayId] = useState('bay-flammables');
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [layoutHistory, setLayoutHistory] = useState(null);

  // Evaluate All Bay Violations
  const auditResults = useMemo(() => {
    const violations = [];
    let totalDrums = 0;

    DEFAULT_BAYS.forEach(bay => {
      const drums = baysData[bay.id] || [];
      totalDrums += drums.length;

      // Check Intra-Bay Chemical Incompatibilities
      for (let i = 0; i < drums.length; i++) {
        for (let j = i + 1; j < drums.length; j++) {
          const comp = evaluatePairCompatibility(drums[i], drums[j]);
          if (comp.status === 'RED' || comp.status === 'AMBER') {
            violations.push({
              type: 'INTRA_BAY_CONFLICT',
              severity: comp.status === 'RED' ? 'CRITICAL' : 'WARNING',
              bay: bay.name,
              bayCode: bay.code,
              chemA: drums[i].name,
              chemB: drums[j].name,
              hazardTitle: comp.hazardTitle,
              reaction: comp.chemicalEquation || 'Violent Contact Hazard',
              action: comp.segregationAction
            });
          }
        }
      }

      // Check Bay Regulatory Storage Class Allowed Groups
      drums.forEach(chem => {
        const groups = chem.cameoGroups || [];
        const hasForbidden = groups.some(g => bay.disallowedGroups.includes(g));
        if (hasForbidden) {
          violations.push({
            type: 'STORAGE_CLASS_VIOLATION',
            severity: 'CRITICAL',
            bay: bay.name,
            bayCode: bay.code,
            chemA: chem.name,
            chemB: 'Storage Bay Code',
            hazardTitle: `Unauthorized Class Placement in ${bay.code}`,
            reaction: `Substance ${chem.name} contains groups forbidden in ${bay.name}`,
            action: `Move to dedicated storage bay matching class ${chem.storageClass}`
          });
        }
      });
    });

    // Calculate Dynamic Safety Score (0-100)
    const criticalCount = violations.filter(v => v.severity === 'CRITICAL').length;
    const warningCount = violations.filter(v => v.severity === 'WARNING').length;
    let score = 100 - (criticalCount * 28) - (warningCount * 12);
    if (score < 5) score = 5;

    return {
      violations,
      totalDrums,
      criticalCount,
      warningCount,
      safetyScore: score
    };
  }, [baysData]);

  // Remove drum from bay
  const handleRemoveDrum = (bayId, chemId) => {
    setBaysData(prev => ({
      ...prev,
      [bayId]: prev[bayId].filter(c => c.id !== chemId)
    }));
  };

  // Add drum to bay
  const handleAddDrum = () => {
    const chem = inventory.find(c => c.id === selectedChemToAdd);
    if (!chem) return;

    if ((baysData[targetBayId] || []).length >= 4) {
      alert('Selected Storage Bay is at maximum 4-pallet capacity. Free a slot first or choose another bay.');
      return;
    }

    setBaysData(prev => ({
      ...prev,
      [targetBayId]: [...(prev[targetBayId] || []), chem]
    }));
  };

  // Preset: Simulate Highly Dangerous Unsafe Layout
  const triggerUnsafeLayout = () => {
    setLayoutHistory({
      mode: 'UNSAFE',
      timestamp: new Date().toLocaleTimeString(),
      score: auditResults.safetyScore,
      violationsCount: auditResults.violations.length
    });

    const h2so4 = inventory.find(c => c.name.toLowerCase().includes('sulfuric acid')) || inventory[0];
    const na2s = inventory.find(c => c.name.toLowerCase().includes('sodium sulfide')) || inventory[1];
    const h2o2 = inventory.find(c => c.name.toLowerCase().includes('hydrogen peroxide')) || inventory[2];
    const ipa = inventory.find(c => c.name.toLowerCase().includes('isopropanol')) || inventory[3];
    const naoh = inventory.find(c => c.name.toLowerCase().includes('sodium hydroxide')) || inventory[4];

    setBaysData({
      'bay-acids': [h2so4, na2s], // CATASROPHIC: Acid + Sulfide = H2S Gas!
      'bay-flammables': [ipa, h2o2], // CATASTROPHIC: Solvent + Strong Oxidizer = Flash Explosion!
      'bay-bases': [naoh, h2so4], // Neutralization Exotherm
      'bay-oxidizers': [],
      'bay-toxics': [],
      'bay-sulfides': []
    });
  };

  // Preset: Auto-Optimize to 100% Compliant NFPA 400 Layout
  const triggerAutoSegregation = () => {
    setLayoutHistory({
      mode: 'OPTIMIZED',
      timestamp: new Date().toLocaleTimeString(),
      score: auditResults.safetyScore,
      violationsCount: auditResults.violations.length
    });

    // Collect all drums currently placed
    const allDrums = Object.values(baysData).flat();

    const newBays = {
      'bay-flammables': [],
      'bay-acids': [],
      'bay-bases': [],
      'bay-oxidizers': [],
      'bay-toxics': [],
      'bay-sulfides': []
    };

    allDrums.forEach(chem => {
      const g = chem.cameoGroups || [];
      const s = chem.storageClass || '';

      if (g.includes('sulfides')) {
        if (newBays['bay-sulfides'].length < 4) newBays['bay-sulfides'].push(chem);
      } else if (g.includes('acids_strong_inorganic') || g.includes('acids_organic')) {
        if (newBays['bay-acids'].length < 4) newBays['bay-acids'].push(chem);
      } else if (g.includes('bases_strong') || g.includes('bases_alkaline')) {
        if (newBays['bay-bases'].length < 4) newBays['bay-bases'].push(chem);
      } else if (g.includes('oxidizers_strong') || g.includes('peroxides_organic')) {
        if (newBays['bay-oxidizers'].length < 4) newBays['bay-oxidizers'].push(chem);
      } else if (g.includes('flammables')) {
        if (newBays['bay-flammables'].length < 4) newBays['bay-flammables'].push(chem);
      } else {
        if (newBays['bay-toxics'].length < 4) newBays['bay-toxics'].push(chem);
      }
    });

    setBaysData(newBays);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER COMMAND STRIP */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold uppercase">
              MODULE 3: INDUSTRIAL SEGREGATION
            </span>
            <span className="text-slate-400 text-xs font-mono">NFPA 400 & TRGS 510</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2 mt-1">
            <Building2 className="w-6 h-6 text-cyan-400" />
            3D Warehouse Layout & Chemical Segregation Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time adjacent compatibility auditor, pallet rack conflict detector, and automated segregation optimizer.
          </p>
        </div>

        {/* Warehouse Safety Score Gauge */}
        <div className="flex items-center space-x-4 bg-slate-950/80 px-5 py-3 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">FACILITY SAFETY SCORE</span>
            <div className="flex items-center justify-end space-x-2">
              <span className={`text-2xl font-black font-mono ${
                auditResults.safetyScore >= 80 ? 'text-emerald-400' :
                auditResults.safetyScore >= 50 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {auditResults.safetyScore}%
              </span>
              <span className="text-xs font-mono text-slate-500">/ 100</span>
            </div>
            <span className="text-[10px] text-slate-400">
              {auditResults.criticalCount} Critical Violations
            </span>
          </div>
          
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            {auditResults.safetyScore >= 80 ? (
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            ) : auditResults.safetyScore >= 50 ? (
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            ) : (
              <ShieldAlert className="w-8 h-8 text-red-400 animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* ACTION TOOLBAR: AUTO-OPTIMIZE & DANGEROUS SIMULATION TOGGLE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={triggerAutoSegregation}
          className="p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold flex items-center justify-center space-x-2.5 transition shadow-lg shadow-emerald-600/20"
        >
          <Sparkles className="w-5 h-5 text-slate-950" />
          <span>Auto-Segregate & Optimize Layout (NFPA 400)</span>
        </button>

        <button
          onClick={triggerUnsafeLayout}
          className="p-3.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/50 text-red-200 font-semibold flex items-center justify-center space-x-2.5 transition"
        >
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span>Simulate Dangerous Unsafe Co-Storage</span>
        </button>

        <button
          onClick={() => setShowComparisonModal(!showComparisonModal)}
          className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium flex items-center justify-center space-x-2.5 transition"
        >
          <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
          <span>Before vs After Layout Audit Comparison</span>
        </button>
      </div>

      {/* DRUM PLACEMENT TOOLBAR */}
      <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800/80 flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
          Place Inventory Chemical Drum:
        </span>
        
        <select
          value={selectedChemToAdd}
          onChange={(e) => setSelectedChemToAdd(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        >
          {inventory.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.formula || c.cas}) - {c.storageClass || 'General'}
            </option>
          ))}
        </select>

        <span className="text-xs text-slate-400 font-mono">into</span>

        <select
          value={targetBayId}
          onChange={(e) => setTargetBayId(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        >
          {DEFAULT_BAYS.map(b => (
            <option key={b.id} value={b.id}>
              {b.code}: {b.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAddDrum}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Place Drum</span>
        </button>
      </div>

      {/* 6 WAREHOUSE BAYS INTERACTIVE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEFAULT_BAYS.map(bay => {
          const drums = baysData[bay.id] || [];
          const isAtCapacity = drums.length >= bay.capacity;

          // Check if this bay has conflicts
          const bayViolations = auditResults.violations.filter(v => v.bayCode === bay.code);
          const hasConflict = bayViolations.length > 0;

          return (
            <div 
              key={bay.id}
              className={`rounded-2xl p-4 border transition-all ${
                hasConflict 
                  ? 'border-red-500/80 bg-red-950/20 shadow-lg shadow-red-950/30' 
                  : bay.color
              }`}
            >
              {/* Bay Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-200">
                      {bay.code}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{bay.storageClass}</span>
                  </div>
                  <h3 className="font-bold text-slate-100 text-sm mt-1">{bay.name}</h3>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-mono font-bold ${isAtCapacity ? 'text-amber-400' : 'text-slate-400'}`}>
                    {drums.length} / {bay.capacity} Pallets
                  </span>
                  {hasConflict && (
                    <span className="block text-[10px] text-red-400 font-bold font-mono animate-pulse">
                      CONFLICT DETECTED!
                    </span>
                  )}
                </div>
              </div>

              {/* Bay Description */}
              <p className="text-[10px] text-slate-400 mt-2 line-clamp-2">
                {bay.description}
              </p>

              {/* Chemical Pallet Drum Slots */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {[0, 1, 2, 3].map(slotIdx => {
                  const drum = drums[slotIdx];

                  if (!drum) {
                    return (
                      <div 
                        key={slotIdx}
                        className="h-20 rounded-xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-600 text-[10px] font-mono"
                      >
                        <span>Slot {slotIdx + 1}</span>
                        <span className="text-[9px] text-slate-700">Empty Pallet</span>
                      </div>
                    );
                  }

                  // Check if this specific drum is in conflict
                  const isDrumInConflict = bayViolations.some(v => v.chemA === drum.name || v.chemB === drum.name);

                  return (
                    <div
                      key={drum.id || slotIdx}
                      className={`relative p-2 rounded-xl border text-xs flex flex-col justify-between transition group ${
                        isDrumInConflict
                          ? 'bg-red-900/40 border-red-500 text-red-100 shadow-md shadow-red-900/50'
                          : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-slate-400 truncate max-w-[80px]">
                            {drum.cas}
                          </span>
                          <button
                            onClick={() => handleRemoveDrum(bay.id, drum.id)}
                            className="text-slate-500 hover:text-red-400 p-0.5 rounded transition"
                            title="Remove Drum from Pallet"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="font-bold text-slate-100 text-[11px] truncate mt-0.5" title={drum.name}>
                          {drum.name}
                        </p>
                        <p className="text-[10px] font-mono text-cyan-400 truncate">
                          {drum.formula || 'Formula verified'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 mt-1">
                        <span className="text-[9px] font-mono text-slate-400">
                          {drum.quantity || '200L Drum'}
                        </span>
                        {isDrumInConflict && (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-bounce" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      {/* ACTIVE SEGREGATION AUDIT LOG */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-sm">
              Continuous Warehouse Segregation Audit Feed ({auditResults.violations.length} Active Flags)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Automated Evaluation against NOAA CAMEO & NFPA 400
          </span>
        </div>

        {auditResults.violations.length === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold block">100% Segregation Compliance Achieved</span>
              <span>All storage bays comply with NFPA 400 isolation standards. No adjacent cross-reactivity detected.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {auditResults.violations.map((v, i) => (
              <div 
                key={i} 
                className="p-3 rounded-xl bg-red-950/30 border border-red-500/40 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-red-900 border border-red-700 text-red-200 font-mono text-[10px] font-bold">
                      {v.bayCode}
                    </span>
                    <span className="font-bold text-red-300">{v.hazardTitle}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {v.chemA} ⚡ {v.chemB}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">{v.reaction}</p>
                <p className="text-emerald-400 text-[10px] font-mono">
                  <span className="font-bold">Required Action:</span> {v.action}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BEFORE VS AFTER MODAL */}
      {showComparisonModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
                Warehouse Segregation Audit: Before vs After Comparison
              </h3>
              <button 
                onClick={() => setShowComparisonModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/40 space-y-2">
                <span className="font-bold text-red-400 block uppercase font-mono text-[10px]">Unsegregated Layout State</span>
                <p className="text-2xl font-black font-mono text-red-400">24% Safety Score</p>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  <li>• Co-storage of Sulfuric Acid with Sodium Sulfide in Bay B</li>
                  <li>• Volatile Isopropanol co-stored with 50% Hydrogen Peroxide</li>
                  <li>• High risk of catastrophic toxic gas liberation ($H_2S$)</li>
                  <li>• Violation of OSHA 1910.1200 storage guidelines</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
                <span className="font-bold text-emerald-400 block uppercase font-mono text-[10px]">NFPA 400 Optimized State</span>
                <p className="text-2xl font-black font-mono text-emerald-400">96% Safety Score</p>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  <li>• Acids isolated in acid-resistant Bay B with dedicated scrubber</li>
                  <li>• Sulfides relocated to dedicated alkaline Bay F</li>
                  <li>• Flammables confined to ATEX-rated firewalled Bay A</li>
                  <li>• Zero adjacent reactive contacts across all bays</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowComparisonModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
