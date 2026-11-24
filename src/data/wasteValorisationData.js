/**
 * INDUSTRIAL WASTE VALORISATION & REUSE KNOWLEDGE BASE
 * Covers Leather Tanning, Cosmetics, and Pharmaceutical Industries.
 * Strictly adheres to CPCB/MPCB Hazardous Waste Management Rules 2016, 
 * US EPA RCRA, and EU REACH Circular Economy frameworks.
 */

export const WASTE_INDUSTRIES = [
  {
    id: "leather",
    name: "Leather Tanning Industry",
    shortName: "Leather Tanning",
    icon: "Layers",
    color: "#f59e0b",
    badge: "Heavy Organic & Chrome Streams",
    description: "Processing raw hides into leather generates high proteinaceous solid wastes, chromium-containing shavings, and high-BOD/COD effluents."
  },
  {
    id: "cosmetics",
    name: "Cosmetics Industry",
    shortName: "Cosmetics & Personal Care",
    icon: "Sparkles",
    color: "#10b981",
    badge: "Lipid, Polyol & Surfactant Streams",
    description: "Formulation and packaging produce off-spec emulsions, fatty acid residues, crude glycerol, waxes, surplus surfactants, and botanical pomace."
  },
  {
    id: "pharma",
    name: "Pharmaceutical Industry",
    shortName: "Pharmaceuticals & Biotech",
    icon: "FlaskConical",
    color: "#8b5cf6",
    badge: "High-Potency & Chemical Synthesis Streams",
    description: "API synthesis and drug product manufacturing generate hazardous mother liquors, spent fermentation broths, packaging blisters, and regulated solid wastes."
  }
];

