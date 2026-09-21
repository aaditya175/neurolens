/**
 * Comprehensive Patient Clinical Catalog
 * Provides anatomically accurate, case-specific data for every patient in NeuroLens.
 */

import { AnalysisResult } from "./types/analysis";

export interface LongitudinalComparison {
  baselineDate: string;
  followupDate: string;
  earlierWT: number;
  latestWT: number;
  earlierTC: number;
  latestTC: number;
  earlierET: number;
  latestET: number;
  earlierED: number;
  latestED: number;
  status: "Progressive Disease (PD)" | "Partial Response (PR)" | "Stable Disease (SD)" | "Complete Response (CR)" | "Baseline Reference";
  isGrowth: boolean;
  deltaPercent: number;
  summaryText: string;
}

export interface PatientTimelineItem {
  study_id: string;
  date: string;
  scan_type: string;
  wt_ml: number;
  tc_ml: number;
  et_ml: number;
  response: string;
  is_progression: boolean;
}

export interface PatientProfile {
  id: string;
  code: string;
  age: number;
  sex: string;
  tumourType: string;
  isMalignant: boolean;
  scenarioName: string;
  description: string;
  clinicalImpression: string;
  longitudinal: LongitudinalComparison;
  timeline: PatientTimelineItem[];
  // 2D Viewer configuration: center [x, y, z] in 0-95 space, and radii for ED, ET, NCR
  viewerLesions: Array<{
    cx: number;
    cy: number;
    cz: number;
    r_ed: number;
    r_et: number;
    r_ncr: number;
  }>;
  analysis: AnalysisResult;
}

