from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any
from datetime import datetime, timedelta
from ..entities import Expense, ExpenseSchema, ExpenseSchemaType, \
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
        _from = datetime.today() - timedelta(days=30)
        filters = [Expense.userid == userid, Expense.timestamp >= _from]

        # transaction count
        count = self.session \
            .query(func.count(Expense.id)) \
            .filter(*filters) \
            .scalar()

        # mean value (average)
        mean = self.session \
            .query(func.sum(Expense.amount)) \
            .filter(*filters) \
            .scalar()
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
        median = sum(median) / len(median)

        # category groups
        cats = self.session \
            .query(
                Expense.categoryid,
                func.sum(Expense.amount),
                func.count(Expense.id)
            ) \
            .filter(*filters) \
            .group_by(Expense.categoryid) \
            .all()

        # top 3 categories by amount
        top3amount = sorted(cats, key=(lambda c: c[1]), reverse=True)[:3]
        top3amount = [{"categoryid": c[0], "value": c[1]} for c in top3amount]

        # top 3 categories by transaction count
        top3count = sorted(cats, key=(lambda c: c[2]), reverse=True)[:3]
        top3count = [{"categoryid": c[0], "value": c[2]} for c in top3count]

        report: ExpenseDailyReportSchemaType = ExpenseDailyReportSchema()
        return report.dump({
            "mean": mean,
            "median": median,
            "top3CatAmount": top3amount,
            "top3CatCount": top3count
        }).data

    def get_monthly_expense_report(self, userid: int) -> Dict[str, Any]:
        user_filter = Expense.userid == userid
        _month_start = datetime.today().replace(day=1)
        print(_month_start)

        total = self.session \
            .query(func.sum(Expense.amount)) \
            .filter(user_filter, Expense.timestamp >= _month_start) \
            .scalar()

        # month = func.month(Expense.timestamp).label("month")
        month = func.strftime("%m", Expense.timestamp).label("month")
        average = self.session \
            .query(month, func.sum(Expense.amount).label("sum")) \
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
            "last5Months": average
        }).data
