from pydantic import BaseModel, Field
from typing import Optional
from .user import UserResponse


class Token(BaseModel):
    """JWT Token response schema."""
    
    access_token: str = Field(
        ..., 
        description="JWT access token for authentication",
        example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    )
    token_type: str = Field(
        default="bearer", 
        description="Token type (always 'bearer')",
        example="bearer"
    )
    user: Optional[UserResponse] = Field(
        None, 
        description="User information associated with the token"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                "token_type": "bearer",
                "user": {
                    "id": "123e4567-e89b-12d3-a456-426614174000",
                    "email": "user@example.com",
                    "first_name": "John",
                    "last_name": "Doe",
                    "bio": "Hello world!",
                    "languages": ["English", "Hindi"],
                    "place": "Mumbai",
                    "state": "Maharashtra"
                }
            }
        }


class TokenData(BaseModel):
    """Token data for internal use."""
    
    user_id: str | None = Field(
        None, 
        description="User ID extracted from token"
    )
