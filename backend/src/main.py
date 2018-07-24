from typing import List, ClassVar
from sqlalchemy.orm import Session
from flask import Flask, jsonify, request
from flask.json import loads
from .entities import SessionFactory, engine, Base, User, UserSchema
from .services import dbservices, UserService

Base.metadata.create_all(engine)

app = Flask(__name__)


@app.route('/api/users')
@dbservices(user_svc=UserService)
def get_users(user_svc: UserService):
    users = user_svc.get_users()
    return jsonify(users)


@app.route('/api/users', methods=["POST"])
@dbservices(user_svc=UserService)
def post_users(user_svc: UserService):
    data = UserSchema(exclude=('id')).load(request.get_json()).data
    user = user_svc.create_user(data)
    return jsonify(user), 201
