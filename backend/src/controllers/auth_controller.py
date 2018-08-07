from flask import Blueprint, jsonify, request, Response
from functools import wraps
from ..services import AuthService, UserService, dbservices
from ..entities import UserSchema, UserSchemaType

auth_api = Blueprint("auth", "auth", url_prefix="/api/auth")
auth_svc = AuthService()


def authorize(role: str = None):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            auth = request.headers.get("Authorization", None)
            if not auth or not auth.startswith("Bearer "):
                return Response("Invalid or missing Authorization header!", status=401)

            auth = auth.split(" ")[1]
            claims = auth_svc.validate_token(auth)

            # check role match except for admins
            if role and claims.role != "admin" and claims.role != role:
                return Response(status=403)

            # check if user has permission to view resource
            # except for admins
            if claims.role != "admin":
                data = request.get_json()
                userid = None

                if kwargs and "userid" in kwargs:
                    userid = kwargs.get("userid")
                if data and "userid" in data:
                    userid = data.get("userid")

                if userid and userid != claims.userid:
                    return Response(status=403)

            return f(*args, **kwargs)

        return wrapper
    return decorator


@auth_api.route("/login", methods=["POST"])
@dbservices(user_svc=UserService)
def post_login(user_svc: UserService):
    data = UserSchema(exclude=("id", "role")).load(request.get_json()).data
    user = user_svc.login(data)
    token = auth_svc.generate_token(user)

    schema: UserSchemaType = UserSchema()
    response = schema.dump(user).data
    response["token"] = token

    return jsonify(response)


@auth_api.route("/loggedin", methods=["GET"])
@dbservices(user_svc=UserService)
@authorize()
def get_loggedin_user(user_svc: UserService):
    auth = request.headers.get("Authorization", None)
    auth = auth.split(" ")[1]
    claims = auth_svc.validate_token(auth)
    user = user_svc.get_user(claims.userid)

    return jsonify(user)
