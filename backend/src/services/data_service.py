from sqlalchemy.orm import Session
from functools import wraps
from ..entities import SessionFactory

class DataService(object):
    def __init__(self, session: Session):
        super().__init__()
        self.session = session

def dbservices(**service_args):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            session: Session = None
            try:
                session = SessionFactory()
                for key, _cls in service_args.items():
                    kwargs[key] = _cls(session)

                return f(*args, **kwargs)
            finally:
                if session:
                    session.close()

        return wrapper
    return decorator