#!/usr/bin/env python
"""Generate synthetic 4-sequence brain MRI studies with multi-compartment tumours.

Produces:
- t1.nii.gz
- t1ce.nii.gz
- t2.nii.gz
- flair.nii.gz
- mask.nii.gz (ground truth with internal labels 0=BG, 1=NCR, 2=ED, 3=ET)

Can be executed standalone:
  python make_synthetic_study.py --output-dir ./synthetic_study --size 96
"""

import argparse
import gzip
import os
import struct
from pathlib import Path
from typing import Tuple
import numpy as np

# Try importing nibabel, fallback to pure python NIfTI-1 writer
try:
    import nibabel as nib
    HAS_NIBABEL = True
except ImportError:
    HAS_NIBABEL = False


def write_nifti1(data: np.ndarray, file_path: str, affine: np.ndarray = None, is_mask: bool = False):
    """Write 3D numpy array as a valid .nii.gz file using nibabel or direct NIfTI-1 binary."""
    if affine is None:
        affine = np.diag([1.0, 1.0, 1.0, 1.0])

    if HAS_NIBABEL:
        img = nib.Nifti1Image(data.astype(np.uint8 if is_mask else np.float32), affine)
        nib.save(img, file_path)
        return

    # Fallback: direct NIfTI-1 binary format writer
    data = np.ascontiguousarray(data)
    nx, ny, nz = data.shape
    dtype = np.uint8 if is_mask else np.float32
    raw_data = data.astype(dtype).tobytes(order='F')

    # Build 348-byte NIfTI-1 header
    # struct fmt: sizeof_hdr(i) data_type(10s) db_name(18s) extents(i) session_error(h) regular(c) dim_info(b)
    # dim(8h) intent_p1(f) intent_p2(f) intent_p3(f) intent_code(h) datatype(h) bitpix(h) slice_start(h)
    # pixdim(8f) vox_offset(f) scl_slope(f) scl_inter(f) slice_end(h) slice_code(b) xyzt_units(b)
    # cal_max(f) cal_min(f) slice_duration(f) toffset(f) glmax(i) glmin(i) descrip(80s) aux_file(24s)
    # qform_code(h) sform_code(h) quatern_b(f) quatern_c(f) quatern_d(f) qoffset_x(f) qoffset_y(f) qoffset_z(f)
    # srow_x(4f) srow_y(4f) srow_z(4f) intent_name(16s) magic(4s)
    datatype_code = 2 if is_mask else 16  # 2 = DT_UINT8, 16 = DT_FLOAT32
    bitpix = 8 if is_mask else 32
    dim = [3, nx, ny, nz, 1, 1, 1, 1]
    pixdim = [-1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0]

    hdr = bytearray(348)
    struct.pack_into('<i', hdr, 0, 348)  # sizeof_hdr
    struct.pack_into('<8h', hdr, 40, *dim)  # dim
    struct.pack_into('<h', hdr, 70, datatype_code)  # datatype
    struct.pack_into('<h', hdr, 72, bitpix)  # bitpix
    struct.pack_into('<8f', hdr, 76, *pixdim)  # pixdim
    struct.pack_into('<f', hdr, 108, 352.0)  # vox_offset
    struct.pack_into('<f', hdr, 112, 1.0)  # scl_slope
    struct.pack_into('<f', hdr, 116, 0.0)  # scl_inter
    struct.pack_into('<b', hdr, 123, 2)  # xyzt_units (mm)
    struct.pack_into('<80s', hdr, 148, b'NeuroLens Synthetic Volume')
    struct.pack_into('<h', hdr, 252, 1)  # qform_code (scanner anat)
    struct.pack_into('<h', hdr, 254, 1)  # sform_code (scanner anat)
    # srow affine:
    struct.pack_into('<4f', hdr, 280, float(affine[0, 0]), float(affine[0, 1]), float(affine[0, 2]), float(affine[0, 3]))
    struct.pack_into('<4f', hdr, 296, float(affine[1, 0]), float(affine[1, 1]), float(affine[1, 2]), float(affine[1, 3]))
    struct.pack_into('<4f', hdr, 312, float(affine[2, 0]), float(affine[2, 1]), float(affine[2, 2]), float(affine[2, 3]))
    struct.pack_into('<4s', hdr, 344, b'n+1\0')  # magic

    pad = b'\x00\x00\x00\x00'

    with gzip.open(file_path, 'wb') as f:
        f.write(hdr)
        f.write(pad)
        f.write(raw_data)


