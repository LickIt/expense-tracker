from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any
from datetime import datetime
from ..entities import Expense, ExpenseSchema, ExpenseSchemaType, ExpenseCategoryReportSchema, ExpenseCategoryReportSchemaType
from .data_service import DataService


class ExpenseService(DataService):
    def get_expenses_by_user(self, userid: int, _from: datetime = None, _to: datetime = None) -> Dict[str, Any]:
        filters = [Expense.userid == userid]
        if _from:
            filters.append(Expense.timestamp >= _from)
        if _to:
            filters.append(Expense.timestamp <= _to)

        expenses = self.session \
            .query(Expense) \
            .filter(*filters) \
            .order_by(Expense.id.desc()) \
            .all()

        schema: ExpenseSchemaType = ExpenseSchema(many=True)
        return schema.dump(expenses).data

    def create_expense(self, data: Dict[str, Any]):
        expense = Expense(**data)

        if not expense.timestamp:
            expense.timestamp = datetime.utcnow()

        self.session.add(expense)
        self.session.commit()

        schema: ExpenseSchemaType = ExpenseSchema()
        return schema.dump(expense).data

    def get_expense_report_by_category(self, userid: int) -> Dict[str, Any]:
        expenses = self.session \
            .query(
                Expense.categoryid,
                func.sum(Expense.amount).label("amount"),
                func.count(Expense.id).label("count")
            ) \
            .filter_by(userid=userid) \
            .group_by(Expense.categoryid) \
            .all()

        schema: ExpenseCategoryReportSchemaType = ExpenseCategoryReportSchema(
            many=True)
        return schema.dump(expenses).data
