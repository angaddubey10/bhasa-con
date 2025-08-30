# BhasaConnect - Railway Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Railway account: [railway.app](https://railway.app)
- GitHub repository with BhasaConnect code
- Cloudinary account for file uploads

### 5-Minute Deployment
1. **Create Railway Project**
   - Go to [Railway Dashboard](https://railway.app/dashboard) → "New Project" → "Deploy from GitHub repo"
   - Connect `angaddubey10/bhasa-con` repository

2. **Set Environment Variables** (in Railway Dashboard)
   ```bash
   SECRET_KEY=your-super-secret-jwt-key-at-least-32-characters
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

3. **Deploy & Verify**
   - Railway auto-detects services and deploys
   - Check: `https://your-backend-domain.railway.app/health`
   - Check: `https://your-frontend-domain.railway.app`

---

## 📋 Complete Deployment Guide

### Architecture Overview

```
Railway Project
├── postgres (PostgreSQL Database)
├── bhasaconnect-backend (FastAPI API)
└── bhasaconnect-frontend (React SPA)
```

### Configuration Files

#### 1. railway.json
Basic Railway project configuration:
```json
{
  "$schema": "https://railway.app/railway.schema.json"
}
```

Railway automatically detects services based on:
- Root directories with nixpacks.toml configurations
- Service dependencies defined in nixpacks.toml
- Environment variables set in Railway dashboard

#### 2. backend/nixpacks.toml
Backend service configuration with:
- Python 3.11 runtime optimization
- Automatic database migrations
- Health check configuration
- Build optimization with pip caching

#### 3. frontend/nixpacks.toml
Frontend service configuration with:
- Node.js 18 runtime
- Vite build optimization
- Static asset serving
- Development dependency pruning

### Environment Variables Setup

#### Required Variables (Set in Railway Dashboard)
```bash
# Authentication & Security
SECRET_KEY=your-super-secret-jwt-key-at-least-32-characters

# Cloudinary File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Auto-Generated Variables (Railway handles these)
```bash
# Database (auto-injected by Railway PostgreSQL service)
DATABASE_URL=postgresql://user:password@host:port/database

# Service Communication (auto-resolved by Railway)
FRONTEND_URL=https://your-frontend-domain.railway.app
VITE_API_URL=https://your-backend-domain.railway.app
CORS_ORIGINS=https://your-frontend-domain.railway.app,http://localhost:3000,http://localhost:5173

# Runtime Configuration (auto-injected by Railway)
PORT=8000  # Dynamic port assignment
```

#### Complete Environment Configuration

**Backend (.env)**
```bash
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CORS_ORIGINS=https://your-frontend-domain.railway.app
ENVIRONMENT=production
```

**Frontend (.env)**
```bash
VITE_API_URL=https://your-backend-domain.railway.app
VITE_ENVIRONMENT=production
```

### Detailed Deployment Process

#### Step 1: Initial Setup
```bash
# Install Railway CLI (optional)
npm install -g @railway/cli

# Login to Railway (if using CLI)
railway login
```

#### Step 2: Create Railway Project
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect and authorize your GitHub account
5. Select `angaddubey10/bhasa-con` repository

#### Step 3: Configure Services
Railway will automatically detect the `railway.json` configuration and create:
- **PostgreSQL Database** - Managed database service
- **Backend Service** - FastAPI application in `/backend` directory
- **Frontend Service** - React application in `/frontend` directory

#### Step 4: Set Environment Variables
In Railway Dashboard, for each service:

**Global Project Variables:**
- `SECRET_KEY` - Generate with: `openssl rand -hex 32`
- `CLOUDINARY_CLOUD_NAME` - From Cloudinary dashboard
- `CLOUDINARY_API_KEY` - From Cloudinary dashboard
- `CLOUDINARY_API_SECRET` - From Cloudinary dashboard

#### Step 5: Deploy
1. Railway automatically triggers deployment
2. Services deploy in order: Database → Backend → Frontend
3. Database migrations run automatically on backend startup
4. Health checks ensure services are running correctly

#### Step 6: Verify Deployment
Check these endpoints:
- **Backend Health**: `https://your-backend-domain.railway.app/health`
- **Frontend**: `https://your-frontend-domain.railway.app`
- **API Docs**: `https://your-backend-domain.railway.app/docs`

### Build Optimizations

#### Backend (nixpacks.toml)
- Python 3.11 runtime with optimized packages
- No-cache pip installations for smaller image
- Bytecode compilation for faster startup
- Automatic database migrations on deployment
- Health check configuration

#### Frontend (nixpacks.toml)
- Node.js 18 runtime
- Optimized npm installation and build
- Production build with Vite
- Static asset serving configuration
- Development dependencies pruning after build

### Deployment Commands

#### Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start server
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

#### Frontend
```bash
# Install dependencies
npm ci

# Build for production
npm run build

# Serve built files
npm run preview -- --host 0.0.0.0 --port $PORT
```

### Monitoring & Health Checks

#### Backend Health Check
- **Endpoint**: `GET /health`
- **Response**: `{"status": "healthy", "service": "bhasaconnect-backend"}`
- **Interval**: 30 seconds
- **Timeout**: 30 seconds

#### Frontend Health Check
- **Endpoint**: `GET /`
- **Interval**: 30 seconds
- **Timeout**: 30 seconds

## 🛠️ Setup Instructions

### Generating SECRET_KEY

```bash
# Option 1: Using OpenSSL
openssl rand -hex 32

# Option 2: Using Python
python -c "import secrets; print(secrets.token_hex(32))"

# Option 3: Online Generator
# Visit: https://generate-secret.vercel.app/32
```

### Cloudinary Setup

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy the credentials:
   - Cloud Name
   - API Key
   - API Secret

### Database Setup
Railway will automatically provision a PostgreSQL database. The connection URL will be provided via the `DATABASE_URL` environment variable.

### Custom Domains
Both services can be configured with custom domains through Railway dashboard:
- Backend: `api.yourdomain.com`
- Frontend: `yourdomain.com`

## 🔧 Troubleshooting

### Common Issues

**Service Won't Start**
- Check environment variables are set correctly
- Verify `SECRET_KEY` is at least 32 characters
- Ensure Cloudinary credentials are valid

**Database Connection Failed**
- Verify PostgreSQL service is running
- Check `DATABASE_URL` is properly injected
- Ensure backend service depends on postgres

**Database Connection Errors**
- Verify `DATABASE_URL` is properly injected
- Check postgres service is running
- Ensure backend service has postgres dependency

**CORS Errors**
- Check frontend can reach backend URL
- Verify CORS_ORIGINS includes frontend domain
- Confirm both services are in same Railway project
- Verify `CORS_ORIGINS` includes Railway frontend domain
- Check frontend and backend are on same Railway project
- Confirm environment variable injection is working

**Build Failures**
- Check `requirements.txt` and `package.json` are valid
- Review build logs in Railway dashboard
- Verify nixpacks.toml configurations are correct
- Check nixpacks.toml syntax
- Verify all dependencies in requirements.txt/package.json
- Review build logs in Railway dashboard

**Migration Errors**
- Check database connection is available during startup
- Verify alembic configuration is correct
- Review migration files for syntax errors

### Useful Railway CLI Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to project
railway link

# View logs
railway logs --service=bhasaconnect-backend
railway logs --service=bhasaconnect-frontend

# Run commands in Railway environment
railway run python manage.py migrate
railway run psql

# Deploy specific service
railway up --service=bhasaconnect-backend

# Connect to database (if using Railway CLI)
railway run psql

# Redeploy specific service
railway up --service=bhasaconnect-backend
```

## ✅ Post-Deployment Checklist

- [ ] All services show "Active" status in Railway dashboard
- [ ] Backend health check returns `{"status": "healthy"}`
- [ ] Frontend loads without errors
- [ ] User registration/login works
- [ ] Post creation and image upload works
- [ ] API endpoints respond correctly
- [ ] Database migrations completed successfully
- [ ] All services are running (green status in Railway dashboard)
- [ ] Backend health check passes at `/health`
- [ ] Frontend loads correctly
- [ ] API calls work between frontend and backend
- [ ] Database migrations completed successfully
- [ ] File uploads work with Cloudinary

## 🚀 Production Considerations

### Scaling Considerations
- **Backend**: Single worker recommended for start, can scale horizontally
- **Database**: Railway managed PostgreSQL handles scaling automatically
- **Frontend**: Served as static files, scales with Railway's CDN
- **File Storage**: Cloudinary handles all file operations
- **Scaling**: Start with 1 replica, scale horizontally as needed
- **Monitoring**: Use Railway's built-in metrics and logging
- **Backups**: Railway PostgreSQL includes automatic backups
- **SSL**: HTTPS automatically enabled for all Railway domains
- **CDN**: Static assets served via Railway's global CDN

### Security Features
- **HTTPS**: Automatic SSL certificates from Railway
- **Environment Variables**: Encrypted and injected at runtime
- **Database**: Private networking between services
- **CORS**: Properly configured for Railway domains only
- **JWT**: Secure token-based authentication

### Cost Optimization
- **Sleep Policy**: Disabled for production availability
- **Resource Limits**: Set appropriate CPU/memory limits
- **Build Caching**: Optimized with nixpacks configurations
- **Static Assets**: Served efficiently via Railway's CDN
- Railway offers $5/month free tier
- PostgreSQL usage included in plan
- Optimize build times with nixpacks caching
- Use Railway's sleep feature for development environments

## 📞 Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Project Issues**: Create GitHub issues for BhasaConnect-specific problems
