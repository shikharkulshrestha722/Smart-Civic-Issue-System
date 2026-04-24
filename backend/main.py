from fastapi import FastAPI, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
# ML + in-memory cluster system
from ml.pipeline import process_complaint
from data.store import clusters
from fastapi import UploadFile, File
import shutil
from data.store import complaints
# DB
from db.database import engine, Base, SessionLocal
from db import models

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for demo)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---------------- DB SESSION ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- LOGIN SCHEMAS ----------------

class UserLogin(BaseModel):
    email: str
    password: str

class EmployeeLogin(BaseModel):
    emp_id: str
    password: str

class AdminLogin(BaseModel):
    admin_id: str
    password: str

# ---------------- LOGIN APIs ----------------

@app.post("/login/user")
def login_user(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.email == data.email,
        models.User.password == data.password
    ).first()

    if user:
        return {"status": "success", "role": "user", "id": user.id}
    return {"status": "fail"}


@app.post("/login/employee")
def login_employee(data: EmployeeLogin, db: Session = Depends(get_db)):
    emp = db.query(models.Employee).filter(
        models.Employee.emp_id == data.emp_id,
        models.Employee.password == data.password
    ).first()

    if emp:
        return {"status": "success", "role": "employee", "id": emp.emp_id}
    return {"status": "fail"}


@app.post("/login/admin")
def login_admin(data: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(models.Admin).filter(
        models.Admin.admin_id == data.admin_id,
        models.Admin.password == data.password
    ).first()

    if admin:
        return {"status": "success", "role": "admin", "id": admin.admin_id}
    return {"status": "fail"}


# ---------------- REPORT ISSUE ----------------

@app.post("/report")
async def report_issue(
    file: UploadFile = File(...),
    description: str = Form(...),
    lat: float = Form(...),
    lon: float = Form(...),
    department: str = Form(...),
    user_id: int = Form(...),
    db: Session = Depends(get_db)
):
    file_path = f"temp_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ML pipeline
    result = process_complaint(file_path, description, lat, lon)

    # Save to DB
    complaint = models.Complaint(
        description=description,
        image=file_path,
        lat=lat,
        lon=lon,
        department=department,
        status="Pending",
        cluster_id=result["cluster_id"],
        created_at=datetime.now(),
        user_id=user_id
    )

    db.add(complaint)
    db.commit()

    # Add created time in cluster (for admin analytics)
    if result["cluster_id"] in clusters:
        clusters[result["cluster_id"]]["created_at"] = datetime.now()

    return {
        "message": "Complaint processed",
        **result
    }


# ---------------- GET ALL CLUSTERS ----------------

@app.get("/clusters")
def get_clusters():
    return list(clusters.values())


# ---------------- EMPLOYEE VIEW ----------------

@app.get("/employee/{name}")
def get_employee_clusters(name: str):
    result = []

    for cluster in clusters.values():
        if cluster["assigned_to"] == name:
            result.append(cluster)

    return result


# ---------------- COMPLETE TASK ----------------


@app.post("/complete/{cluster_id}")
async def complete_task(cluster_id: str, file: UploadFile = File(...)):

    # save proof image
    file_path = f"completed_{cluster_id}.jpg"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # update cluster status
    if cluster_id in clusters:
        clusters[cluster_id]["status"] = "resolved"
        clusters[cluster_id]["completed_image"] = file_path

        return {"message": "Task completed"}

    return {"error": "Cluster not found"}



# ---------------- ADMIN ANALYTICS ----------------

@app.get("/admin/clusters")
def admin_clusters():
    result = []

    for c in clusters.values():
        created_at = c.get("created_at", datetime.now())
        hours = (datetime.now() - created_at).total_seconds() / 3600

        result.append({
            **c,
            "hours_since_created": round(hours, 2)
        })

    return result


# ---------------- SAFE SEED DATA ----------------

@app.get("/seed")
def seed_data(db: Session = Depends(get_db)):

    employees_data = [
        {"emp_id": "E1", "name": "Rahul", "lat": 13.08, "lon": 80.27},
        {"emp_id": "E2", "name": "Amit", "lat": 13.06, "lon": 80.25},
        {"emp_id": "E3", "name": "Priya", "lat": 13.10, "lon": 80.29},
    ]

    for emp in employees_data:
        if not db.query(models.Employee).filter_by(emp_id=emp["emp_id"]).first():
            db.add(models.Employee(
                emp_id=emp["emp_id"],
                name=emp["name"],
                password="123",
                lat=emp["lat"],
                lon=emp["lon"],
                workload=0
            ))

    if not db.query(models.Admin).filter_by(admin_id="A1").first():
        db.add(models.Admin(admin_id="A1", password="123"))

    if not db.query(models.User).filter_by(email="user@test.com").first():
        db.add(models.User(
            name="User1",
            email="user@test.com",
            password="123"
        ))

    db.commit()

    return {"message": "Multiple employees added"}


from fastapi import FastAPI


@app.get("/cluster/{cluster_id}")
def get_cluster_details(cluster_id: str):
    result = []

    for c in complaints:
        if c["cluster_id"] == cluster_id:
            result.append({
                "text": c["text"],
                "lat": c["lat"],
                "lon": c["lon"],
                "image": c["image"]
            })

    return result

# ---------------- ROOT ----------------

@app.get("/")
def home():
    return {"message": "Smart Civic AI Backend Running 🚀"}

