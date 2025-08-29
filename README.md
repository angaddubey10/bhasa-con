# Bhasa Con - Language Learning Community

A TypeScript React frontend with FastAPI backend for language learning community.

## 🚀 Quick Start with Docker

### Prerequisites
- Docker Desktop installed and running
- Docker Compose available

### Development Build & Run

**Windows:**
```bash
run.bat
```

**Linux/Mac:**
```bash
./run.sh
```

**Manual Docker Commands:**
```bash
# Development mode (with hot reload)
docker-compose up --build

# Production mode  
docker-compose -f docker-compose.prod.yml up --build
```

## 🌐 Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## 🏗️ Architecture

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** FastAPI + Python 3.11
- **Development:** Docker Compose with hot reload
- **Production:** Multi-stage Docker builds with Nginx

## 🔧 Development Features

- ✅ TypeScript with strict mode
- ✅ Hot reload for both frontend and backend
- ✅ CORS configured for development
- ✅ Comprehensive type definitions
- ✅ Error boundaries and loading states
- ✅ Authentication context ready
- ✅ Router with protected routes

## 📁 Project Structure

```
bhasa-con/
├── frontend/          # React TypeScript application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript definitions
│   │   └── utils/        # Utility functions
│   ├── Dockerfile        # Production build
│   └── Dockerfile.dev    # Development build
├── backend/           # FastAPI application  
│   ├── main.py          # FastAPI app entry point
│   ├── requirements.txt # Python dependencies
│   └── Dockerfile       # Backend container
├── docker-compose.yml      # Development configuration
├── docker-compose.prod.yml # Production configuration
└── docs/              # Documentation and workflows
```

## 🛠️ Commands

```bash
# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose up --build frontend
docker-compose up --build backend

# Production build
docker-compose -f docker-compose.prod.yml up --build

# Clean up containers and volumes
docker-compose down -v
docker system prune -f
```

## 🧪 Testing

```bash
# Type check frontend
docker-compose exec frontend npm run type-check

# Backend health check
curl http://localhost:8000/health
```

## 📝 Next Steps

1. Implement authentication forms
2. Add post creation and display components  
3. Integrate real backend endpoints
4. Add unit and integration tests
5. Set up CI/CD pipeline

The TypeScript infrastructure is complete and ready for feature development!