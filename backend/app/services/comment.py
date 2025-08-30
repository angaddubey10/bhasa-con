from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, desc
from sqlalchemy.orm import joinedload
from typing import Optional, List
import uuid
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.schemas.comment import CommentCreate, CommentResponse, CommentListResponse
from app.schemas.user import UserListResponse
from app.utils.exceptions import PostNotFoundException, UnauthorizedOperationException


async def create_comment(db: AsyncSession, comment_data: CommentCreate, post_id: uuid.UUID, user_id: uuid.UUID) -> Comment:
    """Create a new comment on a post"""
    # Check if post exists and is not deleted
    post_result = await db.execute(
        select(Post).where(and_(Post.id == post_id, Post.is_deleted == False))
    )
    if not post_result.scalar_one_or_none():
        raise PostNotFoundException(str(post_id))
    
    # Create the comment
    db_comment = Comment(
        post_id=post_id,
        user_id=user_id,
        content=comment_data.content
    )
    
    db.add(db_comment)
    await db.commit()
    await db.refresh(db_comment)
    
    return db_comment


async def get_comments_by_post(
    db: AsyncSession, 
    post_id: uuid.UUID, 
    page: int = 1, 
    limit: int = 20,
    current_user: Optional[User] = None
) -> CommentListResponse:
    """Get comments for a post with pagination"""
    # Check if post exists
    post_result = await db.execute(
        select(Post).where(and_(Post.id == post_id, Post.is_deleted == False))
    )
    post = post_result.scalar_one_or_none()
    if not post:
        raise PostNotFoundException(str(post_id))
    
    offset = (page - 1) * limit
    
    # Get comments with user information
    result = await db.execute(
        select(Comment)
        .options(joinedload(Comment.user))
        .where(and_(Comment.post_id == post_id, Comment.is_deleted == False))
        .order_by(desc(Comment.created_at))
        .offset(offset)
        .limit(limit)
    )
    comments = result.scalars().unique().all()
    
    # Get total count
    count_result = await db.execute(
        select(func.count(Comment.id)).where(
            and_(Comment.post_id == post_id, Comment.is_deleted == False)
        )
    )
    total = count_result.scalar() or 0
    
    # Convert to response format
    comment_responses = []
    for comment in comments:
        # Determine if user can delete this comment
        can_delete = False
        if current_user:
            # User can delete their own comment or if they own the post
            can_delete = (comment.user_id == current_user.id or post.user_id == current_user.id)
        
        comment_responses.append(CommentResponse(
            id=comment.id,
            user=UserListResponse(
                id=comment.user.id,
                first_name=comment.user.first_name,
                last_name=comment.user.last_name,
                profile_picture=comment.user.profile_picture,
                bio=comment.user.bio,
                place=comment.user.place,
                state=comment.user.state,
                is_following=False  # Could be enhanced later
            ),
            content=comment.content,
            created_at=comment.created_at,
            can_delete=can_delete
        ))
    
    return CommentListResponse(
        comments=comment_responses,
        total=total,
        page=page,
        limit=limit,
        has_next=len(comments) == limit and offset + len(comments) < total
    )


async def get_comment_by_id(db: AsyncSession, comment_id: uuid.UUID) -> Optional[Comment]:
    """Get a comment by ID"""
    result = await db.execute(
        select(Comment).where(and_(Comment.id == comment_id, Comment.is_deleted == False))
    )
    return result.scalar_one_or_none()


async def delete_comment(db: AsyncSession, comment_id: uuid.UUID, user_id: uuid.UUID) -> bool:
    """Delete a comment (soft delete)"""
    # Get comment with post information
    result = await db.execute(
        select(Comment)
        .options(joinedload(Comment.post))
        .where(and_(Comment.id == comment_id, Comment.is_deleted == False))
    )
    comment = result.scalar_one_or_none()
    
    if not comment:
        return False
    
    # Check authorization: user owns comment OR user owns the post
    if comment.user_id != user_id and comment.post.user_id != user_id:
        raise UnauthorizedOperationException("delete this comment")
    
    # Soft delete
    comment.is_deleted = True
    await db.commit()
    
    return True


async def get_comment_count_for_post(db: AsyncSession, post_id: uuid.UUID) -> int:
    """Get comment count for a post"""
    result = await db.execute(
        select(func.count(Comment.id)).where(
            and_(Comment.post_id == post_id, Comment.is_deleted == False)
        )
    )
    return result.scalar() or 0
