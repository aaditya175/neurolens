# NeuroLens Comprehensive Demo Cohort Dataset (16 Clinical Cases)

> **Research Prototype Notice**: Clinically realistic synthetic MRI test datasets generated for multi-sequence evaluation, Benign vs Malignant classification testing, and workflow validation.

### Case 01: `case_01_glioblastoma_multiforme`
- **Tumour Nature**: **Malignant (Cancerous)**
- **Clinical Scenario**: Right fronto-temporal high-grade glioma with central necrotic core, enhancing rim & extensive vasogenic edema
- **Local Path**: `demo_data\case_01_glioblastoma_multiforme`
- **Volume Breakdown**: Whole Tumour: 6409 voxels (Active Rim: 1208, Swelling: 4964, Necrotic Center: 237)

### Case 02: `case_02_low_grade_glioma`
- **Tumour Nature**: **Malignant (Cancerous)**
- **Clinical Scenario**: Left frontal diffuse low-grade glioma without contrast enhancement or necrosis
- **Local Path**: `demo_data\case_02_low_grade_glioma`
- **Volume Breakdown**: Whole Tumour: 1897 voxels (Active Rim: 0, Swelling: 1897, Necrotic Center: 0)

### Case 03: `case_03_meningioma`
- **Tumour Nature**: **Benign (Non-Cancerous)**
- **Clinical Scenario**: Right parasagittal extra-axial dural-based meningioma with intense uniform enhancement and minimal edema
- **Local Path**: `demo_data\case_03_meningioma`
- **Volume Breakdown**: Whole Tumour: 803 voxels (Active Rim: 803, Swelling: 0, Necrotic Center: 0)

### Case 04: `case_04_multifocal_metastases`
- **Tumour Nature**: **Malignant (Cancerous)**
- **Clinical Scenario**: Bilateral cerebral metastases (3 discrete lesions) demonstrating DBSCAN multi-compartment clustering
- **Local Path**: `demo_data\case_04_multifocal_metastases`
- **Volume Breakdown**: Whole Tumour: 1177 voxels (Active Rim: 249, Swelling: 916, Necrotic Center: 12)

### Case 05: `case_05_longitudinal_baseline`
- **Tumour Nature**: **Malignant (Cancerous)**
- **Clinical Scenario**: Pre-treatment baseline glioblastoma study (Month 0)
- **Local Path**: `demo_data\case_05_longitudinal_baseline`
- **Volume Breakdown**: Whole Tumour: 4499 voxels (Active Rim: 914, Swelling: 3406, Necrotic Center: 179)

### Case 06: `case_05_longitudinal_followup`
- **Tumour Nature**: **Malignant (Cancerous)**
- **Clinical Scenario**: Post-treatment follow-up scan (Month 3) demonstrating RANO Partial Response (>50% volume reduction)
- **Local Path**: `demo_data\case_05_longitudinal_followup`
- **Volume Breakdown**: Whole Tumour: 798 voxels (Active Rim: 98, Swelling: 696, Necrotic Center: 4)

### Case 07: `case_06_pituitary_adenoma`
- **Tumour Nature**: **Benign (Non-Cancerous)**
- **Clinical Scenario**: Skull-base sellar / suprasellar benign pituitary adenoma with clear circumscribed margins
- **Local Path**: `demo_data\case_06_pituitary_adenoma`
- **Volume Breakdown**: Whole Tumour: 560 voxels (Active Rim: 560, Swelling: 0, Necrotic Center: 0)

### Case 08: `case_07_cystic_astrocytoma`
- **Tumour Nature**: **Malignant (Cancerous)**
- **Clinical Scenario**: Posterior fossa cerebellar cystic tumour with bright enhancing mural nodule
- **Local Path**: `demo_data\case_07_cystic_astrocytoma`
- **Volume Breakdown**: Whole Tumour: 1068 voxels (Active Rim: 0, Swelling: 691, Necrotic Center: 377)

### Case 09: `case_08_vestibular_schwannoma`
- **Tumour Nature**: **Benign (Non-Cancerous)**
- **Clinical Scenario**: Left cerebellopontine angle (CPA) well-demarcated acoustic neuroma with intense contrast uptake
- **Local Path**: `demo_data\case_08_vestibular_schwannoma`
- **Volume Breakdown**: Whole Tumour: 376 voxels (Active Rim: 376, Swelling: 0, Necrotic Center: 0)

### Case 10: `case_09_oligodendroglioma`
- **Tumour Nature**: **Malignant (Cancerous)**
- **Clinical Scenario**: Right frontal lobe infiltrative mass with mixed patchy enhancement and moderate edema
- **Local Path**: `demo_data\case_09_oligodendroglioma`
- **Volume Breakdown**: Whole Tumour: 3017 voxels (Active Rim: 365, Swelling: 2643, Necrotic Center: 9)

### Case 11: `case_10_central_neurocytoma`
- **Tumour Nature**: **Benign (Non-Cancerous)**
- **Clinical Scenario**: Intraventricular circumscribed benign tumour attached to the septum pellucidum
- **Local Path**: `demo_data\case_10_central_neurocytoma`
- **Volume Breakdown**: Whole Tumour: 383 voxels (Active Rim: 383, Swelling: 0, Necrotic Center: 0)

### Case 12: `case_11_massive_gbm_emergency_shift`
- **Tumour Nature**: **Malignant (Emergency Triage)**
- **Clinical Scenario**: Massive right hemispheric glioblastoma causing 6.5 mm midline shift, extensive herniation risk and critical priority
- **Local Path**: `demo_data\case_11_massive_gbm_emergency_shift`
- **Volume Breakdown**: Whole Tumour: 14839 voxels (Active Rim: 2913, Swelling: 11125, Necrotic Center: 801)

### Case 13: `case_12_recurrent_gbm_progression`
- **Tumour Nature**: **Malignant (Cancerous)**
- **Clinical Scenario**: Longitudinal follow-up scan showing aggressive disease progression (+45% volume regrowth)
- **Local Path**: `demo_data\case_12_recurrent_gbm_progression`
- **Volume Breakdown**: Whole Tumour: 8791 voxels (Active Rim: 1848, Swelling: 6379, Necrotic Center: 564)

### Case 14: `case_13_small_incidental_meningioma`
- **Tumour Nature**: **Benign (Non-Cancerous)**
- **Clinical Scenario**: Small 4.2 mL incidental convexity dural meningioma with sharp margins and zero swelling
- **Local Path**: `demo_data\case_13_small_incidental_meningioma`
- **Volume Breakdown**: Whole Tumour: 189 voxels (Active Rim: 189, Swelling: 0, Necrotic Center: 0)

### Case 15: `case_14_miliary_metastases_5_seeds`
- **Tumour Nature**: **Malignant (Cancerous)**
- **Clinical Scenario**: Five distinct small metastatic nodules scattered bilaterally across both hemispheres
- **Local Path**: `demo_data\case_14_miliary_metastases_5_seeds`
- **Volume Breakdown**: Whole Tumour: 513 voxels (Active Rim: 192, Swelling: 321, Necrotic Center: 0)

### Case 16: `case_15_healthy_control`
- **Tumour Nature**: **Normal Brain (Negative Control)**
- **Clinical Scenario**: Healthy non-tumour brain scan to test false-positive suppression, segmentation QC, and zero-lesion sanity checks
- **Local Path**: `demo_data\case_15_healthy_control`
- **Volume Breakdown**: Whole Tumour: 0 voxels (Active Rim: 0, Swelling: 0, Necrotic Center: 0)

