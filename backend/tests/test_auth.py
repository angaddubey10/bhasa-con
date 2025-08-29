import pytest
from fastapi.testclient import TestClient
from app.schemas.user import UserRegister, UserLogin


def test_user_registration(client: TestClient):
    """Test user registration"""
    user_data = {
        "email": "test@example.com",
        "password": "Password123",
        "first_name": "Test",
        "last_name": "User"
    }
    
    response = client.post("/api/auth/register", json=user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] == True
    assert data["data"]["email"] == user_data["email"]


def test_user_registration_duplicate_email(client: TestClient):
    """Test user registration with duplicate email"""
    user_data = {
        "email": "duplicate@example.com",
        "password": "Password123",
        "first_name": "Test",
        "last_name": "User"
    }
    
    # First registration should succeed
    response = client.post("/api/auth/register", json=user_data)
    assert response.status_code == 201
    
    # Second registration with same email should fail
    response = client.post("/api/auth/register", json=user_data)
    assert response.status_code == 409


def test_user_registration_invalid_password(client: TestClient):
    """Test user registration with invalid password"""
    user_data = {
        "email": "test2@example.com",
        "password": "weak",  # Too short, no uppercase, no digit
        "first_name": "Test",
        "last_name": "User"
    }
    
    response = client.post("/api/auth/register", json=user_data)
    assert response.status_code == 422


def test_user_login(client: TestClient):
    """Test user login"""
    # First register a user
    user_data = {
        "email": "login@example.com",
        "password": "Password123",
        "first_name": "Login",
        "last_name": "User"
    }
    client.post("/api/auth/register", json=user_data)
    
    # Then login
    login_data = {
        "email": "login@example.com",
        "password": "Password123"
    }
    
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "access_token" in data["data"]
    assert data["data"]["token_type"] == "bearer"


def test_user_login_invalid_credentials(client: TestClient):
    """Test user login with invalid credentials"""
    login_data = {
        "email": "nonexistent@example.com",
        "password": "WrongPassword123"
    }
    
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 401


def test_get_current_user(client: TestClient):
    """Test getting current user profile"""
    # Register and login a user
    user_data = {
        "email": "profile@example.com",
        "password": "Password123",
        "first_name": "Profile",
        "last_name": "User"
    }
    client.post("/api/auth/register", json=user_data)
    
    login_response = client.post("/api/auth/login", json={
        "email": "profile@example.com",
        "password": "Password123"
    })
    token = login_response.json()["data"]["access_token"]
    
    # Get profile
    response = client.get("/api/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert data["data"]["email"] == "profile@example.com"
    assert data["data"]["first_name"] == "Profile"


def test_get_current_user_unauthorized(client: TestClient):
    """Test getting current user profile without token"""
    response = client.get("/api/auth/me")
    assert response.status_code == 403  # No token provided
