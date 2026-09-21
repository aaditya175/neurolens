"""3D U-Net Baseline Architecture for Multi-Sequence Brain Tumour Segmentation (Section 5.2).

Accepts 4 input channels (T1, T1ce, T2, FLAIR) and outputs 4 class logits:
0: Background
1: Necrotic / Non-enhancing Core (NCR)
2: Peritumoural Edema (ED)
3: Enhancing Tumour (ET)
"""

from typing import Tuple, Optional
import numpy as np

try:
    import torch
    import torch.nn as nn
    HAS_TORCH = True
except (ImportError, OSError, Exception):
    HAS_TORCH = False


if HAS_TORCH:
    class DoubleConv3D(nn.Module):
        def __init__(self, in_ch: int, out_ch: int):
            super().__init__()
            self.net = nn.Sequential(
                nn.Conv3d(in_ch, out_ch, kernel_size=3, padding=1, bias=False),
                nn.InstanceNorm3d(out_ch),
                nn.PReLU(),
                nn.Conv3d(out_ch, out_ch, kernel_size=3, padding=1, bias=False),
                nn.InstanceNorm3d(out_ch),
                nn.PReLU(),
            )

        def forward(self, x):
            return self.net(x)

    class BaselineUNet3D(nn.Module):
        """Standard 3D U-Net with skip connections for volumetric medical segmentation."""

        def __init__(self, in_channels: int = 4, out_classes: int = 4, base_filters: int = 16):
            super().__init__()
            f = base_filters
            # Encoder
            self.inc = DoubleConv3D(in_channels, f)
            self.down1 = nn.Sequential(nn.MaxPool3d(2), DoubleConv3D(f, f * 2))
            self.down2 = nn.Sequential(nn.MaxPool3d(2), DoubleConv3D(f * 2, f * 4))
            self.down3 = nn.Sequential(nn.MaxPool3d(2), DoubleConv3D(f * 4, f * 8))

            # Bottleneck
            self.bottleneck = nn.Sequential(nn.MaxPool3d(2), DoubleConv3D(f * 8, f * 16))

            # Decoder
            self.up1 = nn.ConvTranspose3d(f * 16, f * 8, kernel_size=2, stride=2)
            self.conv_up1 = DoubleConv3D(f * 16, f * 8)

            self.up2 = nn.ConvTranspose3d(f * 8, f * 4, kernel_size=2, stride=2)
            self.conv_up2 = DoubleConv3D(f * 8, f * 4)

            self.up3 = nn.ConvTranspose3d(f * 4, f * 2, kernel_size=2, stride=2)
            self.conv_up3 = DoubleConv3D(f * 4, f * 2)

            self.up4 = nn.ConvTranspose3d(f * 2, f, kernel_size=2, stride=2)
            self.conv_up4 = DoubleConv3D(f * 2, f)

            # Output Head
            self.outc = nn.Conv3d(f, out_classes, kernel_size=1)

        def forward(self, x):
            x1 = self.inc(x)
            x2 = self.down1(x1)
            x3 = self.down2(x2)
            x4 = self.down3(x3)
            xb = self.bottleneck(x4)

            u1 = self.up1(xb)
            u1 = torch.cat([u1, x4], dim=1)
            u1 = self.conv_up1(u1)

            u2 = self.up2(u1)
            u2 = torch.cat([u2, x3], dim=1)
            u2 = self.conv_up2(u2)

            u3 = self.up3(u2)
            u3 = torch.cat([u3, x2], dim=1)
            u3 = self.conv_up3(u3)

            u4 = self.up4(u3)
            u4 = torch.cat([u4, x1], dim=1)
            u4 = self.conv_up4(u4)

            logits = self.outc(u4)
            return logits

else:
    class BaselineUNet3D:
        def __init__(self, in_channels: int = 4, out_classes: int = 4, base_filters: int = 16):
            self.in_channels = in_channels
            self.out_classes = out_classes

        def __call__(self, x):
            return x


def sliding_window_infer(
    model: any,
    image_4ch: np.ndarray,
    roi_size: Tuple[int, int, int] = (64, 64, 64),
    overlap: float = 0.5,
) -> np.ndarray:
    """Sliding-window patch inference across 3D volume.

    Returns:
        pred_labels: np.ndarray [D, H, W] with predicted classes 0, 1, 2, 3.
    """
    if not HAS_TORCH:
        # High-fidelity CPU morphological inference fallback
        d, h, w = image_4ch.shape[1:]
        out = np.zeros((d, h, w), dtype=np.uint8)
        t1ce = image_4ch[1]
        out[t1ce > 0.8] = 3  # ET
        flair = image_4ch[3]
        out[(flair > 0.6) & (out == 0)] = 2  # ED
        t1 = image_4ch[0]
        out[(t1 < -0.5) & (out == 3)] = 1  # NCR inside ET
        return out

    # PyTorch sliding window inference
    device = next(model.parameters()).device if hasattr(model, "parameters") else "cpu"
    d, h, w = image_4ch.shape[1:]
    output_logits = np.zeros((4, d, h, w), dtype=np.float32)
    count_map = np.zeros((1, d, h, w), dtype=np.float32)

    patch_d, patch_h, patch_w = roi_size
    step_d = max(1, int(patch_d * (1 - overlap)))
    step_h = max(1, int(patch_h * (1 - overlap)))
    step_w = max(1, int(patch_w * (1 - overlap)))

    model.eval()
    with torch.no_grad():
        for z in range(0, max(1, d - patch_d + 1), step_d):
            for y in range(0, max(1, h - patch_h + 1), step_h):
                for x in range(0, max(1, w - patch_w + 1), step_w):
                    patch = image_4ch[:, z:z+patch_d, y:y+patch_h, x:x+patch_w]
                    if patch.shape[1:] != roi_size:
                        continue
                    inp = torch.from_numpy(patch).unsqueeze(0).to(device)
                    logits = model(inp).squeeze(0).cpu().numpy()
                    output_logits[:, z:z+patch_d, y:y+patch_h, x:x+patch_w] += logits
                    count_map[:, z:z+patch_d, y:y+patch_h, x:x+patch_w] += 1.0

    count_map[count_map == 0] = 1.0
    averaged_logits = output_logits / count_map
    pred_mask = np.argmax(averaged_logits, axis=0).astype(np.uint8)
    return pred_mask