export const PATIENT_CATALOG: Record<string, PatientProfile> = {
  // 1. Classic High-Grade Glioblastoma (PT-70194)
  "856c7e19-a1ae-4298-94f5-d4ad0bdc6072": {
    id: "856c7e19-a1ae-4298-94f5-d4ad0bdc6072",
    code: "PT-70194",
    age: 58,
    sex: "Male",
    tumourType: "Glioblastoma",
    isMalignant: true,
    scenarioName: "High-Grade Glioblastoma Multiforme (GBM)",
    description: "Large fronto-temporal mass with central necrotic core, prominent active rim, extensive swelling, and 2.3 mm midline shift.",
    clinicalImpression: "Large right frontotemporal intra-axial enhancing brain mass consistent with high-grade glioma (Malignant). Significant mass effect with 2.3 mm midline brain shift. Substantial peritumoural edema noted around the active rim. Urgent neurosurgical evaluation advised.",
    longitudinal: {
      baselineDate: "2026-05-14",
      followupDate: "2026-09-20",
      earlierWT: 38.6,
      latestWT: 46.8,
      earlierTC: 19.4,
      latestTC: 25.3,
      earlierET: 11.2,
      latestET: 16.1,
      earlierED: 19.2,
      latestED: 21.5,
      status: "Progressive Disease (PD)",
      isGrowth: true,
      deltaPercent: 21.2,
      summaryText: "The total tumour volume increased from 38.6 mL to 46.8 mL (+21.2%). Active growing rim (ET) expanded by +4.9 mL (+43.8%), indicating Progressive Disease under RANO criteria.",
    },
    timeline: [
      { study_id: "856c7e19-a1ae-4298-94f5-d4ad0bdc6072", date: "2026-09-20", scan_type: "Latest Follow-up", wt_ml: 46.8, tc_ml: 25.3, et_ml: 16.1, response: "Tumour Growth (+21.2%)", is_progression: true },
      { study_id: "856c7e19-prev-01", date: "2026-05-14", scan_type: "Post-Chemoradiation", wt_ml: 38.6, tc_ml: 19.4, et_ml: 11.2, response: "Stable Scan", is_progression: false },
      { study_id: "856c7e19-prev-00", date: "2026-01-10", scan_type: "Initial Baseline", wt_ml: 52.4, tc_ml: 31.0, et_ml: 23.5, response: "Pre-Operative Baseline", is_progression: false },
    ],
    viewerLesions: [
      { cx: 62, cy: 40, cz: 50, r_ed: 36, r_et: 22, r_ncr: 11 }
    ],
    analysis: {
      study_id: "856c7e19-a1ae-4298-94f5-d4ad0bdc6072",
      model_versions: { segmentation: "swinunetr-v1", classifier: "effnet-v1", classical: "svm-rbf-v1" },
      qc: { passed: true, missing_sequences: [], ood_score: 0.12, warnings: [] },
      segmentation: {
        mask_url: "/api/v1/studies/856c7e19-a1ae-4298-94f5-d4ad0bdc6072/mask",
        uncertainty_url: "/api/v1/studies/856c7e19-a1ae-4298-94f5-d4ad0bdc6072/uncertainty",
        regions: {
          WT: { volume_ml: 46.8, max_diameter_mm: 39.4, perp_diameter_mm: 32.1, centroid_mm: [14.2, -8.6, 22.1] },
          TC: { volume_ml: 25.3, max_diameter_mm: 27.2, perp_diameter_mm: 21.8, centroid_mm: [14.5, -8.8, 22.0] },
          ET: { volume_ml: 16.1, max_diameter_mm: 24.0, perp_diameter_mm: 20.1, centroid_mm: [14.6, -8.7, 22.3] },
          NCR: { volume_ml: 9.2, max_diameter_mm: 14.8, perp_diameter_mm: 11.9, centroid_mm: [14.0, -9.0, 21.8] },
          ED: { volume_ml: 21.5, max_diameter_mm: 39.4, perp_diameter_mm: 32.1, centroid_mm: [13.8, -8.2, 22.4] },
        },
        lesions: [{ id: 1, volume_ml: 46.8, centroid_mm: [14.2, -8.6, 22.1] }],
        lesion_count: 1,
      },
      location: { hemisphere: "right", lobes: ["frontal", "temporal"], midline_shift_mm: 2.3, confidence: "approximate" },
      classification: {
        cnn: { label: "glioma", probs: { glioma: 0.89, meningioma: 0.05, pituitary: 0.02, metastasis: 0.04 } },
        classical: { label: "glioma", probs: { glioma: 0.83, meningioma: 0.09, pituitary: 0.02, metastasis: 0.06 }, model: "svm-rbf" },
        ensemble: { label: "glioma", confidence: 0.86, agree: true },
      },
      uncertainty: { case_score: 0.17, needs_review: true, reasons: ["Elevated boundary entropy at temporal lobe margin"] },
      habitats: { method: "gmm", k: 3, map_url: null },
      radiomics_top_features: [
        { name: "Contrast (Intensity Variation)", value: 14.8, importance: 0.34 },
        { name: "Entropy (Tissue Irregularity)", value: 5.2, importance: 0.29 },
        { name: "Elongation (Irregular Shape)", value: 0.72, importance: 0.21 },
      ],
      similar_cases: [
        { case_id: "BRATS21-00219", label: "glioma", similarity: 0.95 },
        { case_id: "BRATS21-00441", label: "glioma", similarity: 0.91 },
        { case_id: "BRATS21-00108", label: "glioma", similarity: 0.87 },
      ],
      urgency: { score: 0.88, rules_fired: ["Midline shift > 2.0 mm (Brain pressure)", "Large WT volume (>40 mL)"] },
      experimental: { idh_prediction: "wildtype", survival_bin: "medium" },
    },
  },

  // 2. Emergency Massive GBM with 6.5 mm Midline Shift (PT-99412)
  "c11-massive-shift-uuid": {
    id: "c11-massive-shift-uuid",
    code: "PT-99412",
    age: 64,
    sex: "Male",
    tumourType: "Glioblastoma",
    isMalignant: true,
    scenarioName: "Massive GBM with Severe Midline Herniation",
    description: "Emergency case: giant 68.4 mL right hemispheric glioblastoma with critical 6.5 mm midline shift.",
    clinicalImpression: "CRITICAL: Giant right hemispheric glioblastoma multiforme (Malignant) causing severe 6.5 mm midline herniation and lateral ventricular effacement. Immediate decompressive neurosurgical intervention indicated.",
    longitudinal: {
      baselineDate: "2026-07-02",
      followupDate: "2026-09-21",
      earlierWT: 49.0,
      latestWT: 68.4,
      earlierTC: 28.0,
      latestTC: 38.6,
      earlierET: 17.5,
      latestET: 24.5,
      earlierED: 21.0,
      latestED: 29.8,
      status: "Progressive Disease (PD)",
      isGrowth: true,
      deltaPercent: 39.6,
      summaryText: "Critical rapid expansion (+39.6%) over 11 weeks. Midline herniation worsened from 2.8 mm to 6.5 mm.",
    },
    timeline: [
      { study_id: "c11-massive-shift-uuid", date: "2026-09-21", scan_type: "Emergency Admission", wt_ml: 68.4, tc_ml: 38.6, et_ml: 24.5, response: "Critical Growth (+39.6%)", is_progression: true },
      { study_id: "c11-earlier-01", date: "2026-07-02", scan_type: "Initial Presentation", wt_ml: 49.0, tc_ml: 28.0, et_ml: 17.5, response: "Baseline Scan", is_progression: false },
    ],
    viewerLesions: [
      { cx: 65, cy: 38, cz: 48, r_ed: 48, r_et: 30, r_ncr: 18 }
    ],
    analysis: {
      study_id: "c11-massive-shift-uuid",
      model_versions: { segmentation: "swinunetr-v1", classifier: "effnet-v1", classical: "svm-rbf-v1" },
      qc: { passed: true, missing_sequences: [], ood_score: 0.18, warnings: ["Severe mass effect detected"] },
      segmentation: {
        mask_url: "/api/v1/studies/c11-massive-shift-uuid/mask",
        uncertainty_url: "/api/v1/studies/c11-massive-shift-uuid/uncertainty",
        regions: {
          WT: { volume_ml: 68.4, max_diameter_mm: 52.8, perp_diameter_mm: 44.2, centroid_mm: [18.2, -7.1, 20.4] },
          TC: { volume_ml: 38.6, max_diameter_mm: 36.5, perp_diameter_mm: 29.8, centroid_mm: [18.4, -7.3, 20.5] },
          ET: { volume_ml: 24.5, max_diameter_mm: 32.1, perp_diameter_mm: 26.4, centroid_mm: [18.5, -7.2, 20.6] },
          NCR: { volume_ml: 14.1, max_diameter_mm: 21.0, perp_diameter_mm: 17.2, centroid_mm: [18.1, -7.5, 20.2] },
          ED: { volume_ml: 29.8, max_diameter_mm: 52.8, perp_diameter_mm: 44.2, centroid_mm: [17.9, -6.8, 20.9] },
        },
        lesions: [{ id: 1, volume_ml: 68.4, centroid_mm: [18.2, -7.1, 20.4] }],
        lesion_count: 1,
      },
      location: { hemisphere: "right", lobes: ["frontal", "temporal", "parietal"], midline_shift_mm: 6.5, confidence: "high" },
      classification: {
        cnn: { label: "glioma", probs: { glioma: 0.94, meningioma: 0.02, pituitary: 0.01, metastasis: 0.03 } },
        classical: { label: "glioma", probs: { glioma: 0.91, meningioma: 0.03, pituitary: 0.01, metastasis: 0.05 }, model: "svm-rbf" },
        ensemble: { label: "glioma", confidence: 0.93, agree: true },
      },
      uncertainty: { case_score: 0.28, needs_review: true, reasons: ["CRITICAL: 6.5 mm midline shift", "Extensive vasogenic edema with sulcal effacement"] },
      habitats: { method: "gmm", k: 3, map_url: null },
      radiomics_top_features: [
        { name: "Contrast (Intensity Variation)", value: 22.4, importance: 0.42 },
        { name: "Sphericity (Irregular Invasive Border)", value: 0.38, importance: 0.31 },
        { name: "Kurtosis (Dense Infiltration)", value: 4.8, importance: 0.18 },
      ],
      similar_cases: [
        { case_id: "BRATS21-00892", label: "glioma", similarity: 0.97 },
        { case_id: "BRATS21-00104", label: "glioma", similarity: 0.93 },
      ],
      urgency: { score: 0.98, rules_fired: ["CRITICAL: Midline shift > 5.0 mm", "WT volume > 60 mL (Extreme Mass Effect)"] },
      experimental: { idh_prediction: "wildtype", survival_bin: "poor" },
    },
  },

  // 3. Multifocal Brain Metastases (PT-90114) - 3 LESIONS
  "331d2b99-a9fe-4411-921c-a1bd99cd1044": {
    id: "331d2b99-a9fe-4411-921c-a1bd99cd1044",
    code: "PT-90114",
    age: 63,
    sex: "Male",
    tumourType: "Metastasis",
    isMalignant: true,
    scenarioName: "Multifocal Cerebral Metastases (3 Discrete Spots)",
    description: "Three distinct round metastatic nodules with dense peripheral enhancement and ring edema in both hemispheres.",
    clinicalImpression: "Multiple (3) distinct enhancing brain lesions consistent with secondary cerebral metastases (Malignant). Discrete grey-white junction distribution with mild bilateral surrounding edema. Stereotactic radiosurgery (SRS) consult recommended.",
    longitudinal: {
      baselineDate: "2026-06-18",
      followupDate: "2026-09-19",
      earlierWT: 26.2,
      latestWT: 31.0,
      earlierTC: 15.1,
      latestTC: 18.2,
      earlierET: 12.0,
      latestET: 14.5,
      earlierED: 11.1,
      latestED: 12.8,
      status: "Progressive Disease (PD)",
      isGrowth: true,
      deltaPercent: 18.3,
      summaryText: "Total metastatic volume increased from 26.2 mL to 31.0 mL (+18.3%). Third cerebellar nodule has enlarged.",
    },
    timeline: [
      { study_id: "331d2b99-a9fe-4411-921c-a1bd99cd1044", date: "2026-09-19", scan_type: "Restaging Follow-up", wt_ml: 31.0, tc_ml: 18.2, et_ml: 14.5, response: "Progression (+18.3%)", is_progression: true },
      { study_id: "331d2b99-prev-01", date: "2026-06-18", scan_type: "Baseline Staging", wt_ml: 26.2, tc_ml: 15.1, et_ml: 12.0, response: "Baseline 2 Lesions", is_progression: false },
    ],
    viewerLesions: [
      { cx: 34, cy: 38, cz: 48, r_ed: 16, r_et: 10, r_ncr: 4 },
      { cx: 64, cy: 55, cz: 52, r_ed: 13, r_et: 8, r_ncr: 0 },
      { cx: 52, cy: 28, cz: 36, r_ed: 11, r_et: 7, r_ncr: 0 }
    ],
    analysis: {
      study_id: "331d2b99-a9fe-4411-921c-a1bd99cd1044",
      model_versions: { segmentation: "swinunetr-v1", classifier: "effnet-v1", classical: "svm-rbf-v1" },
      qc: { passed: true, missing_sequences: [], ood_score: 0.15, warnings: [] },
      segmentation: {
        mask_url: "/api/v1/studies/331d2b99-a9fe-4411-921c-a1bd99cd1044/mask",
        uncertainty_url: "/api/v1/studies/331d2b99-a9fe-4411-921c-a1bd99cd1044/uncertainty",
        regions: {
          WT: { volume_ml: 31.0, max_diameter_mm: 24.5, perp_diameter_mm: 21.0, centroid_mm: [-16.2, 8.4, 14.1] },
          TC: { volume_ml: 18.2, max_diameter_mm: 19.8, perp_diameter_mm: 17.2, centroid_mm: [-16.2, 8.4, 14.1] },
          ET: { volume_ml: 14.5, max_diameter_mm: 18.2, perp_diameter_mm: 16.0, centroid_mm: [-16.2, 8.4, 14.1] },
          NCR: { volume_ml: 3.7, max_diameter_mm: 8.5, perp_diameter_mm: 7.0, centroid_mm: [-16.2, 8.4, 14.1] },
          ED: { volume_ml: 12.8, max_diameter_mm: 24.5, perp_diameter_mm: 21.0, centroid_mm: [-16.2, 8.4, 14.1] },
        },
        lesions: [
          { id: 1, volume_ml: 16.4, centroid_mm: [-16.2, 8.4, 14.1] },
          { id: 2, volume_ml: 8.9, centroid_mm: [15.1, -12.4, 18.2] },
          { id: 3, volume_ml: 5.7, centroid_mm: [4.8, 14.2, -10.5] },
        ],
        lesion_count: 3,
      },
      location: { hemisphere: "bilateral", lobes: ["frontal", "temporal", "cerebellar"], midline_shift_mm: 0.8, confidence: "high" },
      classification: {
        cnn: { label: "metastasis", probs: { glioma: 0.12, meningioma: 0.02, pituitary: 0.01, metastasis: 0.85 } },
        classical: { label: "metastasis", probs: { glioma: 0.15, meningioma: 0.03, pituitary: 0.01, metastasis: 0.81 }, model: "svm-rbf" },
        ensemble: { label: "metastasis", confidence: 0.83, agree: true },
      },
      uncertainty: { case_score: 0.21, needs_review: true, reasons: ["Multifocal presentation (3 discrete lesions)", "Bilateral distribution"] },
      habitats: { method: "gmm", k: 3, map_url: null },
      radiomics_top_features: [
        { name: "Centroid Dispersion (Multifocal Spread)", value: 34.2, importance: 0.45 },
        { name: "Radial Symmetry (Round Metastatic Margins)", value: 0.82, importance: 0.28 },
      ],
      similar_cases: [
        { case_id: "TCIA-MET-0034", label: "metastasis", similarity: 0.93 },
        { case_id: "TCIA-MET-0078", label: "metastasis", similarity: 0.89 },
      ],
      urgency: { score: 0.79, rules_fired: ["Multifocal lesions detected (>1 spot)", "Secondary metastatic presentation"] },
      experimental: { idh_prediction: null, survival_bin: null },
    },
  },

  // 4. Miliary Brain Metastases (PT-66301) - 5 SEEDS
  "c14-miliary-met-uuid": {
    id: "c14-miliary-met-uuid",
    code: "PT-66301",
    age: 59,
    sex: "Female",
    tumourType: "Metastasis",
    isMalignant: true,
    scenarioName: "Miliary Cerebral Metastases (5 Punctate Seeds)",
    description: "Five small punctate enhancing metastatic seeds distributed bilaterally across both hemispheres.",
    clinicalImpression: "Disseminated miliary cerebral metastases (Malignant) with 5 distinct enhancing nodules across cerebral hemispheres. Minimal mass effect. Whole-brain radiation or targeted systemic therapy indicated.",
    longitudinal: {
      baselineDate: "2026-07-15",
      followupDate: "2026-09-21",
      earlierWT: 9.3,
      latestWT: 12.6,
      earlierTC: 7.2,
      latestTC: 9.8,
      earlierET: 6.4,
      latestET: 8.5,
      earlierED: 2.1,
      latestED: 2.8,
      status: "Progressive Disease (PD)",
      isGrowth: true,
      deltaPercent: 35.5,
      summaryText: "Volume grew from 9.3 mL to 12.6 mL (+35.5%) with 2 new punctate nodules appearing since July.",
    },
    timeline: [
      { study_id: "c14-miliary-met-uuid", date: "2026-09-21", scan_type: "Restaging MRI", wt_ml: 12.6, tc_ml: 9.8, et_ml: 8.5, response: "2 New Seeds (+35.5%)", is_progression: true },
      { study_id: "c14-earlier-01", date: "2026-07-15", scan_type: "Staging Scan", wt_ml: 9.3, tc_ml: 7.2, et_ml: 6.4, response: "Initial 3 Seeds", is_progression: false },
    ],
    viewerLesions: [
      { cx: 32, cy: 36, cz: 50, r_ed: 8, r_et: 5, r_ncr: 0 },
      { cx: 62, cy: 42, cz: 45, r_ed: 7, r_et: 5, r_ncr: 0 },
      { cx: 40, cy: 60, cz: 55, r_ed: 6, r_et: 4, r_ncr: 0 },
      { cx: 55, cy: 25, cz: 40, r_ed: 6, r_et: 4, r_ncr: 0 },
      { cx: 30, cy: 52, cz: 35, r_ed: 5, r_et: 3, r_ncr: 0 }
    ],
    analysis: {
      study_id: "c14-miliary-met-uuid",
      model_versions: { segmentation: "swinunetr-v1", classifier: "effnet-v1", classical: "svm-rbf-v1" },
      qc: { passed: true, missing_sequences: [], ood_score: 0.14, warnings: [] },
      segmentation: {
        mask_url: "/api/v1/studies/c14-miliary-met-uuid/mask",
        uncertainty_url: "/api/v1/studies/c14-miliary-met-uuid/uncertainty",
        regions: {
          WT: { volume_ml: 12.6, max_diameter_mm: 14.2, perp_diameter_mm: 12.0, centroid_mm: [-10.4, 5.2, 12.0] },
          TC: { volume_ml: 9.8, max_diameter_mm: 11.0, perp_diameter_mm: 9.8, centroid_mm: [-10.4, 5.2, 12.0] },
          ET: { volume_ml: 8.5, max_diameter_mm: 10.5, perp_diameter_mm: 9.2, centroid_mm: [-10.4, 5.2, 12.0] },
          NCR: { volume_ml: 1.3, max_diameter_mm: 4.0, perp_diameter_mm: 3.5, centroid_mm: [-10.4, 5.2, 12.0] },
          ED: { volume_ml: 2.8, max_diameter_mm: 14.2, perp_diameter_mm: 12.0, centroid_mm: [-10.4, 5.2, 12.0] },
        },
        lesions: [
          { id: 1, volume_ml: 4.1, centroid_mm: [-12.0, 4.0, 10.0] },
          { id: 2, volume_ml: 3.2, centroid_mm: [14.0, -6.0, 8.0] },
          { id: 3, volume_ml: 2.4, centroid_mm: [-6.0, 18.0, 16.0] },
          { id: 4, volume_ml: 1.8, centroid_mm: [10.0, -14.0, -4.0] },
          { id: 5, volume_ml: 1.1, centroid_mm: [-14.0, 12.0, -8.0] },
        ],
        lesion_count: 5,
      },
      location: { hemisphere: "bilateral", lobes: ["frontal", "parietal", "occipital"], midline_shift_mm: 0.2, confidence: "high" },
      classification: {
        cnn: { label: "metastasis", probs: { glioma: 0.08, meningioma: 0.02, pituitary: 0.01, metastasis: 0.89 } },
        classical: { label: "metastasis", probs: { glioma: 0.11, meningioma: 0.03, pituitary: 0.01, metastasis: 0.85 }, model: "svm-rbf" },
        ensemble: { label: "metastasis", confidence: 0.87, agree: true },
      },
      uncertainty: { case_score: 0.19, needs_review: true, reasons: ["Disseminated miliary presentation (5 seeds)"] },
      habitats: { method: "kmeans", k: 2, map_url: null },
      radiomics_top_features: [
        { name: "Punctate Ring Sharpness", value: 0.88, importance: 0.46 },
        { name: "Bilateral Dispersion Index", value: 41.5, importance: 0.38 },
      ],
      similar_cases: [
        { case_id: "TCIA-MET-0112", label: "metastasis", similarity: 0.94 },
      ],
      urgency: { score: 0.82, rules_fired: ["Miliary disseminated metastases (>3 spots)"] },
      experimental: { idh_prediction: null, survival_bin: null },
    },
  },

  // 5. Frontal Oligodendroglioma (PT-55219)
  "c09-oligodendro-uuid": {
    id: "c09-oligodendro-uuid",
    code: "PT-55219",
    age: 41,
    sex: "Female",
    tumourType: "Oligodendroglioma",
    isMalignant: true,
    scenarioName: "Left Frontal Oligodendroglioma (IDH Mutant)",
    description: "Infiltrative left frontal cortical mass with patchy enhancement and moderate surrounding T2/FLAIR hyperintensity.",
    clinicalImpression: "Left frontal infiltrative glial neoplasm consistent with oligodendroglioma (Malignant). Patchy enhancement and mild 1.1 mm midline displacement. Likely 1p/19q co-deleted subtype.",
    longitudinal: {
      baselineDate: "2026-03-10",
      followupDate: "2026-09-21",
      earlierWT: 27.9,
      latestWT: 28.5,
      earlierTC: 13.8,
      latestTC: 14.2,
      earlierET: 6.5,
      latestET: 6.8,
      earlierED: 14.1,
      latestED: 14.3,
      status: "Stable Disease (SD)",
      isGrowth: false,
      deltaPercent: 2.1,
      summaryText: "Minimal volume increase (+2.1%) over 6 months, consistent with Stable Disease under RANO criteria.",
    },
    timeline: [
      { study_id: "c09-oligodendro-uuid", date: "2026-09-21", scan_type: "6-Month Surveillance", wt_ml: 28.5, tc_ml: 14.2, et_ml: 6.8, response: "Stable (+2.1%)", is_progression: false },
      { study_id: "c09-earlier-01", date: "2026-03-10", scan_type: "Baseline Surveillance", wt_ml: 27.9, tc_ml: 13.8, et_ml: 6.5, response: "Baseline Scan", is_progression: false },
    ],
    viewerLesions: [
      { cx: 35, cy: 38, cz: 52, r_ed: 24, r_et: 14, r_ncr: 6 }
    ],
    analysis: {
      study_id: "c09-oligodendro-uuid",
      model_versions: { segmentation: "swinunetr-v1", classifier: "effnet-v1", classical: "svm-rbf-v1" },
      qc: { passed: true, missing_sequences: [], ood_score: 0.09, warnings: [] },
      segmentation: {
        mask_url: "/api/v1/studies/c09-oligodendro-uuid/mask",
        uncertainty_url: "/api/v1/studies/c09-oligodendro-uuid/uncertainty",
        regions: {
          WT: { volume_ml: 28.5, max_diameter_mm: 31.0, perp_diameter_mm: 26.5, centroid_mm: [-12.4, 14.2, 18.0] },
          TC: { volume_ml: 14.2, max_diameter_mm: 22.0, perp_diameter_mm: 18.5, centroid_mm: [-12.4, 14.2, 18.0] },
          ET: { volume_ml: 6.8, max_diameter_mm: 16.0, perp_diameter_mm: 13.5, centroid_mm: [-12.4, 14.2, 18.0] },
          NCR: { volume_ml: 7.4, max_diameter_mm: 12.0, perp_diameter_mm: 10.0, centroid_mm: [-12.4, 14.2, 18.0] },
          ED: { volume_ml: 14.3, max_diameter_mm: 31.0, perp_diameter_mm: 26.5, centroid_mm: [-12.4, 14.2, 18.0] },
        },
        lesions: [{ id: 1, volume_ml: 28.5, centroid_mm: [-12.4, 14.2, 18.0] }],
        lesion_count: 1,
      },
      location: { hemisphere: "left", lobes: ["frontal"], midline_shift_mm: 1.1, confidence: "high" },
      classification: {
        cnn: { label: "glioma", probs: { glioma: 0.88, meningioma: 0.04, pituitary: 0.01, metastasis: 0.07 } },
        classical: { label: "glioma", probs: { glioma: 0.84, meningioma: 0.05, pituitary: 0.02, metastasis: 0.09 }, model: "svm-rbf" },
        ensemble: { label: "glioma", confidence: 0.86, agree: true },
      },
      uncertainty: { case_score: 0.12, needs_review: false, reasons: [] },
      habitats: { method: "gmm", k: 3, map_url: null },
      radiomics_top_features: [
        { name: "Calcification Signal Texture", value: 18.2, importance: 0.38 },
        { name: "Cortical Infiltration Pattern", value: 0.74, importance: 0.31 },
      ],
      similar_cases: [
        { case_id: "BRATS21-00305", label: "glioma", similarity: 0.92 },
      ],
      urgency: { score: 0.68, rules_fired: ["Frontal cortical infiltration", "Mild midline shift (1.1 mm)"] },
      experimental: { idh_prediction: "mutant", survival_bin: "good" },
    },
  },

  // 6. Cystic Astrocytoma (PT-31084)
  "c07-cystic-astro-uuid": {
    id: "c07-cystic-astro-uuid",
    code: "PT-31084",
    age: 36,
    sex: "Male",
    tumourType: "Astrocytoma",
    isMalignant: true,
    scenarioName: "Posterior Fossa Pilocytic Astrocytoma",
    description: "Cerebellar cystic mass with vivid mural enhancing nodule and minimal parenchymal edema.",
    clinicalImpression: "Right cerebellar hemisphere cystic mass with enhancing mural nodule, typical of astrocytoma (Malignant / Low-Grade). 0.5 mm subtle fourth ventricle compression. Excellent surgical target.",
    longitudinal: {
      baselineDate: "2026-04-12",
      followupDate: "2026-09-20",
      earlierWT: 18.5,
      latestWT: 18.2,
      earlierTC: 11.8,
      latestTC: 11.5,
      earlierET: 7.4,
      latestET: 7.2,
      earlierED: 6.7,
      latestED: 6.7,
      status: "Stable Disease (SD)",
      isGrowth: false,
      deltaPercent: -1.6,
      summaryText: "Volume remains essentially unchanged (-1.6%), confirming Stable Disease.",
    },
    timeline: [
      { study_id: "c07-cystic-astro-uuid", date: "2026-09-20", scan_type: "Pre-Surgical Follow-up", wt_ml: 18.2, tc_ml: 11.5, et_ml: 7.2, response: "Stable (-1.6%)", is_progression: false },
      { study_id: "c07-earlier-01", date: "2026-04-12", scan_type: "Diagnostic Scan", wt_ml: 18.5, tc_ml: 11.8, et_ml: 7.4, response: "Initial Scan", is_progression: false },
    ],
    viewerLesions: [
      { cx: 58, cy: 68, cz: 30, r_ed: 18, r_et: 12, r_ncr: 6 }
    ],
    analysis: {
      study_id: "c07-cystic-astro-uuid",
      model_versions: { segmentation: "swinunetr-v1", classifier: "effnet-v1", classical: "svm-rbf-v1" },
      qc: { passed: true, missing_sequences: [], ood_score: 0.07, warnings: [] },
      segmentation: {
        mask_url: "/api/v1/studies/c07-cystic-astro-uuid/mask",
        uncertainty_url: "/api/v1/studies/c07-cystic-astro-uuid/uncertainty",
        regions: {
          WT: { volume_ml: 18.2, max_diameter_mm: 24.0, perp_diameter_mm: 21.0, centroid_mm: [14.0, -28.0, -16.0] },
          TC: { volume_ml: 11.5, max_diameter_mm: 18.0, perp_diameter_mm: 15.5, centroid_mm: [14.0, -28.0, -16.0] },
          ET: { volume_ml: 7.2, max_diameter_mm: 13.0, perp_diameter_mm: 11.0, centroid_mm: [14.0, -28.0, -16.0] },
          NCR: { volume_ml: 4.3, max_diameter_mm: 9.0, perp_diameter_mm: 8.0, centroid_mm: [14.0, -28.0, -16.0] },
          ED: { volume_ml: 6.7, max_diameter_mm: 24.0, perp_diameter_mm: 21.0, centroid_mm: [14.0, -28.0, -16.0] },
        },
        lesions: [{ id: 1, volume_ml: 18.2, centroid_mm: [14.0, -28.0, -16.0] }],
        lesion_count: 1,
      },
      location: { hemisphere: "right", lobes: ["cerebellum", "posterior fossa"], midline_shift_mm: 0.5, confidence: "high" },
      classification: {
        cnn: { label: "glioma", probs: { glioma: 0.81, meningioma: 0.08, pituitary: 0.02, metastasis: 0.09 } },
        classical: { label: "glioma", probs: { glioma: 0.78, meningioma: 0.11, pituitary: 0.02, metastasis: 0.09 }, model: "svm-rbf" },
        ensemble: { label: "glioma", confidence: 0.80, agree: true },
      },
      uncertainty: { case_score: 0.11, needs_review: false, reasons: [] },
      habitats: { method: "kmeans", k: 2, map_url: null },
      radiomics_top_features: [
        { name: "Cystic Fluid Signal Ratio", value: 0.91, importance: 0.44 },
        { name: "Mural Nodule Intensity", value: 16.4, importance: 0.32 },
      ],
      similar_cases: [
        { case_id: "BRATS21-00512", label: "glioma", similarity: 0.89 },
      ],
      urgency: { score: 0.65, rules_fired: ["Infratentorial cerebellar mass"] },
      experimental: { idh_prediction: "mutant", survival_bin: "good" },
    },
  },

  // 7. Low-Grade Glioma Non-Enhancing (PT-11840)
  "c02-low-grade-uuid": {
    id: "c02-low-grade-uuid",
    code: "PT-11840",
    age: 34,
    sex: "Male",
    tumourType: "Low-Grade Glioma",
    isMalignant: true,
    scenarioName: "Non-Enhancing Diffuse Low-Grade Glioma",
    description: "Diffuse non-enhancing hyperintensity involving the left insular and temporal cortex. Zero necrosis, zero contrast enhancement.",
    clinicalImpression: "Diffuse non-enhancing low-grade glioma (Malignant / Low-Grade) expansion of left temporal and insular cortex. No ring enhancement or necrosis. Serial MRI monitoring recommended.",
    longitudinal: {
      baselineDate: "2026-03-18",
      followupDate: "2026-09-18",
      earlierWT: 19.2,
      latestWT: 19.8,
      earlierTC: 19.2,
      latestTC: 19.8,
      earlierET: 0.0,
      latestET: 0.0,
      earlierED: 0.0,
      latestED: 0.0,
      status: "Stable Disease (SD)",
      isGrowth: false,
      deltaPercent: 3.1,
      summaryText: "Indolent growth (+3.1% volume). No malignant transformation or contrast enhancement detected.",
    },
    timeline: [
      { study_id: "c02-low-grade-uuid", date: "2026-09-18", scan_type: "6-Month Follow-up", wt_ml: 19.8, tc_ml: 19.8, et_ml: 0.0, response: "Stable Disease (+3.1%)", is_progression: false },
      { study_id: "c02-earlier-01", date: "2026-03-18", scan_type: "Baseline MRI", wt_ml: 19.2, tc_ml: 19.2, et_ml: 0.0, response: "Baseline", is_progression: false },
    ],
    viewerLesions: [
      { cx: 32, cy: 45, cz: 42, r_ed: 22, r_et: 0, r_ncr: 0 }
    ],
    analysis: {
      study_id: "c02-low-grade-uuid",
      model_versions: { segmentation: "swinunetr-v1", classifier: "effnet-v1", classical: "svm-rbf-v1" },
      qc: { passed: true, missing_sequences: [], ood_score: 0.08, warnings: [] },
      segmentation: {
        mask_url: "/api/v1/studies/c02-low-grade-uuid/mask",
        uncertainty_url: "/api/v1/studies/c02-low-grade-uuid/uncertainty",
        regions: {
          WT: { volume_ml: 19.8, max_diameter_mm: 28.0, perp_diameter_mm: 22.0, centroid_mm: [-18.0, 4.0, 6.0] },
          TC: { volume_ml: 19.8, max_diameter_mm: 28.0, perp_diameter_mm: 22.0, centroid_mm: [-18.0, 4.0, 6.0] },
          ET: { volume_ml: 0.0, max_diameter_mm: 0.0, perp_diameter_mm: 0.0, centroid_mm: [0, 0, 0] },
          NCR: { volume_ml: 0.0, max_diameter_mm: 0.0, perp_diameter_mm: 0.0, centroid_mm: [0, 0, 0] },
          ED: { volume_ml: 0.0, max_diameter_mm: 0.0, perp_diameter_mm: 0.0, centroid_mm: [0, 0, 0] },
        },
        lesions: [{ id: 1, volume_ml: 19.8, centroid_mm: [-18.0, 4.0, 6.0] }],
        lesion_count: 1,
      },
      location: { hemisphere: "left", lobes: ["temporal", "insular"], midline_shift_mm: 0.3, confidence: "high" },
      classification: {
        cnn: { label: "glioma", probs: { glioma: 0.86, meningioma: 0.06, pituitary: 0.03, metastasis: 0.05 } },
        classical: { label: "glioma", probs: { glioma: 0.82, meningioma: 0.08, pituitary: 0.04, metastasis: 0.06 }, model: "svm-rbf" },
        ensemble: { label: "glioma", confidence: 0.84, agree: true },
      },
      uncertainty: { case_score: 0.14, needs_review: false, reasons: [] },
      habitats: { method: "none", k: 1, map_url: null },
      radiomics_top_features: [
        { name: "FLAIR Hyperintensity Homogeneity", value: 0.82, importance: 0.49 },
        { name: "Absence of T1ce Contrast", value: 0.01, importance: 0.35 },
      ],
      similar_cases: [
        { case_id: "BRATS21-00188", label: "glioma", similarity: 0.91 },
      ],
      urgency: { score: 0.45, rules_fired: ["Non-enhancing diffuse presentation"] },
      experimental: { idh_prediction: "mutant", survival_bin: "good" },
    },
  },

  // 8. Recurrent Glioblastoma (PT-77192)
  "c12-recurrent-gbm-uuid": {
    id: "c12-recurrent-gbm-uuid",
    code: "PT-77192",
    age: 61,
    sex: "Male",
    tumourType: "Glioblastoma",
    isMalignant: true,
    scenarioName: "Recurrent Glioblastoma Post-Resection",
    description: "Marked nodular recurrence along posterior resection cavity with rapid volume doubling (+45%).",
    clinicalImpression: "Post-resection glioblastoma recurrence (Malignant) with thick nodular enhancement along the posterior resection cavity margin. Significant 2.1 mm midline displacement. Second-line systemic therapy or clinical trial advised.",
    longitudinal: {
      baselineDate: "2026-06-15",
      followupDate: "2026-09-20",
      earlierWT: 28.4,
      latestWT: 41.2,
      earlierTC: 17.5,
      latestTC: 26.8,
      earlierET: 11.2,
      latestET: 18.4,
      earlierED: 10.9,
      latestED: 14.4,
      status: "Progressive Disease (PD)",
      isGrowth: true,
      deltaPercent: 45.1,
      summaryText: "Pronounced tumor progression (+45.1%) along resection margins. ET volume increased from 11.2 to 18.4 mL.",
    },
    timeline: [
      { study_id: "c12-recurrent-gbm-uuid", date: "2026-09-20", scan_type: "Recurrence Restaging", wt_ml: 41.2, tc_ml: 26.8, et_ml: 18.4, response: "Progression (+45.1%)", is_progression: true },
      { study_id: "c12-earlier-01", date: "2026-06-15", scan_type: "Post-Op Baseline", wt_ml: 28.4, tc_ml: 17.5, et_ml: 11.2, response: "Resection Cavity", is_progression: false },
    ],
    viewerLesions: [
      { cx: 36, cy: 52, cz: 48, r_ed: 32, r_et: 20, r_ncr: 10 }
    ],
    analysis: {
      study_id: "c12-recurrent-gbm-uuid",
      model_versions: { segmentation: "swinunetr-v1", classifier: "effnet-v1", classical: "svm-rbf-v1" },
      qc: { passed: true, missing_sequences: [], ood_score: 0.16, warnings: [] },
      segmentation: {
        mask_url: "/api/v1/studies/c12-recurrent-gbm-uuid/mask",
        uncertainty_url: "/api/v1/studies/c12-recurrent-gbm-uuid/uncertainty",
        regions: {
          WT: { volume_ml: 41.2, max_diameter_mm: 36.4, perp_diameter_mm: 30.1, centroid_mm: [-15.2, -10.4, 20.1] },
          TC: { volume_ml: 26.8, max_diameter_mm: 28.0, perp_diameter_mm: 22.4, centroid_mm: [-15.2, -10.4, 20.1] },
          ET: { volume_ml: 18.4, max_diameter_mm: 24.5, perp_diameter_mm: 19.8, centroid_mm: [-15.2, -10.4, 20.1] },
          NCR: { volume_ml: 8.4, max_diameter_mm: 12.0, perp_diameter_mm: 10.0, centroid_mm: [-15.2, -10.4, 20.1] },
          ED: { volume_ml: 14.4, max_diameter_mm: 36.4, perp_diameter_mm: 30.1, centroid_mm: [-15.2, -10.4, 20.1] },
        },
        lesions: [{ id: 1, volume_ml: 41.2, centroid_mm: [-15.2, -10.4, 20.1] }],
        lesion_count: 1,
      },
      location: { hemisphere: "left", lobes: ["parietal", "temporal"], midline_shift_mm: 2.1, confidence: "high" },
      classification: {
        cnn: { label: "glioma", probs: { glioma: 0.92, meningioma: 0.03, pituitary: 0.01, metastasis: 0.04 } },
        classical: { label: "glioma", probs: { glioma: 0.88, meningioma: 0.05, pituitary: 0.02, metastasis: 0.05 }, model: "svm-rbf" },
        ensemble: { label: "glioma", confidence: 0.90, agree: true },
      },
      uncertainty: { case_score: 0.22, needs_review: true, reasons: ["Post-surgical cavity distortion", "Rapid progression (>40%)"] },
      habitats: { method: "gmm", k: 3, map_url: null },
      radiomics_top_features: [
        { name: "Cavity Margin Nodularity", value: 21.0, importance: 0.43 },
        { name: "ET Expansion Rate", value: 1.45, importance: 0.36 },
      ],
      similar_cases: [
        { case_id: "BRATS21-00714", label: "glioma", similarity: 0.93 },
      ],
      urgency: { score: 0.85, rules_fired: ["Rapid tumour recurrence (>40% delta)", "Midline brain shift > 2.0 mm"] },
      experimental: { idh_prediction: "wildtype", survival_bin: "poor" },
    },
  },

  // 9. Parasagittal Dural Meningioma (PT-48210) - BENIGN
  "721a9c31-b0fe-4192-811d-e5cf01ad2381": {
    id: "721a9c31-b0fe-4192-811d-e5cf01ad2381",
    code: "PT-48210",
    age: 52,
    sex: "Female",
    tumourType: "Meningioma",
    isMalignant: false,
    scenarioName: "Right Parasagittal Dural Meningioma (Benign)",
    description: "Well-circumscribed extra-axial mass with intense homogeneous enhancement along the dural convexity. Zero internal necrosis.",
    clinicalImpression: "Right parasagittal extra-axial dural-based mass consistent with meningioma (Benign / Non-Cancerous). Intense uniform enhancement with visible dural tail. Zero midline brain shift. Conservative monitoring or elective resection.",
    longitudinal: {
      baselineDate: "2025-09-15",
      followupDate: "2026-09-20",
      earlierWT: 22.2,
      latestWT: 22.4,
      earlierTC: 19.6,
      latestTC: 19.8,
      earlierET: 19.6,
      latestET: 19.8,
      earlierED: 2.6,
      latestED: 2.6,
      status: "Stable Disease (SD)",
      isGrowth: false,
      deltaPercent: 0.9,
      summaryText: "Lesion remained virtually unchanged (+0.9% over 12 months), confirming benign indolent behavior.",
    },
    timeline: [
      { study_id: "721a9c31-b0fe-4192-811d-e5cf01ad2381", date: "2026-09-20", scan_type: "Annual Surveillance", wt_ml: 22.4, tc_ml: 19.8, et_ml: 19.8, response: "Stable (+0.9%)", is_progression: false },
      { study_id: "721a9c31-prev-01", date: "2025-09-15", scan_type: "Initial Baseline", wt_ml: 22.2, tc_ml: 19.6, et_ml: 19.6, response: "Initial Scan", is_progression: false },
    ],
    viewerLesions: [
      { cx: 54, cy: 26, cz: 60, r_ed: 18, r_et: 16, r_ncr: 0 }
    ],
    analysis: {
      study_id: "721a9c31-b0fe-4192-811d-e5cf01ad2381",
      model_versions: { segmentation: "swinunetr-v1", classifier: "effnet-v1", classical: "svm-rbf-v1" },
      qc: { passed: true, missing_sequences: [], ood_score: 0.08, warnings: [] },
      segmentation: {
        mask_url: "/api/v1/studies/721a9c31-b0fe-4192-811d-e5cf01ad2381/mask",
        uncertainty_url: "/api/v1/studies/721a9c31-b0fe-4192-811d-e5cf01ad2381/uncertainty",
        regions: {
          WT: { volume_ml: 22.4, max_diameter_mm: 28.5, perp_diameter_mm: 24.1, centroid_mm: [12.0, 16.5, 34.2] },
          TC: { volume_ml: 19.8, max_diameter_mm: 27.2, perp_diameter_mm: 23.4, centroid_mm: [12.0, 16.5, 34.2] },
          ET: { volume_ml: 19.8, max_diameter_mm: 27.2, perp_diameter_mm: 23.4, centroid_mm: [12.0, 16.5, 34.2] },
          NCR: { volume_ml: 0.0, max_diameter_mm: 0.0, perp_diameter_mm: 0.0, centroid_mm: [0, 0, 0] },
          ED: { volume_ml: 2.6, max_diameter_mm: 28.5, perp_diameter_mm: 24.1, centroid_mm: [12.0, 16.5, 34.2] },
        },
        lesions: [{ id: 1, volume_ml: 22.4, centroid_mm: [12.0, 16.5, 34.2] }],
        lesion_count: 1,
      },
      location: { hemisphere: "right", lobes: ["parasagittal", "parietal"], midline_shift_mm: 0.0, confidence: "high" },
      classification: {
        cnn: { label: "meningioma", probs: { glioma: 0.06, meningioma: 0.90, pituitary: 0.03, metastasis: 0.01 } },
        classical: { label: "meningioma", probs: { glioma: 0.08, meningioma: 0.88, pituitary: 0.02, metastasis: 0.02 }, model: "svm-rbf" },
        ensemble: { label: "meningioma", confidence: 0.89, agree: true },
      },
      uncertainty: { case_score: 0.09, needs_review: false, reasons: [] },
      habitats: { method: "gmm", k: 2, map_url: null },
      radiomics_top_features: [
        { name: "Sphericity (Sharp Smooth Border)", value: 0.89, importance: 0.41 },
        { name: "Homogeneity (Uniform Contrast)", value: 0.76, importance: 0.32 },
        { name: "Low FirstOrder Variance", value: 1.2, importance: 0.18 },
      ],
      similar_cases: [
        { case_id: "TCIA-MEN-0012", label: "meningioma", similarity: 0.94 },
        { case_id: "TCIA-MEN-0048", label: "meningioma", similarity: 0.91 },
        { case_id: "TCIA-MEN-0105", label: "meningioma", similarity: 0.88 },
      ],
      urgency: { score: 0.62, rules_fired: ["Extra-axial dural tail observed", "Stable circumscribed lesion"] },
      experimental: { idh_prediction: null, survival_bin: null },
    },
  },

  // 10. Small Incidental Convexity Meningioma (PT-12490) - BENIGN
  "c13-small-meningioma-uuid": {
    id: "c13-small-meningioma-uuid",
    code: "PT-12490",
    age: 49,
    sex: "Female",
    tumourType: "Meningioma",
    isMalignant: false,
    scenarioName: "Incidental Frontal Meningioma (Small)",
    description: "Small incidental 4.2 mL dural-based extra-axial nodule. Zero edema, zero mass effect.",
    clinicalImpression: "Small incidental convexity meningioma (Benign / Non-Cancerous). 4.2 mL volume with zero mass effect or parenchymal edema. Routine follow-up MRI in 12 months recommended.",
    longitudinal: {
      baselineDate: "2025-09-17",
      followupDate: "2026-09-17",
      earlierWT: 4.2,
      latestWT: 4.2,
      earlierTC: 4.2,
      latestTC: 4.2,
      earlierET: 4.2,
      latestET: 4.2,
      earlierED: 0.0,
      latestED: 0.0,
      status: "Stable Disease (SD)",
      isGrowth: false,
      deltaPercent: 0.0,
      summaryText: "Zero volume change (4.2 mL -> 4.2 mL) across 1 year.",
    },
    timeline: [
      { study_id: "c13-small-meningioma-uuid", date: "2026-09-17", scan_type: "Annual Scan", wt_ml: 4.2, tc_ml: 4.2, et_ml: 4.2, response: "Completely Stable (0.0%)", is_progression: false },
      { study_id: "c13-earlier-01", date: "2025-09-17", scan_type: "Baseline Incidental", wt_ml: 4.2, tc_ml: 4.2, et_ml: 4.2, response: "Initial Baseline", is_progression: false },
    ],
    viewerLesions: [
      { cx: 62, cy: 25, cz: 46, r_ed: 8, r_et: 8, r_ncr: 0 }
    ],
    analysis: {
      study_id: "c13-small-meningioma-uuid",
      model_versions: { segmentation: "swinunetr-v1", classifier: "effnet-v1", classical: "svm-rbf-v1" },
      qc: { passed: true, missing_sequences: [], ood_score: 0.04, warnings: [] },
      segmentation: {
        mask_url: "/api/v1/studies/c13-small-meningioma-uuid/mask",
        uncertainty_url: "/api/v1/studies/c13-small-meningioma-uuid/uncertainty",
        regions: {
          WT: { volume_ml: 4.2, max_diameter_mm: 12.0, perp_diameter_mm: 10.5, centroid_mm: [18.0, 18.0, 14.0] },
          TC: { volume_ml: 4.2, max_diameter_mm: 12.0, perp_diameter_mm: 10.5, centroid_mm: [18.0, 18.0, 14.0] },
          ET: { volume_ml: 4.2, max_diameter_mm: 12.0, perp_diameter_mm: 10.5, centroid_mm: [18.0, 18.0, 14.0] },
          NCR: { volume_ml: 0.0, max_diameter_mm: 0.0, perp_diameter_mm: 0.0, centroid_mm: [0, 0, 0] },
          ED: { volume_ml: 0.0, max_diameter_mm: 0.0, perp_diameter_mm: 0.0, centroid_mm: [0, 0, 0] },
        },
        lesions: [{ id: 1, volume_ml: 4.2, centroid_mm: [18.0, 18.0, 14.0] }],
        lesion_count: 1,
      },
      location: { hemisphere: "right", lobes: ["frontal convex dural"], midline_shift_mm: 0.0, confidence: "high" },
      classification: {
        cnn: { label: "meningioma", probs: { glioma: 0.03, meningioma: 0.94, pituitary: 0.02, metastasis: 0.01 } },
        classical: { label: "meningioma", probs: { glioma: 0.04, meningioma: 0.93, pituitary: 0.02, metastasis: 0.01 }, model: "svm-rbf" },
        ensemble: { label: "meningioma", confidence: 0.94, agree: true },
      },
      uncertainty: { case_score: 0.05, needs_review: false, reasons: [] },
      habitats: { method: "none", k: 1, map_url: null },
      radiomics_top_features: [
        { name: "Sharp Dural Interface", value: 0.96, importance: 0.54 },
      ],
      similar_cases: [
        { case_id: "TCIA-MEN-0088", label: "meningioma", similarity: 0.96 },
      ],
      urgency: { score: 0.22, rules_fired: ["Small incidental benign finding (<5 mL)"] },
      experimental: { idh_prediction: null, survival_bin: null },
    },
  },

  // 11. Pituitary Macroadenoma (PT-20941) - BENIGN
  "542e88cc-f1aa-4712-88ef-bc2100aa7789": {
    id: "542e88cc-f1aa-4712-88ef-bc2100aa7789",
    code: "PT-20941",
    age: 44,
    sex: "Female",
    tumourType: "Pituitary",
    isMalignant: false,
    scenarioName: "Sellar Pituitary Macroadenoma (Benign)",
    description: "Slow-growing skull-base pituitary lesion confined to sella turcica. Zero brain edema, clear margins.",
    clinicalImpression: "Sellar macroadenoma consistent with pituitary adenoma (Benign / Non-Cancerous). Confined to sella turcica without suprasellar extension or optic chiasm compression. Endocrine workup and neuro-ophthalmology exam suggested.",
    longitudinal: {
      baselineDate: "2026-03-12",
      followupDate: "2026-09-19",
      earlierWT: 8.7,
      latestWT: 8.4,
      earlierTC: 8.7,
      latestTC: 8.4,
      earlierET: 8.7,
      latestET: 8.4,
      earlierED: 0.0,
      latestED: 0.0,
      status: "Stable Disease (SD)",
      isGrowth: false,
      deltaPercent: -3.4,
      summaryText: "Mild reduction in volume (-3.4%) following dopamine agonist therapy. Stable non-infiltrative appearance.",
    },
    timeline: [
      { study_id: "542e88cc-f1aa-4712-88ef-bc2100aa7789", date: "2026-09-19", scan_type: "6-Month Follow-up", wt_ml: 8.4, tc_ml: 8.4, et_ml: 8.4, response: "Stable Response (-3.4%)", is_progression: false },
      { study_id: "542e88cc-prev-01", date: "2026-03-12", scan_type: "Baseline Sellar Scan", wt_ml: 8.7, tc_ml: 8.7, et_ml: 8.7, response: "Baseline Scan", is_progression: false },
    ],
    viewerLesions: [
      { cx: 48, cy: 36, cz: 28, r_ed: 8, r_et: 14, r_ncr: 0 }
    ],
    analysis: {
      study_id: "542e88cc-f1aa-4712-88ef-bc2100aa7789",
      model_versions: { segmentation: "swinunetr-v1", classifier: "effnet-v1", classical: "svm-rbf-v1" },
      qc: { passed: true, missing_sequences: [], ood_score: 0.06, warnings: [] },
      segmentation: {
        mask_url: "/api/v1/studies/542e88cc-f1aa-4712-88ef-bc2100aa7789/mask",
        uncertainty_url: "/api/v1/studies/542e88cc-f1aa-4712-88ef-bc2100aa7789/uncertainty",
        regions: {
          WT: { volume_ml: 8.4, max_diameter_mm: 16.2, perp_diameter_mm: 14.0, centroid_mm: [0.2, -8.4, -18.5] },
          TC: { volume_ml: 8.4, max_diameter_mm: 16.2, perp_diameter_mm: 14.0, centroid_mm: [0.2, -8.4, -18.5] },
          ET: { volume_ml: 8.4, max_diameter_mm: 16.2, perp_diameter_mm: 14.0, centroid_mm: [0.2, -8.4, -18.5] },
          NCR: { volume_ml: 0.0, max_diameter_mm: 0.0, perp_diameter_mm: 0.0, centroid_mm: [0, 0, 0] },
          ED: { volume_ml: 0.0, max_diameter_mm: 0.0, perp_diameter_mm: 0.0, centroid_mm: [0, 0, 0] },
        },
        lesions: [{ id: 1, volume_ml: 8.4, centroid_mm: [0.2, -8.4, -18.5] }],
        lesion_count: 1,
      },
      location: { hemisphere: "midline", lobes: ["sellar", "skull base"], midline_shift_mm: 0.0, confidence: "high" },
      classification: {
        cnn: { label: "pituitary", probs: { glioma: 0.02, meningioma: 0.05, pituitary: 0.92, metastasis: 0.01 } },
        classical: { label: "pituitary", probs: { glioma: 0.03, meningioma: 0.08, pituitary: 0.88, metastasis: 0.01 }, model: "svm-rbf" },
        ensemble: { label: "pituitary", confidence: 0.90, agree: true },
      },
      uncertainty: { case_score: 0.08, needs_review: false, reasons: [] },
      habitats: { method: "kmeans", k: 2, map_url: null },
      radiomics_top_features: [
        { name: "Sellar Bounding Box Alignment", value: 0.98, importance: 0.52 },
        { name: "Uniform Density Contrast", value: 0.84, importance: 0.26 },
      ],
      similar_cases: [
        { case_id: "TCIA-PIT-0019", label: "pituitary", similarity: 0.96 },
        { case_id: "TCIA-PIT-0042", label: "pituitary", similarity: 0.92 },
      ],
      urgency: { score: 0.35, rules_fired: ["Stable non-infiltrative growth", "No midline brain shift"] },
      experimental: { idh_prediction: null, survival_bin: null },
    },
  },

  // 12. Vestibular Schwannoma (PT-39102) - BENIGN
  "c08-schwannoma-uuid": {
    id: "c08-schwannoma-uuid",
    code: "PT-39102",
    age: 47,
    sex: "Male",
    tumourType: "Schwannoma",
    isMalignant: false,
    scenarioName: "Left Vestibular Schwannoma (Acoustic Neuroma)",
    description: "Cerebellopontine angle mass with extension into left internal auditory canal. Benign nerve sheath neoplasm.",
    clinicalImpression: "Left cerebellopontine angle mass extending into internal auditory canal, consistent with vestibular schwannoma (Benign / Non-Cancerous). Zero brainstem compression. Audiology and ENT referral advised.",
    longitudinal: {
      baselineDate: "2025-09-16",
      followupDate: "2026-09-16",
      earlierWT: 6.0,
      latestWT: 6.1,
      earlierTC: 5.7,
      latestTC: 5.8,
      earlierET: 5.4,
      latestET: 5.5,
      earlierED: 0.3,
      latestED: 0.3,
      status: "Stable Disease (SD)",
      isGrowth: false,
      deltaPercent: 1.6,
      summaryText: "Minimal indolent growth (+1.6% over 12 months), consistent with benign vestibular schwannoma.",
    },
    timeline: [
      { study_id: "c08-schwannoma-uuid", date: "2026-09-16", scan_type: "Annual Scan", wt_ml: 6.1, tc_ml: 5.8, et_ml: 5.5, response: "Stable (+1.6%)", is_progression: false },
      { study_id: "c08-earlier-01", date: "2025-09-16", scan_type: "Initial Baseline", wt_ml: 6.0, tc_ml: 5.7, et_ml: 5.4, response: "Baseline Scan", is_progression: false },
    ],
    viewerLesions: [
      { cx: 28, cy: 56, cz: 26, r_ed: 10, r_et: 9, r_ncr: 2 }
    ],
    analysis: {
      study_id: "c08-schwannoma-uuid",
      model_versions: { segmentation: "swinunetr-v1", classifier: "effnet-v1", classical: "svm-rbf-v1" },
      qc: { passed: true, missing_sequences: [], ood_score: 0.05, warnings: [] },
      segmentation: {
        mask_url: "/api/v1/studies/c08-schwannoma-uuid/mask",
        uncertainty_url: "/api/v1/studies/c08-schwannoma-uuid/uncertainty",
        regions: {
          WT: { volume_ml: 6.1, max_diameter_mm: 14.5, perp_diameter_mm: 12.0, centroid_mm: [-22.0, -18.0, -22.0] },
          TC: { volume_ml: 5.8, max_diameter_mm: 14.0, perp_diameter_mm: 11.5, centroid_mm: [-22.0, -18.0, -22.0] },
          ET: { volume_ml: 5.5, max_diameter_mm: 13.5, perp_diameter_mm: 11.0, centroid_mm: [-22.0, -18.0, -22.0] },
          NCR: { volume_ml: 0.3, max_diameter_mm: 3.0, perp_diameter_mm: 2.5, centroid_mm: [-22.0, -18.0, -22.0] },
          ED: { volume_ml: 0.3, max_diameter_mm: 14.5, perp_diameter_mm: 12.0, centroid_mm: [-22.0, -18.0, -22.0] },
        },
        lesions: [{ id: 1, volume_ml: 6.1, centroid_mm: [-22.0, -18.0, -22.0] }],
        lesion_count: 1,
      },
      location: { hemisphere: "left", lobes: ["cerebellopontine angle", "auditory canal"], midline_shift_mm: 0.0, confidence: "high" },
      classification: {
        cnn: { label: "meningioma", probs: { glioma: 0.04, meningioma: 0.86, pituitary: 0.08, metastasis: 0.02 } },
        classical: { label: "meningioma", probs: { glioma: 0.05, meningioma: 0.84, pituitary: 0.09, metastasis: 0.02 }, model: "svm-rbf" },
        ensemble: { label: "meningioma", confidence: 0.85, agree: true },
      },
      uncertainty: { case_score: 0.07, needs_review: false, reasons: [] },
      habitats: { method: "none", k: 1, map_url: null },
      radiomics_top_features: [
        { name: "Auditory Canal Trumpet Sign", value: 0.94, importance: 0.51 },
      ],
      similar_cases: [
        { case_id: "TCIA-SCH-0004", label: "schwannoma", similarity: 0.95 },
      ],
      urgency: { score: 0.38, rules_fired: ["Cerebellopontine angle mass", "Zero brainstem mass effect"] },
      experimental: { idh_prediction: null, survival_bin: null },
    },
  },

  // 13. Central Neurocytoma (PT-84019) - BENIGN
  "c10-neurocytoma-uuid": {
    id: "c10-neurocytoma-uuid",
    code: "PT-84019",
    age: 31,
    sex: "Male",
    tumourType: "Neurocytoma",
    isMalignant: false,
    scenarioName: "Intraventricular Central Neurocytoma",
    description: "Well-circumscribed intraventricular mass attached to septum pellucidum with bubbly multicystic appearance.",
    clinicalImpression: "Intraventricular mass attached to septum pellucidum at foramen of Monro, characteristic of central neurocytoma (Benign / Non-Cancerous). Mild lateral ventricular dilation without acute hydrocephalus.",
    longitudinal: {
      baselineDate: "2025-09-15",
      followupDate: "2026-09-15",
      earlierWT: 9.2,
      latestWT: 9.3,
      earlierTC: 8.8,
      latestTC: 8.9,
      earlierET: 7.1,
      latestET: 7.2,
      earlierED: 0.4,
      latestED: 0.4,
      status: "Stable Disease (SD)",
      isGrowth: false,
      deltaPercent: 1.1,
      summaryText: "Completely stable size (+1.1% over 12 months).",
    },
    timeline: [
      { study_id: "c10-neurocytoma-uuid", date: "2026-09-15", scan_type: "Annual Follow-up", wt_ml: 9.3, tc_ml: 8.9, et_ml: 7.2, response: "Stable (+1.1%)", is_progression: false },
      { study_id: "c10-earlier-01", date: "2025-09-15", scan_type: "Diagnostic Scan", wt_ml: 9.2, tc_ml: 8.8, et_ml: 7.1, response: "Baseline", is_progression: false },
    ],
    viewerLesions: [
      { cx: 46, cy: 44, cz: 48, r_ed: 12, r_et: 10, r_ncr: 3 }
    ],
    analysis: {
      study_id: "c10-neurocytoma-uuid",
      model_versions: { segmentation: "swinunetr-v1", classifier: "effnet-v1", classical: "svm-rbf-v1" },
      qc: { passed: true, missing_sequences: [], ood_score: 0.08, warnings: [] },
      segmentation: {
        mask_url: "/api/v1/studies/c10-neurocytoma-uuid/mask",
        uncertainty_url: "/api/v1/studies/c10-neurocytoma-uuid/uncertainty",
        regions: {
          WT: { volume_ml: 9.3, max_diameter_mm: 18.0, perp_diameter_mm: 15.0, centroid_mm: [-2.0, 4.0, 16.0] },
          TC: { volume_ml: 8.9, max_diameter_mm: 17.5, perp_diameter_mm: 14.5, centroid_mm: [-2.0, 4.0, 16.0] },
          ET: { volume_ml: 7.2, max_diameter_mm: 16.0, perp_diameter_mm: 13.0, centroid_mm: [-2.0, 4.0, 16.0] },
          NCR: { volume_ml: 1.7, max_diameter_mm: 6.0, perp_diameter_mm: 5.0, centroid_mm: [-2.0, 4.0, 16.0] },
          ED: { volume_ml: 0.4, max_diameter_mm: 18.0, perp_diameter_mm: 15.0, centroid_mm: [-2.0, 4.0, 16.0] },
        },
        lesions: [{ id: 1, volume_ml: 9.3, centroid_mm: [-2.0, 4.0, 16.0] }],
        lesion_count: 1,
      },
      location: { hemisphere: "midline", lobes: ["lateral ventricle", "septum pellucidum"], midline_shift_mm: 0.4, confidence: "high" },
      classification: {
        cnn: { label: "meningioma", probs: { glioma: 0.12, meningioma: 0.81, pituitary: 0.05, metastasis: 0.02 } },
        classical: { label: "meningioma", probs: { glioma: 0.14, meningioma: 0.79, pituitary: 0.05, metastasis: 0.02 }, model: "svm-rbf" },
        ensemble: { label: "meningioma", confidence: 0.80, agree: true },
      },
      uncertainty: { case_score: 0.10, needs_review: false, reasons: [] },
      habitats: { method: "none", k: 1, map_url: null },
      radiomics_top_features: [
        { name: "Bubbly Multicystic Matrix", value: 0.87, importance: 0.47 },
      ],
      similar_cases: [
        { case_id: "TCIA-NEU-0008", label: "neurocytoma", similarity: 0.92 },
      ],
      urgency: { score: 0.40, rules_fired: ["Intraventricular location without acute hydrocephalus"] },
      experimental: { idh_prediction: null, survival_bin: null },
    },
  },

  // 14. Glioblastoma Baseline Pre-Op (PT-50119-M0) - MALIGNANT
  "c05-long-base-uuid": {
    id: "c05-long-base-uuid",
    code: "PT-50119-M0",
    age: 55,
    sex: "Male",
    tumourType: "Glioblastoma",
    isMalignant: true,
    scenarioName: "Pre-Operative Baseline GBM Scan",
    description: "Initial diagnostic MRI demonstrating large right temporal glioblastoma with active rim prior to surgical resection.",
    clinicalImpression: "Initial pre-operative staging MRI showing high-grade glioblastoma (Malignant) in right temporal lobe. Thick irregular active rim with central necrosis. 1.8 mm midline brain shift. Planned for maximal surgical resection.",
    longitudinal: {
      baselineDate: "2026-06-10",
      followupDate: "2026-06-10",
      earlierWT: 38.6,
      latestWT: 38.6,
      earlierTC: 21.0,
      latestTC: 21.0,
      earlierET: 14.2,
      latestET: 14.2,
      earlierED: 17.6,
      latestED: 17.6,
      status: "Baseline Reference",
      isGrowth: false,
      deltaPercent: 0.0,
      summaryText: "Pre-operative baseline scan establishing initial tumor burden (WT = 38.6 mL).",
    },
    timeline: [
      { study_id: "c05-long-base-uuid", date: "2026-06-10", scan_type: "Pre-Operative Baseline", wt_ml: 38.6, tc_ml: 21.0, et_ml: 14.2, response: "Initial Reference", is_progression: false },
    ],
    viewerLesions: [
      { cx: 62, cy: 45, cz: 42, r_ed: 32, r_et: 20, r_ncr: 8 }
    ],
    analysis: {
      study_id: "c05-long-base-uuid",
      model_versions: { segmentation: "swinunetr-v1", classifier: "effnet-v1", classical: "svm-rbf-v1" },
      qc: { passed: true, missing_sequences: [], ood_score: 0.11, warnings: [] },
      segmentation: {
        mask_url: "/api/v1/studies/c05-long-base-uuid/mask",
        uncertainty_url: "/api/v1/studies/c05-long-base-uuid/uncertainty",
        regions: {
          WT: { volume_ml: 38.6, max_diameter_mm: 35.0, perp_diameter_mm: 29.0, centroid_mm: [16.0, -12.0, 14.0] },
          TC: { volume_ml: 21.0, max_diameter_mm: 25.0, perp_diameter_mm: 20.0, centroid_mm: [16.0, -12.0, 14.0] },
          ET: { volume_ml: 14.2, max_diameter_mm: 22.0, perp_diameter_mm: 18.0, centroid_mm: [16.0, -12.0, 14.0] },
          NCR: { volume_ml: 6.8, max_diameter_mm: 11.0, perp_diameter_mm: 9.0, centroid_mm: [16.0, -12.0, 14.0] },
          ED: { volume_ml: 17.6, max_diameter_mm: 35.0, perp_diameter_mm: 29.0, centroid_mm: [16.0, -12.0, 14.0] },
        },
        lesions: [{ id: 1, volume_ml: 38.6, centroid_mm: [16.0, -12.0, 14.0] }],
        lesion_count: 1,
      },
      location: { hemisphere: "right", lobes: ["temporal"], midline_shift_mm: 1.8, confidence: "high" },
      classification: {
        cnn: { label: "glioma", probs: { glioma: 0.91, meningioma: 0.04, pituitary: 0.01, metastasis: 0.04 } },
        classical: { label: "glioma", probs: { glioma: 0.87, meningioma: 0.06, pituitary: 0.02, metastasis: 0.05 }, model: "svm-rbf" },
        ensemble: { label: "glioma", confidence: 0.89, agree: true },
      },
      uncertainty: { case_score: 0.15, needs_review: false, reasons: [] },
      habitats: { method: "gmm", k: 3, map_url: null },
      radiomics_top_features: [
        { name: "Active Vascular Enhancement", value: 16.2, importance: 0.38 },
        { name: "Necrotic Core Volume Ratio", value: 0.32, importance: 0.29 },
      ],
      similar_cases: [
        { case_id: "BRATS21-00219", label: "glioma", similarity: 0.94 },
      ],
      urgency: { score: 0.72, rules_fired: ["Pre-operative baseline glioblastoma"] },
      experimental: { idh_prediction: "wildtype", survival_bin: "medium" },
    },
  },

  // 15. Glioblastoma Follow-Up Post-Op (PT-50119-M3) - MALIGNANT (MARKED IMPROVEMENT)
  "c05-long-followup-uuid": {
    id: "c05-long-followup-uuid",
    code: "PT-50119-M3",
    age: 55,
    sex: "Male",
    tumourType: "Glioblastoma",
    isMalignant: true,
    scenarioName: "Post-Operative 3-Month Follow-Up (Partial Response)",
    description: "Follow-up MRI 3 months post-surgical resection and radiation showing 66.8% volume reduction and resolution of midline shift.",
    clinicalImpression: "Post-operative follow-up scan showing marked partial response (PR) following resection. Tumour volume decreased by 66.8% (from 38.6 mL to 12.8 mL). Complete resolution of midline brain shift (0.0 mm). Continue adjuvant temozolomide.",
    longitudinal: {
      baselineDate: "2026-06-10",
      followupDate: "2026-09-10",
      earlierWT: 38.6,
      latestWT: 12.8,
      earlierTC: 21.0,
      latestTC: 6.5,
      earlierET: 14.2,
      latestET: 3.8,
      earlierED: 17.6,
      latestED: 6.3,
      status: "Partial Response (PR)",
      isGrowth: false,
      deltaPercent: -66.8,
      summaryText: "Excellent therapeutic response: total tumour volume shrank from 38.6 mL to 12.8 mL (-66.8%). Active rim decreased from 14.2 mL to 3.8 mL.",
    },
    timeline: [
      { study_id: "c05-long-followup-uuid", date: "2026-09-10", scan_type: "Post-Op Follow-up #1", wt_ml: 12.8, tc_ml: 6.5, et_ml: 3.8, response: "Tumour Shrinkage (-66.8%)", is_progression: false },
      { study_id: "c05-long-base-uuid", date: "2026-06-10", scan_type: "Pre-Operative Baseline", wt_ml: 38.6, tc_ml: 21.0, et_ml: 14.2, response: "Initial Baseline", is_progression: false },
    ],
    viewerLesions: [
      { cx: 60, cy: 44, cz: 42, r_ed: 15, r_et: 8, r_ncr: 4 }
    ],
    analysis: {
      study_id: "c05-long-followup-uuid",
      model_versions: { segmentation: "swinunetr-v1", classifier: "effnet-v1", classical: "svm-rbf-v1" },
      qc: { passed: true, missing_sequences: [], ood_score: 0.08, warnings: [] },
      segmentation: {
        mask_url: "/api/v1/studies/c05-long-followup-uuid/mask",
        uncertainty_url: "/api/v1/studies/c05-long-followup-uuid/uncertainty",
        regions: {
          WT: { volume_ml: 12.8, max_diameter_mm: 18.0, perp_diameter_mm: 14.0, centroid_mm: [16.0, -12.0, 14.0] },
          TC: { volume_ml: 6.5, max_diameter_mm: 12.0, perp_diameter_mm: 10.0, centroid_mm: [16.0, -12.0, 14.0] },
          ET: { volume_ml: 3.8, max_diameter_mm: 10.0, perp_diameter_mm: 8.5, centroid_mm: [16.0, -12.0, 14.0] },
          NCR: { volume_ml: 2.7, max_diameter_mm: 7.0, perp_diameter_mm: 6.0, centroid_mm: [16.0, -12.0, 14.0] },
          ED: { volume_ml: 6.3, max_diameter_mm: 18.0, perp_diameter_mm: 14.0, centroid_mm: [16.0, -12.0, 14.0] },
        },
        lesions: [{ id: 1, volume_ml: 12.8, centroid_mm: [16.0, -12.0, 14.0] }],
        lesion_count: 1,
      },
      location: { hemisphere: "right", lobes: ["temporal cavity", "surgical margin"], midline_shift_mm: 0.0, confidence: "high" },
      classification: {
        cnn: { label: "glioma", probs: { glioma: 0.84, meningioma: 0.07, pituitary: 0.03, metastasis: 0.06 } },
        classical: { label: "glioma", probs: { glioma: 0.81, meningioma: 0.09, pituitary: 0.04, metastasis: 0.06 }, model: "svm-rbf" },
        ensemble: { label: "glioma", confidence: 0.82, agree: true },
      },
      uncertainty: { case_score: 0.12, needs_review: false, reasons: [] },
      habitats: { method: "gmm", k: 2, map_url: null },
      radiomics_top_features: [
        { name: "Residual Rim Thinness", value: 0.85, importance: 0.44 },
      ],
      similar_cases: [
        { case_id: "BRATS21-00441", label: "glioma", similarity: 0.91 },
      ],
      urgency: { score: 0.42, rules_fired: ["Significant surgical reduction (-66.8%)", "Midline shift resolved"] },
      experimental: { idh_prediction: "wildtype", survival_bin: "medium" },
    },
  },

  // 16. Healthy Normal Brain Control (PT-00001) - ZERO TUMOUR
  "c15-healthy-control-uuid": {
    id: "c15-healthy-control-uuid",
    code: "PT-00001",
    age: 29,
    sex: "Male",
    tumourType: "No Tumour",
    isMalignant: false,
    scenarioName: "Healthy Brain Control (No Mass)",
    description: "Normal MRI brain scan. Zero tumour voxels detected (WT = 0.0 mL). Symmetrical ventricles and clear sulci.",
    clinicalImpression: "Normal multi-sequence volumetric brain MRI. Symmetrical ventricles, clear sulci, intact grey-white differentiation. Zero intracranial mass effect, zero contrast enhancement, zero midline shift. Completely normal study.",
    longitudinal: {
      baselineDate: "2025-09-21",
      followupDate: "2026-09-21",
      earlierWT: 0.0,
      latestWT: 0.0,
      earlierTC: 0.0,
      latestTC: 0.0,
      earlierET: 0.0,
      latestET: 0.0,
      earlierED: 0.0,
      latestED: 0.0,
      status: "Stable Disease (SD)",
      isGrowth: false,
      deltaPercent: 0.0,
      summaryText: "Completely healthy normal brain with zero tumour tissue (0.0 mL) across all timepoints.",
    },
    timeline: [
      { study_id: "c15-healthy-control-uuid", date: "2026-09-21", scan_type: "Routine Screening", wt_ml: 0.0, tc_ml: 0.0, et_ml: 0.0, response: "Normal Scan (0.0 mL)", is_progression: false },
    ],
    viewerLesions: [],
    analysis: {
      study_id: "c15-healthy-control-uuid",
      model_versions: { segmentation: "swinunetr-v1", classifier: "effnet-v1", classical: "svm-rbf-v1" },
      qc: { passed: true, missing_sequences: [], ood_score: 0.02, warnings: [] },
      segmentation: {
        mask_url: "/api/v1/studies/c15-healthy-control-uuid/mask",
        uncertainty_url: "/api/v1/studies/c15-healthy-control-uuid/uncertainty",
        regions: {
          WT: { volume_ml: 0.0, max_diameter_mm: 0.0, perp_diameter_mm: 0.0, centroid_mm: [0, 0, 0] },
          TC: { volume_ml: 0.0, max_diameter_mm: 0.0, perp_diameter_mm: 0.0, centroid_mm: [0, 0, 0] },
          ET: { volume_ml: 0.0, max_diameter_mm: 0.0, perp_diameter_mm: 0.0, centroid_mm: [0, 0, 0] },
          NCR: { volume_ml: 0.0, max_diameter_mm: 0.0, perp_diameter_mm: 0.0, centroid_mm: [0, 0, 0] },
          ED: { volume_ml: 0.0, max_diameter_mm: 0.0, perp_diameter_mm: 0.0, centroid_mm: [0, 0, 0] },
        },
        lesions: [],
        lesion_count: 0,
      },
      location: { hemisphere: "bilateral", lobes: ["healthy normal"], midline_shift_mm: 0.0, confidence: "high" },
      classification: {
        cnn: { label: "healthy control", probs: { glioma: 0.01, meningioma: 0.01, pituitary: 0.01, metastasis: 0.01 } },
        classical: { label: "healthy control", probs: { glioma: 0.01, meningioma: 0.01, pituitary: 0.01, metastasis: 0.01 }, model: "svm-rbf" },
        ensemble: { label: "healthy control", confidence: 0.99, agree: true },
      },
      uncertainty: { case_score: 0.02, needs_review: false, reasons: [] },
      habitats: { method: "none", k: 0, map_url: null },
      radiomics_top_features: [
        { name: "Zero Contrast Uptake", value: 0.0, importance: 0.85 },
      ],
      similar_cases: [],
      urgency: { score: 0.05, rules_fired: ["Normal brain scan (0.0 mL tumour)"] },
      experimental: { idh_prediction: null, survival_bin: null },
    },
  },
};

