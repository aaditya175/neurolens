"""Local filesystem storage manager with path traversal sanitization and UUID isolation."""

import os
import shutil
import zipfile
from pathlib import Path
from typing import List, Optional
from fastapi import UploadFile, HTTPException
from backend.app.core.config import settings


class StorageService:
    def __init__(self, base_dir: Optional[str] = None):
        self.base_dir = Path(base_dir or settings.STORAGE_DIR).resolve()
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def get_study_dir(self, study_id: str) -> Path:
        """Get or create isolated directory for a specific study UUID."""
        # Sanitize against path traversal
        clean_id = os.path.basename(study_id)
        study_path = (self.base_dir / "studies" / clean_id).resolve()
        if not str(study_path).startswith(str(self.base_dir)):
            raise ValueError("Invalid storage path traversal attempt")
        study_path.mkdir(parents=True, exist_ok=True)
        return study_path

    async def save_uploaded_file(self, upload_file: UploadFile, target_path: Path) -> int:
        """Save an uploaded file safely, verifying size constraints."""
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        total_bytes = 0

        target_path.parent.mkdir(parents=True, exist_ok=True)
        with open(target_path, "wb") as f:
            while chunk := await upload_file.read(1024 * 1024):  # 1MB chunks
                total_bytes += len(chunk)
                if total_bytes > max_bytes:
                    target_path.unlink(missing_ok=True)
                    raise HTTPException(
                        status_code=413,
                        detail=f"Uploaded file exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_MB}MB",
                    )
                f.write(chunk)
        return total_bytes

    def extract_safe_zip(self, zip_path: Path, extract_to: Path) -> List[Path]:
        """Extract a zip file safely with Zip-Slip protection."""
        extracted_files = []
        extract_to.mkdir(parents=True, exist_ok=True)

        with zipfile.ZipFile(zip_path, "r") as zf:
            for member in zf.infolist():
                # Check for path traversal
                dest_path = (extract_to / member.filename).resolve()
                if not str(dest_path).startswith(str(extract_to.resolve())):
                    raise HTTPException(status_code=400, detail="Malicious zip contents detected (Zip-Slip)")
                zf.extract(member, extract_to)
                if not member.is_dir():
                    extracted_files.append(dest_path)
        return extracted_files

    def delete_study_data(self, study_id: str) -> bool:
        """Completely remove all stored sequences, masks, and derivatives for a study."""
        study_dir = self.get_study_dir(study_id)
        if study_dir.exists():
            shutil.rmtree(study_dir, ignore_errors=True)
            return True
        return False


storage = StorageService()
