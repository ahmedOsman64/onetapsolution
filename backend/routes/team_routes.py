from flask import Blueprint
from controllers.team_controller import (
    get_all_team, create_team_member,
    update_team_member, delete_team_member
)
from middleware.auth_middleware import admin_required

team_bp = Blueprint('team', __name__)

# Public routes
team_bp.route('/', methods=['GET'])(get_all_team)

# Admin protected routes
team_bp.route('/', methods=['POST'])(admin_required()(create_team_member))
team_bp.route('/<int:member_id>', methods=['PUT'])(admin_required()(update_team_member))
team_bp.route('/<int:member_id>', methods=['DELETE'])(admin_required()(delete_team_member))
