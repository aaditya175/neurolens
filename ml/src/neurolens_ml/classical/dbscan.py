"""DBSCAN lesion clustering and false-positive noise removal (Section 6.1).

Uses density-based spatial clustering of applications with noise (DBSCAN)
to cluster predicted tumour voxels in physical mm space.
"""

from typing import Tuple, List, Dict, Any, Optional
import numpy as np
from sklearn.cluster import DBSCAN


class DBSCANLesionClusterer:
    """Density-based lesion clusterer and spatial noise filter."""

    def __init__(self, eps: float = 2.5, min_samples: int = 15):
        """
        Args:
            eps: Maximum distance between two samples for one to be considered in the neighborhood (in mm).
            min_samples: Minimum number of samples in a neighborhood for a core point.
        """
        self.eps = eps
        self.min_samples = min_samples

    def fit_predict_mask(
        self,
        mask: np.ndarray,
        affine: Optional[np.ndarray] = None,
        voxel_spacing: Tuple[float, float, float] = (1.0, 1.0, 1.0),
    ) -> Tuple[np.ndarray, List[Dict[str, Any]], int]:
        """Filter noise and group distinct lesion components via DBSCAN.

        Args:
            mask: 3D numpy array with segmentation labels (0=BG, >0=tumour).
            affine: 4x4 coordinate affine matrix.
            voxel_spacing: (dx, dy, dz) in mm.

        Returns:
            cleaned_mask: Mask with isolated noise (cluster -1) set to background (0).
            lesions: List of dicts with id, volume_ml, and centroid_mm.
            lesion_count: Number of distinct clustered lesions (multifocality).
        """
        # 1. Extract non-zero voxel indices
        indices = np.argwhere(mask > 0)
        if len(indices) == 0:
            return mask.copy(), [], 0

        # 2. Convert indices to coordinates in mm
        coords_mm = indices.astype(np.float32)
        coords_mm[:, 0] *= voxel_spacing[2]  # z
        coords_mm[:, 1] *= voxel_spacing[1]  # y
        coords_mm[:, 2] *= voxel_spacing[0]  # x

        # 3. Run DBSCAN
        # If voxel count is very large (> 25000), downsample for spatial clustering speed
        use_subsample = len(coords_mm) > 30000
        if use_subsample:
            sub_indices = np.random.choice(len(coords_mm), 25000, replace=False)
            fit_coords = coords_mm[sub_indices]
        else:
            fit_coords = coords_mm

        db = DBSCAN(eps=self.eps, min_samples=self.min_samples, metric="euclidean")
        labels = db.fit_predict(fit_coords)

        # 4. Filter noise (label == -1) and build lesion summaries
        cleaned_mask = mask.copy()
        lesions: List[Dict[str, Any]] = []

        unique_labels = [l for l in np.unique(labels) if l != -1]
        lesion_count = len(unique_labels)

        # Calculate voxel volume in mL
        voxel_vol_ml = (voxel_spacing[0] * voxel_spacing[1] * voxel_spacing[2]) / 1000.0

        if not use_subsample:
            # Set noise points to background in cleaned mask
            noise_idx = indices[labels == -1]
            if len(noise_idx) > 0:
                cleaned_mask[noise_idx[:, 0], noise_idx[:, 1], noise_idx[:, 2]] = 0

            for l_id in unique_labels:
                cluster_pts = indices[labels == l_id]
                cluster_mm = coords_mm[labels == l_id]
                vol_ml = round(len(cluster_pts) * voxel_vol_ml, 2)
                centroid = np.mean(cluster_mm, axis=0)  # [z, y, x]
                lesions.append({
                    "id": int(l_id) + 1,
                    "volume_ml": vol_ml,
                    "centroid_mm": (round(float(centroid[2]), 1), round(float(centroid[1]), 1), round(float(centroid[0]), 1)),
                    "voxel_count": len(cluster_pts),
                })
        else:
            # For downsampled fit, provide primary lesion summary
            vol_ml = round(len(indices) * voxel_vol_ml, 2)
            centroid = np.mean(coords_mm, axis=0)
            lesions.append({
                "id": 1,
                "volume_ml": vol_ml,
                "centroid_mm": (round(float(centroid[2]), 1), round(float(centroid[1]), 1), round(float(centroid[0]), 1)),
                "voxel_count": len(indices),
            })
            lesion_count = max(1, lesion_count)

        # Sort lesions by volume descending
        lesions.sort(key=lambda x: x["volume_ml"], reverse=True)

        return cleaned_mask, lesions, lesion_count
