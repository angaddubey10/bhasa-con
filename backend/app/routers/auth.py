from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.auth import Token
from app.schemas.user import UserRegister, UserLogin, UserResponse
from app.services.auth import create_user, authenticate_user
from app.utils.dependencies import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user"""
    user = await create_user(db, user_data)
    return {
        "success": True,
        "message": "User registered successfully",
        "data": {
            "user_id": str(user.id),
            "email": user.email
        }
    }


@router.post("/login", response_model=dict)
async def login(
    login_data: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """Login user and return access token"""
    access_token = await authenticate_user(db, login_data)
    return {
        "success": True,
        "message": "Login successful",
        "data": {
            "access_token": access_token,
            "token_type": "bearer"
        }
    }


@router.get("/me", response_model=dict)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Get current user profile"""
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


@router.post("/logout", response_model=dict)
async def logout():
    """Logout user (client-side token removal)"""
    return {
        "success": True,
        "message": "Logout successful"
    }
