# UI Testing with Playwright

This directory contains end-to-end UI tests for the Bhasa Con application using Playwright.

## Setup

### Prerequisites
- Python 3.11+
- Virtual environment activated
- Backend and frontend servers running

### Installation
The setup is already complete with the `.venvtest` virtual environment. If you need to recreate:

```powershell
# Create virtual environment
python -m venv .venvtest

# Activate virtual environment
.\.venvtest\Scripts\Activate.ps1

# Install dependencies
pip install playwright pytest pytest-playwright pytest-asyncio

# Install browser binaries
playwright install
```

## Running Tests

### Using the Test Runner Script
```powershell
# Run all UI tests (headless)
python run_ui_tests.py

# Run tests with visible browser
python run_ui_tests.py --headed

# Run tests with specific browser
python run_ui_tests.py --browser firefox

# Run specific test file
python run_ui_tests.py --test tests/ui/testapi.py
```

### Using pytest Directly
```powershell
# Activate virtual environment first
.\.venvtest\Scripts\Activate.ps1

# Run all UI tests
pytest tests/ui/ -m ui -v

# Run with visible browser
pytest tests/ui/ -m ui --headed true

# Run specific test
pytest tests/ui/testapi.py::TestLoginFlow::test_successful_login_with_valid_credentials -v
```

## Test Structure

### Page Objects
- `tests/ui/pages/login_page.py` - Login page interactions
- `tests/ui/pages/feed_page.py` - Feed/home page interactions

### Test Files
- `tests/ui/testapi.py` - Main login flow tests

### Utilities
- `tests/ui/utils.py` - Helper functions and test data management
- `tests/conftest.py` - Pytest fixtures and configuration

## Test Scenarios

### Login Flow Tests
1. **Page Load** - Verify login page loads correctly
2. **Form Validation** - Test empty field validation
3. **Email Validation** - Test invalid email format
4. **Successful Login** - Test with valid credentials
5. **Failed Login** - Test with invalid credentials
6. **Loading State** - Verify loading indicators
7. **Remember Me** - Test checkbox functionality
8. **Navigation** - Test register page link
9. **Error Handling** - Test error message behavior
10. **Network Errors** - Test network failure scenarios

### Accessibility Tests
1. **Keyboard Navigation** - Test tab navigation
2. **Form Labels** - Verify proper ARIA labels
3. **Required Attributes** - Test form validation attributes

## Configuration

### Pytest Configuration (`pyproject.toml`)
- Browser: Chromium (default)
- Headless: True (default)
- Test markers: `ui`, `api`, `slow`

### Fixtures (`tests/conftest.py`)
- `browser` - Browser instance
- `page` - Page instance for each test
- `api_request_context` - API client for backend calls
- `test_user` - Test user credentials
- `app_url` - Frontend URL (http://localhost:5173)
- `backend_url` - Backend URL (http://localhost:8000)

## Prerequisites for Running Tests

### Start Backend Server
```powershell
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Start Frontend Server
```powershell
cd frontend
npm run dev
```

### Test User Setup
Some tests require a test user to exist. You can either:
1. Create a test user through the registration flow
2. Use the API to create a test user
3. Modify tests to handle user creation

## Troubleshooting

### Common Issues
1. **Servers not running** - Ensure both backend (port 8000) and frontend (port 5173) are running
2. **Browser not found** - Run `playwright install` to install browser binaries
3. **Permission errors** - Ensure virtual environment is activated
4. **Test timeouts** - Check server startup time and network connectivity

### Debug Mode
Run tests with visible browser to debug:
```powershell
python run_ui_tests.py --headed
```

### Slow Tests
Tests marked with `@pytest.mark.slow` can be skipped:
```powershell
pytest tests/ui/ -m "ui and not slow"
```

## Contributing

### Adding New Tests
1. Create new test methods in existing test classes
2. Use page objects for element interactions
3. Add appropriate test markers (`@pytest.mark.ui`)
4. Update this README if adding new test categories

### Adding New Page Objects
1. Create new page class in `tests/ui/pages/`
2. Import in `tests/ui/pages/__init__.py`
3. Use consistent locator patterns
4. Add helper methods for common interactions
