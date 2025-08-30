# FastAPI Swagger/OpenAPI Documentation Setup Prompt

## Overview

This prompt provides a comprehensive guide to set up professional Swagger/OpenAPI documentation for a FastAPI application, based on the implementation in the MyDoc medical documentation system.

## FastAPI Application Configuration

### 1. Main Application Setup (main.py)

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import logging
from contextlib import asynccontextmanager

# Import your configurations and database
from config import settings
from database import engine, Base

# Import all your route modules
from routes.auth import router as auth_router
from routes.patients import router as patients_router
# ... other routers

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logger.info("Starting up the application...")
    try:
        # Database initialization
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
    
    yield
    
    # Shutdown logic
    logger.info("Shutting down the application...")

# Create FastAPI app with comprehensive metadata
app = FastAPI(
    title="Your Application Name API",
    description="Comprehensive backend API for [your application description]",
    version="1.0.0",
    lifespan=lifespan,
    # Optional: Additional OpenAPI customizations
    openapi_tags=[
        {
            "name": "Authentication",
            "description": "User authentication and authorization endpoints",
        },
        {
            "name": "Users",
            "description": "User management operations",
        },
        # Add more tags as needed
    ],
    # Optional: Custom OpenAPI URL paths
    docs_url="/docs",  # Swagger UI (default)
    redoc_url="/redoc",  # ReDoc alternative documentation
    openapi_url="/openapi.json",  # OpenAPI schema endpoint
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth_router)
# ... include other routers

# Root endpoint with API information
@app.get("/")
async def read_root():
    return {
        "message": "Your Application API",
        "version": "1.0.0",
        "status": "active",
        "docs": "/docs",
        "redoc": "/redoc"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "timestamp": "2024-01-01T00:00:00Z"
    }
```

### 2. Router Configuration with Tags and Documentation

```python
# routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/auth", 
    tags=["Authentication"]  # This groups endpoints in Swagger UI
)

@router.post("/login", response_model=Token)
async def login(
    user_credentials: UserLogin, 
    db: Session = Depends(get_db)
):
    """
    Authenticate user and return access token.
    
    - **email**: User email address
    - **password**: User password
    
    Returns JWT access token and user information.
    """
    # Implementation here

@router.post("/register", response_model=UserResponse)
async def register(
    user_data: UserCreate, 
    db: Session = Depends(get_db)
):
    """
    Register a new user (admin only in production).
    
    - **name**: Full name of the user
    - **email**: Valid email address
    - **password**: Strong password (min 8 characters)
    - **role**: User role (ADMIN, DOCTOR, ASSISTANT, etc.)
    """
    # Implementation here
```

### 3. Pydantic Schema Configuration

```python
# schemas.py
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    DOCTOR = "DOCTOR"
    ASSISTANT = "ASSISTANT"

class UserLogin(BaseModel):
    """User login credentials schema."""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=6, description="User password")

    class Config:
        schema_extra = {
            "example": {
                "email": "doctor@clinic.com",
                "password": "doctor123"
            }
        }

class UserCreate(BaseModel):
    """User registration schema."""
    name: str = Field(..., min_length=2, max_length=100, description="Full name")
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=8, description="Strong password")
    role: UserRole = Field(default=UserRole.ASSISTANT, description="User role")

    class Config:
        schema_extra = {
            "example": {
                "name": "Dr. John Smith",
                "email": "doctor@clinic.com",
                "password": "securePassword123",
                "role": "DOCTOR"
            }
        }

class Token(BaseModel):
    """JWT token response schema."""
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    user: "UserResponse" = Field(..., description="User information")

class UserResponse(BaseModel):
    """User response schema."""
    user_id: str = Field(..., description="Unique user identifier")
    name: str = Field(..., description="User full name")
    email: EmailStr = Field(..., description="User email")
    role: UserRole = Field(..., description="User role")
    created_at: datetime = Field(..., description="Account creation timestamp")

    class Config:
        from_attributes = True
        schema_extra = {
            "example": {
                "user_id": "123e4567-e89b-12d3-a456-426614174000",
                "name": "Dr. John Smith",
                "email": "doctor@clinic.com",
                "role": "DOCTOR",
                "created_at": "2024-01-01T00:00:00Z"
            }
        }
