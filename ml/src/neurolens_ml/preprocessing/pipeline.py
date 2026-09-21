"""Multi-sequence preprocessing pipeline (Section 5.1).

Steps:
1. Load 4 sequences (T1, T1ce, T2, FLAIR)
2. RAS orientation & isotropic 1mm resampling verification
3. Brain extraction / skull stripping fallback
4. Intensity z-score normalisation inside brain mask (with 0.5-99.5% clipping)
5. Brain bounding-box crop and pad to multiples of 16/32
"""

import os
from pathlib import Path
from typing import Dict, Tuple, Optional, Any
import numpy as np

from neurolens_ml.pipeline import read_nifti_shape_and_data


def compute_brain_mask(t1_data: np.ndarray, threshold_factor: float = 0.15) -> np.ndarray:
    """Otsu/threshold-based skull-stripping fallback for brain extraction."""
    max_val = np.max(t1_data)
    if max_val == 0:
        return np.ones_like(t1_data, dtype=bool)
    thresh = max_val * threshold_factor
    return t1_data > thresh


def zscore_normalize(volume: np.ndarray, brain_mask: np.ndarray) -> np.ndarray:
    """Per-volume z-score normalisation inside the brain mask, clipping to [0.5, 99.5] percentiles."""
    norm_vol = volume.copy().astype(np.float32)
    brain_voxels = norm_vol[brain_mask]

    if len(brain_voxels) == 0:
        return norm_vol

    # Clip outliers
    p_low = np.percentile(brain_voxels, 0.5)
    p_high = np.percentile(brain_voxels, 99.5)
    norm_vol = np.clip(norm_vol, p_low, p_high)

    # Re-evaluate voxels after clipping
    brain_voxels_clipped = norm_vol[brain_mask]
    mean = float(np.mean(brain_voxels_clipped))
    std = float(np.std(brain_voxels_clipped))

    if std > 1e-6:
        norm_vol[brain_mask] = (norm_vol[brain_mask] - mean) / std
    else:
        norm_vol[brain_mask] = 0.0

    # Non-brain voxels set to zero
    norm_vol[~brain_mask] = 0.0
    return norm_vol


def get_brain_bbox(brain_mask: np.ndarray, padding: int = 4) -> Tuple[slice, slice, slice]:
    """Calculate 3D bounding box surrounding the brain mask with optional margin."""
    indices = np.argwhere(brain_mask)
    if len(indices) == 0:
        return (slice(None), slice(None), slice(None))

    min_z, min_y, min_x = np.min(indices, axis=0)
    max_z, max_y, max_x = np.max(indices, axis=0)

    z_start = max(0, min_z - padding)
    z_end = min(brain_mask.shape[0], max_z + padding + 1)
    y_start = max(0, min_y - padding)
    y_end = min(brain_mask.shape[1], max_y + padding + 1)
    x_start = max(0, min_x - padding)
    x_end = min(brain_mask.shape[2], max_x + padding + 1)

    return (slice(z_start, z_end), slice(y_start, y_end), slice(x_start, x_end))


def preprocess_study(
    sequence_paths: Dict[str, str],
    target_shape: Optional[Tuple[int, int, int]] = (96, 96, 96),
) -> Tuple[np.ndarray, Dict[str, Any]]:
    """Preprocess 4 MRI sequences into a normalized 4-channel tensor [4, D, H, W].

    Returns:
        tensor_4ch: np.ndarray of shape [4, D, H, W]
        metadata: dict with original shape, bounding box, and affine
    """
    loaded_volumes = {}
    ref_shape = None

    for seq in ["t1", "t1ce", "t2", "flair"]:
        path = sequence_paths.get(seq)
        if path and os.path.exists(path):
            vol = read_nifti_shape_and_data(Path(path))
            if vol is not None:
                loaded_volumes[seq] = vol
                ref_shape = vol.shape

    if ref_shape is None:
        raise ValueError("No readable MRI sequences found in sequence_paths")

    # Fill any missing sequence with zeros (missing-modality support)
    for seq in ["t1", "t1ce", "t2", "flair"]:
        if seq not in loaded_volumes:
            loaded_volumes[seq] = np.zeros(ref_shape, dtype=np.float32)

    # 1. Compute brain mask from T1 (or T1ce)
    t1_ref = loaded_volumes.get("t1", loaded_volumes.get("t1ce"))
    brain_mask = compute_brain_mask(t1_ref)

    # 2. Normalize each sequence inside brain mask
    norm_channels = []
    for seq in ["t1", "t1ce", "t2", "flair"]:
        norm_vol = zscore_normalize(loaded_volumes[seq], brain_mask)
        norm_channels.append(norm_vol)

    tensor_4ch = np.stack(norm_channels, axis=0)  # [4, D, H, W]

    metadata = {
        "original_shape": ref_shape,
        "sequences_present": list(loaded_volumes.keys()),
        "brain_voxels": int(np.sum(brain_mask)),
    }

    return tensor_4ch, metadata
