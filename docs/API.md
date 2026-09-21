# NeuroLens API Documentation

> Mandatory Disclaimer: **"NeuroLens is a research prototype for decision support only. It is not a medical device and must not be used for clinical diagnosis or treatment decisions."**

Base URL: `/api/v1`

All endpoints except `/auth/*`, `/health`, `/version`, and `/model-info` require a Bearer JWT token in the `Authorization` header.

## Error Response Format
All errors follow standard JSON structure:
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Study not found"
  }
}
```

## Endpoints

### System & Health
- `GET /health`: System health check
- `GET /version`: Current API and component version
- `GET /model-info`: Active model weights, architectures, and performance metadata

### Authentication
- `POST /auth/register`: Create user (admin only)
- `POST /auth/login`: Authenticate and receive access/refresh tokens
- `POST /auth/refresh`: Refresh expired access token
- `GET /auth/me`: Current authenticated user profile

### Patients & Studies
- `POST /patients`: Create a pseudonymised patient (internal code, age, sex)
- `GET /patients`: List patients
- `GET /patients/{id}`: Get patient details and timeline
- `POST /studies`: Upload multi-sequence study (T1, T1ce, T2, FLAIR NIfTI files or DICOM zip)
- `GET /studies`: List studies with filters
- `GET /studies/{id}`: Study details & sequence status
- `DELETE /studies/{id}`: Delete study and all derived masks/analyses
- `GET /studies/{id}/volume/{sequence}`: Stream NIfTI volume for MPR viewer

### Analysis & Models
- `POST /studies/{id}/analyze`: Enqueue async analysis pipeline
- `GET /jobs/{job_id}`: Job execution status, progress %, and active stage
- `GET /studies/{id}/analysis`: Full Section 7.1 AnalysisResult JSON
- `GET /studies/{id}/mask`: Download latest segmentation NIfTI mask
- `PUT /studies/{id}/mask`: Upload doctor-revised segmentation mask
- `GET /studies/{id}/uncertainty-map`: Predictive entropy NIfTI
- `GET /studies/{id}/habitat-map`: Intra-tumour K-Means/GMM habitat NIfTI
- `GET /studies/{id}/similar?k=5`: Retrieve top-k similar cases via KNN

### Longitudinal & Comparison
- `POST /patients/{id}/compare`: Enqueue study comparison
- `GET /patients/{id}/timeline`: Volumetric trend series
- `GET /comparisons/{id}`: Change metrics & RANO response suggestion

### Reports
- `POST /studies/{id}/report`: Generate structured draft report
- `PUT /reports/{id}`: Edit clinical impressions and update status
- `GET /reports/{id}/pdf`: Download signed or draft PDF report

### Triage & Insights
- `GET /worklist`: Prioritized triage study list ranked by AI urgency score
- `GET /insights/cohort`: 2D PCA distribution & clustering data
- `GET /audit-log`: Access and edit audit trail (admin only)
