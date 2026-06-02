from logging import exception

from flask import Blueprint
from flask import request

from app.extensions import db
from app.models.products import Products

product_bp = Blueprint(
    "products",
    __name__
)

@product_bp.route("/products", methods=["POST"])
def create_product():
    try:
        data = request.get_json()
        sku = Products.query.order_by(Products.id.desc()).first()
        if sku:
            skuCode = sku.sku.split("-")[1] if sku.sku else None
        else:
            skuCode = 0
        product = Products(
            sku="IN-" +str(int(skuCode)+1),
            name=data["name"],
            unit_price=data["unit_price"],
            quantity=data["quantity"])

        db.session.add(product)
        db.session.commit()

        return {
            "success": True,
            "message": "Product created"
        }, 200
    except Exception as e:
        return {
            "success": False,
            "message": "Fail to create product.",
            "error": str(e)
        }, 400


@product_bp.route("/products", methods=["GET"])
def get_products():
    try:
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))
        products = Products.query.filter(Products.is_active == True).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        ).items

        response = []
        for product in products:

            response.append({
                "id": product.id,
                "sku": product.sku,
                "name": product.name,
                "unit_price": float(
                    product.unit_price
                ),
                "quantity": product.quantity,
                "is_active": product.is_active
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


@product_bp.route("/products/<int:id>", methods=["GET"])
def get_product(id):
    try:
        product = Products.query.get(id)
        if not product or not product.is_active:
            return {
                "success": False,
                "message": "Product not found"
            }, 400
        return {
            "id": product.id,
            "sku": product.sku,
            "name": product.name,
            "unit_price": float(
                product.unit_price
            ),
            "quantity": product.quantity
        }, 200
    except ValueError:
        return {
            "success": False,
            "message": "Invalid product ID"
        }, 400

@product_bp.route("/products/<int:id>", methods=["PUT"])
def update_product(id):
    try:
        product = Products.query.get(id)
        if not product:
            return {
                "success": False,
                "message": "Product not found"
            }, 400
        data = request.get_json()
        product.name = data.get("name", product.name)
        product.unit_price = data.get("unit_price", product.unit_price)
        product.quantity = data.get("quantity", product.quantity)
        db.session.commit()

        return {
            "success": True,
            "message": "Updated"
        }, 200
    except ValueError:
        return {
            "success": False,
            "message": "Invalid product ID"
        }, 400

@product_bp.route("/products/<int:id>", methods=["DELETE"])
def delete_product(id):
    try:
        product = Products.query.get(id)

        if not product:
            return {
                "success": False,
                "message": "Product not found"
            }, 400
        product.is_active = False
        db.session.commit()

        return {
            "success": True,
            "message": "Deleted"
        }, 200
    except ValueError:
        return {
            "success": False,
            "message": "Invalid product ID"
        }, 400