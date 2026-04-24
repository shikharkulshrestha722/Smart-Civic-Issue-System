from sklearn.cluster import DBSCAN

def run_dbscan(embeddings):
    if len(embeddings) < 2:
        return [0]

    model = DBSCAN(eps=1.5, min_samples=2)
    labels = model.fit_predict(embeddings)

    return labels.tolist()