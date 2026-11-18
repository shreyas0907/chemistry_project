import cameoRules from '../data/cameoRules.json';

// Rich fallback database for offline / network errors / instant responses
const FALLBACK_COMPOUND_DB = {
  "sebacoyl chloride": {
    name: "Sebacoyl Chloride",
    formula: "C10H16Cl2O2",
    molecularWeight: 239.14,
    smiles: "C(CCCC(=O)Cl)CCCC(=O)Cl",
    cas: "111-19-3",
    cid: 68524,
    structureUrl: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/Sebacoyl%20Chloride/PNG",
    physicalState: "Liquid",
    pharmaRole: "Reagent",
    cameoGroups: ["acyl_halides", "water_reactive"],
    uspClassification: "Non-Hazardous",
    storageClass: "8A (Corrosive Acidic)",
    storageConditions: "Desiccated / Dry Inert Gas",
    pbtScore: { persistence: "Moderate", bioaccumulation: "Low", toxicity: "High" },
    greenChemistryRating: "Red",
    wasteStream: "High-Temp Incineration",
    ghsPictograms: ["Corrosive", "Acute Toxic", "Irritant"],
    hazardSummary: "Causes severe skin burns and eye damage. Reacts violently with water or moist air to generate dense, choking Hydrogen Chloride (HCl) gas. Strong lachrymator.",
    fdaNotes: "Specialty bifunctional cross-linking reagent used in pharmaceutical microencapsulation and nanosphere drug delivery carriers.",
    aquaticToxicity: "High acute aquatic toxicity due to immediate acidic hydrolysis releasing localized low pH and toxic HCl."
  },
  "cisplatin": {
    name: "Cisplatin",
    formula: "Cl2H6N2Pt",
    molecularWeight: 300.04,
    smiles: "N.N.[Cl-].[Cl-].[Pt+2]",
    cas: "15663-27-1",
    cid: 5702198,
    structureUrl: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/Cisplatin/PNG",
    physicalState: "Solid",
    pharmaRole: "API",
    cameoGroups: ["cytotoxics", "halogenated_organic"],
    uspClassification: "Antineoplastic Hazardous",
    storageClass: "6.1A (Toxic / Carcinogen)",
    storageConditions: "Room Temp (Protect from Light)",
    pbtScore: { persistence: "High", bioaccumulation: "Moderate", toxicity: "High" },
    greenChemistryRating: "Red",
    wasteStream: "Cytotoxic Yellow Bin",
    ghsPictograms: ["Health Hazard", "Acute Toxic", "Environmental"],
    hazardSummary: "Known human carcinogen, mutagen, and reproductive toxicant. Heavy platinum metal core is biologically persistent and highly toxic to aquatic life.",
    fdaNotes: "FDA BOXED WARNING: Cumulative renal toxicity is severe. Pre- and post-hydration with IV saline required. Must be prepared in ISO 5 BSC per USP <800>.",
    aquaticToxicity: "Very toxic to aquatic life with long-lasting cellular DNA cross-linking effects. Heavy metal bioaccumulation."
  },
  "dichloromethane": {
    name: "Dichloromethane (DCM)",
    formula: "CH2Cl2",
    molecularWeight: 84.93,
    smiles: "C(Cl)Cl",
    cas: "75-09-2",
    cid: 6344,
    structureUrl: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/Dichloromethane/PNG",
    physicalState: "Liquid",
    pharmaRole: "Solvent",
    cameoGroups: ["halogenated_organic"],
    uspClassification: "Non-Hazardous",
    storageClass: "6.1A (Volatile Toxic Halogenated)",
    storageConditions: "Room Temp",
    pbtScore: { persistence: "High", bioaccumulation: "Low", toxicity: "High" },
    greenChemistryRating: "Red",
    wasteStream: "Halogenated Solvent Waste Drum",
    ghsPictograms: ["Health Hazard", "Irritant"],
    hazardSummary: "Suspected human carcinogen (IARC 2A). High volatility; metabolizes in liver to carbon monoxide causing elevated carboxyhemoglobin.",
    fdaNotes: "USP <467> Class 2 residual solvent (PDE: 6.0 mg/day). Controlled strictly in synthetic process chemistry to prevent formulation contamination.",
    aquaticToxicity: "Harmful to aquatic organisms; low log Kow but recalcitrant in groundwater aquifers."
  },
  "ethanol": {
    name: "Ethanol (Anhydrous)",
    formula: "C2H6O",
    molecularWeight: 46.07,
    smiles: "CCO",
    cas: "64-17-5",
    cid: 702,
    structureUrl: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/Ethanol/PNG",
    physicalState: "Liquid",
    pharmaRole: "Solvent",
    cameoGroups: ["alcohols", "flammables"],
    uspClassification: "Non-Hazardous",
    storageClass: "3 (Flammable Liquid)",
    storageConditions: "Room Temp",
    pbtScore: { persistence: "Low", bioaccumulation: "Low", toxicity: "Low" },
    greenChemistryRating: "Green",
    wasteStream: "Non-Halogenated Organic Solvent Waste",
    ghsPictograms: ["Flammable", "Irritant"],
    hazardSummary: "Highly flammable liquid and vapor (Flash point 13°C). Eye and mucosal irritant at high concentrations. Non-bioaccumulative and readily biodegradable.",
    fdaNotes: "USP <467> Class 3 solvent with low toxic potential (PDE: 50 mg/day). Approved as pharmaceutical excipient, disinfectant, and oral tincture base.",
    aquaticToxicity: "Low aquatic toxicity; readily metabolized by aquatic microorganisms (BOD5 > 80%)."
  },
  "amoxicillin": {
    name: "Amoxicillin Trihydrate",
    formula: "C16H19N3O5S",
    molecularWeight: 365.4,
    smiles: "CC1(C(N2C(S1)C(C2=O)NC(=O)C(C3=CC=C(C=C3)O)N)C(=O)O)C",
    cas: "61336-70-7",
    cid: 33613,
    structureUrl: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/Amoxicillin/PNG",
    physicalState: "Powder",
    pharmaRole: "API",
    cameoGroups: ["amines", "acids_organic"],
    uspClassification: "Non-Hazardous",
    storageClass: "11 (General Chemical Storage)",
    storageConditions: "Room Temp (Protect from Light)",
    pbtScore: { persistence: "Moderate", bioaccumulation: "Low", toxicity: "High" },
    greenChemistryRating: "Yellow",
    wasteStream: "Autoclave",
    ghsPictograms: ["Health Hazard", "Irritant", "Environmental"],
    hazardSummary: "May cause severe allergic respiratory sensitization and anaphylaxis. Antibiotic discharge into waterways fosters antimicrobial resistance (AMR) pathogens.",
    fdaNotes: "Beta-lactam broad-spectrum antibiotic. Requires autoclave sterilization or base-catalyzed ring hydrolysis prior to disposal to destroy the active pharmacophore.",
    aquaticToxicity: "Extremely toxic to cyanobacteria and microalgae; contributes to environmental antimicrobial resistance spread."
  },
  "sodium hydroxide": {
    name: "Sodium Hydroxide (10N)",
    formula: "HNaO",
    molecularWeight: 40.0,
    smiles: "[OH-].[Na+]",
    cas: "1310-73-2",
    cid: 14798,
    structureUrl: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/Sodium%20Hydroxide/PNG",
    physicalState: "Liquid",
    pharmaRole: "Reagent",
    cameoGroups: ["caustics_bases", "water_aqueous"],
    uspClassification: "Non-Hazardous",
    storageClass: "8B (Corrosive Basic)",
    storageConditions: "Room Temp",
    pbtScore: { persistence: "Low", bioaccumulation: "Low", toxicity: "Moderate" },
    greenChemistryRating: "Yellow",
    wasteStream: "Chemical Neutralization",
    ghsPictograms: ["Corrosive"],
    hazardSummary: "Causes irreversible severe chemical burns, deep tissue necrosis, and corneal blindness. Strongly exothermic when mixed with acids or water.",
    fdaNotes: "USP-grade pH adjustment agent used in buffer compounding and CIP (Clean-in-Place) vessel sterilization.",
    aquaticToxicity: "Lethal to aquatic fauna if discharged un-neutralized due to sharp pH elevation (> 9.0)."
  },
  "methotrexate": {
    name: "Methotrexate",
    formula: "C20H22N8O5",
    molecularWeight: 454.44,
    smiles: "CN(CC1=CN=C2C(=N1)C(=NC(=N2)N)N)C3=CC=C(C=C3)C(=O)NC(CCC(=O)O)C(=O)O",
    cas: "59-05-2",
    cid: 126941,
    structureUrl: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/Methotrexate/PNG",
    physicalState: "Solid",
    pharmaRole: "API",
    cameoGroups: ["cytotoxics", "acids_organic", "amines"],
    uspClassification: "Antineoplastic Hazardous",
    storageClass: "6.1A (Toxic / Carcinogen)",
    storageConditions: "Room Temp (Protect from Light)",
    pbtScore: { persistence: "High", bioaccumulation: "Low", toxicity: "High" },
    greenChemistryRating: "Red",
    wasteStream: "Cytotoxic Yellow Bin",
    ghsPictograms: ["Health Hazard", "Acute Toxic"],
    hazardSummary: "Folate antimetabolite antineoplastic. Severe teratogen, abortifacient, and bone marrow suppressant. Mutagenic in cellular assays.",
    fdaNotes: "FDA BOXED WARNING: Potentially fatal toxicities including bone marrow suppression, hepatotoxicity, pulmonary toxicity. USP <800> compliance mandatory.",
    aquaticToxicity: "Toxic to aquatic life with long-lasting inhibition of microalgae dihydrofolate reductase."
  },
  "doxorubicin": {
    name: "Doxorubicin Hydrochloride",
    formula: "C27H29NO11.HCl",
    molecularWeight: 579.98,
    smiles: "CC1C(C(CC(O1)OC2CC(CC3=C2C(=O)C4=C(C3=O)C(=CC=C4)OC)(C(=O)CO)O)N)O",
    cas: "25316-40-9",
    cid: 31703,
    structureUrl: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/Doxorubicin/PNG",
    physicalState: "Powder",
    pharmaRole: "API",
    cameoGroups: ["cytotoxics"],
    uspClassification: "Antineoplastic Hazardous",
    storageClass: "6.1A (Toxic / Carcinogen)",
    storageConditions: "2°C–8°C Cold Chain",
    pbtScore: { persistence: "High", bioaccumulation: "Moderate", toxicity: "High" },
    greenChemistryRating: "Red",
    wasteStream: "Cytotoxic Yellow Bin",
    ghsPictograms: ["Health Hazard", "Acute Toxic"],
    hazardSummary: "Anthracycline topoisomerase II inhibitor. Potent cardiotoxic, mutagenic, and teratogenic agent. Severe vesicant on tissue contact.",
    fdaNotes: "FDA BOXED WARNING: Irreversible myocardial damage and congestive heart failure. Requires specialized chemotherapy handling.",
    aquaticToxicity: "High ecotoxicity; DNA intercalation causes reproductive impairment in aquatic invertebrates."
  },
  "chloroform": {
    name: "Chloroform",
    formula: "CHCl3",
    molecularWeight: 119.38,
    smiles: "C(Cl)(Cl)Cl",
    cas: "67-66-3",
    cid: 6212,
    structureUrl: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/Chloroform/PNG",
    physicalState: "Liquid",
    pharmaRole: "Solvent",
    cameoGroups: ["halogenated_organic"],
    uspClassification: "Non-Hazardous",
    storageClass: "6.1A (Volatile Toxic Halogenated)",
    storageConditions: "Room Temp (Protect from Light)",
    pbtScore: { persistence: "High", bioaccumulation: "Moderate", toxicity: "High" },
    greenChemistryRating: "Red",
    wasteStream: "Halogenated Solvent Waste Drum",
    ghsPictograms: ["Health Hazard", "Acute Toxic", "Irritant"],
    hazardSummary: "Suspected human carcinogen. Hepatotoxic and nephrotoxic. Slowly decomposes into lethal phosgene gas (COCl2) upon exposure to light and oxygen.",
    fdaNotes: "USP <467> Class 2 solvent (PDE: 0.6 mg/day). Extremely restricted in pharmaceutical synthesis.",
    aquaticToxicity: "Toxic to aquatic life with long lasting effects. Groundwater contaminant."
  },
  "ethyl acetate": {
    name: "Ethyl Acetate",
    formula: "C4H8O2",
    molecularWeight: 88.11,
    smiles: "CCOC(=O)C",
    cas: "141-78-6",
    cid: 8857,
    structureUrl: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/Ethyl%20Acetate/PNG",
    physicalState: "Liquid",
    pharmaRole: "Solvent",
    cameoGroups: ["flammables"],
    uspClassification: "Non-Hazardous",
    storageClass: "3 (Flammable Liquid)",
    storageConditions: "Room Temp",
    pbtScore: { persistence: "Low", bioaccumulation: "Low", toxicity: "Low" },
    greenChemistryRating: "Green",
    wasteStream: "Non-Halogenated Organic Solvent Waste",
    ghsPictograms: ["Flammable", "Irritant"],
    hazardSummary: "Highly flammable liquid and vapor (Flash point -4°C). Eye and respiratory tract irritant; repeated exposure may cause skin cracking.",
    fdaNotes: "USP <467> Class 3 solvent (PDE: 50 mg/day). Recommended green alternative to dichloromethane and chloroform for extraction and chromatography.",
    aquaticToxicity: "Low aquatic toxicity; readily biodegradable under aerobic conditions in standard wastewater treatment."
  },
  "hydrogen peroxide": {
    name: "Hydrogen Peroxide (30%)",
    formula: "H2O2",
    molecularWeight: 34.01,
    smiles: "OO",
    cas: "7722-84-1",
    cid: 784,
    structureUrl: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/Hydrogen%20Peroxide/PNG",
    physicalState: "Liquid",
    pharmaRole: "Disinfectant",
    cameoGroups: ["oxidizing_agents", "peroxides", "water_aqueous"],
    uspClassification: "Non-Hazardous",
    storageClass: "5.1 (Strong Oxidizer)",
    storageConditions: "2°C–8°C Cold Chain (Protect from Light)",
    pbtScore: { persistence: "Low", bioaccumulation: "Low", toxicity: "Moderate" },
    greenChemistryRating: "Yellow",
    wasteStream: "Chemical Neutralization",
    ghsPictograms: ["Oxidizer", "Corrosive", "Irritant"],
    hazardSummary: "May intensify fire; oxidizer. Causes severe skin burns and eye damage. Rapid exothermic catalytic decomposition when in contact with metals or organics.",
    fdaNotes: "Pharma cleanroom vaporized hydrogen peroxide (VHP) sterilant and topical antiseptic.",
    aquaticToxicity: "Rapidly degrades to water and oxygen in the environment; transient ecotoxicity to micro-crustaceans."
  }
};

