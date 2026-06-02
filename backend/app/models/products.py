from app.extensions import db
from app.models.base_model import BaseModel

class Products(BaseModel):

    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)

    sku = db.Column(
        db.String(50),
        unique=True
    )

    name = db.Column(
        db.String(255),
        nullable=False
    )

    unit_price = db.Column(
        db.Numeric(10,2)
    )
    quantity = db.Column(
        db.Integer,
        nullable=False
    )