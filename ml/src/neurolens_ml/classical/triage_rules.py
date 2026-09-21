"""Decision Tree Explainable Triage Rules Engine (Section 6.7)."""

from typing import List, Dict, Any, Tuple
import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_text


FEATURE_NAMES = [
    "wt_volume_ml",
    "midline_shift_mm",
    "edema_ratio",
    "lesion_count",
    "uncertainty_score",
]


class TriageRulesEngine:
    """Interpretable shallow Decision Tree producing human-readable urgency criteria."""

    def __init__(self, max_depth: int = 3):
        self.tree = DecisionTreeClassifier(max_depth=max_depth, random_state=42)
        self.is_trained = False

    def train_on_cohort(self, X: np.ndarray, y_urgency: np.ndarray):
        """Train shallow tree on feature matrix."""
        self.tree.fit(X, y_urgency)
        self.is_trained = True

    def export_rules_text(self) -> str:
        """Export tree split logic as human-readable text."""
        if not self.is_trained:
            return "Rules engine not yet trained."
        return export_text(self.tree, feature_names=FEATURE_NAMES)

    def evaluate_case(self, case_features: Dict[str, float]) -> Tuple[float, List[str]]:
        """Evaluate a case against rules and return urgency score + fired rules."""
        rules_fired = []
        score = 0.2  # baseline low urgency

        wt_vol = case_features.get("wt_volume_ml", 0.0)
        shift = case_features.get("midline_shift_mm", 0.0)
        lesion_cnt = case_features.get("lesion_count", 1)
        edema_ratio = case_features.get("edema_ratio", 0.0)
        uncertainty = case_features.get("uncertainty_score", 0.0)

        if shift >= 3.0:
            score += 0.40
            rules_fired.append(f"Severe mass effect: midline shift ({shift:.1f} mm) >= 3.0 mm")
        elif shift >= 1.5:
            score += 0.20
            rules_fired.append(f"Moderate mass effect: midline shift ({shift:.1f} mm) >= 1.5 mm")

        if wt_vol >= 40.0:
            score += 0.25
            rules_fired.append(f"High tumour burden: Whole Tumour volume ({wt_vol:.1f} mL) >= 40.0 mL")
        elif wt_vol >= 20.0:
            score += 0.15
            rules_fired.append(f"Moderate tumour burden: Whole Tumour volume ({wt_vol:.1f} mL) >= 20.0 mL")

        if lesion_cnt > 1:
            score += 0.15
            rules_fired.append(f"Multifocality detected: {lesion_cnt} distinct spatial lesions")

        if uncertainty > 0.25:
            score += 0.10
            rules_fired.append(f"Elevated predictive uncertainty ({uncertainty:.2f} > 0.25)")

        final_score = round(min(1.0, score), 2)
        if len(rules_fired) == 0:
            rules_fired.append("Low volume focal lesion with zero midline displacement")

        return final_score, rules_fired
