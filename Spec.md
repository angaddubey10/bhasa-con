# BhasaConnect - Specification Document (V0.1)

## Overview
BhasaConnect is a multi-language social platform enabling users to create and share content in their preferred languages while connecting with others. This is a **V0 MVP** focusing on core functionality.

## MVP Scope
- Text posts with optional images in multiple languages
- Basic user profiles with profile pictures
- Simple follow/unfollow system
- Basic feed with likes
- No comments or advanced features

## 1. User Onboarding & Authentication

### Authentication Method
- Basic authentication using Email + Password

### Required Fields
- **Email**: `string` - User's email address
- **Password**: `string` - User's password
- **First Name**: `string` - User's first name
- **Last Name**: `string` - User's last name

### Password Requirements
- Minimum 8 characters
- Must contain at least one uppercase letter, one lowercase letter, and one number
- Special characters allowed but not required

### Registration Flow
1. User submits registration form with required fields
2. System validates input and checks for existing email
3. User account created and activated immediately
4. User automatically logged in and redirected to feed

### Login Flow
1. User submits email and password
2. System validates credentials
3. On success: Generate JWT session token and redirect to feed
4. On failure: Show appropriate error message

### Session Management
- **JWT Token**: Valid for 24 hours
- **Auto-logout**: On token expiration
- **Logout**: Clear token and redirect to login page

## 2. User Profile

### Profile Fields
- **First Name**: `string` - User's first name
- **Last Name**: `string` - User's last name
- **Date of Birth**: `date` - User's date of birth
- **Language Preference**: `array` - Up to 2 languages (Hindi and English)
- **Bio**: `string` - User description (max 200 characters)
- **Profile Picture**: `string` - Image URL (optional)

### Demographic Information
- **Place**: `string` - User's city/town (optional)
- **District**: `string` - User's district (optional)
- **State**: `string` - User's state (optional)

### Profile Management
- **Edit Profile**: Users can update all profile fields except email
- **Change Password**: Separate form requiring current password + new password
- **Profile Picture Upload**: 
  - Supported formats: JPG, PNG, GIF
  - Maximum file size: 5MB
  - Automatically resized to 400x400px
  - Default avatar: Generated initials-based avatar if no picture uploaded
- **Account Settings**: 
  - Language preference updates
  - Email notification preferences (on/off)
- **Profile Validation**:
  - Bio cannot exceed 200 characters
  - First name and last name required (2-50 characters each)
  - Date of birth must be valid date (users must be 13+ years old)

## 3. Content Creation (V0)

### Language Support
- Maximum 2 languages per user (Hindi and English)
- User can select which language to post in

### Features
- **Text posts**: Plain text content (max 500 characters)
- **Image posts**: Single image with optional text
- **Language selection**: Choose language for each post

### Image Storage
- **Storage**: Cloudinary (25GB free tier)
- **Database**: Store image URLs only

### Post Creation Flow
1. User clicks "Create Post" button
2. User selects post type (text or image)
3. If image post: User uploads image and adds optional text
4. If text post: User enters text content
5. User selects language for the post
6. User clicks "Post" to publish
7. Post appears in user's profile and followers' feeds

