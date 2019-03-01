import os
from sqlalchemy import create_engine, Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.engine import Engine
from marshmallow import fields
from marshmallow.schema import Schema

connection_string = os.getenv("DB_CONNECTION", "sqlite:///expense-tracker.db")
engine: Engine = create_engine(connection_string)
SessionFactory = sessionmaker(bind=engine)
Base = declarative_base()

print("Using engine:", engine.name)

class Entity():
    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)

    def __init__(self, id=None):
        self.id = id


class EntitySchema(Schema):
    id = fields.Integer()
