import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException
import os
from typing import Optional

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)


async def upload_image(file: UploadFile, folder: str = "bhasaconnect") -> str:
    """Upload image to Cloudinary and return URL"""
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only JPEG, PNG, and WebP are allowed."
            )
        
        # Validate file size (5MB limit)
        file_size = 0
        content = await file.read()
        file_size = len(content)
        
        if file_size > 5 * 1024 * 1024:  # 5MB in bytes
            raise HTTPException(
                status_code=400,
                detail="File size too large. Maximum 5MB allowed."
            )
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            content,
            folder=folder,
            transformation=[
                {"width": 1200, "crop": "limit"},
                {"quality": "auto"},
                {"format": "auto"}
            ]
        )
        
        return result["secure_url"]
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500,
            detail="Failed to upload image"
        )


async def upload_profile_picture(file: UploadFile) -> str:
    """Upload profile picture with specific transformations"""
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only JPEG, PNG, and WebP are allowed."
            )
        
        # Validate file size (2MB limit for profile pictures)
        content = await file.read()
        file_size = len(content)
        
        if file_size > 2 * 1024 * 1024:  # 2MB in bytes
            raise HTTPException(
                status_code=400,
                detail="File size too large. Maximum 2MB allowed for profile pictures."
            )
        
        # Upload to Cloudinary with profile-specific transformations
        result = cloudinary.uploader.upload(
            content,
            folder="bhasaconnect/profiles",
            transformation=[
                {"width": 400, "height": 400, "crop": "fill", "gravity": "face"},
                {"quality": "auto"},
                {"format": "auto"}
            ]
        )
        
        return result["secure_url"]
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500,
            detail="Failed to upload profile picture"
        )
