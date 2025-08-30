import pytest
import requests
import json


class TestLoginAPI:
    """Test cases for the login API endpoint"""
    
    BASE_URL = "https://bc-backend-production-7180.up.railway.app"
    
    def test_login_successful(self):
        """Test successful login with valid credentials"""
        login_data = {
            "email": "angad@abc.com",
            "password": "D$i-RiSWS4HBd6C"
        }
        
        response = requests.post(f"{self.BASE_URL}/api/auth/login", json=login_data)
        
        assert response.status_code == 200
        response_json = response.json()
        
        # Verify response structure
        assert response_json["success"] is True
        assert response_json["message"] == "Login successful"
        assert "data" in response_json
        assert "access_token" in response_json["data"]
        assert "token_type" in response_json["data"]
        assert response_json["data"]["token_type"] == "bearer"
        assert len(response_json["data"]["access_token"]) > 0

    def test_login_wrong_credentials(self):
        """Test login with wrong email or password"""
        login_data = {
            "email": "wrong@example.com",
            "password": "WrongPassword123"
        }

        response = requests.post(f"{self.BASE_URL}/api/auth/login", json=login_data)

        assert response.status_code == 401
        response_json = response.json()
        assert "Invalid email or password" in response_json['error']

    def test_login_missing_fields(self):
        """Test login with missing email or password"""
        # Test missing email
        login_data = {
            "password": "TestPassword123"
        }

        response = requests.post(f"{self.BASE_URL}/api/auth/login", json=login_data)

        assert response.status_code == 422
        response_json = response.json()
        assert "detail" in response_json
