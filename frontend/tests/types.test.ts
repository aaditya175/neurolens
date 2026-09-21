import { AnalysisResult } from "../lib/types/analysis";

describe("AnalysisResult Contract Validation", () => {
  it("validates a compliant Section 7.1 mock payload", () => {
    const mockPayload: AnalysisResult = {
      study_id: "test-study-uuid",
      model_versions: {
        segmentation: "swinunetr-v1",
        classifier: "effnet-v1",
        classical: "svm-rbf-v1",
      },
      qc: {
        passed: true,
        missing_sequences: [],
        ood_score: 0.12,
        warnings: [],
      },
      segmentation: {
        mask_url: "/api/v1/studies/test/mask",
        uncertainty_url: "/api/v1/studies/test/uncertainty",
        regions: {
          WT: { volume_ml: 45.2, max_diameter_mm: 38.1, perp_diameter_mm: 29.4, centroid_mm: [12.0, -4.5, 20.1] },
          TC: { volume_ml: 22.8, max_diameter_mm: 24.5, perp_diameter_mm: 19.2, centroid_mm: [12.2, -4.8, 19.9] },
          ET: { volume_ml: 14.1, max_diameter_mm: 22.0, perp_diameter_mm: 18.1, centroid_mm: [12.5, -4.6, 20.0] },
          NCR: { volume_ml: 8.7, max_diameter_mm: 14.2, perp_diameter_mm: 11.0, centroid_mm: [11.8, -5.0, 19.5] },
          ED: { volume_ml: 22.4, max_diameter_mm: 38.1, perp_diameter_mm: 29.4, centroid_mm: [11.5, -4.2, 20.5] },
        },
        lesions: [
          { id: 1, volume_ml: 45.2, centroid_mm: [12.0, -4.5, 20.1] }
        ],
        lesion_count: 1,
      },
      location: {
        hemisphere: "right",
        lobes: ["frontal", "temporal"],
        midline_shift_mm: 2.4,
        confidence: "approximate",
      },
      classification: {
        cnn: {
          label: "glioma",
          probs: { glioma: 0.88, meningioma: 0.05, pituitary: 0.02, metastasis: 0.05 },
        },
        classical: {
          label: "glioma",
          probs: { glioma: 0.82, meningioma: 0.08, pituitary: 0.03, metastasis: 0.07 },
          model: "svm-rbf",
        },
        ensemble: {
          label: "glioma",
          confidence: 0.85,
          agree: true,
        },
      },
      uncertainty: {
        case_score: 0.18,
        needs_review: false,
        reasons: [],
      },
      habitats: {
        method: "gmm",
        k: 3,
        map_url: "/api/v1/studies/test/habitats",
      },
      radiomics_top_features: [
        { name: "original_glcm_Contrast", value: 12.4, importance: 0.35 },
        { name: "original_firstorder_Entropy", value: 4.8, importance: 0.28 },
      ],
      similar_cases: [
        { case_id: "BRATS-0012", label: "glioma", similarity: 0.94 },
      ],
      urgency: {
        score: 0.65,
        rules_fired: ["Mass effect present (shift > 2mm)", "Large WT volume (>30mL)"],
      },
      experimental: {
        idh_prediction: null,
        survival_bin: null,
      },
    };

    expect(mockPayload.study_id).toBe("test-study-uuid");
    expect(mockPayload.segmentation.regions.WT.volume_ml).toBe(45.2);
    expect(mockPayload.classification.ensemble.agree).toBe(true);
  });
});
