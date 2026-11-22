import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Timer, 
  Award, 
  RotateCcw, 
  FileText, 
  ChevronRight, 
  Wind, 
  Droplets, 
  Zap, 
  Info, 
  Siren, 
  Radio, 
  Compass, 
  ShieldCheck 
} from 'lucide-react';

/**
 * 6 REALISTIC INDUSTRIAL DISASTER TRAINING SCENARIOS
 */
const SCENARIOS = [
  {
    id: 'scenario-h2s',
    title: 'Catastrophic H₂S Toxic Gas Generation',
    category: 'Toxic Gas Release',
    facilityZone: 'Tannery Beamhouse / Waste Trench A-4',
    severity: 'FATAL / LEVEL 3 RED ALERT',
    chemicalsInvolved: [
      { name: 'Sodium Sulfide (60% Flakes)', cas: '1313-82-2', role: 'Sulfide Source' },
      { name: 'Sulfuric Acid (98%)', cas: '7664-93-9', role: 'Acidic Inflow' }
    ],
    initialBrief: 'An operator inadvertently discharged 400L of spent pickling acid (pH 1.8) directly into an unwashed floor trench containing concentrated sodium sulfide beamhouse liquor. Dense gas evolution detected.',
    gasFormed: 'Hydrogen Sulfide (H₂S)',
    idlH: '100 ppm',
    reactionEquation: 'Na₂S + H₂SO₄ → H₂S (g) ↑ + Na₂SO₄ (ΔH = -88.4 kJ/mol)',
    stages: [
      {
        stageNumber: 1,
        stageTitle: 'Immediate Evacuation & Alarm Phase',
        prompt: 'Stationary gas sensors detect 42 ppm H₂S at floor level, rapidly rising. What is your immediate priority action?',
        options: [
          {
            text: 'Trigger plant-wide evacuation horn, broadcast Level 3 alarm, and initiate upwind assembly immediately.',
            isCorrect: true,
            score: 25,
            rationale: 'H2S causes olfactory paralysis above 50 ppm. Rapid upwind evacuation is the only life-preserving action.'
          },
          {
            text: 'Send two operators with dust masks to locate the trench valve and close it manually.',
            isCorrect: false,
            score: 0,
            rationale: 'FATAL ERROR: Dust masks provide zero protection against H2S gas. Entry without SCBA leads to immediate knockout and fatality within seconds.'
          },
          {
            text: 'Turn on all floor fans to blow the vapor towards the warehouse loading dock.',
            isCorrect: false,
            score: -10,
            rationale: 'CATASTROPHIC: Dispersing toxic H2S towards an occupied loading dock creates secondary casualties.'
          }
        ]
      },
      {
        stageNumber: 2,
        stageTitle: 'PPE & Responder Entry Protocol',
        prompt: 'The emergency response team prepares to enter the beamhouse to isolate the leak. What personal protective equipment is mandatory?',
        options: [
          {
            text: 'Positive-pressure Self-Contained Breathing Apparatus (SCBA) with Level A gas-tight encapsulating hazmat suits.',
            isCorrect: true,
            score: 25,
            rationale: 'OSHA 1910.120 mandates Level A protection with positive-pressure SCBA for environments with unverified or IDLH gas concentrations.'
          },
          {
            text: 'Half-face organic vapor respirator cartridges with standard nitrile gloves and safety glasses.',
            isCorrect: false,
            score: -15,
            rationale: 'INSUFFICIENT: Organic vapor cartridges do not filter H2S adequately and do not protect against eye irritation or lethal hypoxia.'
          },
          {
            text: 'N95 particulate masks with rubber gumboots and acid aprons.',
            isCorrect: false,
            score: -20,
            rationale: 'FATAL: N95 filters zero gases. Immediate asphyxiation hazard.'
          }
        ]
      },
      {
        stageNumber: 3,
        stageTitle: 'Chemical Neutralization & Trench Scrubbing',
        prompt: 'Responders need to halt continuous H₂S gas evolution from the acidic sulfide mixture in the trench. Which chemical mitigation agent must be applied?',
        options: [
          {
            text: 'Flood trench with dilute Sodium Hydroxide (NaOH 20%) to raise pH > 10.0, trapping sulfide ions as non-volatile HS⁻/S²⁻.',
            isCorrect: true,
            score: 25,
            rationale: 'At pH > 10, sulfide equilibrium shifts entirely to hydrosulfide (HS-) and sulfide (S2-), instantly quenching H2S gas evolution.'
          },
          {
            text: 'Pour concentrated Hydrochloric Acid to neutralize the pungent odor.',
            isCorrect: false,
            score: -25,
            rationale: 'CATASTROPHIC: Adding more acid violently accelerates H2S evolution, generating lethal gas plumes.'
          },
          {
            text: 'Flush trench with high-pressure raw tap water directly into the public sewer drain.',
            isCorrect: false,
            score: -15,
            rationale: 'ILLEGAL & DANGEROUS: Sending active H2S liquor into public sewers causes underground explosions and off-site municipal deaths.'
          }
        ]
      },
      {
        stageNumber: 4,
        stageTitle: 'Environmental Monitoring & All-Clear Audit',
        prompt: 'What verification criteria must be satisfied before declaring the beamhouse safe for normal re-entry?',
        options: [
          {
            text: 'Continuous multi-gas detector confirms H₂S < 1.0 ppm and trench pH maintained > 9.5 for at least 30 minutes with full ventilation.',
            isCorrect: true,
            score: 25,
            rationale: 'OSHA PEL for H2S is 20 ppm ceiling (NIOSH REL is 10 ppm 10-min ceiling). A conservative reading < 1.0 ppm ensures complete safety.'
          },
          {
            text: 'When the rotten egg odor disappears from the atmosphere.',
            isCorrect: false,
            score: -10,
            rationale: 'CRITICAL TRAP: Olfactory fatigue paralyzes human sense of smell above 100 ppm, tricking victims into believing gas has cleared!'
          },
          {
            text: 'Immediate re-entry after 10 minutes of opening the warehouse doors.',
            isCorrect: false,
            score: -15,
            rationale: 'UNSAFE: H2S is heavier than air (vapor density 1.19) and lingers in low trenches and pits indefinitely without forced extraction.'
          }
        ]
      }
    ]
  },
  {
    id: 'scenario-solvent-fire',
    title: 'Pharma Solvent Drum Puncture & Flash Fire',
    category: 'Flammable Liquid Fire',
    facilityZone: 'Warehouse Bay A / Flammables Vault',
    severity: 'HIGH / CLASS 3 FLAMMABLE FIRE',
    chemicalsInvolved: [
      { name: 'Isopropanol (IPA 99.8%)', cas: '67-63-0', role: 'Fuel Source' },
      { name: 'Dichloromethane (DCM)', cas: '75-09-2', role: 'Co-stored Toxic' }
    ],
    initialBrief: 'A forklift tine punctured a 200L steel drum of Isopropanol. 150 liters of flammable solvent pooled on the warehouse floor. An electrical spark from a nearby battery charger ignited a flash vapor fire.',
    gasFormed: 'Volatile Hydrocarbon Smoke + Phosgene decomposition risk',
    idlH: '2,000 ppm (IPA) / 2,300 ppm (DCM)',
    reactionEquation: '2 C₃H₇OH + 9 O₂ → 6 CO₂ + 8 H₂O (Flash Point = 12°C)',
    stages: [
      {
        stageNumber: 1,
        stageTitle: 'Initial Alarm & Area Isolation',
        prompt: 'Flammable liquid fire spreads across the spill retention berm. What is the immediate incident command priority?',
        options: [
          {
            text: 'Activate manual fire pull station, isolate main electrical breaker to Bay A, and trip the deluge foam fire suppression system.',
            isCorrect: true,
            score: 25,
            rationale: 'Isolating electrical ignition and applying AFFF foam blankets flammable solvent vapors before neighboring DCM drums overheat.'
          },
          {
            text: 'Direct a solid high-pressure water stream directly into the burning liquid pool.',
            isCorrect: false,
            score: -20,
            rationale: 'CATASTROPHIC: Solid water streams scatter burning flammable liquids across the warehouse, creating a rolling fire tsunami.'
          },
          {
            text: 'Enter with cotton rag mops to contain the perimeter.',
            isCorrect: false,
            score: -25,
            rationale: 'FATAL: Entering an active Class B fire without Bunker gear and suppression equipment leads to severe burns.'
          }
        ]
      },
      {
        stageNumber: 2,
        stageTitle: 'Fire Suppression Medium Selection',
        prompt: 'Which fire suppression agent is scientifically approved for an Isopropanol (polar solvent) pool fire?',
        options: [
          {
            text: 'Alcohol-Resistant Aqueous Film-Forming Foam (AR-AFFF) or Purple-K dry chemical extinguisher.',
            isCorrect: true,
            score: 25,
            rationale: 'Polar solvents like IPA break standard AFFF foams. Alcohol-Resistant (AR) foam creates an impermeable polymeric barrier that smothers the flame.'
          },
          {
            text: 'Standard plain water sprinkler nozzles at low pressure.',
            isCorrect: false,
            score: -10,
            rationale: 'INSUFFICIENT: Water dissolves IPA exothermically and does not blanket the vapor space effectively.'
          },
          {
            text: 'Throwing dry sand and sawdust onto the burning pool.',
            isCorrect: false,
            score: -15,
            rationale: 'DANGEROUS: Sawdust is combustible organic cellulose that acts as additional fuel.'
          }
        ]
      },
      {
        stageNumber: 3,
        stageTitle: 'Neighboring Drum Thermal Protection',
        prompt: 'Adjacent drums contain Dichloromethane (DCM) and Hydrogen Peroxide. Radiant heat is heating drum skins to 75°C. What action prevents BLEVE (Boiling Liquid Expanding Vapor Explosion)?',
        options: [
          {
            text: 'Apply water fog / cooling spray curtain to exterior drum shells from behind protective blast shields to absorb radiant heat.',
            isCorrect: true,
            score: 25,
            rationale: 'Cooling spray keeps metal vessel temperatures below boiling thresholds, preventing catastrophic vessel overpressure and BLEVE.'
          },
          {
            text: 'Have warehouse workers manually roll the hot drums out through the fire zone.',
            isCorrect: false,
            score: -20,
            rationale: 'HIGH CASUALTY RISK: Moving overpressured hot solvent drums by hand invites instant vessel rupture and fatal burns.'
          },
          {
            text: 'Ignore neighboring drums and wait for the solvent to burn itself out completely.',
            isCorrect: false,
            score: -25,
            rationale: 'CATASTROPHIC: Uncooled neighboring drums will rupture, triggering chain-reaction structural destruction.'
          }
        ]
      },
      {
        stageNumber: 4,
        stageTitle: 'Post-Fire Hazmat Recovery & Containment',
        prompt: 'The fire is extinguished. 300L of mixed chemical runoff and foam residue remains in the retention sump. How must this waste be managed?',
        options: [
          {
            text: 'Pump foam/solvent residue into dedicated hazardous waste ISO-tanks using an explosion-proof pneumatic diaphragm pump for licensed disposal.',
            isCorrect: true,
            score: 25,
            rationale: 'Pneumatic pumps eliminate electrical ignition risks. Waste must be treated as hazardous halogenated/organic waste.'
          },
          {
            text: 'Open the storm drain sluice valve to flush the residue away with rainwater.',
            isCorrect: false,
            score: -25,
            rationale: 'CRIMINAL VIOLATION: Discharging toxic solvent-foam runoff into municipal storm drains causes massive environmental damage and heavy criminal penalties.'
          },
          {
            text: 'Allow liquid to evaporate naturally into ambient warehouse air over 48 hours.',
            isCorrect: false,
            score: -15,
            rationale: 'UNSAFE: Evaporating solvent builds explosive atmospheres (LEL exceeded) and exposes workers to chronic carcinogens.'
          }
        ]
      }
    ]
  },
  {
    id: 'scenario-reactor-runaway',
    title: 'Reactor Thermal Runaway: Strong Acid + Strong Base',
    category: 'Thermal Runaway & Overpressure',
    facilityZone: 'Synthesis Unit R-301 / Pilot Plant',
    severity: 'CRITICAL / VESSEL RUPTURE RISK',
    chemicalsInvolved: [
      { name: 'Sulfuric Acid (98%)', cas: '7664-93-9', role: 'Reagent A' },
      { name: 'Sodium Hydroxide (50% Lye)', cas: '1310-73-2', role: 'Reagent B' }
    ],
    initialBrief: 'Due to a stuck automated dosing valve, 800L of 50% NaOH was dumped into R-301 containing concentrated H₂SO₄ within 90 seconds. Exothermic heat of neutralization released 133 kJ/mol. Reactor temp spiked from 25°C to 118°C; vessel pressure hit 3.8 bar.',
    gasFormed: 'Superheated Corrosive Acid Mist & Steam',
    idlH: '15 mg/m³ (H₂SO₄) / 10 mg/m³ (NaOH)',
    reactionEquation: 'H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O (ΔH = -133.5 kJ/mol)',
    stages: [
      {
        stageNumber: 1,
        stageTitle: 'Immediate Process Interlock Trip',
        prompt: 'Temperature gradient reaches +4.5 °C/min and pressure reaches 85% of rupture disc setpoint. What automated safety interlock must be verified immediately?',
        options: [
          {
            text: 'Engage Emergency Process Shutdown (ESD), divert chilled glycol jacket to maximum cryogenic cooling, and verify reagent feed valves fail-closed.',
            isCorrect: true,
            score: 25,
            rationale: 'Immediately stopping reactant addition and applying maximum cooling slows the exponential Arrhenius rate of reaction.'
          },
          {
            text: 'Open the top manway lid manually to inspect the visual boiling state.',
            isCorrect: false,
            score: -25,
            rationale: 'FATAL: Opening a pressurized vessel containing boiling corrosive acid ejects superheated chemical geysers, killing the operator.'
          },
          {
            text: 'Add 500 liters of cold tap water directly into the reactor through the charge port.',
            isCorrect: false,
            score: -20,
            rationale: 'CATASTROPHIC: Adding water to concentrated sulfuric acid releases massive heat of hydration, causing steam explosions and vessel shattering.'
          }
        ]
      },
      {
        stageNumber: 2,
        stageTitle: 'Quench & Shortstop Injection',
        prompt: 'Internal temperature continues rising toward 130°C. What engineering safeguard halts runaway exotherms in chemical reactors?',
        options: [
          {
            text: 'Trigger automated bottom chemical quench / cold diluent injection and vent through the dedicated caustic scrubber knockout drum.',
            isCorrect: true,
            score: 25,
            rationale: 'Venting through a knockout drum and packed scrubber condenses acidic vapors safely while relieving internal vessel overpressure.'
          },
          {
            text: 'Turn off the mechanical agitator to let reactants settle.',
            isCorrect: false,
            score: -15,
            rationale: 'DANGEROUS: Halting agitation causes localized thermal hot spots, accelerating runaway decomposition and thermal stratification.'
          },
          {
            text: 'Cap the pressure relief line to contain the odors.',
            isCorrect: false,
            score: -25,
            rationale: 'FATAL: Capping relief paths turns the reactor into a high-explosive fragmentation bomb.'
          }
        ]
      },
      {
        stageNumber: 3,
        stageTitle: 'Rupture Disc Discharge Protocol',
        prompt: 'The rupture disc bursts safely at 4.0 bar, venting superheated vapor into the expansion relief stack. What perimeter action is required?',
        options: [
          {
            text: 'Evacuate rooftop and downwind zones within 200m; activate stack caustic water spray curtain to capture acid droplets.',
            isCorrect: true,
            score: 25,
            rationale: 'Vented acid aerosols create severe respiratory burns downwind unless knocked down by emergency caustic water curtains.'
          },
          {
            text: 'Climb onto the reactor roof to replace the ruptured disc immediately.',
            isCorrect: false,
            score: -20,
            rationale: 'EXTREME HAZARD: Entering a live discharge zone exposes personnel to superheated corrosive gas plumes.'
          },
          {
            text: 'Assume the danger has completely ended because the pressure dropped.',
            isCorrect: false,
            score: -10,
            rationale: 'INCOMPLETE: The reactor still contains corrosive liquid at 100°C requiring monitored cool-down.'
          }
        ]
      },
      {
        stageNumber: 4,
        stageTitle: 'Post-Runaway Forensic Audit',
        prompt: 'What engineering investigation is mandatory before Unit R-301 can ever be returned to industrial service?',
        options: [
          {
            text: 'Non-Destructive Testing (ultrasonic wall thickness & dye penetrant vessel weld inspection), relief device replacement, and SIS interlock re-certification.',
            isCorrect: true,
            score: 25,
            rationale: 'ASME Section VIII and OSHA 1910.119 require structural metallographic certification after thermal excursion before re-pressurization.'
          },
          {
            text: 'A simple visual inspection with a flashlight through the sight glass.',
            isCorrect: false,
            score: -15,
            rationale: 'UNACCEPTABLE: Thermal shocks create micro-cracks in Hastelloy welds that fail catastrophically in subsequent batches.'
          },
          {
            text: 'Restart the recipe immediately with fresh batches to meet production quotas.',
            isCorrect: false,
            score: -25,
            rationale: 'GROSS NEGLIGENCE: Repeating the process without root-cause resolution invites immediate secondary catastrophe.'
          }
        ]
      }
    ]
  }
];

