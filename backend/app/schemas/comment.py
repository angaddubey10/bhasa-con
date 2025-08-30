from pydantic import BaseModel, field_validator, ConfigDict
from typing import Optional
from datetime import datetime
import uuid
from app.schemas.user import UserListResponse


class CommentCreate(BaseModel):
    content: str
    
    @field_validator('content')
    @classmethod
    def validate_content(cls, v):
        v = v.strip()
        if not (1 <= len(v) <= 1000):
            raise ValueError('Comment must be 1-1000 characters')
        return v


class CommentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: uuid.UUID
    user: UserListResponse
    content: str
    created_at: datetime
    can_delete: bool = False


class CommentListResponse(BaseModel):
    comments: list[CommentResponse]
    total: int
    page: int
    limit: int
    has_next: bool
