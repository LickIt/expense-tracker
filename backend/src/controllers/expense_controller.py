from flask import Blueprint, jsonify, request, Response
from datetime import datetime
from ..services import dbservices, ExpenseService
from ..entities import ExpenseSchema
from .auth_controller import authorize

expense_api = Blueprint("expenses", "expenses",
                        url_prefix="/api/user/<int:userid>/expenses")


def query_to_datetime(query: str):
    if query:
        return datetime.fromtimestamp(int(query))
    return None


@expense_api.route("")
@dbservices(expense_svc=ExpenseService)
@authorize()
def get_expenses_by_user(userid: int, expense_svc: ExpenseService):
    _from = query_to_datetime(request.args.get("from"))
    _to = query_to_datetime(request.args.get("to"))
    expenses = expense_svc.get_expenses_by_user(userid, _from, _to)
    return jsonify(expenses)


@expense_api.route("", methods=["POST"])
@dbservices(expense_svc=ExpenseService)
@authorize()
def post_expense(userid: int, expense_svc: ExpenseService):
    data = ExpenseSchema(exclude=("id")).load(request.get_json()).data
    data["userid"] = userid
    expense = expense_svc.create_expense(data)
    return jsonify(expense), 201


@expense_api.route("/category-report")
@dbservices(expense_svc=ExpenseService)
@authorize()
def get_expense_report_by_category(userid: int, expense_svc: ExpenseService):
    _from = query_to_datetime(request.args.get("from"))
    _to = query_to_datetime(request.args.get("to"))
    data = expense_svc.get_expense_report_by_category(userid, _from, _to)
    return jsonify(data)
