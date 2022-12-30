from . import db
from flask_login import UserMixin

class User(db.Model, UserMixin):                                    # Defining the User, Plots, and InventoryItems tables within the SQLite database
    id = db.Column(db.Integer, primary_key=True)                    # using Flask SQLAlchemy. Both the Plots and InventoryItems tables hold many-to-one relationships
    email = db.Column(db.String(50), unique=True)                   # with the User tables.
    username = db.Column(db.String(15))                             
    model = db.Column(db.String(6))
    coins = db.Column(db.Integer)
    password = db.Column(db.String(150))
    plots = db.relationship('Plots')
    inventoryItems = db.relationship('InventoryItems')

class Plots(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    x_coord = db.Column(db.Float)
    y_coord = db.Column(db.Float)
    time_planted = db.Column(db.Integer)
    crop_type = db.Column(db.String(15))


class InventoryItems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    item_name = db.Column(db.String(20))
    item_image_id = db.Column(db.String(20))
    item_count = db.Column(db.Integer)
    item_row = db.Column(db.Integer)
    item_column = db.Column(db.Integer)
