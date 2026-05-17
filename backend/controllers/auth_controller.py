from flask import request
from flask_jwt_extended import create_access_token, get_jwt_identity
from datetime import datetime, timezone

from database.db import db
from models.user_model import User
from utils.security import check_password
from utils.responses import success_response, error_response
from utils.validators import require_fields


def login():
    data = request.get_json(silent=True) or {}

    missing = require_fields(data, ['email', 'password'])
    if missing:
        return error_response(f"Missing fields: {', '.join(missing)}", 400)

    email    = data['email'].strip().lower()
    password = data['password'].strip()
    ip       = request.remote_addr

    # Find active, non-deleted user
    user = User.query.filter_by(email=email, is_deleted=0, status='Active').first()

    if not user or not check_password(password, user.password_hash):
        return error_response("Invalid email or password", 401)

    # Only superadmin / admin can log into the admin panel
    if user.role_slug not in ('superadmin', 'admin'):
        return error_response("Admin access required", 403)

    # Update last login info
    user.last_login_at = datetime.now(timezone.utc)
    user.last_login_ip = ip
    db.session.commit()

    # Create JWT token
    access_token = create_access_token(identity=str(user.id))

    return success_response({
        'token': access_token,
        'user':  user.to_dict()
    }, "Login successful")


def get_current_user():
    user_id = get_jwt_identity()
    user    = User.query.get(user_id)

    if not user or user.is_deleted:
        return error_response("User not found", 404)

    return success_response({'user': user.to_dict()})
