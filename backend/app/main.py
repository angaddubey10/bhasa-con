import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from app.database import engine, Base
from app.routers import auth, users, posts

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        # Create tables
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    await engine.dispose()

# Create FastAPI app
app = FastAPI(
    title="BhasaConnect API",
    description="A social media platform connecting users through multiple languages",
    version="0.1.0",
    lifespan=lifespan
)

# CORS Configuration
cors_origins = [
    "https://bhasa-con-production.up.railway.app",
    "https://bc-backend-production-7180.up.railway.app", 
    "http://localhost:3000",
    "http://localhost:8000",
    "https://*.railway.app", # Allow all Railway subdomains    
]

# Add some debug logging for CORS configuration
print(f"CORS Origins configured: {cors_origins}")
print(f"CORS_ORIGINS environment variable: {os.getenv('CORS_ORIGINS')}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "bhasaconnect-backend"}

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(posts.router, prefix="/api/posts", tags=["Posts"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
