# NeuroLens — Project Progress

> Mandatory Disclaimer: **"NeuroLens is a research prototype for decision support only. It is not a medical device and must not be used for clinical diagnosis or treatment decisions."**

---

## Phase Tracking

- [x] **Phase 0 — Scaffold**
  - [x] Repository structure initialized (`docs/`, `ml/`, `backend/`, `frontend/`)
  - [x] Section 7.1 Core Contract defined (Pydantic schema + TypeScript types)
  - [x] Section 4.2 Internal label scheme and BraTS mapping functions + tests
  - [x] Synthetic study generator (`ml/scripts/make_synthetic_study.py`)
  - [x] Docker Compose (`docker-compose.yml`) + `.env.example`
  - [x] FastAPI skeleton (`backend/app/main.py`) with `/health`, `/version`, `/model-info`
  - [x] Next.js frontend shell with dark clinical theme, disclaimer, and layout
  - [x] Automated Phase 0 tests passing

- [x] **Phase 1 — Backend core + upload + fake pipeline**
  - [x] Auth & RBAC (JWT access/refresh tokens, doctor & admin roles)
  - [x] Pseudonymised Patient & Study management with safe UUID storage
  - [x] Automated sequence detection (`t1`, `t1ce`, `t2`, `flair`) and DICOM tag stripping
  - [x] Celery worker configuration & async job runner with multi-stage progress tracking (`qc` -> `segment` -> `measure` -> `classify` -> `retrieve`)
  - [x] `FAKE_MODEL=true` pipeline returning 100% compliant Section 7.1 AnalysisResult JSON
  - [x] End-to-end upload and analysis verification test suite green

- [x] **Phase 2 — Viewer + workspace UI (with fake results)**
  - [x] Multi-Planar Reconstruction (MPR) 3-plane viewer canvas (Axial, Coronal, Sagittal) with crosshair sync, window/level, and slice scrolling
  - [x] Sequence switcher (T1, T1ce, T2, FLAIR)
  - [x] Segmentation overlays with opacity slider & sub-region toggles (NCR, ED, ET)
  - [x] Research overlays: Uncertainty entropy heatmap, Grad-CAM, Intra-tumour Habitats
  - [x] Right-hand panels: Summary (Dual classification), Measurements (volumetric & RANO diameters), Explainability (Radiomics feature importance & Decision tree rules), Similar Cases (KNN retrieval)
  - [x] Interactive Mask Editor Toolbar (Brush, Eraser, Region Grow, Undo/Redo, Revert to AI, Save Mask v2)
  - [x] Triage Worklist (`/worklist`) with urgency score ranking and clinical badges
  - [x] Patient longitudinal timeline (`/patients/[id]`) with volumetric trends
  - [x] Study comparison page (`/studies/[id]/compare`) with RANO response criteria
  - [x] Structured report editor (`/reports/[id]`) with status workflow (`draft` -> `reviewed` -> `signed`)
  - [x] Cohort Insights page (`/insights`) with 2D PCA scatter and Section 6.11 comparison table
  - [x] Admin page (`/admin`) with compliance audit trail, user management, and model catalog

- [x] **Phase 3 — Real preprocessing + baseline segmentation + measurements**
  - [x] Preprocessing pipeline (reorient, resample, N4, normalisation, brain masking)
  - [x] Baseline 3D U-Net model & sliding-window inference
  - [x] Measurements module (volumes, diameters, RANO product, location, midline shift)
  - [x] DBSCAN lesion clustering (multifocality & noise suppression)

- [x] **Phase 4 — Classical ML module + classification**
  - [x] Radiomics feature extraction
  - [x] PCA dimensionality reduction
  - [x] Classical classifiers: SVM (RBF/linear), KNN, Random Forest, AdaBoost, Gradient Boosting, Naive Bayes, Logistic Regression, Stacking Ensemble
  - [x] Intra-tumour habitat clustering (K-Means & GMM with EM)
  - [x] OOD / QC anomaly detector (One-Class SVM / Isolation Forest)
  - [x] KNN similar-case retrieval index
  - [x] Benchmarking comparison table and honest evaluation in `docs/ML_REPORT.md`

- [x] **Phase 5 — Strong segmentation model + uncertainty + explainability**
  - [x] MONAI SwinUNETR / DynUNET architecture & training pipeline abstraction (`swinunetr.py`)
  - [x] Missing-modality robustness (`MissingModalityAdapter` zero-fill & dropout)
  - [x] MC-Dropout predictive entropy & automated needs-review logic (`UncertaintyEstimator`)
  - [x] 3D and slice-wise Grad-CAM explainability overlays (`GradCAM3D`)

- [x] **Phase 6 — Editing, longitudinal, reports, triage**
  - [x] Interactive 3D mask editing & versioning (`PUT /studies/{id}/mask` creates v2, preserves AI original)
  - [x] Longitudinal RANO-style change response & timeline tracking (`RANOEvaluator`, `POST /patients/{id}/compare`)
  - [x] Jinja2 + ReportLab structured clinical PDF report generation (`ReportService`, `GET /reports/{id}/pdf`)
  - [x] Decision Tree heuristic urgency rules & triage worklist (`GET /worklist`)

- [x] **Phase 7 — Insights, hardening, docs**
  - [x] Cohort Insights view with 2D PCA scatter and Section 6.11 comparison table (`GET /insights/cohort`)
  - [x] Audit log interface & security review (`GET /audit-log`)
  - [x] End-to-end integration and regression test coverage (24 passed, 1 skipped)
  - [x] Production build verification (`npm run build`: 9 static and dynamic routes compiled with 0 errors)
