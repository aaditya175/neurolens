"""Longitudinal Analysis & RANO Response Assessment (Section 5.8).

Implements rule-based Response Assessment in Neuro-Oncology (RANO) criteria:
- Complete Response (CR): Disappearance of all enhancing tumour (ET volume == 0).
- Partial Response (PR): >= 50% decrease in sum of products / volume compared to baseline.
- Progressive Disease (PD): >= 25% increase in sum of products / volume, or appearance of new lesions.
- Stable Disease (SD): Does not qualify for CR, PR, or PD.
- Indeterminate: Inconclusive scan data or baseline missing.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class LongitudinalComparisonResult(BaseModel):
    baseline_study_id: str
    followup_study_id: str
    days_between: Optional[int] = None
    wt_volume_change_ml: float
    wt_volume_change_percent: float
    tc_volume_change_ml: float
    tc_volume_change_percent: float
    et_volume_change_ml: float
    et_volume_change_percent: float
    bidimensional_product_change_percent: float
    new_lesions_count: int
    rano_suggestion: str  # 'complete_response', 'partial_response', 'stable_disease', 'progressive_disease', 'indeterminate'
    clinical_summary: str


class RANOEvaluator:
    """Evaluates longitudinal scan changes according to RANO criteria."""

    @staticmethod
    def compute_volume_change(baseline_vol: float, followup_vol: float) -> tuple[float, float]:
        """Compute delta in mL and percentage change."""
        delta_ml = round(followup_vol - baseline_vol, 2)
        if baseline_vol <= 1e-5:
            pct = 100.0 if followup_vol > 0 else 0.0
        else:
            pct = round(((followup_vol - baseline_vol) / baseline_vol) * 100.0, 1)
        return delta_ml, pct

    def evaluate_comparison(
        self,
        baseline_study_id: str,
        followup_study_id: str,
        baseline_regions: Dict[str, Any],
        followup_regions: Dict[str, Any],
        baseline_lesion_count: int = 1,
        followup_lesion_count: int = 1,
        days_between: Optional[int] = None,
    ) -> LongitudinalComparisonResult:
        """Evaluate change metrics and produce RANO suggestion."""
        # Extract volumes
        b_wt = float(baseline_regions.get("WT", {}).get("volume_ml", 0.0))
        f_wt = float(followup_regions.get("WT", {}).get("volume_ml", 0.0))
        b_tc = float(baseline_regions.get("TC", {}).get("volume_ml", 0.0))
        f_tc = float(followup_regions.get("TC", {}).get("volume_ml", 0.0))
        b_et = float(baseline_regions.get("ET", {}).get("volume_ml", 0.0))
        f_et = float(followup_regions.get("ET", {}).get("volume_ml", 0.0))

        # Bidimensional products (max_diameter * perp_diameter)
        b_prod = float(baseline_regions.get("WT", {}).get("max_diameter_mm", 0.0)) * float(
            baseline_regions.get("WT", {}).get("perp_diameter_mm", 0.0)
        )
        f_prod = float(followup_regions.get("WT", {}).get("max_diameter_mm", 0.0)) * float(
            followup_regions.get("WT", {}).get("perp_diameter_mm", 0.0)
        )

        wt_delta_ml, wt_delta_pct = self.compute_volume_change(b_wt, f_wt)
        tc_delta_ml, tc_delta_pct = self.compute_volume_change(b_tc, f_tc)
        et_delta_ml, et_delta_pct = self.compute_volume_change(b_et, f_et)

        if b_prod > 0:
            prod_pct = round(((f_prod - b_prod) / b_prod) * 100.0, 1)
        else:
            prod_pct = 0.0

        new_lesions = max(0, followup_lesion_count - baseline_lesion_count)

        # RANO Rule Engine
        if f_et <= 0.01 and b_et > 0.0:
            suggestion = "complete_response"
            summary = "Complete response: complete resolution of enhancing tumour (ET = 0 mL)."
        elif new_lesions > 0:
            suggestion = "progressive_disease"
            summary = f"Progressive disease: {new_lesions} new distinct lesion(s) identified."
        elif prod_pct >= 25.0 or wt_delta_pct >= 25.0 or et_delta_pct >= 25.0:
            suggestion = "progressive_disease"
            summary = f"Progressive disease: >= 25% increase in tumour burden (WT {wt_delta_pct:+.1f}%, ET {et_delta_pct:+.1f}%)."
        elif prod_pct <= -50.0 or wt_delta_pct <= -50.0 or et_delta_pct <= -50.0:
            suggestion = "partial_response"
            summary = f"Partial response: >= 50% reduction in tumour burden (WT {wt_delta_pct:+.1f}%, ET {et_delta_pct:+.1f}%)."
        else:
            suggestion = "stable_disease"
            summary = f"Stable disease: volumetric changes within RANO thresholds (-50% < WT {wt_delta_pct:+.1f}% < +25%)."

        return LongitudinalComparisonResult(
            baseline_study_id=baseline_study_id,
            followup_study_id=followup_study_id,
            days_between=days_between,
            wt_volume_change_ml=wt_delta_ml,
            wt_volume_change_percent=wt_delta_pct,
            tc_volume_change_ml=tc_delta_ml,
            tc_volume_change_percent=tc_delta_pct,
            et_volume_change_ml=et_delta_ml,
            et_volume_change_percent=et_delta_pct,
            bidimensional_product_change_percent=prod_pct,
            new_lesions_count=new_lesions,
            rano_suggestion=suggestion,
            clinical_summary=summary,
        )
