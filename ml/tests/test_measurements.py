"""Unit tests verifying measurement accuracy on geometric synthetic spheres (Section 5.7)."""

import numpy as np
import pytest
from neurolens_ml.measurements.metrics import (
    compute_volume_ml,
    compute_rano_diameters_mm,
    compute_centroid_mm,
    estimate_midline_shift_mm,
)


def test_sphere_volume_and_diameter():
    # Create 3D grid: 64 x 64 x 64 with 1mm isotropic spacing
    shape = (64, 64, 64)
    r_mm = 10.0  # 10 mm radius -> Diameter = 20 mm
    # Analytical volume: (4/3) * pi * r^3 = 4188.79 mm^3 = 4.19 mL
    expected_vol_ml = (4.0 / 3.0) * np.pi * (r_mm ** 3) / 1000.0

    cz, cy, cx = 32.0, 32.0, 32.0
    z, y, x = np.ogrid[:shape[0], :shape[1], :shape[2]]
    dist = np.sqrt((x - cx) ** 2 + (y - cy) ** 2 + (z - cz) ** 2)
    sphere_mask = (dist <= r_mm).astype(np.uint8)

    # 1. Test Volumetric Accuracy
    calculated_vol_ml = compute_volume_ml(sphere_mask, voxel_spacing=(1.0, 1.0, 1.0))
    # Discretization error on voxel grid should be < 2%
    rel_error = abs(calculated_vol_ml - expected_vol_ml) / expected_vol_ml
    assert rel_error < 0.02, f"Volume error too high: {rel_error:.4f} (calc: {calculated_vol_ml}, exp: {expected_vol_ml})"

    # 2. Test RANO Diameters
    max_diam, perp_diam = compute_rano_diameters_mm(sphere_mask, voxel_spacing=(1.0, 1.0, 1.0))
    # Expected diameter is 20 mm
    assert abs(max_diam - 20.0) <= 1.0, f"Max diameter off: {max_diam}"
    assert abs(perp_diam - 20.0) <= 1.0, f"Perpendicular diameter off: {perp_diam}"

    # 3. Test Centroid
    centroid = compute_centroid_mm(sphere_mask)
    assert abs(centroid[0] - cx) <= 0.5
    assert abs(centroid[1] - cy) <= 0.5
    assert abs(centroid[2] - cz) <= 0.5
