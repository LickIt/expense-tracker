from sqlalchemy import create_engine, Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from marshmallow import fields
from marshmallow.schema import Schema

engine = create_engine("sqlite:///expense-tracker.db")
SessionFactory = sessionmaker(bind=engine)
Base = declarative_base()


class Entity():
    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)

    def __init__(self, id=None):
        self.id = id


class EntitySchema(Schema):
    id = fields.Integer()
