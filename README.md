# NeuroLens — Brain Tumour Analysis Workspace

> **MANDATORY DISCLAIMER**  
> *"NeuroLens is a research prototype for decision support only. It is not a medical device and must not be used for clinical diagnosis or treatment decisions."*

---

## 1. Overview
**NeuroLens** is an advanced clinical decision-support research workspace for multi-sequence brain MRI (T1, T1ce, T2, FLAIR). Rather than a simple binary classifier, it provides a comprehensive diagnostic workflow designed for radiological review:

1. **Multi-Sequence 3D Ingestion**: Ingests T1, T1ce, T2, and FLAIR studies with automated de-identification.
2. **3D Sub-Region Segmentation**: Delineates Whole Tumour (WT), Tumour Core (TC), Enhancing Tumour (ET), Necrotic Core (NCR), and Peritumoural Edema (ED).
3. **Automated Measurements**: Voxel-accurate volumetric analysis (mL), 2D axial RANO-style bidimensional products, anatomical location, and midline shift estimation.
4. **Dual Model Inference**: Real-time cross-evaluation between deep CNN predictions and classical radiomics models (SVM, Random Forest), flagging discrepancies.
5. **Explainability & Uncertainty**: Grad-CAM heatmaps, voxel-wise MC-dropout predictive entropy maps, and automatic "Needs Human Review" alerts.
6. **Interactive MPR 3D Viewer**: Multi-planar reconstruction (axial, coronal, sagittal) with mask opacity, brush/eraser mask editing, and version control.
7. **Longitudinal Analysis**: Co-registration of follow-up scans with baseline scans, percentage volume delta calculation, and rule-based RANO response suggestions.
8. **Similar Case Retrieval**: KNN case retrieval in radiomics PCA embedding space.
9. **Structured Clinical Reporting**: Templated and editable findings exported to high-fidelity PDF via WeasyPrint.
10. **Triage Worklist**: Urgency ranking powered by decision-tree rules on volumetric load and mass effect.

---

## 2. Tech Stack
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Lucide icons, Recharts, Zustand, NiiVue / Cornerstone3D.
- **Backend API**: FastAPI, Pydantic v2, SQLAlchemy 2, Alembic, PostgreSQL.
- **Async Workers**: Celery + Redis.
- **Deep Learning**: PyTorch, MONAI (3D U-Net, SwinUNETR).
- **Classical Machine Learning**: scikit-learn, SciPy, pyradiomics (DBSCAN, SVM, K-Means, GMM, PCA, KNN, Random Forest, AdaBoost, Decision Tree).
- **Containerization**: Docker Compose (`frontend`, `api`, `worker`, `redis`, `postgres`).

---

## 3. Quick Start (Local Development)

### 3.1 Environment Configuration
```bash
cp .env.example .env
```

### 3.2 Running via Docker Compose
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API Docs: `http://localhost:8000/docs`

### 3.3 Running Locally without Docker (Development Mode)
```bash
# 1. Setup ML / Backend environment
python -m venv .venv
# Activate virtualenv (Windows: .venv\Scripts\activate, Linux/Mac: source .venv/bin/activate)
pip install -r backend/requirements.txt
pip install -e ml/

# 2. Run Backend API
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload

# 3. Run Frontend
cd frontend
npm install
npm run dev
```

---

## 4. Mumbai University ML Syllabus Integration
NeuroLens implements core classical ML algorithms with clinical purpose:
- **DBSCAN**: Post-processing voxel clusters to measure multifocality (metastases) and eliminate noise.
- **Support Vector Machines (SVC)**: High-dimensional radiomics classification with calibrated margins.
- **K-Means & Gaussian Mixture Models (EM)**: Intra-tumour habitat identification (hypoxic core, viable rim).
- **Principal Component Analysis (PCA)**: Radiomics dimensionality reduction and 2D cohort visualization.
- **K-Nearest Neighbours (KNN)**: Content-based image and patient case retrieval.
- **Random Forest & Boosting**: Tree ensembles with feature importance ranking.
- **Decision Trees**: Rule-based explainable triage urgency ranking.

---

## 5. Documentation
- [Progress Log](docs/PROGRESS.md)
- [Architectural Decisions](docs/DECISIONS.md)
- [API Reference](docs/API.md)
- [Machine Learning Report](docs/ML_REPORT.md)
- [Privacy & De-Identification Policy](docs/PRIVACY.md)
