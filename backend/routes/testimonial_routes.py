from flask import Blueprint
from controllers.testimonial_controller import (
    get_all_testimonials, create_testimonial,
    update_testimonial, delete_testimonial
)
from middleware.auth_middleware import admin_required

testimonial_bp = Blueprint('testimonials', __name__)

# Public routes
testimonial_bp.route('/', methods=['GET'])(get_all_testimonials)

# Admin protected routes
testimonial_bp.route('/', methods=['POST'])(admin_required()(create_testimonial))
testimonial_bp.route('/<int:testimonial_id>', methods=['PUT'])(admin_required()(update_testimonial))
testimonial_bp.route('/<int:testimonial_id>', methods=['DELETE'])(admin_required()(delete_testimonial))
