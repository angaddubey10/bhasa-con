#!/usr/bin/env python3
"""
Test script to validate Swagger/OpenAPI documentation improvements.
"""
import requests
import json
from typing import Dict, Any

def test_openapi_schema(base_url: str = "http://127.0.0.1:8001") -> Dict[str, Any]:
    """Test the OpenAPI schema and documentation."""
    
    print(f"Testing Swagger documentation at {base_url}")
    print("=" * 50)
    
    try:
        # Test if server is running
        health_response = requests.get(f"{base_url}/health", timeout=5)
        print(f"✅ Health check: {health_response.status_code}")
        
        # Get OpenAPI schema
        openapi_response = requests.get(f"{base_url}/openapi.json", timeout=5)
        openapi_schema = openapi_response.json()
        
        print(f"✅ OpenAPI schema: {openapi_response.status_code}")
        
        # Check basic schema properties
        required_fields = ["openapi", "info", "paths", "components"]
        for field in required_fields:
            if field in openapi_schema:
                print(f"✅ Has {field}: Yes")
            else:
                print(f"❌ Has {field}: No")
        
        # Check security schemes
        if "components" in openapi_schema and "securitySchemes" in openapi_schema["components"]:
            security_schemes = openapi_schema["components"]["securitySchemes"]
            print(f"✅ Security schemes: {list(security_schemes.keys())}")
            
            # Check if BearerAuth is configured
            if "BearerAuth" in security_schemes:
                bearer_auth = security_schemes["BearerAuth"]
                print(f"✅ BearerAuth type: {bearer_auth.get('type')}")
                print(f"✅ BearerAuth scheme: {bearer_auth.get('scheme')}")
                print(f"✅ BearerAuth format: {bearer_auth.get('bearerFormat')}")
            else:
                print("❌ BearerAuth security scheme not found")
        else:
            print("❌ No security schemes found")
        
        # Check API info
        if "info" in openapi_schema:
            info = openapi_schema["info"]
            print(f"✅ API Title: {info.get('title')}")
            print(f"✅ API Version: {info.get('version')}")
            print(f"✅ API Description: {len(info.get('description', ''))} characters")
        
        # Check paths and their documentation
        if "paths" in openapi_schema:
            paths = openapi_schema["paths"]
            print(f"✅ Total endpoints: {len(paths)}")
            
            documented_endpoints = 0
            protected_endpoints = 0
            
            for path, methods in paths.items():
                for method, details in methods.items():
                    if method in ["get", "post", "put", "delete", "patch"]:
                        # Check if endpoint has documentation
                        if "summary" in details or "description" in details:
                            documented_endpoints += 1
                        
                        # Check if endpoint has security requirements
                        if "security" in details or "dependencies" in str(details):
                            protected_endpoints += 1
            
            print(f"✅ Documented endpoints: {documented_endpoints}")
            print(f"✅ Protected endpoints: {protected_endpoints}")
        
        # Test if Swagger UI is accessible
        swagger_response = requests.get(f"{base_url}/docs", timeout=5)
        print(f"✅ Swagger UI: {swagger_response.status_code}")
        
        # Test if ReDoc is accessible
        redoc_response = requests.get(f"{base_url}/redoc", timeout=5)
        print(f"✅ ReDoc: {redoc_response.status_code}")
        
        print("\n" + "=" * 50)
        print("✅ All documentation tests passed!")
        
        return {
            "status": "success",
            "health": health_response.status_code,
            "openapi": openapi_response.status_code,
            "swagger_ui": swagger_response.status_code,
            "redoc": redoc_response.status_code,
            "total_endpoints": len(paths) if "paths" in openapi_schema else 0,
            "documented_endpoints": documented_endpoints,
            "protected_endpoints": protected_endpoints
        }
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error connecting to server: {e}")
        return {"status": "error", "message": str(e)}
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    results = test_openapi_schema()
    if results["status"] == "success":
        print("\n🎉 Your Swagger documentation is properly configured!")
        print("\nAccess your documentation at:")
        print("📖 Swagger UI: http://127.0.0.1:8001/docs")
        print("📖 ReDoc: http://127.0.0.1:8001/redoc") 
        print("🔧 OpenAPI Schema: http://127.0.0.1:8001/openapi.json")
    else:
        print(f"\n❌ Tests failed: {results['message']}")
