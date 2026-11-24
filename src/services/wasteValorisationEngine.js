/**
 * INDUSTRIAL WASTE VALORISATION & REUSE RECOMMENDATION ENGINE
 * Analyzes waste streams from Leather Tanning, Cosmetics, and Pharmaceutical industries.
 * Computes cross-industry recovery pathways, circularity metrics, and enforces strict safety restrictions.
 */

import { VERIFIED_WASTE_STREAMS, WASTE_INDUSTRIES } from '../data/wasteValorisationData.js';

/**
 * Normalizes text for matching
 */
function cleanText(str) {
  return (str || '').toLowerCase().trim();
}

/**
 * Main Analysis Function
 * Evaluates waste profile, recovery pathways, cross-industry matches, and chemical safety restrictions.
 */
export function analyzeIndustrialWaste({
  industryId = 'leather',
  wasteId = '',
  wasteName = '',
  customComposition = '',
  quantity = '',
  contaminants = ''
}) {
  const normName = cleanText(wasteName);
  const normContam = cleanText(contaminants);
  const normComp = cleanText(customComposition);

  // 1. Locate baseline verified waste stream
  let matchedStream = null;
  if (wasteId) {
    matchedStream = VERIFIED_WASTE_STREAMS.find(w => w.id === wasteId);
  }

  if (!matchedStream && normName) {
    // Fuzzy matching against name, synonyms, and categories
    matchedStream = VERIFIED_WASTE_STREAMS.find(w => {
      const matchInd = !industryId || w.industryId === industryId;
      const matchName = cleanText(w.name).includes(normName) || normName.includes(cleanText(w.name));
      const matchSyn = w.synonyms?.some(s => cleanText(s).includes(normName) || normName.includes(cleanText(s)));
      const matchCat = cleanText(w.category).includes(normName);
      return matchInd && (matchName || matchSyn || matchCat);
    });
  }

  // Fallback to industry primary stream if still not matched
  if (!matchedStream) {
    const industryFallback = VERIFIED_WASTE_STREAMS.filter(w => w.industryId === industryId);
    matchedStream = industryFallback[0] || VERIFIED_WASTE_STREAMS[0];
  }

  // 2. Identify Source Industry Metadata
  const industryMeta = WASTE_INDUSTRIES.find(ind => ind.id === (matchedStream.industryId || industryId)) || WASTE_INDUSTRIES[0];

  // 3. Dynamic Safety Restrictions & Hazard Evaluation
  const safetyAudit = evaluateSafetyRestrictions({
    industryId: matchedStream.industryId || industryId,
    streamName: matchedStream.name,
    customName: wasteName,
    contaminants: normContam,
    composition: normComp,
    baselineRestrictions: matchedStream.safetyAndFeasibility
  });

  // 4. Synthesize Waste Profile (Section A)
  const wasteProfile = {
    wasteName: wasteName.trim() || matchedStream.name,
    sourceIndustry: industryMeta.name,
    industryBadge: industryMeta.badge,
    industryColor: industryMeta.color,
    category: matchedStream.category,
    physicalState: matchedStream.physicalState,
    hazardLevel: safetyAudit.dynamicHazardLevel || matchedStream.hazardLevel,
    chemicalComposition: customComposition.trim() || matchedStream.typicalComposition,
    environmentalConcerns: matchedStream.environmentalConcerns,
    quantityLogged: quantity.trim() || 'Industrial Batch Scale (Unspecified)',
    knownContaminants: contaminants.trim() || 'Baseline stream matrix (Standard industrial specs)'
  };

  // 5. Recommended Recovery Method (Section B)
  const recoveryMethod = {
    name: matchedStream.recommendedRecoveryMethod.name,
    scientificExplanation: matchedStream.recommendedRecoveryMethod.scientificExplanation,
    requiredProcessing: matchedStream.recommendedRecoveryMethod.requiredProcessing,
    technologyReadinessLevel: safetyAudit.hasCriticalRestrictions ? 'Restricted / Authorized Facilities Only' : 'Commercial Scale (TRL 8-9)'
  };

  // 6. Cross-Industry Reuse Opportunities (Section C)
  // Filter or annotate reuse options based on safety restrictions
  const filteredReuseOpportunities = matchedStream.reuseOpportunities.map(opp => {
    let statusNote = 'Verified Viable';
    let isBanned = false;

    // Safety checks against restricted applications
    if (safetyAudit.isChromiumContaminated && opp.possibleApplications.some(app => app.toLowerCase().includes('feed') || app.toLowerCase().includes('food') || app.toLowerCase().includes('soil'))) {
      statusNote = 'RESTRICTED: Chromium content prohibits agricultural or animal feed applications.';
      isBanned = true;
    }

    if (safetyAudit.isPharmaceuticalAPI && opp.possibleApplications.some(app => app.toLowerCase().includes('feed') || app.toLowerCase().includes('food') || app.toLowerCase().includes('cosmetic') || app.toLowerCase().includes('soil'))) {
      statusNote = 'STRICTLY PROHIBITED: Active drug residues cannot be reused in food, cosmetics, or open agriculture.';
      isBanned = true;
    }

    return {
      ...opp,
      statusNote,
      isBanned
    };
  });

  // 7. Sustainability & Circularity Impact (Section D)
  const sustainability = {
    wasteReductionPct: matchedStream.sustainabilityImpact.wasteReductionPct,
    co2AbatementKgPerTon: matchedStream.sustainabilityImpact.co2AbatementKgPerTon,
    resourceConservation: matchedStream.sustainabilityImpact.resourceConservation,
    circularityIndex: matchedStream.sustainabilityImpact.circularityIndex,
    circularEconomyTier: matchedStream.sustainabilityImpact.circularityIndex >= 90 ? 'Tier 1: High-Value Closed/Cross-Loop' : 'Tier 2: Controlled Industrial Resource'
  };

  // 8. Safety and Feasibility Assessment (Section E)
  const safetyAndFeasibility = {
    contaminationRisks: matchedStream.safetyAndFeasibility.contaminationRisks + (normContam ? ` [Additional Logged: ${contaminants}]` : ''),
    mandatoryQualityChecks: matchedStream.safetyAndFeasibility.mandatoryQualityChecks,
    regulatoryConsiderations: matchedStream.safetyAndFeasibility.regulatoryConsiderations,
    feasibilityRating: safetyAudit.adjustedFeasibility || matchedStream.safetyAndFeasibility.feasibilityRating,
    feasibilityExplanation: safetyAudit.feasibilityNote || matchedStream.safetyAndFeasibility.feasibilityExplanation,
    restrictedApplications: safetyAudit.explicitRestrictions || matchedStream.safetyAndFeasibility.restrictedApplications,
    safetyWarnings: safetyAudit.warnings,
    isCompliant: safetyAudit.warnings.length === 0
  };

  // 9. Cross-Industry Synergy Mapping
  // Extracts unique target industries that can absorb this secondary resource
  const targetIndustriesList = Array.from(
    new Set(
      matchedStream.reuseOpportunities.flatMap(o => o.targetIndustries)
    )
  );

  return {
    streamId: matchedStream.id,
    industryMeta,
    wasteProfile,
    recoveryMethod,
    reuseOpportunities: filteredReuseOpportunities,
    sustainability,
    safetyAndFeasibility,
    targetIndustriesList,
    safetyAudit
  };
}

