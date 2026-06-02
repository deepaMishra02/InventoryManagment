from app.extensions import db
from app.models.base_model import BaseModel


class Order(BaseModel):

    __tablename__ = "orders"

    customer_id = db.Column(
        db.BigInteger,
        db.ForeignKey("customers.id"),
        nullable=False
    )

    total_amount = db.Column(
        db.Numeric(12, 2),
        nullable=False,
        default=0
    )

    status = db.Column(
        db.String(50),
        nullable=False,
        default="PENDING"
    )

    def __repr__(self):
        return f"<Order {self.id}>"