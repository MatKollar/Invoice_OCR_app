from app.models import db, User, UserRole, Invoice, Supplier, Buyer


def get_current_user_service(user_id):
    user = User.query.get(user_id)
    return {
        "name": user.name,
        "email": user.email,
        "role": user.role.value
    } if user else None


def edit_role_service(user_id, role):
    user = User.query.get(user_id)
    user.role = UserRole[role]
    db.session.commit()


def update_user_service(user_id, name, email):
    user = User.query.get(user_id)
    user.name = name
    user.email = email
    db.session.commit()


def delete_invoice_service(invoice_id):
    invoice = Invoice.query.get(invoice_id)
    if not invoice:
        return None

    if invoice.supplier_id:
        supplier = Supplier.query.get(invoice.supplier_id)
        if supplier:
            db.session.delete(supplier)

    if invoice.buyer_id:
        buyer = Buyer.query.get(invoice.buyer_id)
        if buyer:
            db.session.delete(buyer)

    performance = invoice.performance
    if performance:
        db.session.delete(performance)

    db.session.delete(invoice)
    db.session.commit()

    return invoice_id


def update_invoice_service(new_data):
    invoice_id = new_data["id"]
    invoice = Invoice.query.get(invoice_id)
    if not invoice:
        return None

    invoice.invoice_number = new_data.get("invoice_number", invoice.invoice_number)
    invoice.var_symbol = new_data.get("var_symbol", invoice.var_symbol)
    invoice.date_of_issue = new_data.get("date_of_issue", invoice.date_of_issue)
    invoice.due_date = new_data.get("due_date", invoice.due_date)
    invoice.delivery_date = new_data.get("delivery_date", invoice.delivery_date)
    invoice.payment_method = new_data.get("payment_method", invoice.payment_method)
    invoice.total_price = new_data.get("total_price", invoice.total_price)
    invoice.bank = new_data.get("bank", invoice.bank)
    invoice.swift = new_data.get("swift", invoice.swift)
    invoice.iban = new_data.get("iban", invoice.iban)

    supplier_data = new_data.get("supplier_data", {})
    if invoice.supplier:
        invoice.supplier.ico = supplier_data.get("ICO", invoice.supplier.ico)
        invoice.supplier.name = supplier_data.get("Name", invoice.supplier.name)
        invoice.supplier.address = supplier_data.get("Street", invoice.supplier.address)
        invoice.supplier.psc = supplier_data.get("PSC", invoice.supplier.psc)
        invoice.supplier.city = supplier_data.get("City", invoice.supplier.city)
        invoice.supplier.dic = supplier_data.get("DIC", invoice.supplier.dic)

    buyer_data = new_data.get("buyer_data", {})
    if invoice.buyer:
        invoice.buyer.ico = buyer_data.get("ICO", invoice.buyer.ico)
        invoice.buyer.name = buyer_data.get("Name", invoice.buyer.name)
        invoice.buyer.psc = buyer_data.get("PSC", invoice.buyer.psc)
        invoice.buyer.address = buyer_data.get("Street", invoice.buyer.address)
        invoice.buyer.city = buyer_data.get("City", invoice.buyer.city)
        invoice.buyer.dic = buyer_data.get("DIC", invoice.buyer.dic)

    db.session.commit()

    return invoice_id
