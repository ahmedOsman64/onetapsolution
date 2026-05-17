from flask import Blueprint
from controllers.news_controller import (
    get_all_news, get_news_by_id,
    create_news, update_news, delete_news
)
from middleware.auth_middleware import admin_required

news_bp = Blueprint('news', __name__)
news_bp.strict_slashes = False

# Public routes
news_bp.route('/', methods=['GET'])(get_all_news)
news_bp.route('/<int:news_id>', methods=['GET'])(get_news_by_id)

# Admin protected routes
news_bp.route('/', methods=['POST'])(admin_required()(create_news))
news_bp.route('/<int:news_id>', methods=['PUT'])(admin_required()(update_news))
news_bp.route('/<int:news_id>', methods=['DELETE'])(admin_required()(delete_news))
