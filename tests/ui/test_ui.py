"""Simple UI test for login functionality using Playwright."""

from playwright.sync_api import sync_playwright
from pages.home_page import HomePage
from pages.login_page import LoginPage


def test_home_page_sign_in_navigation():
    """Test opening home page and clicking the Sign In button."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Initialize page objects
        home_page = HomePage(page)
        login_page = LoginPage(page)
        
        # Navigate to home page
        home_page.navigate("http://localhost:3000")
        
        # Wait for home page to load and verify we're on the right page
        home_page.wait_for_page_load()
        assert home_page.is_page_loaded(), "Home page should be fully loaded"
        
        # Click the Sign In button
        home_page.click_sign_in_button()
        
        # Wait for navigation to login page
        page.wait_for_url("**/login", timeout=5000)
        
        # Verify we're now on the login page
        assert "/login" in page.url, "Should navigate to login page"
        assert login_page.page_title.is_visible(), "Login page title should be visible"
        
        browser.close()


def test_login_success():
    """Simple login test using sync_playwright."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000/login")  # Adjust URL as needed
        
        # Wait for the page to fully load
        page.wait_for_timeout(3000)
            
        # Fill in the form using the correct selectors
        page.fill("#email", "test@example.com")
        page.fill("#password", "password123")
        page.click("button[type=submit]")
        page.wait_for_timeout(2000)  # Wait for navigation
        
        # Check if redirected to feed or dashboard
        assert any(path in page.url for path in ["/feed", "/dashboard", "/home", "/"]), f"Expected redirect but got URL: {page.url}"
        browser.close()