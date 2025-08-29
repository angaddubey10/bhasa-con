from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid
from app.database import get_db
from app.schemas.user import UserProfile, UserResponse, UserListResponse, PasswordUpdate
from app.services.user import (
    get_user_by_id, update_user_profile, update_user_password, 
    search_users, follow_user, unfollow_user
)
from app.services.upload import upload_profile_picture
from app.utils.dependencies import get_current_user, get_current_user_optional
from app.models.user import User

router = APIRouter()


@router.get("/profile", response_model=dict)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's profile with stats"""
    user_response = await get_user_by_id(db, current_user.id, current_user)
    return {
        "success": True,
        "data": user_response
    }


@router.put("/profile", response_model=dict)
async def update_profile(
    profile_data: UserProfile,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user's profile"""
    updated_user = await update_user_profile(db, current_user.id, profile_data)
    return {
        "success": True,
        "message": "Profile updated successfully",
        "data": {
            "id": str(updated_user.id),
            "first_name": updated_user.first_name,
            "last_name": updated_user.last_name,
            "bio": updated_user.bio
        }
    }


@router.put("/password", response_model=dict)
async def update_password(
    password_data: PasswordUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update user password"""
    await update_user_password(db, current_user.id, password_data)
    return {
        "success": True,
        "message": "Password updated successfully"
    }


@router.post("/upload-avatar", response_model=dict)
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Upload user profile picture"""
    # Upload image to Cloudinary
    image_url = await upload_profile_picture(file)
    
    # Update user profile picture in database
    current_user.profile_picture = image_url
    await db.commit()
    
    return {
        "success": True,
        "message": "Profile picture updated successfully",
        "data": {
            "profile_picture": image_url
        }
    }


@router.get("/search", response_model=dict)
async def search_users_endpoint(
    q: str = Query(..., description="Search query"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=50, description="Items per page"),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """Search for users"""
    users = await search_users(db, q, page, limit, current_user)
    return {
        "success": True,
        "data": {
            "items": users,
            "page": page,
            "limit": limit,
            "has_next": len(users) == limit
        }
    }


@router.get("/{user_id}", response_model=dict)
async def get_user(
    user_id: uuid.UUID,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """Get user profile by ID"""
    user_response = await get_user_by_id(db, user_id, current_user)
    return {
        "success": True,
        "data": user_response
    }


@router.post("/{user_id}/follow", response_model=dict)
async def follow_user_endpoint(
    user_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Follow a user"""
    success = await follow_user(db, current_user.id, user_id)
    if success:
        return {
            "success": True,
            "message": "Successfully followed user"
        }
    else:
        return {
            "success": False,
            "message": "Already following this user"
        }


@router.delete("/{user_id}/follow", response_model=dict)
async def unfollow_user_endpoint(
    user_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Unfollow a user"""
    success = await unfollow_user(db, current_user.id, user_id)
    if success:
        return {
            "success": True,
            "message": "Successfully unfollowed user"
        }
    else:
        return {
            "success": False,
            "message": "Not following this user"
        }
