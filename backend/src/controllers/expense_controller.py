from flask import Blueprint, jsonify, request, Response
from datetime import datetime
from ..services import dbservices, ExpenseService
from ..entities import ExpenseSchema

expense_api = Blueprint("expenses", "expenses",
                        url_prefix="/api/expenses")


def query_to_datetime(query: str):
    if query:
        return datetime.fromtimestamp(int(query))
    return None


@expense_api.route("/<int:userid>")
@dbservices(expense_svc=ExpenseService)
def get_expenses_by_user(userid: int, expense_svc: ExpenseService):
    _from = query_to_datetime(request.args.get("from"))
    _to = query_to_datetime(request.args.get("to"))
    expenses=expense_svc.get_expenses_by_user(userid, _from, _to)
    return jsonify(expenses)


@expense_api.route("", methods=["POST"])
@dbservices(expense_svc=ExpenseService)
def post_expense(expense_svc: ExpenseService):
    data=ExpenseSchema(exclude=("id")).load(request.get_json()).data
    expense=expense_svc.create_expense(data)
    return jsonify(expense), 201
