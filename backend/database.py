# database.py
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "auth_db")

# Global MongoDB client
_client = None
_database = None

def connect_to_mongodb():
    """Connect to MongoDB"""
    global _client, _database
    
    try:
        _client = MongoClient(MONGODB_URL)
        # Test connection
        _client.admin.command('ismaster')
        _database = _client[DATABASE_NAME]
        
        # Create indexes
        _database.users.create_index("email", unique=True)
        _database.users.create_index("username")
        
        print(f"✅ Connected to MongoDB: {DATABASE_NAME}")
        return _database
    except ConnectionFailure as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        return None

def get_database():
    """Get database instance"""
    global _database
    
    if _database is None:
        _database = connect_to_mongodb()
    
    return _database

def close_mongodb_connection():
    """Close MongoDB connection"""
    global _client
    
    if _client:
        _client.close()
        print("MongoDB connection closed")