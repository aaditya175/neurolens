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

- [ ] **Phase 1 — Backend core + upload + fake pipeline**
  - [ ] Auth & RBAC (JWT, doctor/admin roles)
  - [ ] Patient & Study CRUD with DICOM de-identification
  - [ ] Celery job worker with progress stages
  - [ ] `FAKE_MODEL=true` end-to-end integration

- [ ] **Phase 2 — Viewer + workspace UI (with fake results)**
  - [ ] Multi-Planar Reconstruction (MPR) viewer
  - [ ] Sequence switcher (T1, T1ce, T2, FLAIR)
  - [ ] Segmentation overlay with opacity & region toggles
  - [ ] Right-hand panels: Summary, Measurements, Explain, Similar Cases
  - [ ] Triage Worklist and Upload UI

- [ ] **Phase 3 — Real preprocessing + baseline segmentation + measurements**
  - [ ] Preprocessing pipeline (reorient, resample, N4, normalisation, brain masking)
  - [ ] Baseline 3D U-Net model & sliding-window inference
  - [ ] Measurements module (volumes, diameters, RANO product, location, midline shift)
  - [ ] DBSCAN lesion clustering (multifocality & noise suppression)

- [ ] **Phase 4 — Classical ML module + classification**
  - [ ] Radiomics feature extraction
  - [ ] PCA dimensionality reduction
  - [ ] Classical classifiers: SVM (RBF/linear), KNN, Random Forest, AdaBoost, Gradient Boosting, Naive Bayes, Logistic Regression
  - [ ] Intra-tumour habitat clustering (K-Means & GMM with EM)
  - [ ] OOD / QC anomaly detector (One-Class SVM / Isolation Forest)
  - [ ] KNN similar-case retrieval index
  - [ ] Benchmarking comparison table in `docs/ML_REPORT.md`

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
