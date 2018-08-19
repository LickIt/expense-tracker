from sqlalchemy import Column, String, Integer, ForeignKey, Float, DateTime
from marshmallow import fields
from marshmallow.schema import Schema, BaseSchema
from typing import Union
from .entity import Entity, Base, EntitySchema


class Expense(Entity, Base):
    __tablename__ = "expenses"

    amount = Column(Float(), nullable=False)
    timestamp = Column(DateTime(), nullable=False)
    userid = Column(Integer(), ForeignKey("users.id"), nullable=False)
    categoryid = Column(Integer(), ForeignKey("categories.id"), nullable=False)
    notes = Column(String(255), nullable=True)

    def __init__(self, id=None, amount=None, timestamp=None, userid=None, categoryid=None, notes=None):
        Entity.__init__(self, id)
        self.amount = amount
        self.timestamp = timestamp
        self.userid = userid
        self.categoryid = categoryid
        self.notes = notes

    def __str__(self):
        return f"{self.id}, {self.amount}, {self.timestamp}, {self.userid}, {self.categoryid}, {self.notes}"


class ExpenseSchema(EntitySchema):
    amount = fields.Float()
    timestamp = fields.DateTime()
    userid = fields.Integer(dump_only=True, load_only=True)
    categoryid = fields.Integer()
    notes = fields.String()


class ExpenseCategoryReportSchema(Schema):
    categoryid = fields.Integer()
    amount = fields.Float()
    count = fields.Integer()


class CategoryGroupSchema(Schema):
    categoryid = fields.Integer()
    value = fields.Float()


class ExpenseDailyReportSchema(Schema):
    mean = fields.Float()
    median = fields.Float()
    top3CatAmount = fields.Nested(CategoryGroupSchema, many=True)
    top3CatCount = fields.Nested(CategoryGroupSchema, many=True)


class MonthGroupSchema(Schema):
    month = fields.Integer()
    value = fields.Float()


class ExpenseMonthlyReportSchema(Schema):
    thisMonthTotal = fields.Float()
    last5Months = fields.Nested(MonthGroupSchema, many=True)


ExpenseSchemaType = Union[BaseSchema, ExpenseSchema]
ExpenseCategoryReportSchemaType = Union[BaseSchema,
                                        ExpenseCategoryReportSchema]
ExpenseDailyReportSchemaType = Union[BaseSchema, ExpenseDailyReportSchema]
ExpenseMonthlyReportSchemaType = Union[BaseSchema, ExpenseMonthlyReportSchema]
