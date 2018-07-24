from sqlalchemy import Column, String, Integer, ForeignKey
from marshmallow import fields
from marshmallow.schema import Schema, BaseSchema
from typing import Union
from .entity import Entity, Base, EntitySchema


class Category(Entity, Base):
    __tablename__ = "categories"

    name = Column(String(255), nullable=False)
    userid = Column(Integer, ForeignKey("users.id"), nullable=False)

    def __init__(self, id=None, name=None, userid=None):
        Entity.__init__(self, id)
        self.name = name
        self.userid = userid

    def __str__(self):
        return f"{self.id}, {self.name}, {self.userid}"


class CategorySchema(EntitySchema):
    name = fields.String()
    userid = fields.Integer()


CategorySchemaType = Union[BaseSchema, CategorySchema]
