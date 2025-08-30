# Deploy Branch Workflow

## Current Issue: Missing Authentication in Swagger Documentation

### Analysis
- Protected endpoints are not showing proper authentication requirements in Swagger UI
- HTTPBearer security scheme is defined in dependencies but not registered with FastAPI OpenAPI
- Users can't test protected endpoints through Swagger docs interface
- Missing "Authorize" button in Swagger UI

## Previous Issue: CORS Errors in Production - RESOLVED

### Analysis
- Frontend is getting CORS errors when trying to access backend API
- Error shows: "Access to fetch at backend URL from origin frontend URL has been blocked by CORS policy"
- No 'Access-Control-Allow-Origin' header is present on the requested resource

### Plan
- [x] Add HTTPBearer security scheme to FastAPI OpenAPI configuration
- [x] Update main.py to include security definitions
- [x] Test Swagger documentation shows "Authorize" button
- [x] Verify protected endpoints show lock icons
- [ ] Standardize security scheme names (HTTPBearer vs bearerAuth)
- [ ] Test authentication through Swagger interface

### Implementation Notes
Working on Swagger authentication documentation.

**CRITICAL ISSUE FOUND: Production router loading failure (unrelated to authentication)**

**Root Cause Analysis:**
- Even with NO custom OpenAPI configuration, production only shows 4/20+ endpoints
- This indicates a fundamental router loading failure in production environment
- Issue exists in the base deployment, not related to authentication changes

**Current Production Issues:**
1. Only 4 endpoints loading: `/`, `/health`, `/api/posts` (partial), `/api/auth/profile` (partial)
2. Missing all other authentication endpoints: register, login, me, logout
3. Missing all user endpoints: profile CRUD, follow/unfollow, search, avatar upload
4. Missing most post endpoints: CRUD, like/unlike, image upload

**Likely Causes:**
- Import dependency failure in production environment
- Missing packages or environment variables preventing router initialization
- Silent exception during router loading that doesn't crash the app

**Next Steps:**
- Add debug logging to router loading
- Check production logs for import errors
- Verify all dependencies are available in production environment

**Changes Made:**
1. Fixed `backend/app/main.py` to properly read CORS_ORIGINS from environment variables instead of hardcoding `["*"]`
2. Added better debug logging to help troubleshoot CORS issues
3. Fixed `frontend/src/utils/index.ts` to use VITE_API_URL environment variable instead of hardcoded URL
4. Updated `backend/nixpacks.toml` to include multiple CORS origins including localhost for development
5. Environment variable CORS_ORIGINS now includes both production and development URLs

**Root Cause Found:** 
1. Backend was hardcoding CORS origins as `["*"]` instead of reading from environment variables
2. Frontend was hardcoding the backend API URL instead of using environment variables
3. Missing localhost origins in CORS configuration for development testing

### Tasks
- [x] Review current CORS setup in backend/app/main.py
- [x] Check if Railway production URLs are included in allowed origins
- [x] Update CORS configuration if needed
- [x] Push changes to trigger redeployment
- [ ] Validate fix works in production

### Review
TBD

### Decisions
TBD
