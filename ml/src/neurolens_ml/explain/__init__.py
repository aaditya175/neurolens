"""Explainability and feature attribution modules (Section 5.6)."""
from neurolens_ml.explain.gradcam import GradCAM3D, compute_slice_overlay

__all__ = ["GradCAM3D", "compute_slice_overlay"]
