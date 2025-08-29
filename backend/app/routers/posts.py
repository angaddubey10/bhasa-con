from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid
from app.database import get_db
from app.schemas.post import PostCreate, PostResponse
from app.services.post import (
    create_post, get_post_by_id, get_posts_feed, get_user_posts,
    delete_post, like_post, unlike_post
)
from app.services.upload import upload_image
from app.utils.dependencies import get_current_user, get_current_user_optional
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=dict)
async def get_posts(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=50, description="Items per page"),
    following_only: bool = Query(False, description="Show only posts from followed users"),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """Get posts feed with pagination"""
    user_id = current_user.id if current_user else None
    posts = await get_posts_feed(db, user_id, page, limit, following_only)
    return {
        "success": True,
        "data": {
            "items": posts,
            "page": page,
            "limit": limit,
            "has_next": len(posts) == limit
        }
    }


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_post_endpoint(
    post_data: PostCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new post"""
    post = await create_post(db, post_data, current_user.id)
    return {
        "success": True,
        "message": "Post created successfully",
        "data": {
            "post_id": str(post.id),
            "content": post.content,
            "language": post.language,
            "created_at": post.created_at
        }
    }


@router.post("/upload-image", response_model=dict)
async def upload_post_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Upload image for post"""
    image_url = await upload_image(file, "bhasaconnect/posts")
    return {
        "success": True,
        "message": "Image uploaded successfully",
        "data": {
            "image_url": image_url
        }
    }


@router.get("/{post_id}", response_model=dict)
async def get_post(
    post_id: uuid.UUID,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific post by ID"""
    post = await get_post_by_id(db, post_id, current_user)
    return {
        "success": True,
        "data": post
    }


@router.delete("/{post_id}", response_model=dict)
async def delete_post_endpoint(
    post_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a post"""
    success = await delete_post(db, post_id, current_user.id)
    return {
        "success": True,
        "message": "Post deleted successfully"
    }


@router.post("/{post_id}/like", response_model=dict)
async def like_post_endpoint(
    post_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Like a post"""
    success = await like_post(db, post_id, current_user.id)
    if success:
        return {
            "success": True,
            "message": "Post liked successfully"
        }
    else:
        return {
            "success": False,
            "message": "Post already liked"
        }


@router.delete("/{post_id}/like", response_model=dict)
async def unlike_post_endpoint(
    post_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Unlike a post"""
    success = await unlike_post(db, post_id, current_user.id)
    if success:
        return {
            "success": True,
            "message": "Post unliked successfully"
        }
    else:
        return {
            "success": False,
            "message": "Post was not liked"
        }


@router.get("/user/{user_id}", response_model=dict)
async def get_user_posts_endpoint(
    user_id: uuid.UUID,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=50, description="Items per page"),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """Get posts by a specific user"""
    posts = await get_user_posts(db, user_id, page, limit, current_user)
    return {
        "success": True,
        "data": {
            "items": posts,
            "page": page,
            "limit": limit,
            "has_next": len(posts) == limit
        }
    }
