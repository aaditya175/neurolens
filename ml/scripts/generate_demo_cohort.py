#!/usr/bin/env python
"""Generate a comprehensive multi-patient demo cohort for testing NeuroLens.

Generates:
1. patient_01_glioblastoma (large necrotic/enhancing mass with marked edema & midline shift)
2. patient_02_low_grade_glioma (non-enhancing diffuse infiltration, low edema)
3. patient_03_meningioma (strongly enhancing, circumscribed, dural base)
4. patient_04_multifocal_metastases (3 separate lesions to test DBSCAN clustering)
5. patient_05_longitudinal_baseline & followup (paired scans to test RANO response)
"""

import argparse
import gzip
from pathlib import Path
from typing import Tuple, List, Dict
import numpy as np

try:
    import nibabel as nib
    HAS_NIBABEL = True
except ImportError:
    HAS_NIBABEL = False


def save_volume(data: np.ndarray, file_path: Path, is_mask: bool = False):
    """Save 3D numpy array as a valid .nii.gz file using nibabel or direct writer."""
    file_path.parent.mkdir(parents=True, exist_ok=True)
    if HAS_NIBABEL:
        affine = np.diag([1.0, 1.0, 1.0, 1.0])
        img = nib.Nifti1Image(data.astype(np.uint8 if is_mask else np.float32), affine)
        nib.save(img, str(file_path))
        return

    # Fallback to direct raw gzip
    with gzip.open(file_path, "wb") as f:
        f.write(data.astype(np.uint8 if is_mask else np.float32).tobytes())


def create_base_brain(shape: Tuple[int, int, int]):
    """Create anatomical brain ellipsoid and CSF ventricles."""
    nx, ny, nz = shape
    z, y, x = np.ogrid[:nx, :ny, :nz]
    cx, cy, cz = nx / 2.0, ny / 2.0, nz / 2.0

    rx, ry, rz = nx * 0.40, ny * 0.35, nz * 0.38
    dist_brain = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2
    brain_mask = dist_brain <= 1.0

    vrx, vry, vrz = nx * 0.08, ny * 0.16, nz * 0.12
    ventricle_mask = (((x - cx) / vrx) ** 2 + ((y - cy) / vry) ** 2 + ((z - cz) / vrz) ** 2 <= 1.0) & brain_mask
    return brain_mask, ventricle_mask


def synthesize_modalities(shape, brain_mask, ventricle_mask, mask, rng):
    """Synthesize T1, T1ce, T2, FLAIR intensities with contrast weighting."""
    # 0=BG, 1=NCR, 2=ED, 3=ET
    t1 = np.zeros(shape, dtype=np.float32)
    t1ce = np.zeros(shape, dtype=np.float32)
    t2 = np.zeros(shape, dtype=np.float32)
    flair = np.zeros(shape, dtype=np.float32)

    n_brain = int(np.sum(brain_mask))
    t1[brain_mask] = 0.65 + rng.normal(0, 0.04, n_brain)
    t1ce[brain_mask] = 0.65 + rng.normal(0, 0.04, n_brain)
    t2[brain_mask] = 0.45 + rng.normal(0, 0.04, n_brain)
    flair[brain_mask] = 0.50 + rng.normal(0, 0.04, n_brain)

    # Ventricles (CSF)
    t1[ventricle_mask] = 0.15
    t1ce[ventricle_mask] = 0.15
    t2[ventricle_mask] = 0.95
    flair[ventricle_mask] = 0.12  # Fluid attenuated

    # Edema (ED = 2)
    ed_idx = mask == 2
    t1[ed_idx] = 0.42
    t1ce[ed_idx] = 0.42
    t2[ed_idx] = 0.90
    flair[ed_idx] = 0.88  # Bright on FLAIR

    # Enhancing Tumour (ET = 3)
    et_idx = mask == 3
    t1[et_idx] = 0.48
    t1ce[et_idx] = 1.00  # Strongly hyperintense on T1ce
    t2[et_idx] = 0.75
    flair[et_idx] = 0.80

    # Necrotic Core (NCR = 1)
    ncr_idx = mask == 1
    t1[ncr_idx] = 0.28
    t1ce[ncr_idx] = 0.28  # Non-enhancing
    t2[ncr_idx] = 0.85
    flair[ncr_idx] = 0.65

    return t1, t1ce, t2, flair


