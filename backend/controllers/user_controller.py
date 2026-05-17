from flask import request
from database.db import db
from models.user_model import User, Role
from utils.responses import success_response, error_response
from utils.validators import require_fields
from utils.security import hash_password

ROLE_MAPPING = {
    'superadmin': 1,
    'super admin': 1,
    'admin': 2,
    'editor': 3,
    'employee': 4,
    'viewer': 5
}

def get_all_users():
    users = User.query.filter_by(is_deleted=0).all()
    return success_response([u.to_dict() for u in users])

def create_user():
    data = request.get_json(silent=True) or {}
    missing = require_fields(data, ['name', 'email', 'password'])
    
    if missing:
        return error_response(f"Missing required fields: {', '.join(missing)}", 400)
        
    email = data['email'].strip().lower()
    name = data['name'].strip()
    password = data['password']
    
    # Map role name to role_id
    role_name = str(data.get('role', 'Admin')).strip().lower()
    role_id = ROLE_MAPPING.get(role_name, 2) # Default to 2 (Admin)
    
    hashed = hash_password(password)
    
    # Check duplicate email globally (because email is UNIQUE in DB)
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        if existing_user.is_deleted:
            # Reactivate soft-deleted user
            existing_user.is_deleted = 0
            existing_user.name = name
            existing_user.password_hash = hashed
            existing_user.role_id = role_id
            existing_user.status = data.get('status', 'Active')
            db.session.commit()
            return success_response(existing_user.to_dict(), "User reactivated successfully", 200)
        else:
            return error_response("A user with this email already exists.", 409)
    
    new_user = User(
        name=name,
        email=email,
        password_hash=hashed,
        role_id=role_id,
        status=data.get('status', 'Active')
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return success_response(new_user.to_dict(), "User created successfully", 201)

def update_user(user_id):
    user = User.query.filter_by(id=user_id, is_deleted=0).first()
    if not user:
        return error_response("User not found", 404)
        
    data = request.get_json(silent=True) or {}
    
    if 'name' in data:
        user.name = data['name'].strip()
        
    if 'email' in data:
        email = data['email'].strip().lower()
        if email != user.email:
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                return error_response("A user with this email already exists.", 409)
            user.email = email
            
    if 'password' in data and data['password']:
        user.password_hash = hash_password(data['password'])
        
    if 'role' in data:
        role_name = str(data['role']).strip().lower()
        user.role_id = ROLE_MAPPING.get(role_name, 2)
        
    if 'status' in data:
        user.status = data['status']
        
    db.session.commit()
    return success_response(user.to_dict(), "User updated successfully")

def delete_user(user_id):
    user = User.query.filter_by(id=user_id, is_deleted=0).first()
    if not user:
        return error_response("User not found", 404)
        
    # Soft delete
    user.is_deleted = 1
    db.session.commit()
    
    return success_response(None, "User deleted successfully")
