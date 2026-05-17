from flask import Blueprint, request
from database.db import db
from models.visit_model import Visit
from utils.responses import success_response, error_response
from datetime import datetime, timedelta

stats_bp = Blueprint('stats', __name__)
stats_bp.strict_slashes = False

@stats_bp.route('/track-visit', methods=['POST'])
def track_visit():
    try:
        # Get real client IP address (checking proxies)
        ip = request.headers.get('X-Forwarded-For', request.remote_addr)
        if ip and ',' in ip:
            ip = ip.split(',')[0].strip()
            
        user_agent = request.headers.get('User-Agent', '')
        
        # Throttling: Avoid counting the same IP within the last 5 minutes
        five_minutes_ago = datetime.utcnow() - timedelta(minutes=5)
        existing = Visit.query.filter(
            Visit.ip_address == ip,
            Visit.created_at >= five_minutes_ago
        ).first()
        
        if not existing:
            new_visit = Visit(ip_address=ip, user_agent=user_agent)
            db.session.add(new_visit)
            db.session.commit()
            
        total_visitors = Visit.query.count() + 1240 # Baseline starting offset
        return success_response({"visitorCount": total_visitors}, "Visit tracked successfully")
    except Exception as e:
        return error_response(f"Error tracking visit: {str(e)}", 500)

@stats_bp.route('/visitor-count', methods=['GET'])
def get_visitor_count():
    try:
        total_visitors = Visit.query.count() + 1240
        return success_response({"visitorCount": total_visitors}, "Visitor count retrieved successfully")
    except Exception as e:
        return error_response(f"Error getting visitor count: {str(e)}", 500)
