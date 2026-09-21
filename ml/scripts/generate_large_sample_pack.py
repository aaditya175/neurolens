#!/usr/bin/env python
"""Generate an extensive library of 30+ multi-sequence .nii.gz brain MRI test files.

Generates 30 realistic clinical cases (150 total .nii.gz files) across:
- Glioblastoma / High-Grade Glioma (Malignant)
- Low-Grade Infiltrative Glioma (Malignant)
- Dural Meningioma (Benign)
- Brain Metastases (Solitary & Multifocal, Malignant)
- Pituitary Adenoma (Benign)
- Vestibular Schwannoma / Acoustic Neuroma (Benign)
- Pediatric Posterior Fossa Astrocytoma (Malignant)
- Healthy Controls (Negative / Normal Controls)

Saves both:
1. Inside project: `test_samples/` (organized by patient folders + flat named files)
2. Desktop folder: `C:\\Users\\AADITYA CHAUHAN\\Desktop\\NeuroLens_Test_Scans` for instant drag-and-drop.
"""

import gzip
import os
import shutil
from pathlib import Path
from typing import Tuple, List, Dict
import numpy as np

try:
    import nibabel as nib
    HAS_NIBABEL = True
except ImportError:
    HAS_NIBABEL = False


def save_nii_gz(data: np.ndarray, file_path: Path, is_mask: bool = False):
    """Save 3D numpy array as a valid .nii.gz file using nibabel."""
    file_path.parent.mkdir(parents=True, exist_ok=True)
    affine = np.diag([1.0, 1.0, 1.0, 1.0])
    dtype = np.uint8 if is_mask else np.float32

    if HAS_NIBABEL:
        img = nib.Nifti1Image(data.astype(dtype), affine)
        nib.save(img, str(file_path))
    else:
        with gzip.open(file_path, "wb") as f:
            f.write(data.astype(dtype).tobytes())


def create_brain_volume(shape: Tuple[int, int, int]):
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
    flair[ventricle_mask] = 0.12

    # Edema (ED = 2)
    ed_idx = mask == 2
    t1[ed_idx] = 0.42
    t1ce[ed_idx] = 0.42
    t2[ed_idx] = 0.90
    flair[ed_idx] = 0.88

    # Enhancing Tumour (ET = 3)
    et_idx = mask == 3
    t1[et_idx] = 0.48
    t1ce[et_idx] = 1.00
    t2[et_idx] = 0.75
    flair[et_idx] = 0.80

    # Necrotic Core (NCR = 1)
    ncr_idx = mask == 1
    t1[ncr_idx] = 0.28
    t1ce[ncr_idx] = 0.28
    t2[ncr_idx] = 0.85
    flair[ncr_idx] = 0.65

    return t1, t1ce, t2, flair


