import { WASTE_STREAMS } from '../data/wasteValorisationDB.js';

const CHROMIUM_TERMS = /\b(chromium|chrome|cr\s*\(?\s*(iii|vi)\s*\)?|wet blue)\b/i;
const API_TERMS = /\b(api|active ingredient|antibiotic|cytotoxic|pharmaceutical active|drug residue)\b/i;
const HALOGENATED_SOLVENT_TERMS = /\b(dcm|dichloromethane|halogenated|chlorinated solvent)\b/i;
const SULFIDE_TERMS = /\b(sulfide|sulphide|limed fleshings|unhairing)\b/i;

export function analyzeWasteStream(wasteId, contaminants = '') {
  const stream = WASTE_STREAMS.find((item) => item.id === wasteId);
  if (!stream) {
    throw new Error(`Unknown waste stream: ${wasteId}`);
  }

  const warnings = [];
  const input = `${stream.categoryName} ${stream.wasteProfile.chemicalComposition} ${contaminants}`;
  const hasChromium = CHROMIUM_TERMS.test(input);
  const hasApi = stream.industryId === 'pharmaceutical' && (
    stream.id === 'pharma-expired-products' ||
    stream.id === 'pharma-synthesis-byproducts' ||
    API_TERMS.test(contaminants)
  );
  const hasHalogenatedSolvent = stream.id === 'pharma-solvent-waste' &&
    HALOGENATED_SOLVENT_TERMS.test(input);
  const hasBiologicalPharmaWaste = stream.id === 'pharma-biological-residues';
  const hasSulfide = SULFIDE_TERMS.test(input);
  const hasAcid = /\b(acid|acidic|low ph|pickling liquor)\b/i.test(contaminants);

  if (hasChromium) {
    warnings.push({
      severity: 'critical',
      title: 'Chromium-bearing material: controlled route only',
      message: 'Keep segregated and contained. No land application, feed, food, consumer reuse, open burning or ordinary composting. Use an authorized chromium recovery, stabilization or disposal facility.'
    });
  }

  if (hasApi) {
    warnings.push({
      severity: 'critical',
      title: 'Active pharmaceutical residue',
      message: 'Do not reuse in consumer products, cosmetics, food, feed or agriculture. Route to authorized treatment/destruction with documented API destruction.'
    });
  }

  if (hasHalogenatedSolvent) {
    warnings.push({
      severity: 'critical',
      title: 'Halogenated solvent segregation',
      message: 'Keep DCM/halogenated waste separate from non-halogenated solvents. No sewer disposal or open evaporation; use dedicated permitted recovery or licensed destruction.'
    });
  }

  if (hasBiologicalPharmaWaste) {
    warnings.push({
      severity: 'critical',
      title: 'Potentially active biological residue',
      message: 'Maintain containment until validated inactivation is documented. No composting, feed, land application or open handling; use an authorized biological/pharmaceutical waste route.'
    });
  }

  if (hasSulfide && hasAcid) {
    warnings.push({
      severity: 'critical',
      title: 'Hydrogen sulfide generation hazard',
      message: 'Do not mix sulfide-bearing waste with acids or acidic wastewater. Acidification can release acutely toxic hydrogen sulfide; isolate and consult the site emergency and treatment procedures.'
    });
  }

  return {
    stream,
    warnings,
    hasCriticalRestrictions: warnings.some((warning) => warning.severity === 'critical'),
    contaminantNote: contaminants.trim()
      ? `User-noted contaminants: ${contaminants.trim()}`
      : 'No additional contaminants entered; this is not evidence that the batch is uncontaminated.'
  };
}
