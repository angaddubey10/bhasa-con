# BhasaConnect - Design Document (V0.1)

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Database Design](#database-design)
3. [API Design](#api-design)
4. [Frontend Architecture](#frontend-architecture)
5. [Authentication & Security](#authentication--security)
6. [File Upload & Storage](#file-upload--storage)
7. [UI/UX Design Guidelines](#uiux-design-guidelines)
8. [Performance Considerations](#performance-considerations)
9. [Deployment Strategy](#deployment-strategy)
10. [Testing Strategy](#testing-strategy)

## System Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React Web     │◄──►│   FastAPI       │◄──►│   PostgreSQL    │
│   Application   │    │   Backend       │    │   Database      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │                 │
                       │   Cloudinary    │
                       │   Image Storage │
                       │                 │
                       └─────────────────┘
```

### Technology Stack Details

#### Backend (FastAPI + Python)
- **Framework**: FastAPI 0.100+
- **Python Version**: 3.11+
- **Key Libraries**:
  - `sqlalchemy` - Database ORM
  - `alembic` - Database migrations
  - `pydantic` - Data validation and serialization
  - `python-jose` - JWT token handling
  - `passlib` - Password hashing
  - `cloudinary` - Image upload and management
  - `python-multipart` - File upload support
  - `asyncpg` - Async PostgreSQL driver

#### Frontend (React)
- **Framework**: React 18+
- **Build Tool**: Vite
- **Key Libraries**:
  - `react-router-dom` - Client-side routing
  - `axios` - HTTP client
  - `react-query` - Server state management
  - `react-hook-form` - Form handling
  - `tailwindcss` - Styling framework
  - `lucide-react` - Icon library
  - `react-hot-toast` - Notifications

#### Database
- **Primary Database**: PostgreSQL 15+
- **Connection Pooling**: Built-in FastAPI async support
- **Migrations**: Alembic

## Database Design

### Entity Relationship Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     users       │    │      posts      │    │     likes       │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ email           │    │ user_id (FK)    │    │ user_id (FK)    │
│ password_hash   │    │ content         │    │ post_id (FK)    │
│ first_name      │    │ language        │    │ created_at      │
│ last_name       │    │ image_url       │    └─────────────────┘
│ date_of_birth   │    │ created_at      │
│ languages       │    │ updated_at      │
│ bio             │    │ is_deleted      │
│ profile_picture │    └─────────────────┘
│ place           │
│ district        │    ┌─────────────────┐
│ state           │    │    follows      │
│ email_notif     │    ├─────────────────┤
│ created_at      │    │ id (PK)         │
│ updated_at      │    │ follower_id (FK)│
└─────────────────┘    │ following_id(FK)│
                       │ created_at      │
                       └─────────────────┘
```

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    languages TEXT[] DEFAULT ARRAY['English'], -- Array of language preferences
    bio TEXT DEFAULT '',
    profile_picture TEXT DEFAULT NULL,
    place VARCHAR(100) DEFAULT NULL,
    district VARCHAR(100) DEFAULT NULL,
    state VARCHAR(100) DEFAULT NULL,
    email_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_first_name_length CHECK (LENGTH(first_name) BETWEEN 2 AND 50),
    CONSTRAINT users_last_name_length CHECK (LENGTH(last_name) BETWEEN 2 AND 50),
    CONSTRAINT users_bio_length CHECK (LENGTH(bio) <= 200),
    CONSTRAINT users_age_check CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '13 years')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_name ON users(first_name, last_name);
```

#### Posts Table
```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    language VARCHAR(20) NOT NULL DEFAULT 'English',
    image_url TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    
    CONSTRAINT posts_content_length CHECK (LENGTH(content) BETWEEN 1 AND 500),
    CONSTRAINT posts_language_check CHECK (language IN ('English', 'Hindi')),
    CONSTRAINT posts_content_or_image CHECK (LENGTH(content) > 0 OR image_url IS NOT NULL)
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_not_deleted ON posts(is_deleted) WHERE is_deleted = FALSE;
```

#### Follows Table
```sql
CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT follows_no_self_follow CHECK (follower_id != following_id),
    UNIQUE(follower_id, following_id)
);

CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
```

#### Likes Table
```sql
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, post_id)
);

CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);
```

## API Design

### Authentication Endpoints
```python
# Authentication Routes
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### User Management Endpoints
```python
# User Profile Routes
GET    /api/users/profile
PUT    /api/users/profile
PUT    /api/users/password
POST   /api/users/upload-avatar
GET    /api/users/search?q={query}&page={page}&limit={limit}
GET    /api/users/{user_id}
POST   /api/users/{user_id}/follow
DELETE /api/users/{user_id}/follow
```

### Posts Endpoints
```python
# Posts Routes
GET    /api/posts?page={page}&limit={limit}
POST   /api/posts
GET    /api/posts/{post_id}
DELETE /api/posts/{post_id}
POST   /api/posts/{post_id}/like
DELETE /api/posts/{post_id}/like
GET    /api/posts/user/{user_id}?page={page}&limit={limit}
```

### API Response Format
```python
# Success Response
{
    "success": true,
    "data": {...},
    "message": "Optional success message"
}

# Error Response
{
    "success": false,
    "error": "Error message",
    "details": {...}  # Optional validation details
}

# Paginated Response
{
    "success": true,
    "data": {
        "items": [...],
        "page": 1,
        "limit": 20,
        "total": 150,
        "has_next": true
    }
}
```

### Pydantic Models

#### User Models
```python
from pydantic import BaseModel, EmailStr, validator
from typing import List, Optional
from datetime import date

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain digit')
        return v

class UserProfile(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    languages: List[str] = ['English']
    bio: Optional[str] = ''
    place: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    
class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    profile_picture: Optional[str]
    bio: str
    languages: List[str]
    place: Optional[str]
    state: Optional[str]
    follower_count: int
    following_count: int
    is_following: bool = False
```

#### Post Models
```python
class PostCreate(BaseModel):
    content: str
    language: str = 'English'
    image_url: Optional[str] = None
    
    @validator('content')
    def validate_content(cls, v):
        if not (1 <= len(v.strip()) <= 500):
            raise ValueError('Content must be 1-500 characters')
        return v.strip()

class PostResponse(BaseModel):
    id: str
    user: UserResponse
    content: str
    language: str
    image_url: Optional[str]
    like_count: int
    is_liked: bool
    created_at: datetime
```

## Frontend Architecture

### Project Structure
```
bhasa-con/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── ErrorBoundary.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── AuthLayout.jsx
│   │   │   ├── profile/
│   │   │   │   ├── ProfileCard.jsx
│   │   │   │   ├── EditProfileForm.jsx
│   │   │   │   └── ProfilePicture.jsx
│   │   │   ├── posts/
│   │   │   │   ├── PostCard.jsx
│   │   │   │   ├── CreatePostForm.jsx
│   │   │   │   ├── PostList.jsx
│   │   │   │   └── ImageUpload.jsx
│   │   │   └── users/
│   │   │       ├── UserCard.jsx
│   │   │       ├── UserSearch.jsx
│   │   │       └── UserList.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── FeedPage.jsx
│   │   │   ├── DiscoveryPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── usePosts.js
│   │   │   ├── useUsers.js
│   │   │   └── useImageUpload.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   └── storage.js
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   ├── validation.js
│   │   │   ├── formatting.js
│   │   │   └── constants.js
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── components.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── post.py
│   │   │   ├── follow.py
│   │   │   └── like.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── post.py
│   │   │   └── auth.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   └── posts.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── user.py
│   │   │   ├── post.py
│   │   │   └── upload.py
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── security.py
│   │       ├── dependencies.py
│   │       └── exceptions.py
│   ├── alembic/
│   │   ├── versions/
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_auth.py
│   │   ├── test_users.py
│   │   └── test_posts.py
│   ├── requirements.txt
│   ├── alembic.ini
│   └── .env
└── railway.json
```

### State Management Strategy
- **Authentication State**: React Context + localStorage
- **Server State**: React Query for API calls
- **Form State**: React Hook Form
- **UI State**: Component-level useState/useReducer

### Key Custom Hooks
```javascript
// useAuth.js
export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const login = async (credentials) => {
        // Login implementation
    };
    
    const logout = () => {
        // Logout implementation
    };
    
    return { user, login, logout, loading };
};

// usePosts.js
export const usePosts = (page = 1) => {
    return useQuery({
        queryKey: ['posts', page],
        queryFn: () => fetchPosts(page),
        keepPreviousData: true
    });
};
```

## Authentication & Security

### JWT Token Structure
```javascript
{
    "user_id": "uuid",
    "email": "user@example.com",
    "exp": 1234567890,
    "iat": 1234567890
}
```

### Security Measures
1. **Password Hashing**: bcrypt with salt rounds = 12
2. **JWT Secret**: Environment variable, rotated regularly
3. **CORS**: Configured for specific origins only
4. **Rate Limiting**: 100 requests per minute per IP
5. **Input Validation**: Pydantic models + frontend validation
6. **SQL Injection Prevention**: SQLAlchemy ORM with parameterized queries
7. **File Upload Security**: File type validation, size limits, virus scanning

### Frontend Security
```javascript
// API interceptor for token management
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-logout on token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

## File Upload & Storage

### Cloudinary Configuration
```python
import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

async def upload_image(file, folder="bhasaconnect"):
    """Upload image to Cloudinary with transformations"""
    result = cloudinary.uploader.upload(
        file,
        folder=folder,
        transformation=[
            {"width": 1200, "crop": "limit"},
            {"quality": "auto"},
            {"format": "auto"}
        ]
    )
    return result["secure_url"]
```

### Image Upload Flow
1. **Frontend**: User selects image → validate file type/size → show preview
2. **Upload**: Send to backend endpoint with multipart/form-data
3. **Backend**: Validate file → upload to Cloudinary → return URL
4. **Database**: Store Cloudinary URL in database
5. **Display**: Load images from Cloudinary CDN

## UI/UX Design Guidelines

### Design System
- **Colors**: 
  - Primary: Blue (#3B82F6)
  - Secondary: Gray (#6B7280)
  - Success: Green (#10B981)
  - Error: Red (#EF4444)
  - Background: White (#FFFFFF)
  - Surface: Light Gray (#F9FAFB)

### Typography
- **Headings**: Inter font family, bold weights
- **Body**: Inter font family, regular weight
- **Code**: Fira Code for technical content

### Component Guidelines
- **Buttons**: Consistent padding, hover states, loading states
- **Forms**: Clear labels, inline validation, error states
- **Cards**: Subtle shadows, rounded corners, consistent spacing
- **Navigation**: Clear hierarchy, breadcrumbs where needed

### Responsive Design
- **Mobile First**: Start with mobile layout, enhance for desktop
- **Breakpoints**: 
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px

### Accessibility
- **Semantic HTML**: Use proper HTML elements
- **ARIA Labels**: For interactive elements
- **Color Contrast**: WCAG AA compliance
- **Keyboard Navigation**: All functionality accessible via keyboard
- **Screen Reader**: Proper alt text for images

## Performance Considerations

### Backend Optimization
1. **Database Indexing**: Strategic indexes on frequently queried columns
2. **Query Optimization**: Use joins instead of N+1 queries
3. **Pagination**: Limit results to prevent memory issues
4. **Caching**: Redis for frequently accessed data
5. **Connection Pooling**: Async database connections
6. **Background Tasks**: Celery for heavy operations

### Frontend Optimization
1. **Code Splitting**: Dynamic imports for route-based splitting
2. **Image Optimization**: Lazy loading, WebP format, responsive images
3. **Bundle Size**: Tree shaking, analyze bundle with webpack-bundle-analyzer
4. **Caching**: HTTP caching headers, service worker for offline support
5. **Virtual Scrolling**: For large lists (posts feed)

### Database Queries
```sql
-- Optimized feed query
SELECT DISTINCT p.*, u.first_name, u.last_name, u.profile_picture,
       (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) as like_count,
       EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = $1) as is_liked
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN follows f ON f.following_id = p.user_id
WHERE (f.follower_id = $1 OR p.user_id = $1) 
  AND p.is_deleted = FALSE
ORDER BY p.created_at DESC
LIMIT $2 OFFSET $3;
```

## Deployment Strategy

### Railway Deployment Configuration

#### Project Structure for Railway
Both frontend and backend will be deployed as separate services on Railway, with shared PostgreSQL database.

#### Backend Railway Configuration
```json
{
  "name": "bhasaconnect-backend",
  "build": {
    "builder": "nixpacks",
    "buildCommand": "pip install -r requirements.txt"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300
  }
}
```

#### Frontend Railway Configuration
```json
{
  "name": "bhasaconnect-frontend",
  "build": {
    "builder": "nixpacks",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "npm run preview -- --host 0.0.0.0 --port $PORT"
  }
}
```

#### Railway Environment Variables

**Backend Service:**
```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CORS_ORIGINS=https://your-frontend-domain.railway.app
ENVIRONMENT=production
```

**Frontend Service:**
```
VITE_API_URL=https://your-backend-domain.railway.app
VITE_ENVIRONMENT=production
```

#### Railway Database
Railway provides managed PostgreSQL with automatic backups:
- **Database**: PostgreSQL 15
- **Backups**: Automatic daily backups
- **Connection**: Provided via DATABASE_URL environment variable
- **Monitoring**: Built-in database metrics

### Deployment Files

#### Backend Requirements File
```python
# backend/requirements.txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
alembic==1.12.1
asyncpg==0.29.0
pydantic==2.5.0
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
cloudinary==1.36.0
python-dotenv==1.0.0
pytest==7.4.3
httpx==0.25.2
```

#### Frontend Package Configuration
```json
// frontend/package.json
{
  "name": "bhasaconnect-frontend",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.18.0",
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.8.4",
    "react-hook-form": "^7.47.0",
    "@hookform/resolvers": "^3.3.2",
    "yup": "^1.3.3",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.292.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.1.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "vite": "^4.5.0",
    "vitest": "^0.34.6"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### Root Railway Configuration
```json
{
  "services": [
    {
      "name": "backend",
      "source": {
        "repo": "your-username/bhasa-con",
        "rootDirectory": "/backend"
      },
      "variables": {
        "PORT": "8000"
      }
    },
    {
      "name": "frontend", 
      "source": {
        "repo": "your-username/bhasa-con",
        "rootDirectory": "/frontend"
      },
      "variables": {
        "PORT": "3000"
      }
    }
  ]
}
```

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Railway
on:
  push:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run backend tests
        run: |
          cd backend
          python -m pytest tests/ -v

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      - name: Run frontend tests
        run: |
          cd frontend
          npm test
      - name: Build frontend
        run: |
          cd frontend
          npm run build

  deploy:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Railway
        run: |
          # Railway automatically deploys when code is pushed to main
          echo "Railway auto-deployment triggered"
```

### Local Development Setup
```bash
# Clone repository
git clone https://github.com/your-username/bhasa-con.git
cd bhasa-con

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.template .env  # Configure environment variables (see docs/EnvironmentSetup.md)
alembic upgrade head
uvicorn app.main:app --reload

# Frontend setup (in new terminal)
cd frontend
npm install
cp .env.template .env  # Configure environment variables (see docs/EnvironmentSetup.md)
npm run dev
```

## Testing Strategy

### Backend Testing
```python
# test_auth.py
import pytest
from fastapi.testclient import TestClient

def test_user_registration(client: TestClient):
    response = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "Password123",
        "first_name": "Test",
        "last_name": "User"
    })
    assert response.status_code == 201
    assert response.json()["success"] == True

def test_user_login(client: TestClient, test_user):
    response = client.post("/api/auth/login", json={
        "email": test_user.email,
        "password": "Password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()["data"]
```

### Frontend Testing
```javascript
// __tests__/components/PostCard.test.jsx
import { render, screen } from '@testing-library/react';
import { PostCard } from '../components/posts/PostCard';

test('renders post content', () => {
    const post = {
        id: '1',
        content: 'Test post content',
        user: { first_name: 'John', last_name: 'Doe' },
        like_count: 5,
        is_liked: false
    };
    
    render(<PostCard post={post} />);
    expect(screen.getByText('Test post content')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### Testing Coverage
- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints with database
- **E2E Tests**: Critical user flows (login, post creation, feed)
- **Performance Tests**: Load testing for API endpoints
- **Security Tests**: SQL injection, XSS, authentication bypass

## Monitoring & Analytics

### Application Monitoring
- **Backend**: FastAPI built-in metrics + Sentry for error tracking
- **Frontend**: React Error Boundary + user analytics
- **Database**: PostgreSQL query performance monitoring
- **Infrastructure**: Server resource monitoring

### Key Metrics to Track
1. **User Engagement**:
   - Daily/Monthly Active Users
   - Post creation rate
   - Like/follow activity
   
2. **Performance**:
   - API response times
   - Page load times
   - Database query performance
   
3. **Business**:
   - User registration rate
   - User retention rate
   - Feature usage statistics

This design document provides a comprehensive blueprint for implementing BhasaConnect V0.1 according to the specifications. Each section can be expanded with more detailed implementation guidelines as development progresses.