/**
 * Strict Safety Rules Evaluator
 * Enforces CPCB/MPCB, EPA RCRA, and REACH circular safety mandates.
 */
function evaluateSafetyRestrictions({
  industryId,
  streamName = '',
  customName = '',
  contaminants = '',
  composition = '',
  baselineRestrictions = {}
}) {
  const combined = `${streamName} ${customName} ${contaminants} ${composition}`.toLowerCase();
  const warnings = [];
  let dynamicHazardLevel = null;
  let adjustedFeasibility = null;
  let feasibilityNote = null;
  let explicitRestrictions = baselineRestrictions.restrictedApplications || '';

  // Rule 1: Chromium-Containing Tannery Waste
  const isChromium = combined.includes('chromium') || combined.includes('chrome') || combined.includes('wet blue') || combined.includes('tannery sludge');
  if (isChromium) {
    warnings.push({
      type: 'CRITICAL_CHROMIUM_HAZARD',
      title: 'Mandatory Chromium Isolation & De-Chroming Required',
      severity: 'CRITICAL',
      message: 'Chromium-containing tannery waste MUST NOT be recommended for unrestricted reuse, land spreading, or animal feed. In unregulated aerobic composting or open burning, trivalent Cr(III) can oxidize into carcinogenic Hexavalent Chromium Cr(VI). Strict closed-loop regeneration or high-temperature ceramic vitrification is legally mandatory under CPCB Schedule II.'
    });
    dynamicHazardLevel = 'Critical / Hazardous (Heavy Metal Contaminated)';
    explicitRestrictions = 'STRICT BAN: Prohibited from direct agricultural soil application, animal nutrition, human food, and unlined municipal landfills. Trivalent chromium must be recovered via closed-loop chemical extraction or vitrified into non-leachable ceramic aggregates.';
  }

  // Rule 2: Pharmaceutical Active Drug Ingredients (APIs)
  const isPharmaAPI = combined.includes('api') || combined.includes('antibiotic') || combined.includes('drug') || combined.includes('tablet') || combined.includes('expired') || combined.includes('active ingredient') || industryId === 'pharma' && combined.includes('finished');
  if (isPharmaAPI && !combined.includes('blister') && !combined.includes('solvent')) {
    warnings.push({
      type: 'CRITICAL_PHARMA_API_RESTRICTION',
      title: 'Pharmaceutical API Bioactivity Restriction',
      severity: 'CRITICAL',
      message: 'Pharmaceutical waste containing active drug ingredients MUST NOT be recommended for direct reuse in consumer products, cosmetics, food, or agriculture. Trace APIs induce antimicrobial resistance (AMR), endocrine disruption, and biological toxicity. Complete thermal destruction (cement kiln AFR) or validated chemical degradation is legally required.'
    });
    dynamicHazardLevel = 'Critical / Hazardous (High Pharmacological Potency)';
    explicitRestrictions = 'ABSOLUTE REGULATORY BAN: Direct reuse of active pharmaceutical ingredients in cosmetics, animal feed, fertilizer, or consumer goods is strictly forbidden under the Drugs and Cosmetics Act & Hazardous Waste Rules 2016. High-temperature cement kiln co-processing or TSDF incineration is mandatory.';
  }

  // Rule 3: Flammable Volatile Solvents & Peroxide Hazards
  const isSolvent = combined.includes('solvent') || combined.includes('toluene') || combined.includes('isopropanol') || combined.includes('ipa') || combined.includes('acetone') || combined.includes('ethanol') || combined.includes('dichloromethane');
  if (isSolvent) {
    if (combined.includes('peroxide') || combined.includes('oxidizer') || combined.includes('ether')) {
      warnings.push({
        type: 'EXPLOSION_REDOX_CONFLICT',
        title: 'Explosive Peroxide Formation Alert',
        severity: 'CRITICAL',
        message: 'Recovered solvents containing ether linkages or exposed to oxidizers can form explosive organic peroxides during distillation. Peroxide testing (potassium iodide or test strips) MUST confirm < 10 ppm before any heating or vacuum concentration.'
      });
    }
  }

  // Rule 4: Cosmetic Preservatives & Silicone Contamination
  const isCosmeticLipid = industryId === 'cosmetics' && (combined.includes('oil') || combined.includes('lipid') || combined.includes('fat') || combined.includes('wax'));
  if (isCosmeticLipid) {
    if (combined.includes('silicone') || combined.includes('dimethicone') || combined.includes('cyclomethicone')) {
      warnings.push({
        type: 'CATALYST_POISONING_ALERT',
        title: 'Silicone Catalyst Poisoning in Biodiesel Production',
        severity: 'WARNING',
        message: 'Synthetic cosmetic silicones (dimethicone) act as severe catalytic poisons in transesterification reactors and destroy automotive engine fuel injectors. If silicones exceed 5 ppm, lipid fraction must be diverted to industrial formwork release oils rather than engine-grade biodiesel.'
      });
      adjustedFeasibility = 'Medium';
      feasibilityNote = 'Silicone contamination prevents engine fuel certification (EN 14214); suitable instead for construction mold release agents and technical polishes.';
    }
  }

  // Rule 5: Hydrogen Sulfide Generation in Leather Beamhouse Wastes
  const isSulfideWaste = combined.includes('sulfide') || combined.includes('fleshing') || combined.includes('limed') || combined.includes('unhairing');
  if (isSulfideWaste && combined.includes('acid')) {
    warnings.push({
      type: 'LETHAL_H2S_EVOLUTION',
      title: 'FATAL CHEMICAL REACTION: Acid-Sulfide Mixing Hazard',
      severity: 'CRITICAL',
      message: 'DANGER: Mixing limed or sulfide-bearing beamhouse waste with acidic effluents or pickling liquors will instantaneously release lethal Hydrogen Sulfide (H2S) gas! pH must be maintained >= 10.0 and catalytic oxidation completed before any neutralization.'
    });
  }

  return {
    warnings,
    hasCriticalRestrictions: warnings.some(w => w.severity === 'CRITICAL'),
    isChromiumContaminated: isChromium,
    isPharmaceuticalAPI: isPharmaAPI,
    dynamicHazardLevel,
    adjustedFeasibility,
    feasibilityNote,
    explicitRestrictions
  };
}

