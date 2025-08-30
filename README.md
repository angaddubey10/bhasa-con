# Bhasa Con - Language Learning Community

A TypeScript React frontend with FastAPI backend for language learning community.

## 🚀 Quick Start

### Prerequisites
- Docker Engine 20.10+ & Docker Compose 2.0+

### Run the Application
```bash
# Windows
run.bat

# Linux/Mac  
docker-compose up --build

# Manual commands
docker-compose up --build          # Development
```

### Environment Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your environment variables:**
   - Edit `.env` with your actual values
   - Update Cloudinary credentials (required for image uploads)
   - Modify database and security settings as needed

3. **Start the services:**
   ```bash
   docker-compose up -d
   ```

📋 **For detailed environment variables documentation, see [docs/EnvironmentSetup.md](docs/EnvironmentSetup.md)**

## 🌐 Access Points

- **Frontend:** http://localhost:3000  
- **Backend API:** http://localhost:8000  
- **API Docs:** http://localhost:8000/docs

## 🏗️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** FastAPI + Python 3.11 + PostgreSQL
- **Development:** Docker Compose with hot reload

##  Project Structure

```
bhasa-con/
├── frontend/src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components  
│   ├── services/       # API services
│   └── types/          # TypeScript definitions
├── backend/
│   ├── app/            # FastAPI application
│   │   ├── models/     # Database models
│   │   ├── routers/    # API routes
│   │   └── services/   # Business logic
│   └── tests/          # Backend tests
└── docker-compose.yml  # Development setup
```

## 🛠️ Common Commands

```bash
# Service management
docker-compose up -d                    # Start all services
docker-compose logs -f [service]        # View logs
docker-compose down                     # Stop services

# Development
docker-compose up --build [service]     # Rebuild service
docker-compose exec backend pytest     # Run tests

# Database
docker-compose exec backend alembic upgrade head  # Run migrations
docker-compose exec backend alembic revision --autogenerate -m "Description"
```

## 🔧 Configuration

### Required Environment Variables
- `SECRET_KEY`: JWT secret key
- `POSTGRES_PASSWORD`: Database password  
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

### Optional Variables
- `POSTGRES_DB`: Database name (default: bhasaconnect)
- `POSTGRES_USER`: Database user (default: bhasaconnect_user)
- `VITE_API_URL`: Frontend API URL (default: http://localhost:8000)

## 🔍 Troubleshooting

**Database connection issues:**
```bash
docker-compose logs db
docker-compose exec backend python -c "from app.database import engine; print('Connection successful')"
```

**Port conflicts:**
Modify port mappings in `docker-compose.yml`:
```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Change from 3000:80
```

## 🚀 Production Deployment

1. Use `docker-compose.yml` for production
2. Set strong passwords and `ENVIRONMENT=production`
3. Configure SSL/TLS at load balancer level
4. Keep Docker images and dependencies updated

## 🔄 Development Workflow

1. Make code changes locally (hot reload enabled)
2. For database changes: Create and run migrations
3. Run tests before committing changes

###

```
docker-compose restart backend
```