from flask import request
import os

def authenticate_request():

    if request.method == "OPTIONS":
        return "", 200

    api_key = request.headers.get(
        "X-API-KEY"
    )

    if not api_key:
        return {
            "success": False,
            "message": "API Key required"
        }, 401

    if api_key != os.getenv("API_KEY"):
        return {
            "success": False,
            "message": "Invalid API Key"
        }, 401