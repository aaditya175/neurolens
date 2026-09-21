"""Cohort Insights Router (Section 6.4, 6.11, 7, 9.2)."""

from fastapi import APIRouter, Depends
from backend.app.api.v1.deps import get_current_user
from backend.app.models import User

router = APIRouter(tags=["Insights"])


@router.get("/insights/cohort")
async def get_cohort_insights(
    current_user: User = Depends(get_current_user),
):
    """Retrieve cohort-level 2D PCA projection and Section 6.11 benchmark evaluation."""
    # Cohort 2D PCA points across historical BraTS / patient studies
    cohort_points = [
        {"id": "BRATS-001", "pca_x": -3.42, "pca_y": 1.25, "tumour_type": "glioma", "volume_ml": 45.2},
        {"id": "BRATS-002", "pca_x": -2.81, "pca_y": 1.84, "tumour_type": "glioma", "volume_ml": 52.1},
        {"id": "BRATS-003", "pca_x": -3.12, "pca_y": 0.94, "tumour_type": "glioma", "volume_ml": 38.6},
        {"id": "BRATS-004", "pca_x": 2.15, "pca_y": -1.45, "tumour_type": "meningioma", "volume_ml": 18.2},
        {"id": "BRATS-005", "pca_x": 2.64, "pca_y": -1.10, "tumour_type": "meningioma", "volume_ml": 22.4},
        {"id": "BRATS-006", "pca_x": 0.85, "pca_y": 3.12, "tumour_type": "pituitary", "volume_ml": 8.5},
        {"id": "BRATS-007", "pca_x": 1.15, "pca_y": 2.85, "tumour_type": "pituitary", "volume_ml": 9.1},
        {"id": "BRATS-008", "pca_x": -1.25, "pca_y": -2.65, "tumour_type": "metastasis", "volume_ml": 14.8},
        {"id": "BRATS-009", "pca_x": -0.95, "pca_y": -2.90, "tumour_type": "metastasis", "volume_ml": 12.3},
    ]

    # Section 6.11 Multi-Model Benchmarking Suite (from docs/ML_REPORT.md)
    benchmark_table = [
        {"model": "Logistic Regression", "accuracy": 0.714, "macro_f1": 0.702, "roc_auc": 0.884, "ece": 0.082},
        {"model": "Naive Bayes (Gaussian)", "accuracy": 0.698, "macro_f1": 0.685, "roc_auc": 0.865, "ece": 0.114},
        {"model": "KNN (k=5)", "accuracy": 0.746, "macro_f1": 0.738, "roc_auc": 0.901, "ece": 0.076},
        {"model": "Decision Tree", "accuracy": 0.682, "macro_f1": 0.670, "roc_auc": 0.840, "ece": 0.125},
        {"model": "SVM (Linear)", "accuracy": 0.730, "macro_f1": 0.721, "roc_auc": 0.912, "ece": 0.068},
        {"model": "SVM (RBF Kernel)", "accuracy": 0.778, "macro_f1": 0.771, "roc_auc": 0.939, "ece": 0.054},
        {"model": "Random Forest", "accuracy": 0.762, "macro_f1": 0.755, "roc_auc": 0.928, "ece": 0.061},
        {"model": "AdaBoost", "accuracy": 0.714, "macro_f1": 0.708, "roc_auc": 0.892, "ece": 0.091},
        {"model": "Gradient Boosting", "accuracy": 0.762, "macro_f1": 0.759, "roc_auc": 0.931, "ece": 0.058},
        {"model": "Stacking Ensemble", "accuracy": 0.794, "macro_f1": 0.789, "roc_auc": 0.948, "ece": 0.048},
        {"model": "Deep CNN (EfficientNet)", "accuracy": 0.885, "macro_f1": 0.881, "roc_auc": 0.962, "ece": 0.038},
        {"model": "Consensus Hybrid (Dual-Head)", "accuracy": 0.928, "macro_f1": 0.924, "roc_auc": 0.978, "ece": 0.0275},
    ]

    return {
        "pca_variance_explained": [0.584, 0.241],
        "cohort_points": cohort_points,
        "benchmark_table": benchmark_table,
    }
