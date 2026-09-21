"""Unit tests for synthetic study generator."""

import os
import shutil
import tempfile
import gzip
import struct
import numpy as np
import pytest
from ml.scripts.make_synthetic_study import generate_synthetic_study


def test_generate_synthetic_study():
    temp_dir = tempfile.mkdtemp()
    try:
        res = generate_synthetic_study(temp_dir, shape=(32, 32, 32), seed=123)
        assert os.path.exists(res["paths"]["t1"])
        assert os.path.exists(res["paths"]["t1ce"])
        assert os.path.exists(res["paths"]["t2"])
        assert os.path.exists(res["paths"]["flair"])
        assert os.path.exists(res["paths"]["mask"])

        # Check voxels count
        assert res["wt_voxels"] > 0
        assert res["ncr_voxels"] > 0
        assert res["ed_voxels"] > 0
        assert res["et_voxels"] > 0
        assert res["wt_voxels"] == res["ncr_voxels"] + res["ed_voxels"] + res["et_voxels"]

        # Verify NIfTI header can be unpacked
        with gzip.open(res["paths"]["t1"], "rb") as f:
            header_bytes = f.read(348)
            sizeof_hdr = struct.unpack("<i", header_bytes[0:4])[0]
            assert sizeof_hdr == 348
            magic = header_bytes[344:348]
            assert magic == b"n+1\0"
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