/**
 * Heuristics helper to deduce CAMEO reactive groups and USP class from compound metadata
 */
function inferReactivityAndClassification(name, formula = "", smiles = "") {
  const n = name.toLowerCase();
  const f = formula.toLowerCase();
  const s = smiles.toLowerCase();
  const cameoGroups = [];
  let uspClass = "Non-Hazardous";
  let pharmaRole = "Reagent";

  // Check for Acyl Halides
  if (n.includes("chloride") && (n.includes("oyl") || n.includes("acetyl") || s.includes("c(=o)cl") || s.includes("c(=o)br"))) {
    cameoGroups.push("acyl_halides", "water_reactive");
    pharmaRole = "Reagent";
  }

  // Check for Halogenated Organic
  if ((f.includes("cl") || f.includes("br") || f.includes("f") || f.includes("i")) && f.includes("c") && !cameoGroups.includes("acyl_halides")) {
    cameoGroups.push("halogenated_organic");
  }

  // Check for Antineoplastic / Cytotoxic Drugs
  const antineoplastics = ["cisplatin", "doxorubicin", "methotrexate", "fluorouracil", "paclitaxel", "cyclophosphamide", "carboplatin", "vincristine", "tamoxifen", "etoposide", "gemcitabine"];
  if (antineoplastics.some(drug => n.includes(drug)) || s.includes("pt") || n.includes("platin") || n.includes("rubicin")) {
    cameoGroups.push("cytotoxics");
    uspClass = "Antineoplastic Hazardous";
    pharmaRole = "API";
  }

  // Check for Alcohols
  if (n.includes("ol") || s.includes("cco") || s.includes("co") || n.includes("alcohol") || n.includes("ethanol") || n.includes("isopropanol") || n.includes("methanol")) {
    cameoGroups.push("alcohols");
    if (!cameoGroups.includes("flammables") && (f.includes("c2") || f.includes("c3") || f.includes("c4") || f.includes("c1"))) {
      cameoGroups.push("flammables");
    }
  }

  // Check for Caustics / Bases
  if (n.includes("hydroxide") || n.includes("caustic") || s.includes("[oh-]") || n.includes("potassium hydroxide") || n.includes("sodium hydroxide")) {
    cameoGroups.push("caustics_bases", "water_aqueous");
    pharmaRole = "Reagent";
  }

  // Check for Amines
  if ((s.includes("n") || n.includes("amine") || n.includes("amino") || n.includes("pyridine") || n.includes("aniline")) && !cameoGroups.includes("cytotoxics")) {
    cameoGroups.push("amines");
  }

  // Check for Acids
  if (n.includes("acid")) {
    if (n.includes("hydrochloric") || n.includes("sulfuric") || n.includes("nitric") || n.includes("phosphoric")) {
      cameoGroups.push("acids_inorganic");
    } else {
      cameoGroups.push("acids_organic");
    }
  }

  // Check for Oxidizers / Peroxides
  if (n.includes("peroxide") || n.includes("permanganate") || n.includes("chlorite") || n.includes("hypochlorite")) {
    cameoGroups.push("oxidizing_agents");
    if (n.includes("peroxide")) cameoGroups.push("peroxides");
  }

  // Check for Flammable Solvents
  if (["acetone", "ether", "acetate", "hexane", "toluene", "benzene", "thf", "tetrahydrofuran", "acetonitrile"].some(term => n.includes(term))) {
    if (!cameoGroups.includes("flammables")) cameoGroups.push("flammables");
    pharmaRole = "Solvent";
  }

  // Check for Antibiotics
  if (["cillin", "mycin", "floxacin", "cycline", "cephal", "cef"].some(term => n.includes(term))) {
    pharmaRole = "API";
    if (!cameoGroups.includes("amines")) cameoGroups.push("amines");
  }

  return {
    cameoGroups: Array.from(new Set(cameoGroups.length ? cameoGroups : ["water_aqueous"])),
    uspClassification: uspClass,
    pharmaRole
  };
}

