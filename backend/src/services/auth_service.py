import os.path
import secrets
import jwt
from datetime import datetime, timedelta
from collections import namedtuple
from ..entities import User


class AuthService(object):
    __AUTH_FILE__ = ".secret"
    __ALGORITHM__ = "HS256"
    __EXPIRATION_DELTA__ = timedelta(minutes=15)
    __DATETIME_FORMAT__ = "%Y-%m-%dT%H:%M:%SZ"

    def __init__(self):
        if not os.path.isfile(AuthService.__AUTH_FILE__):
            AuthService.__create_secret()

        with open(AuthService.__AUTH_FILE__, "r") as f:
            self.secret = f.readline()

    JwtPayload = namedtuple("JwtPayload", ["userid", "role", "expires"])

    def generate_token(self, user: User) -> str:
        expires = datetime.utcnow() + AuthService.__EXPIRATION_DELTA__
        expires = expires.strftime(AuthService.__DATETIME_FORMAT__)

        payload = AuthService.JwtPayload(user.id, user.role, expires)
        token = jwt.encode(payload._asdict(), self.secret,
                           algorithm=AuthService.__ALGORITHM__)
        return token.decode()

    def validate_token(self, token: str) -> "AuthService.JwtPayload":
        data = jwt.decode(token, self.secret,
                          algorithms=AuthService.__ALGORITHM__)
        payload = AuthService.JwtPayload(**data)
        expires = datetime.strptime(
            payload.expires, AuthService.__DATETIME_FORMAT__)

        if datetime.utcnow() > expires:
            raise Exception("Expired token!")

        return payload

    @staticmethod
    def __create_secret():
        with open(AuthService.__AUTH_FILE__, "w") as f:
            secret = secrets.token_hex(32)
            f.write(secret)
