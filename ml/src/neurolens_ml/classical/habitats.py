"""Intra-tumour Habitat Clustering using K-Means and GMM (EM Algorithm) (Section 6.3)."""

from typing import Tuple, Dict, Any, Optional
import numpy as np
from sklearn.cluster import KMeans
from sklearn.mixture import GaussianMixture
from sklearn.metrics import silhouette_score


class HabitatClusterer:
    """Clustering tumour heterogeneity within Whole Tumour (WT) envelope."""

    def __init__(self, k: int = 3, method: str = "gmm"):
        self.k = k
        self.method = method.lower()
        self.model = None

    def find_optimal_k(self, feature_vectors: np.ndarray, k_range: Tuple[int, int] = (2, 5)) -> int:
        """Find optimal number of habitats using BIC (for GMM) or Silhouette (for K-Means)."""
        best_k = self.k
        if len(feature_vectors) < 50:
            return best_k

        sub_sample = feature_vectors[np.random.choice(len(feature_vectors), min(1000, len(feature_vectors)), replace=False)]

        if self.method == "gmm":
            best_bic = float("inf")
            for k in range(k_range[0], k_range[1] + 1):
                gmm = GaussianMixture(n_components=k, random_state=42)
                gmm.fit(sub_sample)
                bic = gmm.bic(sub_sample)
                if bic < best_bic:
                    best_bic = bic
                    best_k = k
        else:
            best_sil = -1.0
            for k in range(k_range[0], k_range[1] + 1):
                km = KMeans(n_clusters=k, n_init=5, random_state=42)
                labels = km.fit_predict(sub_sample)
                sil = float(silhouette_score(sub_sample, labels))
                if sil > best_sil:
                    best_sil = sil
                    best_k = k

        return best_k

    def cluster_habitats(
        self,
        volumes_4ch: np.ndarray,
        wt_mask: np.ndarray,
        auto_k: bool = False,
    ) -> Tuple[np.ndarray, Dict[str, Any]]:
        """Cluster voxel intensity vectors inside WT into discrete tumour habitats.

        Args:
            volumes_4ch: Multi-sequence normalized volumes [4, D, H, W]
            wt_mask: Binary mask for Whole Tumour [D, H, W]
            auto_k: If true, automatically select k using BIC/Silhouette

        Returns:
            habitat_map: 3D array with habitat indices 1..k (0=non-WT)
            metrics: dictionary with habitat proportions and cluster centroids
        """
        indices = np.argwhere(wt_mask > 0)
        d, h, w = wt_mask.shape
        habitat_map = np.zeros((d, h, w), dtype=np.uint8)

        if len(indices) == 0:
            return habitat_map, {"k": self.k, "proportions": {}}

        # Build feature matrix: each row is [T1, T1ce, T2, FLAIR]
        features = np.zeros((len(indices), 4), dtype=np.float32)
        for ch in range(4):
            features[:, ch] = volumes_4ch[ch][wt_mask > 0]

        k = self.find_optimal_k(features) if auto_k else self.k

        if self.method == "gmm":
            self.model = GaussianMixture(n_components=k, covariance_type="full", random_state=42)
            labels = self.model.fit_predict(features)
        else:
            self.model = KMeans(n_clusters=k, n_init=10, random_state=42)
            labels = self.model.fit_predict(features)

        # Habitat indices 1..k
        cluster_labels_1idx = (labels + 1).astype(np.uint8)
        habitat_map[wt_mask > 0] = cluster_labels_1idx

        # Calculate habitat percentage shares
        proportions = {}
        for c in range(1, k + 1):
            proportions[f"habitat_{c}"] = round(float(np.mean(cluster_labels_1idx == c)), 3)

        return habitat_map, {
            "method": self.method,
            "k": k,
            "proportions": proportions,
            "total_voxels": len(indices),
        }
