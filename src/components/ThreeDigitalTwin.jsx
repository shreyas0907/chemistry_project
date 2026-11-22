import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Building2, 
  Layers, 
  Eye, 
  Maximize2, 
  RotateCcw, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Droplets, 
  Wind, 
  Flame, 
  Activity, 
  Info, 
  Sliders, 
  X,
  Radio,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

/**
 * CAMERA PRESETS (Position x, y, z and Target x, y, z)
 */
const CAMERA_PRESETS = {
  overview: {
    name: 'Facility Overview',
    cam: [0, 52, 68],
    target: [0, 2, 0],
    desc: 'Full site isometric view showing Tank Farm, Warehouse, Reactor, and ETP basins'
  },
  warehouse: {
    name: 'Chemical Warehouse',
    cam: [-24, 22, 28],
    target: [-22, 5, 0],
    desc: 'High-bay racking, segregated chemical drum pallets, and Class 3/8 storage bays'
  },
  reactor: {
    name: 'Processing Reactor',
    cam: [0, 20, 24],
    target: [0, 6, -2],
    desc: 'Jacketed 5000L chemical batch reactor with agitator, condenser, and relief piping'
  },
  etp: {
    name: 'ETP Wastewater Plant',
    cam: [26, 24, 26],
    target: [24, 4, 0],
    desc: '3-stage treatment basins: Sulfide Oxidation, Chrome Precipitation, and Clarifier'
  },
  emergency: {
    name: 'Emergency Station',
    cam: [-10, 16, 44],
    target: [-8, 2, 28],
    desc: 'Deluge shower, eye-wash station, SCBA lockers, and emergency muster point'
  }
};

/**
 * INDUSTRIAL FACILITY OBJECTS DATA FOR RAYCASTING & TELEMETRY
 */
