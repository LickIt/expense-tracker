from sqlalchemy.orm import Session
from typing import Dict, Any
from datetime import datetime
from ..entities import Expense, ExpenseSchema, ExpenseSchemaType
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
            .order_by(Expense.id) \
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
