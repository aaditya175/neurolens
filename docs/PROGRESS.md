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

- [ ] **Phase 5 — Strong segmentation model + uncertainty + explainability**
  - [ ] MONAI SwinUNETR / DynUNET training pipeline
  - [ ] Missing-modality robustness
  - [ ] MC-Dropout predictive entropy & needs-review logic
  - [ ] 3D Grad-CAM explainability overlays

- [ ] **Phase 6 — Editing, longitudinal, reports, triage**
  - [ ] Interactive 3D mask editing & versioning
  - [ ] Longitudinal registration & RANO-style change response
  - [ ] Jinja2 + WeasyPrint structured PDF report generation
  - [ ] Decision Tree heuristic urgency rules

- [ ] **Phase 7 — Insights, hardening, docs**
  - [ ] Cohort Insights view (PCA scatter, dendrogram)
  - [ ] Audit log interface & security review
  - [ ] Final documentation & model cards
