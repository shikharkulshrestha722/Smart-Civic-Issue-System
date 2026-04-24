from sqlalchemy import Column, Integer, String, Float
from db.database import Base


# 👤 USERS
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    password = Column(String)

# 👷 EMPLOYEES
class Employee(Base):
    __tablename__ = "employees"

    emp_id = Column(String, primary_key=True)
    name = Column(String)
    password = Column(String)
    lat = Column(Float)
    lon = Column(Float)
    workload = Column(Integer, default=0)

# 🧑‍💼 ADMINS
class Admin(Base):
    __tablename__ = "admins"

    admin_id = Column(String, primary_key=True)
    password = Column(String)

from sqlalchemy import Column, Integer, String, Float, DateTime

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True)
    description = Column(String)
    image = Column(String)
    lat = Column(Float)
    lon = Column(Float)
    department = Column(String)
    status = Column(String)
    cluster_id = Column(String)
    created_at = Column(DateTime)
    user_id = Column(Integer)