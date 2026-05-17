from flask import Blueprint
from controllers.service_controller import (
    get_all_services, create_service,
    update_service, delete_service
)
from middleware.auth_middleware import admin_required

service_bp = Blueprint('services', __name__)

# Public routes
service_bp.route('/', methods=['GET'])(get_all_services)

# Admin protected routes
service_bp.route('/', methods=['POST'])(admin_required()(create_service))
service_bp.route('/<int:service_id>', methods=['PUT'])(admin_required()(update_service))
service_bp.route('/<int:service_id>', methods=['DELETE'])(admin_required()(delete_service))