/**
 * Environmental Fate & PBT Estimator (EPA CTX Fallback & Estimator)
 */
export function estimatePbtProfile(compoundName, formula = "", cas = "", cameoGroups = []) {
  const n = compoundName.toLowerCase();
  const f = formula.toLowerCase();

  let p = "Low";
  let b = "Low";
  let t = "Low";
  let rating = "Green";
  let notes = "Readily biodegradable organic molecule with minimal aquatic toxicity.";
  let fate = "Aerobic degradation half-life < 10 days in standard wastewater treatment.";

  // Heavy metals or Pt compounds
  if (f.includes("pt") || f.includes("hg") || f.includes("pb") || f.includes("cd") || n.includes("platin")) {
    p = "High";
    b = "Moderate";
    t = "High";
    rating = "Red";
    notes = "Heavy metal core does not degrade; exhibits acute and chronic aquatic cytotoxicity.";
    fate = "Persistent elemental residue; requires precipitation or thermal isolation.";
  }
  // Halogenated hydrocarbons
  else if (f.includes("cl") || f.includes("br")) {
    if (cameoGroups.includes("acyl_halides")) {
      p = "Moderate";
      b = "Low";
      t = "High";
      rating = "Red";
      notes = "Hydrolyzes rapidly in water to corrosive hydrochloric acid; creates localized acute ecotoxicity.";
      fate = "Aqueous hydrolysis half-life < 2 hours with severe acid pulse.";
    } else {
      p = "High";
      b = "Moderate";
      t = "High";
      rating = "Red";
      notes = "Persistent halogenated solvent; resistance to biological degradation; groundwater contaminant.";
      fate = "Atmospheric half-life > 120 days; persistent in anaerobic aquifers.";
    }
  }
  // Cytotoxics
  else if (cameoGroups.includes("cytotoxics")) {
    p = "High";
    b = "Moderate";
    t = "High";
    rating = "Red";
    notes = "Antineoplastic agent with high mutagenic and cellular toxicity in aquatic organisms.";
    fate = "Resistant to standard municipal wastewater biomes; causes bacterial selection.";
  }
  // Antibiotics
  else if (["cillin", "mycin", "floxacin", "cycline"].some(x => n.includes(x))) {
    p = "Moderate";
    b = "Low";
    t = "High";
    rating = "Yellow";
    notes = "High aquatic ecotoxicity towards cyanobacteria and microalgae; drives antimicrobial resistance (AMR).";
    fate = "Photolytic and hydrolytic half-life 15-45 days; requires thermal inactivation.";
  }
  // Strong caustics or strong mineral acids
  else if (cameoGroups.includes("caustics_bases") || cameoGroups.includes("acids_inorganic")) {
    p = "Low";
    b = "Low";
    t = "Moderate";
    rating = "Yellow";
    notes = "Inorganic ions; ecotoxicity driven by severe pH shifts (lethal to fish if un-neutralized).";
    fate = "Inorganic neutralization in environmental waters; no bioaccumulation.";
  }
  // Simple alcohols, acetates, preferred green solvents
  else if (["ethanol", "isopropanol", "ethyl acetate", "glycerol", "water"].some(x => n.includes(x))) {
    p = "Low";
    b = "Low";
    t = "Low";
    rating = "Green";
    notes = "Low aquatic ecotoxicity; non-bioaccumulative and readily biodegradable.";
    fate = "Rapid biodegradation (>90% mineralized within 5 days).";
  } else {
    // Default balanced estimate
    p = "Moderate";
    b = "Low";
    t = "Moderate";
    rating = "Yellow";
    notes = "Moderate environmental persistence typical of organic small molecules.";
    fate = "Estimated biodegradation half-life 20-60 days.";
  }

  return {
    persistence: p,
    bioaccumulation: b,
    toxicity: t,
    greenRating: rating,
    aquaticToxicityNotes: notes,
    environmentalFate: fate
  };
}

