from ml.dbscan_model import run_dbscan
from ml.classifier import predict_department
from services.cluster_service import update_cluster
from services.assignment import assign_employee
from data.store import complaints, clusters

from models.image_model import get_image_embedding
from models.text_model import get_text_embedding

from rapidfuzz.fuzz import ratio

import numpy as np
from datetime import datetime
import re


def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-z\s]", "", text)
    return text


def process_complaint(image_path, text, lat, lon):

    text = clean_text(text)

    img_emb = get_image_embedding(image_path)
    txt_emb = get_text_embedding(text)

    combined = np.concatenate([
        img_emb,
        txt_emb,
        [lat * 5, lon * 5]
    ])

    # store complaint
    complaints.append({
        "embedding": combined,
        "text": text,
        "lat": lat,
        "lon": lon,
        "cluster_id": None,
        "image": image_path
    })

    #  FUZZY MATCH
    for comp in complaints[:-1]:
        text_score = ratio(text, comp["text"])

        dist = np.linalg.norm(
            np.array([lat, lon]) - np.array([comp["lat"], comp["lon"]])
        )

        if text_score > 80 and dist < 0.01:
            cluster_id = comp["cluster_id"]

            cluster = update_cluster(cluster_id, lat, lon)

            complaints[-1]["cluster_id"] = cluster_id

            if not cluster.get("assigned_to"):
                emp_id = assign_employee(lat, lon)
                cluster["assigned_to"] = emp_id

            return {
                "cluster_id": cluster_id,
                "assigned_to": cluster["assigned_to"]
            }

    # DBSCAN
    all_embeddings = [c["embedding"] for c in complaints]
    labels = run_dbscan(all_embeddings)

    current_label = labels[-1]

    if current_label == -1:
        cluster_id = f"CL-{len(clusters) + 1}"
    else:
        cluster_id = f"CL-{current_label}"

    cluster = update_cluster(cluster_id, lat, lon)

    complaints[-1]["cluster_id"] = cluster_id

    if "created_at" not in cluster:
        cluster["created_at"] = datetime.now()

    if not cluster.get("assigned_to"):
        emp_id = assign_employee(lat, lon)
        cluster["assigned_to"] = emp_id

    predicted_dept = predict_department(text)

    return {
        "cluster_id": cluster_id,
        "assigned_to": cluster["assigned_to"],
        "predicted_department": predicted_dept
    }