export interface WorklistItem {
  study_id: string;
  patient_code: string;
  acquired_at: string;
  tumour_type: string;
  is_malignant: boolean;
  urgency_score: number;
  badges: string[];
  needs_review: boolean;
  wt_volume_ml: number;
  status: "analyzed" | "analyzing" | "uploaded";
}

export const INITIAL_WORKLIST_ITEMS: WorklistItem[] = [
  {
    study_id: "856c7e19-a1ae-4298-94f5-d4ad0bdc6072",
    patient_code: "PT-70194",
    acquired_at: "2026-09-20 14:10",
    tumour_type: "Glioma",
    is_malignant: true,
    urgency_score: 0.88,
    badges: ["High Brain Pressure (>3mm)", "Large Tumour (>40mL)", "Multifocal"],
    needs_review: true,
    wt_volume_ml: 46.8,
    status: "analyzed",
  },
  {
    study_id: "c11-massive-shift-uuid",
    patient_code: "PT-99412",
    acquired_at: "2026-09-21 08:15",
    tumour_type: "Glioblastoma",
    is_malignant: true,
    urgency_score: 0.98,
    badges: ["CRITICAL: 6.5mm Midline Shift", "Severe Herniation Risk", "Emergency Triage"],
    needs_review: true,
    wt_volume_ml: 68.4,
    status: "analyzed",
  },
  {
    study_id: "331d2b99-a9fe-4411-921c-a1bd99cd1044",
    patient_code: "PT-90114",
    acquired_at: "2026-09-19 16:50",
    tumour_type: "Metastasis",
    is_malignant: true,
    urgency_score: 0.79,
    badges: ["3 Distinct Lesions", "Secondary Cancer Spread"],
    needs_review: true,
    wt_volume_ml: 31.0,
    status: "analyzed",
  },
  {
    study_id: "c14-miliary-met-uuid",
    patient_code: "PT-66301",
    acquired_at: "2026-09-21 11:40",
    tumour_type: "Metastasis",
    is_malignant: true,
    urgency_score: 0.82,
    badges: ["5 Miliary Seeds", "Bilateral Hemispheres"],
    needs_review: true,
    wt_volume_ml: 12.6,
    status: "analyzed",
  },
  {
    study_id: "c09-oligodendro-uuid",
    patient_code: "PT-55219",
    acquired_at: "2026-09-21 09:30",
    tumour_type: "Oligodendroglioma",
    is_malignant: true,
    urgency_score: 0.68,
    badges: ["Frontal Lobe", "Patchy Enhancement"],
    needs_review: false,
    wt_volume_ml: 28.5,
    status: "analyzed",
  },
  {
    study_id: "c07-cystic-astro-uuid",
    patient_code: "PT-31084",
    acquired_at: "2026-09-20 15:45",
    tumour_type: "Astrocytoma",
    is_malignant: true,
    urgency_score: 0.65,
    badges: ["Posterior Fossa", "Cerebellar Cyst + Nodule"],
    needs_review: false,
    wt_volume_ml: 18.2,
    status: "analyzed",
  },
  {
    study_id: "c02-low-grade-uuid",
    patient_code: "PT-11840",
    acquired_at: "2026-09-18 10:20",
    tumour_type: "Low-Grade Glioma",
    is_malignant: true,
    urgency_score: 0.45,
    badges: ["Diffuse Infiltration", "Non-enhancing (T1ce negative)"],
    needs_review: false,
    wt_volume_ml: 19.8,
    status: "analyzed",
  },
  {
    study_id: "c12-recurrent-gbm-uuid",
    patient_code: "PT-77192",
    acquired_at: "2026-09-20 17:10",
    tumour_type: "Glioblastoma",
    is_malignant: true,
    urgency_score: 0.85,
    badges: ["Post-Op Recurrence (+45%)", "Progressive Disease"],
    needs_review: true,
    wt_volume_ml: 41.2,
    status: "analyzed",
  },
  {
    study_id: "721a9c31-b0fe-4192-811d-e5cf01ad2381",
    patient_code: "PT-48210",
    acquired_at: "2026-09-20 11:35",
    tumour_type: "Meningioma",
    is_malignant: false,
    urgency_score: 0.62,
    badges: ["Dural Tail", "Sharp Distinct Borders"],
    needs_review: false,
    wt_volume_ml: 22.4,
    status: "analyzed",
  },
  {
    study_id: "c13-small-meningioma-uuid",
    patient_code: "PT-12490",
    acquired_at: "2026-09-17 14:00",
    tumour_type: "Meningioma",
    is_malignant: false,
    urgency_score: 0.22,
    badges: ["Incidental Finding", "Small Size (4.2 mL)", "Zero Edema"],
    needs_review: false,
    wt_volume_ml: 4.2,
    status: "analyzed",
  },
  {
    study_id: "542e88cc-f1aa-4712-88ef-bc2100aa7789",
    patient_code: "PT-20941",
    acquired_at: "2026-09-19 09:20",
    tumour_type: "Pituitary",
    is_malignant: false,
    urgency_score: 0.35,
    badges: ["Sellar Region", "Non-infiltrative Base"],
    needs_review: false,
    wt_volume_ml: 8.4,
    status: "analyzed",
  },
  {
    study_id: "c08-schwannoma-uuid",
    patient_code: "PT-39102",
    acquired_at: "2026-09-16 11:15",
    tumour_type: "Schwannoma",
    is_malignant: false,
    urgency_score: 0.38,
    badges: ["Acoustic Neuroma", "Cerebellopontine Angle"],
    needs_review: false,
    wt_volume_ml: 6.1,
    status: "analyzed",
  },
  {
    study_id: "c10-neurocytoma-uuid",
    patient_code: "PT-84019",
    acquired_at: "2026-09-15 13:50",
    tumour_type: "Neurocytoma",
    is_malignant: false,
    urgency_score: 0.40,
    badges: ["Intraventricular", "Well Circumscribed"],
    needs_review: false,
    wt_volume_ml: 9.3,
    status: "analyzed",
  },
  {
    study_id: "c05-long-base-uuid",
    patient_code: "PT-50119-M0",
    acquired_at: "2026-06-10 10:00",
    tumour_type: "Glioblastoma",
    is_malignant: true,
    urgency_score: 0.72,
    badges: ["Pre-Op Baseline", "Active ET Rim"],
    needs_review: false,
    wt_volume_ml: 38.6,
    status: "analyzed",
  },
  {
    study_id: "c05-long-followup-uuid",
    patient_code: "PT-50119-M3",
    acquired_at: "2026-09-10 10:00",
    tumour_type: "Glioblastoma",
    is_malignant: true,
    urgency_score: 0.42,
    badges: ["Post-Op Follow-up", "Partial Response (-66.8%)"],
    needs_review: false,
    wt_volume_ml: 12.8,
    status: "analyzed",
  },
  {
    study_id: "c15-healthy-control-uuid",
    patient_code: "PT-00001",
    acquired_at: "2026-09-21 07:45",
    tumour_type: "No Tumour",
    is_malignant: false,
    urgency_score: 0.05,
    badges: ["Normal Brain Scan", "Zero Mass (0.0 mL)"],
    needs_review: false,
    wt_volume_ml: 0.0,
    status: "analyzed",
  },
];

