from typing import List, ClassVar
from sqlalchemy.orm import Session
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from .entities import SessionFactory, engine, Base, User, UserSchema
from .services import dbservices, UserService

Base.metadata.create_all(engine)

app = Flask(__name__)
CORS(app)


@app.route('/api/users')
@dbservices(user_svc=UserService)
def get_users(user_svc: UserService):
    users = user_svc.get_users()
    return jsonify(users)


@app.route('/api/users', methods=["POST"])
@dbservices(user_svc=UserService)
def post_users(user_svc: UserService):
    # only allow user creation from localhost
    if request.remote_addr != "127.0.0.1":
        return Response(status=403)

    data = UserSchema(exclude=('id')).load(request.get_json()).data
    user = user_svc.create_user(data)
    return jsonify(user), 201