const FACILITY_OBJECTS = [
  {
    id: 'tank-101',
    name: 'Bulk Tank T-101: Sulfuric Acid (98%)',
    category: 'Tank Farm',
    zone: 'Acid Storage Bay 1',
    chemical: 'Sulfuric Acid',
    formula: 'H₂SO₄',
    cas: '7664-93-9',
    capacity: '50,000 L',
    currentLevel: '76.4%',
    temperature: '22.8 °C',
    pressure: '1.02 bar',
    status: 'OPTIMAL',
    statusColor: 'emerald',
    hazardClass: 'Class 8 (Corrosive Strong Acid)',
    ghs: ['Corrosive (Skin/Eye)', 'Metal Corrosion'],
    incompatibleWith: ['Sodium Sulfide', 'Sodium Hypochlorite', 'Sodium Hydroxide', 'Isopropanol'],
    cameoGroup: 'Acids, Strong Oxidizing',
    monitoringFreq: 'Continuous SCADA (Every 2s)',
    position: [-14, 8, -14],
    desc: 'Heavy-walled austenitic alloy storage vessel for high-concentration industrial sulfuric acid. Equipped with dual containment bund and ultrasonic level transmitters.'
  },
  {
    id: 'tank-102',
    name: 'Bulk Tank T-102: Sodium Hydroxide (50% Lye)',
    category: 'Tank Farm',
    zone: 'Alkali Storage Bay 2',
    chemical: 'Sodium Hydroxide Solution',
    formula: 'NaOH (aq)',
    cas: '1310-73-2',
    capacity: '40,000 L',
    currentLevel: '64.1%',
    temperature: '26.4 °C',
    pressure: '1.01 bar',
    status: 'OPTIMAL',
    statusColor: 'emerald',
    hazardClass: 'Class 8 (Corrosive Strong Base)',
    ghs: ['Severe Burns', 'Exothermic with Water/Acid'],
    incompatibleWith: ['Sulfuric Acid', 'Formic Acid', 'Hydrochloric Acid', 'Aluminium'],
    cameoGroup: 'Bases, Strong',
    monitoringFreq: 'Continuous SCADA',
    position: [-6, 8, -14],
    desc: 'Nickel-lined insulated bulk storage for caustic soda liquor used in beamhouse unhairing and effluent neutralization. Heated tracing prevents crystallization below 15°C.'
  },
  {
    id: 'tank-103',
    name: 'Bulk Tank T-103: Hydrogen Peroxide (50%)',
    category: 'Tank Farm',
    zone: 'Oxidizer Storage Bay 3',
    chemical: 'Hydrogen Peroxide (50% Tech)',
    formula: 'H₂O₂',
    cas: '7722-84-1',
    capacity: '25,000 L',
    currentLevel: '82.0%',
    temperature: '19.5 °C',
    pressure: '1.05 bar (Vented)',
    status: 'CAUTION',
    statusColor: 'amber',
    hazardClass: 'Class 5.1 (Strong Oxidizer)',
    ghs: ['Oxidizing Liquid', 'Corrosive', 'Oxygen Gas Evolution'],
    incompatibleWith: ['Chromium Sulfate', 'Organic Solvents', 'Iron/Heavy Metals', 'Sulfides'],
    cameoGroup: 'Peroxides, Inorganic',
    monitoringFreq: 'Continuous SCADA',
    position: [6, 8, -14],
    desc: 'Passivated 316L stainless tank with weighted self-relieving pressure manhole. Dedicated to bleaching and wastewater oxidation. Strictly segregated from reducing agents.'
  },
  {
    id: 'tank-104',
    name: 'Bulk Tank T-104: DCM / Pharma Solvents',
    category: 'Tank Farm',
    zone: 'Solvent Vault Bay 4',
    chemical: 'Dichloromethane (HPLC/Tech)',
    formula: 'CH₂Cl₂',
    cas: '75-09-2',
    capacity: '30,000 L',
    currentLevel: '48.9%',
    temperature: '18.2 °C',
    pressure: '0.98 bar',
    status: 'OPTIMAL',
    statusColor: 'emerald',
    hazardClass: 'Class 6.1 (Toxic / Volatile Halogenated Solvent)',
    ghs: ['Carcinogenicity Cat 2', 'CNS Depressant', 'Phosgene Hazard on Pyrolysis'],
    incompatibleWith: ['Lithium Aluminum Hydride', 'Sodium', 'Strong Oxidizers'],
    cameoGroup: 'Halogenated Organic Solvents',
    monitoringFreq: 'Continuous SCADA',
    position: [14, 8, -14],
    desc: 'Nitrogen-blanketed underground insulated tank with closed-loop vapor recovery system. Automated hydrocarbon leak sniffers armed 24/7.'
  },
  {
    id: 'unit-reactor',
    name: 'Unit R-301: Jacketed Synthesis Reactor',
    category: 'Synthesis & Processing',
    zone: 'Reactor Bay Alpha',
    chemical: 'Batch Chemical Reaction Mixture',
    formula: 'Multi-Component',
    cas: 'Mixed Phase',
    capacity: '5,000 L',
    currentLevel: '68.0%',
    temperature: '65.2 °C',
    pressure: '2.40 bar',
    status: 'ACTIVE RUN',
    statusColor: 'cyan',
    hazardClass: 'Process Safety Unit (Exotherm Management)',
    ghs: ['Exothermic Runaway Risk', 'Pressure Relief Active'],
    incompatibleWith: ['Uncontrolled Reagent Addition'],
    cameoGroup: 'Pressure Vessel',
    monitoringFreq: '100 Hz High-Speed DAQ',
    position: [0, 6, 2],
    desc: 'Hastelloy C-276 multipurpose reactor with magnetic drive agitator, cryogenic chilled glycol jacket (-20°C to +180°C), and bursting disc interlocked to emergency quench.'
  },
  {
    id: 'etp-sulfide',
    name: 'ETP Basin B-01: Catalytic Sulfide Oxidation',
    category: 'Wastewater Treatment',
    zone: 'Effluent Pre-treatment Area',
    chemical: 'Tannery Beamhouse Sulfide Liquor',
    formula: 'Na₂S / NaHS + MnSO₄ catalyst',
    cas: '1313-82-2 (mix)',
    capacity: '120,000 L',
    currentLevel: '85.2%',
    temperature: '28.1 °C',
    pressure: 'Atmospheric',
    status: 'AERATION ACTIVE',
    statusColor: 'emerald',
    hazardClass: 'Hazardous Effluent (Acidification = Fatal H₂S Gas)',
    ghs: ['Deadly Gas Release if pH < 8.5', 'Severe Corrosive'],
    incompatibleWith: ['Deliming Acid Streams', 'Pickle Liquor', 'HCl', 'H2SO4'],
    cameoGroup: 'Sulfides, Aqueous Alkaline',
    monitoringFreq: 'pH continuous + DO sensor',
    position: [24, 3, -8],
    desc: 'Coarse-bubble diffused aeration basin. Injects 1,200 Nm³/h oxygen with 50 ppm Manganese Sulfate catalyst to transform toxic sulfide ions into harmless thiosulfate.'
  },
  {
    id: 'etp-chrome',
    name: 'ETP Basin B-02: Chromium Precipitation Clarifier',
    category: 'Wastewater Treatment',
    zone: 'Effluent Chemical Treatment Area',
    chemical: 'Chrome Tanning Spent Float',
    formula: 'Cr(OH)SO₄ + MgO / NaOH',
    cas: '39380-78-4',
    capacity: '80,000 L',
    currentLevel: '71.5%',
    temperature: '24.0 °C',
    pressure: 'Atmospheric',
    status: 'PRECIPITATION STAGE',
    statusColor: 'cyan',
    hazardClass: 'Heavy Metal Effluent (Strict EPA < 1.0 ppm limit)',
    ghs: ['Ecotoxic to Aquatic Life', 'Hazardous Chemical Sludge'],
    incompatibleWith: ['Strong Oxidizers (Prevents Cr(VI) Formation)'],
    cameoGroup: 'Heavy Metal Salts',
    monitoringFreq: 'Automated photometric Cr analyzer',
    position: [24, 3, 4],
    desc: 'Conical hopper clarifier. Doses technical MgO to maintain pH 8.8. Dissolved trivalent chromium precipitates completely as dense green chromium hydroxide sludge for filter pressing.'
  },
  {
    id: 'warehouse-racks',
    name: 'Warehouse Bay W-1: Segregated Chemical Racks',
    category: 'Chemical Warehouse',
    zone: 'Storage Vault W-100',
    chemical: 'Palletized 200L Steel & HDPE Drums',
    formula: 'Assorted Inventory Formularies',
    cas: 'Multiple',
    capacity: '480 Drums',
    currentLevel: '342 Drums Occupied (71%)',
    temperature: '19.1 °C',
    pressure: 'Ambient',
    status: 'SEGREGATED',
    statusColor: 'emerald',
    hazardClass: 'Multi-Class Warehousing (NFPA 400 Standards)',
    ghs: ['Segregation Enforced', 'Containment Berm Active'],
    incompatibleWith: ['Cross-Bay Co-Storage of Incompatible Classes'],
    cameoGroup: 'Warehousing Matrix',
    monitoringFreq: 'RFID + Optical Barcode Scan',
    position: [-22, 6, 0],
    desc: 'Heavy-duty steel pallet racks with epoxy-lined spill containment sumps beneath each tier. Physical firewalls isolate Flammables Bay from Oxidizer Bay.'
  },
  {
    id: 'emergency-hub',
    name: 'Safety Unit S-01: Central Deluge & Life Safety',
    category: 'Emergency Response',
    zone: 'Life Safety Corridor E-1',
    chemical: 'Potable Deluge Water + AFFF Foam',
    formula: 'H₂O + Aqueous Film-Forming Foam',
    cas: 'N/A',
    capacity: 'Unlimited Supply',
    currentLevel: '100% Ready',
    temperature: '20.0 °C',
    pressure: '6.5 bar (Fire Main)',
    status: 'STANDBY READY',
    statusColor: 'emerald',
    hazardClass: 'Life Safety & Incident Mitigation Hub',
    ghs: ['Emergency First Response', 'OSHA 1910.151 Compliant'],
    incompatibleWith: ['None (Safety Asset)'],
    cameoGroup: 'Emergency System',
    monitoringFreq: 'Daily Physical & Automated Flow Test',
    position: [-8, 4, 28],
    desc: 'Central safety module equipped with 15-minute ANSI Z358.1 emergency eyewash/deluge shower, 4 sets of positive-pressure SCBA gear, gas-tight level A hazmat suits, and AFFF foam monitors.'
  }
];

