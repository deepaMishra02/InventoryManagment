from flask import Flask
from flask_cors import CORS
from app.extensions import db
from app.routes.products import product_bp
from app.routes.customer import customer_bp
from app.routes.orders import order_bp
from app.middleware.api_auth import authenticate_request
import os

app = Flask(__name__)
CORS(app)
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
    )
# ✅ DATABASE CONFIG (required)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:postgres@postgres:5432/inventory_db"
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
    db.create_all()   # ✅ creates products table automatically


@app.route("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000,debug=True)