export const VERIFIED_WASTE_STREAMS = [
  // =========================================================================
  // A. LEATHER TANNING INDUSTRY (6 Waste Streams)
  // =========================================================================
  {
    id: "waste-leather-1",
    industryId: "leather",
    industryName: "Leather Tanning Industry",
    category: "Solid Proteinaceous Untanned Waste",
    name: "Leather Trimmings and Scraps (Raw / Untanned)",
    synonyms: ["Raw hide trimmings", "Beamhouse untanned cuttings", "Limed split trimmings"],
    typicalComposition: "Type I Collagen protein (70–82% dry basis), Water (55–65%), Lime/Calcium hydroxide (3–6%), Natural lipids (2–5%), Ash (4–7%). Free of chromium.",
    physicalState: "Fibrous Solid Pieces / Offcuts",
    hazardLevel: "Low (Non-Hazardous Industrial Biomass)",
    environmentalConcerns: "Rapid putrefaction if left untreated, foul hydrogen sulfide and ammonia odors, elevated organic load in stormwater runoff, vermin attraction.",
    recommendedRecoveryMethod: {
      name: "Alkaline-Enzymatic De-liming & Controlled Thermal Gelatin Extraction",
      scientificExplanation: "Untanned hide trimmings are washed to remove residual salts, de-limed with ammonium sulfate or carbon dioxide, and neutralized to pH 6.0–7.0. Controlled thermal hydrolysis at 65–80°C cleaves triple-helix collagen telopeptides into water-soluble gelatin and polypeptide chains without denaturing primary amino acid sequences.",
      requiredProcessing: "1. Mechanical shredding & wash; 2. De-liming (pH adjustment to 6.5); 3. Thermal extraction (70°C, 4 hours); 4. Plate-and-frame filtration; 5. Vacuum evaporation & spray drying."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "Technical-Grade Gelatin & Collagen Hydrolysate Peptides",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Biodegradable adhesive binder for plywood, paperboard, and abrasive sandpaper manufacture.",
          "Protective colloid and micro-encapsulation shell for controlled-release agrochemical formulations.",
          "Industrial animal feed nitrogen supplement (strictly untanned & certified pathogen-free)."
        ],
        targetIndustries: ["Agrochemicals & Fertilizers", "Paper & Wood Packaging", "Construction & Building Materials"],
        crossIndustryPathway: "Converts beamhouse beam waste into nitrogen-rich bio-adhesives, replacing synthetic formaldehyde-based resins in wood and paper manufacturing."
      },
      {
        recoveredMaterial: "Proteinaceous Soil Biostimulant & Amino Acid Chelate",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Foliar spray rich in proline, glycine, and hydroxyproline for drought and thermal stress resistance in crops.",
          "Organic nitrogen fertilizer matrix with sustained soil release kinetics."
        ],
        targetIndustries: ["Agrochemicals & Fertilizers", "Commercial Agriculture"],
        crossIndustryPathway: "Transfers animal collagen protein directly into agricultural crop enhancers, reducing reliance on synthetic urea."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 88,
      co2AbatementKgPerTon: 740,
      resourceConservation: "Replaces petroleum-derived urea-formaldehyde resins and synthetic amino acid fertilizers.",
      circularityIndex: 91
    },
    safetyAndFeasibility: {
      contaminationRisks: "Bacterial spoilage (Bacillus, Clostridium), high chloride salts from curing, residual sulfide traces.",
      mandatoryQualityChecks: "Total Kjeldahl Nitrogen (TKN >= 14%), Heavy metals ICP-MS (Cr < 1 ppm, As < 0.5 ppm), Total Viable Count (TVC < 1000 CFU/g), Hydroxyproline content assay.",
      regulatoryConsiderations: "CPCB/MPCB Schedule I (Non-hazardous bio-waste); must possess certified veterinary clear state if utilized for animal feed or biostimulants.",
      feasibilityRating: "High",
      feasibilityExplanation: "High market demand for non-petroleum bio-glues and organic amino acid fertilizers; untanned trimmings possess high protein yield (80%+ dry weight).",
      restrictedApplications: "Prohibited from direct human food or pharmaceutical gelatin grade unless processed in an FDA/GMP certified food-grade facility with dedicated raw hide traceability."
    }
  },

  {
    id: "waste-leather-2",
    industryId: "leather",
    industryName: "Leather Tanning Industry",
    category: "Hazardous Chromium-Tanned Solid Waste",
    name: "Chromium-Containing Leather Waste (Wet Blue Shavings & Splits)",
    synonyms: ["Wet blue shavings", "Chrome splits", "Buffing dust", "Tanned leather scraps"],
    typicalComposition: "Collagen-Chromium cross-linked matrix (70–78% organic), Chromium(III) oxide (2.5–4.5% as Cr2O3), Moisture (35–45%), Fatliquoring oils (2–6%), Residual sulfate salts (3–5%).",
    physicalState: "Fine Fibrous Blue Shavings / Shavings Flakes",
    hazardLevel: "Critical / Hazardous (Heavy Metal Contaminated)",
    environmentalConcerns: "CRITICAL HAZARD: Under improper thermal or aerobic composting conditions, trivalent chromium Cr(III) can oxidize into carcinogenic, mutagenic, water-soluble Hexavalent Chromium Cr(VI). Prohibited from unrestricted landfilling.",
    recommendedRecoveryMethod: {
      name: "Two-Stage Alkaline-Acidic Hydrolysis with Closed-Loop Cr(III) Precipitation",
      scientificExplanation: "Wet blue shavings are treated with magnesium oxide (MgO) or sodium hydroxide at 75–85°C to break collagen peptide bonds while precipitating chromium as insoluble Chromium(III) hydroxide [Cr(OH)3]. The solid Cr(OH)3 cake is separated via centrifuge, dissolved in concentrated sulfuric acid (H2SO4) to regenerate Basic Chromium Sulfate [Cr(OH)SO4] tanning liquor. The clarified protein supernatant is hydrolysed into chrome-free peptides.",
      requiredProcessing: "1. Alkaline de-chroming (pH 9.5–10.2 with MgO/Ca(OH)2); 2. Decanter centrifuge cake separation; 3. Acid re-dissolution of chrome cake with 98% H2SO4; 4. Re-crystallization of BCS; 5. Ultrafiltration of protein liquor."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "Regenerated Basic Chromium Sulfate (BCS) Tanning Liquor",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Closed-loop re-use in tannery pickling and tanning drums at 25–35% recycled chrome replacement ratio.",
          "Inorganic chromium mordant and pigment base in textile dye synthesis (industrial grade only)."
        ],
        targetIndustries: ["Leather Tanning (Closed-Loop)", "Textile Dyeing & Pigments"],
        crossIndustryPathway: "Supplies secondary chromium salt back to tanneries or industrial pigment formulators, eliminating primary chromium ore mining and toxic sludge dump."
      },
      {
        recoveredMaterial: "De-Chromed Collagen Hydrolysate & Retanning Agent",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Eco-friendly proteinaceous retanning and filling agent (substituting formaldehyde syntans).",
          "Retarder in plasterboard and gypsum wallboard manufacture for the construction sector."
        ],
        targetIndustries: ["Construction & Building Materials", "Leather Auxiliary Chemicals"],
        crossIndustryPathway: "Routes de-chromed hydrolysates into construction plasterboard to optimize gypsum setting time, replacing commercial synthetic retarders."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 94,
      co2AbatementKgPerTon: 1850,
      resourceConservation: "Directly conserves imported chromite ore and prevents hazardous waste dump into TSDF cells.",
      circularityIndex: 94
    },
    safetyAndFeasibility: {
      contaminationRisks: "CRITICAL: Hexavalent Chromium Cr(VI) formation, residual basic chromium salts, organohalogen biocide residues (e.g., TCMTB).",
      mandatoryQualityChecks: "Hexavalent Chromium test (ISO 17075 spectrophotometric / HPLC, Cr(VI) MUST BE < 0.5 ppm / Non-Detectable), Total Chromium ICP-OES, Residual protein ash content.",
      regulatoryConsiderations: "CPCB/MPCB Schedule II (Hazardous Class A8). Movement requires Manifest Form 10 and authorized GPS-tracked hazardous waste transport. Strictly regulated under REACH Annex XVII Entry 47.",
      feasibilityRating: "High",
      feasibilityExplanation: "High economic incentive due to rising virgin chromium chemical prices. Closed-loop recycling plants operate at commercial scale in leather tanning clusters worldwide.",
      restrictedApplications: "ABSOLUTELY PROHIBITED from human food, cosmetic ingredients, animal feed, agricultural soil application, and unlined landfilling."
    }
  },

  {
    id: "waste-leather-3",
    industryId: "leather",
    industryName: "Leather Tanning Industry",
    category: "Organic Lipid & Keratin Waste",
    name: "Hair and Fleshings (Beamhouse Unhaired Hide & Subcutaneous Fat)",
    synonyms: ["Limed fleshings", "Fleshing waste", "Animal subcutaneous fat scraps", "Keratin hair residue"],
    typicalComposition: "Water (60–75%), Subcutaneous lipid/tallow (15–28%), Protein/Keratin (8–14%), Lime/Sulfide salts (2–5%), pH 11.0–12.5.",
    physicalState: "Gelatinous Viscous Solid / Fatty Slabs",
    hazardLevel: "Medium (High Putrescibility & Sulfide Content)",
    environmentalConcerns: "Extremely rapid decomposition producing foul mercaptans and toxic H2S vapors; massive grease clogs in drainage networks; high Chemical Oxygen Demand (COD > 120,000 mg/L).",
    recommendedRecoveryMethod: {
      name: "Thermal Rendering & Pressure Degreasing coupled with Anaerobic Co-Digestion",
      scientificExplanation: "Limed fleshings undergo mechanical chopping and thermal rendering at 90–95°C under mild steam pressure. The melted animal tallow separates from the aqueous protein phase by three-phase centrifugal decantation. The rendered tallow is esterified or refined, while the protein-rich residual water is de-sulfurized and fed to high-rate anaerobic biomethanation reactors.",
      requiredProcessing: "1. Neutralization & mechanical shredding; 2. Steam rendering (95°C); 3. Decanter centrifugation (oil-water-solids); 4. Tallow bleaching & drying; 5. Anaerobic digestion of aqueous slurry."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "Industrial Technical Tallow & Fatty Acids",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Precursor for industrial tallow fatty acid methyl ester (FAME) biodiesel production.",
          "Raw material for industrial-grade lubricating greases, leather fatliquoring emulsions, and metalworking coolants.",
          "Saponification feedstock for commercial laundry soaps and industrial surfactants."
        ],
        targetIndustries: ["Biofuels & Energy", "Soap & Industrial Detergents", "Machinery Lubricants"],
        crossIndustryPathway: "Channels waste hide fats into commercial biofuels and metalworking lubricants, decoupling industrial oils from palm oil and petrochemical sources."
      },
      {
        recoveredMaterial: "Biomethane (Renewable Natural Gas) & Digestate Bio-fertilizer",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "On-site thermal energy generation (steam boilers) replacing furnace oil or LPG.",
          "High-nitrogen composted digestate for forestry and soil erosion control."
        ],
        targetIndustries: ["Power & Energy Utilities", "Forestry & Soil Remediation"],
        crossIndustryPathway: "Transforms high-COD beamhouse waste directly into green electricity or boiler steam, lowering the tannery cluster's carbon footprint."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 92,
      co2AbatementKgPerTon: 1120,
      resourceConservation: "Replaces petroleum diesel (1 ton tallow yields ~950 L biodiesel) and virgin tallow oils.",
      circularityIndex: 89
    },
    safetyAndFeasibility: {
      contaminationRisks: "Entrained sodium sulfide (H2S gas hazard during acidification), free fatty acid acidity (FFA > 15%), residual pathogenic microbes.",
      mandatoryQualityChecks: "Free Fatty Acid (FFA %) titration, Saponification value (190–205 mg KOH/g), Moisture & Insoluble impurities (< 1.5%), Residual sulfide test.",
      regulatoryConsiderations: "Rendering plants must maintain odor abatement scrubbers (acid-hypochlorite) per CPCB air pollution norms. Tallow must be tested for BSE risk factors if exported.",
      feasibilityRating: "High",
      feasibilityExplanation: "Highly profitable secondary product; biodiesel plants actively purchase industrial tallow at steady bulk commodity pricing.",
      restrictedApplications: "Prohibited from human edible fats or dairy feed. Restricted to non-food industrial soaps, technical lubricants, and biofuels."
    }
  },

  {
    id: "waste-leather-4",
    industryId: "leather",
    industryName: "Leather Tanning Industry",
    category: "Inorganic & Organic Sludge",
    name: "Tannery Effluent Treatment Plant (ETP) Sludge",
    synonyms: ["Primary chemical sludge", "Chrome ETP sludge", "Biological secondary sludge cake"],
    typicalComposition: "Moisture (65–80% filter cake), Chromium(III) hydroxide (1.5–3.8% dry basis), Calcium sulfate/gypsum (25–40%), Organic biomass (15–25%), Silica/Silicates (10–18%).",
    physicalState: "Moist De-watered Filter Cake (Grey-Green)",
    hazardLevel: "Critical / Hazardous (Classified Hazardous Waste)",
    environmentalConcerns: "Leachable chromium, high total dissolved solids (TDS), sulfurous emissions during storage, potential contamination of underground aquifers.",
    recommendedRecoveryMethod: {
      name: "High-Temperature Vitrification into Ceramic Aggregates & Eco-Bricks",
      scientificExplanation: "De-watered ETP sludge is dried, pulverized, and blended with clay, fly ash, and sand at 15–25% substitution ratios. Firing in a rotary kiln or brick furnace at 1050–1150°C immobilizes heavy metal ions within an amorphous glassy aluminosilicate crystalline matrix (vitrification), preventing metal leaching while destroying organic foulants.",
      requiredProcessing: "1. Solar or mechanical thermal drying (moisture < 15%); 2. Micro-pulverization; 3. Blending with quarry clay/fly ash; 4. Extrusion into perforated bricks; 5. High-temperature firing (1100°C)."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "Vitrified Eco-Bricks & Sintered Lightweight Aggregates",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Load-bearing construction bricks and paving blocks conforming to IS 1077 / ASTM C62.",
          "Lightweight aggregate for precast concrete slabs, sub-base road pavement, and acoustic panels."
        ],
        targetIndustries: ["Construction & Building Materials", "Road & Infrastructure Engineering"],
        crossIndustryPathway: "Encapsulates toxic tannery sludge into certified structural bricks, saving fertile topsoil clay and reducing quarrying."
      },
      {
        recoveredMaterial: "Alternative Raw Material (ARM) for Cement Clinker Kilns",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Co-processing in high-temperature (1450°C) cement rotary kilns where calcium, iron, and silica act as mineralizers.",
          "Complete thermal destruction of organics with non-leachable metal binding in clinker silicate phases."
        ],
        targetIndustries: ["Cement Manufacturing"],
        crossIndustryPathway: "Converts hazardous ETP sludge into raw mineralizer and ash for Portland cement, eliminating dedicated hazardous landfill cells."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 96,
      co2AbatementKgPerTon: 620,
      resourceConservation: "Conserves natural topsoil clay, limestone, and quarry aggregates.",
      circularityIndex: 82
    },
    safetyAndFeasibility: {
      contaminationRisks: "Toxicity Characteristic Leaching Procedure (TCLP) failure if firing temperature is < 1000°C; fugitive Cr(VI) emissions.",
      mandatoryQualityChecks: "TCLP Leachate test (Cr < 5.0 mg/L, Pb < 5.0 mg/L), Compressive strength (> 7.5 N/mm2), Water absorption (< 15%), Kiln off-gas monitoring.",
      regulatoryConsiderations: "Mandatory CPCB / State Pollution Control Board co-processing authorization under Rule 9 of Hazardous Wastes Rules 2016.",
      feasibilityRating: "Medium",
      feasibilityExplanation: "Technically mature; requires partnership with local brick kilns or cement plants possessing high-temperature scrubbing infrastructure.",
      restrictedApplications: "Prohibited from use in residential interior plasters or agricultural ground preparation."
    }
  },

  {
    id: "waste-leather-5",
    industryId: "leather",
    industryName: "Leather Tanning Industry",
    category: "High-Strength Liquid Effluent",
    name: "Wastewater Containing High Organic Matter & Dissolved Proteins",
    synonyms: ["Soaking effluent", "Liming & unhairing liquor", "Spent beamhouse liquor"],
    typicalComposition: "COD (25,000–65,000 mg/L), BOD (12,000–30,000 mg/L), Total Dissolved Solids (30,000–60,000 mg/L), Suspended Solids (10,000–25,000 mg/L), Sulfide (800–2,500 mg/L), pH 10.5–12.5.",
    physicalState: "Opaque Dark Turbid Liquid",
    hazardLevel: "High (High Aquatic Toxicity & Sulfide Hazard)",
    environmentalConcerns: "Catastrophic oxygen depletion in receiving water bodies, fish suffocation, toxic H2S gas evolution if mixed with acidic waste streams.",
    recommendedRecoveryMethod: {
      name: "Catalytic Sulfide Oxidation followed by Upflow Anaerobic Sludge Blanket (UASB) & MBR",
      scientificExplanation: "Liming wastewater is segregated in a dedicated pipe. Manganese sulfate (MnSO4) catalyst aerates dissolved sulfides into harmless thiosulfate and sulfate at pH >= 10.0. The de-sulfurized effluent is coagulated, clarified, and fed to an Upflow Anaerobic Sludge Blanket (UASB) reactor where methanogenic consortia convert soluble proteins into high-calorific biogas (CH4 65%, CO2 35%).",
      requiredProcessing: "1. Dedicated pipeline segregation; 2. Catalytic aeration (MnSO4, air flow 4 hrs); 3. Primary settling; 4. UASB high-rate anaerobic digestion; 5. Membrane Bioreactor (MBR) polishing."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "Enriched Biogas for Steam Boiler Generation",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Combustion in dual-fuel industrial boilers to produce process steam (6–8 bar) for leather drying and toggling.",
          "Combined Heat and Power (CHP) gas generator feeding clean electricity into the plant microgrid."
        ],
        targetIndustries: ["Power & Energy Utilities", "Tannery In-House Energy"],
        crossIndustryPathway: "Replaces imported heavy furnace oil or coal with biological methane harvested directly from wash water."
      },
      {
        recoveredMaterial: "Tertiary Treated High-Purity Water via RO-ZLD",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Re-injection into beamhouse soaking and liming drums, achieving 80–85% water recovery in Zero Liquid Discharge (ZLD) plants.",
          "Industrial floor and container wash water."
        ],
        targetIndustries: ["Industrial Water Utilities", "Tannery In-House Recycling"],
        crossIndustryPathway: "Returns millions of liters of freshwater back into industrial cycles, preserving depleted groundwater aquifers."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 85,
      co2AbatementKgPerTon: 890,
      resourceConservation: "Saves millions of liters of freshwater and displaces fossil boiler fuel.",
      circularityIndex: 90
    },
    safetyAndFeasibility: {
      contaminationRisks: "H2S lethal gas evolution during accidental acidification, membrane fouling by calcium scaling and colloidal fat.",
      mandatoryQualityChecks: "Continuous online pH and H2S sniffers, COD/BOD reduction ratio (> 85%), Total Dissolved Solids, Methane gas analyzer.",
      regulatoryConsiderations: "Effluent must meet CPCB ZLD discharge norms (BOD < 30 mg/L, COD < 250 mg/L, TDS < 2,100 mg/L if discharged).",
      feasibilityRating: "High",
      feasibilityExplanation: "Standard requirement in modern tanneries; common effluent treatment plants (CETPs) operate UASB-ZLD systems profitably.",
      restrictedApplications: "Treated wastewater is non-potable; must not be routed to public drinking distribution."
    }
  },

  {
    id: "waste-leather-6",
    industryId: "leather",
    industryName: "Leather Tanning Industry",
    category: "High-Purity Natural Polymer Waste",
    name: "Collagen-Containing Waste (Raw Untanned Pelts & Splits)",
    synonyms: ["Untanned split pelts", "Lime split collagen", "Dermal collagen cuttings"],
    typicalComposition: "Pure Type-I Collagen fibers (85–92% dry weight), Moisture (60–70%), Non-collagenous proteins (3–6%), Trace salts (< 2%). Completely chrome-free.",
    physicalState: "Pliable White/Translucent Fibrous Sheets",
    hazardLevel: "Low (Non-Hazardous Natural Polymer)",
    environmentalConcerns: "Organic putrescibility and high biological oxygen demand if uncollected.",
    recommendedRecoveryMethod: {
      name: "Mild Enzymatic Pepsin Solubilization & Acid Fibrillogenesis",
      scientificExplanation: "Raw untanned split collagen is washed in cold neutral buffer and solubilized using proteolytic pepsin enzyme cleavage at 4°C in 0.5 M acetic acid. Telopeptides are selectively excised to yield atelocollagen with minimal immunogenicity. Dialysis and controlled salt precipitation recover high-purity intact triple-helical collagen membranes.",
      requiredProcessing: "1. Hypochlorite sanitization; 2. Acetic acid swelling (pH 2.5); 3. Pepsin enzymatic digestion (48 hrs, 4°C); 4. Microfiltration; 5. Neutralization & lyophilization (freeze-drying)."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "Atelocollagen Biomaterials & Wound Care Matrices",
        maturity: "Emerging Research / Commercial Pilot",
        possibleApplications: [
          "Hemostatic collagen sponges and surgical dressing matrices for chronic burn and diabetic wound care.",
          "Tissue engineering scaffolds for 3D cell culturing and bone graft substitutes."
        ],
        targetIndustries: ["Medical Devices & Healthcare", "Biomaterials & Regenerative Medicine"],
        crossIndustryPathway: "Transforms raw untanned abattoir/tannery splits into high-value medical wound dressings worth $1,000+ per kg."
      },
      {
        recoveredMaterial: "Edible Sausage Casings & Biodegradable Food Packaging Film",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Regenerated collagen edible casings for sausages, replacing synthetic plastic casings.",
          "Water-soluble, biodegradable active packaging films enriched with antimicrobial essential oils."
        ],
        targetIndustries: ["Food Processing & Packaging", "Sustainable Bioplastics"],
        crossIndustryPathway: "Replaces single-use petroleum plastic wraps with edible, compostable animal protein films."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 95,
      co2AbatementKgPerTon: 1600,
      resourceConservation: "Displaces petroleum collagen synthetics and non-biodegradable polymer packaging films.",
      circularityIndex: 96
    },
    safetyAndFeasibility: {
      contaminationRisks: "Cross-contamination with chrome-bearing tools; viral/prion agents; microbial endotoxins.",
      mandatoryQualityChecks: "SDS-PAGE molecular weight profiling (triple alpha-chains), Endotoxin LAL assay (< 0.5 EU/mg), Heavy metals (Cr < 0.1 ppm), Microbial sterility.",
      regulatoryConsiderations: "Medical applications require ISO 13485 medical device validation and FDA 510(k) biomaterial regulatory approvals.",
      feasibilityRating: "Medium",
      feasibilityExplanation: "High CAPEX for medical cleanrooms; however, food casing recovery is already commercially established with global demand.",
      restrictedApplications: "Must maintain rigorous chain-of-custody ensuring zero contact with trivalent or hexavalent chrome equipment."
    }
  },

  // =========================================================================
  // B. COSMETICS INDUSTRY (7 Waste Streams)
  // =========================================================================
  {
    id: "waste-cosmetic-1",
    industryId: "cosmetics",
    industryName: "Cosmetics Industry",
    category: "Formulated Emulsion & Cream Waste",
    name: "Expired or Off-Specification Cosmetic Formulations (Creams & Lotions)",
    synonyms: ["Off-spec face creams", "Batch reject sunscreens", "Expired body lotions", "Emulsion tank bottoms"],
    typicalComposition: "Water (60–80%), Emollients & Triglycerides (10–25%), Emulsifiers (cetearyl alcohol, polysorbates 3–8%), Humectants (glycerol, propylene glycol 5–10%), Preservatives (phenoxyethanol, parabens 0.2–1%), Synthetic polymers.",
    physicalState: "Viscous Emulsion / White or Tinted Paste",
    hazardLevel: "Medium (Organic Load & Preservative Content)",
    environmentalConcerns: "Emulsified oils bypass standard gravity separators; antimicrobial preservatives inhibit biological wastewater treatment bacteria; microplastics and UV filters (octinoxate, oxybenzone) cause aquatic toxicity.",
    recommendedRecoveryMethod: {
      name: "Thermal De-Emulsification & Phase Separation into Bio-Wax & Industrial Fatty Acids",
      scientificExplanation: "The emulsion is acidified to pH 2.0–3.0 with sulfuric acid and heated to 85–90°C under mechanical shearing. The protective electrical double layer of surfactants is destroyed, coalescing the oil and water phases. High-speed centrifugation separates the hydrophobic lipid phase (waxes, triglycerides) from the aqueous polyol phase.",
      requiredProcessing: "1. Chemical de-emulsification (pH shift + electrolyte); 2. Thermal heating (85°C); 3. 3-phase horizontal decanter centrifugation; 4. Active carbon filtration of oil phase; 5. Neutralization of water phase."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "Secondary Industrial Lipid Wax & Mold Release Agents",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Concrete formwork mold-release lubricants for precast construction.",
          "Anti-caking coating for ammonium nitrate and urea fertilizer prills.",
          "Feedstock for non-food industrial wax polishes and leather conditioning waxes."
        ],
        targetIndustries: ["Construction & Building Materials", "Agrochemicals & Fertilizers", "Automotive & Leather Polishes"],
        crossIndustryPathway: "Repurposes high-grade cosmetic stearates and emollients into non-stick mold release agents for construction formwork."
      },
      {
        recoveredMaterial: "Anaerobic Co-Digestion High-Caloric Booster",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Controlled addition to municipal wastewater digesters to multiply biomethane production (lipid yields > 900 m3 biogas/ton volatile solids)."
        ],
        targetIndustries: ["Renewable Energy & Biogas"],
        crossIndustryPathway: "Redirects high-caloric lipid paste into wastewater biogas reactors, boosting renewable energy yield by up to 40%."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 86,
      co2AbatementKgPerTon: 980,
      resourceConservation: "Displaces petroleum-derived formwork oils and synthetic paraffin waxes.",
      circularityIndex: 85
    },
    safetyAndFeasibility: {
      contaminationRisks: "Antimicrobial preservatives (phenoxyethanol, parabens) inhibiting digestion if overfed; UV filter chemical toxicity.",
      mandatoryQualityChecks: "Preservative screening via HPLC, Free Fatty Acid (FFA %), Saponification value, Heavy metal screen.",
      regulatoryConsiderations: "Classified as non-hazardous industrial organic waste; must ensure no microplastic beads (polyethylene) enter agricultural soils.",
      feasibilityRating: "High",
      feasibilityExplanation: "Technically straightforward thermal separation; low CAPEX and high demand for secondary formwork release agents.",
      restrictedApplications: "Prohibited from animal feeds, human food contact, or direct agricultural fertilizer without validated digestion."
    }
  },

  {
    id: "waste-cosmetic-2",
    industryId: "cosmetics",
    industryName: "Cosmetics Industry",
    category: "Lipid & Fatty Phase Waste",
    name: "Waste Oils, Squalane & Plant Fatty Acids",
    synonyms: ["Cosmetic oil washings", "Lipid tank rinsings", "Waste argan/jojoba oil", "Rancid triglyceride blends"],
    typicalComposition: "Triglycerides & Esters (80–92%), Free fatty acids (4–12%), Squalene/Squalane (2–8%), Antioxidants (tocopherols 0.5–2%), Moisture (2–5%).",
    physicalState: "Oily Liquid / Viscous Amber Slurry",
    hazardLevel: "Low to Medium (High Flammability & Oxygen Depletion)",
    environmentalConcerns: "Forms suffocating slicks on surface waters; clogs sewer pipes through fat/oil/grease (FOG) fatberg formation; high COD (> 150,000 mg/L).",
    recommendedRecoveryMethod: {
      name: "Base-Catalyzed Transesterification & High-Vacuum Molecular Distillation",
      scientificExplanation: "Waste oils are de-watered, filtered, and reacted with anhydrous methanol in the presence of potassium hydroxide (KOH) catalyst at 60°C. Triglycerides undergo transesterification to yield Fatty Acid Methyl Esters (FAME) and crude glycerol. Short-path molecular distillation purifies specialized fractions such as squalane and jojoba wax esters.",
      requiredProcessing: "1. Vacuum dehydration (105°C); 2. Transesterification with MeOH + KOH (60°C, 2 hrs); 3. Gravity settling of glycerol; 4. Water wash of biodiesel; 5. Thin-film molecular distillation."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "Premium Biodiesel (ASTM D6751 / EN 14214 FAME)",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "B100 or B20 diesel blend for industrial heavy transport, captive fleet logistics, and plant backup generators.",
          "Green solvent carrier for crop protection spray oils."
        ],
        targetIndustries: ["Biofuels & Energy", "Agrochemicals & Crop Protection"],
        crossIndustryPathway: "Transforms high-grade cosmetic lipid rejects into ultra-clean low-sulfur biodiesel, reducing transport fleet emissions."
      },
      {
        recoveredMaterial: "Bio-Based Cutting Fluids & Eco-Lubricants",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "High-viscosity bio-lubricant for metal cutting, stamping, and hydraulic equipment, replacing toxic petroleum mineral oils."
        ],
        targetIndustries: ["Machining, Metallurgy & Metalworking"],
        crossIndustryPathway: "Delivers non-toxic, biodegradable lubricating fluids to machine shops, eliminating hazardous petrochemical coolants."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 94,
      co2AbatementKgPerTon: 1950,
      resourceConservation: "Displaces fossil diesel and petroleum motor lubricants (saves ~2.8 kg CO2 per liter biodiesel burned).",
      circularityIndex: 93
    },
    safetyAndFeasibility: {
      contaminationRisks: "High acid value (> 10 mg KOH/g requiring pre-esterification); synthetic silicone oils (dimethicone) poisoning biodiesel catalysts.",
      mandatoryQualityChecks: "Acid Number titration, Flash Point (> 130°C), Silicone content via ICP-OES (< 5 ppm), Water content (Karl Fischer < 500 ppm).",
      regulatoryConsiderations: "Commercial fuel sales require national biofuel certification (IS 15607 in India, EN 14214 in EU).",
      feasibilityRating: "High",
      feasibilityExplanation: "High energy density; existing commercial biodiesel refineries routinely accept cosmetic lipid residues.",
      restrictedApplications: "If synthetic silicones (dimethicone, cyclomethicone) are present, cannot be used as engine biodiesel (destroys engine injectors)."
    }
  },

  {
    id: "waste-cosmetic-3",
    industryId: "cosmetics",
    industryName: "Cosmetics Industry",
    category: "Polyol & Humectant Waste",
    name: "Glycerol-Containing Cosmetic Waste & Rinse Waters",
    synonyms: ["Crude cosmetic glycerin", "Glycerol washings", "Polyol residue streams"],
    typicalComposition: "Glycerol / Propane-1,2,3-triol (45–75%), Water (20–45%), Residual surfactants (2–6%), Salts (1–3%), Fragrance traces.",
    physicalState: "Dense Viscous Liquid (Clear to Pale Straw)",
    hazardLevel: "Low (Non-Toxic Biodegradable Polyol)",
    environmentalConcerns: "Extremely high Chemical Oxygen Demand (COD: 1,200,000 mg/L pure glycerol); can cause severe shock loads in wastewater treatment plants.",
    recommendedRecoveryMethod: {
      name: "Vacuum Fractional Distillation with Multi-Stage Carbon Decolorization",
      scientificExplanation: "The crude polyol stream is micro-filtered to remove particulates, acidified to remove residual soaps, and fed to a high-vacuum distillation column at 160–180°C and 10–15 mmHg. Pure glycerol vaporizes overhead, leaving salts and heavy polymers in the bottoms. Passing through granular activated carbon (GAC) beds removes volatile odorants and trace colorants.",
      requiredProcessing: "1. Acid split of residual soaps; 2. Microfiltration; 3. Vacuum distillation (165°C, 12 mbar); 4. Granular activated carbon bleaching; 5. Polishing ion exchange."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "Refined Technical-Grade Glycerol (99.5% Purity)",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Precursor for polyols in polyurethane foam insulation (building construction).",
          "Grinding aid and strength enhancer in cement clinker manufacturing.",
          "Non-toxic antifreeze and coolant formulation for geothermal and HVAC systems."
        ],
        targetIndustries: ["Polyurethanes & Polymers", "Cement Manufacturing", "HVAC & Thermal Fluids"],
        crossIndustryPathway: "Channels purified secondary glycerol directly into rigid polyurethane insulation foam manufacturing for green buildings."
      },
      {
        recoveredMaterial: "Bacterial Fermentation Feedstock for 1,3-Propanediol (PDO)",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Microbial fermentation substrate for Clostridium butyricum to synthesize bio-based 1,3-propanediol (Sorona biopolymer precursor).",
          "Carbon source for wastewater denitrification in municipal ETPs."
        ],
        targetIndustries: ["Bioplastics & Synthetic Fibers", "Municipal Wastewater Treatment"],
        crossIndustryPathway: "Feeds recovered glycerol to industrial biopolymer reactors to manufacture renewably sourced PTT polyester textiles."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 91,
      co2AbatementKgPerTon: 1350,
      resourceConservation: "Replaces petroleum-derived propylene glycol and fossil petrochemical polyols.",
      circularityIndex: 92
    },
    safetyAndFeasibility: {
      contaminationRisks: "Volatile fragrance allergens (limonene, linalool), residual anionic surfactants (SLES), chloride salts.",
      mandatoryQualityChecks: "Glycerol assay via titration / GC-FID (>= 98.0%), Karl Fischer moisture (< 1.0%), Heavy metals (Pb, As < 1 ppm), Sulfated ash (< 0.1%).",
      regulatoryConsiderations: "Meets technical industrial grade specifications (ASTM D1257); requires documentation of non-animal/vegetable origin if requested.",
      feasibilityRating: "High",
      feasibilityExplanation: "High industrial demand in paint resins, cement additives, and biopolymer synthesis; robust market price.",
      restrictedApplications: "Cannot be sold as USP/EP pharmaceutical or food grade without exhaustive GMP re-validation and multi-stage re-distillation."
    }
  },

  {
    id: "waste-cosmetic-4",
    industryId: "cosmetics",
    industryName: "Cosmetics Industry",
    category: "Lipid & Wax Solid Waste",
    name: "Wax Residues (Beeswax, Carnauba, Candelilla & Paraffin)",
    synonyms: ["Lipstick molding scrap", "Melted wax heels", "Cosmetic pencil wax scrap", "Depilatory wax waste"],
    typicalComposition: "Esters of long-chain fatty acids & fatty alcohols (C40–C60 65–85%), Free cerotic acid (10–15%), Hydrocarbons & Paraffins (5–18%), Iron oxide / Organic pigments (1–4%).",
    physicalState: "Waxy Brittle Solid / Colored Cakes",
    hazardLevel: "Low (Non-Hazardous Inert Wax)",
    environmentalConcerns: "Extremely slow biodegradation; clogs industrial drains; increases solid landfill volume indefinitely.",
    recommendedRecoveryMethod: {
      name: "Solvent-Free Hot Melt Filtration & Centrifugal Pigment Separation",
      scientificExplanation: "Wax scrap is melted in a jacketed stainless steel vessel at 85–95°C. Bleaching earth (bentonite clay) and diatomaceous filter aids are added to adsorb residual pigments and dyes. The molten wax is driven through a heated pressure leaf filter and centrifugal clarifier to yield clear, decolorized purified wax.",
      requiredProcessing: "1. Jacketed steam melting (90°C); 2. Bentonite clay bleaching; 3. High-temperature leaf filtration; 4. Water-bath solidification & flaking into pellets."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "Industrial Foundry Investment Casting Wax",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Pattern wax for precision investment casting of aerospace and automotive metal components.",
          "Lost-wax art bronze casting."
        ],
        targetIndustries: ["Metal Casting & Foundries", "Aerospace & Precision Engineering"],
        crossIndustryPathway: "Supplies high-melting-point waxes to aerospace foundries for precision metal turbine casting molds."
      },
      {
        recoveredMaterial: "Waterproof Protective Coatings & Cardboard Wax Impregnation",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Water-repellent barrier coating for agricultural fruit packaging boxes and moisture-resistant paper.",
          "Textile waterproofing agent and industrial candle manufacturing."
        ],
        targetIndustries: ["Paper & Packaging", "Textile Finishing & Candles"],
        crossIndustryPathway: "Replaces petroleum paraffin on corrugated cardboard packaging with recovered natural cosmetic wax."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 92,
      co2AbatementKgPerTon: 840,
      resourceConservation: "Conserves natural carnauba palm harvesting and petroleum paraffin waxes.",
      circularityIndex: 88
    },
    safetyAndFeasibility: {
      contaminationRisks: "Entrained colorants (CI 15850 Red 7, titanium dioxide), fragrance allergens, synthetic polymers.",
      mandatoryQualityChecks: "Melting Point range (ASTM D87, 62–85°C), Ash content (< 0.2%), Acid value, Needle penetration hardness test.",
      regulatoryConsiderations: "Non-hazardous industrial solid waste; easy transportation and indefinite storage life.",
      feasibilityRating: "High",
      feasibilityExplanation: "High commodity value of natural waxes (carnauba/beeswax cost $8–15/kg); simple low-energy filtration recovery.",
      restrictedApplications: "Prohibited from direct reuse in baby care cosmetics or certified food-contact wax wraps without food-grade certification."
    }
  },

  {
    id: "waste-cosmetic-5",
    industryId: "cosmetics",
    industryName: "Cosmetics Industry",
    category: "Organic Lignocellulosic Waste",
    name: "Plant Extracts and Botanical Residues (Spent Herbs, Pomace & Seeds)",
    synonyms: ["Spent herbal marc", "Extracted flower petals", "Coffee/fruit scrub residue", "Essential oil steam distill residue"],
    typicalComposition: "Cellulose & Hemicellulose (45–60%), Lignin (18–28%), Residual polyphenols & flavonoids (2–6%), Moisture (50–70%), Ash (3–6%).",
    physicalState: "Damp Fibrous Pulverized Biomass",
    hazardLevel: "Low (Non-Hazardous Compostable Biomass)",
    environmentalConcerns: "Fermentation odor, leachate generation, methane emission if landfilled under anaerobic conditions.",
    recommendedRecoveryMethod: {
      name: "Supercritical CO2 / Subcritical Water Polyphenol Stripping followed by Aerobic Thermophilic Composting",
      scientificExplanation: "Spent botanical residues undergo secondary extraction using green subcritical water or ethanol to recover residual bioactive antioxidants and polyphenols. The remaining solid lignocellulosic cake is co-composted with agricultural manure in aerated static piles, where thermophilic microorganisms (55–65°C) convert fibers into humus-rich compost.",
      requiredProcessing: "1. Press de-watering; 2. Secondary antioxidant extraction (optional); 3. Shredding & blending with carbonaceous material (C:N ratio 30:1); 4. Aerobic windrow composting (45 days); 5. Screening & bagging."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "Nutrient-Rich Organic Humic Compost & Soil Conditioner",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Organic bio-fertilizer and soil conditioner for horticulture, vineyards, and organic farming.",
          "Peat-moss replacement in seedling nursery potting mixes."
        ],
        targetIndustries: ["Commercial Agriculture & Horticulture", "Landscaping & Nursery"],
        crossIndustryPathway: "Returns spent herbal waste back to agricultural soils as organic carbon, sequestering carbon and replacing imported peat."
      },
      {
        recoveredMaterial: "Bio-Based Heavy Metal Adsorbent for Industrial Effluents",
        maturity: "Emerging Research / Commercial Pilot",
        possibleApplications: [
          "Low-cost biosorbent for sequestering Lead (Pb), Cadmium (Cd), and Nickel (Ni) from electroplating wash waters.",
          "Raw material for activated biochar production."
        ],
        targetIndustries: ["Wastewater Remediation & Electroplating", "Active Carbon Manufacturers"],
        crossIndustryPathway: "Transforms herbal tea and scrub wastes into porous biosorbents that clean heavy metals from electroplating effluents."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 95,
      co2AbatementKgPerTon: 670,
      resourceConservation: "Replaces mined chemical NPK fertilizers and preserves peat bogs.",
      circularityIndex: 94
    },
    safetyAndFeasibility: {
      contaminationRisks: "Mold spores (Aspergillus), residual extraction solvents (hexane traces if solvent extraction was used), pesticide residues.",
      mandatoryQualityChecks: "C:N ratio (25–30:1), Heavy metal screen (Pb < 50 ppm, Cd < 2 ppm), Germination Index (> 85%), Absence of Salmonella & E. coli.",
      regulatoryConsiderations: "Conforms to Fertilizer Control Order (FCO) 1985 / Solid Waste Management Rules 2016 for city compost standards.",
      feasibilityRating: "High",
      feasibilityExplanation: "Zero toxic chemicals; rapid 30-45 day composting cycle with strong localized agricultural demand.",
      restrictedApplications: "If hexane or chlorinated solvents were used during botanical extraction, solid residue must be thermally desorbed before soil application."
    }
  },

  {
    id: "waste-cosmetic-6",
    industryId: "cosmetics",
    industryName: "Cosmetics Industry",
    category: "Rigid & Flexible Polymer Packaging",
    name: "Cosmetic Packaging Scrap (HDPE, PET Bottles, Glass & Pumps)",
    synonyms: ["Off-spec cosmetic bottles", "Defective lotion pumps", "Reject glass perfume flacons", "Laminated tubes"],
    typicalComposition: "High-Density Polyethylene (HDPE 40–55%), Polyethylene Terephthalate (PET 20–35%), Soda-lime glass (15–30%), Multilayer metalized pump springs (stainless steel / PP 5–10%).",
    physicalState: "Molded Plastic Pieces, Broken Glass & Bottles",
    hazardLevel: "Low (Non-Hazardous Solid Packaging Waste)",
    environmentalConcerns: "Microplastic formation, hundreds of years persistence in landfills, marine ecosystem devastation.",
    recommendedRecoveryMethod: {
      name: "Near-Infrared (NIR) Optical Sorting, Cryogenic De-Metalizing & Mechanical Regranulation",
      scientificExplanation: "Cosmetic bottles are washed with hot alkaline surfactant to remove cream residues, mechanically shredded, and optically sorted by polymer type using NIR sensors. Multi-material pump components pass through eddy-current and magnetic separators to pull out metal springs. Pure HDPE and PET flakes are melt-extruded and pelletized into certified post-consumer recycled (rPET / rHDPE) pellets.",
      requiredProcessing: "1. Hot caustic wash (80°C) to strip labels and residues; 2. Optical sorting by resin type; 3. Granulation into 5mm flakes; 4. Magnetic & eddy-current metal extraction; 5. De-volatilizing twin-screw extrusion into pellets."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "Post-Consumer Recycled Plastic Pellets (rHDPE & rPET)",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Manufacturing secondary industrial packaging (chemical drums, detergent bottles, paint pails).",
          "Extrusion of corrugated drainage pipes and electrical cable conduits."
        ],
        targetIndustries: ["Chemical Packaging & Drums", "Civil Infrastructure & Piping"],
        crossIndustryPathway: "Transforms discarded cosmetic bottles into heavy-duty 200L chemical carboys and underground drainage conduits."
      },
      {
        recoveredMaterial: "Cullet Glass for Container Remelt & Fiberglass Insulation",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Recycled glass cullet for container glass furnaces (reduces kiln melting temperature by 20%).",
          "Raw feedstock for building fiberglass insulation bats."
        ],
        targetIndustries: ["Glass Manufacturing", "Thermal Building Insulation"],
        crossIndustryPathway: "Routes cosmetic perfume bottles into construction fiberglass insulation, cutting industrial glass furnace fuel."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 98,
      co2AbatementKgPerTon: 1420,
      resourceConservation: "Directly saves virgin crude oil (1 ton rPET saves ~1.5 tons of petroleum).",
      circularityIndex: 96
    },
    safetyAndFeasibility: {
      contaminationRisks: "Entrained metal springs in pumps, residual silicone oils, adhesive residues, multilayer barrier laminates.",
      mandatoryQualityChecks: "Melt Flow Index (MFI), Intrinsic Viscosity (IV for PET), Color index, Residual volatile organic content.",
      regulatoryConsiderations: "Plastic Waste Management Rules 2016 (EPR targets); EPR certificate generation for brand owners.",
      feasibilityRating: "High",
      feasibilityExplanation: "Urgent demand driven by mandatory Extended Producer Responsibility (EPR) regulations globally; high resale price for clean rPET.",
      restrictedApplications: "Prohibited from direct food-contact packaging without authorized US-FDA Letter of No Objection (LNO) decontamination process."
    }
  },

  {
    id: "waste-cosmetic-7",
    industryId: "cosmetics",
    industryName: "Cosmetics Industry",
    category: "Aqueous Surfactant Concentrate",
    name: "Surplus Surfactants & High-Foam Formulation Residues",
    synonyms: ["Shampoo tank washings", "Surplus SLES/CAPB rinses", "Body wash line purge", "Foaming detergent effluent"],
    typicalComposition: "Water (80–90%), Sodium Laureth Sulfate (SLES 5–12%), Cocamidopropyl Betaine (CAPB 2–5%), Sodium chloride (1–3%), Preservatives & fragrance (0.5–1%).",
    physicalState: "Foamy Viscous Gel / Liquid Concentrate",
    hazardLevel: "Medium (Aquatic Toxicity & Foam Obstruction)",
    environmentalConcerns: "Forms suffocating foam blankets over aeration tanks and natural waterways, arresting biological oxygen transfer and killing aquatic life.",
    recommendedRecoveryMethod: {
      name: "Ultrafiltration Concentration & Industrial Degreaser Re-Formulation",
      scientificExplanation: "The dilute surfactant stream is treated with defoaming agents, pre-filtered, and passed through spiral-wound ultrafiltration (UF) ceramic membranes (MWCO 5,000–10,000 Da) to concentrate surfactant micelles up to 25–35% active matter. The concentrated surfactant is neutralized, stabilized with sodium metasilicate, and compounded directly into heavy-duty industrial degreasers.",
      requiredProcessing: "1. Anti-foam metering; 2. Cartridge cartridge pre-filtration; 3. Ultrafiltration concentration; 4. Active matter adjustment; 5. Blending with industrial builders."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "Industrial Vehicle Wash & Floor Degreaser Base",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Commercial fleet wash shampoo for buses, trucks, and freight containers.",
          "Floor cleaning detergent for industrial warehouses, machine shops, and mining equipment."
        ],
        targetIndustries: ["Automotive Maintenance & Fleet Logistics", "Commercial Cleaning Products"],
        crossIndustryPathway: "Reclaims cosmetic foaming agents to produce heavy-duty truck wash detergents, saving synthetic surfactant manufacturing."
      },
      {
        recoveredMaterial: "Froth Flotation Foaming Agent for Mineral Processing",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Frother agent in mineral beneficiation (froth flotation separation of silica and metal ores)."
        ],
        targetIndustries: ["Mining & Mineral Processing"],
        crossIndustryPathway: "Directs spent foaming surfactants into copper/coal froth flotation separation circuits."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 88,
      co2AbatementKgPerTon: 850,
      resourceConservation: "Saves virgin petrochemical ethylene oxide and fatty alcohol ethoxylates.",
      circularityIndex: 86
    },
    safetyAndFeasibility: {
      contaminationRisks: "1,4-Dioxane traces (carcinogenic byproduct of ethoxylation), fragrance allergen sensitization, high salt content.",
      mandatoryQualityChecks: "Active Surfactant Matter titration (ISO 2271), 1,4-Dioxane screening (< 5 ppm via GC-MS), pH, Foam height stability.",
      regulatoryConsiderations: "Biodegradability must exceed 80% (OECD 301D test); discharge strictly forbidden without anti-foam treatment.",
      feasibilityRating: "High",
      feasibilityExplanation: "Very high surfactant costs make secondary degreaser compounding commercially lucrative with existing chemical blenders.",
      restrictedApplications: "Prohibited from hand dishwash or baby care products due to lack of batch-to-batch fragrance/preservative consistency."
    }
  },

  // =========================================================================
  // C. PHARMACEUTICAL INDUSTRY (7 Waste Streams)
  // =========================================================================
  {
    id: "waste-pharma-1",
    industryId: "pharma",
    industryName: "Pharmaceutical Industry",
    category: "High-Potency Regulated Solid Waste",
    name: "Expired, Recalled or Rejected Finished Pharmaceuticals",
    synonyms: ["Expired drug tablets", "Rejected blister packs", "Out-of-spec injectable vials", "Compromised oral liquids"],
    typicalComposition: "Active Pharmaceutical Ingredients (APIs 1–40% w/w, e.g. Paracetamol, Ciprofloxacin, Atorvastatin, Metformin), Excipients (Lactose, Microcrystalline cellulose, Starch, Povidone 60–99%), Packaging blisters.",
    physicalState: "Solid Tablets, Capsules, Powders, or Syrups",
    hazardLevel: "Critical / Hazardous (High Pharmacological Toxicity)",
    environmentalConcerns: "CRITICAL HAZARD: Active pharmaceutical ingredients (APIs) in the environment trigger antimicrobial resistance (AMR), endocrine disruption in wildlife, reproductive toxicity in fish, and contamination of drinking water aquifers.",
    recommendedRecoveryMethod: {
      name: "High-Temperature Incineration & Thermal Energy Co-Processing in Cement Kilns",
      scientificExplanation: "Because APIs possess high pharmacological potency, direct material reuse in consumer products or agriculture is STRICTLY PROHIBITED. Waste drugs undergo mechanical de-packaging, slurry homogenization, and co-processing in high-temperature cement rotary kilns (1450°C gas residence time > 2 seconds). Complete mineral thermolysis cleaves organic drug molecules into CO2, H2O, and inorganic ash that binds irreversibly into cement clinker minerals.",
      requiredProcessing: "1. Secure chain-of-custody logging; 2. Automated de-packaging under negative pressure; 3. Mechanical shredding & slurry blending; 4. High-temperature injection into kiln burner; 5. Continuous off-gas monitoring (CEMs)."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "Alternative Fuel and Raw Material (AFR) for Cement Clinker",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Calorific fuel substitution in cement manufacture (replaces high-ash thermal coal).",
          "Mineral ash incorporation into Portland cement matrix (complete destruction of biological activity)."
        ],
        targetIndustries: ["Cement Manufacturing", "Thermal Power Generation"],
        crossIndustryPathway: "Safely converts hazardous expired pharmaceuticals into clean industrial thermal energy in cement kilns, permanently preventing counterfeit diversion and groundwater contamination."
      },
      {
        recoveredMaterial: "Energy Recovery via Dedicated Hazmat Incinerator",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "High-pressure steam generation powering plant electricity turbines in Common Hazardous Waste Treatment Facilities (TSDF)."
        ],
        targetIndustries: ["Hazardous Waste Facilities (TSDF)", "Energy Utilities"],
        crossIndustryPathway: "Supplies high-calorific organic matter to waste-to-energy power plants under strict multi-stage flue gas scrubbing."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 99,
      co2AbatementKgPerTon: 920,
      resourceConservation: "Displaces fossil thermal coal in cement clinker production; permanently destroys persistent bioaccumulative APIs.",
      circularityIndex: 78
    },
    safetyAndFeasibility: {
      contaminationRisks: "CRITICAL: Counterfeit drug diversion into black markets, release of halogenated dioxins/furans during low-temperature combustion, antimicrobial resistance proliferation.",
      mandatoryQualityChecks: "Strict Drug Enforcement / State FDA destruction manifest, Destruction and Removal Efficiency (DRE >= 99.99%), Continuous flue gas dioxin and acid gas monitoring.",
      regulatoryConsiderations: "Regulated under Drugs and Cosmetics Act 1940 and Hazardous Waste Rules 2016. Destruction must occur in presence of certified Drug Inspector / Pollution Board officer.",
      feasibilityRating: "High",
      feasibilityExplanation: "Existing regulatory mandate; cement plants actively contract with pharma clusters for co-processing AFR fuel.",
      restrictedApplications: "ABSOLUTELY PROHIBITED from direct reuse in animal feed, cosmetics, consumer formulations, composting, or unauthorized dumping."
    }
  },

  {
    id: "waste-pharma-2",
    industryId: "pharma",
    industryName: "Pharmaceutical Industry",
    category: "Composite Multilayer Packaging Waste",
    name: "Pharmaceutical Blister Packs & Packaging Waste (PVC/PVDC-Alu)",
    synonyms: ["Alu-Alu blister scrap", "PVC-Aluminum blister trimmings", "Glass serum ampoules", "Defective medicine carton packaging"],
    typicalComposition: "Polyvinyl Chloride (PVC 60–75%), Aluminum foil backing (15–30%), PVDC moisture barrier coating (2–5%), Heat seal lacquer (1–3%).",
    physicalState: "Flexible Silver-Clear Multilayer Strips & Flakes",
    hazardLevel: "Medium (Chlorinated Polymer & Heavy Landfill Persist)",
    environmentalConcerns: "Chlorinated PVC releases toxic hydrogen chloride (HCl) gas and carcinogenic dioxins if burned open; aluminum requires massive electrical energy to mine virgin bauxite.",
    recommendedRecoveryMethod: {
      name: "Organic Delamination & Hydrothermal Separation into Pure Aluminum & Polymer Flakes",
      scientificExplanation: "Blister scrap is shredded into 10–15mm flakes and treated in an ultrasonic delamination reactor using green organic solvents (e.g., ethyl lactate or mild organic acids). The interlayer adhesive lacquer dissolves, causing clean detachment of high-purity aluminum foil from the PVC/PVDC polymer film without thermal degradation.",
      requiredProcessing: "1. Mechanical shredding; 2. Solvent/ultrasonic delamination (65°C); 3. Density-based hydrocyclone separation (aluminum sinks, plastic floats); 4. Solvent recovery by closed-loop vacuum flash distillation; 5. Aluminum melting into ingots."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "High-Purity Secondary Aluminum Ingots (> 99.2% Al)",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Secondary foundry alloy for automotive engine cylinder heads, gearbox casings, and brake calipers.",
          "Aluminum powder reagent for pyrotechnics and chemical reduction reactions."
        ],
        targetIndustries: ["Automotive Metallurgy & Die-Casting", "Chemical Synthesis Reagents"],
        crossIndustryPathway: "Transfers medical blister foil directly to automotive foundries, saving 95% of the electricity required to smelt virgin bauxite."
      },
      {
        recoveredMaterial: "Regranulated Rigid PVC Compound",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Extrusion of outdoor electrical conduits, underground sewer pipes, and road traffic safety cones."
        ],
        targetIndustries: ["Plastics & Construction Conduits", "Traffic Safety Infrastructure"],
        crossIndustryPathway: "Converts blister plastic backing into non-pressure drainage piping and durable highway safety cones."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 96,
      co2AbatementKgPerTon: 2800,
      resourceConservation: "Recycling 1 ton of blister aluminum saves ~14,000 kWh of electricity and 4 tons of bauxite ore.",
      circularityIndex: 94
    },
    safetyAndFeasibility: {
      contaminationRisks: "Entrained powder drug residues in blister pockets, residual PVC chlorine contaminating aluminum smelters.",
      mandatoryQualityChecks: "Residual API wipe test, Chlorine content in recovered aluminum (< 0.05%), Tensile strength of recycled PVC.",
      regulatoryConsiderations: "Plastic Waste Management Rules 2016 EPR compliance; hazardous waste authorization if contaminated with cytotoxic or hormone drugs.",
      feasibilityRating: "High",
      feasibilityExplanation: "High market value of secondary aluminum (~$2,000/ton) provides strong commercial ROI for specialized delamination plants.",
      restrictedApplications: "Cannot be recycled back into direct pharmaceutical blister film without high-grade virgin polymer re-certification."
    }
  },

  {
    id: "waste-pharma-3",
    industryId: "pharma",
    industryName: "Pharmaceutical Industry",
    category: "Hazardous Flammable Volatile Organic Waste",
    name: "Solvent Waste (Mother Liquors & Extraction Solvents)",
    synonyms: ["Spent mother liquor", "Spent IPA/Ethanol/Methanol", "Spent Acetone & Ethyl Acetate", "Spent Dichloromethane/Toluene"],
    typicalComposition: "Volatile organic solvents (80–95%, e.g., Isopropanol 45%, Toluene 30%, Ethyl acetate 15%), Water (2–10%), Dissolved API reaction byproducts & tars (2–8%), Inorganic catalyst salts (< 1%).",
    physicalState: "Clear to Amber Flammable Volatile Liquid",
    hazardLevel: "Critical / Hazardous (High Flammability, Toxicity & VOC)",
    environmentalConcerns: "Extremely volatile; high ground-level ozone and photochemical smog formation; severe explosion risk; toxic to groundwater if spilled.",
    recommendedRecoveryMethod: {
      name: "Multi-Stage High-Vacuum Fractional & Azeotropic Distillation with Molecular Sieve Dehydration",
      scientificExplanation: "Spent mother liquor is filtered to remove particulate matter and fed to a continuous high-efficiency packed distillation column. Under fractional reflux and precise temperature control, individual solvents are segregated based on boiling points. Azeotropic water-solvent pairs (e.g. IPA-Water, Ethanol-Water) are dehydrated using hydrophilic zeolite 3A/4A molecular sieve pervaporation membranes to exceed 99.5% purity.",
      requiredProcessing: "1. Explosion-proof spark-safe pre-filtration; 2. Vacuum fractional distillation (packed columns); 3. Zeolite molecular sieve drying (moisture < 0.1%); 4. Active carbon polishing; 5. Gas Chromatography QC testing."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "Distilled Reagent-Grade Solvents (IPA, Ethyl Acetate, Toluene 99.5%+)",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Thinner and solvent carrier for commercial paints, marine varnishes, and industrial powder coatings.",
          "Wash solvent for flexographic printing presses and industrial machinery degreasing.",
          "Synthesis solvent in pesticide formulation and rubber processing."
        ],
        targetIndustries: ["Paints, Resins & Coatings", "Printing & Inks", "Agrochemicals & Rubber"],
        crossIndustryPathway: "Channels purified pharmaceutical mother liquor solvents into industrial paint, resin, and printing ink production, displacing virgin petrochemicals."
      },
      {
        recoveredMaterial: "In-House API Reaction Loop Solvent",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Recirculated back into plant crystallization wash or initial intermediate synthesis stages (subject to validated impurity profiling)."
        ],
        targetIndustries: ["Pharmaceutical In-House Closed-Loop"],
        crossIndustryPathway: "Enables circular solvent reuse within the same API facility, cutting raw solvent purchase and disposal costs by up to 70%."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 92,
      co2AbatementKgPerTon: 2450,
      resourceConservation: "Directly saves petroleum-derived solvents (every ton of recovered solvent saves ~2.5 tons of CO2 equivalent).",
      circularityIndex: 95
    },
    safetyAndFeasibility: {
      contaminationRisks: "CRITICAL: Trace genotoxic impurities (nitrosamines, alkyl halides), residual cross-contaminating APIs, peroxide formation in ethers (THF, IPA).",
      mandatoryQualityChecks: "Gas Chromatography with FID/MS (purity >= 99.5%), Karl Fischer water content (< 0.1%), Peroxide test (< 10 ppm), ICP-MS for heavy metals.",
      regulatoryConsiderations: "CPCB/MPCB Schedule II Category A4 (Spend Solvents). Re-distillation units require dedicated hazardous waste authorization.",
      feasibilityRating: "High",
      feasibilityExplanation: "High commercial profitability; hundreds of dedicated solvent recovery distillation plants operate across pharmaceutical industrial zones.",
      restrictedApplications: "Recovered solvents cannot be used in sterile injectables or pediatric syrup formulations unless meeting ultra-strict pharmacopeial monograph standards."
    }
  },

  {
    id: "waste-pharma-4",
    industryId: "pharma",
    industryName: "Pharmaceutical Industry",
    category: "Polyol & Syrupy Formulation Waste",
    name: "Glycerol & Sugar-Rich Pharmaceutical Formulation Waste",
    synonyms: ["Syrup formulation washings", "Rejected cough syrup tank bottoms", "Glycerol/Sorbitol formulation residues"],
    typicalComposition: "Glycerol / Sorbitol (30–60%), Sucrose / Invert sugar (15–35%), Water (15–30%), Trace APIs (paracetamol, chlorpheniramine, ambroxol 0.1–1.5%), Colorants & flavoring agents.",
    physicalState: "Viscous Amber Sweet-Smelling Liquid",
    hazardLevel: "Medium (High COD & Active Pharmaceutical Traces)",
    environmentalConcerns: "Extremely high biological oxygen demand (COD > 500,000 mg/L) that can shut down biological ETP plants; trace antihistamine/analgesic APIs.",
    recommendedRecoveryMethod: {
      name: "Advanced Oxidation Pre-Treatment (Fenton / Ozone) followed by High-Rate Anaerobic Digestion",
      scientificExplanation: "Because the syrup contains trace active pharmaceuticals, direct animal or food reuse is dangerous. The waste is pre-treated with Fenton's reagent (Fe2+ + H2O2 at pH 3.0) or catalytic ozonation, which generates hydroxyl radicals (*OH) that cleave the aromatic rings of active drugs. The detoxified high-sugar polyol effluent is then fed to an anaerobic digester as high-potency carbon.",
      requiredProcessing: "1. Homogenization; 2. Fenton advanced oxidation (pH 3.0, H2O2 metering, 2 hrs); 3. Neutralization to pH 7.2; 4. Inoculation into anaerobic biomethanation reactor."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "High-Calorific Biogas for Plant Combined Heat & Power (CHP)",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Fueling on-site gas engines to generate clean electricity and hot water for pharmaceutical cleanroom HVAC dehumidification.",
          "Steam boiler co-firing."
        ],
        targetIndustries: ["Energy & Utilities", "In-House Pharma Energy"],
        crossIndustryPathway: "Converts rejected sweet syrups into electrical and thermal energy, offsetting utility grid demand."
      },
      {
        recoveredMaterial: "Industrial Concrete Setting Retarder & Carbon Feedstock",
        maturity: "Emerging Research / Commercial Pilot",
        possibleApplications: [
          "Non-toxic sugar-polyol admixture for retarding the setting time of concrete during hot-weather transport (after validated API destruction).",
          "Denitrification carbon booster for municipal sewage treatment plants."
        ],
        targetIndustries: ["Construction & Ready-Mix Concrete", "Municipal Water Utilities"],
        crossIndustryPathway: "Channels neutralized polyols into ready-mix concrete plants to delay cement hydration during long-distance transit."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 89,
      co2AbatementKgPerTon: 910,
      resourceConservation: "Displaces commercial concrete chemical retarders and fossil natural gas.",
      circularityIndex: 84
    },
    safetyAndFeasibility: {
      contaminationRisks: "CRITICAL: Active drug residues (antihistamines, bronchodilators, antibiotics) if Fenton oxidation is incomplete.",
      mandatoryQualityChecks: "HPLC-UV assay for target API degradation (> 99.9% destruction), Chemical Oxygen Demand (COD), pH, Residual peroxide test.",
      regulatoryConsiderations: "Must verify that no intact pharmacologically active ingredient enters agricultural food chains or public drainage.",
      feasibilityRating: "High",
      feasibilityExplanation: "High sugar/polyol content generates exceptional methane yields in anaerobic digesters (up to 550 m3 biogas/ton).",
      restrictedApplications: "STRICTLY BANNED from animal cattle feed, confectionery, or agricultural irrigation."
    }
  },

  {
    id: "waste-pharma-5",
    industryId: "pharma",
    industryName: "Pharmaceutical Industry",
    category: "Extracted Lignocellulosic Herbal Waste",
    name: "Plant-Based Pharmaceutical Residues (Phytopharmaceutical Spent Marc)",
    synonyms: ["Spent herbal extraction marc", "Ayurvedic plant dregs", "Phytomedicine extracted roots & leaves", "Botanical solvent residues"],
    typicalComposition: "Cellulose & Lignin (60–80% dry basis), Moisture (45–65%), Insoluble pectins & gums (5–12%), Residual solvent traces (ethanol/water 1–5%), Ash (4–8%).",
    physicalState: "Fibrous Chopped Biomass / Granular Herbal Dregs",
    hazardLevel: "Low to Medium (Combustible & Residual Solvent)",
    environmentalConcerns: "Organic leachate, odor during rotting, potential residual alcohol vapors if not desorbed.",
    recommendedRecoveryMethod: {
      name: "Thermal Solvent Desorption & Densification into High-Calorific Bio-Pellets",
      scientificExplanation: "Spent phytomedicine biomass is fed into an indirect steam-heated rotary dryer to evaporate and condense residual alcohol solvents for closed-loop recovery. The dried, de-solventized fibrous marc (moisture < 10%) is pulverized and mechanically compressed through a die ring pellet mill under 120–150°C natural lignin bonding to form high-density fuel pellets.",
      requiredProcessing: "1. Rotary steam desolventizer & condenser; 2. Hammermill pulverization; 3. Ring-die pelletization (high pressure, no chemical binder); 4. Counterflow cooling & screening."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "High-Density Biomass Fuel Pellets (Calorific Value: 3,800–4,200 kcal/kg)",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Direct substitute for coal in industrial boilers, thermal power plants, and brick kilns.",
          "Clean residential wood-pellet stoves and gasifier heating units."
        ],
        targetIndustries: ["Industrial Boilers & Utilities", "Brick & Ceramic Kilns", "Thermal Power Plants"],
        crossIndustryPathway: "Replaces polluting fossil coal in industrial boilers with dense herbal biomass pellets, cutting fossil CO2 and sulfur emissions."
      },
      {
        recoveredMaterial: "Activated Carbon Precursor for Gas & Water Purification",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "High-surface-area (800–1200 m2/g) activated carbon adsorbent for odor control, solvent vapor capture, and municipal water filters."
        ],
        targetIndustries: ["Water & Air Filtration", "Active Carbon Manufacturers"],
        crossIndustryPathway: "Transforms herbal root and bark dregs into porous activated carbon that filters drinking water and toxic industrial emissions."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 96,
      co2AbatementKgPerTon: 1320,
      resourceConservation: "Displaces fossil thermal coal (1 ton pellets replaces ~0.8 ton imported Indonesian coal).",
      circularityIndex: 94
    },
    safetyAndFeasibility: {
      contaminationRisks: "Residual extraction solvents (methanol, ethyl acetate), heavy metal accumulation from soil uptake (Pb, As).",
      mandatoryQualityChecks: "Residual solvent GC headspace (< 100 ppm), Calorific value bomb calorimetry (ASTM D5865), Moisture content (< 10%), Heavy metals screen.",
      regulatoryConsiderations: "Meets Bureau of Indian Standards (BIS) / ISO 17225 standards for solid biofuels; non-hazardous industrial solid waste.",
      feasibilityRating: "High",
      feasibilityExplanation: "High demand from industrial boiler operators seeking to meet government renewable biomass co-firing mandates.",
      restrictedApplications: "If extracted using chlorinated or toxic synthetic solvents (hexane, DCM), cannot be used as bio-fertilizer without thermal validation."
    }
  },

  {
    id: "waste-pharma-6",
    industryId: "pharma",
    industryName: "Pharmaceutical Industry",
    category: "Biological Slurry & Mycelial Waste",
    name: "Fermentation & Biological Residues (Spent Broth & Mycelial Cake)",
    synonyms: ["Spent antibiotic mycelium", "Yeast biomass cake", "Biopharmaceutical fermentation dregs", "Enzyme broth biomass"],
    typicalComposition: "Microbial cell mass (Penicillium, Streptomyces, Yeast 15–25% dry weight), Water (75–85%), Residual nutrients (corn steep liquor, phosphates 3–8%), Residual antibiotic traces (< 500 ppm).",
    physicalState: "Thick Viscous Slurry / Moist Filter Cake",
    hazardLevel: "Critical / Hazardous (Antimicrobial Resistance AMR Hazard)",
    environmentalConcerns: "CRITICAL HAZARD: If residual antibiotics enter soil or groundwater, they drive the natural selection of lethal Superbugs and multi-drug resistant bacterial strains.",
    recommendedRecoveryMethod: {
      name: "High-Temperature Thermal Inactivation / Pyrolysis into Biochar & Biogas",
      scientificExplanation: "Spent fermentation broth is autoclaved at 121–134°C for 60 minutes to ensure complete microbial kill and chemical thermal degradation of β-lactam or macrolide rings. The de-watered biomass undergoes slow pyrolysis at 500–650°C in an oxygen-free reactor, cracking residual antibiotic molecules into syngas and producing a stable, porous carbon biochar.",
      requiredProcessing: "1. Thermal autoclave inactivation (134°C, 1 hr); 2. Pressure plate filter press de-watering; 3. Thermal rotary drying; 4. Anoxic pyrolysis kiln (600°C); 5. Syngas thermal oxidizer."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "Pyrolyzed Biochar for Soil Carbon Sequestration & Remediation",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Soil amendment that permanently sequesters carbon in agricultural soils, improving water retention and cation exchange capacity.",
          "Adsorptive barrier liner for heavy metal stabilization in hazardous waste landfills."
        ],
        targetIndustries: ["Commercial Agriculture & Forestry", "Environmental Landfill Engineering"],
        crossIndustryPathway: "Transforms high-risk antibiotic mycelium into inert, carbon-negative biochar that locks atmospheric carbon into farmland for centuries."
      },
      {
        recoveredMaterial: "Pyrolysis Bio-Oil & Syngas for Industrial Heating",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Combustion in plant thermal oxidizers to provide self-sustaining process heat for the fermentation drying unit."
        ],
        targetIndustries: ["Pharma In-House Clean Energy"],
        crossIndustryPathway: "Powers fermentation drying operations using the energy contained within the microbial cells."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 94,
      co2AbatementKgPerTon: 1550,
      resourceConservation: "Permanently removes antibiotic active residues from the biosphere while creating permanent soil carbon sinks.",
      circularityIndex: 89
    },
    safetyAndFeasibility: {
      contaminationRisks: "CRITICAL: Viable genetically engineered microorganisms (GMOs), residual bioactive antibiotic molecules driving Superbug evolution.",
      mandatoryQualityChecks: "Microbial viability test (zero colony formation on nutrient agar), Residual antibiotic bioassay / LC-MS/MS (< 0.1 ppm / Non-Detectable), Pyrolysis temperature validation log.",
      regulatoryConsiderations: "Regulated under Environment Protection Act 1986 and CPCB Bio-medical / Hazardous Waste Rules. Bio-safety Level 1/2 clearance required.",
      feasibilityRating: "Medium",
      feasibilityExplanation: "Requires strict thermal validation equipment; however, cement kiln co-processing is widely available as a commercial alternative.",
      restrictedApplications: "STRICTLY BANNED from raw animal feed or unpasteurized direct soil spreading under all circumstances."
    }
  },

  {
    id: "waste-pharma-7",
    industryId: "pharma",
    industryName: "Pharmaceutical Industry",
    category: "Inorganic Catalyst & Salt By-Product Waste",
    name: "Chemical Synthesis By-Products (Spent Catalysts & Salt Cakes)",
    synonyms: ["Spent Palladium on Carbon (Pd/C)", "Spent Raney Nickel", "Inorganic salt cakes (NaCl, Na2SO4, KCl)", "AlCl3 neutralization sludge"],
    typicalComposition: "Inorganic salts (60–90%), Precious metals (Palladium 1–5%, Platinum, Nickel), Organic process residues (2–10%), Moisture (5–20%).",
    physicalState: "Moist Dark Powder / Crystalline Salt Cake",
    hazardLevel: "Critical / Hazardous (Pyrophoric & Heavy Metal Hazard)",
    environmentalConcerns: "Spent hydrogenation catalysts (Pd/C, Raney Nickel) can spontaneously ignite upon drying (pyrophoric); toxic heavy metals leach into groundwater.",
    recommendedRecoveryMethod: {
      name: "Hydrometallurgical Precious Metal Leaching & Selective Precipitation / Electro-Refining",
      scientificExplanation: "Spent catalysts are slurried in water under nitrogen blanketing to prevent auto-ignition. Controlled aqua regia (HCl + HNO3) or hydrochloric acid-peroxide digestion leaches palladium or platinum into soluble chlorometallate complexes. Reduction with sodium formate or hydrazine hydrate precipitates pure palladium sponge (99.9% metal recovery). Salt cakes undergo multi-effect crystallization to recover industrial sodium sulfate.",
      requiredProcessing: "1. Nitrogen-blanketed slurrying (anti-pyrophoric precaution); 2. Acid oxidative leaching (80°C); 3. Solid filtration; 4. Selective chemical precipitation of sponge metal; 5. Thermal induction furnace melting into high-purity ingots."
    },
    reuseOpportunities: [
      {
        recoveredMaterial: "Refined High-Purity Precious Metals (Palladium 99.95%, Platinum 99.9%)",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Secondary catalyst manufacturing for petrochemical hydrogenation and pharmaceutical synthesis.",
          "Automotive catalytic converters for vehicular emission control (reducing NOx, CO, and unburnt hydrocarbons).",
          "Electronics circuitry and high-reliability PCB plating."
        ],
        targetIndustries: ["Automotive Catalytic Converters", "Specialty Chemical Catalysts", "Electronics & Semiconductors"],
        crossIndustryPathway: "Recovers precious palladium from pharma reactors to manufacture automotive catalytic converters, avoiding destructive deep-earth mining."
      },
      {
        recoveredMaterial: "Industrial-Grade Anhydrous Sodium Sulfate (Na2SO4)",
        maturity: "Established Industrial Practice",
        possibleApplications: [
          "Filler and builder in commercial laundry detergent powder manufacturing.",
          "Finishing agent and leveling salt in textile dye baths."
        ],
        targetIndustries: ["Soaps & Detergents", "Textile Dyeing & Processing"],
        crossIndustryPathway: "Transforms pharma synthesis salt cake into essential raw material for consumer laundry detergent powders."
      }
    ],
    sustainabilityImpact: {
      wasteReductionPct: 97,
      co2AbatementKgPerTon: 3400,
      resourceConservation: "Mining 1 kg of virgin palladium emits over 20,000 kg of CO2 equivalent; recycling avoids massive open-cast ore extraction.",
      circularityIndex: 98
    },
    safetyAndFeasibility: {
      contaminationRisks: "CRITICAL: Pyrophoric ignition upon air drying, toxic heavy metals (Nickel, Chromium), acid fumes (NOx, Cl2).",
      mandatoryQualityChecks: "ICP-OES / XRF assay for precious metal purity (> 99.9%), Loss on Ignition (LOI), Absence of pyrophoric reactivity test.",
      regulatoryConsiderations: "CPCB/MPCB Schedule IV (Recyclable Hazardous Waste). Processing permitted only in authorized smelters/refineries with secure custody.",
      feasibilityRating: "High",
      feasibilityExplanation: "Enormous economic value (Palladium costs ~$30,000–$40,000/kg); major catalyst refiners operate dedicated reclamation contracts.",
      restrictedApplications: "Prohibited from unauthorized smelting or open-air acid bath leaching."
    }
  }
];

