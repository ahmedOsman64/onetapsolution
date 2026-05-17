import re

def is_valid_email(email):
    """Simple email validation."""
    if not email:
        return False
    regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(regex, email) is not None

def require_fields(data, required_keys):
    """Check if required fields are present in the dictionary."""
    missing = []
    for key in required_keys:
        if key not in data or data[key] is None or str(data[key]).strip() == '':
            missing.append(key)
    return missing
