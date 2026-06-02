from flask import Blueprint
from flask import request

from app.extensions import db
from app.models.orders import Order
from app.models.order_items import OrderItem
from app.models.products import Products
from app.models.customer import Customer
from datetime import datetime, timedelta

order_bp = Blueprint(
    "orders",
    __name__
)

@order_bp.route("/orders", methods=["POST"])
def create_order():
    try:
        data = request.get_json()

        customer_id = data["customer_id"]
        items = data["items"]

        order = Order(
            customer_id=customer_id,
            total_amount=0
        )

        db.session.add(order)
        db.session.flush()

        total_amount = 0

        for item in items:

            product = Products.query.get(item["product_id"])

            if not product:
                return {
                    "success": False,
                    "message": f"Product {item['product_id']} not found"
                }, 404

            quantity = item["quantity"]

            # ❌ CHECK STOCK FIRST (IMPORTANT)
            if product.quantity < quantity:
                return {
                    "success": False,
                    "message": f"Insufficient stock for product {product.id}. Available: {product.quantity}"
                }, 400

            unit_price = product.unit_price
            subtotal = unit_price * quantity

            # ✔ CREATE ORDER ITEM
            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=quantity,
                unit_price=unit_price,
                subtotal=subtotal
            )

            db.session.add(order_item)

            # ✔ REDUCE STOCK
            product.quantity -= quantity

            total_amount += subtotal

        # ✔ UPDATE ORDER TOTAL
        order.total_amount = total_amount

        db.session.commit()

        return {
            "success": True,
            "message": "Order created successfully",
            "order_id": order.id,
            "total_amount": float(total_amount)
        }, 201

    except KeyError as e:
        return {
            "success": False,
            "message": f"Missing field: {str(e)}"
        }, 400

    except Exception as e:
        db.session.rollback()
        return {
            "success": False,
            "message": str(e)
        }, 500

@order_bp.route("/orders/<int:id>", methods=["PUT"])
def update_order(id):
    try:
        order = Order.query.get(id)

        if not order:
            return {
                "success": False,
                "message": "Order not found"
            }, 404

        data = request.get_json()
        new_status = data.get("status", order.status)

        # ✔ IF ORDER IS BEING CANCELLED
        if new_status == "CANCELLED" and order.status != "CANCELLED":

            order_items = OrderItem.query.filter_by(order_id=order.id).all()

            for item in order_items:
                product = Products.query.get(item.product_id)

                if product:
                    # ✔ RESTORE STOCK
                    product.quantity += item.quantity

        # ✔ UPDATE STATUS
        order.status = new_status

        db.session.commit()

        return {
            "success": True,
            "message": f"Order updated to {new_status}"
        }, 200

    except ValueError:
        return {
            "success": False,
            "message": "Invalid order ID"
        }, 400

    except Exception as e:
        db.session.rollback()
        return {
            "success": False,
            "message": str(e)
        }, 500
    
@order_bp.route("/orders", methods=["GET"])
def get_orders():
    try:
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))

        pagination = Order.query.filter(
            Order.is_active == True
        ).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        response = []

        for order in pagination.items:
            customer = Customer.query.get(order.customer_id)
            order_items = OrderItem.query.filter_by(
                order_id=order.id
            ).all()

            items = []

            for item in order_items:
                product = Products.query.get(item.product_id)

                items.append({
                    "id": item.id,
                    "product_id": item.product_id,
                    "product_name": product.name if product else None,
                    "quantity": item.quantity,
                    "unit_price": float(item.unit_price),
                    "subtotal": float(item.quantity * item.unit_price)
                })

            response.append({
                "id": order.id,
                "customer_name": customer.name if customer else None,
                "total_amount": float(order.total_amount),
                "status": order.status,
                "is_active": order.is_active,
                "items": items
            })

        return {
            "success": True,
            "data": response,
            "pagination": {
                "page": pagination.page,
                "pages": pagination.pages,
                "total": pagination.total
            }
        }, 200

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500
    
@order_bp.route("/orders/<int:id>", methods=["GET"])
def get_order(id):
    try:
        order = Order.query.get(id)

        if not order:
            return {
                "success": False,
                "message": "Order not found"
            }, 404

        items = OrderItem.query.filter_by(order_id=order.id).all()

        return {
            "id": order.id,
            "customer_id": order.customer_id,
            "total_amount": float(order.total_amount),
            "status": order.status,

            "items": [
                {
                    "product_id": item.product_id,
                    "quantity": item.quantity,
                    "unit_price": float(item.unit_price),
                    "subtotal": float(item.subtotal)
                }
                for item in items
            ]
        }, 200

    except ValueError:
        return {
            "success": False,
            "message": "Invalid order ID"
        }, 400

@order_bp.route("/dashboard/summary", methods=["GET"])
def dashboard_summary():
    try:

        # 📊 TOTAL COUNTS
        total_products = Products.query.filter(Products.is_active == True).count()
        total_customers = Customer.query.filter(Customer.is_active == True).count()
        total_orders = Order.query.filter(Order.is_active == True).count()
    
        # ⚠️ LOW STOCK
        low_stock_threshold = 5

        low_stock_products = Products.query.filter(
            Products.quantity <= low_stock_threshold,
            Products.is_active == True
        ).all()

        # 📅 LAST 7 DAYS ORDERS
        seven_days_ago = datetime.utcnow() - timedelta(days=7)

        last_7_days_orders = Order.query.filter(
            Order.created_at >= seven_days_ago
        ).all()

        from collections import defaultdict
        order_by_date = defaultdict(int)

        for order in last_7_days_orders:
            date = order.created_at.date().isoformat()
            order_by_date[date] += 1

        return {
            "success": True,
            "data": {
                "total_products": total_products,
                "total_customers": total_customers,
                "total_orders": total_orders,

                "low_stock_products": [
                    {
                        "id": p.id,
                        "sku": p.sku,
                        "name": p.name,
                        "quantity": p.quantity,
                        "price": float(p.unit_price)
                    }
                    for p in low_stock_products
                ],
                "low_stock_count": len(low_stock_products),

                # 📅 NEW ADDED
                "last_7_days_orders": {
                    "labels": list(order_by_date.keys()),
                    "values": list(order_by_date.values())
                },
                "last_7_days_count": len(last_7_days_orders)
            }
        }, 200

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500