/**
 * QUICK SAMPLE DEMO PRESETS
 * Allows user to instantly test complex real-world industrial waste streams
 */
export const SAMPLE_WASTE_PRESETS = [
  {
    label: "Chrome Shavings (Leather)",
    industryId: "leather",
    wasteId: "waste-leather-2",
    customName: "Wet Blue Chrome Shavings & Splits",
    chemicalComposition: "Collagen-Cr(III) cross-linked matrix 75%, Cr2O3 3.8%, Moisture 40%, Sulfate salts 4%",
    quantity: "2500 kg / batch",
    contaminants: "Trivalent Chromium Cr(III), Residual pickling acids, Biocides (TCMTB)"
  },
  {
    label: "Spent Solvent Mother Liquor (Pharma)",
    industryId: "pharma",
    wasteId: "waste-pharma-3",
    customName: "Spent Isopropanol & Toluene Mother Liquor",
    chemicalComposition: "Isopropanol 52%, Toluene 35%, Water 8%, API synthesis tar & byproducts 5%",
    quantity: "8500 Liters / campaign",
    contaminants: "Trace API intermediates, Organic peroxides, Volatile VOCs"
  },
  {
    label: "Crude Glycerin & Lipid Waste (Cosmetics)",
    industryId: "cosmetics",
    wasteId: "waste-cosmetic-3",
    customName: "Crude Cosmetic Glycerol & Rinse Water",
    chemicalComposition: "Glycerol 68%, Water 25%, Residual anionic surfactants (SLES) 5%, Perfume oils 2%",
    quantity: "4200 kg / week",
    contaminants: "Fragrance allergens, Preservatives (phenoxyethanol), Sulfates"
  },
  {
    label: "Expired Antibiotic Tablets (Pharma)",
    industryId: "pharma",
    wasteId: "waste-pharma-1",
    customName: "Expired Ciprofloxacin 500mg Tablets",
    chemicalComposition: "Ciprofloxacin HCl 65%, Microcrystalline cellulose 20%, Starch & magnesium stearate 15%",
    quantity: "1200 kg (Recalled Stock)",
    contaminants: "Active fluoroquinolone antibiotic (High Antimicrobial Resistance Hazard)"
  },
  {
    label: "Limed Fleshings (Leather)",
    industryId: "leather",
    wasteId: "waste-leather-3",
    customName: "Limed Subcutaneous Hide Fleshings",
    chemicalComposition: "Water 68%, Animal tallow fat 22%, Protein 7%, Lime & Sulfides 3%",
    quantity: "6000 kg / day",
    contaminants: "Sodium sulfide, Lime (pH 12.0), Putrescible animal proteins"
  },
  {
    label: "Blister Pack Packaging Scrap (Pharma)",
    industryId: "pharma",
    wasteId: "waste-pharma-2",
    customName: "Alu-PVC Pharmaceutical Blister Trimmings",
    chemicalComposition: "Rigid PVC 68%, High-purity Aluminum foil 28%, Heat-seal lacquer 4%",
    quantity: "1500 kg / month",
    contaminants: "Chlorinated PVC polymers, Residual API dust"
  }
];
