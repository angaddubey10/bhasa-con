from pydantic import BaseModel, field_validator, ConfigDict
from typing import Optional
from datetime import datetime
import uuid
from app.schemas.user import UserListResponse


class PostCreate(BaseModel):
    content: str
    language: str = 'English'
    image_url: Optional[str] = None
    
    @field_validator('content')
    @classmethod
    def validate_content(cls, v):
        v = v.strip()
        if not (1 <= len(v) <= 500):
            raise ValueError('Content must be 1-500 characters')
        return v
    
    @field_validator('language')
    @classmethod
    def validate_language(cls, v):
        allowed_languages = ['English', 'Hindi']
        if v not in allowed_languages:
            raise ValueError(f'Language must be one of: {", ".join(allowed_languages)}')
        return v


class PostResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: uuid.UUID
    user: UserListResponse
    content: str
    language: str
    image_url: Optional[str] = None
    like_count: int = 0
    comment_count: int = 0
    is_liked: bool = False
    created_at: datetime


class PostUpdate(BaseModel):
    content: Optional[str] = None
    language: Optional[str] = None
    
    @field_validator('content')
    @classmethod
    def validate_content(cls, v):
        if v is not None:
            v = v.strip()
            if not (1 <= len(v) <= 500):
                raise ValueError('Content must be 1-500 characters')
        return v
    
    @field_validator('language')
    @classmethod
    def validate_language(cls, v):
        if v is not None:
            allowed_languages = ['English', 'Hindi']
            if v not in allowed_languages:
                raise ValueError(f'Language must be one of: {", ".join(allowed_languages)}')
        return v
