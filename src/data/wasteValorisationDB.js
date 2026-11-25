export const WASTE_INDUSTRIES = [
  {
    id: 'leather',
    name: 'Leather tanning',
    description: 'Beamhouse, tanning, finishing and effluent-treatment residues.'
  },
  {
    id: 'cosmetics',
    name: 'Cosmetics',
    description: 'Personal-care formulation, process and packaging residues.'
  },
  {
    id: 'pharmaceutical',
    name: 'Pharmaceutical',
    description: 'Drug-product, API-synthesis and bioprocess residues.'
  }
];

export const WASTE_STREAMS = [
  {
    id: 'leather-trimmings-scraps',
    industryId: 'leather',
    categoryName: 'Leather trimmings and scraps',
    aliases: ['hide offcuts', 'vegetable-tanned offcuts', 'chrome-tanned scraps', 'leather trim'],
    wasteProfile: {
      chemicalComposition: 'Collagen-rich hide matrix with residual tanning agents, dyes, fatliquors and salts. Untanned/vegetable-tanned material differs from chrome-tanned material; confirm tanning history and total chromium before routing.',
      typicalPhysicalState: 'Solid',
      environmentalConcerns: 'Putrescible untreated hide can produce odor and high organic loads. Chrome-tanned pieces may leach chromium; uncontrolled burning can form hazardous emissions.'
    },
    recoveryMethod: {
      methodName: 'Segregated collagen recovery or material-specific recycling',
      scientificExplanation: 'Clean untanned and verified vegetable-tanned fractions may be mechanically size-reduced and hydrolysed to recover collagen peptides. Chrome-tanned fractions require closed-loop dechroming with chromium separation or an authorized controlled treatment route; they are not interchangeable feedstock.',
      processingConsiderations: 'Segregate at source by tanning chemistry. Characterize total and leachable Cr, Cr(VI), sulfide, dyes and biocides; validate hydrolysate purity and manage chromium-bearing liquor as regulated waste.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'Technical collagen hydrolysate',
        applications: 'Conditioned industrial binder or protein-based adhesive after contaminant and performance qualification.',
        targetIndustries: ['Paper and board', 'Construction materials'],
        suitabilityRationale: 'Collagen-derived proteins can provide binding functionality, but only material with demonstrated low contaminant migration is suitable.',
        maturityLevel: 'Emerging / Pilot-Scale'
      },
      {
        recoveredMaterial: 'Recovered chromium tanning salt',
        applications: 'Return to a controlled tanning process only after purification and process qualification.',
        targetIndustries: ['Leather tanning'],
        suitabilityRationale: 'Chrome-bearing fractions can support closed-loop chromium recovery; this is not unrestricted cross-sector reuse.',
        maturityLevel: 'Established Industrial'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'High for source-segregated, clean fractions; limited when mixed or contaminated.',
      resourceConservation: 'Can displace virgin protein binder or primary chromium salts when product quality and recovery yield are verified.',
      environmentalAdvantages: 'Reduces disposal demand and may retain material value; controlled chromium recovery avoids uncontrolled metal release.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'Medium',
      feasibilityRationale: 'Mechanical sorting is practical, while recovery economics and product quality depend strongly on tanning chemistry and contamination.',
      contaminationRisks: 'Cr(III)/Cr(VI), sulfide, dyes, biocides, salts, preservatives and mixed polymer coatings.',
      requiredQualityChecks: 'Total chromium and Cr(VI) by validated digestion/speciation; leachability; sulfide; moisture/ash; protein content; target-product contaminant and migration tests.',
      regulatoryConsiderations: 'Determine hazardous-waste status and permitted recovery route under local rules; recovered outputs require applicable product, chemical and waste-derived-material approvals.',
      hardSafetyRestrictions: 'Do not blend chrome-tanned and untanned material. No direct land application, animal feed, food, cosmetic or consumer-product use without applicable authorization and contaminant-specific approval. Chrome-bearing material must go to a permitted recovery/treatment facility.'
    }
  },
  {
    id: 'leather-chromium-waste',
    industryId: 'leather',
    categoryName: 'Chromium-containing leather waste',
    aliases: ['chrome shavings', 'wet-blue shavings', 'buffing dust', 'chrome splits'],
    wasteProfile: {
      chemicalComposition: 'Collagen matrix containing chromium(III) tanning complexes, residual sulfate, dyes, oils and finishing agents; buffing dust may be respirable and compositionally variable.',
      typicalPhysicalState: 'Solid',
      environmentalConcerns: 'Chromium can leach to soil and water. Under some oxidizing conditions Cr(III) may form more mobile and toxic Cr(VI); fine dust can disperse.'
    },
    recoveryMethod: {
      methodName: 'Closed-loop chromium separation and controlled protein recovery',
      scientificExplanation: 'Controlled alkaline or enzymatic hydrolysis can separate collagen-rich liquor from chromium-bearing solids/liquor. Chromium recovery requires engineered precipitation/separation and purification; residues that fail leachability criteria need authorized stabilization or disposal.',
      processingConsiderations: 'Use enclosed handling and dust control. Track chromium mass balance, pH and oxidation state; characterize recovered salt and each residual fraction before reuse or dispatch.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'Purified basic chromium sulfate solution',
        applications: 'Qualified return to chrome tanning in a monitored closed-loop process.',
        targetIndustries: ['Leather tanning'],
        suitabilityRationale: 'The recovered chromium can substitute a portion of fresh tanning salt only when purity and tanning performance meet specifications.',
        maturityLevel: 'Established Industrial'
      },
      {
        recoveredMaterial: 'Dechromed protein hydrolysate',
        applications: 'Technical binder or retanning auxiliary after stringent metal and organic contaminant testing.',
        targetIndustries: ['Leather finishing', 'Construction materials'],
        suitabilityRationale: 'Protein functionality can be useful, but chromium carryover must be analytically demonstrated below the receiving-use limits.',
        maturityLevel: 'Emerging / Pilot-Scale'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'Medium to high with effective chromium recovery and a permitted outlet for residual solids.',
      resourceConservation: 'Can recover chromium salt and protein rather than relying solely on virgin inputs.',
      environmentalAdvantages: 'Closed-loop recovery limits metal losses; controlled treatment is preferable to uncontrolled storage, burning or dumping.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'Medium',
      feasibilityRationale: 'Industrial recovery technologies exist, but require dedicated containment, emissions control, skilled operators and regulated residual management.',
      contaminationRisks: 'Cr(III), potential Cr(VI), dyes, biocides, sulfide, process acids/alkalis and fine particulate.',
      requiredQualityChecks: 'Total Cr by ICP-OES/ICP-MS; Cr(VI) speciation; leachability; pH; sulfate; dust exposure assessment; recovered-salt purity; residual solid characterization.',
      regulatoryConsiderations: 'Classify and manage under applicable hazardous-waste and occupational-safety requirements; use licensed transporters and permitted recovery or treatment facilities.',
      hardSafetyRestrictions: 'Never use as soil amendment, feed, food, cosmetic ingredient or unrestricted consumer material. No open burning or ordinary composting. Keep segregated and contained; send only to an authorized chromium recovery, stabilization or disposal route.'
    }
  },
  {
    id: 'leather-hair-fleshings',
    industryId: 'leather',
    categoryName: 'Hair and fleshings',
    aliases: ['limed fleshings', 'beamhouse hair', 'unhairing waste', 'fleshing residues'],
    wasteProfile: {
      chemicalComposition: 'Keratin-rich hair plus collagen, residual fats/lipids, lime, sulfide and high-moisture process liquor; composition changes with hair-save practice.',
      typicalPhysicalState: 'Semi-solid',
      environmentalConcerns: 'Rapid putrefaction, high BOD/COD, odor and sulfide toxicity. Acidification of sulfide-bearing waste can release hydrogen sulfide gas.'
    },
    recoveryMethod: {
      methodName: 'Source-segregated keratin/protein and lipid recovery',
      scientificExplanation: 'Screening and washing separate hair fibers; controlled enzymatic treatment can recover keratin/protein fractions, while rendered lipid may be recovered separately. Sulfide removal and stabilization must precede downstream biological or acid operations.',
      processingConsiderations: 'Maintain sulfide-compatible alkaline handling until verified oxidation/removal. Measure sulfide and pH before any neutralization; control pathogens, odor, fats and high-strength liquor.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'Technical keratin hydrolysate',
        applications: 'Qualified industrial protein additive or binder following pathogen, sulfide and contaminant treatment.',
        targetIndustries: ['Biomaterials', 'Paper and board'],
        suitabilityRationale: 'Keratin has useful nitrogen and film-forming properties, but variable liming chemicals and biological load require intensive treatment.',
        maturityLevel: 'Emerging / Pilot-Scale'
      },
      {
        recoveredMaterial: 'Separated recovered fat',
        applications: 'Industrial oleochemical feedstock after contaminant and free-fatty-acid testing.',
        targetIndustries: ['Oleochemicals', 'Industrial fuels'],
        suitabilityRationale: 'A lipid fraction can be valorised if sulfide, water and chemical residues are controlled and the receiver is authorized.',
        maturityLevel: 'Emerging / Pilot-Scale'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'Medium; source separation improves recovery and reduces the organic load sent to effluent treatment.',
      resourceConservation: 'Recovers protein and lipid fractions that may displace virgin oleochemical or technical protein inputs.',
      environmentalAdvantages: 'Reduces putrescible solids and untreated high-strength discharges when residual liquor is properly treated.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'Medium',
      feasibilityRationale: 'Recovery is technically possible near a tannery but depends on rapid collection, sulfide controls and a reliable market.',
      contaminationRisks: 'Sulfide, lime, ammonia, pathogens, preservatives, salts and residual chrome from mixed operations.',
      requiredQualityChecks: 'pH and dissolved sulfide; total nitrogen/protein; lipid and free-fatty-acid profile; pathogen indicators; metals; residual sulfide in products.',
      regulatoryConsiderations: 'Confirm animal-by-product, bio-waste, occupational exposure and hazardous-waste obligations for the source and end use.',
      hardSafetyRestrictions: 'Never mix sulfide-bearing material with acids or acidic wastewater. Keep alkaline and segregated until sulfide is removed and verified. No feed, fertilizer or consumer use without treatment validation and all required approvals.'
    }
  },
  {
    id: 'leather-tannery-sludge',
    industryId: 'leather',
    categoryName: 'Tannery sludge',
    aliases: ['primary tannery sludge', 'secondary biological sludge', 'chemical treatment sludge', 'ETP sludge'],
    wasteProfile: {
      chemicalComposition: 'Variable mixture of mineral precipitates, biomass, organic matter, chromium and other metals, sulfide, salts and treatment chemicals; primary, biological and chemical sludges are distinct streams.',
      typicalPhysicalState: 'Sludge',
      environmentalConcerns: 'May release metals, pathogens, odor and high-organic leachate. Land use or construction use without characterization can transfer contaminants.'
    },
    recoveryMethod: {
      methodName: 'Stream segregation, metal recovery and permitted stabilization',
      scientificExplanation: 'Keep chromium-rich chemical sludge separate from biological sludge. Selective leaching/precipitation can recover chromium from suitable streams; otherwise dewater and stabilize to meet receiving-facility criteria.',
      processingConsiderations: 'Characterize each sludge source and batch. Control leachate and aerosols; do not assume incineration, cement use or land application is permitted based on generic composition.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'Recovered chromium salt',
        applications: 'Return to tanning only after purification and receiving-process acceptance.',
        targetIndustries: ['Leather tanning'],
        suitabilityRationale: 'Recovery is feasible for sufficiently concentrated chromium sludge; organic and co-metal impurities determine practicality.',
        maturityLevel: 'Established Industrial'
      },
      {
        recoveredMaterial: 'Stabilized mineral residue',
        applications: 'Potential engineered construction aggregate only when leachability, strength and local approvals are met.',
        targetIndustries: ['Construction materials'],
        suitabilityRationale: 'Mineral matrices can sometimes immobilize contaminants, but use is conditional on product testing and regulatory acceptance.',
        maturityLevel: 'Emerging / Pilot-Scale'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'Low to medium; recovery is dependent on chromium concentration and residual classification.',
      resourceConservation: 'Selective metal recovery can reduce virgin chromium demand; stabilization may reduce disposal volume.',
      environmentalAdvantages: 'Segregation and controlled treatment prevent metal transfer to water, soil and uncontrolled residual streams.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'Low',
      feasibilityRationale: 'Highly variable chemistry and potentially hazardous classification make testing, permitting and residual management cost-intensive.',
      contaminationRisks: 'Chromium including possible Cr(VI), sulfide, other metals, pathogens, persistent organics and concentrated treatment reagents.',
      requiredQualityChecks: 'Total metals and Cr(VI); leachability under applicable method; sulfide; pH; moisture; organic content; pathogen screen for biological sludge; stabilization performance.',
      regulatoryConsiderations: 'Waste classification and disposal/recovery must follow local hazardous-waste rules and permitted-facility acceptance criteria.',
      hardSafetyRestrictions: 'No uncharacterized land application, composting, open burning or construction use. Keep primary, biological and chemical sludge segregated; route hazardous sludge only through authorized treatment/recovery/disposal.'
    }
  },
  {
    id: 'leather-high-bod-cod-wastewater',
    industryId: 'leather',
    categoryName: 'High-BOD/COD wastewater',
    aliases: ['tannery effluent', 'beamhouse wastewater', 'high-strength tannery liquor'],
    wasteProfile: {
      chemicalComposition: 'Aqueous mixture of proteins, fats, sulfide, salts, lime, chromium (depending on collection point), dyes and suspended solids; BOD/COD varies widely by process stage.',
      typicalPhysicalState: 'Liquid',
      environmentalConcerns: 'Untreated discharge depletes dissolved oxygen and can be acutely toxic from sulfide, salinity, chromium or extreme pH.'
    },
    recoveryMethod: {
      methodName: 'Segregated pretreatment with anaerobic/aerobic treatment and water reuse',
      scientificExplanation: 'Screens and equalization remove solids; sulfide oxidation, chromium precipitation and fat separation are applied to segregated streams. Anaerobic treatment can convert biodegradable COD to biogas, followed by aerobic polishing and validated reuse treatment.',
      processingConsiderations: 'Do not combine sulfide and acidic streams. Monitor pH, sulfide, chromium, salinity, BOD/COD and treatment performance; reuse requires fit-for-purpose water quality.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'Treated process water',
        applications: 'Non-product-contact cleaning or selected process steps after validated treatment and monitoring.',
        targetIndustries: ['Leather tanning', 'Industrial utilities'],
        suitabilityRationale: 'Water reuse reduces freshwater demand when dissolved salts, metals, organics and microbiological quality meet the specific use standard.',
        maturityLevel: 'Established Industrial'
      },
      {
        recoveredMaterial: 'Biogas from biodegradable COD',
        applications: 'On-site heat or power generation in an engineered gas system.',
        targetIndustries: ['Industrial utilities'],
        suitabilityRationale: 'Anaerobic conversion can recover energy from biodegradable organic load; gas cleanup and safe handling are essential.',
        maturityLevel: 'Emerging / Pilot-Scale'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'High for integrated treatment and fit-for-purpose water reuse.',
      resourceConservation: 'Reduces freshwater intake and can recover energy from biodegradable organics.',
      environmentalAdvantages: 'Lowers oxygen-demanding discharge and pollutant loading when process-specific streams are treated and verified.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'Medium',
      feasibilityRationale: 'Treatment trains are established, but performance and reuse feasibility depend on stream segregation, salinity and contaminant loading.',
      contaminationRisks: 'Sulfide/H2S, chromium, high salinity, high pH, pathogens, dyes and concentrated organic load.',
      requiredQualityChecks: 'Flow and pH; BOD5/COD; TSS; sulfide; total and hexavalent chromium; conductivity/TDS; oil and grease; microbial indicators; reclaimed-water criteria.',
      regulatoryConsiderations: 'Discharge and reuse must comply with the applicable site permit, local effluent standards and water-reuse requirements.',
      hardSafetyRestrictions: 'No untreated discharge or unrestricted reuse. Isolate sulfide-bearing streams from acids; chromium-rich streams require dedicated treatment. Reuse only after documented treatment validation and monitoring.'
    }
  },
  {
    id: 'leather-collagen-waste',
    industryId: 'leather',
    categoryName: 'Collagen-containing waste',
    aliases: ['untanned hide trimmings', 'untanned splits', 'collagen-rich offcuts'],
    wasteProfile: {
      chemicalComposition: 'Predominantly type-I collagen with water, residual fat and process salts; untreated hide and splits may contain lime, sulfide or microbial contamination.',
      typicalPhysicalState: 'Solid',
      environmentalConcerns: 'Rapid biodegradation creates odor, leachate and a high oxygen demand; improper handling may spread pathogens.'
    },
    recoveryMethod: {
      methodName: 'Controlled gelatin or collagen hydrolysate extraction',
      scientificExplanation: 'Washed, verified untanned collagen can undergo controlled acid/alkali conditioning and thermal or enzymatic hydrolysis to produce gelatin or peptides. Process severity controls molecular weight and functionality.',
      processingConsiderations: 'Exclude chrome-tanned stock. Confirm tanning status, sulfide removal and microbial controls; use product-specific purification and characterization before assigning an end use.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'Technical gelatin',
        applications: 'Industrial adhesive, paper binder or encapsulation aid after performance and contaminant qualification.',
        targetIndustries: ['Paper and board', 'Industrial adhesives'],
        suitabilityRationale: 'Collagen has established film-forming and binding functionality; non-food technical grades avoid unsupported claims of food or pharma suitability.',
        maturityLevel: 'Established Industrial'
      },
      {
        recoveredMaterial: 'Collagen peptides',
        applications: 'Technical protein ingredient for a qualified industrial formulation.',
        targetIndustries: ['Biomaterials', 'Industrial chemicals'],
        suitabilityRationale: 'Hydrolysate properties are tunable, but consistent quality and impurity control are required for each application.',
        maturityLevel: 'Emerging / Pilot-Scale'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'High when clean untanned material is source-separated and processed promptly.',
      resourceConservation: 'Retains protein value and may displace petroleum-based binders or virgin technical proteins.',
      environmentalAdvantages: 'Avoids putrefaction and reduces organic disposal burden through controlled recovery.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'High',
      feasibilityRationale: 'Extraction is technically mature for clean collagen feedstocks; source verification and product-grade qualification remain essential.',
      contaminationRisks: 'Residual sulfide/lime, pathogens, chromium from accidental mixing, salts and preservation chemicals.',
      requiredQualityChecks: 'Hydroxyproline/protein assay; molecular-weight profile; total metals and Cr(VI); sulfide; microbial limits; moisture/ash; product performance.',
      regulatoryConsiderations: 'End-use requirements vary. Food, feed, cosmetic and medical claims require separate authorization and validated manufacturing controls.',
      hardSafetyRestrictions: 'Only use verified untanned, non-chrome material for collagen extraction. Do not market as food, feed, cosmetic or medical grade without applicable approvals and complete traceability.'
    }
  },
  {
    id: 'cosmetics-expired-formulations',
    industryId: 'cosmetics',
    categoryName: 'Expired/off-spec formulations',
    aliases: ['rejected creams', 'off-spec lotion', 'expired emulsion', 'personal-care batch waste'],
    wasteProfile: {
      chemicalComposition: 'Complex oil-in-water or water-in-oil emulsions containing surfactants, oils, polymers, fragrances, preservatives, pigments and water; composition depends on product and batch.',
      typicalPhysicalState: 'Semi-solid',
      environmentalConcerns: 'Uncontrolled disposal can release surfactants, preservatives, fragrance compounds and high organic loads; packaging may retain product.'
    },
    recoveryMethod: {
      methodName: 'Batch characterization, phase separation and controlled treatment',
      scientificExplanation: 'Validated demulsification, centrifugation or thermal separation may recover an oil-rich phase; aqueous residues require appropriate wastewater treatment. Unrecoverable or hazardous formulation batches go to an authorized waste route.',
      processingConsiderations: 'Review formulation, preservative and fragrance data; segregate incompatible constituents. Verify recovered fractions for contaminants and avoid reintroducing expired product into consumer supply.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'Separated technical oil fraction',
        applications: 'Industrial fuel or lubricant feed only where permitted and after contaminant, chlorine and heating-value testing.',
        targetIndustries: ['Industrial energy', 'Oleochemicals'],
        suitabilityRationale: 'Oil separation may be practical, but volatile, silicone, halogenated and preservative residues can preclude reuse.',
        maturityLevel: 'Emerging / Pilot-Scale'
      },
      {
        recoveredMaterial: 'Treated aqueous fraction',
        applications: 'Feed to a permitted industrial wastewater plant after compatibility and load checks.',
        targetIndustries: ['Industrial wastewater treatment'],
        suitabilityRationale: 'Treatment can reduce organic burden but is not equivalent to direct product reuse or discharge approval.',
        maturityLevel: 'Established Industrial'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'Medium; depends on successful separation and the hazardous constituents in the formulation.',
      resourceConservation: 'Potential recovery of a portion of oils and process water.',
      environmentalAdvantages: 'Avoids uncontrolled disposal and enables targeted treatment of concentrated fractions.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'Medium',
      feasibilityRationale: 'Separation can be feasible for known emulsions but preservatives, polymers and batch variability limit consistent valorisation.',
      contaminationRisks: 'Preservatives, fragrance allergens, microplastics, silicones, solvents, biocides and unknown actives.',
      requiredQualityChecks: 'Formulation/SDS review; pH; COD/TOC; oil and grease; volatile/semi-volatile screening; metals where indicated; phase purity and ecotoxicity as required.',
      regulatoryConsiderations: 'Assess product withdrawal, waste classification, wastewater acceptance and local chemical/waste rules; no return to consumer market without legally valid reprocessing.',
      hardSafetyRestrictions: 'Expired or rejected batches are not automatically safe raw material. Do not repackage, dilute to evade waste controls, or reuse in consumer products; use authorized treatment/recovery with documented batch acceptance.'
    }
  },
  {
    id: 'cosmetics-waste-oils-fats',
    industryId: 'cosmetics',
    categoryName: 'Waste oils and fats',
    aliases: ['vegetable oil offcuts', 'mineral oil residue', 'cosmetic lipid waste', 'fatty phase waste'],
    wasteProfile: {
      chemicalComposition: 'Triglycerides, fatty acids, wax esters or mineral hydrocarbons, potentially mixed with emulsifiers, silicones, fragrances, preservatives and water.',
      typicalPhysicalState: 'Liquid',
      environmentalConcerns: 'Oil films impair water oxygen transfer; mineral oils and additives can persist, and spills contaminate drains and soil.'
    },
    recoveryMethod: {
      methodName: 'Oil separation, filtration and feedstock qualification',
      scientificExplanation: 'Settling, centrifugation, filtration and dehydration can recover a lipid phase. Vegetable triglycerides may be considered for esterification only after composition and catalyst-poisoning contaminants are assessed.',
      processingConsiderations: 'Keep vegetable and mineral oils separate. Test water, acidity, oxidation, halogens, metals, silicones and preservative residues; confirm permitted fuel/chemical feedstock status.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'Recovered vegetable lipid',
        applications: 'Qualified oleochemical intermediate or biodiesel feedstock where applicable fuel standards and permits are met.',
        targetIndustries: ['Oleochemicals', 'Biofuels'],
        suitabilityRationale: 'Triglycerides can be converted to fatty acid esters; water, free fatty acids, silicones and halogens affect yield and product compliance.',
        maturityLevel: 'Established Industrial'
      },
      {
        recoveredMaterial: 'Recovered mineral-oil fraction',
        applications: 'Regeneration or controlled industrial energy recovery through an authorized operator.',
        targetIndustries: ['Industrial lubricants', 'Industrial energy'],
        suitabilityRationale: 'Mineral oil is not interchangeable with edible/vegetable feedstock and may require regulated used-oil management.',
        maturityLevel: 'Established Industrial'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'Medium to high for clean, segregated oil streams.',
      resourceConservation: 'Substitutes a portion of virgin vegetable or mineral hydrocarbon feedstock.',
      environmentalAdvantages: 'Prevents sewer discharge and can retain energy or chemical value through controlled recovery.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'Medium',
      feasibilityRationale: 'Oil separation and processing are established, but mixed cosmetic additives can compromise downstream specifications.',
      contaminationRisks: 'Silicones, halogens, metals, oxidation products, solvents, fragrances and water.',
      requiredQualityChecks: 'Acid value; water/sediment; viscosity; flash point; chlorine/halogens; metals; silicone screening; GC-FID hydrocarbon/fatty-acid profile.',
      regulatoryConsiderations: 'Check used-oil, fuel, chemical-product and air-emission rules; recovered fuel requires applicable permits and quality certification.',
      hardSafetyRestrictions: 'Do not discharge oils to drains or mix unknown mineral and vegetable streams. No fuel, cosmetic or food use without full specification compliance and authorization.'
    }
  },
  {
    id: 'cosmetics-glycerol-waste',
    industryId: 'cosmetics',
    categoryName: 'Glycerol-containing waste',
    aliases: ['crude glycerin', 'glycerol rinse', 'glycerin-rich process waste'],
    wasteProfile: {
      chemicalComposition: 'Glycerol in water with possible salts, soaps, fatty acids, surfactants, fragrance, preservatives, methanol or other process contaminants.',
      typicalPhysicalState: 'Liquid',
      environmentalConcerns: 'High-strength glycerol contributes substantial COD and can cause oxygen depletion; contaminants may inhibit biological treatment.'
    },
    recoveryMethod: {
      methodName: 'Glycerol concentration and impurity removal',
      scientificExplanation: 'Filtration, phase separation, vacuum evaporation and ion exchange or distillation can concentrate glycerol; final purity must be matched to a defined technical use.',
      processingConsiderations: 'Screen for methanol, salts, surfactants, metals and odor compounds. Manage still bottoms and spent media as characterized waste; avoid assuming cosmetic/pharmaceutical grade.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'Technical-grade glycerol',
        applications: 'Humectant, plasticizer or fermentation carbon source in a qualified industrial process.',
        targetIndustries: ['Industrial chemicals', 'Biotechnology'],
        suitabilityRationale: 'Glycerol is a useful polyol, but process contaminants and purity requirements dictate the receiving use.',
        maturityLevel: 'Established Industrial'
      },
      {
        recoveredMaterial: 'Glycerol-rich aqueous stream',
        applications: 'Controlled anaerobic digestion or biological treatment after inhibition testing.',
        targetIndustries: ['Wastewater treatment', 'Renewable energy'],
        suitabilityRationale: 'Biodegradable carbon can support treatment or biogas production if salinity and toxic additives are within operating limits.',
        maturityLevel: 'Emerging / Pilot-Scale'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'Medium; concentration can divert a recoverable polyol fraction from wastewater.',
      resourceConservation: 'Offsets virgin glycerol or supplemental carbon feed in qualified processes.',
      environmentalAdvantages: 'Can reduce COD discharge and recover useful carbon when residuals are treated appropriately.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'Medium',
      feasibilityRationale: 'Recovery is practical for concentrated streams; dilute wash water may be uneconomic to purify.',
      contaminationRisks: 'Methanol, salts, surfactants, fragrances, preservatives, dyes and variable microbial load.',
      requiredQualityChecks: 'Glycerol assay; water; ash/salts; methanol by GC; pH; COD; metals; color/odor; microbial quality for biological use.',
      regulatoryConsiderations: 'Technical recovered material must meet receiving-sector chemical/product rules; wastewater discharge remains permit-controlled.',
      hardSafetyRestrictions: 'Do not use as food, medicine, cosmetic ingredient or animal feed without the required grade, traceability and approvals. Do not send uncharacterized concentrated glycerol to biological treatment.'
    }
  },
  {
    id: 'cosmetics-wax-residues',
    industryId: 'cosmetics',
    categoryName: 'Wax residues',
    aliases: ['beeswax residue', 'carnauba wax offcut', 'paraffin wax waste', 'wax kettle residue'],
    wasteProfile: {
      chemicalComposition: 'Beeswax esters and hydrocarbons, carnauba wax esters, or paraffin hydrocarbons; may contain pigments, fragrance, oils and cleaning residues.',
      typicalPhysicalState: 'Solid',
      environmentalConcerns: 'Persistent wax can obstruct drains and resist biodegradation; contaminated residues may release additives during uncontrolled disposal.'
    },
    recoveryMethod: {
      methodName: 'Thermal melting, filtration and wax fractionation',
      scientificExplanation: 'Controlled heating melts wax for filtration and phase separation. Fractionation or blending can recover a technical wax with a defined melting profile when contaminants are removed.',
      processingConsiderations: 'Use temperature-controlled equipment and local exhaust; identify wax type and prevent ignition. Screen colorants, fragrance, metals and cleaning solvents.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'Reclaimed technical wax',
        applications: 'Polishes, mould-release agents or non-food industrial coatings after specification testing.',
        targetIndustries: ['Industrial coatings', 'Packaging', 'Construction materials'],
        suitabilityRationale: 'Wax hydrophobicity and melting behavior support technical uses; product identity and contamination determine suitability.',
        maturityLevel: 'Emerging / Pilot-Scale'
      },
      {
        recoveredMaterial: 'Paraffin-rich fraction',
        applications: 'Industrial process heat or wax products through permitted operators.',
        targetIndustries: ['Industrial energy', 'Industrial coatings'],
        suitabilityRationale: 'A clean paraffin stream can be reprocessed, whereas mixed natural/synthetic waxes may not meet a single product specification.',
        maturityLevel: 'Emerging / Pilot-Scale'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'Medium for clean segregated wax; low for mixed kettle residues.',
      resourceConservation: 'Retains wax feedstock and may displace virgin paraffin or specialty wax.',
      environmentalAdvantages: 'Reduces solid waste and avoids wax entry into drains when source-segregated.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'Medium',
      feasibilityRationale: 'Melting and filtration are straightforward; mixed waxes, additives and cleaning residues can prevent product-grade recovery.',
      contaminationRisks: 'Fragrance allergens, pigments, preservatives, cleaning solvents and unintended plastic debris.',
      requiredQualityChecks: 'Melting/drop point; penetration/hardness; acid and saponification values as relevant; ash/metals; solvent residue; color/odor and contaminant profile.',
      regulatoryConsiderations: 'Confirm waste status, recovered-product obligations and restrictions for the proposed end market.',
      hardSafetyRestrictions: 'Do not heat unknown solvent-contaminated residues or use reclaimed wax in food, medical, cosmetic or skin-contact products without applicable approvals and full quality qualification.'
    }
  },
  {
    id: 'cosmetics-botanical-residues',
    industryId: 'cosmetics',
    categoryName: 'Plant extracts and botanical residues',
    aliases: ['botanical pomace', 'spent herb biomass', 'extract marc', 'plant extraction cake'],
    wasteProfile: {
      chemicalComposition: 'Cellulose, hemicellulose, lignin and residual plant metabolites; may contain extraction solvents, pesticides, preservatives or concentrated bioactive compounds.',
      typicalPhysicalState: 'Semi-solid',
      environmentalConcerns: 'Wet biomass decomposes rapidly; residual solvents or bioactive compounds can contaminate soil and water if spread or dumped untreated.'
    },
    recoveryMethod: {
      methodName: 'Solvent recovery followed by biomass stabilization or extraction',
      scientificExplanation: 'Where a known solvent is present, closed-system recovery precedes drying. Residual phytochemicals may be extracted using a validated solvent system; remaining biomass can be anaerobically digested or composted only after contaminants and phytotoxicity are assessed.',
      processingConsiderations: 'Identify species, extraction chemistry and solvent. Control flammable vapors, pesticide residues and bioactive potency; do not infer safety from plant origin.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'Recovered botanical compounds',
        applications: 'Technical natural-product intermediate for a specified non-consumer industrial application.',
        targetIndustries: ['Natural products', 'Industrial biotechnology'],
        suitabilityRationale: 'Bioactive compounds can retain value, but identity, stability, residual solvent and regulatory status must be established.',
        maturityLevel: 'Emerging / Pilot-Scale'
      },
      {
        recoveredMaterial: 'Stabilized lignocellulosic biomass',
        applications: 'Biogas or fiber-rich material in a controlled process after contaminant acceptance.',
        targetIndustries: ['Renewable energy', 'Biomaterials'],
        suitabilityRationale: 'The residual fiber can supply carbon or structural biomass if solvent and phytotoxic residues are sufficiently controlled.',
        maturityLevel: 'Emerging / Pilot-Scale'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'Medium; depends on residual solvent and active-compound value.',
      resourceConservation: 'Can recover natural product fractions and renewable carbon/fiber.',
      environmentalAdvantages: 'Reduces putrescible biomass disposal and may recover residual solvent or bioactive material.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'Medium',
      feasibilityRationale: 'Recovery is feasible for characterized biomass but is species- and extraction-process-specific.',
      contaminationRisks: 'Residual ethanol or other extraction solvents, pesticides, allergens, concentrated actives, mycotoxins and microbial growth.',
      requiredQualityChecks: 'Residual solvents by GC; pesticide screen as indicated; identity/marker assay; moisture; microbial and mycotoxin testing as relevant; ecotoxicity/phytotoxicity before land-facing use.',
      regulatoryConsiderations: 'Assess chemical, waste, cosmetic/biocide and by-product requirements for the intended use and jurisdiction.',
      hardSafetyRestrictions: 'Do not treat as safe compost/feed/skin product solely because it is plant-derived. Remove or verify solvents and contaminants; no consumer use without applicable safety assessment and approvals.'
    }
  },
  {
    id: 'cosmetics-packaging',
    industryId: 'cosmetics',
    categoryName: 'Cosmetics packaging',
    aliases: ['multi-layer plastic packaging', 'cosmetic glass bottle', 'aluminum tube', 'personal-care packaging scrap'],
    wasteProfile: {
      chemicalComposition: 'Mixed polymer laminates, glass, aluminum, inks, adhesives, coatings, caps and residual creams or fragrances; multi-layer structures are difficult to separate.',
      typicalPhysicalState: 'Solid',
      environmentalConcerns: 'Mixed plastics persist as litter; product residues and labels complicate recycling, and contaminated packaging can expose workers or contaminate recyclate.'
    },
    recoveryMethod: {
      methodName: 'Emptying, material sorting and compatible-stream recycling',
      scientificExplanation: 'Mechanical sorting and material-specific recycling recover clean glass and aluminum readily; mono-material plastics may be mechanically recycled. Multi-layer laminates generally require specialized separation or an authorized residual-waste route.',
      processingConsiderations: 'Drain/empty containers under safe procedures, segregate glass, metals and polymers, and avoid mixing incompatible polymer types. Verify local recycler acceptance for residues and coatings.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'Sorted aluminum and glass cullet',
        applications: 'Feedstock for secondary aluminum or glass manufacture where the recycler accepts the grade.',
        targetIndustries: ['Metal recycling', 'Glass manufacturing'],
        suitabilityRationale: 'These materials have established recycling routes when separated and sufficiently free of product residue.',
        maturityLevel: 'Established Industrial'
      },
      {
        recoveredMaterial: 'Clean single-polymer recyclate',
        applications: 'Non-food packaging or durable molded parts meeting recycled-resin specifications.',
        targetIndustries: ['Packaging', 'Plastics manufacturing'],
        suitabilityRationale: 'Recycling depends on polymer identification, color, additives and product-residue thresholds.',
        maturityLevel: 'Established Industrial'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'High for clean, sortable glass, aluminum and mono-material plastics; low for inseparable laminates.',
      resourceConservation: 'Secondary material can displace virgin glass, aluminum and polymer resin.',
      environmentalAdvantages: 'Reduces packaging landfill and demand for primary materials when actual recycler acceptance is confirmed.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'High',
      feasibilityRationale: 'Established collection and recycling markets exist for common segregated materials; multi-layer and contaminated packaging remains difficult.',
      contaminationRisks: 'Residual active ingredients, fragrance, preservatives, aerosols, sharp glass, inks, coatings and incompatible polymer blends.',
      requiredQualityChecks: 'Material identification; residue/empty-container criteria; polymer type; contamination and moisture; metal/glass sorting purity; recycler acceptance specification.',
      regulatoryConsiderations: 'Follow extended-producer-responsibility, packaging, transport and local recycling requirements; hazardous residues may change packaging classification.',
      hardSafetyRestrictions: 'Do not place containers with hazardous/API residues into ordinary recycling before approved decontamination. Do not manually open pressurized or unknown containers; use authorized hazardous packaging routes when required.'
    }
  },
  {
    id: 'cosmetics-surfactant-residues',
    industryId: 'cosmetics',
    categoryName: 'Surplus surfactants and formulation residues',
    aliases: ['anionic surfactant wash water', 'non-ionic surfactant rinse', 'surplus surfactant', 'CIP wash water'],
    wasteProfile: {
      chemicalComposition: 'Aqueous anionic (e.g. sulfate/sulfonate) or non-ionic surfactants with fragrances, preservatives, oils, salts and formulation residues.',
      typicalPhysicalState: 'Liquid',
      environmentalConcerns: 'Surfactants can be toxic to aquatic organisms, cause foaming and elevate COD; preservatives may inhibit biological treatment.'
    },
    recoveryMethod: {
      methodName: 'Segregated high-strength capture and validated wastewater treatment',
      scientificExplanation: 'Concentrated first rinses may be recovered or treated by precipitation, adsorption or membrane separation depending on surfactant chemistry. Remaining water requires biological or physicochemical treatment with demonstrated removal.',
      processingConsiderations: 'Separate first rinses from dilute wash water. Assess foaming, salinity and biocide inhibition; pilot-test treatment and monitor receiving-water-relevant parameters.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'Recovered surfactant concentrate',
        applications: 'Reuse in a compatible industrial cleaning formulation after active-content and contaminant qualification.',
        targetIndustries: ['Industrial cleaning', 'Formulation chemicals'],
        suitabilityRationale: 'Surfactants may remain functional, but mixed chemistries and preservatives can limit compatibility.',
        maturityLevel: 'Emerging / Pilot-Scale'
      },
      {
        recoveredMaterial: 'Treated process water',
        applications: 'Non-product-contact washdown or utility use after verified treatment.',
        targetIndustries: ['Industrial utilities', 'Wastewater treatment'],
        suitabilityRationale: 'Water reuse can reduce demand if surfactant, COD, microbial and salinity limits suit the receiving operation.',
        maturityLevel: 'Emerging / Pilot-Scale'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'Medium where concentrated rinses are captured before dilution.',
      resourceConservation: 'May recover surfactant actives and water for a compatible process.',
      environmentalAdvantages: 'Reduces foaming and organic loading to wastewater systems when captured and treated effectively.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'Medium',
      feasibilityRationale: 'Treatment technologies are available but must be matched to surfactant class, salts and co-contaminants.',
      contaminationRisks: 'Preservatives, biocides, fragrances, solvents, oils, high salinity and unknown formulation actives.',
      requiredQualityChecks: 'Surfactant-specific active assay; COD/TOC; pH; conductivity; foaming; toxicity/inhibition testing; residual preservatives and microbial indicators for reuse.',
      regulatoryConsiderations: 'Discharge and reuse remain permit-controlled; recovered chemicals need a defined specification and legal end-of-waste/product status.',
      hardSafetyRestrictions: 'No direct discharge or use as consumer formulation. Keep incompatible concentrated cleaners separate; do not neutralize or blend without compatibility assessment and wastewater-operator approval.'
    }
  },
  {
    id: 'pharma-expired-products',
    industryId: 'pharmaceutical',
    categoryName: 'Expired or rejected pharmaceutical products',
    aliases: ['API-containing tablets', 'rejected drug liquid', 'expired medicine', 'pharmaceutical batch reject'],
    wasteProfile: {
      chemicalComposition: 'One or more pharmacologically active ingredients (APIs) plus excipients or solvent-containing liquid vehicles; potency and hazard vary by API class and dosage form.',
      typicalPhysicalState: 'Solid',
      environmentalConcerns: 'APIs can be toxic, persistent or antimicrobial and may promote antimicrobial resistance; crushed or flushed products can contaminate wastewater.'
    },
    recoveryMethod: {
      methodName: 'Secure segregation and authorized destruction or validated API destruction',
      scientificExplanation: 'Product identity and potency determine the validated treatment route. High-temperature incineration/co-processing or validated chemical degradation can destroy APIs; energy/material recovery is secondary to verified destruction and emissions control.',
      processingConsiderations: 'Keep intact and segregated by hazard class; maintain chain of custody and destruction records. Validate destruction efficiency and manage ash, scrubber residues and packaging.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'No direct recovered pharmaceutical material',
        applications: 'Only energy recovery after authorized high-temperature destruction with verified emissions control.',
        targetIndustries: ['Permitted hazardous-waste energy recovery'],
        suitabilityRationale: 'Active drug products must not enter consumer, agricultural or feed supply; destruction is the safety endpoint, not reuse of the API.',
        maturityLevel: 'Established Industrial'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'Low for material recovery; controlled co-processing may recover energy while ensuring destruction.',
      resourceConservation: 'Energy recovery is possible only where authorized and compatible with validated destruction.',
      environmentalAdvantages: 'Prevents environmental release of active ingredients and reduces accidental diversion or misuse.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'High',
      feasibilityRationale: 'Authorized pharmaceutical waste destruction is established, although treatment cost and route depend on API hazard and local regulation.',
      contaminationRisks: 'Potent APIs, cytotoxicity, antibiotic activity, sensitizers, solvents, sharps and unknown mixed products.',
      requiredQualityChecks: 'Product/API identification; potency and hazard classification; packaging compatibility; destruction validation; stack-emission and residual ash checks per facility permit.',
      regulatoryConsiderations: 'Follow pharmaceutical GMP deviation/rejection controls, controlled-drug rules where relevant, hazardous-waste transport and licensed destruction requirements.',
      hardSafetyRestrictions: 'Never reuse APIs or expired/rejected products in cosmetics, food, feed, agriculture or consumer products. Do not flush, landfill untreated or return to ordinary stock. Route through an authorized facility and document destruction.'
    }
  },
  {
    id: 'pharma-packaging',
    industryId: 'pharmaceutical',
    categoryName: 'Pharmaceutical packaging',
    aliases: ['blister packs', 'HDPE bottles', 'borosilicate vials', 'pharma packaging scrap'],
    wasteProfile: {
      chemicalComposition: 'PVC/PVDC or other polymer blister films with aluminum foil, HDPE bottles, borosilicate glass vials, elastomer closures, inks and possible API residues.',
      typicalPhysicalState: 'Solid',
      environmentalConcerns: 'Multi-layer blisters are difficult to recycle; residual APIs can contaminate recyclate and glass/metal recovery streams.'
    },
    recoveryMethod: {
      methodName: 'API-residue assessment followed by material-specific recycling',
      scientificExplanation: 'Packaging from non-hazardous, appropriately decontaminated streams can be sorted for polymer, metal and glass recycling. Blister delamination may recover aluminum and polymer but requires a compatible, permitted process.',
      processingConsiderations: 'Separate cytotoxic/high-potency packaging. Validate emptying/decontamination, protect handlers from sharps and glass, and confirm the recycler accepts the polymer/additives.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'Clean borosilicate glass cullet or aluminum',
        applications: 'Feedstock to a qualified glass or metal recycler after API-residue acceptance.',
        targetIndustries: ['Glass manufacturing', 'Metal recycling'],
        suitabilityRationale: 'Material recycling is technically established when contamination and collection specifications are met.',
        maturityLevel: 'Established Industrial'
      },
      {
        recoveredMaterial: 'Recovered polymer fraction',
        applications: 'Non-food industrial plastic products where polymer identity and purity are verified.',
        targetIndustries: ['Plastics manufacturing', 'Packaging'],
        suitabilityRationale: 'Recycling viability depends on polymer blend, barrier layers, residues and local facility capability.',
        maturityLevel: 'Emerging / Pilot-Scale'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'Medium; high for clean glass/HDPE and lower for mixed laminates.',
      resourceConservation: 'Recovers aluminum, glass and polymer feedstock.',
      environmentalAdvantages: 'Diverts clean packaging from disposal while preventing API-contaminated materials from entering general recycling.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'Medium',
      feasibilityRationale: 'Common materials have recycling routes, but pharmaceutical residue and multi-material laminates require controlled handling.',
      contaminationRisks: 'API dust/liquid, cytotoxic residues, sharp foil, broken glass, inks, elastomers and mixed polymers.',
      requiredQualityChecks: 'API residue/decontamination verification; polymer identification; glass/metal purity; sharps assessment; recycler acceptance and batch traceability.',
      regulatoryConsiderations: 'Apply pharmaceutical GMP waste controls, hazardous packaging rules and local recycling requirements; maintain documented decontamination and transfer.',
      hardSafetyRestrictions: 'Packaging from API, cytotoxic or unknown products must not enter ordinary recycling until approved decontamination and acceptance criteria are met. Do not manually crush vials or blisters.'
    }
  },
  {
    id: 'pharma-solvent-waste',
    industryId: 'pharmaceutical',
    categoryName: 'Solvent waste',
    aliases: ['methanol waste', 'ethanol waste', 'acetone waste', 'ethyl acetate waste', 'DCM waste', 'spent solvent'],
    wasteProfile: {
      chemicalComposition: 'Spent solvent mixtures may contain methanol, ethanol, acetone, ethyl acetate or dichloromethane (DCM), water, API intermediates and reaction by-products. DCM is halogenated and must remain segregated.',
      typicalPhysicalState: 'Liquid',
      environmentalConcerns: 'Volatile organic emissions, fire/explosion hazards and solvent-specific toxicity; halogenated solvent can generate hazardous combustion products.'
    },
    recoveryMethod: {
      methodName: 'Segregated closed-loop distillation or authorized destruction',
      scientificExplanation: 'Non-halogenated streams may be recovered by controlled distillation when composition and purity support reuse. DCM and mixed halogenated solvent require a separate engineered recovery/destruction route; distillation does not remove all nonvolatile API residues.',
      processingConsiderations: 'Separate halogenated from non-halogenated, aqueous and reactive waste. Use grounded closed systems, explosion protection, vapor capture and analytical release testing; assess peroxide formation where relevant.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'Purified non-halogenated solvent',
        applications: 'Qualified industrial or pharmaceutical process solvent after GC purity, water and residue specifications are met.',
        targetIndustries: ['Pharmaceutical manufacturing', 'Chemical manufacturing'],
        suitabilityRationale: 'Methanol, ethanol, acetone and ethyl acetate can be recyclable when isolated and verified to the receiver specification.',
        maturityLevel: 'Established Industrial'
      },
      {
        recoveredMaterial: 'Recovered DCM or halogenated fraction',
        applications: 'Reuse only in a closed, permitted process that explicitly accepts the recovered grade; otherwise authorized hazardous-waste destruction.',
        targetIndustries: ['Chemical manufacturing'],
        suitabilityRationale: 'Halogenated solvent recovery requires dedicated equipment and residue/emission controls; it cannot be blended into ordinary solvent streams.',
        maturityLevel: 'Emerging / Pilot-Scale'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'High for well-segregated recoverable solvent mixtures.',
      resourceConservation: 'Solvent recovery can reduce virgin solvent procurement and hazardous waste volume.',
      environmentalAdvantages: 'Closed systems reduce VOC releases and enable reuse while preventing uncontrolled solvent disposal.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'Medium',
      feasibilityRationale: 'Distillation is mature for defined streams but requires fire-safe equipment, analytical release and handling of contaminated bottoms.',
      contaminationRisks: 'Flammability, acute/chronic solvent toxicity, DCM, API residues, reactive contaminants and peroxides in susceptible streams.',
      requiredQualityChecks: 'GC-FID/GC-MS composition; water by Karl Fischer; residue/nonvolatile API assay; halogen screening; peroxide test where indicated; flash point; distillation cut purity.',
      regulatoryConsiderations: 'Apply hazardous-waste manifests, solvent storage/fire codes, air permits, GMP change controls and applicable recovered-solvent specifications.',
      hardSafetyRestrictions: 'Never combine halogenated and non-halogenated solvent waste. No open evaporation or sewer disposal. DCM and API-contaminated solvent must remain in authorized closed-loop recovery or licensed destruction; do not distill unknown/reactive mixtures.'
    }
  },
  {
    id: 'pharma-glycerol-waste',
    industryId: 'pharmaceutical',
    categoryName: 'Glycerol-containing waste',
    aliases: ['pharma glycerol waste', 'glycerol mother liquor', 'glycerin process residue'],
    wasteProfile: {
      chemicalComposition: 'Glycerol and water with possible excipients, salts, methanol, catalysts, API residues or fermentation-derived impurities.',
      typicalPhysicalState: 'Liquid',
      environmentalConcerns: 'Concentrated glycerol has high COD; API or catalyst carryover may inhibit biological processes and contaminate recovered product.'
    },
    recoveryMethod: {
      methodName: 'API screening, purification and technical glycerol recovery',
      scientificExplanation: 'After API and solvent classification, filtration, evaporation and ion exchange or distillation can concentrate glycerol. Recovery is appropriate only where impurities can be removed and a defined technical specification is achieved.',
      processingConsiderations: 'Use dedicated equipment and prevent cross-contamination. Analyze residues and spent purification media; streams containing potent APIs require authorized destruction instead of commodity recovery.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'Qualified technical glycerol',
        applications: 'Industrial polyol or fermentation substrate after API, solvent and impurity testing.',
        targetIndustries: ['Industrial chemicals', 'Biotechnology'],
        suitabilityRationale: 'Glycerol has established industrial uses, but pharmaceutical contamination demands verified decontamination and end-use acceptance.',
        maturityLevel: 'Emerging / Pilot-Scale'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'Medium for concentrated, API-free process streams.',
      resourceConservation: 'May displace virgin glycerol or industrial carbon substrate.',
      environmentalAdvantages: 'Reduces high-COD disposal and recovers polyol value when pharmaceutical contaminants are controlled.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'Medium',
      feasibilityRationale: 'Purification is feasible for characterized process streams; API carryover or dilute liquor can make reuse inappropriate.',
      contaminationRisks: 'API residues, methanol, salts, catalysts, microbial residues and pharmaceutical excipients.',
      requiredQualityChecks: 'Glycerol assay; API-specific LC-MS/HPLC; methanol by GC; water; ash/metals; microbial limits where relevant; COD.',
      regulatoryConsiderations: 'Apply GMP material segregation, waste classification and receiving-sector product requirements; prevent pharmaceutical cross-contamination.',
      hardSafetyRestrictions: 'Do not reuse API-contaminated glycerol in cosmetics, food, feed or medicine. If API destruction/decontamination cannot be validated, route to an authorized pharmaceutical-waste facility.'
    }
  },
  {
    id: 'pharma-plant-residues',
    industryId: 'pharmaceutical',
    categoryName: 'Plant-based pharmaceutical residues',
    aliases: ['alkaloid extraction biomass', 'phytochemical marc', 'spent medicinal plant biomass', 'herbal extraction residue'],
    wasteProfile: {
      chemicalComposition: 'Lignocellulosic biomass with residual alkaloids or other phytochemicals, extraction solvent, acids/bases and possible pesticide or microbial contamination.',
      typicalPhysicalState: 'Semi-solid',
      environmentalConcerns: 'Residual pharmacologically active compounds may be toxic; solvent-bearing wet biomass can emit VOCs and organic leachate.'
    },
    recoveryMethod: {
      methodName: 'Residual-solvent recovery and validated active-compound assessment',
      scientificExplanation: 'Recover known solvent in a closed system where feasible, assay residual pharmacological actives, then consider controlled digestion or thermal treatment. Biomass reuse is conditional on demonstrating acceptable residual potency and contaminants.',
      processingConsiderations: 'Identify plant species and targeted alkaloids, keep potent/toxic biomass segregated, and validate treatment for residual active compounds before any material recovery.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'Recovered extraction solvent',
        applications: 'Return to a compatible extraction process after identity and purity testing.',
        targetIndustries: ['Pharmaceutical manufacturing', 'Natural products'],
        suitabilityRationale: 'Closed-loop solvent recovery can be practical when solvent composition and pharmaceutical cross-contamination are controlled.',
        maturityLevel: 'Established Industrial'
      },
      {
        recoveredMaterial: 'Treated residual biomass',
        applications: 'Energy recovery or digestion only after validated active-compound destruction and authorized facility acceptance.',
        targetIndustries: ['Renewable energy', 'Waste treatment'],
        suitabilityRationale: 'Biogenic carbon may be recoverable, but residual drug-like phytochemicals can preclude compost or feed use.',
        maturityLevel: 'Emerging / Pilot-Scale'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'Low to medium; depends on residual solvent and active-compound concentration.',
      resourceConservation: 'May recover solvent and renewable carbon from extraction residues.',
      environmentalAdvantages: 'Controlled treatment prevents active phytochemicals and solvent from entering soil or water.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'Low',
      feasibilityRationale: 'Plant species and pharmacological activity vary, so residual potency and disposal controls require compound-specific evaluation.',
      contaminationRisks: 'Alkaloids, cytotoxic or neuroactive phytochemicals, residual solvent, pesticides, acids/bases and mycotoxins.',
      requiredQualityChecks: 'Targeted HPLC/LC-MS for active markers; residual solvents by GC; pesticide/mycotoxin screen as indicated; moisture; microbial indicators; destruction validation.',
      regulatoryConsiderations: 'Treat according to API-like hazard assessment where actives warrant it; follow GMP documentation and licensed waste requirements.',
      hardSafetyRestrictions: 'No compost, feed, fertilizer, cosmetic or consumer reuse unless residual pharmacological activity is demonstrated safe and the use is authorized. Solvent recovery and active destruction require validated controls.'
    }
  },
  {
    id: 'pharma-biological-residues',
    industryId: 'pharmaceutical',
    categoryName: 'Fermentation and biological residues',
    aliases: ['spent microbial biomass', 'mycelial cake', 'fermentation broth', 'bioprocess waste'],
    wasteProfile: {
      chemicalComposition: 'Water, microbial cells or mycelia, residual nutrients, antifoams and process chemicals; may contain recombinant organisms, antibiotics, biologics or active metabolites.',
      typicalPhysicalState: 'Sludge',
      environmentalConcerns: 'Viable organisms or active metabolites may escape; high COD and nutrients can cause oxygen depletion and eutrophication.'
    },
    recoveryMethod: {
      methodName: 'Validated inactivation followed by controlled dewatering and treatment',
      scientificExplanation: 'Validated heat or chemical inactivation is selected for the organism/product risk, then biomass is dewatered and routed to licensed digestion, incineration or other permitted treatment. Inactivation efficacy must be demonstrated for the specific matrix.',
      processingConsiderations: 'Contain aerosols and liquids; assess genetically modified organism, pathogen, antibiotic and biologic risks. Confirm inactivation before opening, dewatering or off-site transfer.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'No direct biological biomass reuse by default',
        applications: 'Energy recovery or further treatment only after validated inactivation and facility-specific authorization.',
        targetIndustries: ['Waste treatment', 'Renewable energy'],
        suitabilityRationale: 'Potential nutrient/energy value does not remove the need to control viable organisms, biologics or active pharmaceutical residues.',
        maturityLevel: 'Emerging / Pilot-Scale'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'Low to medium; recovery is conditional on validated biological and chemical hazard controls.',
      resourceConservation: 'Potential biogas or energy recovery after inactivation and permitted acceptance.',
      environmentalAdvantages: 'Prevents release of viable production organisms, active residues and excessive nutrient loads.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'Low',
      feasibilityRationale: 'Treatment must be validated for organism and product, and some process residues require specialized permitted facilities.',
      contaminationRisks: 'Viable pathogens or production strains, recombinant organisms, antibiotic/API residues, endotoxins, biologics and high COD.',
      requiredQualityChecks: 'Organism/product risk assessment; validated kill/inactivation challenge; culture or molecular residual viability test; API/antibiotic assay; COD; endotoxin where relevant.',
      regulatoryConsiderations: 'Follow biosafety, GMO containment, GMP, biohazard and pharmaceutical waste rules; use authorized transport and receiving facilities.',
      hardSafetyRestrictions: 'Treat as potentially bioactive/infectious until validated inactivation is documented. No composting, land application, feed or open handling; route through approved containment and authorized treatment.'
    }
  },
  {
    id: 'pharma-synthesis-byproducts',
    industryId: 'pharmaceutical',
    categoryName: 'Chemical synthesis by-products',
    aliases: ['API mother liquor', 'inorganic salt waste', 'spent catalyst', 'synthesis residue'],
    wasteProfile: {
      chemicalComposition: 'Mother liquors with residual APIs/intermediates and solvents; inorganic salts; or spent catalysts containing transition metals, supports and adsorbed organics.',
      typicalPhysicalState: 'Liquid',
      environmentalConcerns: 'Potential API activity, corrosivity, flammability and toxic metals; salts can increase salinity and catalysts can leach metals.'
    },
    recoveryMethod: {
      methodName: 'Segregated solvent/API recovery and metal-specific catalyst reclamation',
      scientificExplanation: 'Characterized mother liquors may undergo solvent recovery and API/intermediate crystallization only under approved process controls. Spent catalysts can be refined for valuable metals by specialized operators; nonrecoverable residues require compatible permitted treatment.',
      processingConsiderations: 'Do not combine organic mother liquors, inorganic salts and spent catalysts. Assess reactivity, API potency, metal loading and solvent incompatibility before treatment.'
    },
    crossIndustryReuse: [
      {
        recoveredMaterial: 'Recovered solvent or purified process intermediate',
        applications: 'Return to a controlled manufacturing process after analytical release and GMP approval.',
        targetIndustries: ['Pharmaceutical manufacturing', 'Chemical manufacturing'],
        suitabilityRationale: 'Process recovery may conserve materials, but cross-contamination and impurity profiles require full quality controls.',
        maturityLevel: 'Established Industrial'
      },
      {
        recoveredMaterial: 'Recovered catalyst metal',
        applications: 'Refined metal or catalyst precursor supplied by an authorized specialist refiner.',
        targetIndustries: ['Catalyst manufacturing', 'Metal refining'],
        suitabilityRationale: 'Metal value can justify recovery; refining is specialized and residual hazardous solids remain controlled waste.',
        maturityLevel: 'Established Industrial'
      }
    ],
    sustainabilityImpact: {
      wasteReductionPotential: 'Medium to high for valuable solvents and catalyst metals; low for dilute mixed residues.',
      resourceConservation: 'Can recover solvent, intermediates and scarce catalyst metals.',
      environmentalAdvantages: 'Reduces demand for virgin solvents/metals and avoids uncontrolled release of potent or toxic residues.'
    },
    safetyAndFeasibility: {
      feasibilityRating: 'Medium',
      feasibilityRationale: 'Recovery routes are industrially established for defined streams, but unknown mixtures and trace APIs complicate acceptance.',
      contaminationRisks: 'Potent APIs, reactive intermediates, flammable/halogenated solvents, acids/bases, toxic metals and catalyst dust.',
      requiredQualityChecks: 'API/intermediate assay by HPLC/LC-MS; solvent profile by GC; metal content by ICP; leachability; pH/reactivity; flash point; spent catalyst activity and dust controls.',
      regulatoryConsiderations: 'Apply GMP recovery validation, hazardous-waste classification and manifests, transport rules, and refiner/recovery permits.',
      hardSafetyRestrictions: 'Keep mother liquors, salts and spent catalysts segregated. No uncontrolled crystallization, blending or direct reuse. API-bearing material requires validated recovery/destruction; metal-bearing residues go only to an authorized refiner or hazardous-waste facility.'
    }
  }
];