def generate_all_samples():
    project_root = Path(__file__).resolve().parents[2]
    test_dir = project_root / "test_samples"
    flat_dir = test_dir / "flat_files_ready_to_upload"
    desktop_dir = Path("C:/Users/AADITYA CHAUHAN/Desktop/NeuroLens_Test_Scans")

    test_dir.mkdir(parents=True, exist_ok=True)
    flat_dir.mkdir(parents=True, exist_ok=True)
    desktop_dir.mkdir(parents=True, exist_ok=True)

    shape = (64, 64, 64)
    nx, ny, nz = shape
    z, y, x = np.ogrid[:nx, :ny, :nz]
    cx, cy, cz = nx / 2.0, ny / 2.0, nz / 2.0
    rng = np.random.default_rng(100)

    # 30 diverse clinical cases
    scenarios = [
        # --- GLIOMAS / GLIOBLASTOMAS (Malignant) ---
        {"id": "01", "type": "Glioma", "nature": "Malignant", "tag": "Right_Frontal_GBM",
         "lesions": [{"c": (cx + 8, cy - 6, cz + 3), "r_ed": 12, "r_et": 7, "r_ncr": 4}]},
        {"id": "02", "type": "Glioma", "nature": "Malignant", "tag": "Left_Temporal_GBM",
         "lesions": [{"c": (cx - 10, cy - 4, cz - 4), "r_ed": 14, "r_et": 8, "r_ncr": 4.5}]},
        {"id": "03", "type": "Glioma", "nature": "Malignant", "tag": "Frontal_Diffuse_LGG",
         "lesions": [{"c": (cx - 7, cy + 8, cz + 4), "r_ed": 9, "r_et": 0, "r_ncr": 0}]},
        {"id": "04", "type": "Glioma", "nature": "Malignant", "tag": "Bilateral_Butterfly_GBM",
         "lesions": [{"c": (cx, cy + 2, cz + 4), "r_ed": 16, "r_et": 9, "r_ncr": 5}]},
        {"id": "05", "type": "Glioma", "nature": "Malignant", "tag": "Parietal_Oligodendroglioma",
         "lesions": [{"c": (cx + 9, cy - 8, cz + 8), "r_ed": 10, "r_et": 5, "r_ncr": 2}]},
        {"id": "06", "type": "Glioma", "nature": "Malignant", "tag": "Occipital_HighGrade",
         "lesions": [{"c": (cx - 6, cy - 12, cz + 2), "r_ed": 11, "r_et": 6, "r_ncr": 3}]},
        {"id": "07", "type": "Glioma", "nature": "Malignant", "tag": "Massive_GBM_Emergency_Shift",
         "lesions": [{"c": (cx + 10, cy - 4, cz + 2), "r_ed": 18, "r_et": 11, "r_ncr": 7}]},
        {"id": "08", "type": "Glioma", "nature": "Malignant", "tag": "Recurrent_GBM_Post_Radiation",
         "lesions": [{"c": (cx + 8, cy - 5, cz + 3), "r_ed": 15, "r_et": 9, "r_ncr": 5}]},

        # --- MENINGIOMAS (Benign) ---
        {"id": "09", "type": "Meningioma", "nature": "Benign", "tag": "Parasagittal_Convexity",
         "lesions": [{"c": (cx + 4, cy + 12, cz + 10), "r_ed": 4, "r_et": 7, "r_ncr": 0}]},
        {"id": "10", "type": "Meningioma", "nature": "Benign", "tag": "Sphenoid_Wing",
         "lesions": [{"c": (cx - 12, cy + 5, cz - 4), "r_ed": 3, "r_et": 6, "r_ncr": 0}]},
        {"id": "11", "type": "Meningioma", "nature": "Benign", "tag": "Olfactory_Groove",
         "lesions": [{"c": (cx, cy + 14, cz - 6), "r_ed": 4, "r_et": 6.5, "r_ncr": 0}]},
        {"id": "12", "type": "Meningioma", "nature": "Benign", "tag": "Small_Incidental_4mL",
         "lesions": [{"c": (cx + 11, cy + 7, cz + 8), "r_ed": 0, "r_et": 4, "r_ncr": 0}]},
        {"id": "13", "type": "Meningioma", "nature": "Benign", "tag": "Posterior_Fossa_Tentorial",
         "lesions": [{"c": (cx - 8, cy - 14, cz - 6), "r_ed": 3, "r_et": 5.5, "r_ncr": 0}]},
        {"id": "14", "type": "Meningioma", "nature": "Benign", "tag": "Falcine_Deep_Meningioma",
         "lesions": [{"c": (cx, cy, cz + 11), "r_ed": 2, "r_et": 6, "r_ncr": 0}]},

        # --- BRAIN METASTASES (Malignant) ---
        {"id": "15", "type": "Metastasis", "nature": "Malignant", "tag": "Solitary_Lung_Met",
         "lesions": [{"c": (cx - 10, cy + 4, cz + 2), "r_ed": 8, "r_et": 4.5, "r_ncr": 2}]},
        {"id": "16", "type": "Metastasis", "nature": "Malignant", "tag": "Dual_Breast_Mets",
         "lesions": [
             {"c": (cx - 10, cy + 5, cz), "r_ed": 6, "r_et": 3.5, "r_ncr": 1.5},
             {"c": (cx + 9, cy - 7, cz + 5), "r_ed": 5, "r_et": 3.0, "r_ncr": 0},
         ]},
        {"id": "17", "type": "Metastasis", "nature": "Malignant", "tag": "Triple_Melanoma_Mets",
         "lesions": [
             {"c": (cx - 11, cy + 6, cz), "r_ed": 5, "r_et": 3.5, "r_ncr": 1.5},
             {"c": (cx + 10, cy - 8, cz + 5), "r_ed": 5, "r_et": 3.0, "r_ncr": 0},
             {"c": (cx + 3, cy + 10, cz - 7), "r_ed": 4, "r_et": 2.5, "r_ncr": 0},
         ]},
        {"id": "18", "type": "Metastasis", "nature": "Malignant", "tag": "Miliary_5_Nodules",
         "lesions": [
             {"c": (cx - 11, cy + 5, cz + 3), "r_ed": 3.5, "r_et": 2.5, "r_ncr": 0},
             {"c": (cx + 9, cy - 7, cz + 5), "r_ed": 3.5, "r_et": 2.5, "r_ncr": 0},
             {"c": (cx + 5, cy + 10, cz - 6), "r_ed": 3.0, "r_et": 2.0, "r_ncr": 0},
             {"c": (cx - 7, cy - 9, cz - 5), "r_ed": 3.0, "r_et": 2.0, "r_ncr": 0},
             {"c": (cx + 11, cy + 4, cz - 2), "r_ed": 3.0, "r_et": 2.0, "r_ncr": 0},
         ]},
        {"id": "19", "type": "Metastasis", "nature": "Malignant", "tag": "Hemorrhagic_Renal_Met",
         "lesions": [{"c": (cx + 8, cy - 10, cz + 4), "r_ed": 9, "r_et": 5, "r_ncr": 2.5}]},

        # --- PITUITARY ADENOMAS (Benign) ---
        {"id": "20", "type": "Pituitary", "nature": "Benign", "tag": "Sellar_Macroadenoma",
         "lesions": [{"c": (cx, cy - 9, cz - 11), "r_ed": 2, "r_et": 6, "r_ncr": 0}]},
        {"id": "21", "type": "Pituitary", "nature": "Benign", "tag": "Suprasellar_Extension",
         "lesions": [{"c": (cx, cy - 7, cz - 9), "r_ed": 2, "r_et": 7, "r_ncr": 0}]},
        {"id": "22", "type": "Pituitary", "nature": "Benign", "tag": "Microadenoma_3mL",
         "lesions": [{"c": (cx + 2, cy - 9, cz - 11), "r_ed": 0, "r_et": 3.5, "r_ncr": 0}]},
        {"id": "23", "type": "Pituitary", "nature": "Benign", "tag": "Nonfunctioning_Adenoma",
         "lesions": [{"c": (cx - 1, cy - 8, cz - 10), "r_ed": 1.5, "r_et": 5.5, "r_ncr": 0}]},

        # --- SCHWANNOMAS / OTHER (Benign & Pediatric) ---
        {"id": "24", "type": "Schwannoma", "nature": "Benign", "tag": "Left_Acoustic_Neuroma_CPA",
         "lesions": [{"c": (cx - 12, cy - 10, cz - 9), "r_ed": 2.5, "r_et": 5, "r_ncr": 0}]},
        {"id": "25", "type": "Schwannoma", "nature": "Benign", "tag": "Right_Acoustic_Neuroma_CPA",
         "lesions": [{"c": (cx + 12, cy - 10, cz - 9), "r_ed": 2.5, "r_et": 5, "r_ncr": 0}]},
        {"id": "26", "type": "Neurocytoma", "nature": "Benign", "tag": "Intraventricular_Monro",
         "lesions": [{"c": (cx + 1, cy + 1, cz + 1), "r_ed": 1.5, "r_et": 4.8, "r_ncr": 0}]},
        {"id": "27", "type": "Astrocytoma", "nature": "Malignant", "tag": "Cerebellar_Cystic_MuralNodule",
         "lesions": [{"c": (cx - 6, cy - 14, cz - 8), "r_ed": 7, "r_et": 3.5, "r_ncr": 4.5}]},
        {"id": "28", "type": "Ependymoma", "nature": "Malignant", "tag": "Fourth_Ventricle_Infratentorial",
         "lesions": [{"c": (cx, cy - 12, cz - 9), "r_ed": 4, "r_et": 5, "r_ncr": 1.5}]},

        # --- NORMAL HEALTHY CONTROLS (Negative Controls) ---
        {"id": "29", "type": "HealthyControl", "nature": "Normal Brain", "tag": "Adult_Healthy_Control_1", "lesions": []},
        {"id": "30", "type": "HealthyControl", "nature": "Normal Brain", "tag": "Adult_Healthy_Control_2", "lesions": []},
    ]

    manifest = []
    print(f"Generating {len(scenarios)} clinical test scan packs (150 .nii.gz files)...")

    for sc in scenarios:
        case_name = f"Patient_{sc['id']}_{sc['type']}_{sc['nature'].replace(' ', '_')}_{sc['tag']}"
        case_dir = test_dir / case_name
        desktop_case_dir = desktop_dir / case_name
        case_dir.mkdir(parents=True, exist_ok=True)
        desktop_case_dir.mkdir(parents=True, exist_ok=True)

        brain_mask, ventricle_mask = create_brain_volume(shape)
        mask = np.zeros(shape, dtype=np.uint8)

        for les in sc["lesions"]:
            lcx, lcy, lcz = les["c"]
            dist = np.sqrt((x - lcx) ** 2 + (y - lcy) ** 2 + (z - lcz) ** 2)
            if les["r_ed"] > 0:
                mask[(dist <= les["r_ed"]) & brain_mask] = 2
            if les["r_et"] > 0:
                mask[(dist <= les["r_et"]) & brain_mask] = 3
            if les["r_ncr"] > 0:
                mask[(dist <= les["r_ncr"]) & brain_mask] = 1

        t1, t1ce, t2, flair = synthesize_modalities(shape, brain_mask, ventricle_mask, mask, rng)

        # 1. Save standard names inside patient subfolder
        save_nii_gz(t1, case_dir / "t1.nii.gz")
        save_nii_gz(t1ce, case_dir / "t1ce.nii.gz")
        save_nii_gz(t2, case_dir / "t2.nii.gz")
        save_nii_gz(flair, case_dir / "flair.nii.gz")
        save_nii_gz(mask, case_dir / "mask.nii.gz", is_mask=True)

        # 2. Copy to desktop folder for easy drag and drop
        save_nii_gz(t1, desktop_case_dir / "t1.nii.gz")
        save_nii_gz(t1ce, desktop_case_dir / "t1ce.nii.gz")
        save_nii_gz(t2, desktop_case_dir / "t2.nii.gz")
        save_nii_gz(flair, desktop_case_dir / "flair.nii.gz")
        save_nii_gz(mask, desktop_case_dir / "mask.nii.gz", is_mask=True)

        # 3. Save flat-named files in flat_files_ready_to_upload
        flat_prefix = f"Patient_{sc['id']}_{sc['type']}"
        save_nii_gz(t1, flat_dir / f"{flat_prefix}_T1.nii.gz")
        save_nii_gz(t1ce, flat_dir / f"{flat_prefix}_T1ce.nii.gz")
        save_nii_gz(t2, flat_dir / f"{flat_prefix}_T2.nii.gz")
        save_nii_gz(flair, flat_dir / f"{flat_prefix}_FLAIR.nii.gz")

        # Copy flat named files directly to Desktop root for instant selection
        save_nii_gz(t1, desktop_dir / f"{flat_prefix}_T1.nii.gz")
        save_nii_gz(t1ce, desktop_dir / f"{flat_prefix}_T1ce.nii.gz")
        save_nii_gz(t2, desktop_dir / f"{flat_prefix}_T2.nii.gz")
        save_nii_gz(flair, desktop_dir / f"{flat_prefix}_FLAIR.nii.gz")

        wt_count = int(np.sum(mask > 0))
        et_count = int(np.sum(mask == 3))
        manifest.append({
            "id": sc["id"],
            "name": case_name,
            "type": sc["type"],
            "nature": sc["nature"],
            "wt_voxels": wt_count,
            "et_voxels": et_count,
        })
        print(f"  [OK] Generated Case {sc['id']}: {sc['type']} ({sc['nature']}) - WT: {wt_count} voxels")

    # Generate Index README
    readme_path = test_dir / "TEST_FILES_INDEX.md"
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write("# NeuroLens Test Scan Library (30 Patients / 150 .nii.gz Files)\n\n")
        f.write("All files are standard NIfTI-1 (.nii.gz) compatible with MONAI, ITK-SNAP, 3D Slicer, and NeuroLens upload.\n\n")
        f.write("### Quick Access Locations:\n")
        f.write(f"1. **Desktop Folder**: `C:\\Users\\AADITYA CHAUHAN\\Desktop\\NeuroLens_Test_Scans` (Ready for 1-click drag & drop)\n")
        f.write(f"2. **Project Folder**: `{test_dir}`\n")
        f.write(f"3. **Flat Files Folder**: `{flat_dir}`\n\n")
        f.write("| Case | Tumour Type | Classification Nature | Whole Tumour Voxels | T1 / T1ce / T2 / FLAIR |\n")
        f.write("|---|---|---|---|---|\n")
        for m in manifest:
            f.write(f"| Patient {m['id']} | **{m['type']}** | **{m['nature']}** | {m['wt_voxels']} | 4 files (.nii.gz) |\n")

    # Also copy README to desktop folder
    shutil.copy(readme_path, desktop_dir / "TEST_FILES_INDEX.md")
    print(f"\nSUCCESS! 30 clinical cases generated:")
    print(f" -> Desktop: {desktop_dir}")
    print(f" -> Project: {test_dir}")
    print(f" -> Flat Files: {flat_dir}")


if __name__ == "__main__":
    generate_all_samples()
