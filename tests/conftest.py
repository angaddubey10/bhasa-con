import pytest
from typing import Generator
from playwright.sync_api import Playwright, APIRequestContext, Page, Browser
import os


@pytest.fixture(scope="session")
def api_request_context(
    playwright: Playwright,
) -> Generator[APIRequestContext, None, None]:
    """Create an API request context for backend calls."""
    request_context = playwright.request.new_context(
        base_url="http://localhost:8000"  # Backend API URL
    )
    yield request_context
    request_context.dispose()


@pytest.fixture(scope="session") 
def browser(playwright: Playwright) -> Generator[Browser, None, None]:
    """Create browser instance."""
    browser = playwright.chromium.launch(headless=True)
    yield browser
    browser.close()


@pytest.fixture
def page(browser: Browser) -> Generator[Page, None, None]:
    """Create a new page for each test."""
    page = browser.new_page()
    yield page
    page.close()


@pytest.fixture
def test_user():
    """Test user credentials."""
    return {
        "email": "test@example.com",
        "password": "testpassword123",
        "name": "Test User"
    }


@pytest.fixture
def app_url():
    """Frontend application URL."""
    return "http://localhost:5173"  # Vite dev server default port


@pytest.fixture
def backend_url():
    """Backend API URL."""
    return "http://localhost:8000"
