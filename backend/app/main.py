import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer
from fastapi.openapi.utils import get_openapi
from contextlib import asynccontextmanager
import logging

from app.database import engine, Base
from app.routers import auth, users, posts

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up the Bhasa Con API...")
    try:
        async with engine.begin() as conn:
            # Create tables
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down the Bhasa Con API...")
    await engine.dispose()

# Security scheme for OpenAPI
bearer_scheme = HTTPBearer()

# Custom OpenAPI schema with comprehensive documentation
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="Bhasa Con API",
        version="1.0.0",
        description="""
# Bhasa Con API - Social Media Platform

A comprehensive social media platform connecting users through multiple languages.

## Features

* **User Authentication** - Secure JWT-based authentication system
* **User Profiles** - Complete user profile management with language preferences
* **Social Posts** - Create, read, update, and delete social posts with media support
* **Social Interactions** - Follow users, like posts, and engage with the community
* **Multi-language Support** - Connect with users speaking different languages

## Authentication

Most endpoints require authentication using Bearer tokens. 
1. Register a new account or login with existing credentials
2. Use the received JWT token in the Authorization header
3. Format: `Authorization: Bearer <your-jwt-token>`

## API Response Format

All API responses follow a consistent format:

```json
{
    "success": true,
    "message": "Operation description",
    "data": { ... }
}
```

For errors:

```json
{
    "success": false,
    "error": "Error description",
    "status_code": 400
}
```
        """,
        routes=app.routes,
        contact={
            "name": "Bhasa Con Support",
            "email": "support@bhasacon.com"
        },
        license_info={
            "name": "MIT License",
            "url": "https://opensource.org/licenses/MIT"
        }
    )
    
    # Add comprehensive security schemes
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "JWT Bearer token authentication. Format: Bearer <token>"
        }
    }
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

# Create FastAPI app with comprehensive metadata
app = FastAPI(
    title="Bhasa Con API",
    description="A social media platform connecting users through multiple languages",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
    # OpenAPI tags for organized documentation
    openapi_tags=[
        {
            "name": "Authentication",
            "description": "User authentication and authorization endpoints. Handle user registration, login, logout, and profile access.",
        },
        {
            "name": "Users", 
            "description": "User profile management operations. Create, read, update user profiles, manage follows, and search users.",
        },
        {
            "name": "Posts",
            "description": "Social media post operations. Create, read, update, delete posts, handle likes, and manage media uploads.",
        },
        {
            "name": "Health",
            "description": "Application health and status monitoring endpoints.",
        }
    ]
)

# Set custom OpenAPI
app.openapi = custom_openapi

# CORS Configuration
cors_origins = [
    "https://bhasa-con-production.up.railway.app",
    "https://bc-backend-production-7180.up.railway.app", 
    "http://localhost:3000",
    "http://localhost:8000",
    "https://*.railway.app", # Allow all Railway subdomains    
]

# Add some debug logging for CORS configuration
print(f"CORS Origins configured: {cors_origins}")
print(f"CORS_ORIGINS environment variable: {os.getenv('CORS_ORIGINS')}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enhanced error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions with consistent format."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )

# Health check endpoint with comprehensive status
@app.get(
    "/health",
    tags=["Health"],
    summary="Health Check",
    description="Check the health status of the Bhasa Con API and its dependencies."
)
async def health_check():
    """
    Comprehensive health check endpoint.
    
    Returns the current status of the application and its dependencies.
    """
    try:
        # You could add database connectivity check here if needed
        return {
            "success": True,
            "status": "healthy", 
            "service": "bhasa-con-api",
            "version": "1.0.0",
            "timestamp": "2024-01-01T00:00:00Z"
        }
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={
                "success": False,
                "status": "unhealthy",
                "error": str(e),
                "service": "bhasa-con-api"
            }
        )

# Root endpoint with API information
@app.get(
    "/",
    tags=["Health"],
    summary="API Information",
    description="Get basic information about the Bhasa Con API."
)
async def read_root():
    """
    API information endpoint.
    
    Provides basic information about the API, version, and available endpoints.
    """
    return {
        "success": True,
        "message": "Welcome to Bhasa Con API",
        "version": "1.0.0",
        "description": "A social media platform connecting users through multiple languages",
        "documentation": {
            "swagger_ui": "/docs",
            "redoc": "/redoc",
            "openapi_schema": "/openapi.json"
        },
        "endpoints": {
            "authentication": "/api/auth",
            "users": "/api/users", 
            "posts": "/api/posts"
        }
    }

# Include routers with comprehensive configuration
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(posts.router, prefix="/api/posts", tags=["Posts"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
