import json
import re
from flask import request
from database.db import db
from models.project_model import Project
from utils.responses import success_response, error_response
from utils.validators import require_fields
from datetime import datetime

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

def get_all_projects():
    projects = Project.query.filter_by(is_deleted=0).order_by(Project.created_at.desc()).all()
    return success_response([p.to_dict() for p in projects])

def get_project(project_id):
    project = Project.query.filter_by(id=project_id, is_deleted=0).first_or_404()
    return success_response(project.to_dict())

def create_project():
    data = request.get_json(silent=True) or {}
    missing = require_fields(data, ['name'])
    
    if missing:
        return error_response(f"Missing required fields: {', '.join(missing)}", 400)
        
    name = data['name'].strip()
    slug = slugify(name)
    
    # Ensure slug unique
    existing = Project.query.filter_by(slug=slug, is_deleted=0).first()
    if existing:
        slug = f"{slug}-{int(datetime.utcnow().timestamp())}"
        
    extra = {
        'deadline': data.get('deadline', ''),
        'progress': data.get('progress', 0),
        'icon': data.get('icon', 'fas fa-code'),
        'description': data.get('description', '')
    }
    
    new_project = Project(
        title=name,
        slug=slug,
        description=json.dumps(extra),
        image=data.get('image', ''),
        demo_link=data.get('url', ''),
        client=data.get('client', ''),
        category=data.get('category', 'Web Development'),
        status=data.get('status', 'Development')
    )
    
    db.session.add(new_project)
    db.session.commit()
    
    return success_response(new_project.to_dict(), "Project created successfully", 201)

def update_project(project_id):
    project = Project.query.filter_by(id=project_id, is_deleted=0).first()
    if not project:
        return error_response("Project not found", 404)
        
    data = request.get_json(silent=True) or {}
    
    # Load existing extra fields from description
    extra = {}
    if project.description:
        try:
            extra = json.loads(project.description)
        except:
            extra = {'description': project.description}
            
    if 'name' in data:
        project.title = data['name'].strip()
        
    if 'client' in data:
        project.client = data['client']
        
    if 'status' in data:
        project.status = data['status']
        
    if 'category' in data:
        project.category = data['category']
        
    if 'image' in data:
        project.image = data['image']
        
    if 'url' in data:
        project.demo_link = data['url']
        
    # Update extra fields
    if 'deadline' in data:
        extra['deadline'] = data['deadline']
    if 'progress' in data:
        extra['progress'] = data['progress']
    if 'icon' in data:
        extra['icon'] = data['icon']
    if 'description' in data:
        extra['description'] = data['description']
        
    project.description = json.dumps(extra)
    
    db.session.commit()
    return success_response(project.to_dict(), "Project updated successfully")

def delete_project(project_id):
    project = Project.query.filter_by(id=project_id, is_deleted=0).first()
    if not project:
        return error_response("Project not found", 404)
        
    project.is_deleted = 1
    db.session.commit()
    return success_response(None, "Project deleted successfully")
