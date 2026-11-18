export const GREEN_SUBSTITUTIONS = [
  {
    targetCompound: "Dichloromethane (DCM)",
    targetAliases: ["dichloromethane", "dcm", "methylene chloride", "methylene dichloride"],
    category: "Halogenated Reaction & Extraction Solvent",
    hazardLevel: "Red / Hazardous",
    primaryHazard: "IARC 2A Carcinogen, groundwater persistence, neurotoxicity, metabolizes to carboxyhemoglobin.",
    alternatives: [
      {
        name: "Ethyl Acetate",
        formula: "C4H8O2",
        cas: "141-78-6",
        greenScore: "Green / Preferred",
        pbtComparison: {
          p: "Low (Readily biodegradable in 5 days)",
          b: "Low (Log Kow: 0.73)",
          t: "Low (Non-carcinogenic, USP Class 3)"
        },
        lcaCarbonSaving: "68% CO2e Reduction",
        wasteBenefit: "Standard non-halogenated solvent drum; energy-recovering incineration or solvent recycling distillation.",
        guidance: "Ideal 1:1 drop-in replacement for standard liquid-liquid extractions, flash chromatography mobile phase, and crystallization of moderately polar APIs."
      },
      {
        name: "2-Methyltetrahydrofuran (2-MeTHF)",
        formula: "C5H10O",
        cas: "96-47-9",
        greenScore: "Green / Preferred",
        pbtComparison: {
          p: "Low (Bio-based from corncobs/furfural)",
          b: "Low",
          t: "Low (Clean aquatic profile)"
        },
        lcaCarbonSaving: "82% Renewable Carbon Footprint",
        wasteBenefit: "Easily separated from water without forming problematic azeotropes; lower distillation energy requirement.",
        guidance: "Superior for organometallic reactions, biphasic phase-transfer catalysis, and peptide synthesis where DCM was traditionally used for dissolving hydrophobic intermediates."
      },
      {
        name: "Cyclopentyl Methyl Ether (CPME)",
        formula: "C6H12O",
        cas: "5614-37-9",
        greenScore: "Green / Preferred",
        pbtComparison: {
          p: "Moderate",
          b: "Low",
          t: "Low (Low peroxide formation rate)"
        },
        lcaCarbonSaving: "55% Energy Saving in Evaporation",
        wasteBenefit: "High resistance to peroxide formation compared to THF/diethyl ether; safer long-term storage.",
        guidance: "High boiling point (106°C) enables higher reaction temperatures and cleaner API phase separation with zero chlorinated waste."
      }
    ]
  },
  {
    targetCompound: "Chloroform",
    targetAliases: ["chloroform", "trichloromethane"],
    category: "Chlorinated Reaction / Extraction Solvent",
    hazardLevel: "Red / Hazardous",
    primaryHazard: "Hepatotoxic, nephrotoxic, suspected carcinogen, generates phosgene upon light exposure.",
    alternatives: [
      {
        name: "Ethyl Acetate / Ethanol (3:1 blend)",
        formula: "C4H8O2 / C2H6O",
        cas: "141-78-6 / 64-17-5",
        greenScore: "Green / Preferred",
        pbtComparison: {
          p: "Low",
          b: "Low",
          t: "Low (USP Class 3 solvents)"
        },
        lcaCarbonSaving: "74% Lifecycle Footprint Cut",
        wasteBenefit: "Directly recyclable or clean fuel blending without halogenated acid scrubbing overhead.",
        guidance: "Mimics the polarity index (4.1) of chloroform for silica chromatography and alkaloid natural product extractions."
      },
      {
        name: "Anisole",
        formula: "C7H8O",
        cas: "100-66-3",
        greenScore: "Green / Preferred",
        pbtComparison: {
          p: "Low",
          b: "Low",
          t: "Low"
        },
        lcaCarbonSaving: "45% Lower Carbon Intensity",
        wasteBenefit: "Biodegradable aromatic ether; safe for biological wastewater treatment after dilution.",
        guidance: "Replaces chloroform and chlorobenzene in high-temperature aromatic substitution and synthesis."
      }
    ]
  },
  {
    targetCompound: "Sebacoyl Chloride",
    targetAliases: ["sebacoyl chloride", "sebacoyl dichloride"],
    category: "Reactive Acylating Reagent",
    hazardLevel: "Red / Hazardous",
    primaryHazard: "Violent hydrolysis releasing choking HCl gas, high acute inhalation toxicity, severe corrosive hazard.",
    alternatives: [
      {
        name: "Enzymatic Lipase-Catalyzed Esterification (Novozym 435)",
        formula: "Biocatalyst",
        cas: "9001-62-1",
        greenScore: "Green / Preferred",
        pbtComparison: {
          p: "Zero (Biopolymeric enzyme)",
          b: "Zero",
          t: "Zero (Non-toxic food-grade protein)"
        },
        lcaCarbonSaving: "90% Reaction Energy & Waste Reduction",
        wasteBenefit: "No acid gas generation; heterogeneous catalyst filtered and reused 20+ cycles.",
        guidance: "Replaces acid chlorides in microencapsulation and polyester/polyamide drug delivery synthesis under mild 40°C conditions without requiring toxic base scavengers like triethylamine."
      },
      {
        name: "EDC / NHS Carbodiimide Coupling System in Water",
        formula: "C8H17N3.HCl",
        cas: "25952-53-8",
        greenScore: "Yellow / Moderate",
        pbtComparison: {
          p: "Low",
          b: "Low",
          t: "Moderate"
        },
        lcaCarbonSaving: "40% Process Mass Intensity (PMI) improvement",
        wasteBenefit: "Water-soluble urea byproduct is easily removed by aqueous washing rather than corrosive scrubbing.",
        guidance: "Enables benign amide and ester coupling directly from free sebacic acid at neutral pH in water/ethanol mixtures."
      }
    ]
  },
  {
    targetCompound: "Hexane",
    targetAliases: ["hexane", "n-hexane"],
    category: "Non-Polar Hydrocarbon Solvent",
    hazardLevel: "Red / Hazardous",
    primaryHazard: "Neurotoxic (metabolized to 2,5-hexanedione causing peripheral neuropathy), high VOC emissions.",
    alternatives: [
      {
        name: "Heptane (Pharmaceutical Grade)",
        formula: "C7H16",
        cas: "142-82-5",
        greenScore: "Green / Preferred",
        pbtComparison: {
          p: "Low",
          b: "Moderate",
          t: "Low (Non-neurotoxic pathway)"
        },
        lcaCarbonSaving: "30% Lower VOC Evaporation Loss",
        wasteBenefit: "High boiling point minimizes fugitive atmospheric emissions; easily recovered via condensation.",
        guidance: "Exact solubility match for API anti-solvent precipitation, crystallization, and preparative HPLC without human neurotoxicity."
      },
      {
        name: "Cyclohexane",
        formula: "C6H12",
        cas: "110-82-7",
        greenScore: "Yellow / Caution",
        pbtComparison: {
          p: "Low",
          b: "Moderate",
          t: "Moderate (Aquatic toxicity caution)"
        },
        lcaCarbonSaving: "25% Improved Process Efficiency",
        wasteBenefit: "Readily incinerated clean CO2/H2O without halogenated emissions.",
        guidance: "Ideal alternative when specific steric crystallization geometries require cyclic hydrocarbon kinetics."
      }
    ]
  },
  {
    targetCompound: "Dimethylformamide (DMF)",
    targetAliases: ["dimethylformamide", "dmf", "n,n-dimethylformamide"],
    category: "Polar Aprotic Solvent",
    hazardLevel: "Red / Hazardous",
    primaryHazard: "Reproductive toxicant (EU REACH SVHC), embryotoxic, skin-permeating systemic organ toxin.",
    alternatives: [
      {
        name: "Cyrene (Dihydrolevoglucosenone)",
        formula: "C6H8O3",
        cas: "53716-82-8",
        greenScore: "Green / Preferred",
        pbtComparison: {
          p: "Low (100% bio-based from cellulose waste)",
          b: "Low",
          t: "Low (Zero reproductive toxicity)"
        },
        lcaCarbonSaving: "85% LCA Greenhouse Gas Cut",
        wasteBenefit: "Fully biodegradable in non-toxic water-soluble metabolites; non-mutagenic.",
        guidance: "Breakthrough green solvent matching dipolar aprotic polarity of DMF for peptide synthesis, coupling reactions, and membrane casting."
      },
      {
        name: "Dimethyl Sulfoxide (DMSO)",
        formula: "C2H6OS",
        cas: "67-68-5",
        greenScore: "Green / Preferred",
        pbtComparison: {
          p: "Low",
          b: "Low",
          t: "Low (USP Class 3 solvent)"
        },
        lcaCarbonSaving: "50% Lower Inherent Toxicity Profile",
        wasteBenefit: "Biodegradable in specialized sulfur-reducing biomes.",
        guidance: "Universally accepted pharmaceutical solvent with high solvency for intractable synthetic small molecules."
      }
    ]
  }
];

