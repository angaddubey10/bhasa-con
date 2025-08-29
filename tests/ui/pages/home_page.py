"""Page Object Model for Home Page."""

from playwright.sync_api import Page, Locator


class HomePage:
    """Page object for the home page."""

    def __init__(self, page: Page):
        self.page = page
        
        # Locators
        self.sign_in_button: Locator = page.locator('a:has-text("Sign In"), button:has-text("Sign In")')
        self.page_title: Locator = page.locator('h1, [data-testid="page-title"]')
        
    def navigate(self, app_url: str) -> None:
        """Navigate to the home page."""
        self.page.goto(app_url)
        
    def wait_for_page_load(self) -> None:
        """Wait for the home page to fully load."""
        self.page.wait_for_load_state("networkidle")
        
    def is_page_loaded(self) -> bool:
        """Check if the home page is fully loaded."""
        try:
            return self.page_title.is_visible(timeout=5000) or self.sign_in_button.is_visible(timeout=5000)
        except:
            return False
            
    def click_sign_in_button(self) -> None:
        """Click the sign in button."""
        self.sign_in_button.click()