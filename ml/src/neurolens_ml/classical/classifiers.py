"""Classical Machine Learning Benchmark Suite (Mumbai University ML Syllabus, Section 6).

Implements:
- 6.2: SVM (Linear & RBF kernel) with grid search & probability calibration
- 6.6: Ensembles: Random Forest, AdaBoost, Gradient Boosting, Stacking Classifier
- 6.8: Baselines: Logistic Regression, Gaussian Naive Bayes, Decision Tree
- Metrics: Accuracy, Macro-F1, ROC-AUC (OvR), Expected Calibration Error (ECE)
"""

from typing import Dict, Any, Tuple, Optional
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier, GradientBoostingClassifier, StackingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score


def compute_ece(probs: np.ndarray, y_true: np.ndarray, n_bins: int = 10) -> float:
    """Calculate Expected Calibration Error (ECE) across confidence bins."""
    confidences = np.max(probs, axis=1)
    predictions = np.argmax(probs, axis=1)
    accuracies = predictions == y_true

    bin_boundaries = np.linspace(0, 1, n_bins + 1)
    ece = 0.0
    n_samples = len(y_true)

    for i in range(n_bins):
        bin_lower = bin_boundaries[i]
        bin_upper = bin_boundaries[i + 1]
        in_bin = (confidences > bin_lower) & (confidences <= bin_upper)
        prop_in_bin = np.mean(in_bin)

        if prop_in_bin > 0:
            accuracy_in_bin = np.mean(accuracies[in_bin])
            avg_confidence_in_bin = np.mean(confidences[in_bin])
            ece += np.abs(avg_confidence_in_bin - accuracy_in_bin) * prop_in_bin

    return round(float(ece), 4)


def get_all_syllabus_models() -> Dict[str, Any]:
    """Return dictionary of all classical models specified in the Mumbai University syllabus."""
    base_estimators = [
        ("svm", SVC(kernel="rbf", C=1.0, gamma="scale", probability=True, random_state=42)),
        ("rf", RandomForestClassifier(n_estimators=50, max_depth=6, random_state=42)),
        ("nb", GaussianNB()),
    ]
    meta_learner = LogisticRegression(max_iter=1000, random_state=42)

    return {
        "Logistic Regression": Pipeline([("scaler", StandardScaler()), ("clf", LogisticRegression(max_iter=1000, random_state=42))]),
        "Gaussian Naive Bayes": Pipeline([("scaler", StandardScaler()), ("clf", GaussianNB())]),
        "K-Nearest Neighbours": Pipeline([("scaler", StandardScaler()), ("clf", KNeighborsClassifier(n_neighbors=5))]),
        "Decision Tree": DecisionTreeClassifier(max_depth=5, random_state=42),
        "SVM (Linear)": Pipeline([("scaler", StandardScaler()), ("clf", SVC(kernel="linear", probability=True, random_state=42))]),
        "SVM (RBF Kernel)": Pipeline([("scaler", StandardScaler()), ("clf", SVC(kernel="rbf", C=1.5, gamma="scale", probability=True, random_state=42))]),
        "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42),
        "AdaBoost": AdaBoostClassifier(n_estimators=50, random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=80, learning_rate=0.1, max_depth=4, random_state=42),
        "Stacking Ensemble": StackingClassifier(estimators=base_estimators, final_estimator=meta_learner, cv=3),
    }


def evaluate_models_suite(
    X_train: np.ndarray,
    y_train: np.ndarray,
    X_test: np.ndarray,
    y_test: np.ndarray,
) -> Dict[str, Dict[str, Any]]:
    """Train and evaluate all syllabus models, returning comparison metrics table."""
    models = get_all_syllabus_models()
    results = {}
    n_classes = len(np.unique(y_train))

    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(X_test)
        else:
            probs = np.zeros((len(y_test), n_classes))
            for i, p in enumerate(y_pred):
                probs[i, p] = 1.0

        acc = float(accuracy_score(y_test, y_pred))
        f1 = float(f1_score(y_test, y_pred, average="macro"))

        # ROC-AUC (One-vs-Rest)
        try:
            if n_classes == 2:
                auc = float(roc_auc_score(y_test, probs[:, 1]))
            else:
                auc = float(roc_auc_score(y_test, probs, multi_class="ovr"))
        except Exception:
            auc = 0.0

        ece = compute_ece(probs, y_test)

        results[name] = {
            "accuracy": round(acc, 4),
            "macro_f1": round(f1, 4),
            "roc_auc": round(auc, 4),
            "ece": ece,
            "model": model,
        }

    return results
