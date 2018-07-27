from sqlalchemy.orm import Session
from typing import Dict, Any
from hashlib import sha256
from base64 import b64encode
from ..entities import User, UserSchema, UserSchemaType
from .data_service import DataService
from ..common import ApiException


class UserService(DataService):
    def get_users(self) -> Dict[str, Any]:
        users = self.session \
            .query(User) \
            .order_by(User.id) \
            .all()
        schema: UserSchemaType = UserSchema(many=True)
        return schema.dump(users).data

    def create_user(self, data: Dict[str, Any]):
        user = User(**data)
        user.password = self.hash_password(user.password)

        self.session.add(user)
        self.session.commit()

        schema: UserSchemaType = UserSchema()
        return schema.dump(user).data

    def patch_user(self, data: Dict[str, Any]):
        userid = data["id"]
        user: User = self.session \
            .query(User) \
            .filter_by(id=userid) \
            .first()

        patch = User(**data)
        if patch.username and user.username != patch.username:
            user.username = patch.username

        if patch.password and user.password != self.hash_password(patch.password):
            user.password = self.hash_password(patch.password)

        if patch.role and user.role != patch.role:
            user.role = patch.role

        self.session.commit()
        schema: UserSchemaType = UserSchema()
        return schema.dump(user).data

    def login(self, data: Dict[str, Any]) -> User:
        username = data["username"]
        password = data["password"]

        if not password or not username:
            raise ApiException("No username or password!")

        user: User = self.session \
            .query(User) \
            .filter_by(username=username) \
            .first()

        if not user or user.password != self.hash_password(password):
            raise ApiException("Invalid username or password!")

        return user

    @staticmethod
    def hash_password(password: str) -> str:
        h = sha256(password.encode()).digest()
        return b64encode(h).decode()
