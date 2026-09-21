# NeuroLens Privacy & De-Identification Policy

> Mandatory Disclaimer: **"NeuroLens is a research prototype for decision support only. It is not a medical device and must not be used for clinical diagnosis or treatment decisions."**

## 1. Principles
1. **Zero Real Patient Health Information (PHI) in Storage**: Real patient names, addresses, social security/national IDs, institution IDs, and contact info must never enter the repository or database.
2. **Automated DICOM Anonymization**: When DICOM files or archives are uploaded, the intake service strips all identifying tags before writing to disk.
3. **Pseudonymization**: Patients are identified solely by a generated synthetic identifier (e.g., `PT-A82F9`) or an anonymized cohort code.
4. **Isolated Storage**: Scans and masks are stored under randomized UUID directory paths (`/data/studies/<uuid>/`), preventing identifiable folder structures.
5. **No PHI in Logs**: Structured application logging specifically filters out query strings, filenames, and metadata that could contain identifying attributes.
6. **Data Erasure**: Deleting a study triggers complete physical unlinking and deletion of uploaded sequences, segmentation masks, uncertainty maps, and cached analyses.
