import re
from datetime import datetime
from flask import request
from database.db import db
from models.service_model import Service
from utils.responses import success_response, error_response
from utils.validators import require_fields

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

def get_all_services():
    services = Service.query.all()
    return success_response([s.to_dict() for s in services])

def create_service():
    data = request.get_json(silent=True) or {}
    
    # Support both database keys (title, description) and frontend keys (name, desc)
    title = data.get('name') or data.get('title')
    description = data.get('desc') or data.get('description')
    
    if not title or not description:
        return error_response("Missing required fields: name (title) and desc (description) are required.", 400)
        
    name = title.strip()
    slug = slugify(name)
    
    # Ensure slug unique
    existing = Service.query.filter_by(slug=slug).first()
    if existing:
        slug = f"{slug}-{int(datetime.utcnow().timestamp())}"
        
    new_service = Service(
        title=name,
        slug=slug,
        description=description.strip(),
        icon=data.get('icon', 'fas fa-laptop-code'),
        status=data.get('status', 'Active')
    )
    
    db.session.add(new_service)
    db.session.commit()
    
    return success_response(new_service.to_dict(), "Service created successfully", 201)

def update_service(service_id):
    service = Service.query.get_or_404(service_id)
    data = request.get_json(silent=True) or {}
    
    title = data.get('name') or data.get('title')
    description = data.get('desc') or data.get('description')
    
    if title: service.title = title.strip()
    if description: service.description = description.strip()
    if 'icon' in data: service.icon = data['icon']
    if 'status' in data: service.status = data['status']
    
    db.session.commit()
    return success_response(service.to_dict(), "Service updated successfully")

def delete_service(service_id):
    service = Service.query.get_or_404(service_id)
    db.session.delete(service)
    db.session.commit()
    return success_response(None, "Service deleted successfully")