export const SAMPLE_PRESETS = [
  {
    id: 'chrome-shavings',
    label: 'Chrome shavings · leather',
    industryId: 'leather',
    wasteId: 'leather-chromium-waste',
    quantity: '250 kg / batch',
    contaminants: 'Cr(III), residual sulfide, tanning dyes'
  },
  {
    id: 'limed-fleshings',
    label: 'Limed fleshings · leather',
    industryId: 'leather',
    wasteId: 'leather-hair-fleshings',
    quantity: '1,200 kg / day',
    contaminants: 'Sodium sulfide, lime, putrescible proteins'
  },
  {
    id: 'high-strength-effluent',
    label: 'High-COD effluent · leather',
    industryId: 'leather',
    wasteId: 'leather-high-bod-cod-wastewater',
    quantity: '18 m³ / day',
    contaminants: 'High COD, sulfide, variable chromium'
  },
  {
    id: 'off-spec-cream',
    label: 'Off-spec emulsion · cosmetics',
    industryId: 'cosmetics',
    wasteId: 'cosmetics-expired-formulations',
    quantity: '600 kg / batch',
    contaminants: 'Preservatives, fragrance, silicone'
  },
  {
    id: 'surfactant-wash',
    label: 'Surfactant wash water · cosmetics',
    industryId: 'cosmetics',
    wasteId: 'cosmetics-surfactant-residues',
    quantity: '4 m³ / campaign',
    contaminants: 'Anionic/non-ionic surfactants, preservatives, high COD'
  },
  {
    id: 'expired-antibiotic',
    label: 'Expired API product · pharmaceutical',
    industryId: 'pharmaceutical',
    wasteId: 'pharma-expired-products',
    quantity: '80 kg / rejected batch',
    contaminants: 'Active antibiotic API, excipients'
  },
  {
    id: 'dcm-solvent',
    label: 'DCM solvent waste · pharmaceutical',
    industryId: 'pharmaceutical',
    wasteId: 'pharma-solvent-waste',
    quantity: '400 L / campaign',
    contaminants: 'Dichloromethane, trace API intermediate'
  },
  {
    id: 'spent-biomass',
    label: 'Spent fermentation biomass · pharmaceutical',
    industryId: 'pharmaceutical',
    wasteId: 'pharma-biological-residues',
    quantity: '2.5 m³ / batch',
    contaminants: 'Spent microbial biomass, possible active metabolite'
  }
];

export default WASTE_STREAMS;
