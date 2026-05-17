from flask import Blueprint
from controllers.project_controller import (
    get_all_projects, get_project, create_project,
    update_project, delete_project
)
from middleware.auth_middleware import admin_required

project_bp = Blueprint('projects', __name__)

# Public routes
project_bp.route('/', methods=['GET'])(get_all_projects)
project_bp.route('/<int:project_id>', methods=['GET'])(get_project)

# Admin protected routes
project_bp.route('/', methods=['POST'])(admin_required()(create_project))
project_bp.route('/<int:project_id>', methods=['PUT'])(admin_required()(update_project))
project_bp.route('/<int:project_id>', methods=['DELETE'])(admin_required()(delete_project))
