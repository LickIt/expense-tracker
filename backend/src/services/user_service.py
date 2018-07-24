from sqlalchemy.orm import Session
from typing import Dict, Any
from hashlib import sha256
from base64 import b64encode
from ..entities import User, UserSchema, UserSchemaType
from .data_service import DataService


class UserService(DataService):
    def get_users(self) -> Dict[str, Any]:
        users = self.session.query(User).all()
        schema: UserSchemaType = UserSchema(many=True)
        return schema.dump(users).data

    def create_user(self, data: Dict[str, Any]):
        user = User(**data)
        user.password = self.hash_password(user.password)

        self.session.add(user)
        self.session.commit()

        schema: UserSchemaType = UserSchema()
        return schema.dump(user).data

    @staticmethod
    def hash_password(password: str) -> str:
        h = sha256(password.encode()).digest()
        return b64encode(h).decode()