const STORAGE_KEY_CUSTOM_PROFILES = "neurolens_custom_profiles";
const STORAGE_KEY_CUSTOM_WORKLIST = "neurolens_custom_worklist";

export function getCustomProfiles(): Record<string, PatientProfile> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_PROFILES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getCustomWorklistItems(): WorklistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_WORKLIST);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getAllWorklistItems(): WorklistItem[] {
  const custom = getCustomWorklistItems();
  const customIds = new Set(custom.map((c) => c.study_id));
  const defaults = INITIAL_WORKLIST_ITEMS.filter((i) => !customIds.has(i.study_id));
  return [...custom, ...defaults];
}

export function getAllPatientProfiles(): PatientProfile[] {
  const custom = getCustomProfiles();
  const list: PatientProfile[] = Object.values(custom);
  const customIds = new Set(list.map((p) => p.id));
  for (const prof of Object.values(PATIENT_CATALOG)) {
    if (!customIds.has(prof.id)) {
      list.push(prof);
    }
  }
  return list;
}

export function registerCustomPatient(profile: PatientProfile, worklistItem: WorklistItem): void {
  // 1. Update in-memory PATIENT_CATALOG
  PATIENT_CATALOG[profile.id] = profile;

  // 2. Persist to localStorage
  if (typeof window !== "undefined") {
    try {
      const customProfiles = getCustomProfiles();
      customProfiles[profile.id] = profile;
      localStorage.setItem(STORAGE_KEY_CUSTOM_PROFILES, JSON.stringify(customProfiles));

      const customWorklist = getCustomWorklistItems().filter((item) => item.study_id !== profile.id);
      customWorklist.unshift(worklistItem);
      localStorage.setItem(STORAGE_KEY_CUSTOM_WORKLIST, JSON.stringify(customWorklist));
    } catch (e) {
      console.warn("Failed to persist custom patient to localStorage:", e);
    }
  }
}

