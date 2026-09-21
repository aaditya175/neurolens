# NeuroLens — Architecture & Engineering Decisions Log

> Mandatory Disclaimer: **"NeuroLens is a research prototype for decision support only. It is not a medical device and must not be used for clinical diagnosis or treatment decisions."**

---

## Decision 001: Project Layout & Monorepo Structure
- **Date**: 2026-09-21
- **Status**: Accepted
- **Context**: The project combines deep learning (PyTorch, MONAI), classical ML (scikit-learn, pyradiomics), backend APIs (FastAPI, Celery, SQLAlchemy 2), and a modern frontend (Next.js App Router).
- **Decision**: Put `ml/`, `backend/`, `frontend/`, `docs/`, and container orchestration (`docker-compose.yml`) directly in the workspace root. `backend` worker will import `neurolens_ml` directly as a local module or package.
- **Consequences**: Easy cross-referencing, shared schemas, unified development workflow.

---

## Decision 002: Core Contract Strict Typing (Section 7.1)
- **Date**: 2026-09-21
- **Status**: Accepted
- **Context**: Disconnection between ML pipeline outputs, backend endpoints, and frontend components can cause silent serialization and rendering bugs.
- **Decision**: Define the single source of truth using Pydantic v2 schemas in `ml/src/neurolens_ml/schemas/analysis.py` (mirrored in `backend/app/schemas/analysis.py`) and equivalent TypeScript interfaces in `frontend/lib/types/analysis.ts`. Any field change must update both sides.
- **Consequences**: Strong type guarantees across the entire stack.

---

## Decision 003: Label Standardization (Section 4.2)
- **Date**: 2026-09-21
- **Status**: Accepted
- **Context**: Different BraTS iterations use varying label conventions (e.g. BraTS 2021 uses 1 for NCR, 2 for ED, 4 for ET, while older or other datasets may use 3 for ET).
- **Decision**: Standardize internally to:
  - `0`: Background
  - `1`: Necrotic / non-enhancing core (NCR)
  - `2`: Peritumoural edema (ED)
  - `3`: Enhancing tumour (ET)
  - Composite masks: `WT = {1, 2, 3}`, `TC = {1, 3}`, `ET = {3}`.
  Provide deterministic mapping adapters with unit tests for each dataset format.
- **Consequences**: Segmentation models and measurement logic never need dataset-specific conditional branches.

---

## Decision 004: FAKE_MODEL Execution & Synthetic Study Generator
- **Date**: 2026-09-21
- **Status**: Accepted
- **Context**: The system must be fully runnable and testable on CPU-only machines, CI pipelines, and before model training finishes.
- **Decision**: Provide `ml/scripts/make_synthetic_study.py` to create anatomically plausible 4-sequence NIfTI studies with geometric simulated lesions, and provide a `FAKE_MODEL=true` switch that returns fully compliant Section 7.1 analysis results in milliseconds.
- **Consequences**: Zero blocker for frontend and backend API development while heavy ML training proceeds.
