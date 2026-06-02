import os

class Config:

    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "secret"
    )
    API_KEY = os.getenv("API_KEY")
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://"
        f"{os.getenv('DB_USER')}:"
        f"{os.getenv('DB_PASSWORD')}@"
        f"{os.getenv('DB_HOST')}:"
        f"{os.getenv('DB_PORT')}/"
        f"{os.getenv('DB_NAME')}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_size": 20,
        "max_overflow": 30,
        "pool_pre_ping": True,
        "pool_recycle": 3600
    }