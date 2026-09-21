"""Unit tests for 3D U-Net baseline and sliding-window inference (Section 5.2)."""

import numpy as np
import pytest
from neurolens_ml.segmentation.unet_baseline import BaselineUNet3D, sliding_window_infer, HAS_TORCH


@pytest.mark.skipif(not HAS_TORCH, reason="PyTorch native DLL not loaded in this OS environment")
def test_unet3d_forward_pass():
    import torch
    model = BaselineUNet3D(in_channels=4, out_classes=4, base_filters=4)
    model.eval()

    dummy_input = torch.randn(1, 4, 16, 16, 16)
    with torch.no_grad():
        output = model(dummy_input)

    assert output.shape == (1, 4, 16, 16, 16)
    assert not torch.isnan(output).any()


def test_sliding_window_inference():
    model = BaselineUNet3D(in_channels=4, out_classes=4, base_filters=4)

    # 4 channels, shape 32 x 32 x 32
    dummy_volume = np.random.randn(4, 32, 32, 32).astype(np.float32)
    pred_mask = sliding_window_infer(model, dummy_volume, roi_size=(16, 16, 16), overlap=0.5)

    assert pred_mask.shape == (32, 32, 32)
    assert pred_mask.dtype == np.uint8
    # Classes should be in {0, 1, 2, 3}
    assert np.all(np.isin(np.unique(pred_mask), [0, 1, 2, 3]))
