from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Define the global rate limiter (60 requests per minute by default)
limiter = Limiter(
    get_remote_address,
    default_limits=["60 per minute"],
    storage_uri="memory://"
)
