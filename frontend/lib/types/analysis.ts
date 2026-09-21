/**
 * NeuroLens Analysis Result Types (Section 7.1 Contract)
 * Synchronized with backend/app/schemas/analysis.py and ml/src/neurolens_ml/schemas/analysis.py
 */

export interface ModelVersions {
  segmentation: string;
  classifier: string;
  classical: string;
}

export interface QCResult {
  passed: boolean;
  missing_sequences: string[];
  ood_score: number;
  warnings: string[];
}

export interface RegionMeasurement {
  volume_ml: number;
  max_diameter_mm: number;
  perp_diameter_mm: number;
  centroid_mm: [number, number, number];
}

export interface LesionItem {
  id: number;
  volume_ml: number;
  centroid_mm: [number, number, number];
}

export interface SegmentationResult {
  mask_url: string;
  uncertainty_url?: string | null;
  regions: {
    WT: RegionMeasurement;
    TC: RegionMeasurement;
    ET: RegionMeasurement;
    NCR: RegionMeasurement;
    ED: RegionMeasurement;
    [key: string]: RegionMeasurement;
  };
  lesions: LesionItem[];
  lesion_count: number;
}

export interface LocationResult {
  hemisphere: 'left' | 'right' | 'bilateral' | 'indeterminate' | string;
  lobes: string[];
  midline_shift_mm: number;
  confidence: 'approximate' | 'calibrated' | string;
}

export interface ClassifierOutput {
  label: 'glioma' | 'meningioma' | 'pituitary' | 'metastasis' | string;
  probs: Record<string, number>;
  model?: string | null;
}

export interface EnsembleClassification {
  label: 'glioma' | 'meningioma' | 'pituitary' | 'metastasis' | string;
  confidence: number;
  agree: boolean;
}

export interface ClassificationResult {
  cnn: ClassifierOutput;
  classical: ClassifierOutput;
  ensemble: EnsembleClassification;
}

export interface UncertaintyResult {
  case_score: number;
  needs_review: boolean;
  reasons: string[];
}

export interface HabitatsResult {
  method: 'gmm' | 'kmeans' | string;
  k: number;
  map_url?: string | null;
}

export interface RadiomicFeature {
  name: string;
  value: number;
  importance: number;
}

export interface SimilarCase {
  case_id: string;
  label: string;
  similarity: number;
  thumbnail_url?: string | null;
}

export interface UrgencyResult {
  score: number;
  rules_fired: string[];
}

export interface ExperimentalResult {
  idh_prediction?: string | null;
  survival_bin?: string | null;
}

export interface AnalysisResult {
  study_id: string;
  model_versions: ModelVersions;
  qc: QCResult;
  segmentation: SegmentationResult;
  location: LocationResult;
  classification: ClassificationResult;
  uncertainty: UncertaintyResult;
  habitats: HabitatsResult;
  radiomics_top_features: RadiomicFeature[];
  similar_cases: SimilarCase[];
  urgency: UrgencyResult;
  experimental: ExperimentalResult;
}
