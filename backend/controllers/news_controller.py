import re
from flask import request
from database.db import db
from models.news_model import News
from utils.responses import success_response, error_response
from utils.validators import require_fields
from datetime import datetime

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

def get_all_news():
    news_list = News.query.filter_by(is_deleted=0).order_by(News.created_at.desc()).all()
    return success_response([n.to_dict() for n in news_list])

def get_news_by_id(news_id):
    news = News.query.filter_by(id=news_id, is_deleted=0).first_or_404()
    return success_response(news.to_dict())

def create_news():
    data = request.get_json(silent=True) or {}
    missing = require_fields(data, ['title', 'content'])
    
    if missing:
        return error_response(f"Missing required fields: {', '.join(missing)}", 400)
        
    title = data['title'].strip()
    content = data['content']
    slug = data.get('slug', '').strip() or slugify(title)
    
    # Check duplicate slug
    existing = News.query.filter_by(slug=slug, is_deleted=0).first()
    if existing:
        # Append timestamp to make unique
        slug = f"{slug}-{int(datetime.utcnow().timestamp())}"
        
    new_article = News(
        title=title,
        content=content,
        slug=slug,
        excerpt=data.get('excerpt', ''),
        image=data.get('image', ''),
        category=data.get('category', 'General'),
        tags=data.get('tags', ''),
        status=data.get('status', 'Draft'),
        is_featured=data.get('is_featured', 0),
        published_at=datetime.utcnow() if data.get('status') == 'Published' else None
    )
    
    db.session.add(new_article)
    db.session.commit()
    
    return success_response(new_article.to_dict(), "Article created successfully", 201)

def update_news(news_id):
    news = News.query.filter_by(id=news_id, is_deleted=0).first()
    if not news:
        return error_response("Article not found", 404)
        
    data = request.get_json(silent=True) or {}
    
    if 'title' in data:
        news.title = data['title'].strip()
    if 'content' in data:
        news.content = data['content']
    if 'slug' in data and data['slug'].strip():
        news.slug = data['slug'].strip()
    if 'excerpt' in data:
        news.excerpt = data['excerpt']
    if 'image' in data:
        news.image = data['image']
    if 'category' in data:
        news.category = data['category']
    if 'tags' in data:
        news.tags = data['tags']
    if 'status' in data:
        old_status = news.status
        news.status = data['status']
        if data['status'] == 'Published' and old_status != 'Published':
            news.published_at = datetime.utcnow()
    if 'is_featured' in data:
        news.is_featured = data['is_featured']
        
    db.session.commit()
    return success_response(news.to_dict(), "Article updated successfully")

def delete_news(news_id):
    news = News.query.filter_by(id=news_id, is_deleted=0).first()
    if not news:
        return error_response("Article not found", 404)
        
    news.is_deleted = 1
    db.session.commit()
    return success_response(None, "Article deleted successfully")
