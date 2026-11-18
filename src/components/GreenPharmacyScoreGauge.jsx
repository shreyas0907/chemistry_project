import React from 'react';
import { Leaf, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export default function GreenPharmacyScoreGauge({ inventory = [] }) {
  const total = inventory.length;

  // Calculate score:
  // - Green rating: +100 pts
  // - Yellow rating: +50 pts
  // - Red rating: +0 pts
  // Weighted average
  let totalPoints = 0;
  let greenCount = 0;
  let redCount = 0;

  inventory.forEach(c => {
    if (c.greenChemistryRating === 'Green') {
      totalPoints += 100;
      greenCount++;
    } else if (c.greenChemistryRating === 'Yellow') {
      totalPoints += 55;
    } else {
      redCount++;
      totalPoints += 15;
    }
  });

  const rawScore = total > 0 ? Math.round(totalPoints / total) : 75;
  const score = Math.max(10, Math.min(100, rawScore));

  // Radial calculation (220 degree arc)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  // Use a 240 degree gauge arc
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset = arcLength - (arcLength * score) / 100;

  let scoreTier = 'Optimal Eco-Pharmacy';
  let tierColor = 'text-botanical-emerald';
  let badgeBg = 'bg-botanical-emerald/10 border-botanical-emerald/30 text-botanical-emerald';

  if (score < 50) {
    scoreTier = 'Critical Eco-Risk';
    tierColor = 'text-botanical-coral';
    badgeBg = 'bg-botanical-coral/10 border-botanical-coral/30 text-botanical-coral';
  } else if (score < 75) {
    scoreTier = 'Moderate / Transitioning';
    tierColor = 'text-botanical-amber';
    badgeBg = 'bg-botanical-amber/10 border-botanical-amber/30 text-botanical-amber';
  }

  return (
    <div className="bento-card p-5 relative overflow-hidden flex flex-col justify-between h-full group">
      
      {/* Background ambient glow */}
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-botanical-emerald/10 rounded-full blur-3xl pointer-events-none group-hover:bg-botanical-emerald/20 transition-all duration-700" />
      
      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-botanical-emerald/10 border border-botanical-emerald/30 flex items-center justify-center text-botanical-emerald shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <Leaf className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">
            Green Pharmacy Score
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeBg}`}>
          {scoreTier}
        </span>
      </div>

      {/* Radial Gauge Centerpiece */}
      <div className="flex flex-col items-center justify-center my-3 relative z-10">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-210" viewBox="0 0 130 130">
            {/* Background Track Arc */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="transparent"
              stroke="rgba(20, 41, 33, 0.8)"
              strokeWidth="9"
              strokeDasharray={arcLength}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            {/* Value Arc with Gradient */}
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="60%" stopColor="#84CC16" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="transparent"
              stroke="url(#gaugeGradient)"
              strokeWidth="9"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            />
          </svg>

          {/* Centered Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight flex items-baseline">
              {score}
              <span className="text-xs font-normal text-botanical-lime ml-0.5">/100</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
              Eco-Health
            </span>
          </div>
        </div>
      </div>

      {/* Footer Metrics Breakdown */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-emerald-500/10 text-xs relative z-10">
        <div className="p-2 rounded-lg bg-black/30 border border-emerald-500/10 flex flex-col">
          <span className="text-[10px] text-slate-400">Green Preferred</span>
          <span className="font-mono font-bold text-botanical-lime">
            {greenCount} <span className="text-[10px] font-normal text-slate-400 font-sans">({Math.round((greenCount / (total || 1)) * 100)}%)</span>
          </span>
        </div>
        <div className="p-2 rounded-lg bg-black/30 border border-emerald-500/10 flex flex-col">
          <span className="text-[10px] text-slate-400">High Eco-Risk</span>
          <span className="font-mono font-bold text-botanical-coral">
            {redCount} <span className="text-[10px] font-normal text-slate-400 font-sans">({Math.round((redCount / (total || 1)) * 100)}%)</span>
          </span>
        </div>
      </div>

    </div>
  );
}

