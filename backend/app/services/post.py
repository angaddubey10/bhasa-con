from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, desc, or_
from sqlalchemy.orm import selectinload, joinedload
from typing import Optional, List
import uuid
from app.models.user import User
from app.models.post import Post
from app.models.like import Like
from app.models.follow import Follow
from app.schemas.post import PostCreate, PostResponse
from app.schemas.user import UserListResponse
from app.utils.exceptions import PostNotFoundException, UnauthorizedOperationException


async def create_post(db: AsyncSession, post_data: PostCreate, user_id: uuid.UUID) -> Post:
    """Create a new post"""
    db_post = Post(
        user_id=user_id,
        content=post_data.content,
        language=post_data.language,
        image_url=post_data.image_url
    )
    
    db.add(db_post)
    await db.commit()
    await db.refresh(db_post)
    
    return db_post


async def get_post_by_id(db: AsyncSession, post_id: uuid.UUID, current_user: Optional[User] = None) -> PostResponse:
    """Get a post by ID with user info, like count, and like status"""
    result = await db.execute(
        select(Post).options(joinedload(Post.user)).where(
            and_(Post.id == post_id, Post.is_deleted == False)
        )
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise PostNotFoundException(str(post_id))
    
    # Get like count
    like_count_result = await db.execute(
        select(func.count(Like.id)).where(Like.post_id == post_id)
    )
    like_count = like_count_result.scalar() or 0
    
    # Check if current user liked this post
    is_liked = False
    if current_user:
        like_result = await db.execute(
            select(Like).where(
                and_(Like.user_id == current_user.id, Like.post_id == post_id)
            )
        )
        is_liked = like_result.scalar_one_or_none() is not None
    
    return PostResponse(
        id=post.id,
        user=UserListResponse(
            id=post.user.id,
            first_name=post.user.first_name,
            last_name=post.user.last_name,
            profile_picture=post.user.profile_picture,
            bio=post.user.bio,
            place=post.user.place,
            state=post.user.state,
            is_following=False  # Will be populated separately if needed
        ),
        content=post.content,
        language=post.language,
        image_url=post.image_url,
        like_count=like_count,
        is_liked=is_liked,
        created_at=post.created_at
    )


async def get_posts_feed(db: AsyncSession, user_id: Optional[uuid.UUID] = None, page: int = 1, limit: int = 20, following_only: bool = False) -> List[PostResponse]:
    """Get posts feed with pagination"""
    offset = (page - 1) * limit
    
    # Build query based on whether to show following only or all posts
    if following_only and user_id:
        # Get posts from users the current user is following + their own posts
        query = (
            select(Post)
            .options(joinedload(Post.user))
            .join(User, Post.user_id == User.id)
            .where(
                and_(
                    Post.is_deleted == False,
                    or_(
                        Post.user_id == user_id,  # User's own posts
                        Post.user_id.in_(
                            select(Follow.following_id).where(Follow.follower_id == user_id)
                        )
                    )
                )
            )
            .order_by(desc(Post.created_at))
            .offset(offset)
            .limit(limit)
        )
    else:
        # Get all posts
        query = (
            select(Post)
            .options(joinedload(Post.user))
            .where(Post.is_deleted == False)
            .order_by(desc(Post.created_at))
            .offset(offset)
            .limit(limit)
        )
    
    result = await db.execute(query)
    posts = result.scalars().unique().all()
    
    # Get additional data for each post
    post_responses = []
    for post in posts:
        # Get like count
        like_count_result = await db.execute(
            select(func.count(Like.id)).where(Like.post_id == post.id)
        )
        like_count = like_count_result.scalar() or 0
        
        # Check if current user liked this post
        is_liked = False
        if user_id:
            like_result = await db.execute(
                select(Like).where(
                    and_(Like.user_id == user_id, Like.post_id == post.id)
                )
            )
            is_liked = like_result.scalar_one_or_none() is not None
        
        # Check if current user is following the post author
        is_following = False
        if user_id and user_id != post.user_id:
            follow_result = await db.execute(
                select(Follow).where(
                    and_(Follow.follower_id == user_id, Follow.following_id == post.user_id)
                )
            )
            is_following = follow_result.scalar_one_or_none() is not None
        
        post_responses.append(PostResponse(
            id=post.id,
            user=UserListResponse(
                id=post.user.id,
                first_name=post.user.first_name,
                last_name=post.user.last_name,
                profile_picture=post.user.profile_picture,
                bio=post.user.bio,
                place=post.user.place,
                state=post.user.state,
                is_following=is_following
            ),
            content=post.content,
            language=post.language,
            image_url=post.image_url,
            like_count=like_count,
            is_liked=is_liked,
            created_at=post.created_at
        ))
    
    return post_responses


async def get_user_posts(db: AsyncSession, user_id: uuid.UUID, page: int = 1, limit: int = 20, current_user: Optional[User] = None) -> List[PostResponse]:
    """Get posts by a specific user"""
    offset = (page - 1) * limit
    
    result = await db.execute(
        select(Post)
        .options(joinedload(Post.user))
        .where(and_(Post.user_id == user_id, Post.is_deleted == False))
        .order_by(desc(Post.created_at))
        .offset(offset)
        .limit(limit)
    )
    posts = result.scalars().unique().all()
    
    # Get additional data for each post
    post_responses = []
    for post in posts:
        # Get like count
        like_count_result = await db.execute(
            select(func.count(Like.id)).where(Like.post_id == post.id)
        )
        like_count = like_count_result.scalar() or 0
        
        # Check if current user liked this post
        is_liked = False
        if current_user:
            like_result = await db.execute(
                select(Like).where(
                    and_(Like.user_id == current_user.id, Like.post_id == post.id)
                )
            )
            is_liked = like_result.scalar_one_or_none() is not None
        
        post_responses.append(PostResponse(
            id=post.id,
            user=UserListResponse(
                id=post.user.id,
                first_name=post.user.first_name,
                last_name=post.user.last_name,
                profile_picture=post.user.profile_picture,
                bio=post.user.bio,
                place=post.user.place,
                state=post.user.state,
                is_following=False  # Not needed for user's own posts
            ),
            content=post.content,
            language=post.language,
            image_url=post.image_url,
            like_count=like_count,
            is_liked=is_liked,
            created_at=post.created_at
        ))
    
    return post_responses


async def delete_post(db: AsyncSession, post_id: uuid.UUID, user_id: uuid.UUID) -> bool:
    """Delete a post (soft delete)"""
    result = await db.execute(
        select(Post).where(and_(Post.id == post_id, Post.is_deleted == False))
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise PostNotFoundException(str(post_id))
    
    if post.user_id != user_id:
        raise UnauthorizedOperationException("delete this post")
    
    post.is_deleted = True
    await db.commit()
    
    return True


async def like_post(db: AsyncSession, post_id: uuid.UUID, user_id: uuid.UUID) -> bool:
    """Like a post"""
    # Check if post exists
    post_result = await db.execute(
        select(Post).where(and_(Post.id == post_id, Post.is_deleted == False))
    )
    if not post_result.scalar_one_or_none():
        raise PostNotFoundException(str(post_id))
    
    # Check if already liked
    like_result = await db.execute(
        select(Like).where(and_(Like.user_id == user_id, Like.post_id == post_id))
    )
    if like_result.scalar_one_or_none():
        return False  # Already liked
    
    # Create like
    like = Like(user_id=user_id, post_id=post_id)
    db.add(like)
    await db.commit()
    
    return True


async def unlike_post(db: AsyncSession, post_id: uuid.UUID, user_id: uuid.UUID) -> bool:
    """Unlike a post"""
    result = await db.execute(
        select(Like).where(and_(Like.user_id == user_id, Like.post_id == post_id))
    )
    like = result.scalar_one_or_none()
    
    if not like:
        return False  # Not liked
    
    await db.delete(like)
    await db.commit()
    
    return True
