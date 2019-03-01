from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any
from datetime import datetime, timedelta
from ..entities import engine, Expense, ExpenseSchema, ExpenseSchemaType, \
    ExpenseCategoryReportSchema, ExpenseCategoryReportSchemaType, \
    ExpenseDailyReportSchema, ExpenseDailyReportSchemaType, \
    ExpenseMonthlyReportSchema, ExpenseMonthlyReportSchemaType
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

    def get_expense_report_by_category(self, userid: int, _from: datetime = None, _to: datetime = None) -> Dict[str, Any]:
        filters = [Expense.userid == userid]
        if _from:
            filters.append(Expense.timestamp >= _from)
        if _to:
            filters.append(Expense.timestamp <= _to)

        expenses = self.session \
            .query(
                Expense.categoryid,
                func.sum(Expense.amount).label("amount"),
                func.count(Expense.id).label("count")
            ) \
            .filter(*filters) \
            .group_by(Expense.categoryid) \
            .all()

        schema: ExpenseCategoryReportSchemaType = ExpenseCategoryReportSchema(
            many=True)
        return schema.dump(expenses).data

    def get_daily_expense_report(self, userid: int) -> Dict[str, Any]:
        _days = 30
        _from = datetime.today() - timedelta(days=_days)
        filters = [Expense.userid == userid, Expense.timestamp >= _from]

        # transaction count
        count = self.session \
            .query(func.count(Expense.id)) \
            .filter(*filters) \
            .scalar() or 1

        # mean value (average)
        mean = self.session \
            .query(func.sum(Expense.amount)) \
            .filter(*filters) \
            .scalar() or 0
        mean = mean / count

        # median value
        median = self.session \
            .query(Expense.amount) \
            .filter(*filters) \
            .order_by(Expense.amount) \
            .offset(count // 2) \
            .limit(1 if count % 2 == 1 else 2) \
            .all()
        median = [x[0] for x in median]
        median = sum(median) / (len(median) or 1)

        # category groups
        amount = func.sum(Expense.amount)
        cats = self.session \
            .query(
                Expense.categoryid,
                amount
            ) \
            .filter(*filters) \
            .group_by(Expense.categoryid) \
            .order_by(amount.desc()) \
            .limit(5) \
            .all()
        cats = [{"categoryid": c[0], "value": round(c[1] / _days, 2)} for c in cats]

        report: ExpenseDailyReportSchemaType = ExpenseDailyReportSchema()
        return report.dump({
            "mean": mean,
            "median": median,
            "topCategories": cats
        }).data

    def get_monthly_expense_report(self, userid: int) -> Dict[str, Any]:
        user_filter = Expense.userid == userid
        _month_start = datetime.today().replace(day=1)

        total = self.session \
            .query(func.sum(Expense.amount)) \
            .filter(user_filter, Expense.timestamp >= _month_start) \
            .scalar() or 0

        month = Expense.timestamp
        if engine.name == "sqlite":
            month = func.strftime("%m", Expense.timestamp)
        elif engine.name == "postgresql":
            month = func.extract("month", Expense.timestamp)

        average = self.session \
            .query(month.label("month"), func.sum(Expense.amount).label("sum")) \
            .filter(user_filter) \
            .group_by(month) \
            .order_by(month.desc()) \
            .limit(5) \
            .all()
        average.reverse()
        average = [{"month": int(x[0]), "value": x[1]} for x in average]

        report: ExpenseMonthlyReportSchemaType = ExpenseMonthlyReportSchema()
        return report.dump({
            "thisMonthTotal": total,
            "monthlyTrend": average
        }).data
