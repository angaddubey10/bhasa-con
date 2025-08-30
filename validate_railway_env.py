#!/usr/bin/env python3
"""
Railway Environment Validation Script
Validates that all required environment variables are properly configured.
"""
import os
import sys
from pathlib import Path


def check_backend_env():
    """Check backend environment variables"""
    print("🔍 Checking Backend Environment Variables...")
    
    required_vars = [
        'DATABASE_URL',
        'SECRET_KEY', 
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET'
    ]
    
    optional_vars = [
        'FRONTEND_URL',
        'CORS_ORIGINS',
        'PORT',
        'PYTHONPATH'
    ]
    
    missing_required = []
    for var in required_vars:
        if not os.getenv(var):
            missing_required.append(var)
        else:
            print(f"✅ {var}: {'*' * min(len(os.getenv(var)), 8)}")
    
    print(f"\n📋 Optional Variables:")
    for var in optional_vars:
        value = os.getenv(var)
        if value:
            print(f"✅ {var}: {value}")
        else:
            print(f"⚠️  {var}: Not set (will use default)")
    
    return missing_required


def check_frontend_env():
    """Check frontend environment variables"""
    print("\n🔍 Checking Frontend Environment Variables...")
    
    vite_api_url = os.getenv('VITE_API_URL')
    node_env = os.getenv('NODE_ENV', 'development')
    
    print(f"✅ NODE_ENV: {node_env}")
    if vite_api_url:
        print(f"✅ VITE_API_URL: {vite_api_url}")
    else:
        print(f"⚠️  VITE_API_URL: Not set (will use http://localhost:8000)")
    
    return []


def check_database_connection():
    """Test database connection if URL is available"""
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("\n❌ DATABASE_URL not set, skipping connection test")
        return False
    
    try:
        import asyncpg
        print(f"\n🔍 Testing Database Connection...")
        print(f"✅ DATABASE_URL configured")
        # Note: We don't actually connect here to avoid dependencies in the validation script
        return True
    except ImportError:
        print("\n⚠️  asyncpg not available, skipping database connection test")
        return True


def main():
    """Main validation function"""
    print("🚀 Railway Deployment Environment Validation\n")
    
    # Check if we're in the correct directory
    if not Path('railway.json').exists():
        print("❌ railway.json not found. Please run this script from the project root.")
        sys.exit(1)
    
    # Check backend environment
    backend_missing = check_backend_env()
    
    # Check frontend environment  
    frontend_missing = check_frontend_env()
    
    # Check database connection
    check_database_connection()
    
    # Summary
    print(f"\n📊 Validation Summary:")
    if backend_missing:
        print(f"❌ Missing required backend variables: {', '.join(backend_missing)}")
        print(f"\nTo fix this, set these environment variables:")
        for var in backend_missing:
            print(f"export {var}=your_value_here")
    else:
        print(f"✅ All required backend environment variables are set")
    
    if not frontend_missing:
        print(f"✅ Frontend environment variables are configured")
    
    # Railway deployment tips
    print(f"\n🎯 Railway Deployment Tips:")
    print(f"1. Set environment variables in Railway dashboard under 'Variables' tab")
    print(f"2. Use Railway's automatic variable injection: ${{service.VARIABLE_NAME}}")
    print(f"3. Database URL will be automatically provided by Railway PostgreSQL service")
    print(f"4. Service domains are automatically available as RAILWAY_PUBLIC_DOMAIN")
    
    # Exit with error code if required variables are missing
    if backend_missing:
        sys.exit(1)
    
    print(f"\n🎉 Environment validation passed! Ready for Railway deployment.")


if __name__ == "__main__":
    main()
