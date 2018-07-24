from flask import Blueprint, jsonify, request, Response
from functools import wraps
from ..services import dbservices, UserService
from ..entities import UserSchema

user_api = Blueprint("users", "users", url_prefix="/api/users")


# only allow user creation from localhost
def localhost(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if request.remote_addr != "127.0.0.1":
            return Response(status=403)
        return f(*args, **kwargs)

    return wrapper


@user_api.route("")
@localhost
@dbservices(user_svc=UserService)
def get_users(user_svc: UserService):
    users = user_svc.get_users()
    return jsonify(users)


@user_api.route("", methods=["POST"])
@localhost
@dbservices(user_svc=UserService)
def post_user(user_svc: UserService):
    data = UserSchema(exclude=("id")).load(request.get_json()).data
    user = user_svc.create_user(data)
    return jsonify(user), 201


@user_api.route("", methods=["PATCH"])
@localhost
@dbservices(user_svc=UserService)
def patch_user(user_svc: UserService):
    data = UserSchema().load(request.get_json()).data
    user = user_svc.patch_user(data)
    return jsonify(user)
