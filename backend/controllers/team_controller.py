from flask import request
from database.db import db
from models.team_model import Team
from utils.responses import success_response, error_response

def get_all_team():
    team = Team.query.all()
    return success_response([t.to_dict() for t in team])

def create_team_member():
    data = request.get_json(silent=True) or {}
    
    name = data.get('name')
    role = data.get('role') or data.get('position')
    
    if not name or not role:
        return error_response("Missing required fields: name and role are required.", 400)
        
    new_member = Team(
        name=name.strip(),
        position=role.strip(),
        image=data.get('image'),
        bio=data.get('bio'),
        linkedin=data.get('linkedin'),
        github=data.get('github'),
        twitter=data.get('twitter')
    )
    
    db.session.add(new_member)
    db.session.commit()
    
    return success_response(new_member.to_dict(), "Team member added successfully", 201)

def update_team_member(member_id):
    member = Team.query.get_or_404(member_id)
    data = request.get_json(silent=True) or {}
    
    if 'name' in data: member.name = data['name'].strip()
    if 'role' in data: member.position = data['role'].strip()
    elif 'position' in data: member.position = data['position'].strip()
    
    if 'image' in data: member.image = data['image']
    if 'bio' in data: member.bio = data['bio']
    if 'linkedin' in data: member.linkedin = data['linkedin']
    if 'github' in data: member.github = data['github']
    if 'twitter' in data: member.twitter = data['twitter']
    
    db.session.commit()
    return success_response(member.to_dict(), "Team member updated successfully")

def delete_team_member(member_id):
    member = Team.query.get_or_404(member_id)
    db.session.delete(member)
    db.session.commit()
    return success_response(None, "Team member deleted successfully")
