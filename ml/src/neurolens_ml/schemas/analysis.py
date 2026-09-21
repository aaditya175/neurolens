"""Pydantic schemas for NeuroLens Analysis Result Contract (Section 7.1)."""

from typing import Dict, List, Optional, Tuple, Any
from pydantic import BaseModel, Field


class ModelVersions(BaseModel):
    segmentation: str = "swinunetr-v1"
    classifier: str = "effnet-v1"
    classical: str = "svm-rbf-v1"


class QCResult(BaseModel):
    passed: bool = True
    missing_sequences: List[str] = Field(default_factory=list)
    ood_score: float = 0.0
    warnings: List[str] = Field(default_factory=list)


class RegionMeasurement(BaseModel):
    volume_ml: float = 0.0
    max_diameter_mm: float = 0.0
    perp_diameter_mm: float = 0.0
    centroid_mm: Tuple[float, float, float] = (0.0, 0.0, 0.0)


class LesionItem(BaseModel):
    id: int
    volume_ml: float
    centroid_mm: Tuple[float, float, float]


class SegmentationResult(BaseModel):
    mask_url: str
    uncertainty_url: Optional[str] = None
    regions: Dict[str, RegionMeasurement]
    lesions: List[LesionItem] = Field(default_factory=list)
    lesion_count: int = 0


class LocationResult(BaseModel):
    hemisphere: str = "indeterminate"
    lobes: List[str] = Field(default_factory=list)
    midline_shift_mm: float = 0.0
    confidence: str = "approximate"


class ClassifierOutput(BaseModel):
    label: str
    probs: Dict[str, float] = Field(default_factory=dict)
    model: Optional[str] = None


class EnsembleClassification(BaseModel):
    label: str
    confidence: float
    agree: bool


class ClassificationResult(BaseModel):
    cnn: ClassifierOutput
    classical: ClassifierOutput
    ensemble: EnsembleClassification


class UncertaintyResult(BaseModel):
    case_score: float
    needs_review: bool
    reasons: List[str] = Field(default_factory=list)


class HabitatsResult(BaseModel):
    method: str = "gmm"
    k: int = 3
    map_url: Optional[str] = None


class RadiomicFeature(BaseModel):
    name: str
    value: float
    importance: float


class SimilarCase(BaseModel):
    case_id: str
    label: str
    similarity: float
    thumbnail_url: Optional[str] = None


class UrgencyResult(BaseModel):
    score: float
    rules_fired: List[str] = Field(default_factory=list)


class ExperimentalResult(BaseModel):
    idh_prediction: Optional[str] = None
    survival_bin: Optional[str] = None


class AnalysisResult(BaseModel):
    """The canonical analysis result contract across ML, backend, and frontend."""
    study_id: str
    model_versions: ModelVersions
    qc: QCResult
    segmentation: SegmentationResult
    location: LocationResult
    classification: ClassificationResult
    uncertainty: UncertaintyResult
    habitats: HabitatsResult
    radiomics_top_features: List[RadiomicFeature] = Field(default_factory=list)
    similar_cases: List[SimilarCase] = Field(default_factory=list)
    urgency: UrgencyResult
    experimental: ExperimentalResult = Field(default_factory=ExperimentalResult)
