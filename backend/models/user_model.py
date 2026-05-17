from database.db import db
from datetime import datetime

class Role(db.Model):
    __tablename__ = 'roles'

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(50),  nullable=False)
    slug        = db.Column(db.String(50),  nullable=False, unique=True)
    description = db.Column(db.String(255))
    is_system   = db.Column(db.Integer,  default=0)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at  = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    users       = db.relationship('User', back_populates='role_obj', lazy='dynamic')

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'slug': self.slug}


class User(db.Model):
    __tablename__ = 'users'

    id                  = db.Column(db.Integer,     primary_key=True)
    role_id             = db.Column(db.Integer,     db.ForeignKey('roles.id'), nullable=False, default=2)
    name                = db.Column(db.String(100), nullable=False)
    email               = db.Column(db.String(120), unique=True, nullable=False)
    password_hash       = db.Column(db.String(255), nullable=False)
    avatar              = db.Column(db.String(255))
    phone               = db.Column(db.String(30))
    status              = db.Column(db.String(20),  default='Active')
    email_verified      = db.Column(db.Integer,     default=0)
    two_fa_secret       = db.Column(db.String(64))
    two_fa_enabled      = db.Column(db.Integer,     default=0)
    last_login_at       = db.Column(db.DateTime)
    last_login_ip       = db.Column(db.String(45))
    password_changed_at = db.Column(db.DateTime)
    is_deleted          = db.Column(db.Integer,     default=0)
    created_at          = db.Column(db.DateTime,    default=datetime.utcnow)
    updated_at          = db.Column(db.DateTime,    default=datetime.utcnow, onupdate=datetime.utcnow)

    role_obj = db.relationship('Role', back_populates='users', lazy='joined')

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    @property
    def role(self):
        """Return role name string for backward compatibility."""
        return self.role_obj.name if self.role_obj else 'Unknown'

    @property
    def role_slug(self):
        return self.role_obj.slug if self.role_obj else ''

    def is_admin(self):
        """True if role is superadmin or admin."""
        return self.role_slug in ('superadmin', 'admin')

    def to_dict(self):
        return {
            'id':           self.id,
            'name':         self.name,
            'email':        self.email,
            'role':         self.role,
            'role_id':      self.role_id,
            'role_slug':    self.role_slug,
            'avatar':       self.avatar,
            'status':       self.status,
            'is_deleted':   self.is_deleted,
            'created_at':   self.created_at.isoformat() if self.created_at else None,
        }
