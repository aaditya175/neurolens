# NeuroLens — Machine Learning Evaluation Report

> Mandatory Disclaimer: **"NeuroLens is a research prototype for decision support only. It is not a medical device and must not be used for clinical diagnosis or treatment decisions."**

---

## 1. Executive Summary
This document tracks the quantitative evaluation of the deep learning and classical machine learning modules used across NeuroLens. All evaluations use strict patient-level splitting (no data leakage).

---

## 2. Dataset Splits
- **Internal Split**: BraTS dataset split 70% Train, 15% Validation, 15% Internal Test (split by Patient ID).
- **External Test**: Independent cohort (e.g. BraTS-Africa / Figshare 2D) for cross-domain evaluation.

| Split | Patient Count | Description |
|---|---|---|
| Train | 0 *(Pending download)* | Model parameter optimization |
| Validation | 0 *(Pending download)* | Hyperparameter tuning & threshold selection |
| Internal Test | 0 *(Pending download)* | Hold-out benchmark evaluation |
| External Test | 0 *(Pending download)* | Out-of-distribution domain shift benchmark |

---

## 3. Deep Learning Segmentation Benchmarks

| Model | WT Dice | TC Dice | ET Dice | HD95 (mm) | Missing FLAIR Dice | Notes |
|---|---|---|---|---|---|---|
| 3D U-Net Baseline | *not yet trained* | *not yet trained* | *not yet trained* | *not yet trained* | *not yet trained* | Monai DynUNet / UNet |
| SwinUNETR Primary | *not yet trained* | *not yet trained* | *not yet trained* | *not yet trained* | *not yet trained* | Transformer-based 3D |

---

## 4. Classical Machine Learning Comparison (Mumbai University Syllabus)

All models evaluated on identical Radiomics feature sets extracted from normalized MR sequences.

| Model | Accuracy | Macro-F1 | ROC-AUC (OvR) | ECE (Calibration) | Role in Product |
|---|---|---|---|---|---|
| Logistic Regression | *not yet trained* | *not yet trained* | *not yet trained* | *not yet trained* | Baseline / Stacking meta-learner |
| Gaussian Naive Bayes| *not yet trained* | *not yet trained* | *not yet trained* | *not yet trained* | Fast probabilistic baseline |
| K-Nearest Neighbours| *not yet trained* | *not yet trained* | *not yet trained* | *not yet trained* | Similar-case retrieval engine |
| Decision Tree        | *not yet trained* | *not yet trained* | *not yet trained* | *not yet trained* | Human-interpretable triage rules |
| SVM (Linear)        | *not yet trained* | *not yet trained* | *not yet trained* | *not yet trained* | Linear margin baseline |
| SVM (RBF Kernel)    | *not yet trained* | *not yet trained* | *not yet trained* | *not yet trained* | Primary classical classifier |
| Random Forest       | *not yet trained* | *not yet trained* | *not yet trained* | *not yet trained* | Bagging ensemble & feature importances |
| AdaBoost            | *not yet trained* | *not yet trained* | *not yet trained* | *not yet trained* | Boosting ensemble comparison |
| Gradient Boosting   | *not yet trained* | *not yet trained* | *not yet trained* | *not yet trained* | Gradient boosted trees |
| Stacking Ensemble   | *not yet trained* | *not yet trained* | *not yet trained* | *not yet trained* | Meta-learner over SVM + RF + CNN |
| CNN Classifier      | *not yet trained* | *not yet trained* | *not yet trained* | *not yet trained* | Deep 2D/3D feature extractor |
| CNN + Classical Hybrid| *not yet trained* | *not yet trained* | *not yet trained* | *not yet trained* | Dual-head voting with agreement flag |

---

## 5. Clustering & Unsupervised Learning
- **DBSCAN**: Post-processing on voxel coordinates for multifocal lesion separation and noise removal.
- **K-Means & GMM**: Intra-tumour habitat clustering (BIC / silhouette score optimal k).
- **PCA**: Variance-retention dimensionality reduction before SVM/KNN.
- **One-Class SVM / Isolation Forest**: Quality control and out-of-distribution anomaly detection.

---

## 6. Limitations & Honest Assessment
- Evaluation is constrained to research datasets with protocol variations.
- Motion artifacts, low-field scanners, and rare tumour phenotypes can elevate uncertainty.
- Real-time deployment requires human review before any clinical report sign-off.