/**
 * 1. Fetch from PubChem PUG REST API
 */
export async function fetchPubChemData(compoundName) {
  const query = compoundName.trim();
  if (!query) throw new Error("Compound name is required");

  const cleanKey = query.toLowerCase();

  // Try live PubChem PUG REST API
  try {
    const encodedName = encodeURIComponent(query);
    const propUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodedName}/property/MolecularFormula,MolecularWeight,CanonicalSMILES/JSON`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(propUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data?.PropertyTable?.Properties?.[0]) {
        const prop = data.PropertyTable.Properties[0];
        const cid = prop.CID;
        const formula = prop.MolecularFormula || "";
        const mw = prop.MolecularWeight ? parseFloat(prop.MolecularWeight) : 0;
        const smiles = prop.CanonicalSMILES || "";

        // Structure image
        const structureUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG`;

        // Attempt to fetch PubChem PUG View for GHS hazard descriptions
        let hazardNotes = "";
        let ghsPictograms = [];
        try {
          const viewUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON?heading=GHS+Classification`;
          const viewRes = await fetch(viewUrl);
          if (viewRes.ok) {
            const viewData = await viewRes.json();
            // Dig through PUG View hierarchy for Hazard Statements
            const sections = viewData?.Record?.Section || [];
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
          // Non-blocking PUG view fetch failure
        }

        // Deduce groups & classifications
        const inferred = inferReactivityAndClassification(query, formula, smiles);
        const pbt = estimatePbtProfile(query, formula, "", inferred.cameoGroups);

        return {
          source: "PubChem Live API",
          cid,
          name: query,
          formula,
          molecularWeight: mw,
          smiles,
          structureUrl,
          hazardSummary: hazardNotes.slice(0, 320) || "Auto-retrieved from PubChem. Handle with standard laboratory PPE.",
          cameoGroups: inferred.cameoGroups,
          uspClassification: inferred.uspClassification,
          pharmaRole: inferred.pharmaRole,
          pbtScore: {
            persistence: pbt.persistence,
            bioaccumulation: pbt.bioaccumulation,
            toxicity: pbt.toxicity
          },
          greenChemistryRating: pbt.greenRating,
          aquaticToxicity: pbt.aquaticToxicityNotes
        };
      }
    }
  } catch (err) {
    console.warn("Live PubChem fetch failed or offline, checking local scientific fallback DB...", err.message);
  }

  // Fallback to local scientific knowledge base
  const matchedKey = Object.keys(FALLBACK_COMPOUND_DB).find(k =>
    cleanKey.includes(k) || k.includes(cleanKey)
  );

  if (matchedKey) {
    const item = FALLBACK_COMPOUND_DB[matchedKey];
    return {
      source: "Scientific Fallback Engine",
      ...item
    };
  }

  // Generic heuristic fallback for unknown compound
  const inferred = inferReactivityAndClassification(query);
  const pbt = estimatePbtProfile(query, "", "", inferred.cameoGroups);
  return {
    source: "Safety Heuristics Engine",
    name: query,
    formula: "Custom Formulation",
    molecularWeight: 180.0,
    smiles: "",
    cid: null,
    structureUrl: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/" + encodeURIComponent(query) + "/PNG",
    cameoGroups: inferred.cameoGroups,
    uspClassification: inferred.uspClassification,
    pharmaRole: inferred.pharmaRole,
    pbtScore: {
      persistence: pbt.persistence,
      bioaccumulation: pbt.bioaccumulation,
      toxicity: pbt.toxicity
    },
    greenChemistryRating: pbt.greenRating,
    hazardSummary: "Chemical properties synthesized from structural motifs. Always verify with manufacturer SDS.",
    aquaticToxicity: pbt.aquaticToxicityNotes
  };
}

/**
 * 2. Fetch from openFDA Drug Label API
 */
export async function fetchOpenFdaData(compoundName) {
  const query = compoundName.trim();
  if (!query) return null;

  try {
    const encoded = encodeURIComponent(`"${query}"`);
    const fdaUrl = `https://api.fda.gov/drug/label.json?search=openfda.substance_name:${encoded}+openfda.generic_name:${encoded}+openfda.brand_name:${encoded}&limit=1`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(fdaUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const result = data?.results?.[0];
      if (result) {
        const boxedWarning = result.boxed_warning?.[0] || "";
        const storageHandling = result.storage_and_handling?.[0] || result.how_supplied?.[0] || "";
        const warnings = result.warnings_and_cautions?.[0] || result.warnings?.[0] || "";
        const brand = result.openfda?.brand_name?.[0] || "";

        return {
          source: "openFDA Drug Label API",
          brandName: brand,
          boxedWarning: boxedWarning.slice(0, 350),
          storageHandling: storageHandling.slice(0, 350),
          warnings: warnings.slice(0, 350),
          hasBoxedWarning: !!boxedWarning
        };
      }
    }
  } catch (err) {
    console.warn("openFDA API query bypassed or unavailable:", err.message);
  }

  // Check fallback DB for FDA notes
  const cleanKey = query.toLowerCase();
  const matchedKey = Object.keys(FALLBACK_COMPOUND_DB).find(k =>
    cleanKey.includes(k) || k.includes(cleanKey)
  );

  if (matchedKey && FALLBACK_COMPOUND_DB[matchedKey].fdaNotes) {
    return {
      source: "FDA Fallback Monograph",
      storageHandling: FALLBACK_COMPOUND_DB[matchedKey].fdaNotes,
      hasBoxedWarning: FALLBACK_COMPOUND_DB[matchedKey].fdaNotes.includes("BOXED WARNING")
    };
  }

  return null;
}

