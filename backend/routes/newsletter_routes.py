from flask import Blueprint
from controllers.newsletter_controller import (
    get_subscribers, subscribe, delete_subscriber
)
from middleware.auth_middleware import admin_required

newsletter_bp = Blueprint('newsletter', __name__)

# Public routes
newsletter_bp.route('/', methods=['POST'])(subscribe)

# Admin protected routes
newsletter_bp.route('/', methods=['GET'])(admin_required()(get_subscribers))
newsletter_bp.route('/<int:subscriber_id>', methods=['DELETE'])(admin_required()(delete_subscriber))
