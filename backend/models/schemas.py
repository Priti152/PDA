from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from db.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(100))
    role = Column(String(20))  # admin, doctor, patient
    is_active = Column(Boolean, default=True)

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    registration_number = Column(String(20), unique=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    date_of_birth = Column(DateTime)
    gender = Column(String(10))
    address = Column(String(200))
    phone = Column(String(20))
    email = Column(String(100))
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User")
    appointments = relationship("Appointment", back_populates="patient")
    medical_history = relationship("MedicalHistory", back_populates="patient")
    prescriptions = relationship("Prescription", back_populates="patient")
    reports = relationship("Report", back_populates="patient")
    bills = relationship("Billing", back_populates="patient")

class Doctor(Base):
    __tablename__ = "doctors"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    specialization = Column(String(100))
    phone = Column(String(20))
    email = Column(String(100))
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User")
    appointments = relationship("Appointment", back_populates="doctor")
    prescriptions = relationship("Prescription", back_populates="doctor")

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    appointment_date = Column(DateTime)
    status = Column(String(20))  # scheduled, completed, cancelled
    notes = Column(Text)
    
    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")

class MedicalHistory(Base):
    __tablename__ = "medical_history"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    date = Column(DateTime, default=datetime.utcnow)
    diagnosis = Column(Text)
    treatment = Column(Text)
    notes = Column(Text)
    
    patient = relationship("Patient", back_populates="medical_history")

class Prescription(Base):
    __tablename__ = "prescriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    date = Column(DateTime, default=datetime.utcnow)
    medication = Column(Text)
    dosage = Column(String(100))
    instructions = Column(Text)
    
    patient = relationship("Patient", back_populates="prescriptions")
    doctor = relationship("Doctor", back_populates="prescriptions")

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    test_name = Column(String(100))
    test_date = Column(DateTime)
    result = Column(Text)
    notes = Column(Text)
    
    patient = relationship("Patient", back_populates="reports")

class Billing(Base):
    __tablename__ = "billing"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    amount = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20))  # pending, paid
    description = Column(Text)
    
    patient = relationship("Patient", back_populates="bills") 