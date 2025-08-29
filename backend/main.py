from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Bhasa Con API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Bhasa Con API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "bhasa-con-api"}

# Additional endpoints will be added here
@app.get("/api/posts")
def get_posts():
    return {"posts": [], "message": "Posts endpoint working"}

@app.get("/api/auth/profile")
def get_profile():
    return {"user": None, "message": "Auth endpoint working"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)