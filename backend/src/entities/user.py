from sqlalchemy import Column, String, Enum, CheckConstraint
from marshmallow import fields
from marshmallow.schema import Schema, BaseSchema
from typing import Union
import enum
from .entity import Entity, Base, EntitySchema


class User(Entity, Base):
    __tablename__ = "users"

    username = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    role = Column(String(255), CheckConstraint(
        "role = 'user' or role = 'admin'"), nullable=False)

    def __init__(self, id=None, username=None, password=None, role=None):
        Entity.__init__(self, id)
        self.username = username
        self.password = password
        self.role = role

    def __str__(self):
        return f"{self.id}, {self.username}, {self.password}, {self.role}"


class UserSchema(EntitySchema):
    username = fields.String()
    password = fields.String(load_only=True)
    role = fields.String()


UserSchemaType = Union[BaseSchema, UserSchema]
