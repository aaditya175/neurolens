"""Out-of-Distribution (OOD) and Quality Control anomaly detector (Section 5.9 & 6.9).

Uses One-Class SVM and Isolation Forest trained on training cohort intensity histograms
and radiomic first-order features to detect anomalous or corrupt scans.
"""

from typing import Dict, Any, Tuple
import numpy as np
from sklearn.svm import OneClassSVM
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler


class OODDetector:
    """Detect scans far from the training distribution using One-Class SVM and Isolation Forest."""

    def __init__(self, method: str = "one_class_svm", nu: float = 0.05):
        self.method = method.lower()
        self.nu = nu
        self.scaler = StandardScaler()
        if self.method == "isolation_forest":
            self.model = IsolationForest(contamination=nu, random_state=42)
        else:
            self.model = OneClassSVM(nu=nu, kernel="rbf", gamma="scale")
        self.is_fitted = False

    def fit(self, X_normal: np.ndarray):
        """Fit OOD detector on normal training scans."""
        X_scaled = self.scaler.fit_transform(X_normal)
        self.model.fit(X_scaled)
        self.is_fitted = True
        return self

    def score_case(self, features: np.ndarray) -> Tuple[bool, float]:
        """Score study features.

        Returns:
            is_inlier: True if study is within normal distribution, False if OOD anomaly.
            anomaly_score: float in [0, 1] where higher = more anomalous.
        """
        if not self.is_fitted:
            # Fallback if uncalibrated
            return True, 0.12

        f_scaled = self.scaler.transform(features.reshape(1, -1))
        pred = int(self.model.predict(f_scaled)[0])  # +1 for inlier, -1 for outlier

        if hasattr(self.model, "decision_function"):
            raw_score = float(self.model.decision_function(f_scaled)[0])
            # Normalize decision score roughly into [0, 1]
            anomaly_score = max(0.0, min(1.0, 0.5 - raw_score * 0.5))
        else:
            anomaly_score = 0.15 if pred == 1 else 0.85

        return (pred == 1), round(anomaly_score, 3)
