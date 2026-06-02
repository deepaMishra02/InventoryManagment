Live Links
    Frontend: https://inventory-three-steel.vercel.app/dashboard
    Backend API: https://inventory-d4ni.onrender.com/health
    Docker Hub Backend Image: https://hub.docker.com/r/deepamishra06/flask-backend

Tech Stack
    Backend
        Python 3.x
        Flask / FastAPI
        SQLAlchemy / ORM
        PostgreSQL
    Frontend
        React (JavaScript)
        Axios
        React Router
    DevOps / Infrastructure
        Docker
        Docker Compose
        PostgreSQL (containerized)
        Nginx (optional for production frontend)

API Endpoints
    Products
        POST   /products
        GET    /products
        GET    /products/{id}
        PUT    /products/{id}
        DELETE /products/{id}

    Customers
        POST   /customers
        GET    /customers
        GET    /customers/{id}
        DELETE /customers/{id}
    POST   /orders
        GET    /orders
        GET    /orders/{id}
        DELETE /orders/{id}

Build & Run with Docker Compose
    cmd: docker-compose up --build

Deployment
    Backend
        Render
    Frontend
        Vercel
