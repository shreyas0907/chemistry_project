import React from 'react';

/**
 * Renders sleek segmented pill bars for PBT (Persistence, Bioaccumulation, Toxicity)
 * Each dimension has 3 segments (Low = 1, Moderate = 2, High = 3)
 */
export default function PbtPillBar({ pbtScore, showLabels = true, size = 'sm' }) {
  const p = pbtScore?.persistence || 'Low';
  const b = pbtScore?.bioaccumulation || 'Low';
  const t = pbtScore?.toxicity || 'Low';

  const getLevelValue = (lvl) => {
    if (lvl === 'High') return 3;
    if (lvl === 'Moderate') return 2;
    return 1;
  };

  const getColor = (levelVal) => {
    if (levelVal === 3) return { bg: 'bg-botanical-coral', text: 'text-botanical-coral', glow: 'shadow-[0_0_8px_rgba(244,63,94,0.5)]' };
    if (levelVal === 2) return { bg: 'bg-botanical-amber', text: 'text-botanical-amber', glow: 'shadow-[0_0_8px_rgba(245,158,11,0.5)]' };
    return { bg: 'bg-botanical-lime', text: 'text-botanical-lime', glow: 'shadow-[0_0_8px_rgba(132,204,22,0.5)]' };
  };

  const renderSegmentedPill = (letter, label, levelStr) => {
    const val = getLevelValue(levelStr);
    const col = getColor(val);

    return (
      <div className="flex items-center space-x-1.5" title={`${label}: ${levelStr}`}>
        <span className="text-[10px] font-mono font-bold text-slate-400 w-3 text-center">
          {letter}
        </span>
        <div className="flex items-center space-x-0.5 bg-black/40 p-0.5 rounded-full border border-emerald-500/10">
          {[1, 2, 3].map((seg) => {
            const isActive = seg <= val;
            return (
              <div
                key={seg}
                className={`rounded-full transition-all ${
                  size === 'sm' ? 'w-2 h-1.5' : 'w-3 h-2'
                } ${
                  isActive
                    ? `${col.bg} ${col.glow}`
                    : 'bg-forest-800/80'
                }`}
              />
            );
          })}
        </div>
        {showLabels && (
          <span className={`text-[10px] font-mono font-medium ${col.text}`}>
            {levelStr[0]}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center space-x-3">
      {renderSegmentedPill('P', 'Persistence', p)}
      {renderSegmentedPill('B', 'Bioaccumulation', b)}
      {renderSegmentedPill('T', 'Aquatic Toxicity', t)}
    </div>
  );
}

