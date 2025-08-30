from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.auth import Token
from app.schemas.user import UserRegister, UserLogin, UserResponse
from app.services.auth import create_user, authenticate_user
from app.utils.dependencies import get_current_user
from app.models.user import User
import logging

# Configure logging for auth router
logger = logging.getLogger(__name__)
logger.info("🔐 Auth router module loading...")

router = APIRouter()
logger.info(f"✅ Auth router created: {router}")
logger.info("🔐 Auth router module loaded successfully")


@router.post(
    "/register", 
    response_model=dict, 
    status_code=status.HTTP_201_CREATED,
    summary="Register New User",
    description="Create a new user account with email and password.",
    responses={
        201: {
            "description": "User successfully registered",
            "content": {
                "application/json": {
                    "example": {
                        "success": True,
                        "message": "User registered successfully",
                        "data": {
                            "user_id": "123e4567-e89b-12d3-a456-426614174000",
                            "email": "john.doe@example.com"
                        }
                    }
                }
            }
        },
        400: {
            "description": "Registration failed - user already exists or validation error",
            "content": {
                "application/json": {
                    "example": {
                        "success": False,
                        "error": "User with this email already exists",
                        "status_code": 400
                    }
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
                                "loc": ["body", "password"],
                                "msg": "Password must be at least 8 characters",
                                "type": "value_error"
                            }
                        ]
                    }
                }
            }
        }
    }
)
async def register(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user account.
    
    Creates a new user with the provided email and password.
    Email must be unique and password must meet security requirements:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter  
    - At least one digit
    
    Returns user ID and email upon successful registration.
    """
    user = await create_user(db, user_data)
    return {
        "success": True,
        "message": "User registered successfully",
        "data": {
            "user_id": str(user.id),
            "email": user.email
        }
    }


@router.post(
    "/login", 
    response_model=dict,
    summary="User Login",
    description="Authenticate user with email and password, returns JWT token.",
    responses={
        200: {
            "description": "Login successful",
            "content": {
                "application/json": {
                    "example": {
                        "success": True,
                        "message": "Login successful",
                        "data": {
                            "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                            "token_type": "bearer"
                        }
                    }
                }
            }
        },
        401: {
            "description": "Authentication failed",
            "content": {
                "application/json": {
                    "example": {
                        "success": False,
                        "error": "Incorrect email or password",
                        "status_code": 401
                    }
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
async def login(
    login_data: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticate user and return JWT access token.
    
    Validates user credentials and returns a JWT token for authenticated requests.
    The token should be included in the Authorization header as: Bearer <token>
    
    - **email**: User's registered email address
    - **password**: User's password
    
    Returns JWT access token and token type.
    """
    access_token = await authenticate_user(db, login_data)
    return {
        "success": True,
        "message": "Login successful",
        "data": {
            "access_token": access_token,
            "token_type": "bearer"
        }
    }


@router.get(
    "/me", 
    response_model=dict,
    summary="Get Current User Profile", 
    description="Get the profile information of the currently authenticated user.",
    dependencies=[Depends(get_current_user)],
    responses={
        200: {
            "description": "User profile retrieved successfully",
            "content": {
                "application/json": {
                    "example": {
                        "success": True,
                        "data": {
                            "id": "123e4567-e89b-12d3-a456-426614174000",
                            "email": "john.doe@example.com",
                            "first_name": "John",
                            "last_name": "Doe",
                            "profile_picture": "https://example.com/avatar.jpg",
                            "bio": "Hello, I'm John!",
                            "languages": ["English", "Hindi"],
                            "place": "Mumbai",
                            "state": "Maharashtra",
                            "email_notifications": True,
                            "created_at": "2024-01-01T00:00:00"
                        }
                    }
                }
            }
        },
        401: {
            "description": "Authentication required",
            "content": {
                "application/json": {
                    "example": {
                        "success": False,
                        "error": "Authentication credentials required",
                        "status_code": 401
                    }
                }
            }
        }
    }
)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Get current user profile information.
    
    Returns comprehensive profile information for the authenticated user.
    Requires valid JWT token in Authorization header.
    """
    return {
        "success": True,
        "data": {
            "id": str(current_user.id),
            "email": current_user.email,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "profile_picture": current_user.profile_picture,
            "bio": current_user.bio,
            "languages": current_user.languages,
            "place": current_user.place,
            "district": current_user.district,
            "state": current_user.state,
            "email_notifications": current_user.email_notifications,
            "created_at": current_user.created_at
        }
    }


@router.post(
    "/logout", 
    response_model=dict,
    summary="User Logout",
    description="Logout the current user (token invalidation handled client-side).",
    responses={
        200: {
            "description": "Logout successful",
            "content": {
                "application/json": {
                    "example": {
                        "success": True,
                        "message": "Logout successful"
                    }
                }
            }
        }
    }
)
async def logout():
    """
    Logout user (client-side token removal).
    
    Since JWT tokens are stateless, logout is handled by the client
    removing the token from storage. This endpoint confirms the logout action.
    """
    return {
        "success": True,
        "message": "Logout successful"
    }

# Debug: Log all registered routes in this router
logger.info("=== AUTH ROUTER ENDPOINTS ===")
endpoint_count = len(router.routes)
logger.info(f"Auth router has {endpoint_count} endpoints:")
for i, route in enumerate(router.routes, 1):
    if hasattr(route, 'methods') and hasattr(route, 'path'):
        methods = list(route.methods)
        logger.info(f"{i}. {methods} {route.path}")
    elif hasattr(route, 'path'):
        logger.info(f"{i}. {route.path}")
logger.info("=== END AUTH ROUTER ENDPOINTS ===")
