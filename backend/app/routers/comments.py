from fastapi import APIRouter, Depends, status, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import uuid
import logging
from app.database import get_db
from app.schemas.comment import CommentCreate, CommentListResponse
from app.services.comment import (
    create_comment, get_comments_by_post, delete_comment
)
from app.utils.dependencies import get_current_user, get_current_user_optional
from app.models.user import User

# Configure logging for comments router
logger = logging.getLogger(__name__)
logger.info("💬 Comments router module loading...")

router = APIRouter()
logger.info(f"✅ Comments router created: {router}")
logger.info("💬 Comments router module loaded successfully")


@router.post("/posts/{post_id}/comments", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_comment_endpoint(
    post_id: uuid.UUID,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new comment on a post"""
    comment = await create_comment(db, comment_data, post_id, current_user.id)
    return {
        "success": True,
        "message": "Comment created successfully",
        "data": {
            "comment_id": str(comment.id),
            "content": comment.content,
            "created_at": comment.created_at
        }
    }


@router.get("/posts/{post_id}/comments", response_model=dict)
async def get_comments_endpoint(
    post_id: uuid.UUID,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=50, description="Items per page"),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """Get comments for a post with pagination"""
    comments_response = await get_comments_by_post(db, post_id, page, limit, current_user)
    return {
        "success": True,
        "data": comments_response
    }


@router.delete("/comments/{comment_id}", response_model=dict)
async def delete_comment_endpoint(
    comment_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a comment"""
    success = await delete_comment(db, comment_id, current_user.id)
    if success:
        return {
            "success": True,
            "message": "Comment deleted successfully"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )


# Debug: Log all registered routes in this router
logger.info("=== COMMENTS ROUTER ENDPOINTS ===")
endpoint_count = len(router.routes)
logger.info(f"Comments router has {endpoint_count} endpoints:")
for i, route in enumerate(router.routes, 1):
    if hasattr(route, 'methods') and hasattr(route, 'path'):
        methods = list(route.methods)
        logger.info(f"{i}. {methods} {route.path}")
    elif hasattr(route, 'path'):
        logger.info(f"{i}. {route.path}")
logger.info("=== END COMMENTS ROUTER ENDPOINTS ===")
