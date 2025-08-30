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

**SUCCESS! Authentication now properly configured in Swagger UI**

**Changes Made:**
1. Updated `backend/app/main.py` to include custom OpenAPI schema with bearerAuth security scheme
2. Added HTTPBearer import and security configuration
3. Created custom_openapi() function to properly define security schemes in OpenAPI documentation
4. Updated `backend/app/utils/dependencies.py` with better security scheme configuration

**Results:**
- ✅ "Authorize" button now visible in Swagger UI
- ✅ Protected endpoints properly show `"security":[{"bearerAuth":[]}]` in OpenAPI JSON
- ✅ JWT Bearer token authentication scheme properly documented
- ✅ Users can now test protected endpoints through Swagger interface

**Minor Issue Found**: Some endpoints use "HTTPBearer" while others use "bearerAuth" - should be standardized

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