```

### 4. Configuration Settings (config.py)

```python
from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Application
    app_name: str = "Your Application API"
    app_version: str = "1.0.0"
    debug: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")
    
    # CORS
    cors_origins: str = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173")
    
    # Database
    database_url: str = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost/db")
    
    # Authentication
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "your-secret-key")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    class Config:
        env_file = ".env"
    
    def get_cors_origins(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

settings = Settings()
```

## Advanced OpenAPI Customizations

### 1. Custom OpenAPI Schema Generation

```python
from fastapi.openapi.utils import get_openapi

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Your Application API",
        version="1.0.0",
        description="Comprehensive API documentation with advanced features",
        routes=app.routes,
    )
    
    # Add custom information
    openapi_schema["info"]["x-logo"] = {
        "url": "https://your-domain.com/logo.png"
    }
    
    # Add security schemes
    openapi_schema["components"]["securitySchemes"] = {
        "Bearer Auth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
```

### 2. Response Models and Status Codes

```python
from fastapi import status
from fastapi.responses import JSONResponse

@router.post(
    "/login", 
    response_model=Token,
    status_code=status.HTTP_200_OK,
    responses={
        200: {
            "description": "Successful authentication",
            "content": {
                "application/json": {
                    "example": {
                        "access_token": "jwt_token_here",
                        "token_type": "bearer",
                        "user": {
                            "user_id": "uuid",
                            "name": "Dr. John Smith",
                            "email": "doctor@clinic.com",
                            "role": "DOCTOR"
                        }
                    }
                }
            }
        },
        401: {
            "description": "Authentication failed",
            "content": {
                "application/json": {
                    "example": {"detail": "Incorrect email or password"}
                }
            }
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {
                        "detail": [
                            {
                                "loc": ["body", "email"],
                                "msg": "field required",
                                "type": "value_error.missing"
                            }
                        ]
                    }
                }
            }
        }
    }
)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return access token."""
    # Implementation
```

### 3. Security Dependencies

```python
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Extract and validate JWT token from request."""
    # Implementation for token validation
    pass

@router.get("/protected", dependencies=[Depends(get_current_user)])
async def protected_endpoint():
    """Protected endpoint requiring authentication."""
    return {"message": "Access granted"}
```

## Environment Configuration

### .env file

```env
# Application
DEBUG=True
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Authentication
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Documentation (optional)
DOCS_URL=/docs
REDOC_URL=/redoc
OPENAPI_URL=/openapi.json
```

## Documentation Best Practices

### 1. Endpoint Documentation Guidelines

- **Use clear, descriptive docstrings** for each endpoint
- **Include parameter descriptions** in Pydantic models using `Field(description=...)`
- **Provide realistic examples** in schema configurations
- **Document error responses** with appropriate status codes
- **Group related endpoints** using router tags
- **Use consistent naming conventions** for endpoints and models

### 2. Schema Documentation

```python
class PatientCreate(BaseModel):
    """Schema for creating a new patient record."""
    
    name: str = Field(
        ..., 
        min_length=2, 
        max_length=100,
        description="Patient's full name",
        example="John Doe"
    )
    age: int = Field(
        ..., 
        ge=0, 
        le=150,
        description="Patient's age in years",
        example=35
    )
    gender: str = Field(
        ...,
        description="Patient's gender",
        example="MALE"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "name": "John Doe",
                "age": 35,
                "gender": "MALE",
                "contact_number": "+1234567890",
                "address": "123 Main St, City, State"
            }
        }
```

### 3. Error Handling Documentation

```python
from fastapi import HTTPException
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    """Handle validation errors with detailed response."""
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": exc.errors()
        }
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions with consistent format."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )
```

## Access Your Documentation

After implementing the above configuration, your API documentation will be available at:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

## Key Features Implemented

1. **Comprehensive API Metadata**: Title, description, version, and contact information
2. **Organized Endpoint Grouping**: Using tags to categorize related endpoints
3. **Rich Schema Documentation**: Detailed field descriptions and examples
4. **Security Integration**: JWT token authentication with proper security schemes
5. **Error Response Documentation**: Consistent error handling and documentation
6. **CORS Configuration**: Proper cross-origin resource sharing setup
7. **Environment-based Configuration**: Flexible settings management
8. **Health Checks**: Monitoring endpoints for application status

## Additional Customizations

You can further enhance your documentation by:

- Adding custom CSS/JavaScript to Swagger UI
- Implementing API versioning with separate documentation
- Adding rate limiting documentation
- Including API changelog and migration guides
- Setting up automated documentation generation in CI/CD

This setup provides a professional, comprehensive API documentation that will help both developers and users understand and interact with your API effectively.
