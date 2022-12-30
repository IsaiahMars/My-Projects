from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_socketio import SocketIO
from os import path

db = SQLAlchemy()
DB_NAME = "farminggamedb"

socketio = SocketIO(logger=True,cors_allowed_origins="*")

def createApp():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = "farmgame2022"                                         # Instantiating and initilizing Flask, SQLAlchemy, and SocketIO to be used in the project.
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///db/{DB_NAME}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    socketio.init_app(app)

    from .views import views
    from .auth import auth
    from .models import User

    createDatabase(app)

    login_manager = LoginManager()           # Defining the login manager used to keep track of currently active users as per documentation standards.
    login_manager.login_view = 'auth.login'  # Link provided here: https://flask-login.readthedocs.io/en/latest/
    login_manager.init_app(app)
    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    app.register_blueprint(views, url_prefix="/")           # Registering the blueprints defined by auth.py and views.py
    app.register_blueprint(auth, url_prefix="/")

    return app


def createDatabase(app):                                    # Simple function used to check if the SQLite database exists within the folder-structure
    if not path.exists('client/db/' + DB_NAME):             # and create the database if it does not.
        db.create_all(app=app)