"""Principal Component Analysis (PCA) dimensionality reduction module (Section 6.4)."""

from typing import Tuple, Optional
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler


class PCAReducer:
    """PCA dimensionality reduction preserving 95% variance + 2D cohort visualization."""

    def __init__(self, variance_retained: float = 0.95):
        self.variance_retained = variance_retained
        self.scaler = StandardScaler()
        self.pca = PCA(n_components=variance_retained)
        self.pca_2d = PCA(n_components=2)
        self.is_fitted = False

    def fit(self, X: np.ndarray):
        """Fit scaler and PCA models on radiomics feature matrix."""
        X_scaled = self.scaler.fit_transform(X)
        self.pca.fit(X_scaled)
        self.pca_2d.fit(X_scaled)
        self.is_fitted = True
        return self

    def transform_reduced(self, X: np.ndarray) -> np.ndarray:
        """Transform features into reduced representation preserving specified variance."""
        if not self.is_fitted:
            raise RuntimeError("PCAReducer must be fitted before transform")
        X_scaled = self.scaler.transform(X)
        return self.pca.transform(X_scaled)

    def transform_2d(self, X: np.ndarray) -> np.ndarray:
        """Transform features into 2D coordinates for UI cohort scatter plot."""
        if not self.is_fitted:
            raise RuntimeError("PCAReducer must be fitted before transform")
        X_scaled = self.scaler.transform(X)
        return self.pca_2d.transform(X_scaled)

    @property
    def n_components_retained(self) -> int:
        return self.pca.n_components_
