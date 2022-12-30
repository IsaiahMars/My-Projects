from client import createApp, socketio

app = createApp()

if __name__ == '__main__':
    socketio.run(app, allow_unsafe_werkzeug=True, port="1738")


# main.py is used to run the "createApp()" function defined in __init__.py,
# since websockets from SocketIO are used in this app, it is imported at the top
# and used to run the webserver as per documentation standards:
# https://flask-socketio.readthedocs.io/en/latest/getting_started.html