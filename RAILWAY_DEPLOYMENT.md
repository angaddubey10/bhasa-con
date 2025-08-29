# BhasaConnect - Railway Deployment Configuration

## Project Structure
```
bhasa-con/
├── frontend/          # React application
├── backend/           # FastAPI application  
├── railway.json       # Railway multi-service configuration
├── README.md          # Project documentation
└── .github/           # CI/CD workflows
```

## Railway Services

### Backend Service
- **Framework**: FastAPI
- **Database**: Railway PostgreSQL
- **File Storage**: Cloudinary
- **Port**: 8000

### Frontend Service  
- **Framework**: React + Vite
- **Build**: Static site generation
- **Port**: 3000

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CORS_ORIGINS=https://your-frontend-domain.railway.app
ENVIRONMENT=production
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-domain.railway.app
VITE_ENVIRONMENT=production
```

## Deployment Commands

### Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start server
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend
```bash
# Install dependencies
npm ci

# Build for production
npm run build

# Serve built files
npm run preview -- --host 0.0.0.0 --port $PORT
```

## Database Setup
Railway will automatically provision a PostgreSQL database. The connection URL will be provided via the `DATABASE_URL` environment variable.

## Custom Domains
Both services can be configured with custom domains through Railway dashboard:
- Backend: `api.yourdomain.com`
- Frontend: `yourdomain.com`