def generate_synthetic_study(
    output_dir: str,
    shape: Tuple[int, int, int] = (96, 96, 96),
    seed: int = 42,
) -> dict:
    """Generate a multi-sequence synthetic brain scan and corresponding ground-truth mask."""
    rng = np.random.default_rng(seed)
    nx, ny, nz = shape
    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)

    # Coordinate grids centered in volume
    z, y, x = np.ogrid[:nx, :ny, :nz]
    cx, cy, cz = nx / 2.0, ny / 2.0, nz / 2.0

    # 1. Anatomical Brain Ellipsoid
    rx, ry, rz = nx * 0.40, ny * 0.35, nz * 0.38
    dist_brain = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2
    brain_mask = dist_brain <= 1.0

    # Ventricles (central fluid)
    vrx, vry, vrz = nx * 0.08, ny * 0.16, nz * 0.12
    ventricle_mask = (((x - cx) / vrx) ** 2 + ((y - cy) / vry) ** 2 + ((z - cz) / vrz) ** 2 <= 1.0) & brain_mask

    # 2. Synthetic Tumour Complex (positioned in right hemisphere)
    tcx, tcy, tcz = cx + nx * 0.12, cy - ny * 0.05, cz + nz * 0.04
    # Edema (outer sphere): radius ~ 14 mm
    r_ed = nx * 0.16
    dist_tumour = np.sqrt((x - tcx) ** 2 + (y - tcy) ** 2 + (z - tcz) ** 2)
    edema_mask = (dist_tumour <= r_ed) & brain_mask

    # Enhancing ring: radius ~ 9 mm
    r_et = nx * 0.10
    et_mask = (dist_tumour <= r_et) & brain_mask

    # Necrotic core: radius ~ 5 mm
    r_ncr = nx * 0.055
    ncr_mask = (dist_tumour <= r_ncr) & brain_mask

    # Build disjoint internal ground truth mask
    # 0 = BG, 1 = NCR, 2 = ED, 3 = ET
    mask = np.zeros(shape, dtype=np.uint8)
    mask[edema_mask] = 2  # ED
    mask[et_mask] = 3     # ET
    mask[ncr_mask] = 1    # NCR

    # 3. Multi-sequence contrast synthesis
    # Base brain tissue intensities
    noise = rng.normal(0, 0.02, shape)

    # T1: CSF dark, Gray/White matter mid, tumour core hypointense
    t1 = np.zeros(shape, dtype=np.float32)
    t1[brain_mask] = 0.65 + rng.normal(0, 0.04, int(np.sum(brain_mask)))
    t1[ventricle_mask] = 0.15
    t1[mask == 2] = 0.45  # Edema dark on T1
    t1[mask == 3] = 0.55  # Enhancing rim isointense on pre-contrast T1
    t1[mask == 1] = 0.25  # Necrosis dark
    t1 += noise
    t1 = np.clip(t1, 0.0, 1.0)

    # T1ce: Contrast enhances the rim (label 3) prominently
    t1ce = t1.copy()
    t1ce[mask == 3] = 0.95 + rng.normal(0, 0.03, int(np.sum(mask == 3)))  # Bright ET rim
    t1ce[mask == 1] = 0.20  # Central dark necrosis
    t1ce = np.clip(t1ce, 0.0, 1.0)

    # T2: Edema and necrosis hyperintense, ventricles bright
    t2 = np.zeros(shape, dtype=np.float32)
    t2[brain_mask] = 0.50 + rng.normal(0, 0.03, int(np.sum(brain_mask)))
    t2[ventricle_mask] = 0.90
    t2[mask == 2] = 0.85  # Edema bright on T2
    t2[mask == 3] = 0.60
    t2[mask == 1] = 0.80  # Necrosis bright
    t2 += noise
    t2 = np.clip(t2, 0.0, 1.0)

    # FLAIR: Edema very bright, CSF attenuated/dark
    flair = np.zeros(shape, dtype=np.float32)
    flair[brain_mask] = 0.45 + rng.normal(0, 0.03, int(np.sum(brain_mask)))
    flair[ventricle_mask] = 0.10  # Suppressed fluid
    flair[mask == 2] = 0.92  # Edema hyperintense on FLAIR
    flair[mask == 3] = 0.70
    flair[mask == 1] = 0.50
    flair += noise
    flair = np.clip(flair, 0.0, 1.0)

    # Save volumes
    paths = {
        "t1": str(out_path / "t1.nii.gz"),
        "t1ce": str(out_path / "t1ce.nii.gz"),
        "t2": str(out_path / "t2.nii.gz"),
        "flair": str(out_path / "flair.nii.gz"),
        "mask": str(out_path / "mask.nii.gz"),
    }

    write_nifti1(t1, paths["t1"])
    write_nifti1(t1ce, paths["t1ce"])
    write_nifti1(t2, paths["t2"])
    write_nifti1(flair, paths["flair"])
    write_nifti1(mask, paths["mask"], is_mask=True)

    return {
        "paths": paths,
        "shape": shape,
        "ncr_voxels": int(np.sum(mask == 1)),
        "ed_voxels": int(np.sum(mask == 2)),
        "et_voxels": int(np.sum(mask == 3)),
        "wt_voxels": int(np.sum(mask > 0)),
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create synthetic brain MRI study")
    parser.add_argument("--output-dir", type=str, default="./synthetic_study", help="Directory to save synthetic files")
    parser.add_argument("--size", type=int, default=96, help="Cubic dimensions (e.g. 96 for 96x96x96)")
    parser.add_argument("--seed", type=int, default=42, help="Random seed")
    args = parser.parse_args()

    result = generate_synthetic_study(args.output_dir, (args.size, args.size, args.size), args.seed)
    print(f"Generated synthetic study in: {args.output_dir}")
    print(f"  Shape: {result['shape']}")
    print(f"  WT Voxels: {result['wt_voxels']} (NCR: {result['ncr_voxels']}, ED: {result['ed_voxels']}, ET: {result['et_voxels']})")
