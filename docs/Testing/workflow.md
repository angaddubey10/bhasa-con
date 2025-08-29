# Docker Simplification for Local Development Workflow

## Plan

### Analysis
Current Docker setup is overly complex for local development with:
- Environment variable substitutions and profiles
- Multiple .env files and helper scripts
- Multi-stage Dockerfiles with dev/prod targets
- Complex service configurations with conditionals

**Goal:** Simplify to a single, straightforward docker-compose.yml for local development only.

### Tasks

- [x] **Analyze Current Configuration**: Reviewed existing Docker setup complexity
  
- [x] **Simplify docker-compose.yml**: Removed all environment variables, profiles, and complex configurations
  - Used hardcoded development-friendly values ✓
  - Removed profiles and conditional service definitions ✓
  - Simplified service configurations ✓
  
- [x] **Simplify Frontend Dockerfile**: Created single-stage development build
  - Removed multi-stage production build ✓
  - Focus on development with hot reload only ✓
  
- [x] **Keep Backend Dockerfile Simple**: Backend supports development workflow ✓
  
- [x] **Remove Environment Complexity**: Deleted all .env files and helper scripts
  - Removed `.env.development` and `.env.production` ✓
  - Removed `docker-run.sh` and `docker-run.bat` helper scripts ✓
  
- [x] **Test Simplified Setup**: Verified everything works with simple `docker compose up --build`
  - Test hot reload for both frontend and backend ✓
  - Verify database initialization and persistence ✓
  - Confirm service communication ✓
  
- [x] **Update Documentation**: Updated workflow documentation with results ✓

## Implementation Notes

Successfully simplified Docker configuration:

**Final Configuration:**
- Single `docker-compose.yml` with hardcoded development values
- PostgreSQL database with dev credentials (dev_user/dev_password)
- Backend with 24-hour token expiration, hot reload enabled
- Frontend with Vite dev server, hot reload, mounted source volumes
- Removed all environment variable complexity
- No profiles or conditional logic

**Services Running:**
- Database: localhost:5432 (PostgreSQL)
- Backend: localhost:8000 (FastAPI with hot reload)
- Frontend: localhost:3000 (Vite dev server with hot reload)

**Command to start:** `docker compose up --build`

## Review

✅ **Successfully completed Docker simplification for local development**
- Configuration is now straightforward and easy to understand
- All services start with a single command
- Hot reload works for both frontend and backend
- Database initializes properly and persists data
- No environment variable confusion or complex scripts
- Perfect for local development workflow

- [x] **Fix Register Page Display**: Created complete registration form with proper validation and backend integration

- [x] **Fix API Routes**: Corrected frontend API endpoints to include `/api` prefix to match backend routes
  - Login: `/auth/login` → `/api/auth/login`
  - Register: `/auth/register` → `/api/auth/register`
  - Profile: `/auth/me` → `/api/auth/me`
  - Posts: `/posts` → `/api/posts`
  - Users: `/users` → `/api/users`

- [ ] **Test Changes**: Ensure login functionality works end-to-end

- [ ] **Update Error Handling**: Ensure proper error messages are displayed

- [x] **Update Container Names**: Change container names from `bhasaconnect` to `bhcon`
  - Update db service: `bhasaconnect_db` → `bhcon_db` ✓
  - Update backend service: `bhasaconnect_backend` → `bhcon_backend` ✓
  - Update frontend service: `bhasaconnect_frontend` → `bhcon_frontend` ✓

- [x] **Abbreviate Container Names**: Further shorten container names for better usability
  - Update backend service: `bhcon_backend` → `bhcon_be` ✓
  - Update frontend service: `bhcon_frontend` → `bhcon_fe` ✓
  - Keep database service: `bhcon_db` (already concise) ✓

## Implementation Notes

### Current State
- Backend uses JWT tokens returned as `access_token`
- Backend `/auth/me` endpoint provides full user profile
- Frontend expects combined response with user data
- No refresh token implementation in backend

### Recommended Approach
Update frontend to match backend API format by:
1. Making login API call to get token
2. Making profile API call to get user data
3. Storing both pieces of information

### Container Name Update (August 29, 2025)
Successfully updated container names in docker-compose.yml:
- `bhasaconnect_db` → `bhcon_db`
- `bhasaconnect_backend` → `bhcon_be` (via bhcon_backend)
- `bhasaconnect_frontend` → `bhcon_fe` (via bhcon_frontend)

Final container names for maximum brevity:
- Database: `bhcon_db`
- Backend: `bhcon_be`
- Frontend: `bhcon_fe`

Database name `bhasaconnect_dev` intentionally kept unchanged as it doesn't need to match container names.

## Decisions

- **Decision**: Update frontend to align with backend API rather than changing backend
- **Reasoning**: Backend API structure is cleaner and follows REST conventions

## Review

*To be updated after implementation*
