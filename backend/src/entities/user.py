from sqlalchemy import Column, String
from .entity import Entity, Base

class User(Entity, Base):
    __tablename__ = "users"

    username = Column(String)
    password = Column(String)

    def __init__(self, username, password):
        Entity.__init__(self)
        self.username = username
        self.password = password