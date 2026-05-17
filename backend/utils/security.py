import bcrypt

def hash_password(password):
    """Hash a password for storing."""
    salt = bcrypt.gensalt()
    pw_hash = bcrypt.hashpw(password.encode('utf-8'), salt)
    return pw_hash.decode('utf-8')

def check_password(password, hashed_password):
    """Check a hashed password."""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
