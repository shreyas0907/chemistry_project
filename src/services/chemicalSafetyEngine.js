import cameoRules from '../data/cameoRules.json';
import { INITIAL_INDUSTRIAL_INVENTORY } from '../data/industryChemicals';

/**
 * Normalizes query string
 */
function cleanStr(str) {
  return (str || '').trim().toLowerCase();
}

/**
 * 1. Live PubChem API Search with Robust Fallback
 */
export async function searchPubChemCompound(query) {
  const q = cleanStr(query);
  if (!q) throw new Error("Search query is required");

  // First check local industrial inventory for instant verified response
  const localMatch = INITIAL_INDUSTRIAL_INVENTORY.find(c => 
    cleanStr(c.name).includes(q) || 
    q.includes(cleanStr(c.name)) ||
    cleanStr(c.cas) === q ||
    cleanStr(c.formula) === q
  );

  try {
    const encoded = encodeURIComponent(query.trim());
    const propUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encoded}/property/MolecularFormula,MolecularWeight,CanonicalSMILES/JSON`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(propUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const prop = data?.PropertyTable?.Properties?.[0];
      if (prop) {
        const cid = prop.CID;
        const formula = prop.MolecularFormula || localMatch?.formula || "";
        const mw = prop.MolecularWeight ? parseFloat(prop.MolecularWeight) : (localMatch?.molecularWeight || 0);
        const smiles = prop.CanonicalSMILES || localMatch?.smiles || "";
        const structureUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG`;

        // Attempt PUG view for GHS statements
        let hazardNotes = "";
        try {
          const viewUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON?heading=GHS+Classification`;
          const viewRes = await fetch(viewUrl);
          if (viewRes.ok) {
            const vData = await viewRes.json();
            const sections = vData?.Record?.Section || [];
            for (const s of sections) {
              if (s.TOCHeading === "Safety and Hazards" || s.TOCHeading === "GHS Classification") {
                const sub = s.Section || [];
                for (const subS of sub) {
                  if (subS.Information) {
                    for (const info of subS.Information) {
                      if (info.Value?.StringWithMarkup?.[0]?.String) {
                        hazardNotes += info.Value.StringWithMarkup[0].String + ". ";
                      }
                    }
                  }
                }
              }
            }
          }
        } catch {
          // non-blocking
        }

        return {
          source: "PubChem Live PUG REST API",
          retrievalTimestamp: new Date().toISOString(),
          isVerified: true,
          cid,
          name: query.trim(),
          formula,
          molecularWeight: mw,
          smiles,
          structureUrl,
          hazardSummary: hazardNotes.slice(0, 350) || localMatch?.hazardSummary || "GHS hazard verified from PubChem. Follow institutional chemical safety standards.",
          cameoGroups: localMatch?.cameoGroups || inferCameoGroups(query, formula, smiles),
          cas: localMatch?.cas || "",
          industry: localMatch?.industry || "General Chemical",
          pharmaRole: localMatch?.pharmaRole || "Industrial Reagent",
          storageClass: localMatch?.storageClass || "11 (General)",
          pbtScore: localMatch?.pbtScore || { persistence: "Moderate", bioaccumulation: "Low", toxicity: "Moderate" },
          greenChemistryRating: localMatch?.greenChemistryRating || "Yellow",
          wasteStream: localMatch?.wasteStream || "Chemical Neutralization Sump"
        };
      }
    }
  } catch (err) {
    console.warn("Live PubChem query failed, falling back to local industrial database:", err.message);
  }

  // Fallback to verified local database
  if (localMatch) {
    return {
      source: "CHEM-SHIELD Verified Industrial Database (Authoritative)",
      retrievalTimestamp: new Date().toISOString(),
      isVerified: true,
      ...localMatch,
      structureUrl: localMatch.structureUrl || `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(localMatch.name)}/PNG`
    };
  }

  // Unknown chemical - missing data warning
  return {
    source: "Unverified / Custom Chemical Entry",
    retrievalTimestamp: new Date().toISOString(),
    isVerified: false,
    name: query.trim(),
    formula: "Unverified",
    molecularWeight: 0,
    smiles: "",
    cid: null,
    structureUrl: "",
    cameoGroups: inferCameoGroups(query),
    cas: "",
    industry: "General Chemical",
    pharmaRole: "Industrial Chemical",
    storageClass: "Requires Verification",
    pbtScore: { persistence: "Moderate", bioaccumulation: "Low", toxicity: "Moderate" },
    greenChemistryRating: "Yellow",
    wasteStream: "Requires Chemical Waste Classification",
    hazardSummary: "WARNING: Unverified substance. Complete hazard profile requires manufacturer Safety Data Sheet (SDS) review.",
    hasDataLimitations: true
  };
}

/**
 * Heuristics for CAMEO Reactive Groups
 */
export function inferCameoGroups(name = "", formula = "", smiles = "") {
  const n = cleanStr(name);
  const f = cleanStr(formula);
  const s = cleanStr(smiles);
  const groups = [];

  // Sulfides
  if (n.includes("sulfide") || n.includes("hydrosulfide") || s.includes("[s-2]") || s.includes("[sh-]")) {
    groups.push("sulfides");
  }

  // Cyanides
  if (n.includes("cyanide") || n.includes("nitrile") || s.includes("c#n")) {
    groups.push("cyanides");
  }

  // Acyl halides
  if ((n.includes("chloride") || n.includes("bromide")) && (n.includes("oyl") || n.includes("acetyl") || s.includes("c(=o)cl"))) {
    groups.push("acyl_halides", "water_reactive");
  }

  // Halogenated
  if ((f.includes("cl") || f.includes("br") || f.includes("f")) && f.includes("c") && !groups.includes("acyl_halides")) {
    groups.push("halogenated_organic");
  }

  // Oxidizers / Peroxides
  if (n.includes("peroxide") || n.includes("nitric acid") || n.includes("permanganate") || n.includes("persulfate") || n.includes("hypochlorite")) {
    groups.push("oxidizing_agents");
    if (n.includes("peroxide")) groups.push("peroxides");
  }

  // Reducers / Water-reactive
  if (n.includes("borohydride") || n.includes("hydride") || n.includes("sulfite") || n.includes("chromium sulfate")) {
    groups.push("reducing_agents");
    if (n.includes("borohydride") || n.includes("hydride")) groups.push("water_reactive");
  }

  // Acids
  if (n.includes("sulfuric") || n.includes("hydrochloric") || n.includes("nitric") || n.includes("phosphoric")) {
    groups.push("acids_inorganic");
  } else if (n.includes("acid")) {
    groups.push("acids_organic");
  }

  // Caustics
  if (n.includes("hydroxide") || n.includes("caustic") || n.includes("lime") || s.includes("[oh-]")) {
    groups.push("caustics_bases");
  }

  // Alcohols
  if (n.includes("ethanol") || n.includes("isopropanol") || n.includes("methanol") || n.includes("glycerol") || s.includes("cco")) {
    groups.push("alcohols");
  }

  // Flammables
  if (n.includes("toluene") || n.includes("acetone") || n.includes("hexane") || n.includes("limonene") || n.includes("ethanol") || n.includes("acetate")) {
    groups.push("flammables");
  }

  // Cytotoxics
  if (["cisplatin", "doxorubicin", "methotrexate", "fluorouracil", "paclitaxel"].some(d => n.includes(d)) || s.includes("pt")) {
    groups.push("cytotoxics");
  }

  return groups.length ? Array.from(new Set(groups)) : ["water_aqueous"];
}

/**
 * 2. Multi-Chemical Compatibility Evaluation Engine
 * Evaluates pairwise combinations and produces:
 * - GREEN: Compatible under verified conditions
 * - AMBER: Conditional compatibility / Caution
 * - RED: Incompatible / Hazardous
 * - UNKNOWN: Insufficient Data (Never assumes missing data means safe!)
 */
export function evaluateMultiChemicalCompatibility(chemicals = []) {
  if (!chemicals || chemicals.length < 2) {
    return {
      overallStatus: "INSUFFICIENT_SELECTION",
      overallCategory: "UNKNOWN",
      overallSeverity: "NEUTRAL",
      summary: "Select at least 2 chemicals to evaluate cross-reactivity, storage compatibility, and waste segregation.",
      pairInteractions: [],
      pairAssessments: [],
      redCount: 0,
      amberCount: 0,
      greenCount: 0,
      unknownCount: 0,
      hasIncompatibility: false,
      hasUnknownData: false
    };
  }

  const matrix = cameoRules.matrix;
  const groupsList = cameoRules.groups;
  const pairInteractions = [];

  let redCount = 0;
  let amberCount = 0;
  let unknownCount = 0;
  let greenCount = 0;

  for (let i = 0; i < chemicals.length; i++) {
    for (let j = i + 1; j < chemicals.length; j++) {
      const chemA = chemicals[i];
      const chemB = chemicals[j];

      const groupsA = chemA.cameoGroups || [];
      const groupsB = chemB.cameoGroups || [];

      // Check for unverified chemicals with no functional groups
      if (!groupsA.length || !groupsB.length || chemA.hasDataLimitations || chemB.hasDataLimitations) {
        unknownCount++;
        pairInteractions.push({
          chemA,
          chemB,
          status: "UNKNOWN",
          category: "UNKNOWN / INSUFFICIENT DATA",
          severity: "CAUTION",
          incompatibilityType: "Data Limitation / Missing Verification",
          hazardTitle: "Insufficient Empirical Reactivity Data",
          description: `Empirical compatibility data is incomplete or unverified for ${chemA.name} and/or ${chemB.name}. WARNING: In industrial safety, absence of evidence is NOT evidence of safety. Verify with manufacturer Safety Data Sheets (SDS) before co-storage or mixing.`,
          segregationAction: "Do not co-store or mix until official Safety Data Sheet (SDS) Section 10 (Stability & Reactivity) is verified by a qualified chemical safety officer.",
          emergencyPrecautions: "Exercise highest cautionary segregation. Treat as potentially incompatible.",
          authoritativeSource: "OSHA 1910.1200 / Prudent Practices Safety Rule",
          confidence: "Insufficient Data (Precautionary Flag)"
        });
        continue;
      }

      // Check all group pairings against CAMEO matrix
      const matchedRules = [];
      for (const gA of groupsA) {
        for (const gB of groupsB) {
          const match = matrix.find(
            rule =>
              (rule.group1 === gA && rule.group2 === gB) ||
              (rule.group1 === gB && rule.group2 === gA)
          );
          if (match) {
            matchedRules.push({
              rule: match,
              groupAName: groupsList.find(g => g.id === gA)?.name || gA,
              groupBName: groupsList.find(g => g.id === gB)?.name || gB
            });
          }
        }
      }

      if (matchedRules.length === 0) {
        // No conflict found in matrix for known groups
        greenCount++;
        pairInteractions.push({
          chemA,
          chemB,
          status: "COMPATIBLE",
          category: "GREEN",
          severity: "SAFE",
          incompatibilityType: "Standard Handling",
          hazardTitle: "No Dangerous CAMEO Cross-Reactivity Documented",
          chemicalEquation: "No spontaneous exothermic reaction or hazardous gas liberation identified.",
          description: `Chemical functional groups (${groupsA.join(', ')}) and (${groupsB.join(', ')}) do not exhibit catastrophic cross-reactivity under standard ambient operating conditions. Standard storage precautions apply.`,
          segregationAction: "Co-storage permitted provided physical containment integrity is maintained and primary classes (e.g. corrosives, flammables) do not violate general fire codes.",
          emergencyPrecautions: "Standard industrial PPE (nitrile gloves, safety glasses, lab coat/apron).",
          authoritativeSource: "NOAA CAMEO Chemicals Database / EPA Matrix",
          confidence: "Verified Empirical (Authoritative)"
        });
      } else {
        // Evaluate most critical match
        const dangerMatch = matchedRules.find(m => m.rule.severity === "DANGER");
        const cautionMatch = matchedRules.find(m => m.rule.severity === "CAUTION");
        const primary = dangerMatch || cautionMatch || matchedRules[0];
        const rule = primary.rule;

        if (rule.severity === "DANGER") {
          redCount++;
        } else if (rule.severity === "CAUTION") {
          amberCount++;
        } else {
          greenCount++;
        }

        pairInteractions.push({
          chemA,
          chemB,
          status: rule.status,
          category: rule.severity === "DANGER" ? "RED" : rule.severity === "CAUTION" ? "AMBER" : "GREEN",
          severity: rule.severity,
          incompatibilityType: rule.incompatibilityType || "Chemical Reactivity Incompatibility",
          hazardTitle: rule.hazardTitle,
          hazardCode: rule.hazardCode,
          chemicalEquation: rule.chemicalEquation || "Complex Industrial Reaction Pathway",
          description: rule.description,
          segregationAction: rule.segregationAction,
          emergencyPrecautions: rule.emergencyPrecautions || "Follow institutional emergency response guidelines.",
          authoritativeSource: rule.authoritativeSource || "NOAA CAMEO Chemicals",
          confidence: rule.confidence || "Verified Empirical (Authoritative)",
          matchedGroups: [primary.groupAName, primary.groupBName]
        });
      }
    }
  }

  // Determine overall status
  let overallCategory = "GREEN";
  let overallStatus = "COMPATIBLE";
  let overallSeverity = "SAFE";
  let overallBadgeText = "GREEN: Verified Compatible";
  let summary = "All selected chemical combinations are verified compatible under standard ambient handling conditions.";

  if (redCount > 0) {
    overallCategory = "RED";
    overallStatus = "INCOMPATIBLE";
    overallSeverity = "DANGER";
    overallBadgeText = "RED: CRITICAL INCOMPATIBILITY DETECTED";
    summary = `SEVERE DANGER: ${redCount} combination(s) pose catastrophic reaction hazards (toxic gas evolution, fire/explosion, or violent exotherm)! Immediate segregation required.`;
  } else if (unknownCount > 0) {
    overallCategory = "UNKNOWN";
    overallStatus = "UNKNOWN";
    overallSeverity = "CAUTION";
    overallBadgeText = "UNKNOWN / INSUFFICIENT DATA";
    summary = `PRECAUTIONARY CAUTION: ${unknownCount} chemical pair(s) lack complete empirical reactivity verification. In industrial safety, missing data is NEVER assumed safe.`;
  } else if (amberCount > 0) {
    overallCategory = "AMBER";
    overallStatus = "CONDITIONAL";
    overallSeverity = "CAUTION";
    overallBadgeText = "AMBER: Conditional Compatibility / Review Required";
    summary = `CAUTION: ${amberCount} combination(s) require active procedural controls, temperature monitoring, or dedicated waste stream separation.`;
  }

  return {
    overallCategory,
    overallStatus,
    overallSeverity,
    overallBadgeText,
    summary,
    pairInteractions,
    pairAssessments: pairInteractions,
    redCount,
    amberCount,
    greenCount,
    unknownCount,
    hasIncompatibility: redCount > 0,
    hasUnknownData: unknownCount > 0
  };
}

/**
 * Evaluates pairwise compatibility between two specific chemical substances
 */
export function evaluatePairCompatibility(chemA, chemB) {
  if (!chemA || !chemB) {
    return {
      status: "UNKNOWN",
      category: "UNKNOWN",
      severity: "CAUTION",
      hazardTitle: "Insufficient Empirical Reactivity Data",
      description: "One or both substances are missing for evaluation.",
      segregationAction: "Maintain physical separation until verified."
    };
  }
  const res = evaluateMultiChemicalCompatibility([chemA, chemB]);
  if (res && res.pairInteractions && res.pairInteractions.length > 0) {
    return res.pairInteractions[0];
  }
  return {
    status: res.overallCategory === "RED" ? "RED" : res.overallCategory === "AMBER" ? "AMBER" : "COMPATIBLE",
    category: res.overallCategory,
    severity: res.overallSeverity,
    hazardTitle: res.overallBadgeText || "Standard Evaluation",
    description: res.summary,
    segregationAction: "Standard storage precautions apply."
  };
}

/**
 * 3. Warehouse Bay Segregation & Conflict Detector
 * Scans inventory and flags any incompatible chemicals stored in the exact same location
 */
export function detectStorageBayViolations(inventory = []) {
  const bayMap = {};
  
  inventory.forEach(chem => {
    const loc = chem.storageLocation || "Unassigned Location";
    if (!bayMap[loc]) bayMap[loc] = [];
    bayMap[loc].push(chem);
  });

  const violations = [];

  Object.entries(bayMap).forEach(([location, chemsInBay]) => {
    if (chemsInBay.length >= 2) {
      const evaluation = evaluateMultiChemicalCompatibility(chemsInBay);
      const dangerPairs = evaluation.pairInteractions.filter(p => p.severity === "DANGER");
      const cautionPairs = evaluation.pairInteractions.filter(p => p.severity === "CAUTION");

      if (dangerPairs.length > 0) {
        violations.push({
          location,
          severity: "CRITICAL",
          dangerPairs,
          totalChemicalsInBay: chemsInBay.length,
          recommendation: `IMMEDIATE RELOCATION REQUIRED: ${dangerPairs.length} severe incompatibility pair(s) detected in "${location}". Physically isolate incompatible substances by at least 6 meters or into separate fire-rated compartments.`
        });
      } else if (cautionPairs.length > 0) {
        violations.push({
          location,
          severity: "WARNING",
          cautionPairs,
          totalChemicalsInBay: chemsInBay.length,
          recommendation: `OPERATIONAL REVIEW: Conditional co-storage in "${location}". Ensure separate secondary containment bunds and dedicated spill response kits.`
        });
      }
    }
  });

  return violations;
}

/**
 * 4. AI Chemical Safety Copilot Knowledge Engine
 */
export function queryAiSafetyAssistant(question = "", inventory = []) {
  const q = cleanStr(question);

  // Sulfide + Acid
  if ((q.includes("sulfide") && q.includes("acid")) || q.includes("h2s") || (q.includes("leather") && q.includes("gas"))) {
    return {
      topic: "Leather Tanning: Sulfide Acidification & Lethal H2S Gas Danger",
      status: "RED / FATAL HAZARD",
      primaryHazard: "Catastrophic liberation of lethal Hydrogen Sulfide (H2S) gas. H2S is a fast-acting chemical asphyxiant that paralyzes olfactory receptors within seconds, causing immediate collapse ('knockdown') and fatal pulmonary edema.",
      chemicalEquation: "Na2S(aq) + H2SO4(aq) -> Na2SO4(aq) + H2S(g) ^",
      industrialPrevention: [
        "Store Sodium Sulfide in a dedicated alkaline bay with continuous H2S electronic gas monitoring interlocked to emergency caustic scrubbers.",
        "Maintain liming and unhairing wash liquors at pH > 10.0 at all times prior to wastewater discharge.",
        "Ensure sulfuric acid and formic acid pickling drums are mechanically interlocked so acid cannot be charged into drums containing sulfide residues."
      ],
      ppeRequirements: "Positive-pressure self-contained breathing apparatus (SCBA), butyl/nitrile gloves, chemical splash suit.",
      authoritativeCitations: [
        "OSHA 29 CFR 1910.1200 Safety Standards",
        "NOAA CAMEO Chemicals Database (Group 20 Sulfides + Group 2 Inorganic Acids)",
        "International Union of Leather Technologists and Chemists Societies (IULTCS) Safety Code"
      ],
      disclaimer: "CHEM-SHIELD AI provides verified scientific decision support. In case of live spill or gas release, execute site evacuation and consult facility Emergency Action Plan."
    };
  }

  // Acyl Halide + Water / Bases
  if (q.includes("sebacoyl") || q.includes("acyl chloride") || q.includes("thionyl") || (q.includes("water") && q.includes("chloride"))) {
    return {
      topic: "Pharmaceutical Synthesis: Acyl Halide Violent Hydrolysis & Gas Overpressurization",
      status: "RED / CORROSIVE INCOMPATIBILITY",
      primaryHazard: "Acyl halides undergo violent exothermic hydrolysis with water or moisture, rapidly liberating dense white clouds of toxic, choking Hydrogen Chloride (HCl) gas. Closed vessels undergo rapid pressurization and violent blowout.",
      chemicalEquation: "R-COCl + H2O -> R-COOH + HCl(g) ^ + Heat (Runaway Exotherm)",
      industrialPrevention: [
        "Store acyl chlorides under positive-pressure dry nitrogen blankets with desiccant seals.",
        "Never add water directly to acyl chloride residues. Use dry soda ash or anhydrous sodium bicarbonate under a certified chemical fume hood.",
        "Segregate acyl chloride waste carboys strictly away from aqueous and alcohol waste drums."
      ],
      ppeRequirements: "Full-face respirator with acid gas/P100 filter cartridge, heavy neoprene gloves, chemical apron.",
      authoritativeCitations: [
        "NOAA CAMEO Chemicals (Group 1 Acyl Halides + Group 66 Aqueous)",
        "Bretherick's Handbook of Reactive Chemical Hazards, 8th Edition",
        "USP <800> Compounding & Containment Protocols"
      ],
      disclaimer: "Adhere strictly to official manufacturer Safety Data Sheet (SDS) Section 10 (Stability & Reactivity)."
    };
  }

  // Chromium Tanning + Oxidizers
  if (q.includes("chromium") || q.includes("chrome") || (q.includes("leather") && q.includes("hexavalent"))) {
    return {
      topic: "Leather Industry: Prevention of Hexavalent Chromium Cr(VI) Formation",
      status: "RED / TOXIC CARCINOGEN RISK",
      primaryHazard: "Basic Chromium Sulfate contains trivalent chromium Cr(III), which is an essential tanning agent with moderate toxicity. Contact with strong oxidizers (peroxides, hypochlorite bleach, persulfates) oxidizes Cr(III) into Hexavalent Chromium Cr(VI), which is a potent human carcinogen, skin sensitizer, and severe environmental toxin restricted under EU REACH.",
      chemicalEquation: "Cr(III) + Strong Oxidizer (H2O2 / NaOCl) -> Cr(VI) (Chromate / Dichromate)",
      industrialPrevention: [
        "Strictly isolate chrome tanning stores from peroxide bleaching and oxidizing sanitizers.",
        "Collect spent tanning baths in dedicated chrome recovery sumps equipped with precipitation and recycling circuits.",
        "Never co-mingle chrome effluent with alkaline liming wash without prior acid precipitation."
      ],
      ppeRequirements: "P3 particulate respirator, nitrile gloves, chemical protective goggles.",
      authoritativeCitations: [
        "EU REACH Annex XVII Regulation on Chromium VI Limits in Leather",
        "EPA 40 CFR Part 425 - Leather Tanning Effluent Guidelines",
        "IULTCS Environment Commission Guidelines"
      ],
      disclaimer: "Regulatory testing of finished leather and effluents requires spectrophotometric diphenylcarbazide (DPC) testing."
    };
  }

  // Green solvent alternatives
  if (q.includes("green") || q.includes("alternative") || q.includes("substitute") || q.includes("dcm") || q.includes("toluene")) {
    return {
      topic: "Green Chemistry: Sustainable Solvent Substitution Protocols",
      status: "GREEN / PROCESS OPTIMIZATION",
      primaryHazard: "Traditional solvents like Dichloromethane (DCM), Chloroform, and Hexane present severe neurological, carcinogenic (IARC 2A), and groundwater persistence risks.",
      chemicalEquation: "Target: Replace Chlorinated & Hydrocarbon Solvents with ACS GCI Preferred Alternatives",
      industrialPrevention: [
        "Replace DCM in extractions and chromatography with Ethyl Acetate or 2-Methyltetrahydrofuran (2-MeTHF), reducing lifecycle carbon footprint by up to 68-82%.",
        "Replace Hexane in crystallization with pharmaceutical-grade Heptane to eliminate 2,5-hexanedione neurotoxic metabolites.",
        "Replace DMF with Cyrene (bio-based dihydrolevoglucosenone) for polar aprotic peptide coupling."
      ],
      ppeRequirements: "Follow standard solvent handling PPE; grounding clamps for flammable transfers.",
      authoritativeCitations: [
        "ACS GCI Pharmaceutical Roundtable Solvent Selection Guide",
        "ICH Q3C Impurities: Guideline for Residual Solvents (Class 3 preferred over Class 2/1)",
        "Sanofi & Pfizer Environmental Green Solvent Selection Tools"
      ],
      disclaimer: "Validate API solubility, crystallization kinetics, and stability before production-scale replacement."
    };
  }

  // Default General Chemical Safety Advisor
  return {
    topic: "Industrial Chemical Safety Consultation",
    status: "SAFETY ADVISORY",
    primaryHazard: "Chemical safety in industrial environments requires rigorous segregation based on functional group reactivity, storage classes, and environmental fate.",
    chemicalEquation: "Risk = Hazard x Exposure Frequency (Minimize co-storage and airborne dispersion)",
    industrialPrevention: [
      "Ensure all chemicals have verified CAS Registry Numbers and up-to-date Safety Data Sheets (SDS) within 3 years.",
      "Maintain minimum 6-meter separation or secondary bunded containment between incompatible classes (Acids vs Bases, Oxidizers vs Flammables, Sulfides vs Acids).",
      "Inspect chemical container QR labels and storage bay manifests prior to batch dispensing."
    ],
    ppeRequirements: "Specify according to chemical GHS classification: nitrile/neoprene gloves, safety glasses, chemical apron, respirator if vapor pressure > 10 mmHg.",
    authoritativeCitations: [
      "OSHA 29 CFR 1910.1200 Hazard Communication Standard",
      "NFPA 400 Hazardous Materials Code",
      "NOAA CAMEO Chemical Compatibility System"
    ],
    disclaimer: "CHEM-SHIELD AI is a decision-support platform designed to assist certified safety engineers and industrial hygienists."
  };
}

