######################################################################################
# The authentication process used here is based roughly on the tutorial posted by the 
# YouTube channel 'Tech With Tim' in his flask website tutorial; link provided below.
# https://www.youtube.com/watch?v=dam0GPOAvVI
######################################################################################
from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from .models import User

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])                                        # Defining the route for the login page, and ensuring the user is logged out before displayed the page using logout_user().                    
def login():
    logout_user()                                                     
    if request.method == 'POST':
        if 'login' in request.form:                                                   # When the 'login' button is pressed, the backend requests the input from the forms on the login page
            email = request.form.get('email')                                         # queries the User table to see if a user with the entered email exists, then checks to see if the entered
            password = request.form.get('password')                                   # password matches that account's password before either redirecting them to the homepage, or 'flash()'-ing an 
            user = User.query.filter_by(email=email).first()                          # error message.
            if user:
                if check_password_hash(user.password, password):                    
                    login_user(user, remember=False)                                
                    return redirect(url_for("views.home"))
                else:
                    flash('Check your password and try again.', category='error')   
            else:
                flash('Account with this email does not exist.', category='error')
    return render_template("login.html", user=current_user)

@auth.route('/sign-up', methods=['GET', 'POST'])                                       # Defining the route for the sign up page, and ensuring the user is logged out before displayed the page using logout_user().                           
def signUp():
    logout_user()  
    if request.method == 'POST':
        email = request.form.get('email')                                              # Retrieving the entered data upon form submission.                   
        username = request.form.get('username')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')
        queryEmail = User.query.filter_by(email=email).first()                         # Querying the user table to see if a user with the entered email already exists.                
        if queryEmail: 
            flash('An account with this email already exists!', category='error')      # A series of conditionals is used to ensure that 'proper' data is being entered.
        elif len(email) < 9: 
            flash('Email must be longer than 8 characters.', category='error')
        elif len(email) > 50:
            flash('Email must be less than 50 characters.', category='error')
        elif len(username) < 4:
            flash('Username must be longer than 3 characters', category='error')
        elif len(username) > 15:
            flash('Username must be less than 15 characters long.', category='error')
        elif password1 != password2:                                               
            flash('Passwords do not match!', category='error')
        elif len(password1) < 8:
            flash('Password must be at least 7 characters.', category='error')
        elif len(password1) > 30:
            flash('Password must be less than 30 characters.', category='error')
        else:
            new_user = User(email=email, username=username, model="male", coins=50, password=generate_password_hash(password1, method="sha256"))  
            db.session.add(new_user)                                                    # If the series of conditionals is passed, a new row is added to the User table, and the user is logged in and redirected to the homepage.
            db.session.commit()                                                     
            login_user(new_user, remember=False)
            return redirect(url_for("views.home"))                                 

    return render_template("sign-up.html", user=current_user)

@auth.route('/logout')                                                                  # Defining the route used to allow a user to log themselves out.
@login_required
def logout():
    logout_user()
    flash('Logged out successfully!', category='success')
    return redirect(url_for('views.home'))

@auth.route('/account-settings', methods=["GET", "POST"])                               # Defining the 'account-settings' route used to allow a user to change their account info.
@login_required                                                                         # Each input on the account settings page is within a unique form, here in the backend, I am 
def account():                                                                          # checking to see which form has been submitted in order to change specific User-table attributes.
    if request.method == 'POST':
        if 'male-farmer' in request.form:
            queryUser = User.query.filter_by(id=current_user.id).first()
            queryUser.model = "male"
            db.session.commit()
            flash('Character model updated successfully!', category='success')
            return render_template("account-settings.html", user=current_user)

        if 'female-farmer' in request.form:
            queryUser = User.query.filter_by(id=current_user.id).first()
            queryUser.model = "female"
            db.session.commit()
            flash('Character model updated successfully!', category='success')
            return render_template("account-settings.html", user=current_user)

        if 'update-email' in request.form:
            newEmail = request.form.get('email')
            user = User.query.filter_by(email=newEmail).first()                                                                                                                       
            if(newEmail == current_user.email):                                                    
                flash('The email provided matches your current email.', category='error')
            if user:
                flash('An account with this email already exists!', category='error')
            elif len(newEmail) < 9: 
                flash('Email must be longer than 8 characters.', category='error')
            elif len(newEmail) > 49:
                flash('Email must be less than 50 characters.', category='error')
            else:
                user = User.query.filter_by(id=current_user.id).first()
                user.email = newEmail
                db.session.commit()   
                flash('Email updated successfully!', category='success')
                return render_template("account-settings.html", user=current_user)

        if 'update-username' in request.form:
            newUsername = request.form.get('username')
            if len(newUsername) < 4:                                                                    
                flash('Username must be longer than 3 characters', category='error')                    
            elif len(newUsername) > 15:                                                                
                flash('Username must be less than 15 characters long.', category='error')
            else:
                user = User.query.filter_by(id=current_user.id).first()
                user.username = newUsername
                db.session.commit()
                flash('Username updated successfully!', category='success')
                return render_template("account-settings.html", user=current_user)
            
        if 'update-password' in request.form:
            newPassword1 = request.form.get('new-password1')                                            
            newPassword2 = request.form.get('new-password2')                                           
            currentPassword = request.form.get('current-password')                                                                                                                           
            if newPassword1 != newPassword2:                                               
                flash('Passwords do not match!', category='error')
            elif newPassword1 == currentPassword:
                flash('New password matches current password!', category='error')
            elif len(newPassword1) < 8:
                flash('Password must be at least 7 characters.', category='error')
            elif len(newPassword1) > 49:
                flash('Password must be less than 50 characters.', category='error')
            elif not check_password_hash(current_user.password, currentPassword):
                flash("'Current' password entered does not match current password!", category='error')
            else:
                user = User.query.filter_by(id=current_user.id).first()
                user.password = generate_password_hash(newPassword1, method="sha256")
                db.session.commit()
                flash('Password updated successfully!', category='success')
                return render_template("account-settings.html", user=current_user)

        if 'delete-account' in request.form:
            password = request.form.get('current-password')
            if not check_password_hash(current_user.password, password):                        
                flash("Password entered does not match current password!", category='error')    
            else:                                                                               
                user = User.query.filter_by(id=current_user.id).first()
                db.session.delete(user)
                db.session.commit()
                flash('Account deleted successfully!', category='success')
                return redirect(url_for("views.home", user=current_user))

    return render_template("account-settings.html", user=current_user)
