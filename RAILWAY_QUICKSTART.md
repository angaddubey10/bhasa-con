# Railway Deployment - Quick Start Guide

## Prerequisites
- Railway account: [railway.app](https://railway.app)
- GitHub repository with BhasaConnect code
- Cloudinary account for file uploads

## Environment Variables Setup

### Required Variables (Set in Railway Dashboard)
```bash
# Authentication & Security
SECRET_KEY=your-super-secret-jwt-key-at-least-32-characters

# Cloudinary File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Auto-Generated Variables (Railway handles these)
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

## Deployment Steps

### 1. Create Railway Project
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect and authorize your GitHub account
5. Select `angaddubey10/bhasa-con` repository

### 2. Configure Services
Railway will automatically detect the `railway.json` configuration and create:
- **PostgreSQL Database** - Managed database service
- **Backend Service** - FastAPI application in `/backend` directory  
- **Frontend Service** - React application in `/frontend` directory

### 3. Set Environment Variables
In Railway Dashboard, for each service:

**Global Project Variables:**
- `SECRET_KEY` - Generate with: `openssl rand -hex 32`
- `CLOUDINARY_CLOUD_NAME` - From Cloudinary dashboard
- `CLOUDINARY_API_KEY` - From Cloudinary dashboard  
- `CLOUDINARY_API_SECRET` - From Cloudinary dashboard

### 4. Deploy
1. Railway automatically triggers deployment
2. Services deploy in order: Database → Backend → Frontend
3. Database migrations run automatically on backend startup
4. Health checks ensure services are running correctly

### 5. Verify Deployment
Check these endpoints:
- **Backend Health**: `https://your-backend-domain.railway.app/health`
- **Frontend**: `https://your-frontend-domain.railway.app`
- **API Docs**: `https://your-backend-domain.railway.app/docs`

## Generating SECRET_KEY

```bash
# Option 1: Using OpenSSL
openssl rand -hex 32

# Option 2: Using Python
python -c "import secrets; print(secrets.token_hex(32))"

# Option 3: Online Generator
# Visit: https://generate-secret.vercel.app/32
```

## Cloudinary Setup

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy the credentials:
   - Cloud Name
   - API Key  
   - API Secret

## Troubleshooting

### Common Issues

**Service Won't Start**
- Check environment variables are set correctly
- Verify `SECRET_KEY` is at least 32 characters
- Ensure Cloudinary credentials are valid

**Database Connection Failed**
- Verify PostgreSQL service is running
- Check `DATABASE_URL` is properly injected
- Ensure backend service depends on postgres

**CORS Errors**
- Check frontend can reach backend URL
- Verify CORS_ORIGINS includes frontend domain
- Confirm both services are in same Railway project

**Build Failures**
- Check `requirements.txt` and `package.json` are valid
- Review build logs in Railway dashboard
- Verify nixpacks.toml configurations are correct

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
```

## Post-Deployment Checklist

- [ ] All services show "Active" status in Railway dashboard
- [ ] Backend health check returns `{"status": "healthy"}`
- [ ] Frontend loads without errors
- [ ] User registration/login works
- [ ] Post creation and image upload works
- [ ] API endpoints respond correctly
- [ ] Database migrations completed successfully

## Production Considerations

- **Scaling**: Start with 1 replica, scale horizontally as needed
- **Monitoring**: Use Railway's built-in metrics and logging
- **Backups**: Railway PostgreSQL includes automatic backups
- **SSL**: HTTPS automatically enabled for all Railway domains
- **CDN**: Static assets served via Railway's global CDN

## Cost Optimization

- Railway offers $5/month free tier
- PostgreSQL usage included in plan
- Optimize build times with nixpacks caching
- Use Railway's sleep feature for development environments

## Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)  
- **Project Issues**: Create GitHub issues for BhasaConnect-specific problems
