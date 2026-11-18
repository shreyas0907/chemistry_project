# PharmaEcoShield 🌿🛡️
### Chemical Reactivity, Environmental Impact Tracking & Green Pharmacy Management

**PharmaEcoShield** is an API-powered web platform designed for hospital pharmacies, compounding cleanrooms, and pharmaceutical R&D facilities. Built with an **Eco-Botanical Bento Dashboard** interface, it combines live chemical/drug data (PubChem PUG REST, openFDA, and US EPA CompTox) with a local NOAA CAMEO reactivity engine to prevent hazardous chemical interactions, evaluate multi-dimensional eco-toxicity (PBT Index), and route hazardous pharmaceutical waste safely.

---

## 🌟 Key Features

### 1. Eco-Botanical Bento Dashboard
- **Forest & Moss Palette:** Deep forest-slate background (`#08120E`), translucent moss-dark bento cards (`#0F1F19/85` with `backdrop-blur-md` and `border-emerald-500/15`).
- **Hero Green Pharmacy Score Gauge:** Top-left radial gauge tracking formulary eco-health (0–100) with dynamic eco-status tiers.
- **Segmented PBT Pill Bars:** 3-segment illuminated pill bars for **Persistence (P)**, **Bioaccumulation (B)**, and **Aquatic Toxicity (T)**.
- **Botanical Molecular Glow:** PubChem 2D chemical structure graphics styled with CSS filters so bonds glow in emerald-sage against the dark background.
- **Typography:** Headings in **Plus Jakarta Sans** and scientific data (formulas, CAS numbers, SMILES, MW) in **JetBrains Mono**.

### 2. Live API Integrations & Scientific Engines
- **PubChem PUG REST API:** Auto-fills Chemical Formula, Molecular Weight, Canonical SMILES, PubChem CID, 2D structure preview, and GHS hazard statements.
- **openFDA Drug Label API:** Fetches clinical monographs, extracting FDA Boxed Warnings and cleanroom compounding storage controls.
- **US EPA CompTox (CTX) API & Heuristic Estimator:** Predicts environmental fate, aquatic toxicity (LC50), and biodegradation half-lives (`VITE_EPA_COMPTOX_KEY`).
- **Local NOAA CAMEO Reactivity Engine:** Evaluates 16 NOAA chemical groups (*Acyl Halides, Halogenated Organics, Strong Oxidizers, Bases, Acids, Cytotoxics, etc.*) and detects violent exotherms, toxic gas evolution ($HCl, HCN, H_2S$), and deflagration hazards.

### 3. Interactive Modules
- **Smart "Add Custom Compound" Modal:** Live search with auto-fill from PubChem and openFDA, physical state, role, CAMEO groups, USP <800> class, and waste routing.
- **Interactive Compatibility & Waste Segregation Checker:** Select 2 or more compounds to analyze compounding or waste co-storage compatibility. Includes preset hazard demonstrations and an **interactive Heatmap Matrix Grid** for 3+ compounds.
- **Green Substitution Recommender:** Aligned with the **ACS GCI Pharmaceutical Roundtable** guide. Flags Red/hazardous solvents (e.g., DCM, Chloroform, Hexane) and suggests greener alternatives (Ethyl Acetate, 2-MeTHF, Cyrene) with LCA carbon savings and 1-click **"Adopt to Inventory"**.
- **Slide-Over Chemical Dossier Inspector:** Slide-out drawer with glowing 2D structures, PubChem CID links, PBT scores, and openFDA monographs.
- **Analytics & One-Click Compliance Export:** Recharts visualizations (Green Chemistry donut, Waste Stream bar charts, PBT spectrum) and 1-click export for **EPA RCRA CSV Waste Manifests** and **JSON Safety Dossiers**.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd chemproject

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack
- **Framework:** React 18, Vite 6
- **Styling:** Tailwind CSS (Dark Mode, Bento Grids, Glassmorphism)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Data & APIs:** PubChem PUG REST, openFDA, EPA CompTox, NOAA CAMEO Chemicals Matrix
- **Persistence:** LocalStorage

---

## 📄 Regulatory Standards Alignment
- **USP <800>:** Hazardous Drugs in Healthcare Settings (Antineoplastic containment & C-PEC handling).
- **EPA RCRA Subpart P:** Standards for Hazardous Waste Pharmaceuticals.
- **ICH Q3C (R8):** Impurities: Guideline for Residual Solvents.
- **NOAA CAMEO Chemicals:** Chemical Reactivity Matrix.

---

## 📜 License
MIT License.