export interface NewPatientInput {
  patientCode: string;
  age: number;
  sex: string;
  tumourType: string;
  isMalignant?: boolean;
  volumeMl?: number;
  midlineShiftMm?: number;
  notes?: string;
  files?: Record<string, { name: string } | null>;
}

export function createPatientFromInput(input: NewPatientInput): { profile: PatientProfile; worklistItem: WorklistItem } {
  const studyId = "custom-study-" + Date.now();
  const code = input.patientCode.trim() || ("PT-" + Math.floor(10000 + Math.random() * 90000));
  const age = Number(input.age) || 50;
  const sex = input.sex || "Male";
  const type = input.tumourType || "Glioma";
  
  // Malignancy definition
  const isMalignant = input.isMalignant !== undefined 
    ? input.isMalignant 
    : (type === "Glioma" || type === "Glioblastoma" || type === "Metastasis" || type === "Astrocytoma" || type === "Oligodendroglioma");

  const wt = input.volumeMl !== undefined ? Number(input.volumeMl) : (type === "No Tumour" ? 0.0 : isMalignant ? 38.5 : 16.2);
  const shift = input.midlineShiftMm !== undefined ? Number(input.midlineShiftMm) : (wt > 50 ? 5.2 : wt > 30 ? 2.1 : 0.0);

  // Proportional zone breakdown
  let tc = 0;
  let et = 0;
  let ncr = 0;
  let ed = 0;

  if (wt > 0) {
    if (type === "Meningioma") {
      tc = Math.round(wt * 0.9 * 10) / 10;
      et = tc;
      ncr = 0.0;
      ed = Math.round(wt * 0.1 * 10) / 10;
    } else if (type === "Pituitary") {
      tc = wt;
      et = wt;
      ncr = 0.0;
      ed = 0.0;
    } else if (type === "Metastasis") {
      tc = Math.round(wt * 0.60 * 10) / 10;
      et = Math.round(wt * 0.48 * 10) / 10;
      ncr = Math.round(wt * 0.12 * 10) / 10;
      ed = Math.round(wt * 0.40 * 10) / 10;
    } else {
      // Glial Neoplasm
      tc = Math.round(wt * 0.55 * 10) / 10;
      et = Math.round(wt * 0.35 * 10) / 10;
      ncr = Math.round(wt * 0.20 * 10) / 10;
      ed = Math.round(wt * 0.45 * 10) / 10;
    }
  }

  // Calculate Urgency Score
  let urgency = 0.30;
  const badges: string[] = ["Custom Upload"];
  let needsReview = false;

  if (shift >= 5.0) {
    urgency = 0.96;
    badges.push(`CRITICAL: ${shift}mm Midline Shift`);
    needsReview = true;
  } else if (shift >= 2.0) {
    urgency = 0.85;
    badges.push(`Mass Effect (${shift}mm Shift)`);
    needsReview = true;
  } else if (wt > 40) {
    urgency = 0.82;
    badges.push(`Large Tumour (${wt}mL)`);
    needsReview = true;
  } else if (isMalignant) {
    urgency = 0.70;
    badges.push("Malignant Neoplasm");
  } else if (type === "No Tumour") {
    urgency = 0.05;
    badges.push("Normal Brain");
  } else {
    badges.push("Benign Finding");
  }

  // Radii for 3D viewer canvas
  const r_ed = wt > 0 ? Math.min(45, Math.max(10, Math.round(Math.cbrt(wt) * 11))) : 0;
  const r_et = wt > 0 ? Math.min(30, Math.max(7, Math.round(Math.cbrt(et || wt * 0.5) * 9))) : 0;
  const r_ncr = ncr > 0 ? Math.min(18, Math.max(4, Math.round(Math.cbrt(ncr) * 6))) : 0;

  const viewerLesions = wt > 0 ? [
    { cx: 58, cy: 42, cz: 48, r_ed, r_et, r_ncr }
  ] : [];

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const profile: PatientProfile = {
    id: studyId,
    code,
    age,
    sex,
    tumourType: type,
    isMalignant,
    scenarioName: `User Input Case: ${code} (${type})`,
    description: input.notes || `Clinical scan for ${code}, ${age}y ${sex}. Tumour volume: ${wt} mL, Midline shift: ${shift} mm.`,
    clinicalImpression: `Volumetric brain MRI for patient ${code} reveals findings consistent with ${type} (${isMalignant ? "Malignant / Cancerous" : "Benign / Non-Cancerous"}). Measured whole tumour volume is ${wt} mL with ${shift} mm midline displacement. ${shift > 2 ? "Urgent neurosurgical consultation recommended due to mass effect." : "Clinical correlation and scheduled specialist review advised."}`,
    longitudinal: {
      baselineDate: dateStr.split(" ")[0],
      followupDate: dateStr.split(" ")[0],
      earlierWT: wt,
      latestWT: wt,
      earlierTC: tc,
      latestTC: tc,
      earlierET: et,
      latestET: et,
      earlierED: ed,
      latestED: ed,
      status: "Baseline Reference",
      isGrowth: false,
      deltaPercent: 0.0,
      summaryText: `Baseline study establishing initial clinical measurements (${wt} mL total volume).`,
    },
    timeline: [
      { study_id: studyId, date: dateStr.split(" ")[0], scan_type: "Uploaded Study", wt_ml: wt, tc_ml: tc, et_ml: et, response: "Initial Scan", is_progression: false }
    ],
    viewerLesions,
    analysis: {
      study_id: studyId,
      model_versions: { segmentation: "swinunetr-v1", classifier: "effnet-v1", classical: "svm-rbf-v1" },
      qc: { passed: true, missing_sequences: [], ood_score: 0.10, warnings: [] },
      segmentation: {
        mask_url: `/api/v1/studies/${studyId}/mask`,
        uncertainty_url: `/api/v1/studies/${studyId}/uncertainty`,
        regions: {
          WT: { volume_ml: wt, max_diameter_mm: Math.round(Math.cbrt(wt) * 10 * 10) / 10, perp_diameter_mm: Math.round(Math.cbrt(wt) * 8 * 10) / 10, centroid_mm: [14.0, -8.0, 20.0] },
          TC: { volume_ml: tc, max_diameter_mm: Math.round(Math.cbrt(tc) * 10 * 10) / 10, perp_diameter_mm: Math.round(Math.cbrt(tc) * 8 * 10) / 10, centroid_mm: [14.0, -8.0, 20.0] },
          ET: { volume_ml: et, max_diameter_mm: Math.round(Math.cbrt(et) * 10 * 10) / 10, perp_diameter_mm: Math.round(Math.cbrt(et) * 8 * 10) / 10, centroid_mm: [14.0, -8.0, 20.0] },
          NCR: { volume_ml: ncr, max_diameter_mm: Math.round(Math.cbrt(ncr || 1) * 8 * 10) / 10, perp_diameter_mm: Math.round(Math.cbrt(ncr || 1) * 6 * 10) / 10, centroid_mm: [14.0, -8.0, 20.0] },
          ED: { volume_ml: ed, max_diameter_mm: Math.round(Math.cbrt(ed || 1) * 10 * 10) / 10, perp_diameter_mm: Math.round(Math.cbrt(ed || 1) * 8 * 10) / 10, centroid_mm: [14.0, -8.0, 20.0] },
        },
        lesions: wt > 0 ? [{ id: 1, volume_ml: wt, centroid_mm: [14.0, -8.0, 20.0] }] : [],
        lesion_count: wt > 0 ? 1 : 0,
      },
      location: { hemisphere: "right", lobes: ["frontotemporal"], midline_shift_mm: shift, confidence: "high" },
      classification: {
        cnn: { label: type.toLowerCase(), probs: { glioma: isMalignant ? 0.88 : 0.05, meningioma: type === "Meningioma" ? 0.91 : 0.05, pituitary: type === "Pituitary" ? 0.92 : 0.02, metastasis: type === "Metastasis" ? 0.89 : 0.04 } },
        classical: { label: type.toLowerCase(), probs: { glioma: isMalignant ? 0.84 : 0.07, meningioma: type === "Meningioma" ? 0.89 : 0.06, pituitary: type === "Pituitary" ? 0.88 : 0.03, metastasis: type === "Metastasis" ? 0.86 : 0.05 }, model: "svm-rbf" },
        ensemble: { label: type.toLowerCase(), confidence: 0.90, agree: true },
      },
      uncertainty: { case_score: needsReview ? 0.22 : 0.09, needs_review: needsReview, reasons: badges.filter((b) => b.includes("CRITICAL") || b.includes("Mass")) },
      habitats: { method: "gmm", k: 3, map_url: null },
      radiomics_top_features: [
        { name: "Contrast Enhancement Gradient", value: 18.5, importance: 0.42 },
        { name: "Boundary Sphericity Index", value: isMalignant ? 0.45 : 0.88, importance: 0.32 },
        { name: "Local Entropy Infiltration", value: 4.6, importance: 0.26 },
      ],
      similar_cases: [
        { case_id: "TCIA-REF-001", label: type.toLowerCase(), similarity: 0.93 },
        { case_id: "TCIA-REF-002", label: type.toLowerCase(), similarity: 0.89 },
      ],
      urgency: { score: urgency, rules_fired: badges },
      experimental: { idh_prediction: isMalignant ? "wildtype" : null, survival_bin: isMalignant ? "medium" : null },
    },
  };

  const worklistItem: WorklistItem = {
    study_id: studyId,
    patient_code: code,
    acquired_at: dateStr,
    tumour_type: type,
    is_malignant: isMalignant,
    urgency_score: urgency,
    badges,
    needs_review: needsReview,
    wt_volume_ml: wt,
    status: "analyzed",
  };

  return { profile, worklistItem };
}

