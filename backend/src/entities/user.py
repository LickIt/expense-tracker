from sqlalchemy import Column, String
from marshmallow import fields
from marshmallow.schema import Schema, BaseSchema
from typing import Union
from .entity import Entity, Base, EntitySchema

class User(Entity, Base):
    __tablename__ = "users"

    username = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)

    def __init__(self, username, password):
        Entity.__init__(self)
        self.username = username
        self.password = password

    def __str__(self):
        return f"{self.id}, {self.username}, {self.password}"


class UserSchema(EntitySchema):
    username = fields.String()
    password = fields.String(load_only=True)

UserSchemaType = Union[BaseSchema, UserSchema]