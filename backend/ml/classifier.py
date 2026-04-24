import pickle

with open("ml/classifier.pkl", "rb") as f:
    model, vectorizer = pickle.load(f)

def predict_department(text):
    X = vectorizer.transform([text])
    return model.predict(X)[0]