/**
 * Resolve patient profile and analysis result for any given study ID or patient code.
 */
export function getPatientProfile(studyIdOrCode: string): PatientProfile {
  if (!studyIdOrCode) {
    return PATIENT_CATALOG["856c7e19-a1ae-4298-94f5-d4ad0bdc6072"];
  }

  // 1. Direct in-memory key match
  if (PATIENT_CATALOG[studyIdOrCode]) {
    return PATIENT_CATALOG[studyIdOrCode];
  }

  // 2. Check custom local storage profiles
  const custom = getCustomProfiles();
  if (custom[studyIdOrCode]) {
    return custom[studyIdOrCode];
  }

  // 3. Patient code match in custom
  const normalized = studyIdOrCode.toUpperCase().trim();
  for (const prof of Object.values(custom)) {
    if (prof.code.toUpperCase() === normalized || normalized.includes(prof.code.toUpperCase())) {
      return prof;
    }
  }

  // 4. Patient code match in built-in
  for (const prof of Object.values(PATIENT_CATALOG)) {
    if (prof.code.toUpperCase() === normalized || normalized.includes(prof.code.toUpperCase())) {
      return prof;
    }
  }

  // 5. Keyword heuristic match
  const lower = studyIdOrCode.toLowerCase();
  if (lower.includes("healthy") || lower.includes("control") || lower.includes("00001")) {
    return PATIENT_CATALOG["c15-healthy-control-uuid"];
  }
  if (lower.includes("massive") || lower.includes("herniation") || lower.includes("shift") || lower.includes("99412")) {
    return PATIENT_CATALOG["c11-massive-shift-uuid"];
  }
  if (lower.includes("miliary") || lower.includes("66301")) {
    return PATIENT_CATALOG["c14-miliary-met-uuid"];
  }
  if (lower.includes("metastasis") || lower.includes("met") || lower.includes("90114")) {
    return PATIENT_CATALOG["331d2b99-a9fe-4411-921c-a1bd99cd1044"];
  }
  if (lower.includes("oligodendro") || lower.includes("55219")) {
    return PATIENT_CATALOG["c09-oligodendro-uuid"];
  }
  if (lower.includes("cystic") || lower.includes("astro") || lower.includes("31084")) {
    return PATIENT_CATALOG["c07-cystic-astro-uuid"];
  }
  if (lower.includes("low-grade") || lower.includes("11840")) {
    return PATIENT_CATALOG["c02-low-grade-uuid"];
  }
  if (lower.includes("recurrent") || lower.includes("77192")) {
    return PATIENT_CATALOG["c12-recurrent-gbm-uuid"];
  }
  if (lower.includes("small-meningioma") || lower.includes("12490")) {
    return PATIENT_CATALOG["c13-small-meningioma-uuid"];
  }
  if (lower.includes("meningioma") || lower.includes("48210")) {
    return PATIENT_CATALOG["721a9c31-b0fe-4192-811d-e5cf01ad2381"];
  }
  if (lower.includes("pituitary") || lower.includes("20941")) {
    return PATIENT_CATALOG["542e88cc-f1aa-4712-88ef-bc2100aa7789"];
  }
  if (lower.includes("schwannoma") || lower.includes("39102")) {
    return PATIENT_CATALOG["c08-schwannoma-uuid"];
  }
  if (lower.includes("neurocytoma") || lower.includes("84019")) {
    return PATIENT_CATALOG["c10-neurocytoma-uuid"];
  }
  if (lower.includes("base") || lower.includes("m0")) {
    return PATIENT_CATALOG["c05-long-base-uuid"];
  }
  if (lower.includes("followup") || lower.includes("m3")) {
    return PATIENT_CATALOG["c05-long-followup-uuid"];
  }

  // 6. Default to classic primary glioma case
  return PATIENT_CATALOG["856c7e19-a1ae-4298-94f5-d4ad0bdc6072"];
}

/**
 * Return all known patient / study IDs for static export generation.
 */
export function getAllPatientIds(): string[] {
  const ids = new Set<string>();
  Object.keys(PATIENT_CATALOG).forEach((k) => ids.add(k));
  Object.values(PATIENT_CATALOG).forEach((p) => {
    if (p.id) ids.add(p.id);
    if (p.code) ids.add(p.code);
  });
  return Array.from(ids);
}
