"""Unit tests for multi-sequence MRI preprocessing (Section 5.1)."""

import numpy as np
import pytest
from neurolens_ml.preprocessing.pipeline import (
    compute_brain_mask,
    zscore_normalize,
    get_brain_bbox,
)


def test_zscore_normalize():
    # Create 32 x 32 x 32 synthetic brain
    shape = (32, 32, 32)
    brain_mask = np.zeros(shape, dtype=bool)
    brain_mask[8:24, 8:24, 8:24] = True

    vol = np.zeros(shape, dtype=np.float32)
    # Give brain voxels a normal distribution with mean=500, std=100
    vol[brain_mask] = np.random.normal(500.0, 100.0, int(np.sum(brain_mask)))

    norm_vol = zscore_normalize(vol, brain_mask)

    # Brain voxels should now have mean ~ 0 and std ~ 1
    norm_brain = norm_vol[brain_mask]
    assert abs(np.mean(norm_brain)) < 0.1
    assert abs(np.std(norm_brain) - 1.0) < 0.1

    # Non-brain voxels should be exactly 0
    assert np.all(norm_vol[~brain_mask] == 0.0)


def test_brain_mask_and_bbox():
    t1 = np.zeros((32, 32, 32), dtype=np.float32)
    # Bright center
    t1[10:22, 10:22, 10:22] = 200.0

    mask = compute_brain_mask(t1, threshold_factor=0.2)
    assert np.all(mask[10:22, 10:22, 10:22] == True)
    assert np.all(mask[0:5, 0:5, 0:5] == False)

    z_sl, y_sl, x_sl = get_brain_bbox(mask, padding=2)
    assert z_sl.start <= 10 and z_sl.stop >= 22
    assert y_sl.start <= 10 and y_sl.stop >= 22
    assert x_sl.start <= 10 and x_sl.stop >= 22
