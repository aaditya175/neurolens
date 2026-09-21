"""Integration tests for Phase 1: upload, pipeline execution, and Section 7.1 contract."""

import os
import uuid
import shutil
import tempfile
import pytest
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.core.database import init_db
from neurolens_ml.schemas.analysis import AnalysisResult
from ml.scripts.make_synthetic_study import generate_synthetic_study

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    import asyncio
    asyncio.run(init_db())


def test_full_phase1_workflow():
    # 1. Create Patient with unique code
    unique_code = f"PT-SYNTH-{uuid.uuid4().hex[:6].upper()}"
    patient_res = client.post(
        "/api/v1/patients",
        json={"code": unique_code, "age": 52, "sex": "M"},
    )
    assert patient_res.status_code == 200, patient_res.text
    patient_data = patient_res.json()
    patient_id = patient_data["id"]
    assert patient_data["code"] == unique_code

    # 2. Generate a small synthetic study for upload
    temp_dir = tempfile.mkdtemp()
    try:
        synth_meta = generate_synthetic_study(temp_dir, shape=(32, 32, 32), seed=42)
        paths = synth_meta["paths"]

        # 3. Upload Study multipart files
        with open(paths["t1"], "rb") as f_t1, \
             open(paths["t1ce"], "rb") as f_t1ce, \
             open(paths["t2"], "rb") as f_t2, \
             open(paths["flair"], "rb") as f_flair, \
             open(paths["mask"], "rb") as f_mask:

            files = [
                ("files", ("t1.nii.gz", f_t1, "application/gzip")),
                ("files", ("t1ce.nii.gz", f_t1ce, "application/gzip")),
                ("files", ("t2.nii.gz", f_t2, "application/gzip")),
                ("files", ("flair.nii.gz", f_flair, "application/gzip")),
                ("files", ("mask.nii.gz", f_mask, "application/gzip")),
            ]
            upload_res = client.post(
                "/api/v1/studies",
                data={"patient_id": patient_id},
                files=files,
            )

        assert upload_res.status_code == 200, upload_res.text
        upload_data = upload_res.json()
        study_id = upload_data["study_id"]
        assert upload_data["status"] == "uploaded"
        assert set(upload_data["sequences_detected"]) >= {"t1", "t1ce", "t2", "flair"}

        # 4. Trigger Analysis Job
        analyze_res = client.post(f"/api/v1/studies/{study_id}/analyze")
        assert analyze_res.status_code == 200, analyze_res.text
        job_data = analyze_res.json()
        job_id = job_data["id"]
        assert job_data["status"] in ("queued", "running", "done")

        # 5. Check Job Status
        job_check = client.get(f"/api/v1/jobs/{job_id}")
        assert job_check.status_code == 200
        status_data = job_check.json()
        assert status_data["status"] in ("running", "done")

        # 6. Fetch Analysis Result and Validate against Section 7.1 Pydantic Model
        analysis_res = client.get(f"/api/v1/studies/{study_id}/analysis")
        assert analysis_res.status_code == 200, analysis_res.text
        raw_result = analysis_res.json()

        # Validate with strict Pydantic parsing
        validated_contract = AnalysisResult.model_validate(raw_result)
        assert validated_contract.study_id == study_id
        assert validated_contract.qc.passed is True
        assert validated_contract.segmentation.regions["WT"].volume_ml > 0
        assert validated_contract.classification.ensemble.label in ("glioma", "meningioma", "pituitary", "metastasis")
        assert len(validated_contract.radiomics_top_features) > 0
        assert len(validated_contract.similar_cases) > 0

        # 7. Check Volume and Mask Retrieval Endpoints
        vol_res = client.get(f"/api/v1/studies/{study_id}/volume/t1")
        assert vol_res.status_code == 200
        assert vol_res.headers["content-type"] == "application/gzip"

        mask_res = client.get(f"/api/v1/studies/{study_id}/mask")
        assert mask_res.status_code == 200
        assert mask_res.headers["content-type"] == "application/gzip"

    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
