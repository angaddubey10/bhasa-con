"""Test utilities and helpers for UI tests."""

import os
import time
import subprocess
from typing import Optional
from playwright.sync_api import APIRequestContext


class TestDataManager:
    """Manages test data creation and cleanup."""
    
    def __init__(self, api_context: APIRequestContext, backend_url: str):
        self.api_context = api_context
        self.backend_url = backend_url
    
    def create_test_user(self, user_data: dict) -> Optional[dict]:
        """Create a test user via API."""
        try:
            response = self.api_context.post(
                f"{self.backend_url}/api/auth/register",
                data=user_data
            )
            if response.ok:
                return response.json()
            return None
        except Exception as e:
            print(f"Failed to create test user: {e}")
            return None
    
    def cleanup_test_user(self, user_email: str) -> bool:
        """Clean up test user after test."""
        # This would require admin API endpoint
        # For now, we'll skip cleanup
        return True


class AppServerManager:
    """Manages starting and stopping the application servers for testing."""
    
    def __init__(self):
        self.backend_process = None
        self.frontend_process = None
    
    def start_backend(self) -> bool:
        """Start the backend server."""
        try:
            # Change to backend directory and start server
            os.chdir("backend")
            self.backend_process = subprocess.Popen(
                ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            time.sleep(3)  # Wait for server to start
            return True
        except Exception as e:
            print(f"Failed to start backend: {e}")
            return False
    
    def start_frontend(self) -> bool:
        """Start the frontend development server."""
        try:
            os.chdir("../frontend")
            self.frontend_process = subprocess.Popen(
                ["npm", "run", "dev"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            time.sleep(5)  # Wait for Vite to start
            return True
        except Exception as e:
            print(f"Failed to start frontend: {e}")
            return False
    
    def stop_servers(self):
        """Stop both servers."""
        if self.backend_process:
            self.backend_process.terminate()
            self.backend_process.wait()
        
        if self.frontend_process:
            self.frontend_process.terminate()
            self.frontend_process.wait()
    
    def __enter__(self):
        """Context manager entry."""
        self.start_backend()
        self.start_frontend()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.stop_servers()
