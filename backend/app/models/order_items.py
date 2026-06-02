from app.extensions import db
from app.models.base_model import BaseModel


class OrderItem(BaseModel):

    __tablename__ = "order_items"

    order_id = db.Column(
        db.BigInteger,
        db.ForeignKey("orders.id"),
        nullable=False
    )

    product_id = db.Column(
        db.BigInteger,
        db.ForeignKey("products.id"),
        nullable=False
    )

    quantity = db.Column(
        db.Integer,
        nullable=False
    )

    unit_price = db.Column(
        db.Numeric(12, 2),
        nullable=False
    )

    subtotal = db.Column(
        db.Numeric(12, 2),
        nullable=False
    )