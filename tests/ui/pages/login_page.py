"""Page Object Model for Login Page."""

from playwright.sync_api import Page, Locator


class LoginPage:
    """Page object for the login page."""

    def __init__(self, page: Page):
        self.page = page
        
        # Locators
        self.email_input: Locator = page.locator('#email')
        self.password_input: Locator = page.locator('#password')
        self.submit_button: Locator = page.locator('button[type="submit"]')
        self.remember_me_checkbox: Locator = page.locator('#remember-me')
        self.forgot_password_link: Locator = page.locator('a:has-text("Forgot your password?")')
        self.register_link: Locator = page.locator('a[href="/register"]')
        self.error_message: Locator = page.locator('.text-red-800')
        self.loading_spinner: Locator = page.locator('.animate-spin')
        self.page_title: Locator = page.locator('h2:has-text("Sign in to your account")')
        
    def navigate(self, app_url: str) -> None:
        """Navigate to the login page."""
        self.page.goto(f"{app_url}/login")
        
    def fill_email(self, email: str) -> None:
        """Fill in the email field."""
        self.email_input.fill(email)
        
    def fill_password(self, password: str) -> None:
        """Fill in the password field."""
        self.password_input.fill(password)
        
    def click_submit(self) -> None:
        """Click the submit button."""
        self.submit_button.click()
        
    def login(self, email: str, password: str) -> None:
        """Perform login with email and password."""
        self.fill_email(email)
        self.fill_password(password)
        self.click_submit()
        
    def is_submit_button_disabled(self) -> bool:
        """Check if submit button is disabled."""
        return self.submit_button.is_disabled()
        
    def is_loading(self) -> bool:
        """Check if loading spinner is visible."""
        return self.loading_spinner.is_visible()
        
    def get_error_message(self) -> str:
        """Get the error message text."""
        return self.error_message.text_content() or ""
        
    def has_error(self) -> bool:
        """Check if error message is visible."""
        return self.error_message.is_visible()
        
    def click_remember_me(self) -> None:
        """Click the remember me checkbox."""
        self.remember_me_checkbox.click()
        
    def click_register_link(self) -> None:
        """Click the register link."""
        self.register_link.click()
        
    def wait_for_page_load(self) -> None:
        """Wait for the login page to fully load."""
        self.page_title.wait_for(state="visible")
