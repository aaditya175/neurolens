"""Comprehensive End-to-End Integration Tests for Phase 5, 6, and 7.

Tests:
1. Mask versioning & doctor revision (PUT /studies/{id}/mask)
2. Predictive uncertainty & habitat maps (GET /studies/{id}/uncertainty-map, /habitat-map)
3. 2D/3D Grad-CAM heatmap extraction (GET /studies/{id}/gradcam/{slice})
4. KNN similar cases retrieval (GET /studies/{id}/similar)
5. Clinical report workflow (POST /studies/{id}/report -> PUT /reports/{id} -> GET /reports/{id}/pdf)
6. Longitudinal RANO evaluation (POST /patients/{id}/compare, GET /patients/{id}/timeline)
7. Triage worklist ranking (GET /worklist)
8. Cohort insights & 2D PCA (GET /insights/cohort)
9. Compliance audit trail (GET /audit-log)
"""

import io
import uuid
from pathlib import Path
import pytest
from httpx import AsyncClient, ASGITransport

from backend.app.main import app
from backend.app.core.database import init_db
from ml.scripts.make_synthetic_study import generate_synthetic_study


@pytest.mark.asyncio
async def test_phases_5_6_7_comprehensive_workflow(tmp_path):
    await init_db()
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        uid = str(uuid.uuid4())[:6]

        email = f"dr.fullflow.{uid}@hospital.org"
        password = "StrongPassword123!"
        reg_resp = await client.post(
            "/api/v1/auth/register",
            json={
                "email": email,
                "password": password,
                "role": "doctor",
            },
        )
        assert reg_resp.status_code in [200, 201]

        login_resp = await client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": password},
        )
        assert login_resp.status_code == 200
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. Create Patient
        patient_code = f"PT-E2E-{uid}"
        pat_resp = await client.post(
            "/api/v1/patients",
            json={"code": patient_code, "age": 58, "sex": "M"},
            headers=headers,
        )
        assert pat_resp.status_code in [200, 201]
        patient_id = pat_resp.json()["id"]

        # 3. Create Baseline Study
        study_dir_1 = tmp_path / "study1"
        synth_meta_1 = generate_synthetic_study(output_dir=str(study_dir_1), shape=(32, 32, 32))
        paths_1 = synth_meta_1["paths"]

        upload_files_1 = []
        for seq in ["t1", "t1ce", "t2", "flair", "mask"]:
            p = Path(paths_1[seq])
            upload_files_1.append(("files", (p.name, open(p, "rb").read(), "application/gzip")))

        up_resp_1 = await client.post(
            "/api/v1/studies",
            data={"patient_id": patient_id},
            files=upload_files_1,
            headers=headers,
        )
        assert up_resp_1.status_code == 200
        study_id_1 = up_resp_1.json()["study_id"]

        # Run Analysis for Study 1
        an_resp_1 = await client.post(f"/api/v1/studies/{study_id_1}/analyze", headers=headers)
        assert an_resp_1.status_code == 200

        # Wait briefly for synchronous background completion
        import asyncio
        for _ in range(25):
            chk = await client.get(f"/api/v1/studies/{study_id_1}/analysis", headers=headers)
            if chk.status_code == 200:
                break
            await asyncio.sleep(0.2)
        assert chk.status_code == 200

        # 4. Test Phase 5: Uncertainty & Explainability Endpoints
        # 4a. Predictive uncertainty map
        uncert_resp = await client.get(f"/api/v1/studies/{study_id_1}/uncertainty-map", headers=headers)
        assert uncert_resp.status_code == 200
        assert len(uncert_resp.content) > 100

        # 4b. Intra-tumour habitat map
        hab_resp = await client.get(f"/api/v1/studies/{study_id_1}/habitat-map", headers=headers)
        assert hab_resp.status_code == 200
        assert len(hab_resp.content) > 100

        # 4c. 2D Grad-CAM slice extraction
        cam_resp = await client.get(f"/api/v1/studies/{study_id_1}/gradcam/16", headers=headers)
        assert cam_resp.status_code == 200
        cam_json = cam_resp.json()
        assert cam_json["study_id"] == study_id_1
        assert cam_json["slice"] == 16
        assert len(cam_json["values"]) > 0

        # 4d. Similar cases
        sim_resp = await client.get(f"/api/v1/studies/{study_id_1}/similar?k=3", headers=headers)
        assert sim_resp.status_code == 200
        sim_json = sim_resp.json()
        assert len(sim_json["similar_cases"]) > 0

        # 5. Test Phase 6: Mask Versioning & Doctor Edit (PUT /studies/{id}/mask)
        mask_edit_resp = await client.put(
            f"/api/v1/studies/{study_id_1}/mask",
            headers=headers,
        )
        assert mask_edit_resp.status_code == 200
        assert mask_edit_resp.json()["mask_version"] == 2
        assert mask_edit_resp.json()["source"] == "doctor"

        # 6. Test Phase 6: Clinical Report Generation & Signing
        rep_gen_resp = await client.post(
            f"/api/v1/studies/{study_id_1}/report",
            json={"impression": "Confirmed fronto-temporal glioma with extensive peritumoural edema."},
            headers=headers,
        )
        assert rep_gen_resp.status_code == 200
        report_id = rep_gen_resp.json()["id"]

        # Sign report
        rep_sign_resp = await client.put(
            f"/api/v1/reports/{report_id}",
            json={"status": "signed", "impression": "Reviewed and electronically signed by Senior Radiologist."},
            headers=headers,
        )
        assert rep_sign_resp.status_code == 200
        assert rep_sign_resp.json()["status"] == "signed"

        # Download Report PDF
        pdf_resp = await client.get(f"/api/v1/reports/{report_id}/pdf", headers=headers)
        assert pdf_resp.status_code == 200
        assert pdf_resp.content.startswith(b"%PDF-")
        assert len(pdf_resp.content) > 1000

        # 7. Test Phase 6: Longitudinal Follow-up Study & RANO Comparison
        study_dir_2 = tmp_path / "study2"
        synth_meta_2 = generate_synthetic_study(output_dir=str(study_dir_2), shape=(32, 32, 32))
        paths_2 = synth_meta_2["paths"]
        upload_files_2 = []
        for seq in ["t1", "t1ce", "t2", "flair", "mask"]:
            p = Path(paths_2[seq])
            upload_files_2.append(("files", (p.name, open(p, "rb").read(), "application/gzip")))

        up_resp_2 = await client.post(
            "/api/v1/studies",
            data={"patient_id": patient_id},
            files=upload_files_2,
            headers=headers,
        )
        assert up_resp_2.status_code == 200
        study_id_2 = up_resp_2.json()["study_id"]

        await client.post(f"/api/v1/studies/{study_id_2}/analyze", headers=headers)
        for _ in range(25):
            chk2 = await client.get(f"/api/v1/studies/{study_id_2}/analysis", headers=headers)
            if chk2.status_code == 200:
                break
            await asyncio.sleep(0.2)
        assert chk2.status_code == 200

        # Compare Baseline and Follow-up
        comp_resp = await client.post(
            f"/api/v1/patients/{patient_id}/compare",
            json={"baseline_study_id": study_id_1, "followup_study_id": study_id_2},
            headers=headers,
        )
        assert comp_resp.status_code == 200
        comp_json = comp_resp.json()
        assert "rano_suggestion" in comp_json
        assert comp_json["rano_suggestion"] in ["complete_response", "partial_response", "stable_disease", "progressive_disease"]

        # Patient Volumetric Timeline
        timeline_resp = await client.get(f"/api/v1/patients/{patient_id}/timeline", headers=headers)
        assert timeline_resp.status_code == 200
        assert len(timeline_resp.json()["data_points"]) >= 2

        # 8. Test Triage Worklist
        worklist_resp = await client.get("/api/v1/worklist", headers=headers)
        assert worklist_resp.status_code == 200
        worklist_data = worklist_resp.json()
        assert len(worklist_data) >= 2
        # Verify descending order by urgency score
        scores = [item["urgency_score"] for item in worklist_data]
        assert scores == sorted(scores, reverse=True)

        # 9. Test Phase 7: Insights & Audit Trail
        insights_resp = await client.get("/api/v1/insights/cohort", headers=headers)
        assert insights_resp.status_code == 200
        ins_json = insights_resp.json()
        assert len(ins_json["cohort_points"]) > 0
        assert len(ins_json["benchmark_table"]) >= 10

        audit_resp = await client.get("/api/v1/audit-log", headers=headers)
        assert audit_resp.status_code == 200
        assert len(audit_resp.json()) > 0
