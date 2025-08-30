from pydantic import BaseModel, EmailStr, field_validator, ConfigDict, Field
from typing import List, Optional
from datetime import date, datetime
import uuid


class UserRegister(BaseModel):
    """User registration schema."""
    
    email: EmailStr = Field(
        ..., 
        description="Valid email address for the user",
        example="john.doe@example.com"
    )
    password: str = Field(
        ..., 
        min_length=8,
        description="Strong password (min 8 chars, uppercase, lowercase, digit required)",
        example="SecurePass123"
    )
    first_name: str = Field(
        ..., 
        min_length=2, 
        max_length=50,
        description="User's first name",
        example="John"
    )
    last_name: str = Field(
        ..., 
        min_length=2, 
        max_length=50,
        description="User's last name", 
        example="Doe"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "email": "john.doe@example.com",
                "password": "SecurePass123",
                "first_name": "John",
                "last_name": "Doe"
            }
        }
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v
    
    @field_validator('first_name')
    @classmethod
    def validate_first_name(cls, v):
        if not (2 <= len(v.strip()) <= 50):
            raise ValueError('First name must be 2-50 characters')
        return v.strip()
    
    @field_validator('last_name')
    @classmethod
    def validate_last_name(cls, v):
        if not (2 <= len(v.strip()) <= 50):
            raise ValueError('Last name must be 2-50 characters')
        return v.strip()


class UserLogin(BaseModel):
    """User login credentials schema."""
    
    email: EmailStr = Field(
        ..., 
        description="User's registered email address",
        example="john.doe@example.com"
    )
    password: str = Field(
        ..., 
        description="User's password",
        example="SecurePass123"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "email": "john.doe@example.com", 
                "password": "SecurePass123"
            }
        }


class UserProfile(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: Optional[date] = None
    languages: List[str] = ['English']
    bio: Optional[str] = ''
    place: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    email_notifications: Optional[bool] = True
    
    @field_validator('first_name')
    @classmethod
    def validate_first_name(cls, v):
        if not (2 <= len(v.strip()) <= 50):
            raise ValueError('First name must be 2-50 characters')
        return v.strip()
    
    @field_validator('last_name')
    @classmethod
    def validate_last_name(cls, v):
        if not (2 <= len(v.strip()) <= 50):
            raise ValueError('Last name must be 2-50 characters')
        return v.strip()
    
    @field_validator('bio')
    @classmethod
    def validate_bio(cls, v):
        if v and len(v) > 200:
            raise ValueError('Bio must not exceed 200 characters')
        return v or ''
    
    @field_validator('date_of_birth')
    @classmethod
    def validate_age(cls, v):
        if v and v > date.today().replace(year=date.today().year - 13):
            raise ValueError('User must be at least 13 years old')
        return v


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: uuid.UUID
    email: str
    first_name: str
    last_name: str
    profile_picture: Optional[str] = None
    bio: str
    languages: List[str]
    place: Optional[str] = None
    state: Optional[str] = None
    follower_count: int = 0
    following_count: int = 0
    post_count: int = 0
    is_following: bool = False
    created_at: datetime


class UserListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: uuid.UUID
    first_name: str
    last_name: str
    profile_picture: Optional[str] = None
    bio: str
    place: Optional[str] = None
    state: Optional[str] = None
    is_following: bool = False


class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str
    
    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v
