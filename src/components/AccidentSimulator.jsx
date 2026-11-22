import React, { useState, useMemo, useEffect } from 'react';
import { 
  AlertOctagon, Flame, Skull, AlertTriangle, ShieldCheck, 
  RefreshCw, Play, Pause, ChevronRight, Activity, Thermometer, 
  Wind, Gauge, Info, Zap, Sliders, Volume2, Layers, Droplets,
  ArrowUpRight, Radio, Beaker, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { evaluateMultiChemicalCompatibility } from '../services/chemicalSafetyEngine';
import { INITIAL_INDUSTRIAL_INVENTORY } from '../data/industryChemicals';

// ==========================================
// 7 HISTORICAL & INDUSTRIAL ACCIDENT SCENARIOS
// ==========================================
const SIMULATION_SCENARIOS = [
  {
    id: "scen-tannery-h2s",
    title: "Tannery Disaster: Unhairing Sulfide Acidification",
    industry: "Leather Tanning Industry",
    substanceA: "Sodium Sulfide (Na2S)",
    substanceB: "Sulfuric Acid (H2SO4)",
    reactionType: "Acid-Promoted Fast Gas Liberation",
    chemicalEquation: "Na2S(aq) + H2SO4(aq) -> Na2SO4(aq) + H2S(g) ^",
    idlhLevel: "100 ppm H2S (Lethal > 500 ppm)",
    maxTemp: 92,
    maxPressure: 3.8,
    maxGasPpm: 1250,
    evacRadiusMeters: 450,
    stages: [
      {
        time: "T + 0.0s",
        phase: "Initial Transfer Error",
        description: "Operator mistakenly connects a sulfuric acid pickling delivery hose to a liming pit holding 1,200 kg of sodium sulfide liquor.",
        temp: 24,
        pressure: 1.0,
        gasPpm: 2,
        alertLevel: "SAFE"
      },
      {
        time: "T + 1.8s",
        phase: "Instantaneous Protonation",
        description: "Acid contacts sulfide liquor. Local pH collapses from 11.5 to 4.2. Massive effervescence begins as sulfide ions rapidly protonate into gaseous H2S.",
        temp: 58,
        pressure: 1.6,
        gasPpm: 240,
        alertLevel: "WARNING"
      },
      {
        time: "T + 6.5s",
        phase: "Atmospheric Cloud Eruption",
        description: "Dense, invisible H2S gas surges out of pit openings. Olfactory receptors in human victims are paralyzed instantly, eliminating warning odor. Rapid knockdown occurs.",
        temp: 84,
        pressure: 2.9,
        gasPpm: 850,
        alertLevel: "CRITICAL"
      },
      {
        time: "T + 18.0s",
        phase: "Peak Lethal Dispersion",
        description: "Gas plume reaches 1,250 ppm across a 40-meter radius. Secondary victims attempting unassisted rescue collapse immediately without positive-pressure SCBA.",
        temp: 92,
        pressure: 3.8,
        gasPpm: 1250,
        alertLevel: "FATAL"
      }
    ],
    rootCauses: [
      "Absence of keyed/color-coded hose couplings between acid and alkaline pipe manifolds.",
      "Lack of automated pH interlocking on the pit transfer valves.",
      "Stationary H2S detection sensors were improperly placed above gas density elevation (H2S vapor density 1.19 is heavier than air)."
    ],
    engineeringControls: [
      "Poka-Yoke mechanical couplers preventing acid lines from mating with alkaline ports.",
      "Automated caustic scrubber interlock activated automatically by emergency pit dump switches.",
      "Mandatory dual-gas personal monitors with acoustic and vibration alarms for all tanning drum operators."
    ]
  },
  {
    id: "scen-pharma-hcl",
    title: "Pharma Pilot Plant: Acyl Halide Water Ingress Rupture",
    industry: "Pharmaceutical Synthesis",
    substanceA: "Sebacoyl Chloride",
    substanceB: "Aqueous Buffer / Water",
    reactionType: "Violent Nucleophilic Hydrolysis with Acid Gas Blowout",
    chemicalEquation: "C10H16Cl2O2 + 2 H2O -> C10H18O4 + 2 HCl(g) ^ + Heat",
    idlhLevel: "50 ppm HCl (Corrosive pulmonary toxin)",
    maxTemp: 148,
    maxPressure: 8.5,
    maxGasPpm: 680,
    evacRadiusMeters: 280,
    stages: [
      {
        time: "T + 0.0s",
        phase: "Moisture Ingress",
        description: "A condensation leak in a chilled water jacket breaches the seal of an unvented 100-liter acyl chloride synthesis vessel.",
        temp: 22,
        pressure: 1.0,
        gasPpm: 0,
        alertLevel: "SAFE"
      },
      {
        time: "T + 2.5s",
        phase: "Nucleophilic Attack",
        description: "Water reacts violently with acid chloride motifs. Anhydrous HCl vaporizes instantly; internal pressure spikes exponentially as temperature jumps.",
        temp: 78,
        pressure: 3.4,
        gasPpm: 85,
        alertLevel: "WARNING"
      },
      {
        time: "T + 7.0s",
        phase: "Overpressurization Runaway",
        description: "Exotherm accelerates hydrolysis kinetics. Reaction liquid boils; boiling foaming slurry fills vapor headspace at 6.2 bar.",
        temp: 126,
        pressure: 6.2,
        gasPpm: 340,
        alertLevel: "CRITICAL"
      },
      {
        time: "T + 12.0s",
        phase: "Rupture Disc Burst & Acid Mist",
        description: "Graphite rupture disc bursts at 8.5 bar, discharging 680 ppm choking HCl acid mist and hot corrosive liquid through pilot plant suite.",
        temp: 148,
        pressure: 8.5,
        gasPpm: 680,
        alertLevel: "FATAL"
      }
    ],
    rootCauses: [
      "Single-walled cooling jacket failure without intermediate heat-transfer fluid.",
      "Absence of moisture sensors on inert nitrogen purge line.",
      "Relief system vented indoors rather than into a dedicated caustic quench scrubber."
    ],
    engineeringControls: [
      "Double-walled glass-lined reactors with dielectric oil secondary heat exchangers.",
      "Emergency high-pressure rupture disc relief routed to packed caustic abatement tower.",
      "Dew-point interlock preventing reagent charging when relative humidity exceeds 15%."
    ]
  },
  {
    id: "scen-cosmetics-peroxide",
    title: "Cosmetics Warehouse: Peroxide & Fragrance Terpene Fire",
    industry: "Cosmetics & Personal Care",
    substanceA: "Hydrogen Peroxide (50%)",
    substanceB: "(R)-(+)-Limonene (Terpene)",
    reactionType: "Catalytic Auto-Oxidation & Free-Radical Deflagration",
    chemicalEquation: "C10H16 + H2O2 (50%) -> Rapid Deflagration + Flash Fire",
    idlhLevel: "75 ppm H2O2 Vapor / VOC Flash Point 48°C",
    maxTemp: 260,
    maxPressure: 5.2,
    maxGasPpm: 450,
    evacRadiusMeters: 350,
    stages: [
      {
        time: "T + 0.0s",
        phase: "Forklift Pallet Puncture",
        description: "A forklift tine punctures a 200L polyethylene drum of 50% cosmetic grade H2O2, spilling onto spilled limonene fragrance residue in a common drainage trough.",
        temp: 21,
        pressure: 1.0,
        gasPpm: 5,
        alertLevel: "SAFE"
      },
      {
        time: "T + 4.0s",
        phase: "Free-Radical Initiation",
        description: "Concentrated peroxide aggressively attacks terpene double bonds. Exothermic epoxidation and hydroperoxide formation release boiling oxygen-rich steam.",
        temp: 95,
        pressure: 1.8,
        gasPpm: 90,
        alertLevel: "WARNING"
      },
      {
        time: "T + 11.0s",
        phase: "Thermal Runaway & Deflagration",
        description: "Temperature surpasses limonene's auto-ignition threshold. Pure evolved O2 enriches the vapor headspace; a blinding flash fire deflagrates down the drainage trench.",
        temp: 190,
        pressure: 3.6,
        gasPpm: 280,
        alertLevel: "CRITICAL"
      },
      {
        time: "T + 22.0s",
        phase: "Catastrophic Facility Fire",
        description: "Fire engulfs adjacent alcohol drum storage racks. Secondary BLEVE explosions occur with high radiant heat flux exceeding 35 kW/m2.",
        temp: 260,
        pressure: 5.2,
        gasPpm: 450,
        alertLevel: "FATAL"
      }
    ],
    rootCauses: [
      "Shared drainage trench connecting oxidizer storage bunker directly to flammable fragrance dispensing room.",
      "Absence of secondary containment bunds for peroxide carboys.",
      "Failure to isolate Class 5.1 strong oxidizers by minimum 6 meters from combustible perfume stocks."
    ],
    engineeringControls: [
      "Physical dedicated bunding with dedicated sump drainage for all Class 5.1 oxidizers.",
      "Infrared flame detectors with fast-acting deluge foam suppression.",
      "Strict zero-metal, passivated 316L stainless steel or fluoropolymer transfer equipment."
    ]
  },
  {
    id: "scen-pharma-hydride",
    title: "Pharma Hydrogenation: Hydride Water Quench Runaway",
    industry: "Pharmaceutical Synthesis",
    substanceA: "Sodium Borohydride (NaBH4)",
    substanceB: "Water / Aqueous Waste",
    reactionType: "Rapid Exothermic Water-Reactive Gas Generation",
    chemicalEquation: "NaBH4 + 4 H2O -> NaB(OH)4 + 4 H2(g) ^ + Rapid Exotherm",
    idlhLevel: "Hydrogen LEL 4.0% (Explosive in air up to 75%)",
    maxTemp: 185,
    maxPressure: 7.2,
    maxGasPpm: 3200,
    evacRadiusMeters: 400,
    stages: [
      {
        time: "T + 0.0s",
        phase: "Improper Waste Addition",
        description: "Technician disposes of unquenched sodium borohydride filtration cake directly into an aqueous mother liquor drum holding wet ethanol.",
        temp: 22,
        pressure: 1.0,
        gasPpm: 0,
        alertLevel: "SAFE"
      },
      {
        time: "T + 1.2s",
        phase: "Violent Hydrogen Liberation",
        description: "Hydride immediately decomposes in water. Pure H2 gas bubbles vigorously out of the bung, quickly exceeding 4% LEL in the drum neck.",
        temp: 74,
        pressure: 2.1,
        gasPpm: 450,
        alertLevel: "WARNING"
      },
      {
        time: "T + 4.5s",
        phase: "Static Spark Ignition",
        description: "Fast-moving gas generates static electrical charge on ungrounded plastic funnel. Hydrogen cloud ignites with a violent pressure wave.",
        temp: 140,
        pressure: 4.8,
        gasPpm: 1800,
        alertLevel: "CRITICAL"
      },
      {
        time: "T + 9.0s",
        phase: "Overpressure Drum BLEVE",
        description: "The 200L steel drum ruptures along its chime seam, throwing burning solvent and caustic borate sludge across the wash bay.",
        temp: 185,
        pressure: 7.2,
        gasPpm: 3200,
        alertLevel: "FATAL"
      }
    ],
    rootCauses: [
      "Lack of a validated solvent quench protocol (e.g., slow addition of ethyl acetate/acetone prior to water).",
      "Pouring reactive solids into an ungrounded drum without nitrogen inerting.",
      "No Class D metal-fire extinguisher stationed within 10 meters."
    ],
    engineeringControls: [
      "Standardized cryogenic quenching reactor with continuous nitrogen flow and off-gas hydrogen analyzer.",
      "Static-dissipative conductive funnels with verified ground clamps.",
      "Automated flammable gas sensors interlocking ventilation fans at 20% LEL."
    ]
  },
  {
    id: "scen-waste-nitric",
    title: "Chemical Waste Yard: Nitric Acid + Organic Solvent BLEVE",
    industry: "General Chemical Processing",
    substanceA: "Nitric Acid (68%)",
    substanceB: "Acetone / Isopropanol Waste",
    reactionType: "Delayed Auto-Catalytic Oxidation & Gas Explosion",
    chemicalEquation: "HNO3 + (CH3)2CO -> Complex Organonitrates + NO2(g) ^ + CO2(g) ^",
    idlhLevel: "20 ppm NO2 (Lethal pulmonary irritant)",
    maxTemp: 210,
    maxPressure: 9.0,
    maxGasPpm: 920,
    evacRadiusMeters: 500,
    stages: [
      {
        time: "T + 0.0s",
        phase: "Inadvertent Carboy Addition",
        description: "Cleaning technician empties 5 liters of concentrated spent nitric acid pickling solution into a polyethylene carboy labeled 'Mixed Organic Waste'.",
        temp: 20,
        pressure: 1.0,
        gasPpm: 0,
        alertLevel: "SAFE"
      },
      {
        time: "T + 30.0s",
        phase: "Induction Delay & Self-Heating",
        description: "Reaction enters deceptive induction phase with slow nitration. Internal temperature rises imperceptibly from 20°C to 45°C as liquid darkens.",
        temp: 45,
        pressure: 1.3,
        gasPpm: 15,
        alertLevel: "WARNING"
      },
      {
        time: "T + 90.0s",
        phase: "Thermal Runaway & NO2 Fuming",
        description: "Autocatalytic runaway triggers. Dense, reddish-brown Nitrogen Dioxide (NO2) gas pressurizes the carboy as temperature jumps exponentially.",
        temp: 130,
        pressure: 4.5,
        gasPpm: 420,
        alertLevel: "CRITICAL"
      },
      {
        time: "T + 120.0s",
        phase: "Explosive Carboy Shrapnel",
        description: "Carboy detonates at 9.0 bar. Hot fuming acid and plastic shrapnel project 30 meters. Toxic NO2 plume drifts across the facility yard.",
        temp: 210,
        pressure: 9.0,
        gasPpm: 920,
        alertLevel: "FATAL"
      }
    ],
    rootCauses: [
      "Failure to segregate oxidizing acid waste from flammable organic waste streams.",
      "Carboy cap was sealed tight without pressure-relief vents.",
      "Inadequate color-coding on waste collection containers."
    ],
    engineeringControls: [
      "Dedicated vented-cap fluoropolymer carboys with mechanical keyed funnel lids.",
      "Automated temperature-sensing waste collection bays with alarm sirens.",
      "Secondary containment cabinets with continuous exhaust to acid gas scrubbers."
    ]
  },
  {
    id: "scen-bleach-ammonia",
    title: "Sanitation Disaster: Bleach & Ammonia Gas Evolution",
    industry: "General Chemical / Cosmetics Cleanroom",
    substanceA: "Sodium Hypochlorite (12.5% Bleach)",
    substanceB: "Ammonium Hydroxide (Ammonia)",
    reactionType: "Fast Gas-Phase Chloramine Evolution",
    chemicalEquation: "NaClO + NH4OH -> NH2Cl(g) ^ + NaOH + H2O",
    idlhLevel: "5 ppm Chloramine / 50 ppm Ammonia",
    maxTemp: 65,
    maxPressure: 1.5,
    maxGasPpm: 380,
    evacRadiusMeters: 200,
    stages: [
      {
        time: "T + 0.0s",
        phase: "Concurrent Cleaning Mixture",
        description: "Housekeeping staff mixes industrial concentrated bleach and ammonia floor cleaner in a mop bucket to 'boost cleaning power'.",
        temp: 20,
        pressure: 1.0,
        gasPpm: 0,
        alertLevel: "SAFE"
      },
      {
        time: "T + 3.0s",
        phase: "Instant Chloramine Synthesis",
        description: "Solutions react immediately. Pungent, choking Chloramine (NH2Cl) gas evolves furiously, filling room breathing zone.",
        temp: 38,
        pressure: 1.1,
        gasPpm: 65,
        alertLevel: "WARNING"
      },
      {
        time: "T + 8.0s",
        phase: "Acute Respiratory Attack",
        description: "Chloramine vapor hydrolyzes on moist lung tissue to hydrochloric acid and hypochlorous acid, causing severe bronchospasm and blinding tears.",
        temp: 52,
        pressure: 1.3,
        gasPpm: 210,
        alertLevel: "CRITICAL"
      },
      {
        time: "T + 15.0s",
        phase: "Full Room Incapacitation",
        description: "Gas concentration reaches 380 ppm. Workers are incapacitated on the floor before they can reach the emergency exit door.",
        temp: 65,
        pressure: 1.5,
        gasPpm: 380,
        alertLevel: "FATAL"
      }
    ],
    rootCauses: [
      "Lack of Hazard Communication GHS training for subcontracted sanitation staff.",
      "Open manual chemical dilution without automated proportioning dispensers.",
      "Absence of emergency eye wash/shower inside the cleaning chemical dispensary."
    ],
    engineeringControls: [
      "Closed-loop automated chemical proportioners preventing manual mixing.",
      "Multi-language GHS warning pictorial labels on all sanitation drums.",
      "Emergency pull-cord alarm inside custodial chemical storage suites."
    ]
  },
  {
    id: "scen-etp-sump",
    title: "ETP Pit Catastrophe: Liming & Chrome Effluent Shock",
    industry: "Centralized Leather Wastewater (ETP)",
    substanceA: "Liming Sulfide Effluent (pH 11.8)",
    substanceB: "Chrome Pickle Effluent (pH 2.8)",
    reactionType: "Uncontrolled Equalization Acidification & Sludge Foaming",
    chemicalEquation: "S(2-) + 2 H(+) -> H2S(g) ^ + Cr(OH)3 Precipitation Sludge Shock",
    idlhLevel: "100 ppm H2S",
    maxTemp: 55,
    maxPressure: 2.2,
    maxGasPpm: 950,
    evacRadiusMeters: 380,
    stages: [
      {
        time: "T + 0.0s",
        phase: "Transfer Valve Malfunction",
        description: "An automated pneumatic valve fails in open position, routing 10,000 liters of acidic chrome pickle bath directly into an un-aerated sulfide equalization basin.",
        temp: 25,
        pressure: 1.0,
        gasPpm: 10,
        alertLevel: "SAFE"
      },
      {
        time: "T + 5.0s",
        phase: "Basin Acidification",
        description: "Basin pH crashes from 11.2 to 5.4. Billions of sulfide ions acidify simultaneously across the entire 50-square-meter liquid surface area.",
        temp: 36,
        pressure: 1.3,
        gasPpm: 180,
        alertLevel: "WARNING"
      },
      {
        time: "T + 14.0s",
        phase: "Massive Gas Release",
        description: "A thick blanket of H2S gas surges out of open basin vents. Wastewater operators on the catwalk are overcome by toxic vapor within seconds.",
        temp: 48,
        pressure: 1.8,
        gasPpm: 620,
        alertLevel: "CRITICAL"
      },
      {
        time: "T + 25.0s",
        phase: "Biological Filter Death & Plant Evacuation",
        description: "Plume reaches 950 ppm. Heavy metal precipitation poisons biological trickling filters. Plant sirens initiate mandatory facility-wide evacuation.",
        temp: 55,
        pressure: 2.2,
        gasPpm: 950,
        alertLevel: "FATAL"
      }
    ],
    rootCauses: [
      "Direct gravity drainage into common equalization pit without dedicated separate catalytic oxidation sumps.",
      "Failure of pneumatic air-to-close fail-safe on acid drain bypass valve.",
      "Catwalk lacked overhead emergency breathing air manifolds."
    ],
    engineeringControls: [
      "Physical 3-pipe segregated drainage lines with zero shared crossover points.",
      "Fail-safe spring-return automated isolation valves.",
      "Perimeter beam gas sensors triggering automated caustic deluge sprays over wastewater basins."
    ]
  }
];

export default function AccidentSimulator() {
  const [activeTabMode, setActiveTabMode] = useState('sandbox'); // 'sandbox' | 'scenarios' | 'dispersion'
  
  // ==========================================
  // 1. DYNAMIC SANDBOX SIMULATION STATE
  // ==========================================
  const [chemAId, setChemAId] = useState(INITIAL_INDUSTRIAL_INVENTORY[0]?.id || "");
  const [chemBId, setChemBId] = useState(INITIAL_INDUSTRIAL_INVENTORY[1]?.id || "");
  const [vesselType, setVesselType] = useState('drum'); // 'drum' | 'reactor' | 'flask' | 'spill'
  const [ambientTemp, setAmbientTemp] = useState(25); // °C
  const [hasCoolingJacket, setHasCoolingJacket] = useState(false);
  const [hasReliefValve, setHasReliefValve] = useState(true);
  const [hasScrubber, setHasScrubber] = useState(false);
  
  // Sandbox kinetic playback
  const [simStep, setSimStep] = useState(0); // 0 to 4
  const [isPlaying, setIsPlaying] = useState(false);
  const [emergencyDelugeActive, setEmergencyDelugeActive] = useState(false);
  const [quenchActive, setQuenchActive] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);

  // Selected chemical objects
  const chemA = useMemo(() => INITIAL_INDUSTRIAL_INVENTORY.find(c => c.id === chemAId) || INITIAL_INDUSTRIAL_INVENTORY[0], [chemAId]);
  const chemB = useMemo(() => INITIAL_INDUSTRIAL_INVENTORY.find(c => c.id === chemBId) || INITIAL_INDUSTRIAL_INVENTORY[1], [chemBId]);

  // Compatibility evaluation for sandbox pair
  const sandboxEval = useMemo(() => {
    return evaluateMultiChemicalCompatibility([chemA, chemB]);
  }, [chemA, chemB]);

  const interaction = sandboxEval.pairInteractions[0] || {};
  const isDanger = interaction.severity === 'DANGER';
  const isCaution = interaction.severity === 'CAUTION';

  // Compute dynamic physical readouts based on simulation step
  const dynamicPhysics = useMemo(() => {
    let baseTemp = ambientTemp;
    let basePressure = 1.0;
    let baseGasPpm = 0;
    let cloudRadius = 0;

    if (simStep === 0) {
      return { temp: baseTemp, pressure: 1.0, gasPpm: 0, cloudRadius: 0, status: "Normal Ambient State" };
    }

    if (isDanger) {
      // High-risk reaction calculations
      const tempRises = [20, 55, 95, 145];
      const pressureRises = [0.4, 1.8, 4.2, 7.5];
      const gasLevels = [80, 290, 750, 1400];
      const radii = [10, 45, 120, 350];

      baseTemp += tempRises[simStep - 1] || 0;
      basePressure += pressureRises[simStep - 1] || 0;
      baseGasPpm += gasLevels[simStep - 1] || 0;
      cloudRadius = radii[simStep - 1] || 0;

      // Adjust for safety mitigations
      if (hasCoolingJacket) {
        baseTemp = Math.max(ambientTemp + 10, baseTemp - 40);
        basePressure = Math.max(1.2, basePressure - 2.0);
      }
      if (hasReliefValve && basePressure > 3.5) {
        basePressure = 3.5; // Vents
        baseGasPpm += 150; // Vented to air if no scrubber
      }
      if (hasScrubber) {
        baseGasPpm = Math.round(baseGasPpm * 0.15); // 85% capture
        cloudRadius = Math.round(cloudRadius * 0.2);
      }
      if (emergencyDelugeActive) {
        baseTemp = Math.max(ambientTemp, baseTemp - 50);
        basePressure = Math.max(1.0, basePressure - 2.5);
      }
      if (quenchActive) {
        baseGasPpm = Math.round(baseGasPpm * 0.05);
        cloudRadius = 15;
      }

      return {
        temp: Math.round(baseTemp),
        pressure: parseFloat(basePressure.toFixed(1)),
        gasPpm: baseGasPpm,
        cloudRadius,
        status: simStep === 4 ? "PEAK THERMAL RUNAWAY & RUPTURE" : "EXOTHERMIC REACTION PROGRESSION"
      };
    } else if (isCaution) {
      // Moderate reaction
      baseTemp += simStep * 12;
      basePressure += simStep * 0.3;
      baseGasPpm += simStep * 30;
      cloudRadius = simStep * 15;
      return {
        temp: Math.round(baseTemp),
        pressure: parseFloat(basePressure.toFixed(1)),
        gasPpm: baseGasPpm,
        cloudRadius,
        status: "CONTROLLED EXOTHERM / EVAPORATION"
      };
    } else {
      // Compatible
      return {
        temp: ambientTemp + (simStep * 2),
        pressure: 1.0,
        gasPpm: 0,
        cloudRadius: 0,
        status: "COMPATIBLE / THERMODYNAMICALLY STABLE"
      };
    }
  }, [simStep, isDanger, isCaution, ambientTemp, hasCoolingJacket, hasReliefValve, hasScrubber, emergencyDelugeActive, quenchActive]);

  // Dynamic Chart Data for Sandbox
  const sandboxChartData = [
    { time: 'T+0s', temp: ambientTemp, pressure: 1.0, gasPpm: 0 },
    { time: 'T+2s', temp: isDanger ? ambientTemp + 20 : ambientTemp + 3, pressure: isDanger ? 1.4 : 1.0, gasPpm: isDanger ? 80 : 0 },
    { time: 'T+6s', temp: isDanger ? ambientTemp + 55 : ambientTemp + 6, pressure: isDanger ? 2.8 : 1.1, gasPpm: isDanger ? 290 : 10 },
    { time: 'T+12s', temp: isDanger ? ambientTemp + 95 : ambientTemp + 8, pressure: isDanger ? 5.2 : 1.1, gasPpm: isDanger ? 750 : 15 },
    { time: 'T+20s', temp: isDanger ? ambientTemp + 145 : ambientTemp + 10, pressure: isDanger ? 8.5 : 1.2, gasPpm: isDanger ? 1400 : 20 }
  ];

  // Auto-play timer for sandbox
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSimStep(prev => {
          if (prev >= 4) {
            setIsPlaying(false);
            return 4;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // ==========================================
  // 2. PRESET SCENARIO STATE
  // ==========================================
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [scenarioStageIndex, setScenarioStageIndex] = useState(0);
  const scenario = SIMULATION_SCENARIOS[selectedScenarioIndex];
  const stage = scenario.stages[scenarioStageIndex];

  // ==========================================
  // 3. ATMOSPHERIC DISPERSION SIMULATOR STATE
  // ==========================================
  const [selectedGas, setSelectedGas] = useState('H2S');
  const [spillMassKg, setSpillMassKg] = useState(500);
  const [windSpeedMs, setWindSpeedMs] = useState(3.5);

  const dispersionModel = useMemo(() => {
    // Simplified Gaussian Plume approximation for evacuation planning
    const factorMap = {
      'H2S': { idlhPpm: 100, molecularWeight: 34.08, vaporDensity: 1.19, toxicityCoeff: 1.4 },
      'Cl2': { idlhPpm: 10, molecularWeight: 70.90, vaporDensity: 2.45, toxicityCoeff: 2.2 },
      'HCl': { idlhPpm: 50, molecularWeight: 36.46, vaporDensity: 1.26, toxicityCoeff: 1.1 },
      'NH3': { idlhPpm: 300, molecularWeight: 17.03, vaporDensity: 0.59, toxicityCoeff: 0.8 },
      'NO2': { idlhPpm: 20, molecularWeight: 46.01, vaporDensity: 1.58, toxicityCoeff: 1.8 }
    };

    const g = factorMap[selectedGas] || factorMap['H2S'];
    const plumeLength = Math.round((spillMassKg * g.toxicityCoeff * 2.5) / Math.sqrt(Math.max(1, windSpeedMs)));
    const idlhRadius = Math.round(plumeLength * 0.35);
    const aegl2Radius = Math.round(plumeLength * 0.75);
    const odorRadius = Math.round(plumeLength * 1.5);

    return {
      gasName: selectedGas,
      idlhPpm: g.idlhPpm,
      vaporDensity: g.vaporDensity,
      idlhRadius,
      aegl2Radius,
      odorRadius,
      totalEvacMeters: aegl2Radius
    };
  }, [selectedGas, spillMassKg, windSpeedMs]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Hero */}
      <div className="bento-card p-6 border-red-500/30 bg-gradient-to-r from-forest-950 via-[#180a0a] to-forest-900 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-red-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="p-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400">
                <Flame className="w-5 h-5 stroke-[2.2]" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                Industrial Accident &amp; Reaction Physics Simulator
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Real-time educational kinetic sandbox modeling inadvertent chemical mixing, thermodynamic runaways, 
              vessel overpressurization, toxic gas dispersion plumes, and post-incident engineering controls.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-red-950/60 p-1.5 rounded-xl border border-red-500/30">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-red-300 uppercase tracking-wider">
              Kinetic Engine Active
            </span>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-red-500/20 overflow-x-auto">
          <button
            onClick={() => setActiveTabMode('sandbox')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTabMode === 'sandbox'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-950/50'
                : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Mixing Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTabMode('scenarios')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTabMode === 'scenarios'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-950/50'
                : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Historical Catastrophes (7 Case Studies)</span>
          </button>

          <button
            onClick={() => setActiveTabMode('dispersion')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTabMode === 'dispersion'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-950/50'
                : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Atmospheric Plume &amp; Evacuation Radius</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. INTERACTIVE MIXING SANDBOX MODE                       */}
      {/* ======================================================== */}
      {activeTabMode === 'sandbox' && (
        <div className="space-y-6">
          
          {/* Controls Bar: Select Reactants, Vessel, Controls */}
          <div className="bento-card p-5 border-emerald-500/20 bg-forest-950 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Beaker className="w-4 h-4 text-botanical-emerald" />
              <span>Configure Inadvertent Mixing Sandbox Parameters</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Chemical A Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Reactant A (Primary Substance)</label>
                <select
                  value={chemAId}
                  onChange={(e) => { setChemAId(e.target.value); setSimStep(0); setIsPlaying(false); }}
                  className="w-full bg-forest-900 border border-emerald-500/20 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-botanical-emerald"
                >
                  {INITIAL_INDUSTRIAL_INVENTORY.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.formula})</option>
                  ))}
                </select>
              </div>

              {/* Chemical B Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Reactant B (Inadvertent Ingress)</label>
                <select
                  value={chemBId}
                  onChange={(e) => { setChemBId(e.target.value); setSimStep(0); setIsPlaying(false); }}
                  className="w-full bg-forest-900 border border-emerald-500/20 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-botanical-emerald"
                >
                  {INITIAL_INDUSTRIAL_INVENTORY.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.formula})</option>
                  ))}
                </select>
              </div>

              {/* Vessel Type */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Vessel Architecture</label>
                <select
                  value={vesselType}
                  onChange={(e) => setVesselType(e.target.value)}
                  className="w-full bg-forest-900 border border-emerald-500/20 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-botanical-emerald"
                >
                  <option value="drum">Closed 200L Steel Drum (Relief 2.5 bar)</option>
                  <option value="reactor">Glass-Lined Batch Reactor (5,000L)</option>
                  <option value="flask">Laboratory Glassware (5L Round-Bottom)</option>
                  <option value="spill">Open Floor Spill / Drainage Trench</option>
                </select>
              </div>

              {/* Ambient Temp */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Ambient Initial Temperature: {ambientTemp}°C</label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={ambientTemp}
                  onChange={(e) => setAmbientTemp(parseInt(e.target.value))}
                  className="w-full accent-botanical-emerald cursor-pointer mt-2"
                />
              </div>

            </div>

            {/* Safety Interlocks Toggle */}
            <div className="pt-3 border-t border-emerald-500/10 flex flex-wrap items-center gap-4 text-xs">
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Active Safeguards:</span>

              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCoolingJacket}
                  onChange={(e) => setHasCoolingJacket(e.target.checked)}
                  className="rounded accent-botanical-emerald"
                />
                <span className="text-slate-300">Cooling Jacket Active</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasReliefValve}
                  onChange={(e) => setHasReliefValve(e.target.checked)}
                  className="rounded accent-botanical-emerald"
                />
                <span className="text-slate-300">Rupture Disc / Relief Valve</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasScrubber}
                  onChange={(e) => setHasScrubber(e.target.checked)}
                  className="rounded accent-botanical-emerald"
                />
                <span className="text-slate-300">Caustic Vapor Scrubber</span>
              </label>
            </div>
          </div>

          {/* Workbench: Visual Animated Vessel & Live Physical Readouts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Animated Chemical Reactor Vessel & Controls (7 cols) */}
            <div className="lg:col-span-7 bento-card p-6 border-red-500/20 bg-forest-950 flex flex-col justify-between space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-emerald-500/15 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pairwise Compatibility Assessment</span>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono ${
                      isDanger ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                      isCaution ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}>
                      {interaction.status || "COMPATIBLE"}
                    </span>
                    <span className="text-xs font-bold text-white truncate max-w-sm">
                      {interaction.hazardTitle || "No Acute Hazard"}
                    </span>
                  </div>
                </div>

                {/* Scrubber step buttons */}
                <div className="flex items-center space-x-1 bg-forest-900 p-1 rounded-xl border border-emerald-500/20">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-lg bg-botanical-emerald text-forest-950 font-bold hover:scale-105 transition"
                    title={isPlaying ? "Pause" : "Play Simulation"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <button
                    onClick={() => { setSimStep(0); setIsPlaying(false); setEmergencyDelugeActive(false); setQuenchActive(false); }}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                    title="Reset Simulation"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Animated Reactor Vessel Graphic */}
              <div className="relative h-64 bg-forest-900/60 rounded-2xl border border-emerald-500/20 overflow-hidden flex items-center justify-center">
                
                {/* Background grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

                {/* Vessel body container */}
                <div className={`relative w-48 h-56 rounded-b-3xl rounded-t-lg border-4 transition-all duration-700 flex flex-col justify-end p-2 overflow-hidden shadow-2xl ${
                  dynamicPhysics.pressure > 6.0 ? 'border-red-500 animate-bounce' :
                  dynamicPhysics.temp > 100 ? 'border-amber-500 shadow-amber-500/20' :
                  'border-emerald-500/40'
                } bg-slate-950`}>
                  
                  {/* Escaping Vapor Plume */}
                  {dynamicPhysics.gasPpm > 100 && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <div className={`w-16 h-12 rounded-full blur-md animate-pulse ${
                        isDanger ? 'bg-amber-500/70' : 'bg-slate-300/40'
                      }`} />
                      <span className="text-[9px] font-mono font-bold text-red-400 tracking-wider">
                        {isDanger ? 'TOXIC VAPOR PLUME' : 'STEAM'}
                      </span>
                    </div>
                  )}

                  {/* Liquid reaction volume */}
                  <div 
                    className={`w-full rounded-b-2xl transition-all duration-700 relative overflow-hidden flex items-center justify-center ${
                      simStep === 0 ? 'bg-cyan-600/30 h-24' :
                      isDanger && simStep >= 3 ? 'bg-gradient-to-t from-red-600 via-amber-500 to-yellow-400 h-44 animate-pulse' :
                      isDanger ? 'bg-gradient-to-t from-amber-700 to-amber-500 h-36' :
                      'bg-emerald-600/40 h-28'
                    }`}
                  >
                    {/* Boiling bubbles */}
                    {simStep > 0 && isDanger && (
                      <div className="absolute inset-0 flex justify-around items-end pb-2 opacity-80">
                        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                        <span className="w-3.5 h-3.5 rounded-full bg-yellow-200 animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-white animate-ping delay-100" />
                      </div>
                    )}
                    <span className="font-mono text-[10px] font-black text-white drop-shadow">
                      {simStep === 0 ? 'Quiescent State' : dynamicPhysics.status}
                    </span>
                  </div>

                </div>

                {/* Overpressure / Rupture indicator */}
                {dynamicPhysics.pressure >= 7.0 && (
                  <div className="absolute top-4 right-4 p-2 rounded-xl bg-red-950 border border-red-500 text-red-400 text-xs font-black animate-pulse flex items-center space-x-1.5 shadow-lg shadow-red-950">
                    <AlertOctagon className="w-4 h-4" />
                    <span>VESSEL INTEGRITY BREACHED</span>
                  </div>
                )}
              </div>

              {/* Step progression buttons */}
              <div className="grid grid-cols-5 gap-2">
                {['T+0s Initiation', 'T+2s Mixing', 'T+6s Runaway', 'T+12s Peak Burst', 'T+20s Dispersion'].map((name, idx) => (
                  <button
                    key={name}
                    onClick={() => { setSimStep(idx); setIsPlaying(false); }}
                    className={`p-2 rounded-xl text-center text-[10px] font-bold border transition ${
                      simStep === idx
                        ? 'bg-red-900 border-red-500 text-white shadow-md'
                        : 'bg-forest-900/60 border-emerald-500/15 text-slate-400 hover:bg-forest-900'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>

              {/* Live Operator Emergency Interventions */}
              <div className="pt-4 border-t border-emerald-500/15 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-300">Active Mitigation Drill:</span>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setEmergencyDelugeActive(!emergencyDelugeActive)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                      emergencyDelugeActive
                        ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                        : 'bg-forest-900 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/50'
                    }`}
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    <span>{emergencyDelugeActive ? 'Deluge Active (-50°C)' : 'Deploy Water Deluge'}</span>
                  </button>

                  <button
                    onClick={() => setQuenchActive(!quenchActive)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                      quenchActive
                        ? 'bg-botanical-emerald text-black shadow-lg shadow-botanical-emerald/30'
                        : 'bg-forest-900 border border-emerald-500/30 text-botanical-lime hover:bg-emerald-950/50'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{quenchActive ? 'Quench Injected (95% Neutral)' : 'Inject Scrubber Quench'}</span>
                  </button>

                  <button
                    onClick={() => setSirenActive(!sirenActive)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                      sirenActive
                        ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                        : 'bg-forest-900 border border-red-500/30 text-red-400 hover:bg-red-950/50'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{sirenActive ? 'Siren Sounding (Evacuating)' : 'Evacuation Siren'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right: Simulated Physical Gauges & Kinetic Graph (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Gauges Card */}
              <div className="bento-card p-5 border-emerald-500/20 bg-forest-950 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                  <Gauge className="w-4 h-4 text-botanical-lime" />
                  <span>Real-Time Simulated Reactor Telemetry</span>
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Temperature Readout */}
                  <div className="p-3.5 rounded-xl bg-forest-900/80 border border-emerald-500/15">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-[10px] uppercase font-bold">Core Temp</span>
                      <Thermometer className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-black font-mono text-white">
                      {dynamicPhysics.temp} <span className="text-xs font-sans text-slate-400">°C</span>
                    </div>
                    <div className={`text-[10px] font-bold mt-1 ${
                      dynamicPhysics.temp > 100 ? 'text-red-400' : dynamicPhysics.temp > 50 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {dynamicPhysics.temp > 100 ? 'Above Boiling / Vaporizing' : dynamicPhysics.temp > 50 ? 'Exothermic Rise' : 'Ambient Safe'}
                    </div>
                  </div>

                  {/* Pressure Readout */}
                  <div className="p-3.5 rounded-xl bg-forest-900/80 border border-emerald-500/15">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-[10px] uppercase font-bold">Vessel Pressure</span>
                      <Gauge className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="text-2xl font-black font-mono text-white">
                      {dynamicPhysics.pressure} <span className="text-xs font-sans text-slate-400">bar</span>
                    </div>
                    <div className={`text-[10px] font-bold mt-1 ${
                      dynamicPhysics.pressure > 6.0 ? 'text-red-400' : dynamicPhysics.pressure > 3.0 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {dynamicPhysics.pressure > 6.0 ? 'Vessel Burst Hazard' : dynamicPhysics.pressure > 3.0 ? 'Relief Valve Open' : 'Atmospheric (1.0)'}
                    </div>
                  </div>

                  {/* Gas Concentration Readout */}
                  <div className="p-3.5 rounded-xl bg-forest-900/80 border border-emerald-500/15">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-[10px] uppercase font-bold">Gas Plume Peak</span>
                      <Wind className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-2xl font-black font-mono text-white">
                      {dynamicPhysics.gasPpm} <span className="text-xs font-sans text-slate-400">ppm</span>
                    </div>
                    <div className={`text-[10px] font-bold mt-1 ${
                      dynamicPhysics.gasPpm > 500 ? 'text-red-400' : dynamicPhysics.gasPpm > 100 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {dynamicPhysics.gasPpm > 500 ? 'Lethal IDLH Level' : dynamicPhysics.gasPpm > 100 ? 'OSHA Evacuation' : 'Clean Breathing'}
                    </div>
                  </div>

                  {/* Cloud Dispersion Radius */}
                  <div className="p-3.5 rounded-xl bg-forest-900/80 border border-emerald-500/15">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-[10px] uppercase font-bold">Plume Radius</span>
                      <Radio className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="text-2xl font-black font-mono text-white">
                      {dynamicPhysics.cloudRadius} <span className="text-xs font-sans text-slate-400">meters</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Calculated Evac Buffer
                    </div>
                  </div>

                </div>
              </div>

              {/* Kinetic Temperature / Pressure Curve Chart */}
              <div className="bento-card p-5 border-emerald-500/20 bg-forest-950">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                  Reaction Kinetic Profiles (Temp &amp; Pressure vs Time)
                </h4>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sandboxChartData}>
                      <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#10b981', fontSize: '11px' }} />
                      <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2.5} name="Temp (°C)" dot />
                      <Line type="monotone" dataKey="pressure" stroke="#f43f5e" strokeWidth={2.5} name="Pressure (bar)" dot />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. HISTORICAL ACCIDENT SCENARIOS MODE                    */}
      {/* ======================================================== */}
      {activeTabMode === 'scenarios' && (
        <div className="space-y-6">
          
          {/* Scenario Selector Horizontal Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {SIMULATION_SCENARIOS.map((s, idx) => {
              const isSelected = selectedScenarioIndex === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedScenarioIndex(idx);
                    setScenarioStageIndex(0);
                  }}
                  className={`p-3.5 rounded-xl text-left border transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-red-950/40 border-red-500 text-white shadow-lg shadow-red-950/50'
                      : 'bg-[#0b1324] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold block mb-1">
                      {s.industry}
                    </span>
                    <h4 className="font-bold text-xs text-white leading-tight mb-2 line-clamp-2">
                      {s.title}
                    </h4>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono truncate">
                    {s.substanceA} + {s.substanceB}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scenario Details Workbench */}
          <div className="bento-card p-6 border-red-500/30 bg-forest-950 space-y-6">
            
            {/* Top Scenario Title & Chemical Equation */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-500/15 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Case Study #{selectedScenarioIndex + 1} • {scenario.industry}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{scenario.title}</h3>
                <p className="text-xs text-slate-300 font-mono mt-1 text-amber-300">
                  {scenario.chemicalEquation}
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-500/40 text-right">
                <span className="block text-[10px] uppercase font-bold text-red-400">Peak Lethal Plume</span>
                <span className="text-lg font-black font-mono text-white">{scenario.maxGasPpm} ppm</span>
              </div>
            </div>

            {/* Stage Scrubber Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {scenario.stages.map((stg, idx) => (
                <button
                  key={stg.time}
                  onClick={() => setScenarioStageIndex(idx)}
                  className={`p-3.5 rounded-xl text-left border transition ${
                    scenarioStageIndex === idx
                      ? 'bg-red-900/60 border-red-500 text-white shadow-lg'
                      : 'bg-forest-900/50 border-emerald-500/10 text-slate-400 hover:bg-forest-900'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs font-bold mb-1">
                    <span className="text-amber-300">{stg.time}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                      stg.alertLevel === 'FATAL' ? 'bg-red-500 text-white' :
                      stg.alertLevel === 'CRITICAL' ? 'bg-amber-500 text-black' :
                      stg.alertLevel === 'WARNING' ? 'bg-yellow-500 text-black' :
                      'bg-emerald-500 text-black'
                    }`}>
                      {stg.alertLevel}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-white">{stg.phase}</h5>
                </button>
              ))}
            </div>

            {/* Current Stage Description & Gauge Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-forest-900/60 p-5 rounded-2xl border border-emerald-500/15">
              
              <div className="md:col-span-7 space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Timeline Progress: <strong className="text-white">{stage.time}</strong> • {stage.phase}
                </span>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {stage.description}
                </p>

                <div className="pt-3 border-t border-emerald-500/10">
                  <span className="text-xs font-bold text-amber-400 block mb-1">Recommended Emergency Response:</span>
                  <p className="text-xs text-slate-300">
                    {stage.alertLevel === 'FATAL' 
                      ? 'Execute immediate upwind/crosswind evacuation to minimum ' + scenario.evacRadiusMeters + 'm buffer. Entry permitted exclusively for Level A HazMat personnel with SCBA.'
                      : 'Sound local area alarm, shut off transfer pump emergency stops, and initiate automated scrubber deluge.'}
                  </p>
                </div>
              </div>

              <div className="md:col-span-5 grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl bg-forest-950 border border-emerald-500/10">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Temperature</span>
                  <span className="text-xl font-black font-mono text-amber-300">{stage.temp}°C</span>
                </div>
                <div className="p-3 rounded-xl bg-forest-950 border border-emerald-500/10">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Pressure</span>
                  <span className="text-xl font-black font-mono text-cyan-300">{stage.pressure} bar</span>
                </div>
                <div className="p-3 rounded-xl bg-forest-950 border border-emerald-500/10">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Gas Plume</span>
                  <span className="text-xl font-black font-mono text-red-400">{stage.gasPpm} ppm</span>
                </div>
              </div>

            </div>

            {/* Root Causes and Engineering Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-forest-900/40 border border-red-500/20 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Primary Root Causes &amp; Systemic Failures</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  {scenario.rootCauses.map((rc, idx) => (
                    <li key={idx} className="leading-relaxed">{rc}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-forest-900/40 border border-emerald-500/20 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-botanical-lime flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-botanical-emerald" />
                  <span>Mandatory OSHA / EPA Engineering Controls</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  {scenario.engineeringControls.map((ec, idx) => (
                    <li key={idx} className="leading-relaxed">{ec}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. ATMOSPHERIC PLUME & DISPERSION SIMULATOR MODE         */}
      {/* ======================================================== */}
      {activeTabMode === 'dispersion' && (
        <div className="space-y-6">
          <div className="bento-card p-6 border-cyan-500/20 bg-forest-950 space-y-6">
            
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Wind className="w-5 h-5 text-cyan-400" />
                <span>Atmospheric Vapor Cloud &amp; Evacuation Radius Estimator</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Modeled after the EPA ALOHA / DEGADIS heavy-gas dispersion algorithms to estimate safe downwind evacuation 
                buffers for high-hazard toxic releases across industrial tank yards.
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-forest-900/60 border border-emerald-500/15">
              
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Toxic Gas Released</label>
                <select
                  value={selectedGas}
                  onChange={(e) => setSelectedGas(e.target.value)}
                  className="w-full bg-forest-950 border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-botanical-emerald"
                >
                  <option value="H2S">Hydrogen Sulfide (H2S) - Tannery / Petrochem</option>
                  <option value="Cl2">Chlorine (Cl2) - Bleach Acidification</option>
                  <option value="HCl">Hydrogen Chloride (HCl) - Acyl Halide Rupture</option>
                  <option value="NH3">Ammonia (NH3) - Fertilizer / Cleanroom</option>
                  <option value="NO2">Nitrogen Dioxide (NO2) - Nitric Acid Runaway</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Spill / Release Mass: {spillMassKg} kg</label>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={spillMassKg}
                  onChange={(e) => setSpillMassKg(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer mt-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Atmospheric Wind Speed: {windSpeedMs} m/s</label>
                <input
                  type="range"
                  min="1.0"
                  max="12.0"
                  step="0.5"
                  value={windSpeedMs}
                  onChange={(e) => setWindSpeedMs(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer mt-2"
                />
              </div>

            </div>

            {/* Concentric Evacuation Radius Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500 space-y-1">
                <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Red Zone: Lethal IDLH Radius</span>
                <div className="text-3xl font-black font-mono text-red-400">{dispersionModel.idlhRadius} m</div>
                <p className="text-[11px] text-slate-300">Immediate Danger to Life or Health (&gt; {dispersionModel.idlhPpm} ppm)</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Orange Zone: AEGL-2 / ERPG-2</span>
                <div className="text-3xl font-black font-mono text-amber-400">{dispersionModel.aegl2Radius} m</div>
                <p className="text-[11px] text-slate-300">Irreversible pulmonary impairment threshold</p>
              </div>

              <div className="p-4 rounded-xl bg-yellow-950/40 border border-yellow-500 space-y-1">
                <span className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider">Yellow Zone: Odor &amp; Irritation</span>
                <div className="text-3xl font-black font-mono text-yellow-400">{dispersionModel.odorRadius} m</div>
                <p className="text-[11px] text-slate-300">Public shelter-in-place advisory boundary</p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
