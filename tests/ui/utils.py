"""Test utilities and helpers for UI tests."""


def get_test_credentials():
    """Get test user credentials."""
    return {
        "email": "test@example.com",
        "password": "password123"
    }


def get_app_urls():
    """Get application URLs for testing."""
    return {
        "frontend": "http://localhost:3000",
        "backend": "http://localhost:8000"
    }
