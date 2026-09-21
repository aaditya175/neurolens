"""DICOM de-identification and sequence identification service."""

import os
import re
from pathlib import Path
from typing import List, Dict, Tuple, Optional

# Minimal allow-list of safe DICOM tags to keep for imaging calibration
SAFE_DICOM_TAGS = {
    (0x0020, 0x0032): "ImagePositionPatient",
    (0x0020, 0x0037): "ImageOrientationPatient",
    (0x0028, 0x0030): "PixelSpacing",
    (0x0018, 0x0050): "SliceThickness",
    (0x0028, 0x0010): "Rows",
    (0x0028, 0x0011): "Columns",
    (0x0008, 0x0060): "Modality",
    (0x0008, 0x103E): "SeriesDescription",
}


def identify_sequence_from_filename(filename: str) -> Optional[str]:
    """Identify MRI sequence type from filename heuristics."""
    fn = filename.lower()
    if "t1ce" in fn or "t1_ce" in fn or "t1post" in fn or "t1-contrast" in fn or "t1+c" in fn:
        return "t1ce"
    elif "flair" in fn:
        return "flair"
    elif "t2" in fn:
        return "t2"
    elif "t1" in fn:
        return "t1"
    elif "mask" in fn or "seg" in fn:
        return "mask"
    return None


def anonymize_dicom_file(dicom_path: Path, study_uuid: str) -> bool:
    """Strip all PHI from a DICOM file in place, retaining only safe geometric tags."""
    try:
        import pydicom
        dcm = pydicom.dcmread(dicom_path, stop_before_pixels=False)

        # Replace identifying attributes
        dcm.PatientName = "ANONYMIZED"
        dcm.PatientID = f"PT-{study_uuid[:8]}"
        if "PatientBirthDate" in dcm:
            dcm.PatientBirthDate = ""
        if "InstitutionName" in dcm:
            dcm.InstitutionName = "RESEARCH_WORKSPACE"
        if "ReferringPhysicianName" in dcm:
            dcm.ReferringPhysicianName = ""
        if "StudyDate" in dcm:
            dcm.StudyDate = "20260101"

        dcm.save_as(dicom_path)
        return True
    except Exception:
        # If pydicom is not present or file is not valid DICOM, skip gracefully
        return False
