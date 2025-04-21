from sqlalchemy import create_engine
from models.schemas import Base
from dotenv import load_dotenv
import os

load_dotenv()

def init_db():
    # Create engine
    engine = create_engine(os.getenv("DATABASE_URL"))
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db() 