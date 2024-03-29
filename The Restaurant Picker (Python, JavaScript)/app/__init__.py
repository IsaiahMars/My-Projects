from flask import Flask
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from sqlalchemy_utils.functions import database_exists
from flask_googlemaps import GoogleMaps
from flask_simple_geoip import SimpleGeoIP

db = SQLAlchemy()                  # Creating the SQLAlchemy class object used to integrate our database into our project
DB_NAME = 'instance name'       
DB_ADDRESS = 'server address'           
DB_USER = 'username'
DB_PASSWORD = 'password'

mail = Mail()

map = GoogleMaps()

simple_geoip = SimpleGeoIP()

def createApp():
    app = Flask(__name__)       
    app.config['SECRET_KEY'] = "secret key"                                                                      # Creating our Flask app object and establishing a connection to MySQL server.
    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_ADDRESS}/{DB_NAME}'       # 'pymysql' is injected into the uri here to allow us to access MySQL databases with SQLAlchemy code.
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False                                                            # Disabling 'Track Modifications' reduces significant overhead.
    db.init_app(app)

    app.config['MAIL_SERVER']='smtp.gmail.com'                                  
    app.config['MAIL_PORT'] = 465                                                   # Configuring Flask-Mail API as per documentation requirements, linked below:
    app.config['MAIL_USERNAME'] = 'mail username'                                   # https://pythonhosted.org/Flask-Mail/
    app.config['MAIL_PASSWORD'] = 'mail password'
    app.config['MAIL_USE_TLS'] = False
    app.config['MAIL_USE_SSL'] = True
    mail.init_app(app)

    app.config['GOOGLEMAPS_KEY'] = "google maps api key"                       # Configuring Google Maps API as per documentation requirements, linked below:
    map.init_app(app)                                                          # https://pypi.org/project/flask-googlemaps/

    app.config['GEOIPIFY_API_KEY'] = "geoipify api key"                        # Configuring GeoIPify API as per documentation requirements, linked below: 
    simple_geoip.init_app(app)                                                 # https://pypi.org/project/Flask-Simple-GeoIP/

    from .views import views
    from .auth import auth
    from .models import User     

    createDatabase(app)              

    login_manager = LoginManager()           # Defining our login manager used to keep track of currently active users
    login_manager.login_view = 'auth.login'  # See documentation for more info: https://flask-login.readthedocs.io/en/latest/
    login_manager.init_app(app)
    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    app.register_blueprint(views, url_prefix="/")  # Registering the blueprints for our routes used in our app.
    app.register_blueprint(auth, url_prefix="/")

    return app

def createDatabase(app):
    if database_exists(app.config['SQLALCHEMY_DATABASE_URI']):   # Checks to see if the database exists, and creates the tables within our database that are required by our project
        with app.app_context():
            db.create_all()
