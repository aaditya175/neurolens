"""Unit tests for Phase 5: Uncertainty Quantification, Grad-CAM Explainability & Missing-Modality Robustness."""

import numpy as np
import pytest

from neurolens_ml.uncertainty.mc_dropout import UncertaintyEstimator
from neurolens_ml.explain.gradcam import GradCAM3D, compute_slice_overlay
from neurolens_ml.segmentation.swinunetr import MissingModalityAdapter


def test_missing_modality_adapter():
    """Verify that MissingModalityAdapter builds 4-channel tensor even when sequences are missing."""
    adapter = MissingModalityAdapter(dropout_prob=0.0)
    
    # 1. Full 4 sequences
    t1 = np.ones((16, 16, 16), dtype=np.float32)
    t1ce = np.ones((16, 16, 16), dtype=np.float32) * 2
    t2 = np.ones((16, 16, 16), dtype=np.float32) * 3
    flair = np.ones((16, 16, 16), dtype=np.float32) * 4
    
    full_dict = {"t1": t1, "t1ce": t1ce, "t2": t2, "flair": flair}
    stacked, active = adapter.prepare_multimodal_tensor(full_dict)
    assert stacked.shape == (4, 16, 16, 16)
    assert len(active) == 4
    assert np.allclose(stacked[0], 1.0)
    assert np.allclose(stacked[3], 4.0)

    # 2. Missing FLAIR & T2 (only T1 and T1ce available)
    partial_dict = {"t1": t1, "t1ce": t1ce}
    stacked_partial, active_partial = adapter.prepare_multimodal_tensor(partial_dict)
    assert stacked_partial.shape == (4, 16, 16, 16)
    assert active_partial == ["t1", "t1ce"]
    assert np.allclose(stacked_partial[2], 0.0)  # T2 is zero-filled
    assert np.allclose(stacked_partial[3], 0.0)  # FLAIR is zero-filled


def test_uncertainty_estimator_entropy_and_triggers():
    """Verify predictive entropy computation and Needs-Review trigger logic."""
    estimator = UncertaintyEstimator(entropy_threshold=0.25, confidence_threshold=0.60)
    
    # Simulate probability distribution across 4 classes for a 10x10x10 volume
    # High certainty case: class 0 has 0.97 prob
    high_cert_probs = np.zeros((4, 10, 10, 10), dtype=np.float32)
    high_cert_probs[0] = 0.97
    high_cert_probs[1] = 0.01
    high_cert_probs[2] = 0.01
    high_cert_probs[3] = 0.01
    
    entropy_low = estimator.compute_voxel_entropy(high_cert_probs)
    assert entropy_low.shape == (10, 10, 10)
    assert np.all(entropy_low < 0.25)
    
    # High uncertainty case: uniform distribution (0.25 each)
    high_uncert_probs = np.full((4, 10, 10, 10), 0.25, dtype=np.float32)
    entropy_high = estimator.compute_voxel_entropy(high_uncert_probs)
    assert np.allclose(entropy_high, 2.0)  # -4 * (0.25 * log2(0.25)) = 2.0

    # Test Case Review Flags:
    wt_mask = np.ones((10, 10, 10), dtype=np.uint8)

    # Case 1: High confidence, models agree, low entropy -> No review needed
    score, needs_review, reasons = estimator.evaluate_case_uncertainty(
        entropy_map=entropy_low,
        wt_mask=wt_mask,
        classifier_confidence=0.92,
        models_agree=True,
        ood_anomaly_score=0.10,
    )
    assert not needs_review
    assert len(reasons) == 0

    # Case 2: Deep and classical models disagree -> Review triggered
    score, needs_review, reasons = estimator.evaluate_case_uncertainty(
        entropy_map=entropy_low,
        wt_mask=wt_mask,
        classifier_confidence=0.88,
        models_agree=False,
        ood_anomaly_score=0.10,
    )
    assert needs_review
    assert any("Discrepancy" in r for r in reasons)

    # Case 3: High predictive entropy -> Review triggered
    score, needs_review, reasons = estimator.evaluate_case_uncertainty(
        entropy_map=entropy_high,
        wt_mask=wt_mask,
        classifier_confidence=0.85,
        models_agree=True,
        ood_anomaly_score=0.10,
    )
    assert needs_review
    assert any("Elevated predictive entropy" in r for r in reasons)


def test_gradcam_heatmap_and_slice_overlay():
    """Verify 3D GradCAM attention generation and slice-wise extraction."""
    gradcam = GradCAM3D()
    vol = np.random.randn(32, 32, 32).astype(np.float32)
    wt_mask = np.zeros((32, 32, 32), dtype=np.uint8)
    wt_mask[12:20, 12:20, 12:20] = 1

    heatmap = gradcam.generate_heatmap(volume=vol, target_class=0, wt_mask=wt_mask)
    assert heatmap.shape == (32, 32, 32)
    assert float(heatmap.min()) >= 0.0
    assert float(heatmap.max()) <= 1.0 + 1e-6
    # Tumour center should have high activation
    assert heatmap[16, 16, 16] > 0.5

    # Test slice overlay extraction
    axial_slice = compute_slice_overlay(heatmap, slice_index=16, axis=0)
    assert axial_slice.shape == (32, 32)
    assert axial_slice.max() <= 1.0
