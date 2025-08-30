# Environment Setup Guide

## Quick Start

1. Create environment files from templates:
   ```bash
   cp backend/.env.template backend/.env
   cp frontend/.env.template frontend/.env
   ```

2. Edit the files with your actual values (see variables below)

3. Start the application:
   ```bash
   docker-compose up -d
   ```

## Backend Environment Variables

Create `backend/.env` with these variables:

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens (generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key  
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

### Optional (with defaults)
- `JWT_ALGORITHM=HS256` - JWT algorithm
- `ACCESS_TOKEN_EXPIRE_MINUTES=1440` - Token expiry (24 hours)
- `CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000` - Allowed origins
- `ENVIRONMENT=development` - Environment type

### Example Values
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/bhasaconnect_dev
JWT_SECRET=your-generated-secret-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret
```

## Frontend Environment Variables

Create `frontend/.env` with these variables:

### Required
- `VITE_API_URL` - Backend API URL

### Optional
- `VITE_ENVIRONMENT` - Environment type

### Example Values
```bash
# Development
VITE_API_URL=http://localhost:8000
VITE_ENVIRONMENT=development

# Production
VITE_API_URL=https://your-backend-domain.com
VITE_ENVIRONMENT=production
```

## Environment-Specific Notes

### Development
- Use local PostgreSQL or Docker database
- JWT_SECRET can be any strong random string
- CORS_ORIGINS should include your frontend URLs

### Production
- Use hosted database (Railway, Heroku, etc.)
- Generate strong JWT_SECRET (32+ characters)
- Set CORS_ORIGINS to your production domains
- Set ENVIRONMENT=production

## Security Guidelines

⚠️ **Never commit actual .env files to git**

✅ **Good practices:**
- Generate strong, unique JWT secrets
- Use environment-specific database URLs
- Regularly rotate API keys
- Use HTTPS URLs in production

❌ **Avoid:**
- Sharing .env files in chat/email
- Using weak or default secrets
- Hardcoding sensitive values in code