export default function ThreeDigitalTwin({ onSelectChemical, onNavigate }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const frameIdRef = useRef(null);
  const clickableMeshesRef = useRef([]);

  // UI state
  const [activePreset, setActivePreset] = useState('overview');
  const [selectedUnit, setSelectedUnit] = useState(FACILITY_OBJECTS[0]);
  const [hoveredUnit, setHoveredUnit] = useState(null);
  const [highlightIncompatibilities, setHighlightIncompatibilities] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [showVaporPlume, setShowVaporPlume] = useState(true);
  const [isNightMode, setIsNightMode] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [activeDrillState, setActiveDrillState] = useState(null); // 'LEAK' | 'FIRE' | 'PRESSURE' | null

  // Setup Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(isNightMode ? 0x060c10 : 0x111c24);
    scene.fog = new THREE.FogExp2(isNightMode ? 0x060c10 : 0x111c24, 0.012);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 300);
    camera.position.set(CAMERA_PRESETS.overview.cam[0], CAMERA_PRESETS.overview.cam[1], CAMERA_PRESETS.overview.cam[2]);
    camera.lookAt(new THREE.Vector3(...CAMERA_PRESETS.overview.target));
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(isNightMode ? 0x1e293b : 0x475569, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xecfeff, 2.2);
    sunLight.position.set(30, 60, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 160;
    sunLight.shadow.camera.left = -45;
    sunLight.shadow.camera.right = 45;
    sunLight.shadow.camera.top = 45;
    sunLight.shadow.camera.bottom = -45;
    scene.add(sunLight);

    // Cyan sci-fi fill light
    const cyanLight = new THREE.PointLight(0x06b6d4, 3.5, 50);
    cyanLight.position.set(0, 18, 10);
    scene.add(cyanLight);

    // Amber alert light
    const amberLight = new THREE.PointLight(0xf59e0b, 2.8, 45);
    amberLight.position.set(6, 14, -10);
    scene.add(amberLight);

    // Emerald bio/safe light
    const emeraldLight = new THREE.PointLight(0x10b981, 2.5, 45);
    emeraldLight.position.set(-16, 12, 10);
    scene.add(emeraldLight);

    // 5. Floor & Industrial Foundations
    const floorGeo = new THREE.PlaneGeometry(90, 80);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090f14,
      roughness: 0.85,
      metalness: 0.25
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Floor Grid lines
    const gridHelper = new THREE.GridHelper(90, 45, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // Safety perimeter boundaries (yellow/black warning perimeter)
    const perimeterGeo = new THREE.RingGeometry(42, 43, 4);
    const perimeterMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true });
    const perimeter = new THREE.Mesh(perimeterGeo, perimeterMat);
    perimeter.rotation.x = -Math.PI / 2;
    perimeter.rotation.z = Math.PI / 4;
    perimeter.position.y = 0.05;
    scene.add(perimeter);

    // Clickable Mesh Array
    const clickableMeshes = [];

    // Helper: create text/sign mesh
    const createZoneBerm = (x, z, w, d, labelColor = 0x0ea5e9) => {
      const bermGeo = new THREE.BoxGeometry(w, 0.4, d);
      const bermMat = new THREE.MeshStandardMaterial({
        color: 0x111c24,
        roughness: 0.7,
        metalness: 0.3
      });
      const berm = new THREE.Mesh(bermGeo, bermMat);
      berm.position.set(x, 0.2, z);
      berm.receiveShadow = true;
      scene.add(berm);

      // Glowing curb outline
      const edgeGeo = new THREE.EdgesGeometry(bermGeo);
      const edgeMat = new THREE.LineBasicMaterial({ color: labelColor });
      const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
      edgeLine.position.copy(berm.position);
      scene.add(edgeLine);
    };

    // ------------------------------------------------------------------
    // ZONE 1: TANK FARM (4 Massive Industrial Bulk Tanks)
    // ------------------------------------------------------------------
    createZoneBerm(0, -14, 40, 16, 0xef4444);

    const tankConfigs = [
      { id: 'tank-101', x: -14, z: -14, color: 0x94a3b8, ringColor: 0xef4444, label: 'T-101 H₂SO₄' },
      { id: 'tank-102', x: -6, z: -14, color: 0x64748b, ringColor: 0x0284c7, label: 'T-102 NaOH' },
      { id: 'tank-103', x: 6, z: -14, color: 0xe2e8f0, ringColor: 0xf59e0b, label: 'T-103 H₂O₂' },
      { id: 'tank-104', x: 14, z: -14, color: 0x475569, ringColor: 0x10b981, label: 'T-104 DCM' }
    ];

    tankConfigs.forEach(tc => {
      const tankGroup = new THREE.Group();
      tankGroup.position.set(tc.x, 0, tc.z);

      // Tank Body Cylinder
      const tankGeo = new THREE.CylinderGeometry(3.2, 3.2, 12, 32);
      const tankMat = new THREE.MeshStandardMaterial({
        color: tc.color,
        roughness: 0.35,
        metalness: 0.75
      });
      const tankMesh = new THREE.Mesh(tankGeo, tankMat);
      tankMesh.position.y = 6.4;
      tankMesh.castShadow = true;
      tankMesh.receiveShadow = true;
      tankMesh.userData = { id: tc.id };
      tankGroup.add(tankMesh);
      clickableMeshes.push(tankMesh);

      // Tank Dome Top
      const domeGeo = new THREE.SphereGeometry(3.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMat = new THREE.MeshStandardMaterial({ color: tc.color, roughness: 0.3, metalness: 0.8 });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      dome.position.y = 12.4;
      tankGroup.add(dome);

      // Breather valve on top
      const ventGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.8, 12);
      const ventMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 });
      const vent = new THREE.Mesh(ventGeo, ventMat);
      vent.position.y = 15.6;
      tankGroup.add(vent);

      // Glowing Hazard Ring on Tank Waist
      const ringGeo = new THREE.TorusGeometry(3.3, 0.12, 16, 48);
      const ringMat = new THREE.MeshStandardMaterial({
        color: tc.ringColor,
        emissive: tc.ringColor,
        emissiveIntensity: 0.7
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 7;
      tankGroup.add(ring);

      // Level Indicator Sight Tube
      const sightGeo = new THREE.CylinderGeometry(0.12, 0.12, 10, 8);
      const sightMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.5 });
      const sight = new THREE.Mesh(sightGeo, sightMat);
      sight.position.set(3.3, 6.4, 0);
      tankGroup.add(sight);

      // Foundation plinth
      const plinthGeo = new THREE.CylinderGeometry(3.8, 4.0, 0.8, 24);
      const plinthMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.9 });
      const plinth = new THREE.Mesh(plinthGeo, plinthMat);
      plinth.position.y = 0.4;
      tankGroup.add(plinth);

      scene.add(tankGroup);
    });

    // ------------------------------------------------------------------
    // ZONE 2: CHEMICAL WAREHOUSE (Racks & Stacked 200L Drums)
    // ------------------------------------------------------------------
    createZoneBerm(-22, 0, 18, 24, 0x10b981);

    const warehouseGroup = new THREE.Group();
    warehouseGroup.position.set(-22, 0, 0);

    // Steel Storage Racks Structure (Uprights and cross beams)
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.3 });
    for (let rx = -6; rx <= 6; rx += 4) {
      for (let rz = -8; rz <= 8; rz += 8) {
        // Upright post
        const postGeo = new THREE.BoxGeometry(0.35, 12, 0.35);
        const post = new THREE.Mesh(postGeo, rackMat);
        post.position.set(rx, 6, rz);
        post.castShadow = true;
        warehouseGroup.add(post);
      }
    }

    // Horizontal Shelving Decks
    [3.5, 7.5, 11.5].forEach(shelfY => {
      const shelfGeo = new THREE.BoxGeometry(14, 0.2, 18);
      const shelfMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5 });
      const shelf = new THREE.Mesh(shelfGeo, shelfMat);
      shelf.position.set(0, shelfY, 0);
      shelf.receiveShadow = true;
      warehouseGroup.add(shelf);
    });

    // Stacked Chemical 200L Drums on shelves
    const drumColors = [0xef4444, 0x0284c7, 0xf59e0b, 0x10b981, 0x9333ea, 0x059669];
    const drumGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.6, 16);

    for (let shelfY of [0.8, 4.5, 8.5]) {
      for (let dx = -5; dx <= 5; dx += 2.2) {
        for (let dz = -6; dz <= 6; dz += 2.2) {
          const color = drumColors[Math.abs(Math.floor((dx * 3 + dz * 5 + shelfY) % drumColors.length))];
          const drumMat = new THREE.MeshStandardMaterial({
            color,
            metalness: 0.7,
            roughness: 0.35
          });
          const drum = new THREE.Mesh(drumGeo, drumMat);
          drum.position.set(dx, shelfY + 0.8, dz);
          drum.castShadow = true;
          drum.userData = { id: 'warehouse-racks' };
          warehouseGroup.add(drum);
          clickableMeshes.push(drum);
        }
      }
    }
    scene.add(warehouseGroup);

    // ------------------------------------------------------------------
    // ZONE 3: PROCESSING UNIT (5000L Jacketed Reactor & Distillation Column)
    // ------------------------------------------------------------------
    createZoneBerm(0, 2, 16, 18, 0x06b6d4);

    const reactorGroup = new THREE.Group();
    reactorGroup.position.set(0, 0, 2);

    // Support Mezzanine Platform
    const mezGeo = new THREE.BoxGeometry(10, 0.4, 10);
    const mezMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6, roughness: 0.4 });
    const mez = new THREE.Mesh(mezGeo, mezMat);
    mez.position.y = 5.5;
    mez.receiveShadow = true;
    reactorGroup.add(mez);

    // 4 Support Legs
    for (let lx of [-4.5, 4.5]) {
      for (let lz of [-4.5, 4.5]) {
        const legGeo = new THREE.CylinderGeometry(0.25, 0.25, 5.5, 8);
        const legMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(lx, 2.75, lz);
        reactorGroup.add(leg);
      }
    }

    // Jacketed Chemical Reactor Vessel R-301
    const rBodyGeo = new THREE.CylinderGeometry(2.2, 2.2, 5.5, 32);
    const rBodyMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.2
    });
    const reactorBody = new THREE.Mesh(rBodyGeo, rBodyMat);
    reactorBody.position.y = 6.0;
    reactorBody.castShadow = true;
    reactorBody.userData = { id: 'unit-reactor' };
    reactorGroup.add(reactorBody);
    clickableMeshes.push(reactorBody);

    // Reactor bottom dished head
    const rBottomGeo = new THREE.SphereGeometry(2.2, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const rBottom = new THREE.Mesh(rBottomGeo, rBodyMat);
    rBottom.position.y = 3.25;
    rBottom.userData = { id: 'unit-reactor' };
    reactorGroup.add(rBottom);
    clickableMeshes.push(rBottom);

    // Reactor top dome
    const rTopGeo = new THREE.SphereGeometry(2.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const rTop = new THREE.Mesh(rTopGeo, rBodyMat);
    rTop.position.y = 8.75;
    rTop.userData = { id: 'unit-reactor' };
    reactorGroup.add(rTop);
    clickableMeshes.push(rTop);

    // Motorized Agitator Drive Unit on top
    const motorGeo = new THREE.CylinderGeometry(0.6, 0.8, 2.0, 16);
    const motorMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6 });
    const motor = new THREE.Mesh(motorGeo, motorMat);
    motor.position.y = 11.5;
    reactorGroup.add(motor);

    // Distillation / Condenser Column next to reactor
    const colGeo = new THREE.CylinderGeometry(0.8, 0.8, 14, 24);
    const colMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.15 });
    const col = new THREE.Mesh(colGeo, colMat);
    col.position.set(3.2, 8.5, -2);
    col.castShadow = true;
    col.userData = { id: 'unit-reactor' };
    reactorGroup.add(col);
    clickableMeshes.push(col);

    // Connecting vapor pipe from reactor to column
    const pipeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 9.5, 0),
      new THREE.Vector3(1.5, 11, -1),
      new THREE.Vector3(3.2, 11, -2)
    ]);
    const pipeGeo = new THREE.TubeGeometry(pipeCurve, 20, 0.25, 8, false);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.4 });
    const pipeMesh = new THREE.Mesh(pipeGeo, pipeMat);
    reactorGroup.add(pipeMesh);

    scene.add(reactorGroup);

    // ------------------------------------------------------------------
    // ZONE 4: WASTEWATER TREATMENT PLANT (ETP) - 3 Interconnected Basins
    // ------------------------------------------------------------------
    createZoneBerm(24, 0, 18, 26, 0x10b981);

    const etpGroup = new THREE.Group();
    etpGroup.position.set(24, 0, 0);

    // Basin 1: Sulfide Oxidation (Rectangular Aeration Basin)
    const b1Geo = new THREE.BoxGeometry(12, 3.5, 9);
    const b1Mat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.3, roughness: 0.8 });
    const b1 = new THREE.Mesh(b1Geo, b1Mat);
    b1.position.set(0, 1.75, -8);
    b1.receiveShadow = true;
    b1.userData = { id: 'etp-sulfide' };
    etpGroup.add(b1);
    clickableMeshes.push(b1);

    // Basin 1 Liquid Surface (Dark effluent with aeration foam)
    const b1WaterGeo = new THREE.PlaneGeometry(11.2, 8.2);
    const b1WaterMat = new THREE.MeshStandardMaterial({
      color: 0x14532d,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x064e3b,
      emissiveIntensity: 0.4
    });
    const b1Water = new THREE.Mesh(b1WaterGeo, b1WaterMat);
    b1Water.rotation.x = -Math.PI / 2;
    b1Water.position.set(0, 3.2, -8);
    b1Water.userData = { id: 'etp-sulfide' };
    etpGroup.add(b1Water);
    clickableMeshes.push(b1Water);

    // Basin 2: Chrome Clarifier (Conical / Cylindrical Settling Tank)
    const b2Geo = new THREE.CylinderGeometry(5.0, 4.5, 4.0, 32);
    const b2Mat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.4, roughness: 0.7 });
    const b2 = new THREE.Mesh(b2Geo, b2Mat);
    b2.position.set(0, 2.0, 4);
    b2.receiveShadow = true;
    b2.userData = { id: 'etp-chrome' };
    etpGroup.add(b2);
    clickableMeshes.push(b2);

    // Chrome green water surface
    const b2WaterGeo = new THREE.CircleGeometry(4.8, 32);
    const b2WaterMat = new THREE.MeshStandardMaterial({
      color: 0x047857,
      roughness: 0.15,
      metalness: 0.85,
      emissive: 0x059669,
      emissiveIntensity: 0.3
    });
    const b2Water = new THREE.Mesh(b2WaterGeo, b2WaterMat);
    b2Water.rotation.x = -Math.PI / 2;
    b2Water.position.set(0, 3.8, 4);
    b2Water.userData = { id: 'etp-chrome' };
    etpGroup.add(b2Water);
    clickableMeshes.push(b2Water);

    // Central Agitator Bridge over Chrome Clarifier
    const bridgeGeo = new THREE.BoxGeometry(11, 0.4, 0.8);
    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 });
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge.position.set(0, 4.4, 4);
    etpGroup.add(bridge);

    scene.add(etpGroup);

    // ------------------------------------------------------------------
    // ZONE 5: EMERGENCY HUB & METEOROLOGICAL MONITORING MAST
    // ------------------------------------------------------------------
    createZoneBerm(-8, 28, 14, 12, 0xef4444);

    const emGroup = new THREE.Group();
    emGroup.position.set(-8, 0, 28);

    // Deluge Shower Tower
    const showerGeo = new THREE.CylinderGeometry(0.15, 0.15, 6, 8);
    const showerMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8 });
    const shower = new THREE.Mesh(showerGeo, showerMat);
    shower.position.set(0, 3, 0);
    shower.userData = { id: 'emergency-hub' };
    emGroup.add(shower);
    clickableMeshes.push(shower);

    // Shower head ring
    const sHeadGeo = new THREE.CylinderGeometry(0.8, 0.4, 0.4, 16);
    const sHeadMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.6 });
    const sHead = new THREE.Mesh(sHeadGeo, sHeadMat);
    sHead.position.set(0, 5.8, 0);
    sHead.userData = { id: 'emergency-hub' };
    emGroup.add(sHead);
    clickableMeshes.push(sHead);

    // Emergency Muster Plaque on Floor
    const signGeo = new THREE.BoxGeometry(4, 0.05, 4);
    const signMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.3 });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 0.25, 0);
    sign.userData = { id: 'emergency-hub' };
    emGroup.add(sign);
    clickableMeshes.push(sign);

    scene.add(emGroup);

    // Weather & VOC Monitoring Mast (Tall antenna tower with flashing beacon)
    const mastGroup = new THREE.Group();
    mastGroup.position.set(36, 0, 30);
    const mastGeo = new THREE.CylinderGeometry(0.2, 0.8, 28, 8);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.y = 14;
    mastGroup.add(mast);

    // Flashing Strobe Light on top
    const strobeGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const strobeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 2.0 });
    const strobe = new THREE.Mesh(strobeGeo, strobeMat);
    strobe.position.y = 28.5;
    mastGroup.add(strobe);
    scene.add(mastGroup);

    // ------------------------------------------------------------------
    // ANIMATED PARTICLES: VAPOR PLUME / STEAM
    // ------------------------------------------------------------------
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 4;
      particlePositions[i * 3 + 1] = 12 + Math.random() * 8;
      particlePositions[i * 3 + 2] = -14 + (Math.random() - 0.5) * 4;
      particleVelocities.push({
        vx: (Math.random() - 0.5) * 0.04,
        vy: 0.05 + Math.random() * 0.06,
        vz: 0.08 + Math.random() * 0.05
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.85,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    clickableMeshesRef.current = clickableMeshes;

    // ------------------------------------------------------------------
    // INTERACTION: MOUSE ROTATION & RAYCASTING
    // ------------------------------------------------------------------
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let currentTheta = Math.PI / 4;
    let currentPhi = Math.PI / 3.8;
    let currentRadius = 85;
    let cameraTarget = new THREE.Vector3(0, 4, 0);

    const updateCameraFromSpherical = () => {
      camera.position.x = cameraTarget.x + currentRadius * Math.sin(currentPhi) * Math.sin(currentTheta);
      camera.position.y = cameraTarget.y + currentRadius * Math.cos(currentPhi);
      camera.position.z = cameraTarget.z + currentRadius * Math.sin(currentPhi) * Math.cos(currentTheta);
      camera.lookAt(cameraTarget);
    };

    updateCameraFromSpherical();

    const onMouseDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;

        currentTheta -= deltaX * 0.007;
        currentPhi = Math.max(0.15, Math.min(Math.PI / 2.05, currentPhi - deltaY * 0.007));

        updateCameraFromSpherical();
        prevMousePos = { x: e.clientX, y: e.clientY };
      } else {
        // Raycast hover check
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickableMeshesRef.current, false);
        if (intersects.length > 0) {
          const hitObj = intersects[0].object;
          const matchedFacility = FACILITY_OBJECTS.find(f => f.id === hitObj.userData?.id);
          if (matchedFacility) {
            setHoveredUnit(matchedFacility);
            container.style.cursor = 'pointer';
          }
        } else {
          setHoveredUnit(null);
          container.style.cursor = 'grab';
        }
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      currentRadius = Math.max(18, Math.min(130, currentRadius + e.deltaY * 0.05));
      updateCameraFromSpherical();
    };

    const onClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableMeshesRef.current, false);
      if (intersects.length > 0) {
        const hitObj = intersects[0].object;
        const matchedFacility = FACILITY_OBJECTS.find(f => f.id === hitObj.userData?.id);
        if (matchedFacility) {
          setSelectedUnit(matchedFacility);
          setIsDrawerOpen(true);
        }
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('click', onClick);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // ------------------------------------------------------------------
    // ANIMATION LOOP
    // ------------------------------------------------------------------
    let clock = new THREE.Clock();

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Rotate Agitator Motor
      motor.rotation.y += delta * 3.5 * simulationSpeed;

      // Pulse Hazard Beacon Light
      strobeMat.emissiveIntensity = 1.0 + Math.sin(elapsed * 6) * 1.5;

      // Animated Vapor Plume
      if (showVaporPlume && particleGeo) {
        const positions = particleGeo.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] += particleVelocities[i].vy * simulationSpeed;
          positions[i * 3] += particleVelocities[i].vx * simulationSpeed;
          positions[i * 3 + 2] += particleVelocities[i].vz * simulationSpeed;

          // Recycle particles
          if (positions[i * 3 + 1] > 26) {
            positions[i * 3] = (Math.random() - 0.5) * 4;
            positions[i * 3 + 1] = 12;
            positions[i * 3 + 2] = -14 + (Math.random() - 0.5) * 4;
          }
        }
        particleGeo.attributes.position.needsUpdate = true;
      }

      // Smooth Camera LERP to preset target if active
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isNightMode, showVaporPlume, simulationSpeed]);

  // Handle Preset View Selection
  const applyPreset = (presetKey) => {
    setActivePreset(presetKey);
    const preset = CAMERA_PRESETS[presetKey];
    if (!preset || !cameraRef.current) return;

    const cam = cameraRef.current;
    cam.position.set(preset.cam[0], preset.cam[1], preset.cam[2]);
    cam.lookAt(new THREE.Vector3(...preset.target));

    // Also auto-select relevant facility unit
    if (presetKey === 'warehouse') {
      setSelectedUnit(FACILITY_OBJECTS.find(o => o.id === 'warehouse-racks'));
    } else if (presetKey === 'reactor') {
      setSelectedUnit(FACILITY_OBJECTS.find(o => o.id === 'unit-reactor'));
    } else if (presetKey === 'etp') {
      setSelectedUnit(FACILITY_OBJECTS.find(o => o.id === 'etp-sulfide'));
    } else if (presetKey === 'emergency') {
      setSelectedUnit(FACILITY_OBJECTS.find(o => o.id === 'emergency-hub'));
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-130px)] min-h-[680px] bg-[#050a0e] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      
      {/* TOP INDUSTRIAL SCADA HUD BAR */}
      <div className="absolute top-0 inset-x-0 z-20 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">DIGITAL TWIN LIVE SCADA</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              CHEM-SHIELD 3D Industrial Complex Twin
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono">
                Three.js WebGL Engine
              </span>
            </h2>
          </div>
        </div>

        {/* Camera Presets Selector */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 gap-1 overflow-x-auto max-w-full">
          {Object.entries(CAMERA_PRESETS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activePreset === key
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        {/* Toggles & Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowVaporPlume(!showVaporPlume)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition flex items-center gap-1.5 ${
              showVaporPlume
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title="Toggle atmospheric vapor dispersion plume"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Plume</span>
          </button>

          <button
            onClick={() => setIsNightMode(!isNightMode)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 transition"
          >
            {isNightMode ? 'Control Room (Dark)' : 'Daylight Mode'}
          </button>

          <button
            onClick={() => applyPreset('overview')}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            title="Reset Camera View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D CANVAS VIEWPORT */}
      <div 
        ref={mountRef} 
        className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing"
      />

      {/* FLOATING HOVER TOOLTIP */}
      {hoveredUnit && !isDrawerOpen && (
        <div className="absolute top-20 left-6 z-20 pointer-events-none bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 rounded-xl p-3 shadow-2xl text-xs space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="font-bold text-slate-100">{hoveredUnit.name}</span>
          </div>
          <p className="text-slate-400 font-mono text-[11px]">{hoveredUnit.hazardClass}</p>
          <div className="flex gap-2 text-slate-300 font-mono text-[10px]">
            <span>Temp: {hoveredUnit.temperature}</span>
            <span>•</span>
            <span>Level: {hoveredUnit.currentLevel}</span>
          </div>
          <p className="text-cyan-400 font-medium text-[10px] mt-1">Click to open full telemetry inspector</p>
        </div>
      )}

      {/* BOTTOM FLOATING CONTROLS & CAMERA GUIDE */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 flex items-center space-x-4">
        <div className="flex items-center space-x-1.5 font-mono">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Left Click + Drag: Rotate 360°</span>
        </div>
        <div className="hidden sm:flex items-center space-x-1.5 font-mono">
          <span>Scroll: Zoom In/Out</span>
        </div>
        <div className="hidden md:flex items-center space-x-1.5 font-mono">
          <span>Click Asset: Inspect Telemetry</span>
        </div>
      </div>

      {/* RIGHT SIDE INDUSTRIAL TELEMETRY DRAWER */}
      {isDrawerOpen && selectedUnit && (
        <div className="absolute top-16 right-4 bottom-4 w-96 max-w-[90vw] z-30 bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
          
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-start justify-between bg-slate-900/50">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold uppercase">
                  {selectedUnit.category}
                </span>
                <span className="text-xs font-mono text-slate-400">{selectedUnit.zone}</span>
              </div>
              <h3 className="font-bold text-slate-100 text-base mt-1 leading-tight">{selectedUnit.name}</h3>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            
            {/* Live Telemetry Sensor Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-mono text-[10px] block">VESSEL CAPACITY</span>
                <span className="text-sm font-bold text-slate-200 font-mono">{selectedUnit.capacity}</span>
                <span className="text-emerald-400 font-mono text-[10px] block mt-0.5">Fill: {selectedUnit.currentLevel}</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-mono text-[10px] block">CORE TEMPERATURE</span>
                <span className="text-sm font-bold text-amber-300 font-mono">{selectedUnit.temperature}</span>
                <span className="text-slate-400 font-mono text-[10px] block mt-0.5">Limit: &lt; 50.0 °C</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-mono text-[10px] block">OPERATING PRESSURE</span>
                <span className="text-sm font-bold text-cyan-300 font-mono">{selectedUnit.pressure}</span>
                <span className="text-slate-400 font-mono text-[10px] block mt-0.5">Relief Valve: 4.0 bar</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-mono text-[10px] block">SCADA HEALTH</span>
                <span className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {selectedUnit.status}
                </span>
                <span className="text-slate-500 font-mono text-[10px] block mt-0.5">Sampling: 2s</span>
              </div>
            </div>

            {/* Chemical & CAS Specifications */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/90 space-y-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Substance Specifications</span>
              <div className="flex justify-between items-center text-slate-300 font-mono">
                <span className="text-slate-500">Primary Chemical:</span>
                <span className="font-semibold text-slate-100">{selectedUnit.chemical}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 font-mono">
                <span className="text-slate-500">Formula / MW:</span>
                <span className="text-cyan-300 font-bold">{selectedUnit.formula}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 font-mono">
                <span className="text-slate-500">CAS Registry No:</span>
                <span className="text-amber-300 font-bold">{selectedUnit.cas}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 font-mono">
                <span className="text-slate-500">CAMEO Group:</span>
                <span className="text-slate-300">{selectedUnit.cameoGroup}</span>
              </div>
            </div>

            {/* Incompatibility Alerts */}
            {selectedUnit.incompatibleWith && selectedUnit.incompatibleWith.length > 0 && (
              <div className="bg-red-950/30 border border-red-500/40 p-3 rounded-xl space-y-2">
                <div className="flex items-center space-x-1.5 text-red-400 font-bold">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>Critical Incompatibilities (CAMEO Rules)</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Strict segregation required. Must never be co-stored or cross-piped with:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedUnit.incompatibleWith.map((incomp, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-red-900/60 border border-red-700/60 text-red-200 font-mono text-[10px]">
                      {incomp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description & Engineering Notes */}
            <div className="text-slate-400 text-[11px] leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-bold block mb-1">Asset Operational Summary</span>
              {selectedUnit.desc}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  if (onNavigate) onNavigate('compatibility');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center space-x-2 transition shadow-lg shadow-cyan-500/20"
              >
                <Sliders className="w-4 h-4" />
                <span>Simulate Incompatibility Reaction</span>
              </button>

              <button
                onClick={() => {
                  if (onNavigate) onNavigate('emergency');
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium flex items-center justify-center space-x-2 transition"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Trigger Emergency Drill on this Asset</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
