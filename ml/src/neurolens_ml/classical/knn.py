"""K-Nearest Neighbours (KNN) Similar-Case Retrieval Engine (Section 6.5)."""

from typing import List, Dict, Any, Optional
import numpy as np
from sklearn.neighbors import NearestNeighbors


class CaseRetrievalKNN:
    """Case-based retrieval using KNN on PCA-reduced radiomic embeddings."""

    def __init__(self, metric: str = "cosine"):
        self.metric = metric
        self.nn_index = NearestNeighbors(metric=metric)
        self.case_records: List[Dict[str, Any]] = []
        self.is_indexed = False

    def build_index(self, embeddings: np.ndarray, metadata: List[Dict[str, Any]]):
        """Index historical cases with embeddings and clinical metadata."""
        if len(embeddings) != len(metadata):
            raise ValueError("Embeddings and metadata must have identical length")
        self.nn_index.fit(embeddings)
        self.case_records = metadata
        self.is_indexed = True

    def retrieve_similar(self, query_embedding: np.ndarray, k: int = 3) -> List[Dict[str, Any]]:
        """Find the top-k most similar cases in embedding space."""
        if not self.is_indexed:
            # Return empty or fallback
            return []

        query = query_embedding.reshape(1, -1)
        k_actual = min(k, len(self.case_records))
        distances, indices = self.nn_index.kneighbors(query, n_neighbors=k_actual)

        results = []
        for dist, idx in zip(distances[0], indices[0]):
            rec = self.case_records[idx].copy()
            # Cosine distance: similarity = 1 - distance
            similarity = max(0.0, min(1.0, 1.0 - float(dist))) if self.metric == "cosine" else 1.0 / (1.0 + float(dist))
            results.append({
                "case_id": rec.get("case_id", f"CASE-{idx:04d}"),
                "label": rec.get("label", "unknown"),
                "similarity": round(similarity, 3),
                "thumbnail_url": rec.get("thumbnail_url"),
            })

        return results
