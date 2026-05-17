from flask import Blueprint
from controllers.auth_controller import login, get_current_user
from middleware.auth_middleware import admin_required

auth_bp = Blueprint('auth', __name__)

auth_bp.route('/login', methods=['POST'])(login)
auth_bp.route('/me', methods=['GET'])(admin_required()(get_current_user))
