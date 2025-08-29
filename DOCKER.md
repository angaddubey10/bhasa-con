# Docker Setup for BhasaConnect

This document explains how to run BhasaConnect using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

1. **Clone the repository and navigate to the project directory**
   ```bash
   git clone <repository-url>
   cd bhasa-con
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your actual configuration values.

3. **Start the application**
   ```bash
   # For production build
   docker-compose up -d

   # For development with hot reload
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000 (or http://localhost:80 for production)
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Services

### Production (docker-compose.yml)
- **Frontend**: React app served by Nginx on port 80/3000
- **Backend**: FastAPI server on port 8000
- **Database**: PostgreSQL on port 5432
- **Redis**: Optional caching layer on port 6379

### Development (docker-compose.dev.yml)
- **Frontend**: Vite dev server with hot reload on port 3000
- **Backend**: FastAPI with hot reload on port 8000
- **Database**: PostgreSQL with development configuration
- **Redis**: Development Redis instance

## Commands

### Start Services
```bash
# Production
docker-compose up -d

# Development
docker-compose -f docker-compose.dev.yml up -d

# Start specific service
docker-compose up -d backend
```

### Stop Services
```bash
docker-compose down

# Remove volumes (WARNING: This will delete all data)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### Database Operations
```bash
# Run migrations
docker-compose exec backend alembic upgrade head

# Create new migration
docker-compose exec backend alembic revision --autogenerate -m "Description"

# Access database
docker-compose exec db psql -U bhasaconnect_user -d bhasaconnect
```

### Development Commands
```bash
# Install new packages in backend
docker-compose exec backend pip install package_name

# Install new packages in frontend
docker-compose exec frontend-dev npm install package_name

# Run tests
docker-compose exec backend pytest
```

## Environment Variables

### Required Variables
- `POSTGRES_PASSWORD`: Database password
- `SECRET_KEY`: JWT secret key (generate a secure random string)
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

### Optional Variables
- `POSTGRES_DB`: Database name (default: bhasaconnect)
- `POSTGRES_USER`: Database user (default: bhasaconnect_user)
- `VITE_API_URL`: Frontend API URL (default: http://localhost:8000)

## Volumes

- `postgres_data`: Database data persistence
- `backend_uploads`: Backend file uploads
- `redis_data`: Redis data persistence

## Health Checks

All services include health checks:
- **Database**: PostgreSQL connection test
- **Backend**: HTTP health endpoint
- **Frontend**: Nginx status check
- **Redis**: Redis ping command

## Troubleshooting

### Database Connection Issues
```bash
# Check database status
docker-compose ps db

# View database logs
docker-compose logs db

# Manually test connection
docker-compose exec backend python -c "from app.database import engine; print('Connection successful')"
```

### Frontend Not Loading
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

### Port Conflicts
If you have port conflicts, modify the port mappings in docker-compose.yml:
```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Change from 80:80 to 8080:80
```

## Development Workflow

1. **Make code changes** in your local files
2. **Backend changes**: Hot reload is enabled, changes reflect automatically
3. **Frontend changes**: Hot reload is enabled in development mode
4. **Database schema changes**: Run migrations
   ```bash
   docker-compose exec backend alembic revision --autogenerate -m "Your change"
   docker-compose exec backend alembic upgrade head
   ```

## Production Deployment

For production deployment:

1. Use `docker-compose.yml` (not the dev version)
2. Set `ENVIRONMENT=production` in your `.env` file
3. Use strong passwords and secrets
4. Consider using Docker Swarm or Kubernetes for orchestration
5. Set up proper monitoring and logging
6. Configure SSL/TLS termination at the load balancer level

## Security Considerations

- Change all default passwords in production
- Use environment variables for sensitive data
- Keep Docker images updated
- Implement proper CORS settings
- Use HTTPS in production
- Regularly update dependencies
