#!/usr/bin/env python3
"""
Test script to verify OpenAPI schema generation and endpoint visibility
"""
import sys
import os
from unittest.mock import Mock

# Add the app directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

# Mock the database module to avoid database connection errors
sys.modules['app.database'] = Mock()
sys.modules['app.database'].engine = Mock()
sys.modules['app.database'].Base = Mock()
sys.modules['app.database'].get_db = Mock()

try:
    from main import app
    
    # Get the OpenAPI schema
    openapi_schema = app.openapi()
    
    print("=== Bhasa Con API Endpoints ===")
    print(f"API Title: {openapi_schema['info']['title']}")
    print(f"API Version: {openapi_schema['info']['version']}")
    print(f"API Description: {openapi_schema['info']['description']}")
    print()
    
    print("Available Endpoints:")
    paths = openapi_schema.get('paths', {})
    
    for path, methods in sorted(paths.items()):
        print(f"\n{path}:")
        for method, details in methods.items():
            if method in ['get', 'post', 'put', 'delete', 'patch']:
                summary = details.get('summary', 'No summary')
                tags = details.get('tags', [])
                print(f"  {method.upper()}: {summary} (Tags: {', '.join(tags)})")
    
    print(f"\nTotal endpoints found: {sum(len([m for m in methods.keys() if m in ['get', 'post', 'put', 'delete', 'patch']]) for methods in paths.values())}")
    
    # Check if specific endpoints exist
    expected_endpoints = [
        ('/', ['get']),
        ('/health', ['get']),
        ('/api/auth/register', ['post']),
        ('/api/auth/login', ['post']),
        ('/api/auth/me', ['get']),
        ('/api/users/profile', ['get', 'put']),
        ('/api/posts/', ['get', 'post']),
        ('/api/posts/{post_id}', ['get', 'delete']),
    ]
    
    print("\n=== Endpoint Verification ===")
    missing_endpoints = []
    for endpoint, methods in expected_endpoints:
        if endpoint in paths:
            available_methods = [m for m in paths[endpoint].keys() if m in ['get', 'post', 'put', 'delete', 'patch']]
            missing_methods = [m for m in methods if m not in available_methods]
            if missing_methods:
                print(f"❌ {endpoint}: Missing methods {missing_methods}")
                missing_endpoints.append(f"{endpoint} ({missing_methods})")
            else:
                print(f"✅ {endpoint}: All methods present")
        else:
            print(f"❌ {endpoint}: Endpoint not found")
            missing_endpoints.append(endpoint)
    
    if not missing_endpoints:
        print("\n🎉 All expected endpoints are present!")
    else:
        print(f"\n⚠️  Missing endpoints: {missing_endpoints}")

except Exception as e:
    print(f"Error loading FastAPI app: {e}")
    print("This might be due to missing dependencies or database configuration issues.")
    
    # Try to load just the routers to see what endpoints are defined
    try:
        print("\n=== Trying to load routers individually ===")
        
        from app.routers import auth, users, posts
        
        print("Auth router endpoints:")
        for route in auth.router.routes:
            if hasattr(route, 'methods') and hasattr(route, 'path'):
                print(f"  {list(route.methods)} {route.path}")
                
        print("\nUsers router endpoints:")
        for route in users.router.routes:
            if hasattr(route, 'methods') and hasattr(route, 'path'):
                print(f"  {list(route.methods)} {route.path}")
                
        print("\nPosts router endpoints:")
        for route in posts.router.routes:
            if hasattr(route, 'methods') and hasattr(route, 'path'):
                print(f"  {list(route.methods)} {route.path}")
                
    except Exception as router_error:
        print(f"Error loading routers: {router_error}")
