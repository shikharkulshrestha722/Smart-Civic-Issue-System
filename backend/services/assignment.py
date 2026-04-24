from db.database import SessionLocal
from db import models
import math

def distance(lat1, lon1, lat2, lon2):
    return math.sqrt((lat1 - lat2)**2 + (lon1 - lon2)**2)

def assign_employee(lat, lon):
    db = SessionLocal()
    employees = db.query(models.Employee).all()

    best = None
    best_score = float("inf")

    for emp in employees:
        d = distance(lat, lon, emp.lat, emp.lon)
        score = d + emp.workload * 0.5

        if score < best_score:
            best_score = score
            best = emp

    if best:
        best.workload += 1
        db.commit()
        return best.emp_id

    return None