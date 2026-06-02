from flask import request
import os

def authenticate_request():

    if request.method == "OPTIONS":
        return "", 200

    return None