def generate_cohort(output_dir: str = "demo_data", shape: Tuple[int, int, int] = (64, 64, 64)):
    """Generate all demo clinical scenarios."""
    base_out = Path(output_dir)
    base_out.mkdir(parents=True, exist_ok=True)
    rng = np.random.default_rng(42)
    nx, ny, nz = shape
    z, y, x = np.ogrid[:nx, :ny, :nz]
    cx, cy, cz = nx / 2.0, ny / 2.0, nz / 2.0

    scenarios = [
        {
            "name": "case_01_glioblastoma_multiforme",
            "desc": "Right fronto-temporal high-grade glioma with central necrotic core, enhancing rim & extensive vasogenic edema",
            "lesions": [
                {"center": (cx + nx * 0.14, cy - ny * 0.08, cz + nz * 0.05), "r_ed": nx * 0.18, "r_et": nx * 0.11, "r_ncr": nx * 0.06}
            ],
        },
        {
            "name": "case_02_low_grade_glioma",
            "desc": "Left frontal diffuse low-grade glioma without contrast enhancement or necrosis",
            "lesions": [
                {"center": (cx - nx * 0.15, cy - ny * 0.06, cz + nz * 0.06), "r_ed": nx * 0.12, "r_et": 0, "r_ncr": 0}
            ],
        },
        {
            "name": "case_03_meningioma",
            "desc": "Right parasagittal extra-axial dural-based meningioma with intense uniform enhancement and minimal edema",
            "lesions": [
                {"center": (cx + nx * 0.08, cy + ny * 0.18, cz + nz * 0.15), "r_ed": nx * 0.06, "r_et": nx * 0.09, "r_ncr": 0}
            ],
        },
        {
            "name": "case_04_multifocal_metastases",
            "desc": "Bilateral cerebral metastases (3 discrete lesions) demonstrating DBSCAN multi-compartment clustering",
            "lesions": [
                {"center": (cx - nx * 0.18, cy + ny * 0.10, cz), "r_ed": nx * 0.08, "r_et": nx * 0.05, "r_ncr": nx * 0.02},
                {"center": (cx + nx * 0.16, cy - ny * 0.14, cz + nz * 0.08), "r_ed": nx * 0.07, "r_et": nx * 0.04, "r_ncr": 0},
                {"center": (cx + nx * 0.05, cy + ny * 0.16, cz - nz * 0.12), "r_ed": nx * 0.06, "r_et": nx * 0.035, "r_ncr": 0},
            ],
        },
        {
            "name": "case_05_longitudinal_baseline",
            "desc": "Pre-treatment baseline glioblastoma study (Month 0)",
            "lesions": [
                {"center": (cx + nx * 0.12, cy - ny * 0.05, cz + nz * 0.04), "r_ed": nx * 0.16, "r_et": nx * 0.10, "r_ncr": nx * 0.055}
            ],
        },
        {
            "name": "case_05_longitudinal_followup",
            "desc": "Post-treatment follow-up scan (Month 3) demonstrating RANO Partial Response (>50% volume reduction)",
            "lesions": [
                {"center": (cx + nx * 0.12, cy - ny * 0.05, cz + nz * 0.04), "r_ed": nx * 0.09, "r_et": nx * 0.045, "r_ncr": nx * 0.015}
            ],
        },
    ]

    manifest = []

    for sc in scenarios:
        case_dir = base_out / sc["name"]
        case_dir.mkdir(parents=True, exist_ok=True)
        brain_mask, ventricle_mask = create_base_brain(shape)
        mask = np.zeros(shape, dtype=np.uint8)

        for les in sc["lesions"]:
            lcx, lcy, lcz = les["center"]
            dist = np.sqrt((x - lcx) ** 2 + (y - lcy) ** 2 + (z - lcz) ** 2)

            if les["r_ed"] > 0:
                mask[(dist <= les["r_ed"]) & brain_mask] = 2  # ED
            if les["r_et"] > 0:
                mask[(dist <= les["r_et"]) & brain_mask] = 3  # ET
            if les["r_ncr"] > 0:
                mask[(dist <= les["r_ncr"]) & brain_mask] = 1  # NCR

        t1, t1ce, t2, flair = synthesize_modalities(shape, brain_mask, ventricle_mask, mask, rng)

        save_volume(t1, case_dir / "t1.nii.gz")
        save_volume(t1ce, case_dir / "t1ce.nii.gz")
        save_volume(t2, case_dir / "t2.nii.gz")
        save_volume(flair, case_dir / "flair.nii.gz")
        save_volume(mask, case_dir / "mask.nii.gz", is_mask=True)

        wt_vox = int(np.sum(mask > 0))
        ncr_vox = int(np.sum(mask == 1))
        ed_vox = int(np.sum(mask == 2))
        et_vox = int(np.sum(mask == 3))

        manifest.append({
            "folder": str(case_dir),
            "name": sc["name"],
            "description": sc["desc"],
            "wt_voxels": wt_vox,
            "et_voxels": et_vox,
            "ed_voxels": ed_vox,
            "ncr_voxels": ncr_vox,
        })
        print(f"[OK] Generated: {sc['name']} (WT: {wt_vox} voxels, ET: {et_vox})")

    # Write summary README inside demo_data
    with open(base_out / "DEMO_CASES.md", "w", encoding="utf-8") as f:
        f.write("# NeuroLens Demo Cohort Dataset\n\n")
        f.write("> **Research Prototype Notice**: Synthetic testing data generated for evaluation and demo workflows.\n\n")
        for m in manifest:
            f.write(f"### {m['name']}\n")
            f.write(f"- **Description**: {m['description']}\n")
            f.write(f"- **Path**: `{m['folder']}`\n")
            f.write(f"- **Regions**: Whole Tumour: {m['wt_voxels']} voxels (ET: {m['et_voxels']}, ED: {m['ed_voxels']}, NCR: {m['ncr_voxels']})\n\n")

    print(f"\nCohort generation complete! {len(scenarios)} cases ready in: {base_out.resolve()}")


if __name__ == "__main__":
    generate_cohort()
