from flask import request
from database.db import db
from models.contact_model import Contact
from utils.responses import success_response, error_response
from utils.validators import require_fields, is_valid_email

def get_all_messages():
    messages = Contact.query.order_by(Contact.created_at.desc()).all()
    return success_response([m.to_dict() for m in messages])

def submit_contact():
    data = request.get_json()
    missing = require_fields(data, ['name', 'email', 'message'])
    
    if missing:
        return error_response(f"Missing required fields: {', '.join(missing)}")
        
    if not is_valid_email(data['email']):
        return error_response("Invalid email format")
        
    new_message = Contact(
        name=data.get('name'),
        email=data.get('email'),
        subject=data.get('subject'),
        message=data.get('message')
    )
    
    db.session.add(new_message)
    db.session.commit()
    
    return success_response(None, "Message sent successfully", 201)

def mark_as_read(message_id):
    message = Contact.query.get_or_404(message_id)
    message.is_read = True
    db.session.commit()
    return success_response(message.to_dict(), "Message marked as read")

def delete_message(message_id):
    message = Contact.query.get_or_404(message_id)
    db.session.delete(message)
    db.session.commit()
    return success_response(None, "Message deleted successfully")
