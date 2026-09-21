"""Unit tests for DBSCAN lesion clustering and noise suppression (Section 6.1)."""

import numpy as np
import pytest
from neurolens_ml.classical.dbscan import DBSCANLesionClusterer


def test_dbscan_multifocality_and_noise_filtering():
    # 64 x 64 x 64 grid
    mask = np.zeros((64, 64, 64), dtype=np.uint8)

    # Lesion 1: Sphere at (20, 20, 20) with radius 5
    z, y, x = np.ogrid[:64, :64, :64]
    dist1 = np.sqrt((x - 20)**2 + (y - 20)**2 + (z - 20)**2)
    mask[dist1 <= 5] = 3

    # Lesion 2: Sphere at (45, 45, 45) with radius 4
    dist2 = np.sqrt((x - 45)**2 + (y - 45)**2 + (z - 45)**2)
    mask[dist2 <= 4] = 3

    # Add 5 isolated noise voxels far away
    mask[5, 5, 5] = 3
    mask[10, 50, 10] = 3
    mask[55, 10, 50] = 3

    clusterer = DBSCANLesionClusterer(eps=2.5, min_samples=10)
    cleaned_mask, lesions, lesion_count = clusterer.fit_predict_mask(mask, voxel_spacing=(1.0, 1.0, 1.0))

    # Should find exactly 2 distinct lesion clusters
    assert lesion_count == 2, f"Expected 2 lesions, got {lesion_count}"
    assert len(lesions) == 2

    # Isolated noise voxels should be zeroed out in cleaned mask
    assert cleaned_mask[5, 5, 5] == 0
    assert cleaned_mask[10, 50, 10] == 0
    assert cleaned_mask[55, 10, 50] == 0

    # Main lesions should still exist
    assert cleaned_mask[20, 20, 20] == 3
    assert cleaned_mask[45, 45, 45] == 3

    # Larger lesion should be first
    assert lesions[0]["volume_ml"] > lesions[1]["volume_ml"]
