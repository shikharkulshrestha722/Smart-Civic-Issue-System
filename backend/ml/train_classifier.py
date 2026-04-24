from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle

# 🔹 Training data
texts = [
    "water leakage", "pipe burst", "water supply issue",
    "electric pole broken", "power outage", "electricity problem",
    "gas leakage", "gas pipeline issue", "gas smell",
    "road damaged", "potholes on road", "road repair needed"
]

labels = [
    "water", "water", "water",
    "electricity", "electricity", "electricity",
    "gas", "gas", "gas",
    "road", "road", "road"
]

# 🔹 Vectorize
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)

# 🔹 Train model
model = LogisticRegression()
model.fit(X, labels)

# 🔹 Save
with open("ml/classifier.pkl", "wb") as f:
    pickle.dump((model, vectorizer), f)

print("✅ Classifier trained & saved")