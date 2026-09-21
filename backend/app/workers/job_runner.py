"""Analysis Job Runner handling execution stages and database updates."""

import asyncio
from datetime import datetime
from sqlalchemy import select, update
from backend.app.core.database import AsyncSessionLocal
from backend.app.models import Job, Study, Analysis
from backend.app.core.config import settings
from neurolens_ml.pipeline import run_full_analysis


async def execute_analysis_job(job_id: str):
    """Execute analysis job across stages and persist Section 7.1 result."""
    async with AsyncSessionLocal() as session:
        # 1. Fetch Job and Study
        stmt = select(Job).where(Job.id == job_id)
        result = await session.execute(stmt)
        job = result.scalar_one_or_none()
        if not job:
            return

        study_stmt = select(Study).where(Study.id == job.study_id)
        study_res = await session.execute(study_stmt)
        study = study_res.scalar_one_or_none()
        if not study:
            job.status = "failed"
            job.error = "Associated study record missing"
            await session.commit()
            return

        # 2. Mark Running
        job.status = "running"
        job.started_at = datetime.utcnow()
        study.status = "analyzing"
        await session.commit()

        # Define progress callback
        async def update_progress(stage: str, progress: int):
            job.stage = stage
            job.progress = progress
            await session.commit()

        # Synchronous bridge callback for ML pipeline
        def sync_callback(stage: str, progress: int):
            job.stage = stage
            job.progress = progress

        try:
            # 3. Run Pipeline
            analysis_result = run_full_analysis(
                study_id=study.id,
                study_path=study.storage_path,
                is_fake=settings.FAKE_MODEL,
                progress_callback=sync_callback,
            )

            # 4. Save Analysis record
            existing_analysis_stmt = select(Analysis).where(Analysis.study_id == study.id)
            existing_res = await session.execute(existing_analysis_stmt)
            existing_analysis = existing_res.scalar_one_or_none()

            result_dict = analysis_result.model_dump()
            model_versions_dict = analysis_result.model_versions.model_dump()

            if existing_analysis:
                existing_analysis.result = result_dict
                existing_analysis.model_versions = model_versions_dict
            else:
                new_analysis = Analysis(
                    study_id=study.id,
                    result=result_dict,
                    model_versions=model_versions_dict,
                )
                session.add(new_analysis)

            # Sync to MongoDB Document Store
            from backend.app.services.mongo_service import mongo_service
            await mongo_service.save_analysis(study.id, result_dict)
            await mongo_service.log_activity(
                action="analysis_completed",
                entity_type="study",
                entity_id=study.id,
                metadata={"tumour_type": result_dict.get("classification", {}).get("ensemble", {}).get("label")},
            )

            # 5. Mark Done
            job.status = "done"
            job.progress = 100
            job.stage = "done"
            job.finished_at = datetime.utcnow()
            study.status = "analyzed"
            await session.commit()

        except Exception as e:
            job.status = "failed"
            job.error = str(e)
            job.finished_at = datetime.utcnow()
            study.status = "failed"
            await session.commit()
            raise e
