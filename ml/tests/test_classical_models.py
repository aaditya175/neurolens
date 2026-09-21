"""Unit tests for classical ML syllabus modules (Section 6)."""

import numpy as np
import pytest
from sklearn.datasets import make_classification

from neurolens_ml.classical.classifiers import get_all_syllabus_models, evaluate_models_suite, compute_ece
from neurolens_ml.classical.habitats import HabitatClusterer
from neurolens_ml.classical.pca import PCAReducer
from neurolens_ml.classical.knn import CaseRetrievalKNN
from neurolens_ml.classical.triage_rules import TriageRulesEngine
from neurolens_ml.qc.ood_detector import OODDetector


def test_classical_classifiers_suite():
    X, y = make_classification(n_samples=80, n_features=12, n_classes=3, n_informative=8, random_state=42)
    X_train, X_test = X[:50], X[50:]
    y_train, y_test = y[:50], y[50:]

    results = evaluate_models_suite(X_train, y_train, X_test, y_test)

    expected_models = [
        "Logistic Regression",
        "Gaussian Naive Bayes",
        "K-Nearest Neighbours",
        "Decision Tree",
        "SVM (Linear)",
        "SVM (RBF Kernel)",
        "Random Forest",
        "AdaBoost",
        "Gradient Boosting",
        "Stacking Ensemble",
    ]

    for name in expected_models:
        assert name in results, f"Missing model {name} in suite results"
        assert 0.0 <= results[name]["accuracy"] <= 1.0
        assert 0.0 <= results[name]["macro_f1"] <= 1.0
        assert 0.0 <= results[name]["ece"] <= 1.0


def test_habitat_clustering():
    # 4-channel volume 16 x 16 x 16
    volumes_4ch = np.random.randn(4, 16, 16, 16).astype(np.float32)
    wt_mask = np.zeros((16, 16, 16), dtype=np.uint8)
    wt_mask[4:12, 4:12, 4:12] = 1

    # Test GMM
    gmm_clusterer = HabitatClusterer(k=3, method="gmm")
    h_map_gmm, meta_gmm = gmm_clusterer.cluster_habitats(volumes_4ch, wt_mask)
    assert meta_gmm["k"] == 3
    assert np.all(np.isin(np.unique(h_map_gmm[wt_mask > 0]), [1, 2, 3]))

    # Test K-Means
    km_clusterer = HabitatClusterer(k=2, method="kmeans")
    h_map_km, meta_km = km_clusterer.cluster_habitats(volumes_4ch, wt_mask)
    assert meta_km["k"] == 2
    assert np.all(np.isin(np.unique(h_map_km[wt_mask > 0]), [1, 2]))


def test_pca_and_knn_retrieval():
    X = np.random.randn(50, 20).astype(np.float32)
    reducer = PCAReducer(variance_retained=0.95)
    reducer.fit(X)

    X_red = reducer.transform_reduced(X)
    assert X_red.shape[1] < 20  # Dimension reduced
    X_2d = reducer.transform_2d(X)
    assert X_2d.shape == (50, 2)

    # Test KNN Retrieval
    metadata = [{"case_id": f"CASE-{i}", "label": "glioma" if i % 2 == 0 else "meningioma"} for i in range(50)]
    knn = CaseRetrievalKNN(metric="cosine")
    knn.build_index(X_red, metadata)

    query = X_red[0]
    similar = knn.retrieve_similar(query, k=3)
    assert len(similar) == 3
    assert similar[0]["case_id"] == "CASE-0"  # Nearest to itself


def test_triage_rules_and_ood():
    triage = TriageRulesEngine()
    case_feats = {
        "wt_volume_ml": 48.0,
        "midline_shift_mm": 3.4,
        "edema_ratio": 0.55,
        "lesion_count": 2,
        "uncertainty_score": 0.28,
    }
    score, rules = triage.evaluate_case(case_feats)
    assert score >= 0.7  # High urgency
    assert len(rules) >= 3

    # Test OOD Detector
    ood = OODDetector(method="one_class_svm", nu=0.1)
    X_normal = np.random.normal(0, 1, (100, 10))
    ood.fit(X_normal)

    # Normal case
    inlier, score = ood.score_case(np.zeros(10))
    assert inlier is True

    # Extreme outlier
    outlier, score_out = ood.score_case(np.ones(10) * 100.0)
    assert outlier is False
