from flask import Blueprint, render_template, redirect, url_for, request
from flask_socketio import emit
from flask_login import current_user
from .models import InventoryItems, User, Plots
from . import db, socketio
import json

views = Blueprint('views', __name__)               # Flask uses blueprints to facilitate modularity within projects, here I am creating the 'views' blueprint
                                                   # to define all routes associated with the 'main' section of the website.
@views.route('/', methods=['GET', 'POST'])         # Defining the route for the home page, and passing methods 'GET' and 'POST' to allow requests to and from the backend.        
def home():                                       
    if current_user.is_authenticated:              # Simple conditional that redirects a user to the login page based on whether or not they are authenticated using flask_login.                                                                              
        if request.method == 'POST':                                                        # This route consists of three seperate HTML pages used to create stages (center path, left path, right path) within the game.
            if 'homePathLeft' in request.form:                                              # In the game, buttons appear on screen with unique IDs to allow a player to traverse stages, here in the backend, I am checking
                return render_template("path-left.html", user=current_user)                 # which button has been pressed in order to return the appropriate HTML page.
            if 'homePathRight' in request.form:     
                return render_template("path-right.html", user=current_user)
            if 'leftPathRight' in request.form:
                return render_template("home.html", user=current_user, lastPath='pathLeft')
            if 'rightPathLeft' in request.form:
                return render_template("home.html", user=current_user, lastPath='pathRight')
        return render_template("home.html", user=current_user, lastPath='und')
    else:
        return redirect(url_for('auth.login'))
    

@views.route('/how-to-play')                                                                # This is a simple route used to display the 'instructions.html' page, which contains a brief explanation of the game and its controls.
def howToPlay():
    return render_template("instructions.html", user=current_user)

# Flask-SocketIO documentation linked below.
# https://flask-socketio.readthedocs.io/en/latest/getting_started.html#receiving-messages
# https://flask-socketio.readthedocs.io/en/latest/getting_started.html#sending-messages

@socketio.on('lp_request_user_info')                                                        # Defining a custom SocketIO event to send the appropriate player data to the JavaScript file 'pathLeft.js' upon receiving the 'on.connect()'-message 'lp_request_user_info'.
def handle_my_custom_event():
    queryUser = User.query.filter_by(id=current_user.id).first()                            # Querying the User, Plots, and InventoryItems table using the currently authenticated user's ID
    queryPlots = Plots.query.filter_by(user_id=current_user.id).all()
    queryInventory = InventoryItems.query.filter_by(user_id=current_user.id).all()
    plotsArray = []
    inventoryArray = []
    for plot in queryPlots:                                                                                                         # Currently, I am converting each instance of Plot and InventoryItem to dictionary objects due to the fact that SQLAlchemy tables are not JSON serialize-able. 
        plotsArray.append({"x": plot.x_coord, "y": plot.y_coord, "time_planted":plot.time_planted, "crop_type":plot.crop_type})     # I am aware of the inefficiency, but have had trouble finding a solution and have not noticed any significant impacts due to the size limitations on a player's plot count and inventory space.
    for item in queryInventory:
        inventoryArray.append({"item_name": item.item_name, "item_count":item.item_count, "item_image_id":item.item_image_id, "item_row":item.item_row, "item_column":item.item_column})
    emit('lp_retrieved_user_info', json.dumps({"plots":plotsArray, "inventory":inventoryArray, "coins":queryUser.coins}), broadcast=False)   # Lastly, I send a message back to pathLeft.js containing the user's game data so that the appropriate objects can be rendered on screen.

@socketio.on('lp_save_user_info')                                                           # Defining a custom SocketIO event that responds to the message 'lp_save_user_info' and its associated data.
def handle_my_custom_event(data):
    savedUserInfo = json.loads(data)                                                            # Parsing the received JSON object and querying the User, Plots, and InventoryItems tables.
    existingUserPlots = Plots.query.filter_by(user_id=current_user.id).all()
    existingInventoryItems = InventoryItems.query.filter_by(user_id=current_user.id).all()
    queryUser = User.query.filter_by(id=current_user.id).first()
    
    for exisItem in existingInventoryItems:                                                     # Deleting previously existing user inventory items and plots.
        db.session.delete(exisItem)
    for exisPlot in existingUserPlots:
        db.session.delete(exisPlot)
    
    for item in savedUserInfo["inventory"]:                                                     # Inserting the received player data into its respective tables.
        tempItem = InventoryItems(user_id=current_user.id,
                                 item_name=item["item_name"], 
                                 item_image_id=item["item_image_id"], 
                                 item_count=item["item_count"],
                                 item_row=item["item_row"],
                                 item_column=item["item_column"])
        db.session.add(tempItem)
    for plot in savedUserInfo["plots"]:
        tempPlot = Plots(user_id=current_user.id, x_coord=plot["x"], y_coord=plot["y"], time_planted=plot["time_planted"], crop_type=plot["crop_type"])
        db.session.add(tempPlot)
    queryUser.coins = savedUserInfo["coins"]
    db.session.commit()                                                                         # Lastly, committing the changes to the database.


@socketio.on('rp_request_user_info')                        # Defining a custom SocketIO event to send the appropriate player data to the JavaScript file 'pathRight.js' upon receiving the 'on.connect()'-message 'rp_request_user_info'.
def handle_my_custom_event():
    queryUser = User.query.filter_by(id=current_user.id).first()               
    queryInventory = InventoryItems.query.filter_by(user_id=current_user.id).all()
    inventoryArray = []
    
    for item in queryInventory:
        inventoryArray.append({"item_name": item.item_name, "item_count":item.item_count, "item_image_id":item.item_image_id, "item_row":item.item_row, "item_column":item.item_column})
    emit('rp_retrieved_user_info', json.dumps({"inventory":inventoryArray, "coins":queryUser.coins}), broadcast=False)

@socketio.on('rp_save_user_info')
def handle_my_custom_event(data):
    savedUserInfo = json.loads(data)
    
    queryUser = User.query.filter_by(id=current_user.id).first()
    existingInventoryItems = InventoryItems.query.filter_by(user_id=current_user.id).all()

    for exisItem in existingInventoryItems:
        db.session.delete(exisItem)
    
    for item in savedUserInfo["inventory"]:
        tempItem = InventoryItems(user_id=current_user.id,
                                 item_name=item["item_name"], 
                                 item_image_id=item["item_image_id"], 
                                 item_count=item["item_count"],
                                 item_row=item["item_row"],
                                 item_column=item["item_column"])
        db.session.add(tempItem)
    queryUser.coins = savedUserInfo["coins"]
    db.session.commit()
