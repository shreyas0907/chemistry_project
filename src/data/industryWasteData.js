/**
 * ChemAssist INDUSTRY-SPECIFIC CHEMICAL WASTE MANAGEMENT DATABASE
 * Strictly covers THREE core industrial sectors:
 * 1. Leather Industry
 * 2. Pharmaceutical Industry
 * 3. Cosmetic Industry
 * Compliant with CPCB/MPCB Hazardous and Other Wastes Rules 2016, 
 * US EPA RCRA (Resource Conservation and Recovery Act), and EU REACH.
 */

export const INDUSTRY_WASTE_SECTORS = [
  {
    id: "leather",
    name: "Leather Industry",
    tagline: "Beamhouse, Chrome Tanning & Finishing Effluent Management",
    description: "Processing animal hides into commercial leather generates high-strength proteinaceous solids, toxic chromium-bearing shavings, alkaline sulphide washwaters, and finishing solvent residues.",
    accentColor: "amber",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80",
    categories: [
      {
        id: "leather-tanning",
        title: "Tanning-Related Waste (Vegetable & Syntan Liquors)",
        examples: ["Spent mimosa and quebracho vegetable extracts", "Syntan polyphenolic condensates", "Spent bating enzymes", "Pickling salt liquors"],
        mainHazards: [
          "High Chemical Oxygen Demand (COD: 15,000–35,000 mg/L) and Biological Oxygen Demand (BOD: 8,000–18,000 mg/L)",
          "Extreme salinity and Total Dissolved Solids (TDS > 40,000 mg/L)",
          "Slow natural biodegradation of synthetic phenolic tannins"
        ],
        whySpecialHandling: "High polyphenol concentrations and salt loads disrupt biological activated sludge treatment plants and cause rapid deoxygenation of surface water bodies if discharged untreated.",
        segregationConsiderations: "Segregate strictly from acidic beamhouse liquors and metal-bearing streams. Do not mix with primary biological clarifiers without flow equalization and dilution.",
        environmentalSafetyConcerns: "Causes aquatic eutrophication, severe groundwater salinity intrusion in tanning clusters, and recalcitrant color persistence in rivers.",
        pathway: {
          identification: "Measure batch COD, BOD, salinity (TDS), and pH (typically 3.5–5.0). Label containers: 'Non-Chrome Tanning Effluent'.",
          segregation: "Channel through dedicated non-chrome drainage trenches. Prevent cross-mixing with liming or chrome-bearing streams.",
          safeStorage: "Store in acid-resistant FRP or HDPE equalisation tanks equipped with mechanical stirrers to prevent solid sedimentation.",
          treatmentDisposal: "Fenton advanced chemical oxidation pre-treatment to cleave polyphenolic rings, followed by Upflow Anaerobic Sludge Blanket (UASB) digestion and multi-stage RO/ZLD evaporation. Sludge to authorized landfill."
        },
        regulatoryRef: "CPCB Comprehensive Industry Document on Tanneries (COINDS/2018); EPA Effluent Guidelines 40 CFR Part 425."
      },
      {
        id: "leather-chromium",
        title: "Chromium-Containing Waste (Wet Blue Shavings, Splits & Sludge)",
        isHazardousPriority: true,
        examples: ["Wet blue shavings and trimmings", "Chrome tanning liquor exhaust", "De-watered ETP chemical chrome sludge", "Buffing dust"],
        mainHazards: [
          "Trivalent Chromium Cr(III) oxide (2.5–4.5% dry weight in shavings)",
          "Oxidation risk to carcinogenic and water-soluble Hexavalent Chromium Cr(VI) under thermal or alkaline aerated conditions",
          "Persistent heavy metal toxicity to soil microbiomes"
        ],
        whySpecialHandling: "Chromium is a regulated heavy metal. Improper landfilling or open combustion can oxidize non-toxic Cr(III) into toxic, mutagenic, and highly mobile Cr(VI).",
        segregationConsiderations: "CRITICAL: Must be kept completely segregated from all non-chrome organic wastes. Never mix with beamhouse sulfide liquors (pH shock releases toxic fumes and precipitates uncontrollable complex sludges).",
        environmentalSafetyConcerns: "Groundwater contamination near tanneries, bioaccumulation in terrestrial food chains, occupational contact dermatitis, and respiratory sensitization.",
        pathway: {
          identification: "Quantify total chromium by ICP-OES. Perform ISO 17075 testing to ensure absence of Cr(VI) (< 0.5 ppm). Label: 'HAZARDOUS CHROME WASTE (Schedule II - Class A8)'.",
          segregation: "Store in dedicated leak-proof, color-coded bins with impermeable secondary containment bunds.",
          safeStorage: "Covered, dry, weather-protected hazardous storage cell with concrete impervious flooring. Mandatory eyewash and PPE within 5 meters.",
          treatmentDisposal: "Authorized closed-loop recovery: alkaline precipitation with MgO at pH 8.5 to regenerate Basic Chromium Sulfate (BCS) liquor; or high-temperature vitrification into ceramic eco-bricks; or transfer to TSDF (Hazardous Waste Treatment, Storage, and Disposal Facility) via Form 10 manifest."
        },
        regulatoryRef: "Hazardous and Other Wastes Rules 2016 (Schedule II - Class A8); EU REACH Annex XVII Entry 47; OSHA 1910.1026."
      },
      {
        id: "leather-sulphide",
        title: "Sulphide-Containing Waste (Liming & Unhairing Liquors)",
        isHazardousPriority: true,
        examples: ["Spent sodium sulfide and sodium hydrosulfide baths", "Liming drum washwaters", "Unhairing sludge"],
        mainHazards: [
          "Extreme alkaline corrosivity (pH 11.5–13.0)",
          "FATAL ACCIDENT RISK: Instantaneous liberation of lethal Hydrogen Sulfide (H2S) gas upon contact with any acid (pH < 9)",
          "High Chemical Oxygen Demand and acute aquatic toxicity"
        ],
        whySpecialHandling: "Hydrogen sulfide gas inhibits mitochondrial cytochrome c oxidase, causing immediate olfactory paralysis at >50 ppm, rapid unconsciousness, and fatal respiratory arrest within minutes at >100 ppm.",
        segregationConsiderations: "MANDATORY ISOLATION: Maintain a dedicated alkaline drainage pipe. NEVER route into the same trench, sump, or vessel as acid pickling waste or acidic storm drainage.",
        environmentalSafetyConcerns: "Lethal sewer gas explosions, worker fatalities in confined pump sumps, severe fish kills, and sewer concrete pipe biogenic sulfuric acid corrosion.",
        pathway: {
          identification: "Continuous online pH monitoring (must verify pH >= 10.0) and dissolved sulfide titration. Station H2S gas sensors with audible alarms.",
          segregation: "Dedicated sulfide effluent collection network. Mechanically separated from pickling acid lines.",
          safeStorage: "Sealed, vented concrete sumps with positive ventilation and alkaline chemical scrubbers.",
          treatmentDisposal: "Catalytic oxidation in dedicated aeration tanks using Manganese Sulfate (MnSO4) catalyst at pH 10.0–11.0 to oxidize S(2-) to non-toxic S2O3(2-) and SO4(2-) before biological treatment."
        },
        regulatoryRef: "CPCB Guidelines on Safe Handling of Sulfide Wastes; NIOSH Alert on Hydrogen Sulfide Hazards in Tanneries."
      },
      {
        id: "leather-liming-deliming",
        title: "Liming and Deliming Waste (Calcium Hydroxide & Ammonium Salts)",
        examples: ["Calcium hydroxide lime sludge", "Spent ammonium sulfate deliming liquors", "Decaying subcutaneous fat residues", "De-haired hide fleshings"],
        mainHazards: [
          "High pH (11.0–12.5) during liming; ammonia (NH3) gas release during deliming",
          "High total suspended solids (TSS > 15,000 mg/L) and high organic nitrogen",
          "Severe scale formation and pipeline clogging by calcium carbonate"
        ],
        whySpecialHandling: "High lime solids solidify in conveyance pipes; ammonia emissions present workplace respiratory irritation and contribute to nitrogenous water pollution.",
        segregationConsiderations: "Segregate unlimed from limed streams. Separate biological fleshings from chemical sludges for grease recovery.",
        environmentalSafetyConcerns: "Excess nitrogen driving eutrophication, ammonia toxicity to freshwater fish, and massive alkaline solid sludge accumulation.",
        pathway: {
          identification: "Check Total Kjeldahl Nitrogen (TKN), Total Suspended Solids (TSS), and calcium hardness. Label: 'Liming & Beamhouse Solids'.",
          segregation: "Screen coarse fleshings mechanically through vibrating screens prior to effluent equalisation.",
          safeStorage: "Equipped with primary mechanical de-gritting and gravity sedimentation basins.",
          treatmentDisposal: "Filter-press dewatering of lime sludge. Rendered tallow fats recovered for industrial biodiesel; de-watered lime cake utilized for soil pH amendment (subject to heavy metal-free verification) or co-processing in cement manufacturing."
        },
        regulatoryRef: "CPCB Minimal National Standards (MINAS) for Tanneries; Solid Waste Management Rules 2016."
      },
      {
        id: "leather-dyeing-finishing",
        title: "Dyeing and Finishing Waste (Colorants & Solvent Residues)",
        examples: ["Spent synthetic azo dye liquors", "Polyurethane and acrylic binder rinses", "Casein and wax finishing emulsions", "Isopropanol and butyl acetate spray booth washings"],
        mainHazards: [
          "Recalcitrant synthetic colorants with potential aromatic amine cleavages (azo dyes)",
          "Volatile Organic Compounds (VOCs) and flammable solvent vapors",
          "Microplastic polymer dispersions from synthetic finishing binders"
        ],
        whySpecialHandling: "Synthetic azo dyes resist aerobic biodegradation; spray booth residues contain volatile solvent mixtures that pose fire and inhalation hazards.",
        segregationConsiderations: "Isolate solvent-based finishing residues from aqueous dye baths. Collect paint and binder residues in flame-rated containers.",
        environmentalSafetyConcerns: "Color persistence in treated effluent preventing sunlight penetration in aquatic flora; atmospheric photochemical smog from VOC releases.",
        pathway: {
          identification: "Color spectrophotometry (Co-Pt units), solvent GC-FID screening, and Flash Point determination.",
          segregation: "Aqueous dye waste channeled to physical-chemical coagulation; solvent residues placed in grounded steel drums.",
          safeStorage: "Flammable solvent storage cabinets meeting NFPA 30; grounded containers to prevent static discharge.",
          treatmentDisposal: "Color removal via polyaluminium chloride (PAC) and cationic polymeric decoloring coagulants; solvent fractions transferred to authorized recyclers for vacuum re-distillation or high-temperature incineration in cement kilns."
        },
        regulatoryRef: "EU REACH Annex XVII on Azo Dyes (Directive 2002/61/EC); Central Pollution Control Board ZLD Norms."
      }
    ]
  },

  {
    id: "pharma",
    name: "Pharmaceutical Industry",
    tagline: "Active APIs, Solvent Recovery & Controlled Formulation Streams",
    description: "Drug product synthesis and formulation produce hazardous mother liquors, potent pharmacological compounds, heavy metal catalyst residues, and expired materials requiring strict chain-of-custody destruction.",
    accentColor: "blue",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1000&q=80",
    categories: [
      {
        id: "pharma-api",
        title: "Active Pharmaceutical Ingredient (API) Waste",
        isHazardousPriority: true,
        examples: ["High-potency antibiotics (e.g., Ciprofloxacin, Amoxicillin)", "Cytotoxic oncology active residues", "Hormonal and endocrine substances", "Steroid formulation washwaters"],
        mainHazards: [
          "High pharmacological potency even at nanogram-per-liter (ng/L) concentrations",
          "Antimicrobial Resistance (AMR) proliferation from residual antibiotic emissions",
          "Endocrine disruption and reproductive toxicity in aquatic organisms"
        ],
        whySpecialHandling: "CRITICAL: Direct environmental discharge of bioactive APIs creates multi-drug resistant superbugs and disrupts aquatic reproduction. Direct reuse in consumer products or fertilizers is strictly prohibited by law.",
        segregationConsiderations: "MANDATORY ISOLATION: Segregate cytotoxic and hormonal wastes into dedicated hazardous containment. Never mix with general sanitary sewers or non-potent process waters.",
        environmentalSafetyConcerns: "Development of antibiotic-resistant bacteria in local water bodies, feminization of aquatic organisms, and contamination of drinking water aquifers.",
        pathway: {
          identification: "Compound-specific HPLC-MS/MS quantification. Label clearly: 'CYTOTOXIC / HIGH-POTENCY ACTIVE PHARMACEUTICAL WASTE - AUTHORIZED TSDF INCINERATION ONLY'.",
          segregation: "Dedicated color-coded yellow bags and leak-proof rigid containers under negative pressure cleanrooms.",
          safeStorage: "Access-controlled, locked hazardous storage room under 24/7 video surveillance and spill containment bunds.",
          treatmentDisposal: "Authorized thermal destruction in double-chamber hazardous waste incinerators at >= 1100°C (with gas residence time >= 2 seconds) or high-temperature co-processing in cement rotary kilns (1450°C), achieving >= 99.99% Destruction and Removal Efficiency (DRE)."
        },
        regulatoryRef: "CPCB Guidelines on Environmental Management in Pharmaceutical Industry; US EPA 40 CFR Part 439; WHO Guidance on Antibiotic Waste."
      },
      {
        id: "pharma-solvents",
        title: "Organic Solvent Waste (Halogenated & Non-Halogenated)",
        isHazardousPriority: true,
        examples: ["Dichloromethane (DCM) and Chloroform mother liquors", "Toluene, Hexane, and Xylene reaction media", "Methanol, Isopropanol (IPA), and Ethanol crystallisation washes", "Acetone equipment rinses"],
        mainHazards: [
          "High flammability (Flash points < 23°C for acetone, ethanol, toluene)",
          "Carcinogenicity and liver toxicity of chlorinated solvents (DCM, chloroform)",
          "Peroxide formation in ether solvents (THF, diisopropyl ether) upon atmospheric exposure"
        ],
        whySpecialHandling: "Volatile organic solvents present severe explosion, fire, and toxic vapor hazards. Chlorinated solvents generate toxic phosgene and dioxins under uncontrolled heating.",
        segregationConsiderations: "STRICT REQUIREMENT: Strictly separate halogenated solvents (DCM, chloroform) from non-halogenated solvents. Never allow contact between oxidizers (nitric acid, H2O2) and flammable solvents.",
        environmentalSafetyConcerns: "Severe volatile organic compound (VOC) emissions, tropospheric ozone formation, persistent groundwater plumes, and explosion hazards in municipal sewer lines.",
        pathway: {
          identification: "Gas Chromatography with Flame Ionization Detection (GC-FID). Moisture determination by Karl Fischer titration. Flammability and peroxide test.",
          segregation: "Separate into two dedicated streams: Stream A (Non-Halogenated Flammable) and Stream B (Halogenated Solvents).",
          safeStorage: "Electrically grounded stainless steel tanks or UN-rated steel drums in flameproof (Ex-d rated) storage yards with nitrogen blanketing.",
          treatmentDisposal: "On-site or authorized off-site fractional azeotropic distillation to recover high-purity solvents for secondary industrial re-use; non-recoverable chlorinated residues sent to high-temperature TSDF hazardous waste incinerators with multi-stage wet lime scrubbers."
        },
        regulatoryRef: "Hazardous and Other Wastes Rules 2016 (Schedule II - Class A4); NFPA 30 Flammable and Combustible Liquids Code."
      },
      {
        id: "pharma-reagents",
        title: "Chemical Reagent Waste (Catalysts, Acids & Bases)",
        examples: ["Spent Palladium on Carbon (Pd/C) and Raney Nickel catalysts", "Strong mineral acids (HCl, H2SO4, HNO3) from hydrolysis", "Thionyl chloride and phosphorus oxychloride residues", "Sodium borohydride and lithium hydride quenching waters"],
        mainHazards: [
          "Pyrophoric hazards (spent Pd/C and Raney Nickel can ignite spontaneously on air exposure)",
          "Severe corrosivity and exothermic reactivity with moisture",
          "Toxic heavy metal leaching into groundwater"
        ],
        whySpecialHandling: "Spent hydrogenation catalysts present acute fire risks when dried out. Quenched hydride residues generate explosive hydrogen gas.",
        segregationConsiderations: "Store spent catalysts under water or inert solvent slurry under nitrogen blanketing. Store acids physically separated from bases by minimum 6 meters.",
        environmentalSafetyConcerns: "Release of toxic heavy metals, soil acidification, exothermic pipeline reactions, and flammable hydrogen gas buildup in sumps.",
        pathway: {
          identification: "Metal assay via ICP-OES. Pyrophoric reactivity test under inert atmosphere. pH and moisture verification.",
          segregation: "Submerged under liquid in airtight drums. Dedicated corrosive containment bays.",
          safeStorage: "Nitrogen-blanketed, cool, ventilated storage cells with spark-free ventilation systems.",
          treatmentDisposal: "Precious metal reclamation: transfer to authorized hydrometallurgical refineries for palladium/nickel recovery; mineral acids neutralized in automated pH neutralization sumps using calcium hydroxide (lime slurry) prior to primary clarifier."
        },
        regulatoryRef: "CPCB Guidelines for Recycling of Spent Catalysts (Schedule IV); OSHA 1910.1200."
      },
      {
        id: "pharma-expired-materials",
        title: "Expired Pharmaceutical Materials (Finished Products & Recalls)",
        examples: ["Out-of-date commercial tablet and capsule batches", "Compromised injectable ampoules and vials", "Off-specification active bulk drug powders", "Recalled pharmaceutical suspensions"],
        mainHazards: [
          "Degraded chemical impurities and toxic decomposition products",
          "Risk of black-market pilferage and illegal counterfeit resale",
          "Potential widespread bioactivity if disposed of in municipal dumps"
        ],
        whySpecialHandling: "Must prevent unauthorized diversion into counterfeit drug distribution networks and prevent mass environmental bioactivity.",
        segregationConsiderations: "Must remain in locked quarantine with dual-custody authorization. Separate cytotoxic, narcotic, and controlled substances into dedicated locked safes.",
        environmentalSafetyConcerns: "Direct entry of pharmaceuticals into municipal landfills, leaching through unlined soils into drinking water reservoirs.",
        pathway: {
          identification: "Inventory reconciliation against original production batch records and regulatory recall notices. Full chain-of-custody documentation.",
          segregation: "Quarantined in locked cage labeled 'EXPIRED PHARMACEUTICALS - PENDING DESTRUCTION'.",
          safeStorage: "High-security storage with dual key authorization and automated tamper-evident logging.",
          treatmentDisposal: "Mandatory destruction in the presence of an authorized regulatory officer: mechanical shredding, crushing, and high-temperature thermal co-processing in cement rotary kilns (1450°C) or licensed hazardous waste incinerators. Obtain certified Destruction Certificate."
        },
        regulatoryRef: "Drugs and Cosmetics Act 1940 & Rules 1945; Central Drugs Standard Control Organization (CDSCO) Destruction Guidelines."
      },
      {
        id: "pharma-lab-waste",
        title: "Laboratory Chemical Waste (HPLC Mobile Phases & Standards)",
        examples: ["Spent HPLC acetonitrile-water mobile phases", "GC analytical standard vials", "Karl Fischer titration pyridine/sulfur dioxide waste", "Microbiological culture media and agar plates"],
        mainHazards: [
          "Toxic organonitriles (acetonitrile releases cyanide ions upon metabolic breakdown)",
          "Flammability of analytical solvent blends",
          "Biohazardous microbial pathogens in quality control testing plates"
        ],
        whySpecialHandling: "Acetonitrile is toxic and flammable; biological QC samples contain viable bacterial strains requiring autoclaving.",
        segregationConsiderations: "Provide dedicated carboys for: 1. Acetonitrile HPLC waste, 2. Halogenated lab solvents, 3. Biological media (autoclaved before transfer).",
        environmentalSafetyConcerns: "Toxicity to sewage bacteria, release of volatile nitriles into workspace air, contamination of water sources.",
        pathway: {
          identification: "Identify components on carboy labeling log sheet with solvent percentages and analytical tracking codes.",
          segregation: "Store in dedicated heavy-duty HDPE carboys with vapor-trapping exhaust funnels inside chemical fume hoods.",
          safeStorage: "Flammable safety storage cabinets compliant with OSHA standards. Auto-closing lids.",
          treatmentDisposal: "Microbial plates: steam autoclaving at 121°C for 30 minutes. Solvent carboys: transferred to licensed hazardous waste management facility for solvent fuel blending or incineration."
        },
        regulatoryRef: "Prudent Practices in the Laboratory (National Research Council); CPCB Laboratory Waste Guidelines."
      },
      {
        id: "pharma-packaging",
        title: "Contaminated Packaging Waste (Blister Scrap, Vials & Drums)",
        examples: ["Alu-PVC and Alu-Alu blister trimming scraps", "Residual API-contaminated plastic and steel drums", "Glass serum ampoules and vials", "Expired HDPE bulk drug carboys"],
        mainHazards: [
          "Trace API and toxic chemical dust adhering to container inner walls",
          "Chlorinated PVC polymers releasing HCl and dioxins if burned uncontrolled",
          "Physical puncture hazards from broken glass ampoules"
        ],
        whySpecialHandling: "Chemical drums without certified triple-rinsing retain toxic residue that can poison scrap workers; PVC blisters cannot be openly incinerated.",
        segregationConsiderations: "Segregate primary packaging (direct drug contact) from clean secondary cartons. Glass collected in puncture-resistant rigid sharps containers.",
        environmentalSafetyConcerns: "Landfill clogging by non-degradable composite blister laminates, toxic worker exposures during unregulated informal recycling.",
        pathway: {
          identification: "Determine drug contact status. Contaminated containers designated 'HAZARDOUS CONTAMINATED PACKAGING'.",
          segregation: "Crush glass in designated drum crushers; sort blisters into separate storage cells.",
          safeStorage: "Secured, covered storage bay to prevent rainwater ingress and runoff of chemical residues.",
          treatmentDisposal: "Chemical drums: certified multi-solvent triple-rinse and mechanical puncture (de-heading) before transfer to authorized drum recyclers; blister scrap: green delamination to recover high-purity secondary aluminum and rigid PVC regranulate; glass vials: sanitized and remelted in industrial glass furnaces."
        },
        regulatoryRef: "Plastic Waste Management Rules 2016; Hazardous and Other Wastes Rules 2016 (Schedule II - Class A33 - Contaminated Containers)."
      }
    ]
  },

  {
    id: "cosmetics",
    name: "Cosmetic Industry",
    tagline: "Surfactants, Lipids, Pigments & Emulsion Residue Management",
    description: "Personal care and cosmetics formulation produces high-foam surfactant washings, greasy lipid phases, synthetic colorant sludges, preservative residues, and composite plastic packaging.",
    accentColor: "teal",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80",
    categories: [
      {
        id: "cosmetic-surfactants",
        title: "Surfactant-Containing Waste (Foaming Washwaters & Residues)",
        examples: ["Sodium Laureth Sulfate (SLES) tank washings", "Cocamidopropyl Betaine (CAPB) line rinses", "Shampoo and body wash batch heels", "Industrial detergent clean-in-place (CIP) effluents"],
        mainHazards: [
          "Persistent foaming that blankets wastewater aeration basins and arrests biological oxygen transfer",
          "Trace 1,4-Dioxane (carcinogenic byproduct of ethoxylation)",
          "Aquatic toxicity from lowered water surface tension and fish gill damage"
        ],
        whySpecialHandling: "Excessive foam clogs treatment tanks and prevents bacteria from absorbing oxygen; uncontrolled foaming disrupts municipal sewer pipes.",
        segregationConsiderations: "Separate high-foaming concentrated rinses from general low-BOD cooling waters. Equalize flow before aeration.",
        environmentalSafetyConcerns: "Massive foam blankets over surface rivers, destruction of aquatic invertebrate respiratory membranes, and groundwater infiltration.",
        pathway: {
          identification: "Measure Active Anionic/Amphoteric Matter (ISO 2271) and foam height stability. 1,4-Dioxane GC-MS screening.",
          segregation: "Collect concentrated washings in a dedicated high-foam balancing tank.",
          safeStorage: "Fitted with automated mechanical or silicone anti-foam dosing pumps and ultrasonic level sensors.",
          treatmentDisposal: "Chemical coagulation with coagulant aids (alum/ferric chloride + polyacrylamide) to break foam, followed by dissolved air flotation (DAF) and aerobic Moving Bed Biofilm Reactor (MBBR) biological degradation. Alternatively, ultrafiltration concentration into heavy-duty industrial vehicle wash degreasers."
        },
        regulatoryRef: "CPCB Effluent Standards for Detergent and Personal Care Units; EPA 40 CFR Part 417."
      },
      {
        id: "cosmetic-oils-fats",
        title: "Oils and Fats (Lipid Phases, Squalane & Plant Waxes)",
        examples: ["Rancid vegetable oils (argan, jojoba, sweet almond)", "Mineral oil and petroleum jelly tank bottoms", "Squalane and ester emollient washings", "Lipstick and mascara wax heels"],
        mainHazards: [
          "Extremely high COD (> 150,000 mg/L) and high Fat, Oil, and Grease (FOG) content",
          "Formation of massive sewer pipe fatbergs and pipe blockages",
          "Suffocating oil films on water surfaces"
        ],
        whySpecialHandling: "Free fats and waxes solidify at room temperature, completely plugging drainage networks and creating catastrophic sewer overflows.",
        segregationConsiderations: "Mandatory installation of heated grease traps and oil-water separators. Do not allow hot molten fats to drain into municipal pipes.",
        environmentalSafetyConcerns: "Fatberg formation in city sewer networks, depletion of dissolved oxygen in aquatic habitats, and coating of bird feathers and fish gills.",
        pathway: {
          identification: "Analyze Free Fatty Acid (FFA %), Saponification value, and melting point. Label: 'Waste Industrial Lipid Phase'.",
          segregation: "Drain directly into jacketed or heated collection vessels to prevent in-pipe solidification.",
          safeStorage: "Insulated, heated tanks (40–50°C) with skimming baffles and high-level alarms.",
          treatmentDisposal: "Centrifugal oil-water separation: recovered clean lipid fraction transferred to authorized biorefineries for transesterification into commercial biodiesel (FAME) or industrial formwork mold-release lubricants; aqueous phase treated in anaerobic biomethanation digesters."
        },
        regulatoryRef: "Municipal Sewer Discharge Standards (FOG < 100 mg/L); ASTM D6751 Biodiesel Feedstock Standards."
      },
      {
        id: "cosmetic-preservatives",
        title: "Preservative-Containing Waste (Antimicrobial Formulations)",
        examples: ["Parabens (methyl, propyl, butyl paraben) washwaters", "Phenoxyethanol concentrate residues", "Isothiazolinones (methylchloroisothiazolinone / MIT)", "DMDM hydantoin (formaldehyde releasers)"],
        mainHazards: [
          "Potent antimicrobial toxicity that poisons biological wastewater treatment bacteria",
          "Skin sensitization and contact dermatitis risks in handling personnel",
          "Aquatic ecotoxicity and bioaccumulation"
        ],
        whySpecialHandling: "Preservatives are engineered to kill microorganisms. Discharging them directly into biological ETP plants kills the beneficial bacteria and halts sewage purification.",
        segregationConsiderations: "MUST BE SEGREGATED: Collect concentrated preservative rinses separately from biological wastewater feeds. Neutralize toxicity before biological contact.",
        environmentalSafetyConcerns: "Massive biological ETP plant die-offs, release of formaldehyde into air, endocrine disruption in river ecosystems.",
        pathway: {
          identification: "HPLC screening for active preservative concentration. Bio-inhibition testing on activated sludge.",
          segregation: "Segregate in dedicated intermediate bulk containers (IBCs) labeled 'PRESERVATIVE CONCENTRATE'.",
          safeStorage: "Sealed, chemically resistant HDPE totes in shaded, ventilated hazardous material storage bays.",
          treatmentDisposal: "Pre-treatment with Advanced Oxidation Processes (AOP: UV/H2O2, Fenton's reagent, or ozone) to chemically cleave the antimicrobial molecules prior to biological ETP routing, or transfer to licensed hazardous waste incineration facility."
        },
        regulatoryRef: "EU Cosmetics Regulation (EC) No 1223/2009 Annex V (Preservatives); CPCB Guidelines on Toxic Effluents."
      },
      {
        id: "cosmetic-pigments",
        title: "Pigment and Colourant Waste (Oxides & Synthetic Dyes)",
        examples: ["Titanium dioxide (TiO2) nanoparticles and sludges", "Iron oxides (red, yellow, black CI 77491/77492/77499)", "Synthetic organic colorants (e.g., CI 15850 D&C Red 6/7)", "Coated mica and effect glitter flakes"],
        mainHazards: [
          "High turbidity and suspended solids (TSS > 10,000 mg/L)",
          "Inhalation toxicity of fine crystalline titanium dioxide dust",
          "Non-biodegradable synthetic colorants causing intense wastewater staining"
        ],
        whySpecialHandling: "Mineral pigments do not degrade biologically and coat wastewater clarifiers with heavy, dense, colorful sludges that resist standard flocculation.",
        segregationConsiderations: "Collect dry powder pigments in dust-extraction collection drums. Prevent wet pigment slurry from entering stormwater drains.",
        environmentalSafetyConcerns: "Persistent coloration of river bodies blocking sunlight, nanoparticle toxicity in benthic organisms, and heavy sludge buildup.",
        pathway: {
          identification: "Measure Total Suspended Solids (TSS), Particle Size Distribution, and Color index. Check for heavy metal impurities (Lead, Arsenic, Cadmium).",
          segregation: "Dry pigment sweepings kept dry in sealed drums; washings routed to physical coagulation sump.",
          safeStorage: "Dry, sealed containers with HEPA vacuum filtration systems in wash areas.",
          treatmentDisposal: "Chemical coagulation-precipitation using polyaluminum chloride (PAC) and anionic polymer coagulants, followed by plate-and-frame filter press dewatering. Dewatered non-toxic mineral pigment cake reused as colorant in ceramic tile manufacture or disposed of in authorized sanitary industrial landfill."
        },
        regulatoryRef: "US FDA 21 CFR Part 73/74 Listing of Color Additives; CPCB Environmental Standards for Dye Formulations."
      },
      {
        id: "cosmetic-fragrance",
        title: "Fragrance-Related Waste (Essential Oils & Terpenes)",
        examples: ["Synthetic perfume oil washes (limonene, linalool, citronellol)", "Essential oil distillation bottom residues", "Ethanol-based perfume line flushings", "Aroma chemical distillation residues"],
        mainHazards: [
          "High flammability (Flash point < 35°C for perfume alcohol rinses)",
          "Extreme volatility and respiratory sensitization hazards",
          "Aquatic acute toxicity to fish and aquatic algae (WGK 2/3)"
        ],
        whySpecialHandling: "Ethanol-fragrance mixtures form explosive vapor mixtures at ambient temperatures; high terpene concentrations are toxic to aquatic organisms.",
        segregationConsiderations: "Flammable solvent-fragrance rinses must be stored in grounded, flame-rated containers away from heat sources and oxidizers.",
        environmentalSafetyConcerns: "Volatile organic compound emissions, aquatic toxicity, odor complaints in industrial zones, and sewer explosion hazards.",
        pathway: {
          identification: "Flash point determination (Pensky-Martens closed-cup), GC-MS terpene profiling, and VOC analysis.",
          segregation: "Collected in dedicated stainless steel solvent drums equipped with spark-free grounding clamps.",
          safeStorage: "Flammable storage room meeting NFPA 30 standards with continuous hydrocarbon gas detection.",
          treatmentDisposal: "Low-temperature vacuum distillation to recover ethanol and valuable terpene fractions for secondary industrial solvent applications; heavy bottoms blended into authorized alternative fuels for cement kilns or incinerated."
        },
        regulatoryRef: "International Fragrance Association (IFRA) Code of Practice; OSHA 1910.106 Flammable Liquids."
      },
      {
        id: "cosmetic-solvents",
        title: "Solvent-Containing Waste (Acetone, Ethyl Acetate & IPA)",
        examples: ["Nail polish and lacquer remover washings (acetone, ethyl acetate)", "Aerosol line purging solvents", "Silicones and volatile carrier solvents (cyclomethicone, isododecane)", "Equipment sanitization alcohol"],
        mainHazards: [
          "Extreme fire and explosion risk (Flash points < 0°C for acetone)",
          "Volatile Organic Compound emissions and smog generation",
          "Skin and eye irritation from toxic solvent vapors"
        ],
        whySpecialHandling: "Low-flash-point solvents present acute fire hazards during plant washdowns; ungrounded transfer causes static electricity explosions.",
        segregationConsiderations: "Strict segregation from non-solvent aqueous streams. Never dump solvents into general plant drainage or open sumps.",
        environmentalSafetyConcerns: "Atmospheric VOC pollution, severe workplace fire hazard, sewer explosions, and groundwater aquifer contamination.",
        pathway: {
          identification: "Flash Point, specific gravity, and Gas Chromatography (GC-FID) solvent assay.",
          segregation: "Classified as 'FLAMMABLE INDUSTRIAL SOLVENT WASTE (Category 1/2)'.",
          safeStorage: "UL-listed safety storage cans or grounded drums with flame arrestor vents in ventilated, explosion-proof storage areas.",
          treatmentDisposal: "Transfer to authorized closed-loop solvent reclamation contractors for fractional distillation into commercial paint thinners and degreasers, or thermal destruction at licensed TSDF incinerators."
        },
        regulatoryRef: "Hazardous and Other Wastes Rules 2016 (Schedule II - Class A4); NFPA 30."
      },
      {
        id: "cosmetic-packaging",
        title: "Contaminated Packaging Waste (Lotion Pumps, Bottles & Tubes)",
        examples: ["Plastic bottles with residual lotion (HDPE, PET, PP)", "Lotion pumps containing stainless steel springs and mixed resins", "Multilayer laminated cosmetic squeeze tubes (Alu-PE)", "Glass perfume flacons with metal spray crimps"],
        mainHazards: [
          "Entrained formulation residues (preservatives, oils, fragrances) preventing clean recycling",
          "Multi-material assemblies (plastic + metal springs) jamming automated shredders",
          "Centuries of landfill persistence and marine microplastic proliferation"
        ],
        whySpecialHandling: "Multi-material cosmetic packaging cannot be recycled in single-stream municipal systems without specialized mechanical de-metalizing and washing.",
        segregationConsiderations: "Segregate rigid plastics (PET, HDPE), mixed pumps, and glass bottles into separate dry collection bins.",
        environmentalSafetyConcerns: "Massive solid landfill accumulation, microplastic shedding into soils and waterways, and resource waste of virgin petroleum polymers.",
        pathway: {
          identification: "Optical NIR polymer identification (Resin codes #1 PET, #2 HDPE, #5 PP). Verification of drug/chemical residue levels.",
          segregation: "Sort into dedicated color-coded bins: Rigid Plastics, Mixed Metal Pumps, and Container Glass.",
          safeStorage: "Clean, dry, sheltered storage yard protected from wind and stormwater runoff.",
          treatmentDisposal: "Mechanical shredding followed by hot alkaline surfactant wash to remove formulation residues; magnetic separation of metal springs; NIR sorting and melt-extrusion into certified post-consumer recycled (rPET / rHDPE) pellets for non-food industrial containers and drainage pipes."
        },
        regulatoryRef: "Plastic Waste Management Rules 2016 (Extended Producer Responsibility - EPR Mandate); ISO 15270."
      }
    ]
  }
];
