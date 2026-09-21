"""NeuroLens Backend API Entry Point.

Mandatory Disclaimer:
"NeuroLens is a research prototype for decision support only. It is not a medical device and must not be used for clinical diagnosis or treatment decisions."
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.core.config import settings
from backend.app.core.database import init_db
from backend.app.api.v1 import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    await init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Clinical Decision-Support Research Prototype for Brain Tumour MRI Analysis.\n\n"
        "**DISCLAIMER**: NeuroLens is a research prototype for decision support only. "
        "It is not a medical device and must not be used for clinical diagnosis or treatment decisions."
    ),
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_disclaimer_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Clinical-Disclaimer"] = settings.DISCLAIMER
    return response


# Mount API v1 Routers
app.include_router(api_router)


@app.get("/health", tags=["System"])
async def health_check():
    """Health status check."""
    return {
        "status": "ok",
        "service": "neurolens-api",
        "env": settings.ENV,
        "fake_model": settings.FAKE_MODEL,
        "disclaimer": settings.DISCLAIMER,
    }


@app.get("/version", tags=["System"])
async def version():
    """Version metadata."""
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "api_prefix": settings.API_V1_STR,
    }


@app.get("/model-info", tags=["System"])
async def model_info():
    """Metadata regarding active deep learning and classical ML models."""
    return {
        "segmentation": {
            "primary": "MONAI SwinUNETR (4-channel input: T1, T1ce, T2, FLAIR)",
            "baseline": "MONAI 3D DynUNet",
            "version": "swinunetr-v1",
            "classes": ["NCR (1)", "ED (2)", "ET (3)"],
            "status": "ready (mock/synthetic fallback active)" if settings.FAKE_MODEL else "trained",
        },
        "classification": {
            "deep": "EfficientNet-B0 / 2D/3D ResNet",
            "classical": "Radiomics + PCA + SVC (RBF kernel)",
            "ensemble": "Confidence-calibrated soft voting with agreement detection",
            "status": "ready",
        },
        "classical_ml": {
            "dbscan": "Lesion spatial clustering and noise suppression",
            "kmeans_gmm": "Intra-tumour habitat mapping inside WT",
            "pca": "Radiomics 95% variance dimensionality reduction",
            "knn": "Similar-case retrieval index",
            "random_forest": "Radiomics classification & feature importances",
            "decision_tree": "Explainable triage urgency rules",
            "one_class_svm": "OOD scan quality detection",
        },
        "disclaimer": settings.DISCLAIMER,
    }
