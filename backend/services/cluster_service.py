from data.store import clusters

def update_cluster(cluster_id, lat, lon):
    if cluster_id not in clusters:
        clusters[cluster_id] = {
            "id": cluster_id,
            "lat": lat,
            "lon": lon,
            "count": 1,
            "status": "open",
            "assigned_to": None
        }
    else:
        clusters[cluster_id]["count"] += 1

    return clusters[cluster_id]