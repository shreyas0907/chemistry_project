# ChemAssist 🛡️⚗️
### Smart Chemical Inventory • Safer Waste Management • Chemical Intelligence

[![Live Production Site](https://img.shields.io/badge/Live%20Demo-chem--shield--platform.netlify.app-10B981?style=for-the-badge&logo=netlify)](https://chem-shield-platform.netlify.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/shreyas0907/chemistry_project)

**Live Production Deployment:** [https://chem-shield-platform.netlify.app](https://chem-shield-platform.netlify.app)

**ChemAssist** is a clean, modern, scientifically reliable, and fully functional industrial chemical safety platform designed to assist industrial facilities with chemical inventory management, QR-based tracking, regulatory chemical waste segregation (Leather, Pharma, Cosmetics), and verified chemical compatibility prediction.

The platform identifies incompatible chemical substances before they come into contact, evaluates their thermodynamic and toxicological hazards, recommends safe segregation distances, and provides scientifically authoritative safety information across four high-hazard processing industries.

---

## 🎯 Target Industries & Safety Domains

### 1. Leather Tanning and Processing
- **Critical Industrial Hazard Focus:** Prevention of accidental acidification of sulfide-containing streams ($Na_2S + H_2SO_4 \to H_2S$), which releases lethal, rapid-acting, asphyxiating Hydrogen Sulfide gas.
- **Chromium Safety:** Segregation of Basic Chromium Sulfate from strong oxidizing agents ($H_2O_2, NaClO$) to prevent conversion of trivalent chromium $Cr(III)$ into carcinogenic hexavalent chromium $Cr(VI)$.
- **ETP Wastewater Architecture:** Mandatory 3-pipe segregated drainage separating Sulfide Liming Effluent ($MnSO_4$ catalytic oxidation at $pH \ge 10$), Chrome Tanning Liquors ($MgO$ closed-loop precipitation at $pH \approx 8.5$), and Acidic Deliming/Pickle liquors.

### 2. Pharmaceutical Manufacturing
- **Organic Solvent Safety:** Storage segregation of flammable solvents, halogenated extraction solvents (DCM, chloroform), and reactive drying reagents.
- **API & USP <800> Hazardous Drugs:** Strict isolation of cytotoxic antineoplastics, teratogens, and potent APIs requiring negative pressure C-PEC storage.
- **Active Hydride / Moisture-Reactives:** Isolation of Sodium Borohydride ($NaBH_4$) and Lithium Aluminum Hydride from water and protic solvents to prevent explosive $H_2$ gas evolution.
- **Green Solvent Substitutions:** Replacement of toxic, persistent chlorinated solvents with ACS GCI-recommended bio-derived alternatives (Ethyl Acetate, 2-MeTHF, Cyrene, CPME).

### 3. Cosmetics and Personal Care Manufacturing
- **Storage vs. Formulation Distinction:** Resolves the critical difference between *emulsion formulation compatibility* and *bulk warehouse storage incompatibility*. While mild organic acids and surfactants are combined in dilutive cosmetic batches, concentrated bulk 35% $H_2O_2$ stored next to volatile fragrance terpenes (e.g., Limonene, Linalool) or caustics presents an extreme auto-oxidation and runaway deflagration fire risk.
- **Peroxide & Fragrance Safety:** Dedicated cold-storage containment for concentrated hydrogen peroxide and hair developer bases away from flammable fragrances and reducers.
- **Preservatives & Surfactants:** Monitoring sensitization thresholds, dermal toxicity, and aquatic bioaccumulation of quaternary ammonium compounds and parabens.

### 4. General Chemical Processing & Warehousing
- **Universal NFPA 400 & OSHA 1910.1200 Storage Classes:** Automated compliance checking against standard industrial separation distance rules (e.g., 20 ft or 1-hour fire-rated wall between flammable liquids and strong oxidizers).
- **Secondary Containment Bunding:** German AwSV WGK calculations determining 10%, 100%, and 110% bund capacities for hazardous storage bays.

---

## 🌟 Core System Modules

### 1. Command Center Dashboard
- **Live Inventory KPIs:** Total registered chemicals, high-hazard substances (NFPA Level 3+ / Red Eco), active storage bays, and total inventory mass ($kg/L$).
- **Interactive Recharts Visualizations:** Real-time Industry Risk Distribution (Total vs High Risk) and Waste Stream Allocation Breakdown.
- **Active Storage Bay Alarms:** Instant notification feed displaying real-time co-storage violations detected across warehouse bays.
- **System Activity & Audit Trail:** Chronological log of formulary updates, QR scans, and compatibility checks.

### 2. Multi-Chemical Compatibility Engine
- **Search Capabilities:** Instant search across the facility inventory and live PubChem database by **Chemical Name**, **CAS Registry Number**, or **Molecular Formula**.
- **Pairwise & Multi-Chemical Matrix:** Evaluates up to $N$ chemicals simultaneously, generating pairwise hazard assessments and a multi-dimensional Heatmap Matrix Grid for 3+ selected chemicals.
- **Rigorous 4-Tier Assessment:**
  - 🟢 **GREEN (Compatible):** Safe under verified standard conditions.
  - 🟡 **AMBER (Conditional Compatibility):** Caution required; potential mild exotherm or requires temperature/pH regulation.
  - 🔴 **RED (Incompatible / Hazardous):** Severe reaction risk (toxic gas release, fire, explosion, corrosive mist).
  - ⚪ **UNKNOWN / INSUFFICIENT DATA:** Adheres to the **Scientific Precautionary Principle**—never assumes missing data implies safety.
- **Detailed Interaction Dossiers:** Displays verified CAS numbers, specific reaction mechanisms, balanced chemical equations (e.g., $Na_2S + H_2SO_4 \to H_2S\uparrow + Na_2SO_4$), authoritative citations (NOAA CAMEO / NIOSH), confidence levels, preventive actions, and mandatory PPE.

### 3. Smart Chemical Inventory & Container QR Codes
- **Comprehensive Chemical Registry:** Tracks Name, Formula, CAS RN, Molecular Weight, Industry Sector, Physical State, Quantity, Storage Bay, Storage Class, Expiry Date, SDS Reference, and GHS Pictograms.
- **Container QR Code Generation (`qrcode.react`):** Generates high-definition, printable SVG QR labels adhering to OSHA HazCom 2012 / GHS drum container standards.
- **Live "Scan & Audit Storage Bay" Simulator:** Simulates scanning an incoming container at a storage bay door and instantly audits the local bay inventory for co-storage conflicts, warning operators before drums are placed inside!

### 4. Industrial Segregation & Bay Audit System
- **Automated Bay Conflict Detector:** Automatically detects co-storage violations within warehouse bays (e.g., Bay 1 storing both concentrated pickling acids and sodium sulfide flakes).
- **NFPA 400 Separation Distance Matrix:** Reference guide specifying mandatory physical buffer distances and fire barriers between storage classes (Acids vs Bases, Flammables vs Oxidizers, Water-Reactives).
- **Dedicated Waste Drum Routing:** Color-coded segregation guidelines for industrial waste drums (Halogenated, Non-Halogenated, Aqueous Acids, Heavy Metal / Chrome Sludges, Sulfide Oxidation Sumps).

### 5. Educational Industrial Accident Simulator
- **Visual Kinetic Scrubbers:** Interactive 4-stage chronological disaster simulations:
  - *Tannery Sulfide-Acid Inadvertent Mixing ($H_2S$ liberation disaster)*
  - *Pharmaceutical Acyl Halide Overpressure ($HCl$ vapor runaway)*
  - *Cosmetics Peroxide Auto-Oxidation with Fragrance Terpenes*
- **Live Simulated Physical Gauges:** Real-time readouts for Core Reaction Temperature (°C), Vessel Pressure (bar), and Lethal Gas Concentration (ppm).
- **Post-Incident Analysis:** Detailed root cause identification, corrective OSHA/EPA engineering controls, and standard operating procedures (SOPs).

### 6. AI Safety Assistant (Copilot)
- **Factual Retrieval Foundation:** Grounded exclusively in NOAA CAMEO reactivity profiles, PubChem chemical identity, and industrial SDS guidelines.
- **Authoritative Citations:** Cites NOAA CAMEO, NIOSH Pocket Guide, OSHA 1910.1200, and EPA regulations.
- **Scientific Humility & Disclaimer:** Clearly communicates data boundaries and enforces mandatory consultation of manufacturer SDS and certified Industrial Hygienists before handling unlisted compounds.

### 7. Environmental Impact & Green Chemistry Platform
- **PBT Hazard Profiler:** REACH Annex XIII screening for Persistence (P), Bioaccumulation (B), and Aquatic Toxicity (T) with illuminated segmented pill bars.
- **German AwSV Water Hazard Framework:** Categorizes substances into WGK 1 (Low hazard), WGK 2 (Water hazardous), and WGK 3 (Severely hazardous) with calculated secondary containment bunding requirements.
- **4-Stream ETP Architecture:** Engineering specifications for separating Sulfide Oxidation, Chrome Closed-Loop Recovery, Solvent Isolation, and General Equalization effluent streams.
- **ACS GCI Green Solvent Substitutions:** Direct replacement profiles for toxic chlorinated and volatile solvents (e.g., DCM &rarr; Ethyl Acetate / 2-MeTHF / CPME) with LCA carbon savings and 1-click **"Adopt into Active Inventory"**.

### 8. Scientific & Regulatory Report Generator
- **5 Comprehensive Report Types:**
  1. *Chemical Inventory Audit Manifest*
  2. *Reactivity & Compatibility Assessment Dossier*
  3. *High-Hazard Alerts & Bay Violations Log*
  4. *NFPA 400 Storage Segregation & Waste Routing Report*
  5. *Environmental Impact & PBT ETP Profile*
- **Export Capabilities:** 1-Click CSV export and styled printable view for OSHA, EPA, and environmental regulatory inspections.

---

## 🏗️ Technical Architecture & Data Integrations

```
chemproject/
├── src/
│   ├── components/
│   │   ├── AccidentSimulator.jsx         # 4-stage kinetic industrial disaster simulator
│   │   ├── AddCompoundModal.jsx          # Live chemical registration with PubChem auto-fill
│   │   ├── AiSafetyAssistant.jsx         # Factual chemical safety copilot with CAMEO citations
│   │   ├── CompatibilityChecker.jsx      # Pairwise & matrix multi-chemical compatibility checker
│   │   ├── CompoundDetailModal.jsx       # Slide-over chemical dossier with glowing 2D structures
│   │   ├── ContainerQrModal.jsx          # OSHA drum label QR generator & live bay conflict auditor
│   │   ├── DashboardOverview.jsx         # Command center KPIs, Recharts graphs & active alerts
│   │   ├── EnvironmentalModule.jsx       # PBT spectrum, German WGK classes & ETP stream guide
│   │   ├── IndustryModules.jsx           # Deep-dives for Leather, Pharma, Cosmetics, and General
│   │   ├── InventoryManager.jsx          # Chemical registry with filters, quick edits & bay routing
│   │   ├── Navbar.jsx                    # Industrial SaaS header with live alert indicators
│   │   ├── PbtPillBar.jsx                # Segmented illuminated pill bar for PBT ratings
│   │   ├── ReportGeneratorModal.jsx      # 5 report types, CSV generator & print format
│   │   └── SegregationSystem.jsx         # Automated bay conflict detector & NFPA 400 matrix
│   ├── data/
│   │   ├── cameoRules.json               # NOAA CAMEO reactivity groups & industrial reaction rules
│   │   ├── greenSubstitutions.js         # ACS GCI green solvent database & LCA carbon savings
│   │   └── industryChemicals.js          # 18+ verified chemicals spanning all 4 industries
│   ├── services/
│   │   ├── chemicalSafetyEngine.js       # Core compatibility, bay audit & PubChem API engine
│   │   └── pharmaApi.js                  # PubChem PUG REST, openFDA & EPA CompTox connectors
│   ├── App.jsx                           # Root layout, tab switcher & LocalStorage persistence
│   └── index.css                         # Eco-Botanical Bento theme & dark forest styles
├── package.json
└── README.md
```

### Data Sources & Verified APIs
- **PubChem PUG REST API:** Live molecular formulas, weights, canonical SMILES, CIDs, and 2D SVG/PNG structures.
- **NOAA CAMEO Chemicals Reactivity Matrix:** 16 reactive functional groups and verified binary reactivity pairs.
- **US EPA CompTox (CTX) API & Heuristics:** Environmental degradation rates and aquatic toxicity.
- **openFDA Drug Label API:** Boxed warnings, USP monograph excerpts, and handling controls.
- **German Federal Water Act (AwSV / VwVwS):** Official Wassergefährdungsklassen (WGK) criteria.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher (or yarn / pnpm)

### Local Setup
```bash
# 1. Clone repository
git clone https://github.com/shreyas0907/chemistry_project.git
cd chemproject

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will launch at `http://localhost:5173`.

### Production Build & Preview
```bash
# Compile optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📜 Regulatory Standards & Safety Codes
- **OSHA 29 CFR 1910.1200:** Hazard Communication Standard (GHS Pictograms & SDS).
- **NFPA 400:** Hazardous Materials Code (Storage separation distances and secondary containment).
- **EPA 40 CFR Part 261 / RCRA Subpart P:** Hazardous Waste Identification and Management.
- **USP <800>:** Hazardous Drugs—Handling in Healthcare & Pharmaceutical Settings.
- **AwSV (Verordnung über Anlagen zum Umgang mit wassergefährdenden Stoffen):** German Water Hazard Ordinance.
- **ACS Green Chemistry Institute (GCI):** Pharmaceutical Roundtable Solvent Selection Guide.

---

## ⚖️ Scientific & Safety Disclaimer
*ChemAssist is an industrial safety decision-support tool. It is designed to assist chemical safety engineers, plant managers, and environmental officers in identifying hazards and verifying storage arrangements. The platform does not replace official Safety Data Sheets (SDS), facility-specific hazard evaluations, or the counsel of certified Industrial Hygienists (CIH) and licensed Chemical Engineers.*

---

## 📄 License
Released under the MIT License. Copyright © 2024–2026 ChemAssist Contributors.
