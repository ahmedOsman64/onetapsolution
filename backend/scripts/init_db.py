import os
import sys
import pymysql
from dotenv import load_dotenv

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv()

def init_db():
    db_user = os.environ.get('DB_USER', 'root')
    db_password = os.environ.get('DB_PASSWORD', '')
    db_host = os.environ.get('DB_HOST', 'localhost')
    db_port = int(os.environ.get('DB_PORT', 3306))
    db_name = os.environ.get('DB_NAME', 'onetap_db')

    print(f"Connecting to MySQL server at {db_host}:{db_port} as {db_user}...")
    
    try:
        # Connect to MySQL server without specifying a database
        connection = pymysql.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            port=db_port
        )
        
        with connection.cursor() as cursor:
            # Create the database if it doesn't exist
            print(f"Checking if database '{db_name}' exists...")
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
            print(f"Database '{db_name}' is ready!")
            
        connection.commit()
    except Exception as e:
        print(f"Error connecting to MySQL or creating database: {e}")
        print("\nMake sure your MySQL server (e.g., XAMPP) is running!")
        sys.exit(1)
    finally:
        if 'connection' in locals() and connection.open:
            connection.close()

if __name__ == "__main__":
    init_db()