### Post Management
- **Delete Post**: Users can delete their own posts
  - Confirmation dialog required
  - Soft delete (mark as deleted, don't remove from database)
  - Remove from all feeds immediately
- **Post Visibility**: All posts are public (no privacy settings in V0)
- **Post Editing**: Not supported in V0

### Post Validation
- Text posts: 1-500 characters required
- Image posts: Image file required, text optional (max 500 characters)
- Supported image formats: JPG, PNG, GIF
- Maximum image size: 10MB
- Images automatically resized to max 1200px width, maintaining aspect ratio

## 4. Engagement & Social Layer (V0 - Simplified)

### Reaction Types
- **Like**: Standard like reaction only

### Social Connections
- **Follow**: Follow other users
- **Unfollow**: Unfollow users

## 5. User Discovery (V0 - Basic)

### Search Features
- **User Search**: Search users by first name or last name
- **Browse All Users**: Paginated list of all users (20 users per page)

### Discovery Filters (Optional)
- **By Location**: Filter users by place, district, or state
- **By Language**: Filter users by language preference (Hindi/English)

### User Directory Display
- Show profile picture, first name, last name
- Show location (place, state) if available
- Show language preferences
- Show follow/unfollow button
- Basic user card layout

### Search Functionality
- **Search Input**: Text search across first name + last name
- **Real-time Search**: Search results update as user types (minimum 2 characters)
- **No Results Handling**: Show "No users found" message when no matches

## 6. User Feed (V0 - Basic)

### Feed Content
- Display posts from followed users
- Show user's own posts
- Chronological order (newest first)
- **Simple pagination**: Load 20 posts at a time with "Load More" button

### Feed Features
- **Basic refresh**: Reload page to get new content
- **Like posts**: Click to like/unlike posts

### Default States
- **Empty Feed**: When user follows no one or followed users have no posts
  - Show "Welcome to BhasaConnect!" message
  - Display "Find People to Follow" button linking to user discovery
  - Show sample posts or trending content (optional)
- **No Posts Yet**: When user has created no posts
  - Show "Share your first post!" call-to-action
  - Display create post button prominently
- **Loading States**: Show skeleton loaders while content loads
- **Error States**: Show retry button if feed fails to load

## 7. Error Handling & Validation

### Authentication Errors
- **Invalid Email**: "Please enter a valid email address"
- **Email Already Exists**: "An account with this email already exists"
- **Weak Password**: "Password must be at least 8 characters with one uppercase, one lowercase, and one number"
- **Invalid Credentials**: "Invalid email or password"

### Profile Validation Errors
- **Required Fields**: "First name and last name are required"
- **Name Length**: "First name and last name must be between 2-50 characters"
- **Bio Too Long**: "Bio cannot exceed 200 characters"
- **Invalid Date**: "Please enter a valid date of birth"
- **Age Restriction**: "You must be at least 13 years old to use BhasaConnect"
- **Image Too Large**: "Profile picture must be under 5MB"
- **Unsupported Format**: "Please upload a JPG, PNG, or GIF image"
- **Upload Failed**: "Failed to upload image. Please try again"

### Post Creation Errors
- **Empty Content**: "Please enter some text or upload an image"
- **Text Too Long**: "Post text cannot exceed 500 characters"
- **Image Required**: "Please select an image to upload"
- **Image Too Large**: "Image must be under 10MB"
- **Upload Failed**: "Failed to upload image. Please try again"
- **Network Error**: "Failed to create post. Please check your connection and try again"

### Social Features Errors
- **Follow Yourself**: "You cannot follow yourself"
- **Already Following**: "You are already following this user"
- **Not Following**: "You are not following this user"
- **User Not Found**: "User not found"
- **Follow Limit**: "You can only follow up to 1000 users" (if implementing limits)

### General Errors
- **Network Error**: "Connection failed. Please check your internet and try again"
- **Server Error**: "Something went wrong. Please try again later"
- **Session Expired**: "Your session has expired. Please log in again"
- **Rate Limited**: "Too many requests. Please wait a moment before trying again"
- **Maintenance Mode**: "BhasaConnect is temporarily unavailable for maintenance"

### Success Messages
- **Registration**: "Account created successfully! Welcome to BhasaConnect"
- **Password Changed**: "Password updated successfully"
- **Profile Updated**: "Profile updated successfully"
- **Post Created**: "Post shared successfully!"
- **Post Deleted**: "Post deleted successfully"
- **User Followed**: "You are now following [User Name]"
- **User Unfollowed**: "You have unfollowed [User Name]"

## 8. Technology Stack

### Backend
- **Language**: Python
- **Framework**: FastAPI
- **Primary Database**: PostgreSQL

### Frontend
- **Web**: React
