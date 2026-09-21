"""Unit tests for label scheme and adapters (Section 4.2)."""

import numpy as np
import pytest
from neurolens_ml.data.labels import (
    LABEL_BACKGROUND,
    LABEL_NCR,
    LABEL_ED,
    LABEL_ET,
    map_brats_labels,
    extract_composite_masks,
)


def test_map_brats2021():
    # Raw BraTS 2021 has labels 0, 1, 2, 4 (no 3)
    raw = np.array([0, 1, 2, 4], dtype=np.uint8)
    mapped = map_brats_labels(raw, "brats2021")
    expected = np.array([0, 1, 2, 3], dtype=np.uint8)
    np.testing.assert_array_equal(mapped, expected)


def test_map_brats2015():
    # Raw BraTS 2015 has labels 0, 1, 2, 3 (NET), 4 (ET)
    raw = np.array([0, 1, 2, 3, 4], dtype=np.uint8)
    mapped = map_brats_labels(raw, "brats2015")
    # 3 should map to 1 (NCR/core), 4 should map to 3 (ET)
    expected = np.array([0, 1, 2, 1, 3], dtype=np.uint8)
    np.testing.assert_array_equal(mapped, expected)


def test_composite_extraction():
    mask = np.zeros((10, 10, 10), dtype=np.uint8)
    mask[2:5, 2:5, 2:5] = LABEL_NCR  # 1
    mask[4:7, 4:7, 4:7] = LABEL_ED   # 2
    mask[6:9, 6:9, 6:9] = LABEL_ET   # 3

    comps = extract_composite_masks(mask)

    assert "WT" in comps and "TC" in comps and "ET" in comps
    # WT should include all 1, 2, 3
    assert np.all(comps["WT"][mask > 0] == 1)
    assert np.all(comps["WT"][mask == 0] == 0)

    # TC should include 1 and 3, but not 2
    assert np.all(comps["TC"][mask == LABEL_NCR] == 1)
    assert np.all(comps["TC"][mask == LABEL_ET] == 1)
    assert np.all(comps["TC"][mask == LABEL_ED] == 0)

    # ET should only include 3
    assert np.all(comps["ET"][mask == LABEL_ET] == 1)
    assert np.all(comps["ET"][mask != LABEL_ET] == 0)
