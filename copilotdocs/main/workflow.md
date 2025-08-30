# Comment Feature Implementation Workflow

## Plan

### Overview
Implement a comment system for posts where users can:
- Add comments to posts
- View comments with user details (mil id)
- Delete their own comments
- Post owners can delete any comment on their posts

### Backend Components to Implement

#### 1. Database Model (Comment)
- [ ] Create Comment model with fields:
  - id (UUID, primary key)
  - post_id (foreign key to posts)
  - user_id (foreign key to users)
  - content (text)
  - created_at (timestamp)
  - updated_at (timestamp)
  - is_deleted (boolean, soft delete)

#### 2. Database Migration
- [ ] Create Alembic migration for comment table
- [ ] Update Post model to include comments relationship
- [ ] Run migration to create table

#### 3. Pydantic Schemas
- [ ] Create CommentCreate schema
- [ ] Create CommentResponse schema
- [ ] Update PostResponse to include comment_count
- [ ] Create CommentListResponse schema

#### 4. Service Layer
- [ ] Create comment service functions:
  - create_comment()
  - get_comments_by_post()
  - delete_comment()
  - get_comment_by_id()

#### 5. API Routes
- [ ] POST /posts/{post_id}/comments - Create comment
- [ ] GET /posts/{post_id}/comments - Get comments for a post
- [ ] DELETE /comments/{comment_id} - Delete comment

#### 6. Authorization Logic
- [ ] User can delete their own comment
- [ ] Post owner can delete any comment on their post
- [ ] Update post responses to include comment count

### Frontend Components to Update (Future)
- [ ] Comment section UI component
- [ ] Comment form component
- [ ] Comment list component
- [ ] Delete comment functionality

### Testing
- [ ] Unit tests for comment service
- [ ] Integration tests for comment APIs
- [ ] Test authorization rules
- [ ] Test edge cases

### Security Considerations
- [ ] Validate comment content length
- [ ] Sanitize comment input
- [ ] Proper authorization checks
- [ ] Rate limiting for comment creation

## Implementation Notes

### Database Schema
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);
```

### API Response Structure
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "uuid",
        "user": {
          "id": "uuid",
          "first_name": "string",
          "last_name": "string",
          "profile_picture": "string"
        },
        "content": "string",
        "created_at": "datetime",
        "can_delete": boolean
      }
    ],
    "total": number
  }
}
```

## Tasks

### Phase 1: Database and Models
- [x] Create Comment model
- [x] Create Alembic migration
- [x] Update Post model relationships
- [x] Run migration

### Phase 2: Schemas and Validation
- [x] Create CommentCreate schema
- [x] Create CommentResponse schema
- [x] Update PostResponse schema

### Phase 3: Service Layer
- [x] Implement comment service functions
- [x] Add authorization logic
- [x] Handle error cases

### Phase 4: API Routes
- [x] Implement comment endpoints
- [x] Add proper error handling
- [x] Update post endpoints to include comment count

### Phase 5: Frontend Implementation
- [x] Create comments service
- [x] Create CommentForm component
- [x] Create CommentItem component
- [x] Create CommentsList component
- [x] Update PostCard to include comments
- [x] Add comment endpoints to constants
- [x] Implement real-time comment updates (optimistic UI)
- [x] Fix comment count updates without refresh

### Phase 6: UX Improvements
- [x] Clear comment text box after posting
- [x] Show new comments immediately without refresh
- [x] Update comment count in real-time
- [x] Add optimistic UI updates
- [x] Reset comment form when comment section opens (fresh start each time)
- [x] Implement ref-based form reset to fix text clearing issues

### Phase 7: Testing
- [x] Manual testing of comment functionality
- [x] Authentication integration testing
- [x] Text box clearing verification (both on open and after submit)
- [ ] Write unit tests (future)
- [ ] Write integration tests (future)

## Review

### Completed Tasks
1. **Database Layer**: Created Comment model with UUID, foreign keys, soft delete capability
2. **Backend Services**: Implemented comment CRUD operations with proper authorization
3. **API Layer**: Created REST endpoints for comment operations with authentication
4. **Frontend Components**: Built reusable comment components with real-time updates
5. **UX Enhancements**: Implemented proper form clearing and optimistic UI updates

### Final Implementation Status
✅ **Comment Creation**: Users can successfully create comments on posts
✅ **Comment Display**: Comments show immediately with user details
✅ **Comment Deletion**: Both comment owners and post owners can delete comments
✅ **Real-time Updates**: Comment counts and lists update without page refresh
✅ **Form UX**: Text box clears properly both when opening comments and after submission
✅ **Authentication**: All comment operations properly check user authentication

### Technical Solution Summary
- **Text Box Clearing Issue**: Resolved by implementing `forwardRef` and `useImperativeHandle` pattern
- **Form Reset Strategy**: Uses ref-based reset method to clear form both on comment section open and after successful submission
- **Component Architecture**: Clean separation between CommentForm (form handling), CommentsList (container), and CommentItem (display)
- **State Management**: Optimistic UI updates with fallback to server refresh for error cases

### Remaining Issues
None identified - comment functionality is complete and working as requested.

## Decisions

### Technical Decisions
1. **Soft Delete**: Using is_deleted flag for comments to maintain data integrity
2. **Authorization**: Both comment owner and post owner can delete comments
3. **Pagination**: Comments will be paginated for performance (future enhancement)
4. **Validation**: Comment content limited to 500 characters

### UX Decisions
1. **Form Reset**: Text box clears both when opening comments section and after posting
2. **Optimistic Updates**: New comments appear immediately for better user experience
3. **Error Handling**: Graceful fallback to server refresh if optimistic update fails
4. **Real-time Counts**: Comment counts update immediately without requiring page refresh

### Architecture Decisions
1. Following existing patterns in the codebase
2. Using same UUID approach as other models
3. Maintaining consistency with existing API response format
4. Using FastAPI dependency injection for current user
5. Implementing React forwardRef pattern for imperative form control