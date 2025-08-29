"""Page Object Model for Feed/Home Page."""

from playwright.sync_api import Page, Locator


class FeedPage:
    """Page object for the feed/home page."""

    def __init__(self, page: Page):
        self.page = page
        
        # Locators
        self.logout_button: Locator = page.locator('button:has-text("Logout"), button:has-text("Sign out")')
        self.user_profile: Locator = page.locator('[data-testid="user-profile"], .user-profile')
        self.posts_container: Locator = page.locator('[data-testid="posts-container"], .posts-container')
        self.create_post_button: Locator = page.locator('button:has-text("Create Post"), [data-testid="create-post-button"]')
        
    def wait_for_page_load(self) -> None:
        """Wait for the feed page to fully load."""
        # Wait for the page URL to change to root or feed
        self.page.wait_for_url("**/", timeout=5000)
        
    def is_logged_in(self) -> bool:
        """Check if user is logged in by looking for user-specific elements."""
        try:
            # Check for logout button or user profile elements
            return (self.logout_button.is_visible(timeout=2000) or 
                   self.user_profile.is_visible(timeout=2000) or
                   self.create_post_button.is_visible(timeout=2000))
        except:
            return False
