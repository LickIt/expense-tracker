from flask import Flask
from flask_cors import CORS
from .entities import engine, Base
from .controllers import user_api, category_api

# create db tables
Base.metadata.create_all(engine)

# start flask app and regiter controllers
app = Flask(__name__)
app.register_blueprint(user_api)
app.register_blueprint(category_api)
CORS(app)
