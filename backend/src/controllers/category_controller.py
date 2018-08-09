from flask import Blueprint, jsonify, request, Response
from ..services import dbservices, CategoryService
from ..entities import CategorySchema
from .auth_controller import authorize

category_api = Blueprint("categories", "categories",
                         url_prefix="/api/user/<int:userid>/categories")


@category_api.route("")
@dbservices(category_svc=CategoryService)
@authorize()
def get_categories_by_user(userid: int, category_svc: CategoryService):
    categories = category_svc.get_categories_by_user(userid)
    return jsonify(categories)


@category_api.route("/<int:id>")
@dbservices(category_svc=CategoryService)
@authorize()
def get_category_by_user(userid: int, id: int, category_svc: CategoryService):
    category = category_svc.get_category_by_user(id, userid)
    return jsonify(category)


@category_api.route("", methods=["POST"])
@dbservices(category_svc=CategoryService)
@authorize()
def post_category(userid: int, category_svc: CategoryService):
    data = CategorySchema(exclude=("id")).load(request.get_json()).data
    data["userid"] = userid
    category = category_svc.create_category(data)
    return jsonify(category), 201


@category_api.route("", methods=["PATCH"])
@dbservices(category_svc=CategoryService)
@authorize()
def patch_category(userid: int, category_svc: CategoryService):
    data = CategorySchema().load(request.get_json()).data
    data["userid"] = userid
    category = category_svc.patch_category(data)
    return jsonify(category)
