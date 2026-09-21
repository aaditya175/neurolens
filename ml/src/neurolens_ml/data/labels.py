"""Internal Label Scheme and Standardization Adapters (Section 4.2).

Standard Scheme:
0 = Background
1 = Necrotic/non-enhancing tumour core (NCR)
2 = Peritumoural edema (ED)
3 = Enhancing tumour (ET)

Composite Regions:
WT (Whole Tumour) = {1, 2, 3}
TC (Tumour Core)  = {1, 3}
ET (Enhancing)    = {3}
"""

from typing import Dict, Set, Union
import numpy as np

# Label Constants
LABEL_BACKGROUND = 0
LABEL_NCR = 1
LABEL_ED = 2
LABEL_ET = 3

LABEL_NAMES: Dict[int, str] = {
    LABEL_BACKGROUND: "Background",
    LABEL_NCR: "Necrotic / Non-enhancing Core",
    LABEL_ED: "Peritumoural Edema",
    LABEL_ET: "Enhancing Tumour",
}

# Standard Color Mapping (Hex and RGBA)
LABEL_COLORS = {
    "NCR": {"hex": "#EF4444", "rgba": (239, 68, 68, 255), "name": "Red"},         # Red
    "ED":  {"hex": "#EAB308", "rgba": (234, 179, 8, 255), "name": "Yellow-Green"}, # Yellow
    "ET":  {"hex": "#06B6D4", "rgba": (6, 182, 212, 255), "name": "Cyan-Blue"},     # Cyan
    "WT":  {"hex": "#8B5CF6", "rgba": (139, 92, 246, 180), "name": "Purple"},
    "TC":  {"hex": "#F97316", "rgba": (249, 115, 22, 220), "name": "Orange"},
}

# Composite Region Definitions
COMPOSITE_REGIONS: Dict[str, Set[int]] = {
    "WT": {LABEL_NCR, LABEL_ED, LABEL_ET},
    "TC": {LABEL_NCR, LABEL_ET},
    "ET": {LABEL_ET},
    "NCR": {LABEL_NCR},
    "ED": {LABEL_ED},
}


def map_brats_labels(raw_mask: np.ndarray, source_format: str = "brats2021") -> np.ndarray:
    """Map raw segmentation labels from various BraTS challenges to internal NeuroLens scheme.

    Supported formats:
    - 'brats2021' / 'brats2023' / 'brats2017': 0=BG, 1=NCR, 2=ED, 4=ET -> maps 4 to 3
    - 'brats2015' / 'brats2016': 0=BG, 1=NCR, 2=ED, 3=NET, 4=ET -> maps 3->1 (core), 4->3 (ET)
    - 'standard' / 'internal': 0, 1, 2, 3 -> identity
    """
    output_mask = raw_mask.copy().astype(np.uint8)
    fmt = source_format.lower().replace("-", "").replace("_", "")

    if fmt in ("brats2021", "brats2022", "brats2023", "brats2017", "brats2018", "brats2019", "brats2020"):
        # Map 4 (ET) -> 3 (ET)
        output_mask[raw_mask == 4] = LABEL_ET
    elif fmt in ("brats2015", "brats2016", "brats2013", "brats2014"):
        # Older BraTS format: 3 was non-enhancing active tumour, which gets grouped into NCR/core (1)
        # 4 was enhancing tumour -> 3
        output_mask[raw_mask == 3] = LABEL_NCR
        output_mask[raw_mask == 4] = LABEL_ET
    elif fmt in ("standard", "internal", "neurolens"):
        pass  # already standard
    else:
        # Default safety: if contains 4 and no 3, map 4 -> 3
        if 4 in np.unique(raw_mask) and 3 not in np.unique(raw_mask):
            output_mask[raw_mask == 4] = LABEL_ET

    return output_mask


def extract_composite_masks(standard_mask: np.ndarray) -> Dict[str, np.ndarray]:
    """Extract binary masks for composite and primary sub-regions."""
    return {
        "WT": np.isin(standard_mask, list(COMPOSITE_REGIONS["WT"])).astype(np.uint8),
        "TC": np.isin(standard_mask, list(COMPOSITE_REGIONS["TC"])).astype(np.uint8),
        "ET": (standard_mask == LABEL_ET).astype(np.uint8),
        "NCR": (standard_mask == LABEL_NCR).astype(np.uint8),
        "ED": (standard_mask == LABEL_ED).astype(np.uint8),
    }
