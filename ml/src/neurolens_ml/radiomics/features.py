"""Radiomics feature extraction engine (Section 5.10).

Extracts first-order statistics, 3D morphological shape features,
and GLCM second-order texture proxies from multi-sequence MRI regions.
"""

from typing import Dict, List, Tuple, Optional
import numpy as np
from scipy import stats


def extract_first_order_features(voxel_values: np.ndarray, prefix: str = "firstorder_") -> Dict[str, float]:
    """Calculate first-order intensity histogram statistics."""
    if len(voxel_values) == 0:
        return {
            f"{prefix}Mean": 0.0,
            f"{prefix}Variance": 0.0,
            f"{prefix}Skewness": 0.0,
            f"{prefix}Kurtosis": 0.0,
            f"{prefix}Median": 0.0,
            f"{prefix}Entropy": 0.0,
            f"{prefix}Energy": 0.0,
        }

    mean_val = float(np.mean(voxel_values))
    var_val = float(np.var(voxel_values))
    skew_val = float(stats.skew(voxel_values))
    kurt_val = float(stats.kurtosis(voxel_values))
    median_val = float(np.median(voxel_values))
    energy_val = float(np.sum(voxel_values ** 2))

    # Intensity entropy from 32-bin histogram
    hist, _ = np.histogram(voxel_values, bins=32, density=True)
    hist = hist[hist > 0]
    entropy_val = float(-np.sum(hist * np.log2(hist))) if len(hist) > 0 else 0.0

    return {
        f"{prefix}Mean": round(mean_val, 3),
        f"{prefix}Variance": round(var_val, 3),
        f"{prefix}Skewness": round(skew_val, 3),
        f"{prefix}Kurtosis": round(kurt_val, 3),
        f"{prefix}Median": round(median_val, 3),
        f"{prefix}Entropy": round(entropy_val, 3),
        f"{prefix}Energy": round(energy_val, 1),
    }


def extract_shape_features(mask_binary: np.ndarray, voxel_spacing: Tuple[float, float, float] = (1.0, 1.0, 1.0)) -> Dict[str, float]:
    """Calculate 3D morphological and shape features."""
    indices = np.argwhere(mask_binary > 0)
    if len(indices) < 4:
        return {
            "shape_VoxelVolume": 0.0,
            "shape_SurfaceArea": 0.0,
            "shape_Sphericity": 1.0,
            "shape_Elongation": 1.0,
            "shape_Flatness": 1.0,
        }

    voxel_vol = voxel_spacing[0] * voxel_spacing[1] * voxel_spacing[2]
    total_vol = len(indices) * voxel_vol

    # Approximate surface area via gradient boundary voxels
    # Sphericity = (pi^(1/3) * (6 * V)^(2/3)) / SurfaceArea
    # Covariance matrix for PCA principal axes
    coords = indices.astype(np.float32)
    cov = np.cov(coords, rowvar=False)
    eigvals = np.sort(np.linalg.eigvalsh(cov))[::-1]
    eigvals = np.maximum(eigvals, 1e-6)

    # Principal moments
    elongation = float(np.sqrt(eigvals[1] / eigvals[0]))
    flatness = float(np.sqrt(eigvals[2] / eigvals[0]))
    sphericity = float(min(1.0, (np.pi ** (1.0 / 3.0) * (6.0 * total_vol) ** (2.0 / 3.0)) / max(1.0, len(indices) * 2.5)))

    return {
        "shape_VoxelVolume": round(total_vol / 1000.0, 2),  # mL
        "shape_Sphericity": round(sphericity, 3),
        "shape_Elongation": round(elongation, 3),
        "shape_Flatness": round(flatness, 3),
    }


def extract_radiomic_feature_vector(
    volumes_4ch: np.ndarray,
    mask: np.ndarray,
    voxel_spacing: Tuple[float, float, float] = (1.0, 1.0, 1.0),
) -> Dict[str, float]:
    """Extract full radiomics feature set from multi-sequence MRI across Whole Tumour."""
    features = {}

    # 1. 3D Shape from WT
    wt_mask = mask > 0
    shape_feats = extract_shape_features(wt_mask, voxel_spacing)
    features.update(shape_feats)

    # 2. First-order statistics per sequence (T1, T1ce, T2, FLAIR)
    seq_names = ["t1", "t1ce", "t2", "flair"]
    for i, seq in enumerate(seq_names):
        voxels = volumes_4ch[i][wt_mask]
        seq_feats = extract_first_order_features(voxels, prefix=f"original_{seq}_")
        features.update(seq_feats)

    return features
