from flask import request
from database.db import db
from models.newsletter_model import Newsletter
from utils.responses import success_response, error_response
from utils.validators import require_fields, is_valid_email

def get_subscribers():
    subscribers = Newsletter.query.order_by(Newsletter.subscribed_at.desc()).all()
    return success_response([s.to_dict() for s in subscribers])

def subscribe():
    data = request.get_json()
    missing = require_fields(data, ['email'])
    
    if missing:
        return error_response(f"Missing required fields: {', '.join(missing)}")
        
    email = data['email'].strip().lower()
    
    if not is_valid_email(email):
        return error_response("Invalid email format")
        
    existing = Newsletter.query.filter_by(email=email).first()
    if existing:
        return error_response("Email already subscribed", 400)
        
    new_subscriber = Newsletter(email=email)
    
    db.session.add(new_subscriber)
    db.session.commit()
    
    return success_response(None, "Successfully subscribed to newsletter", 201)

def delete_subscriber(subscriber_id):
    subscriber = Newsletter.query.get_or_404(subscriber_id)
    db.session.delete(subscriber)
    db.session.commit()
    return success_response(None, "Subscriber deleted successfully")
