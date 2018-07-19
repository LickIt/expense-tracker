from typing import List
from sqlalchemy.orm import Session
from .entities.entity import Session as SessionFactory, engine, Base
from .entities.user import User

Base.metadata.create_all(engine)
session: Session = SessionFactory()

users = session.query(User).all()

if len(users) == 0:
    print("crearing user")
    user = User("test", "123")
    session.add(user)
    session.commit()
    session.close()

    users: List[User] = session.query(User).all()

print("### Users")
for user in users:
    print(f"{user.username}, {user.password}")
