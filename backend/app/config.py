"""
Configuration settings for Bhasa Con API
"""
import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Application settings configuration"""
    
    # Application settings
    app_name: str = "Bhasa Con API"
    version: str = "1.0.0"
    description: str = "A social media platform connecting users through multiple languages"
    debug: bool = os.getenv("ENVIRONMENT", "development") == "development"
    
    # Server settings
    host: str = "0.0.0.0"
    port: int = int(os.getenv("PORT", 8000))
    
    # Database
    database_url: str = os.getenv("DATABASE_URL", "")
    
    # CORS origins
    def get_cors_origins(self) -> List[str]:
        """Get CORS origins from environment or use defaults"""
        cors_origins_env = os.getenv("CORS_ORIGINS", "")
        
        if cors_origins_env:
            return cors_origins_env.split(",")
        
        # Default CORS origins
        return [
            "https://bhasa-con-production.up.railway.app",
            "https://bc-backend-production-7180.up.railway.app", 
            "http://localhost:3000",
            "http://localhost:8000",
            "https://*.railway.app",
        ]
    
    # Logging
    log_level: str = os.getenv("LOG_LEVEL", "INFO")

# Global settings instance
settings = Settings()