/**
 * Returns summary statistics across all verified waste-to-resource pathways
 */
export function getWasteValorisationStats() {
  const totalStreams = VERIFIED_WASTE_STREAMS.length;
  const industryCounts = {
    leather: VERIFIED_WASTE_STREAMS.filter(s => s.industryId === 'leather').length,
    cosmetics: VERIFIED_WASTE_STREAMS.filter(s => s.industryId === 'cosmetics').length,
    pharma: VERIFIED_WASTE_STREAMS.filter(s => s.industryId === 'pharma').length
  };

  const totalPossibleApplications = VERIFIED_WASTE_STREAMS.reduce(
    (acc, curr) => acc + curr.reuseOpportunities.reduce((subAcc, o) => subAcc + o.possibleApplications.length, 0),
    0
  );

  const averageCircularityIndex = Math.round(
    VERIFIED_WASTE_STREAMS.reduce((acc, curr) => acc + curr.sustainabilityImpact.circularityIndex, 0) / totalStreams
  );

  const averageCo2Abatement = Math.round(
    VERIFIED_WASTE_STREAMS.reduce((acc, curr) => acc + curr.sustainabilityImpact.co2AbatementKgPerTon, 0) / totalStreams
  );

  return {
    totalStreams,
    industryCounts,
    totalPossibleApplications,
    averageCircularityIndex,
    averageCo2Abatement
  };
}
