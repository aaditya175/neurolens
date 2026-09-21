"""Clinical Report Generation Service (Section 10).

Renders structured clinical reports to HTML (Jinja2) and PDF (ReportLab).
Guarantees:
- Exact numerical consistency with Section 7.1 JSON.
- Prominent mandatory research disclaimer.
- Status workflow: draft -> reviewed -> signed.
"""

import os
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime

from jinja2 import Template

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable


REPORT_HTML_TEMPLATE = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>NeuroLens Clinical Report - {{ patient_code }}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; color: #1e293b; background: #fff; line-height: 1.5; }
  .disclaimer { background: #fff1f2; border-left: 4px solid #f43f5e; padding: 12px 16px; margin-bottom: 24px; font-size: 12px; color: #881337; font-weight: 500; }
  .header { border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
  .title { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0; }
  .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 13px; margin-bottom: 24px; background: #f8fafc; padding: 16px; border-radius: 6px; }
  h2 { font-size: 15px; text-transform: uppercase; letter-spacing: 0.05em; color: #0369a1; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
  th { background: #f1f5f9; text-align: left; padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: 600; }
  td { padding: 8px 12px; border: 1px solid #e2e8f0; }
  .status-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
  .badge-signed { background: #dcfce7; color: #15803d; }
  .badge-draft { background: #fef9c3; color: #854d0e; }
  .badge-reviewed { background: #e0f2fe; color: #0369a1; }
  .signature-block { margin-top: 40px; padding-top: 20px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; }
</style>
</head>
<body>
  <div class="disclaimer">
    <strong>MANDATORY DISCLAIMER:</strong> NeuroLens is a research prototype for decision support only. It is not a medical device and must not be used for clinical diagnosis or treatment decisions.
  </div>

  <div class="header">
    <div>
      <h1 class="title">NeuroLens — Brain Tumour Analysis Report</h1>
      <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Automated Decision Support Workspace</div>
    </div>
    <div>
      <span class="status-badge badge-{{ status }}">{{ status }}</span>
    </div>
  </div>

  <div class="meta-grid">
    <div><strong>Patient Code:</strong> {{ patient_code }}</div>
    <div><strong>Study ID:</strong> {{ study_id }}</div>
    <div><strong>Date of Study:</strong> {{ study_date }}</div>
    <div><strong>Report Generated:</strong> {{ report_date }}</div>
    <div><strong>Active Models:</strong> Seg: {{ model_versions.segmentation }} | Class: {{ model_versions.classifier }}</div>
    <div><strong>Sequences Ingested:</strong> {{ sequences_str }}</div>
  </div>

  <h2>1. Technique & Protocol</h2>
  <p style="font-size: 13px;">Multi-sequence volumetric brain MRI protocol evaluated with deep 3D segmentation and classical radiomics analysis. Quality control check status: <strong>{{ 'PASSED' if qc.passed else 'FLAGGED' }}</strong> (OOD Anomaly Score: {{ qc.ood_score }}).</p>

  <h2>2. Automated Morphological & Volumetric Findings</h2>
  <table>
    <thead>
      <tr>
        <th>Sub-Region</th>
        <th>Volume (mL)</th>
        <th>Max Axial Diameter (mm)</th>
        <th>Perpendicular Diameter (mm)</th>
      </tr>
    </thead>
    <tbody>
      {% for region, metrics in regions.items() %}
      <tr>
        <td><strong>{{ region }}</strong></td>
        <td>{{ metrics.volume_ml }} mL</td>
        <td>{{ metrics.max_diameter_mm }} mm</td>
        <td>{{ metrics.perp_diameter_mm }} mm</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>

  <p style="font-size: 13px; margin-top: 12px;">
    <strong>Anatomical Location:</strong> {{ location.hemisphere | capitalize }} hemisphere ({{ location.lobes | join(', ') }}).<br>
    <strong>Midline Shift:</strong> {{ location.midline_shift_mm }} mm ({{ location.confidence }} estimate).<br>
    <strong>Lesion Architecture:</strong> {{ lesion_count }} discrete lesion cluster(s) identified.
  </p>

  <h2>3. Model Consensus & Classification</h2>
  <p style="font-size: 13px;">
    <strong>Deep CNN (EfficientNet):</strong> {{ classification.cnn.label | capitalize }} (confidence {{ '%.1f' | format(classification.cnn.probs[classification.cnn.label] * 100) }}%)<br>
    <strong>Classical ML (Radiomics SVM):</strong> {{ classification.classical.label | capitalize }} (confidence {{ '%.1f' | format(classification.classical.probs[classification.classical.label] * 100) }}%)<br>
    <strong>Dual-Model Consensus:</strong> {{ 'AGREEMENT' if classification.ensemble.agree else 'DISCREPANCY DETECTED' }} (Ensemble Confidence: {{ '%.1f' | format(classification.ensemble.confidence * 100) }}%).
  </p>

  <h2>4. Uncertainty & Quality Assurance</h2>
  <p style="font-size: 13px;">
    <strong>Predictive Boundary Entropy:</strong> {{ uncertainty.case_score }} (Threshold: 0.25)<br>
    <strong>Human Review Required:</strong> {{ 'YES' if uncertainty.needs_review else 'NO' }}<br>
    {% if uncertainty.reasons %}
    <em>Review triggers:</em> {{ uncertainty.reasons | join('; ') }}
    {% endif %}
  </p>

  <h2>5. Clinical Impression & Radiologist Assessment</h2>
  <div style="background: #f8fafc; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 13px;">
    {{ impression }}
  </div>

  {% if mask_edits %}
  <h2>6. Manual Mask Revision History</h2>
  <p style="font-size: 13px;">Manual revisions documented by reviewing clinician: {{ mask_edits }}</p>
  {% endif %}

  <div class="signature-block">
    <div style="font-size: 12px; color: #64748b;">
      NeuroLens Core v1.0 • Research Platform
    </div>
    <div style="font-size: 13px; text-align: right;">
      <strong>Reviewing Radiologist:</strong> ___________________________<br>
      <span style="font-size: 11px; color: #64748b;">Date & Electronic Signature</span>
    </div>
  </div>
</body>
</html>
"""


class ReportService:
    """Service to create, format, and render clinical reports."""

    @staticmethod
    def build_report_data(
        patient_code: str,
        study_id: str,
        analysis_dict: Dict[str, Any],
        sequences: list[str],
        impression: Optional[str] = None,
        status: str = "draft",
        mask_edits: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Construct structured report JSON data matching Section 7.1 and 10."""
        seg = analysis_dict.get("segmentation", {})
        regions = seg.get("regions", {})
        lesion_count = seg.get("lesion_count", 1)
        classification = analysis_dict.get("classification", {})
        location = analysis_dict.get("location", {})
        uncertainty = analysis_dict.get("uncertainty", {})
        qc = analysis_dict.get("qc", {})
        model_versions = analysis_dict.get("model_versions", {})

        top_type = classification.get("ensemble", {}).get("label", "glioma").capitalize()
        wt_vol = regions.get("WT", {}).get("volume_ml", 0.0)
        hemi = location.get("hemisphere", "right")
        lobes_str = ", ".join(location.get("lobes", ["brain"]))

        default_impression = (
            f"Findings are consistent with a {top_type.lower()} lesion centered in the {hemi} {lobes_str}. "
            f"Whole tumour volume measures {wt_vol} mL with midline shift of {location.get('midline_shift_mm', 0.0)} mm. "
            f"Dual-model consensus is {'confirmed' if classification.get('ensemble', {}).get('agree', True) else 'discrepant, warranting clinical correlation'}."
        )

        return {
            "patient_code": patient_code,
            "study_id": study_id,
            "status": status,
            "study_date": datetime.utcnow().strftime("%Y-%m-%d"),
            "report_date": datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
            "sequences_str": ", ".join([s.upper() for s in sequences]) if sequences else "T1, T1CE, T2, FLAIR",
            "model_versions": model_versions,
            "qc": qc,
            "regions": regions,
            "lesion_count": lesion_count,
            "location": location,
            "classification": classification,
            "uncertainty": uncertainty,
            "impression": impression or default_impression,
            "mask_edits": mask_edits,
        }

    @classmethod
    def render_html(cls, report_data: Dict[str, Any]) -> str:
        """Render report HTML from Jinja2 template."""
        template = Template(REPORT_HTML_TEMPLATE)
        return template.render(**report_data)

    @classmethod
    def render_pdf(cls, report_data: Dict[str, Any], output_pdf_path: str) -> str:
        """Render high-fidelity PDF report using ReportLab."""
        doc = SimpleDocTemplate(
            output_pdf_path,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36,
        )

        styles = getSampleStyleSheet()

        # Custom Styles
        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=22,
            textColor=colors.HexColor("#0f172a"),
        )
        subtitle_style = ParagraphStyle(
            "DocSubtitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#64748b"),
        )
        disclaimer_style = ParagraphStyle(
            "Disclaimer",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=11,
            textColor=colors.HexColor("#991b1b"),
        )
        h2_style = ParagraphStyle(
            "SectionH2",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=15,
            textColor=colors.HexColor("#0284c7"),
            spaceBefore=12,
            spaceAfter=4,
        )
        body_style = ParagraphStyle(
            "BodyText",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#334155"),
        )

        story = []

        # Mandatory Disclaimer Box
        disclaimer_text = (
            "<b>MANDATORY DISCLAIMER:</b> NeuroLens is a research prototype for decision support only. "
            "It is not a medical device and must not be used for clinical diagnosis or treatment decisions."
        )
        disclaimer_table = Table([[Paragraph(disclaimer_text, disclaimer_style)]], colWidths=[540])
        disclaimer_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#fee2e2")),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#f87171")),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ])
        )
        story.append(disclaimer_table)
        story.append(Spacer(1, 10))

        # Title
        story.append(Paragraph("NeuroLens — Brain Tumour Analysis Report", title_style))
        story.append(Paragraph("Clinical Decision-Support Research Workspace", subtitle_style))
        story.append(Spacer(1, 8))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=10))

        # Metadata Table
        meta_data = [
            [
                Paragraph(f"<b>Patient Code:</b> {report_data['patient_code']}", body_style),
                Paragraph(f"<b>Study ID:</b> {report_data['study_id'][:12]}...", body_style),
            ],
            [
                Paragraph(f"<b>Study Date:</b> {report_data['study_date']}", body_style),
                Paragraph(f"<b>Report Status:</b> {report_data['status'].upper()}", body_style),
            ],
            [
                Paragraph(f"<b>Sequences:</b> {report_data['sequences_str']}", body_style),
                Paragraph(f"<b>QC Status:</b> {'PASSED' if report_data['qc'].get('passed', True) else 'FLAGGED'}", body_style),
            ],
        ]
        meta_table = Table(meta_data, colWidths=[270, 270])
        meta_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ])
        )
        story.append(meta_table)

        # 1. Morphological & Volumetric Findings
        story.append(Paragraph("1. Volumetric & Morphological Sub-Region Metrics", h2_style))
        reg_rows = [["Sub-Region", "Volume (mL)", "Max Diameter (mm)", "Perp Diameter (mm)"]]
        for r_name, metrics in report_data.get("regions", {}).items():
            reg_rows.append([
                r_name,
                f"{metrics.get('volume_ml', 0)} mL",
                f"{metrics.get('max_diameter_mm', 0)} mm",
                f"{metrics.get('perp_diameter_mm', 0)} mm",
            ])

        reg_table = Table(reg_rows, colWidths=[120, 140, 140, 140])
        reg_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e0f2fe")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#0369a1")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ])
        )
        story.append(reg_table)

        # Location & Lesion count
        loc = report_data.get("location", {})
        story.append(Spacer(1, 6))
        loc_text = (
            f"<b>Location:</b> {str(loc.get('hemisphere', '')).capitalize()} hemisphere "
            f"({', '.join(loc.get('lobes', []))}). &nbsp;&nbsp;|&nbsp;&nbsp; "
            f"<b>Midline Shift:</b> {loc.get('midline_shift_mm', 0)} mm ({loc.get('confidence', 'approximate')}). &nbsp;&nbsp;|&nbsp;&nbsp; "
            f"<b>Discrete Lesions:</b> {report_data.get('lesion_count', 1)} cluster(s)."
        )
        story.append(Paragraph(loc_text, body_style))

        # 2. Classification & Dual Model Consensus
        story.append(Paragraph("2. Dual-Model Classification & Consensus", h2_style))
        clf = report_data.get("classification", {})
        cnn = clf.get("cnn", {})
        classical = clf.get("classical", {})
        ensemble = clf.get("ensemble", {})

        cnn_prob = cnn.get("probs", {}).get(cnn.get("label", ""), 0) * 100
        cls_prob = classical.get("probs", {}).get(classical.get("label", ""), 0) * 100
        ens_prob = ensemble.get("confidence", 0) * 100

        clf_text = (
            f"<b>Deep CNN:</b> {str(cnn.get('label', '')).capitalize()} ({cnn_prob:.1f}% confidence) &nbsp;&nbsp;•&nbsp;&nbsp; "
            f"<b>Classical SVM:</b> {str(classical.get('label', '')).capitalize()} ({cls_prob:.1f}% confidence)<br/>"
            f"<b>Ensemble Consensus:</b> {'AGREED' if ensemble.get('agree', True) else 'DISCREPANCY'} "
            f"({str(ensemble.get('label', '')).capitalize()}, confidence: {ens_prob:.1f}%)."
        )
        story.append(Paragraph(clf_text, body_style))

        # 3. Uncertainty Quantification
        story.append(Paragraph("3. Predictive Uncertainty & Review Assessment", h2_style))
        unc = report_data.get("uncertainty", {})
        needs_rev = unc.get("needs_review", False)
        unc_text = (
            f"<b>Predictive Boundary Entropy:</b> {unc.get('case_score', 0)} (Review threshold: 0.25)<br/>"
            f"<b>Needs Clinical Review:</b> {'<font color=red><b>YES</b></font>' if needs_rev else '<font color=green><b>NO</b></font>'}"
        )
        if unc.get("reasons"):
            unc_text += f"<br/><b>Review Triggers:</b> {'; '.join(unc['reasons'])}"
        story.append(Paragraph(unc_text, body_style))

        # 4. Impression
        story.append(Paragraph("4. Clinical Impression & Interpretation", h2_style))
        story.append(Paragraph(report_data.get("impression", ""), body_style))

        # Signature Block
        story.append(Spacer(1, 25))
        sig_data = [
            [
                Paragraph("<b>NeuroLens Clinical System</b><br/>Research Workspace", subtitle_style),
                Paragraph("<b>Reviewing Radiologist:</b> ___________________________<br/>Date: ________________________", body_style),
            ]
        ]
        sig_table = Table(sig_data, colWidths=[270, 270])
        sig_table.setStyle(TableStyle([("TOPPADDING", (0, 0), (-1, -1), 0)]))
        story.append(sig_table)

        doc.build(story)
        return output_pdf_path
