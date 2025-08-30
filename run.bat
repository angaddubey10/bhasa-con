@echo off
echo [*] Building and running Bhasa Con application...

echo [*] Stopping existing containers...
docker-compose down

echo [*] Building and starting services...
docker-compose up -d

echo [✓] Application is running!
echo [>] Frontend: http://localhost:3000
echo [>] Backend API: http://localhost:8000  
echo [>] API Docs: http://localhost:8000/docs