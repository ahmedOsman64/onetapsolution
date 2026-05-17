from flask import request
from database.db import db
from models.testimonial_model import Testimonial
from utils.responses import success_response, error_response

def get_all_testimonials():
    testimonials = Testimonial.query.all()
    return success_response([t.to_dict() for t in testimonials])

def create_testimonial():
    data = request.get_json(silent=True) or {}
    
    # Support both database and frontend keys
    client_name = data.get('name') or data.get('client_name')
    feedback = data.get('review') or data.get('feedback')
    company = data.get('role') or data.get('company')
    image = data.get('img') or data.get('image')
    rating = data.get('rating', 5)
    
    if not client_name or not feedback:
        return error_response("Missing required fields: client_name (name) and feedback (review) are required.", 400)
        
    new_testimonial = Testimonial(
        client_name=client_name.strip(),
        company=company.strip() if company else None,
        feedback=feedback.strip(),
        image=image,
        rating=int(rating),
        status=data.get('status', 'Published')
    )
    
    db.session.add(new_testimonial)
    db.session.commit()
    
    return success_response(new_testimonial.to_dict(), "Testimonial created successfully", 201)

def update_testimonial(testimonial_id):
    testimonial = Testimonial.query.get_or_404(testimonial_id)
    data = request.get_json(silent=True) or {}
    
    client_name = data.get('name') or data.get('client_name')
    feedback = data.get('review') or data.get('feedback')
    company = data.get('role') or data.get('company')
    image = data.get('img') or data.get('image')
    
    if client_name: testimonial.client_name = client_name.strip()
    if feedback: testimonial.feedback = feedback.strip()
    if company: testimonial.company = company.strip()
    if image is not None: testimonial.image = image
    if 'rating' in data: testimonial.rating = int(data['rating'])
    if 'status' in data: testimonial.status = data['status']
    
    db.session.commit()
    return success_response(testimonial.to_dict(), "Testimonial updated successfully")

def delete_testimonial(testimonial_id):
    testimonial = Testimonial.query.get_or_404(testimonial_id)
    db.session.delete(testimonial)
    db.session.commit()
    return success_response(None, "Testimonial deleted successfully")
