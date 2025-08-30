# Deploy Branch Workflow

## Current Issue: CORS Errors in Production

### Analysis
- Frontend is getting CORS errors when trying to access backend API
- Error shows: "Access to fetch at backend URL from origin frontend URL has been blocked by CORS policy"
- No 'Access-Control-Allow-Origin' header is present on the requested resource

### Plan
- [x] Check current CORS configuration in FastAPI backend
- [x] Verify production environment variables and origins
- [x] Update CORS settings for Railway deployment URLs
- [x] Fix hardcoded CORS origins in backend code
- [x] Fix hardcoded API URL in frontend code
- [x] Update nixpacks.toml with correct CORS origins
- [ ] Test the fix

### Implementation Notes
Working on CORS configuration for production deployment.

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
