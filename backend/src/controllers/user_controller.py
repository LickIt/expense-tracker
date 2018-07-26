from flask import Blueprint, jsonify, request, Response
from functools import wraps
from ..services import dbservices, UserService
from ..entities import UserSchema
from .auth_controller import authorize

user_api = Blueprint("users", "users", url_prefix="/api/users")


@user_api.route("")
@dbservices(user_svc=UserService)
@authorize("admin")
def get_users(user_svc: UserService):
    users = user_svc.get_users()
    return jsonify(users)


@user_api.route("", methods=["POST"])
@dbservices(user_svc=UserService)
def post_user(user_svc: UserService):
    # only allow user creation from localhost
    if request.remote_addr != "127.0.0.1":
        return Response(status=403)

    data = UserSchema(exclude=("id")).load(request.get_json()).data
    user = user_svc.create_user(data)
    return jsonify(user), 201


@user_api.route("", methods=["PATCH"])
@dbservices(user_svc=UserService)
@authorize()
def patch_user(user_svc: UserService):
    data = UserSchema(exclude=("role")).load(request.get_json()).data
    user = user_svc.patch_user(data)
    return jsonify(user)
