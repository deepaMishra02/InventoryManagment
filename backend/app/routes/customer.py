from flask import Blueprint
from flask import request

from app.extensions import db
from app.models.customer import Customer

customer_bp = Blueprint(
    "customers",
    __name__
)

@customer_bp.route("/customers", methods=["POST"])
def create_customer():
    try:
        data = request.get_json()
        same_email = Customer.query.filter_by(email=data["email"]).first()
        if same_email:
            return {
                "success": False,
                "message": "Email already exists"
            }, 400
        customer = Customer(
            name=data["name"],
            email=data["email"],
            phone=data["phone"],
            address=data["address"]
        )
        db.session.add(customer)
        db.session.commit()
        return {
            "success": True,
            "message": "Customer created"
        }, 200
    except KeyError:
        return {
            "success": False,
            "message": "Failed to create customer."
        }, 400


@customer_bp.route("/customers", methods=["GET"])
def get_customers():
    try:
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))
        customers = Customer.query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        ).items

        response = []
        for customer in customers:

            response.append({
                "id": customer.id,
                "name": customer.name,
                "email": customer.email,
                "phone": customer.phone,
                "address": customer.address
            })

        return {
            "success": True,
            "data": response
        }, 200
    except ValueError:
        return {
            "success": False,
            "message": "Invalid pagination parameters"
        }, 400


@customer_bp.route("/customers/<int:id>", methods=["GET"])
def get_customer(id):
    try:
        customer = Customer.query.get(id)
        if not customer:
            return {
                "success": False,
                "message": "Customer not found"
            }, 400
        return {
            "id": customer.id,
            "name": customer.name,
            "email": customer.email,
            "phone": customer.phone,
            "address": customer.address
        }, 200
    except ValueError:
        return {
            "success": False,
            "message": "Invalid customer ID"
        }, 400

@customer_bp.route("/customers/<int:id>", methods=["PUT"])
def update_customer(id):
    try:
        customer = Customer.query.get(id)
        if not customer:
            return {
                "success": False,
                "message": "Customer not found"
            }, 400
        data = request.get_json()
        customer.name = data.get("name", customer.name)
        customer.email = data.get("email", customer.email)
        customer.phone = data.get("phone", customer.phone)
        customer.address = data.get("address", customer.address)
        db.session.commit()

        return {
            "success": True,
            "message": "Updated"
        }, 200
    except ValueError:
        return {
            "success": False,
            "message": "Invalid customer ID"
        }, 400

@customer_bp.route("/customers/<int:id>", methods=["DELETE"])
def delete_customer(id):
    try:
        customer = Customer.query.get(id)

        if not customer:
            return {
                "success": False,
                "message": "Customer not found"
            }, 400

        db.session.delete(customer)
        db.session.commit()

        return {
            "success": True,
            "message": "Deleted"
        }, 200
    except ValueError:
        return {
            "success": False,
            "message": "Invalid customer ID"
        }, 400