from sqlalchemy import create_engine, Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

db_url = "localhost:5432"
db_name = "expense-tracker"
db_user = "postgres"
db_password = "postgres"

engine = create_engine(f"postgresql://{db_user}:{db_password}@{db_url}/{db_name}")
Session = sessionmaker(bind=engine)
Base = declarative_base()

class Entity():
    id = Column(Integer, primary_key=True)