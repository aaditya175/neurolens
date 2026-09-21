"""Classical Machine Learning module implementing Mumbai University ML syllabus algorithms."""

from .dbscan import DBSCANLesionClusterer
from .classifiers import get_all_syllabus_models, evaluate_models_suite, compute_ece
from .habitats import HabitatClusterer
from .pca import PCAReducer
from .knn import CaseRetrievalKNN
from .triage_rules import TriageRulesEngine

__all__ = [
    "DBSCANLesionClusterer",
    "get_all_syllabus_models",
    "evaluate_models_suite",
    "compute_ece",
    "HabitatClusterer",
    "PCAReducer",
    "CaseRetrievalKNN",
    "TriageRulesEngine",
]