/**
 * 3. US EPA CompTox (CTX) API Integration with Fallback Estimator
 */
export async function fetchEpaCompToxData(casNumber, compoundName, chemicalClass = "") {
  const epaKey = import.meta.env?.VITE_EPA_COMPTOX_KEY;

  if (epaKey && casNumber) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(`https://api-ccte.epa.gov/chemical/hazard/search/by-casrn/${encodeURIComponent(casNumber)}`, {
        headers: {
          "x-api-key": epaKey,
          "Accept": "application/json"
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const epaData = await res.json();
        return {
          source: "US EPA CompTox API",
          cas: casNumber,
          data: epaData
        };
      }
    } catch (err) {
      console.warn("EPA CompTox live API call failed, using built-in estimator:", err.message);
    }
  }

  // Built-in EPA CompTox Heuristic Estimator
  const estimated = estimatePbtProfile(compoundName, "", casNumber, chemicalClass ? [chemicalClass] : []);
  return {
    source: "EPA CompTox Environmental Fate Estimator",
    ...estimated
  };
}

/**
 * 4. Local NOAA CAMEO Multi-Compound Reactivity Engine
 * Evaluates pairwise combinations of selected compounds
 */
export function analyzeReactivityMatrix(compounds) {
  if (!compounds || compounds.length < 2) {
    return {
      overallStatus: "INSUFFICIENT_SELECTION",
      overallSeverity: "NEUTRAL",
      summary: "Select at least 2 compounds to execute reactivity and waste compatibility evaluation.",
      pairInteractions: [],
      hasIncompatibility: false
    };
  }

  const matrix = cameoRules.matrix;
  const groupsList = cameoRules.groups;
  const pairInteractions = [];
  let worstSeverity = "SAFE"; // SAFE < CAUTION < DANGER

  for (let i = 0; i < compounds.length; i++) {
    for (let j = i + 1; j < compounds.length; j++) {
      const compA = compounds[i];
      const compB = compounds[j];

      const groupsA = compA.cameoGroups || [];
      const groupsB = compB.cameoGroups || [];

      let pairMatches = [];

      // Check all combinations of groups between A and B
      for (const gA of groupsA) {
        for (const gB of groupsB) {
          const match = matrix.find(
            rule =>
              (rule.group1 === gA && rule.group2 === gB) ||
              (rule.group1 === gB && rule.group2 === gA)
          );

          if (match) {
            pairMatches.push({
              rule: match,
              groupA: groupsList.find(g => g.id === gA)?.name || gA,
              groupB: groupsList.find(g => g.id === gB)?.name || gB
            });
          }
        }
      }

      // Check if both are same or compatible by default
      if (pairMatches.length === 0) {
        pairInteractions.push({
          compoundA: compA,
          compoundB: compB,
          status: "COMPATIBLE",
          severity: "SAFE",
          hazardTitle: "No Critical CAMEO Cross-Reactivity Detected",
          hazardCode: "None",
          description: `No catastrophic chemical reactivity documented in NOAA CAMEO matrix between ${compA.name} and ${compB.name}. Standard co-storage and handling precautions apply.`,
          segregationAction: "Co-storage acceptable provided physical states and primary storage classes (e.g., flammables, corrosives) align."
        });
      } else {
        // Find most severe rule
        const hasDanger = pairMatches.some(m => m.rule.severity === "DANGER");
        const hasCaution = pairMatches.some(m => m.rule.severity === "CAUTION");

        const primaryMatch = hasDanger
          ? pairMatches.find(m => m.rule.severity === "DANGER")
          : hasCaution
            ? pairMatches.find(m => m.rule.severity === "CAUTION")
            : pairMatches[0];

        const rule = primaryMatch.rule;

        if (rule.severity === "DANGER") {
          worstSeverity = "DANGER";
        } else if (rule.severity === "CAUTION" && worstSeverity !== "DANGER") {
          worstSeverity = "CAUTION";
        }

        pairInteractions.push({
          compoundA: compA,
          compoundB: compB,
          status: rule.status,
          severity: rule.severity,
          hazardTitle: rule.hazardTitle,
          hazardCode: rule.hazardCode,
          description: `${compA.name} (${primaryMatch.groupA}) + ${compB.name} (${primaryMatch.groupB}): ${rule.description}`,
          segregationAction: rule.segregationAction,
          matchedGroups: [primaryMatch.groupA, primaryMatch.groupB]
        });
      }
    }
  }

  let overallStatus = "COMPATIBLE";
  let overallBadgeText = "Compatible & Safe";
  let summary = "All selected compounds are compatible for co-storage or joint waste collection.";

  if (worstSeverity === "DANGER") {
    overallStatus = "INCOMPATIBLE";
    overallBadgeText = "CRITICAL INCOMPATIBILITY / DANGER";
    summary = "SEVERE HAZARD: One or more compound pairs will trigger violent exothermic reaction, toxic gas release, or explosive deflagration!";
  } else if (worstSeverity === "CAUTION") {
    overallStatus = "CONDITIONAL";
    overallBadgeText = "Conditional / Caution Required";
    summary = "CAUTION: Specific co-storage or waste segregation constraints apply (e.g. Cytotoxic segregation, dual-hazard flammables).";
  }

  return {
    overallStatus,
    overallBadgeText,
    overallSeverity: worstSeverity,
    summary,
    pairInteractions,
    hasIncompatibility: worstSeverity === "DANGER"
  };
}