export default function EmergencyResponseTrainer({ onNavigate }) {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [hasSubmittedStage, setHasSubmittedStage] = useState(false);
  const [userDecisions, setUserDecisions] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const scenario = SCENARIOS[selectedScenarioIndex];
  const stage = scenario.stages[currentStageIndex];

  // Live Scenario Timer
  useEffect(() => {
    let interval = null;
    if (isTimerActive && !isCompleted) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, isCompleted]);

  // Handle stage submission
  const handleSubmitDecision = () => {
    if (selectedOptionIndex === null) return;

    const chosen = stage.options[selectedOptionIndex];
    setHasSubmittedStage(true);
    setIsTimerActive(false);

    const decisionRecord = {
      stageNumber: stage.stageNumber,
      stageTitle: stage.stageTitle,
      chosenOption: chosen.text,
      isCorrect: chosen.isCorrect,
      score: chosen.score,
      rationale: chosen.rationale
    };

    setUserDecisions(prev => [...prev, decisionRecord]);
  };

  // Advance to next stage or complete
  const handleNextStage = () => {
    if (currentStageIndex + 1 < scenario.stages.length) {
      setCurrentStageIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setHasSubmittedStage(false);
      setIsTimerActive(true);
    } else {
      setIsCompleted(true);
      setIsTimerActive(false);
    }
  };

  // Reset current scenario drill
  const handleResetDrill = (scenarioIdx = selectedScenarioIndex) => {
    setSelectedScenarioIndex(scenarioIdx);
    setCurrentStageIndex(0);
    setSelectedOptionIndex(null);
    setHasSubmittedStage(false);
    setUserDecisions([]);
    setIsCompleted(false);
    setElapsedSeconds(0);
    setIsTimerActive(true);
  };

  // Calculate Cumulative Score
  const totalScore = userDecisions.reduce((sum, d) => sum + d.score, 0);
  const maxPossibleScore = scenario.stages.length * 25;
  const scorePercent = Math.max(0, Math.round((totalScore / maxPossibleScore) * 100));

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-950 border border-red-800 text-red-300 text-xs font-mono font-bold uppercase flex items-center gap-1">
              <Siren className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              MODULE 4: INCIDENT COMMAND SYSTEM
            </span>
            <span className="text-slate-400 text-xs font-mono">OSHA 1910.120 HAZWOPER Certified Simulator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2 mt-1">
            <Flame className="w-6 h-6 text-red-400" />
            Industrial Chemical Emergency Response Trainer
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time disaster decision simulator with kinetic dispersion modeling, chemical PPE selection, and OSHA incident scoring.
          </p>
        </div>

        {/* Live Timer & Score Gauge */}
        <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2 pr-3 border-r border-slate-800 text-slate-300">
            <Timer className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">INCIDENT ELAPSED</span>
              <span className="text-sm font-bold font-mono text-cyan-300">{formatTime(elapsedSeconds)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">COMMAND SCORE</span>
              <span className="text-sm font-bold font-mono text-amber-300">{totalScore} / {maxPossibleScore} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* SCENARIO SELECTOR BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SCENARIOS.map((sc, idx) => (
          <button
            key={sc.id}
            onClick={() => handleResetDrill(idx)}
            className={`p-3.5 rounded-xl border text-left transition ${
              selectedScenarioIndex === idx
                ? 'bg-red-950/40 border-red-500/80 shadow-lg shadow-red-950/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 uppercase">
                {sc.category}
              </span>
              <span className="text-[10px] font-mono font-bold text-red-400">
                {sc.severity.split('/')[0]}
              </span>
            </div>
            <h4 className="font-bold text-slate-100 text-sm mt-1.5">{sc.title}</h4>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">{sc.facilityZone}</p>
          </button>
        ))}
      </div>

      {/* ACTIVE SCENARIO MAIN CONTAINER */}
      {!isCompleted ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT 2 COLS: ACTIVE DECISION STAGE */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Incident Briefing Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider block">
                    STAGE {stage.stageNumber} OF {scenario.stages.length}: {stage.stageTitle}
                  </span>
                  <h3 className="font-bold text-slate-100 text-base mt-0.5">{stage.prompt}</h3>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-slate-500 block">ZONE STATUS</span>
                  <span className="text-xs font-bold text-amber-400 font-mono">{scenario.facilityZone}</span>
                </div>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5 pt-1">
                {stage.options.map((opt, oIdx) => {
                  const isSelected = selectedOptionIndex === oIdx;
                  let optionStyles = 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700';

                  if (hasSubmittedStage) {
                    if (opt.isCorrect) {
                      optionStyles = 'border-emerald-500 bg-emerald-950/40 text-emerald-200';
                    } else if (isSelected && !opt.isCorrect) {
                      optionStyles = 'border-red-500 bg-red-950/40 text-red-200';
                    }
                  } else if (isSelected) {
                    optionStyles = 'border-cyan-500 bg-cyan-950/30 text-cyan-200 shadow-md shadow-cyan-950/50';
                  }

                  return (
                    <div
                      key={oIdx}
                      onClick={() => !hasSubmittedStage && setSelectedOptionIndex(oIdx)}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition flex items-start space-x-3 ${optionStyles}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <div className="flex-1">
                        <p className="leading-relaxed">{opt.text}</p>
                        
                        {/* Rationale feedback after submission */}
                        {hasSubmittedStage && (
                          <div className={`mt-2 p-2.5 rounded-lg text-xs leading-relaxed ${
                            opt.isCorrect ? 'bg-emerald-950/60 text-emerald-300' : 'bg-red-950/60 text-red-300'
                          }`}>
                            <span className="font-bold block mb-0.5">
                              {opt.isCorrect ? '✓ OSHA / NFPA APPROVED ACTION (+25 pts)' : '✗ CRITICAL PROTOCOL BREACH'}
                            </span>
                            {opt.rationale}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-500 font-mono">
                  {hasSubmittedStage ? 'Review technical rationale above before advancing.' : 'Select the safest operational decision under OSHA 1910.'}
                </span>

                <div>
                  {!hasSubmittedStage ? (
                    <button
                      onClick={handleSubmitDecision}
                      disabled={selectedOptionIndex === null}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-slate-100 font-bold text-xs rounded-xl transition shadow-lg shadow-red-600/20"
                    >
                      Confirm Operational Decision
                    </button>
                  ) : (
                    <button
                      onClick={handleNextStage}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-lg shadow-emerald-600/20"
                    >
                      <span>{currentStageIndex + 1 < scenario.stages.length ? 'Advance to Next Stage' : 'Complete Drill & View Report'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT 1 COL: INCIDENT TELEMETRY & SCIENTIFIC DOSSIER */}
          <div className="space-y-4">
            
            {/* Scientific Reaction & Gas Profile */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Chemical Threat Profile
              </span>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 block">CHEMICAL REACTION EQUATION</span>
                  <code className="text-[11px] font-mono text-cyan-300 font-bold block">
                    {scenario.reactionEquation}
                  </code>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[9px] text-slate-500 block">HAZARD GAS</span>
                    <span className="text-xs font-bold text-red-400 truncate block">{scenario.gasFormed}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[9px] text-slate-500 block">NIOSH IDLH</span>
                    <span className="text-xs font-bold text-amber-400">{scenario.idlH}</span>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono text-slate-400 block font-bold">REAGENTS INVOLVED:</span>
                  {scenario.chemicalsInvolved.map((c, i) => (
                    <div key={i} className="flex justify-between items-center text-[11px] p-1.5 rounded bg-slate-950 border border-slate-800/80">
                      <span className="text-slate-200">{c.name}</span>
                      <span className="text-slate-500 font-mono text-[10px]">{c.cas}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tactical Incident Summary */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                Incident Genesis & Initial State
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {scenario.initialBrief}
              </p>
            </div>

          </div>

        </div>
      ) : (
        /* COMPLETED DRILL FINAL AUDIT REPORT */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 max-w-4xl mx-auto shadow-2xl">
          
          <div className="text-center space-y-2 pb-4 border-b border-slate-800">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-1">
              <Award className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-100">
              Emergency Response Drill Completed: Incident Audit Dossier
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Evaluated against OSHA 1910.120 (HAZWOPER) and EPA Risk Management Plan (RMP) standards.
            </p>
          </div>

          {/* Performance Score Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono text-slate-500 block">TOTAL SCORE</span>
              <span className="text-3xl font-black font-mono text-emerald-400">{scorePercent}%</span>
              <span className="text-[10px] text-slate-400 font-mono">{totalScore} of {maxPossibleScore} Points</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono text-slate-500 block">INCIDENT DURATION</span>
              <span className="text-3xl font-black font-mono text-cyan-400">{formatTime(elapsedSeconds)}</span>
              <span className="text-[10px] text-slate-400 font-mono">Real-time Simulation Clock</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono text-slate-500 block">OSHA RATING</span>
              <span className={`text-2xl font-black font-mono ${
                scorePercent >= 80 ? 'text-emerald-400' : scorePercent >= 50 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {scorePercent >= 85 ? 'CLASS A COMMANDER' : scorePercent >= 60 ? 'SUPERVISOR QUALIFIED' : 'REMEDIATION REQUIRED'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Competency Classification</span>
            </div>
          </div>

          {/* Detailed Decision Breakdown */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-sm">Chronological Decision Audit Log:</h4>
            {userDecisions.map((d, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {d.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="font-bold text-slate-200">Stage {d.stageNumber}: {d.stageTitle}</span>
                  </div>
                  <span className={`font-mono font-bold ${d.score > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {d.score > 0 ? `+${d.score}` : d.score} pts
                  </span>
                </div>
                <p className="text-slate-300 pl-6">{d.chosenOption}</p>
                <p className="text-[11px] text-slate-400 pl-6 italic">{d.rationale}</p>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-800 gap-3">
            <button
              onClick={() => handleResetDrill()}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry this Scenario Drill</span>
            </button>

            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify({ scenario: scenario.title, score: scorePercent, time: formatTime(elapsedSeconds), decisions: userDecisions }, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `incident_drill_audit_${scenario.id}.json`;
                a.click();
              }}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center space-x-2 transition"
            >
              <FileText className="w-4 h-4" />
              <span>Export Incident Audit Dossier (JSON)</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
