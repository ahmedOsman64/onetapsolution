from flask import Blueprint
from controllers.contact_controller import (
    get_all_messages, submit_contact,
    mark_as_read, delete_message
)
from middleware.auth_middleware import admin_required

contact_bp = Blueprint('contacts', __name__)

# Public routes
contact_bp.route('/', methods=['POST'])(submit_contact)

# Admin protected routes
contact_bp.route('/', methods=['GET'])(admin_required()(get_all_messages))
contact_bp.route('/<int:message_id>/read', methods=['PUT'])(admin_required()(mark_as_read))
contact_bp.route('/<int:message_id>', methods=['DELETE'])(admin_required()(delete_message))
