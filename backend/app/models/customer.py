from app.extensions import db
from app.models.base_model import BaseModel


class Customer(BaseModel):

    __tablename__ = "customers"

    name = db.Column(
        db.String(255),
        nullable=False
    )

    email = db.Column(
        db.String(255),
        nullable=False,
        unique=True
    )

    phone = db.Column(
        db.String(20)
    )

    address = db.Column(
        db.Text
    )

    def __repr__(self):
        return f"<Customer {self.name}>"