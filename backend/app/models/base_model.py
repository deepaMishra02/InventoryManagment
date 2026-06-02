from datetime import datetime
from app.extensions import db


class BaseModel(db.Model):

    __abstract__ = True

    id = db.Column(
        db.BigInteger,
        primary_key=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    is_active = db.Column(
        db.Boolean,
        default=True,
        nullable=False
    )