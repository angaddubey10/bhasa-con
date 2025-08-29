from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from typing import Optional, List
import uuid
from app.models.user import User
from app.models.follow import Follow
from app.models.post import Post
from app.schemas.user import UserProfile, UserResponse, UserListResponse, PasswordUpdate
from app.utils.security import get_password_hash, verify_password
from app.utils.exceptions import UserNotFoundException, InvalidCredentialsException


async def get_user_by_id(db: AsyncSession, user_id: uuid.UUID, current_user: Optional[User] = None) -> UserResponse:
    """Get user by ID with follower counts and follow status"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise UserNotFoundException(str(user_id))
    
    # Get follower count
    follower_count_result = await db.execute(
        select(func.count(Follow.id)).where(Follow.following_id == user_id)
    )
    follower_count = follower_count_result.scalar() or 0
    
    # Get following count
    following_count_result = await db.execute(
        select(func.count(Follow.id)).where(Follow.follower_id == user_id)
    )
    following_count = following_count_result.scalar() or 0
    
    # Get post count
    post_count_result = await db.execute(
        select(func.count(Post.id)).where(and_(Post.user_id == user_id, Post.is_deleted == False))
    )
    post_count = post_count_result.scalar() or 0
    
    # Check if current user is following this user
    is_following = False
    if current_user and current_user.id != user_id:
        follow_result = await db.execute(
            select(Follow).where(
                and_(Follow.follower_id == current_user.id, Follow.following_id == user_id)
            )
        )
        is_following = follow_result.scalar_one_or_none() is not None
    
    return UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        profile_picture=user.profile_picture,
        bio=user.bio,
        languages=user.languages,
        place=user.place,
        state=user.state,
        follower_count=follower_count,
        following_count=following_count,
        post_count=post_count,
        is_following=is_following,
        created_at=user.created_at
    )


async def update_user_profile(db: AsyncSession, user_id: uuid.UUID, profile_data: UserProfile) -> User:
    """Update user profile"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise UserNotFoundException(str(user_id))
    
    # Update user fields
    for field, value in profile_data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    
    await db.commit()
    await db.refresh(user)
    
    return user


async def update_user_password(db: AsyncSession, user_id: uuid.UUID, password_data: PasswordUpdate) -> bool:
    """Update user password"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise UserNotFoundException(str(user_id))
    
    # Verify current password
    if not verify_password(password_data.current_password, user.password_hash):
        raise InvalidCredentialsException()
    
    # Update password
    user.password_hash = get_password_hash(password_data.new_password)
    await db.commit()
    
    return True


async def search_users(db: AsyncSession, query: str, page: int = 1, limit: int = 20, current_user: Optional[User] = None) -> List[UserListResponse]:
    """Search users by name or email"""
    offset = (page - 1) * limit
    search_term = f"%{query}%"
    
    result = await db.execute(
        select(User).where(
            User.first_name.ilike(search_term) | 
            User.last_name.ilike(search_term) |
            User.email.ilike(search_term)
        ).offset(offset).limit(limit)
    )
    users = result.scalars().all()
    
    # Check follow status for each user
    user_responses = []
    for user in users:
        is_following = False
        if current_user and current_user.id != user.id:
            follow_result = await db.execute(
                select(Follow).where(
                    and_(Follow.follower_id == current_user.id, Follow.following_id == user.id)
                )
            )
            is_following = follow_result.scalar_one_or_none() is not None
        
        user_responses.append(UserListResponse(
            id=user.id,
            first_name=user.first_name,
            last_name=user.last_name,
            profile_picture=user.profile_picture,
            bio=user.bio,
            place=user.place,
            state=user.state,
            is_following=is_following
        ))
    
    return user_responses


async def follow_user(db: AsyncSession, follower_id: uuid.UUID, following_id: uuid.UUID) -> bool:
    """Follow a user"""
    if follower_id == following_id:
        raise ValueError("Cannot follow yourself")
    
    # Check if already following
    result = await db.execute(
        select(Follow).where(
            and_(Follow.follower_id == follower_id, Follow.following_id == following_id)
        )
    )
    if result.scalar_one_or_none():
        return False  # Already following
    
    # Check if users exist
    follower_result = await db.execute(select(User).where(User.id == follower_id))
    following_result = await db.execute(select(User).where(User.id == following_id))
    
    if not follower_result.scalar_one_or_none():
        raise UserNotFoundException(str(follower_id))
    if not following_result.scalar_one_or_none():
        raise UserNotFoundException(str(following_id))
    
    # Create follow relationship
    follow = Follow(follower_id=follower_id, following_id=following_id)
    db.add(follow)
    await db.commit()
    
    return True


async def unfollow_user(db: AsyncSession, follower_id: uuid.UUID, following_id: uuid.UUID) -> bool:
    """Unfollow a user"""
    result = await db.execute(
        select(Follow).where(
            and_(Follow.follower_id == follower_id, Follow.following_id == following_id)
        )
    )
    follow = result.scalar_one_or_none()
    
    if not follow:
        return False  # Not following
    
    await db.delete(follow)
    await db.commit()
    
    return True
