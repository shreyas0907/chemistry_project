import test from 'node:test';
import assert from 'node:assert/strict';
import { SAMPLE_PRESETS, WASTE_STREAMS } from '../data/wasteValorisationDB.js';
import { analyzeWasteStream } from './wasteValorisationRules.js';

const requiredStreamFields = [
  'id',
  'industryId',
  'categoryName',
  'aliases',
  'wasteProfile',
  'recoveryMethod',
  'crossIndustryReuse',
  'sustainabilityImpact',
  'safetyAndFeasibility'
];
const expectedNestedFields = {
  wasteProfile: ['chemicalComposition', 'typicalPhysicalState', 'environmentalConcerns'],
  recoveryMethod: ['methodName', 'scientificExplanation', 'processingConsiderations'],
  sustainabilityImpact: ['wasteReductionPotential', 'resourceConservation', 'environmentalAdvantages'],
  safetyAndFeasibility: [
    'feasibilityRating',
    'feasibilityRationale',
    'contaminationRisks',
    'requiredQualityChecks',
    'regulatoryConsiderations',
    'hardSafetyRestrictions'
  ]
};

test('database covers all 20 streams using the required schema and enum values', () => {
  assert.equal(WASTE_STREAMS.length, 20);
  assert.equal(new Set(WASTE_STREAMS.map((stream) => stream.id)).size, 20);
  assert.deepEqual(
    Object.fromEntries(['leather', 'cosmetics', 'pharmaceutical'].map((industryId) => [
      industryId,
      WASTE_STREAMS.filter((stream) => stream.industryId === industryId).length
    ])),
    { leather: 6, cosmetics: 7, pharmaceutical: 7 }
  );

  for (const stream of WASTE_STREAMS) {
    assert.deepEqual(Object.keys(stream).sort(), [...requiredStreamFields].sort(), `${stream.id} has an unexpected schema`);
    for (const [field, keys] of Object.entries(expectedNestedFields)) {
      assert.deepEqual(Object.keys(stream[field]).sort(), [...keys].sort(), `${stream.id}.${field} has an unexpected schema`);
    }
    assert.ok(['leather', 'cosmetics', 'pharmaceutical'].includes(stream.industryId));
    assert.ok(['Solid', 'Liquid', 'Sludge', 'Semi-solid'].includes(stream.wasteProfile.typicalPhysicalState));
    assert.ok(stream.crossIndustryReuse.length > 0);
    for (const pathway of stream.crossIndustryReuse) {
      assert.deepEqual(Object.keys(pathway).sort(), [
        'recoveredMaterial',
        'applications',
        'targetIndustries',
        'suitabilityRationale',
        'maturityLevel'
      ].sort(), `${stream.id} reuse pathway has an unexpected schema`);
    }
    assert.ok(['High', 'Medium', 'Low'].includes(stream.safetyAndFeasibility.feasibilityRating));
    for (const pathway of stream.crossIndustryReuse) {
      assert.ok(['Established Industrial', 'Emerging / Pilot-Scale'].includes(pathway.maturityLevel));
      assert.ok(pathway.targetIndustries.length > 0);
    }
  }
});

test('sample presets resolve to known waste streams', () => {
  assert.ok(SAMPLE_PRESETS.length >= 5);
  for (const preset of SAMPLE_PRESETS) {
    assert.ok(WASTE_STREAMS.some((stream) => stream.id === preset.wasteId), `${preset.id} references an unknown stream`);
  }
});

test('critical chromium, API, halogenated solvent and biological residues trigger restrictions', () => {
  const cases = [
    ['leather-chromium-waste', '', 'Chromium-bearing'],
    ['pharma-expired-products', '', 'Active pharmaceutical'],
    ['pharma-solvent-waste', 'DCM and trace API', 'Halogenated solvent'],
    ['pharma-biological-residues', '', 'Potentially active biological']
  ];

  for (const [wasteId, contaminants, warningText] of cases) {
    const result = analyzeWasteStream(wasteId, contaminants);
    assert.equal(result.hasCriticalRestrictions, true);
    assert.ok(result.warnings.some((warning) => warning.title.includes(warningText)));
  }
});

test('sulfide and acid co-contamination triggers a hydrogen sulfide warning', () => {
  const result = analyzeWasteStream('leather-hair-fleshings', 'sodium sulfide and acidic liquor');
  assert.ok(result.warnings.some((warning) => warning.title.includes('Hydrogen sulfide')));
});

test('unknown stream identifiers fail explicitly', () => {
  assert.throws(() => analyzeWasteStream('not-a-waste-stream'), /Unknown waste stream/);
});
