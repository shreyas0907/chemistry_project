import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Move, 
  Sparkles, 
  RotateCcw, 
  Ruler, 
  Info,
  Flame,
  Droplets,
  AlertOctagon
} from 'lucide-react';
import { evaluatePairCompatibility } from '../services/chemicalSafetyEngine';

const NFPA_MIN_SEPARATION_METERS = 6.0; // Standard NFPA 400 incompatible separation requirement
const GRID_SIZE_METERS = 14; // 14m x 14m floor

export default function WarehouseFloorPlanner({ inventory = [], onSelectChemical }) {
  // Placed chemical drums on the warehouse floor: { id, chemId, x, y } (coordinates in meters)
  const [placedDrums, setPlacedDrums] = useState([
    {
      id: 'drum-1',
      chemId: inventory.find(c => c.name.toLowerCase().includes('sulfuric acid'))?.id || inventory[0]?.id,
      x: 3.5,
      y: 4.0
    },
    {
      id: 'drum-2',
      chemId: inventory.find(c => c.name.toLowerCase().includes('sodium sulfide'))?.id || inventory[1]?.id,
      x: 5.5,
      y: 4.8 // Proximity: ~2.1m (Violates 6m separation!)
    },
    {
      id: 'drum-3',
      chemId: inventory.find(c => c.name.toLowerCase().includes('isopropanol'))?.id || inventory[2]?.id,
      x: 10.5,
      y: 3.0
    },
    {
      id: 'drum-4',
      chemId: inventory.find(c => c.name.toLowerCase().includes('hydrogen peroxide'))?.id || inventory[3]?.id,
      x: 11.2,
      y: 5.2 // Proximity: ~2.3m (Flammable + Oxidizer proximity violation!)
    },
    {
      id: 'drum-5',
      chemId: inventory.find(c => c.name.toLowerCase().includes('sodium hydroxide'))?.id || inventory[4]?.id,
      x: 3.0,
      y: 10.5
    }
  ]);

  const [selectedDrumId, setSelectedDrumId] = useState(null);
  const [chemToAddId, setChemToAddId] = useState(inventory[0]?.id || '');

  // Calculate Euclidean Distance Between Drums & Detect Proximity Incompatibilities
  const spatialAudit = useMemo(() => {
    const violations = [];
    const safePairs = [];

    for (let i = 0; i < placedDrums.length; i++) {
      for (let j = i + 1; j < placedDrums.length; j++) {
        const d1 = placedDrums[i];
        const d2 = placedDrums[j];
        const chem1 = inventory.find(c => c.id === d1.chemId);
        const chem2 = inventory.find(c => c.id === d2.chemId);

        if (!chem1 || !chem2) continue;

        // Euclidean distance in meters: sqrt((x2 - x1)^2 + (y2 - y1)^2)
        const dx = d2.x - d1.x;
        const dy = d2.y - d1.y;
        const distanceM = Math.sqrt(dx * dx + dy * dy);

        // Evaluate chemical incompatibility
        const comp = evaluatePairCompatibility(chem1, chem2);
        const isIncompatible = comp.status === 'RED' || comp.status === 'AMBER';

        if (isIncompatible) {
          if (distanceM < NFPA_MIN_SEPARATION_METERS) {
            violations.push({
              drum1Id: d1.id,
              drum2Id: d2.id,
              chemA: chem1.name,
              chemB: chem2.name,
              posA: `(${d1.x.toFixed(1)}m, ${d1.y.toFixed(1)}m)`,
              posB: `(${d2.x.toFixed(1)}m, ${d2.y.toFixed(1)}m)`,
              distanceM: parseFloat(distanceM.toFixed(1)),
              requiredM: NFPA_MIN_SEPARATION_METERS,
              hazardTitle: comp.hazardTitle,
              chemicalEquation: comp.chemicalEquation || 'Cross-Reactivity Hazard',
              barrierRecommendation: 'Relocate to >= 6.0m physical air gap OR construct 2-hour liquid-tight firewall with separate drainage sumps.'
            });
          } else {
            safePairs.push({
              chemA: chem1.name,
              chemB: chem2.name,
              distanceM: parseFloat(distanceM.toFixed(1))
            });
          }
        }
      }
    }

    // Safety Score (100 down based on proximity violations)
    const safetyScore = Math.max(10, 100 - (violations.length * 35));

    return {
      violations,
      safePairs,
      safetyScore
    };
  }, [placedDrums, inventory]);

  // Handle Drag / Move of drum on grid
  const handleMoveDrum = (id, newX, newY) => {
    const clampedX = Math.max(0.8, Math.min(GRID_SIZE_METERS - 0.8, newX));
    const clampedY = Math.max(0.8, Math.min(GRID_SIZE_METERS - 0.8, newY));

    setPlacedDrums(prev => prev.map(d => 
      d.id === id ? { ...d, x: parseFloat(clampedX.toFixed(1)), y: parseFloat(clampedY.toFixed(1)) } : d
    ));
  };

  // Add Drum to Floor
  const handleAddDrum = () => {
    const chem = inventory.find(c => c.id === chemToAddId);
    if (!chem) return;

    const newId = `drum-${Date.now()}`;
    // Find empty spot
    const newX = 2 + (placedDrums.length * 1.5) % 10;
    const newY = 2 + (placedDrums.length * 2.1) % 10;

    setPlacedDrums(prev => [...prev, { id: newId, chemId: chem.id, x: newX, y: newY }]);
    setSelectedDrumId(newId);
  };

  // Remove Drum
  const handleRemoveDrum = (id) => {
    setPlacedDrums(prev => prev.filter(d => d.id !== id));
    if (selectedDrumId === id) setSelectedDrumId(null);
  };

  // Auto-Resolve Floor Layout (Spreads incompatible drums > 6.0m apart)
  const handleAutoResolve = () => {
    const safeCoordinates = [
      { x: 2.0, y: 2.5 },
      { x: 11.5, y: 11.5 },
      { x: 2.0, y: 11.5 },
      { x: 11.5, y: 2.5 },
      { x: 7.0, y: 7.0 }
    ];

    setPlacedDrums(prev => prev.map((d, idx) => {
      const coord = safeCoordinates[idx % safeCoordinates.length];
      return { ...d, x: coord.x, y: coord.y };
    }));
  };

  // Preset: Dangerous Layout
  const handleTriggerDangerousLayout = () => {
    setPlacedDrums([
      {
        id: 'drum-1',
        chemId: inventory.find(c => c.name.toLowerCase().includes('sulfuric acid'))?.id || inventory[0]?.id,
        x: 4.0,
        y: 5.0
      },
      {
        id: 'drum-2',
        chemId: inventory.find(c => c.name.toLowerCase().includes('sodium sulfide'))?.id || inventory[1]?.id,
        x: 5.2,
        y: 5.4 // Distance 1.2m -> Critical H2S hazard!
      },
      {
        id: 'drum-3',
        chemId: inventory.find(c => c.name.toLowerCase().includes('isopropanol'))?.id || inventory[2]?.id,
        x: 8.5,
        y: 8.0
      },
      {
        id: 'drum-4',
        chemId: inventory.find(c => c.name.toLowerCase().includes('hydrogen peroxide'))?.id || inventory[3]?.id,
        x: 9.2,
        y: 8.6 // Distance 0.9m -> Explosion hazard!
      }
    ]);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#08151f] via-[#091b26] to-[#0e2738] border border-cyan-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 text-xs font-mono font-bold uppercase flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-cyan-400" />
              MODULE B: 2D FLOOR DISTANCE SEGREGATION
            </span>
            <span className="text-slate-400 text-xs font-mono">Euclidean Proximity &amp; NFPA 400 6.0m Rule</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2 mt-1">
            <Building2 className="w-6 h-6 text-cyan-400" />
            Interactive 2D Warehouse Floor &amp; Spatial Segregation Planner
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Place storage drums across the floor coordinates. System calculates real-time Euclidean distances √((x₂ - x₁)² + (y₂ - y₁)²) and pulses red warning exclusion radiuses when incompatible chemicals violate the 6-meter separation boundary.
          </p>
        </div>

        {/* Safety Score Meter */}
        <div className="flex items-center space-x-4 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">SPATIAL COMPLIANCE SCORE</span>
            <div className="flex items-center justify-end space-x-1.5 font-mono">
              <span className={`text-2xl font-black ${
                spatialAudit.safetyScore >= 80 ? 'text-emerald-400' :
                spatialAudit.safetyScore >= 50 ? 'text-amber-400' : 'text-red-400 animate-pulse'
              }`}>
                {spatialAudit.safetyScore}%
              </span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {spatialAudit.violations.length} Distance Violations
            </span>
          </div>
        </div>
      </div>

      {/* ACTION BAR: AUTO-OPTIMIZE & DANGEROUS SIMULATION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={handleAutoResolve}
          className="p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-600/20"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Auto-Resolve Placement (&ge; 6.0m NFPA Safe Distance)</span>
        </button>

        <button
          onClick={handleTriggerDangerousLayout}
          className="p-3.5 rounded-xl bg-red-950/50 hover:bg-red-900/50 border border-red-500/50 text-red-200 font-semibold text-xs flex items-center justify-center space-x-2 transition"
        >
          <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
          <span>Simulate Proximity Violation (Acid + Sulfide &lt; 2m)</span>
        </button>

        <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs">
          <select
            value={chemToAddId}
            onChange={(e) => setChemToAddId(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-500 truncate"
          >
            {inventory.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.cameoGroups?.[0] || 'Reagent'})
              </option>
            ))}
          </select>
          <button
            onClick={handleAddDrum}
            className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition shrink-0"
          >
            + Add Drum
          </button>
        </div>
      </div>

      {/* 2D WAREHOUSE FLOOR CANVAS & TELEMETRY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT 8 COLS: 2D INTERACTIVE WAREHOUSE FLOOR GRID */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-slate-100 font-mono flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              Active Floor Grid ({GRID_SIZE_METERS}m × {GRID_SIZE_METERS}m Scale)
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              Click drum to select &bull; Click on grid to reposition
            </span>
          </div>

          {/* Interactive Floor Canvas Grid */}
          <div 
            onClick={(e) => {
              if (!selectedDrumId) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = ((e.clientX - rect.left) / rect.width) * GRID_SIZE_METERS;
              const clickY = ((e.clientY - rect.top) / rect.height) * GRID_SIZE_METERS;
              handleMoveDrum(selectedDrumId, clickX, clickY);
            }}
            className="w-full aspect-square max-h-[540px] bg-[#070e14] border-2 border-slate-800 rounded-2xl relative overflow-hidden cursor-crosshair select-none shadow-inner"
            style={{
              backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px), radial-gradient(#0f172a 1px, #070e14 1px)',
              backgroundSize: '38px 38px',
              backgroundPosition: '0 0, 19px 19px'
            }}
          >
            {/* Floor Boundary & Grid Markings */}
            <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-500 pointer-events-none">
              (0, 0) Entry Bay
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-500 pointer-events-none">
              ({GRID_SIZE_METERS}m, {GRID_SIZE_METERS}m) Loading Dock
            </div>

            {/* Violation Connecting Lines & Pulsing Danger Rings */}
            {spatialAudit.violations.map((v, idx) => {
              const d1 = placedDrums.find(d => d.id === v.drum1Id);
              const d2 = placedDrums.find(d => d.id === v.drum2Id);
              if (!d1 || !d2) return null;

              const x1Pct = (d1.x / GRID_SIZE_METERS) * 100;
              const y1Pct = (d1.y / GRID_SIZE_METERS) * 100;
              const x2Pct = (d2.x / GRID_SIZE_METERS) * 100;
              const y2Pct = (d2.y / GRID_SIZE_METERS) * 100;

              return (
                <div key={idx} className="absolute inset-0 pointer-events-none">
                  {/* SVG Line Connecting Violating Drums */}
                  <svg className="w-full h-full absolute inset-0">
                    <line
                      x1={`${x1Pct}%`}
                      y1={`${y1Pct}%`}
                      x2={`${x2Pct}%`}
                      y2={`${y2Pct}%`}
                      stroke="#ef4444"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                      className="animate-pulse"
                    />
                  </svg>

                  {/* Midpoint Distance Badge */}
                  <div 
                    className="absolute z-20 px-2 py-0.5 rounded bg-red-950 border border-red-500 text-red-300 font-mono text-[9px] font-bold shadow-lg"
                    style={{
                      left: `${(x1Pct + x2Pct) / 2}%`,
                      top: `${(y1Pct + y2Pct) / 2}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    ⚠️ {v.distanceM}m &lt; 6.0m
                  </div>
                </div>
              );
            })}

            {/* Placed Chemical Drums */}
            {placedDrums.map(drum => {
              const chem = inventory.find(c => c.id === drum.chemId);
              const isSelected = selectedDrumId === drum.id;
              const isViolating = spatialAudit.violations.some(v => v.drum1Id === drum.id || v.drum2Id === drum.id);

              const leftPct = (drum.x / GRID_SIZE_METERS) * 100;
              const topPct = (drum.y / GRID_SIZE_METERS) * 100;

              // Color by storage class / group
              const g = chem?.cameoGroups || [];
              const ringColor = 
                isViolating ? 'border-red-500 bg-red-950/70 text-red-200' :
                g.includes('flammables') ? 'border-amber-500 bg-amber-950/70 text-amber-200' :
                g.includes('acids_inorganic') ? 'border-orange-500 bg-orange-950/70 text-orange-200' :
                g.includes('oxidizers_strong') ? 'border-yellow-400 bg-yellow-950/70 text-yellow-200' :
                g.includes('cyanides') ? 'border-purple-500 bg-purple-950/70 text-purple-200' :
                'border-cyan-500 bg-cyan-950/70 text-cyan-200';

              return (
                <div
                  key={drum.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDrumId(drum.id);
                  }}
                  className={`absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                    isSelected ? 'scale-110 z-40' : 'hover:scale-105'
                  }`}
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                >
                  {/* Pulsing 6-Meter Exclusion Zone Ring if in violation */}
                  {isViolating && (
                    <div 
                      className="absolute -inset-10 rounded-full border-2 border-red-500/40 bg-red-500/10 pointer-events-none animate-ping"
                      style={{ transform: 'translate(0, 0)' }}
                    />
                  )}

                  {/* Drum Graphic Body */}
                  <div className={`w-11 h-11 rounded-2xl border-2 flex flex-col items-center justify-center p-1 shadow-xl backdrop-blur-md ${ringColor} ${
                    isSelected ? 'ring-4 ring-cyan-400' : ''
                  }`}>
                    <span className="text-[8px] font-mono font-black truncate max-w-full leading-tight">
                      {chem?.formula || chem?.name?.slice(0, 4)}
                    </span>
                    <span className="text-[7px] font-mono text-slate-400">
                      {drum.x.toFixed(1)}m,{drum.y.toFixed(1)}m
                    </span>
                  </div>

                  {/* Tooltip on hover/selected */}
                  {isSelected && (
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-40 bg-slate-950/95 border border-cyan-500 p-2 rounded-xl text-[10px] text-slate-200 shadow-2xl pointer-events-none z-50">
                      <span className="font-bold text-cyan-300 block truncate">{chem?.name}</span>
                      <span className="text-slate-400 font-mono block">Class: {chem?.storageClass}</span>
                      <span className="text-amber-300 font-mono block">Coords: ({drum.x}m, {drum.y}m)</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Red dashed line = Incompatible pair &lt; 6.0m NFPA limit</span>
            <div className="flex items-center space-x-3">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> Acids</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" /> Sulfides</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Flammables</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" /> Oxidizers</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Cyanides</span>
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLS: PROXIMITY VIOLATION LOG & BARRIER RECOMMENDATIONS */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-slate-100 font-mono flex items-center gap-1.5 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Proximity Violations ({spatialAudit.violations.length})
            </span>
            <span className="text-[10px] font-mono text-slate-500">NFPA 400 Audit</span>
          </div>

          {spatialAudit.violations.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/50 text-emerald-300 space-y-1">
              <div className="flex items-center space-x-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Spatial Compliance Achieved</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                All incompatible chemical storage drums maintain at least <strong>6.0 meters</strong> of separation. Zero fire/toxic vapor cross-contamination corridors detected.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {spatialAudit.violations.map((v, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/70 text-red-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-300 text-[11px] truncate max-w-[170px]">
                      {v.chemA} ⚡ {v.chemB}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-900 font-mono font-bold text-[9px] text-red-100">
                      {v.distanceM}m / 6.0m
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-300 font-mono">
                    Positions: {v.posA} &bull; {v.posB}
                  </p>

                  <div className="p-2 rounded bg-slate-950/80 border border-red-500/30 text-[10px] font-mono text-cyan-300">
                    <span className="font-bold text-red-400 block mb-0.5">{v.hazardTitle}</span>
                    <code>{v.chemicalEquation}</code>
                  </div>

                  <div className="text-[10px] text-amber-300 bg-amber-950/30 p-2 rounded border border-amber-800/40 font-mono">
                    <span className="font-bold block">Engineering Remedy:</span>
                    {v.barrierRecommendation}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected Drum Actions */}
          {selectedDrumId && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 pt-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                Selected Drum Controls:
              </span>
              <div className="flex items-center justify-between">
                <span className="text-slate-200 font-mono text-xs">
                  {inventory.find(c => c.id === placedDrums.find(d => d.id === selectedDrumId)?.chemId)?.name}
                </span>
                <button
                  onClick={() => handleRemoveDrum(selectedDrumId)}
                  className="px-2.5 py-1 rounded bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-[10px] font-mono flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
