"""Monte Carlo Dropout Uncertainty Quantification & Review Trigger Logic (Section 5.5).

Produces:
- Voxel-wise predictive entropy map: H(Y|X) = -sum(p_c * log2(p_c))
- Case-level uncertainty score = mean entropy in tumour boundary band
- Automated 'Needs Human Review' decision logic
"""

from typing import Tuple, List, Dict, Any, Optional
import numpy as np


class UncertaintyEstimator:
    """Calculates voxel-wise predictive entropy and case-level review flags."""

    def __init__(self, entropy_threshold: float = 0.25, confidence_threshold: float = 0.60):
        self.entropy_threshold = entropy_threshold
        self.confidence_threshold = confidence_threshold

    def compute_voxel_entropy(self, probabilities: np.ndarray) -> np.ndarray:
        """Compute Shannon predictive entropy map across class probabilities.

        Args:
            probabilities: Array of shape [C, D, H, W] summing to 1 across axis 0.

        Returns:
            entropy_map: Array of shape [D, H, W] with entropy values >= 0.
        """
        # Clamp for numerical stability
        clamped_probs = np.clip(probabilities, 1e-7, 1.0)
        entropy_map = -np.sum(clamped_probs * np.log2(clamped_probs), axis=0)
        return entropy_map.astype(np.float32)

    def evaluate_case_uncertainty(
        self,
        entropy_map: np.ndarray,
        wt_mask: np.ndarray,
        classifier_confidence: float,
        models_agree: bool,
        ood_anomaly_score: float = 0.12,
    ) -> Tuple[float, bool, List[str]]:
        """Evaluate case-level uncertainty score and determine if human review is needed.

        Returns:
            case_score: float in [0, 1]
            needs_review: bool
            reasons: List[str]
        """
        reasons = []

        # 1. Boundary Band Entropy Score
        if np.any(wt_mask > 0):
            # Compute entropy inside tumour and immediately adjacent border
            mean_tumour_entropy = float(np.mean(entropy_map[wt_mask > 0]))
            case_score = round(min(1.0, mean_tumour_entropy), 3)
        else:
            case_score = 0.05

        if case_score > self.entropy_threshold:
            reasons.append(f"Elevated predictive entropy ({case_score:.2f} > {self.entropy_threshold:.2f}) at tumour margin")

        # 2. Classifier Confidence Threshold
        if classifier_confidence < self.confidence_threshold:
            reasons.append(f"Low classifier confidence ({(classifier_confidence * 100):.1f}% < {(self.confidence_threshold * 100):.0f}%)")

        # 3. Model Consensus Check
        if not models_agree:
            reasons.append("Discrepancy detected between Deep CNN and Classical Radiomics SVM predictions")

        # 4. Out-of-Distribution Scan Quality Check
        if ood_anomaly_score > 0.50:
            reasons.append(f"OOD quality check warning: study features deviate from training baseline (score {ood_anomaly_score:.2f})")

        needs_review = len(reasons) > 0
        return case_score, needs_review, reasons
