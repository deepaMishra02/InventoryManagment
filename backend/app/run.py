import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from flask import Flask
from flask_cors import CORS
from app.extensions import db
from app.routes.products import product_bp
from app.routes.customer import customer_bp
from app.routes.orders import order_bp
from app.middleware.api_auth import authenticate_request
import os
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

app = Flask(__name__)
CORS(app)

sslmode = os.getenv("DB_SSLMODE", "require")
connect_timeout = os.getenv("DB_CONNECT_TIMEOUT", "10")

app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"postgresql://{os.getenv('DB_USER')}:"
    f"{os.getenv('DB_PASSWORD')}@"
    f"{os.getenv('DB_HOST')}:"
    f"{os.getenv('DB_PORT')}/"
    f"{os.getenv('DB_NAME')}?sslmode={sslmode}&connect_timeout={connect_timeout}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# ✅ THIS IS THE FIX
db.init_app(app)
app.before_request(
        authenticate_request
    )
app.register_blueprint(product_bp)
app.register_blueprint(customer_bp)
app.register_blueprint(order_bp)
with app.app_context():
    print("Connecting to database and creating missing tables...")
    db.create_all()   # ✅ creates products table automatically
    print("Database ready")


@app.route("/health")
def health():
    return {"message": "Hello World", "status": "ok"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000,debug=True)
