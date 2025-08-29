"""Test runner script for UI tests."""

import os
import sys
import subprocess
import argparse
from pathlib import Path


def run_ui_tests(headless: bool = True, browser: str = "chromium", test_file: str = None):
    """Run UI tests with specified options."""
    
    # Ensure we're in the right directory
    repo_root = Path(__file__).parent.parent.parent
    os.chdir(repo_root)
    
    # Build pytest command
    cmd = [
        sys.executable, "-m", "pytest",
        "--browser", browser,
        "-v",
        "--tb=short"
    ]
    
    if headless:
        cmd.extend(["--headed", "false"])
    else:
        cmd.extend(["--headed", "true"])
    
    if test_file:
        cmd.append(test_file)
    else:
        cmd.append("tests/ui/")
    
    # Add markers for UI tests
    cmd.extend(["-m", "ui"])
    
    print(f"Running command: {' '.join(cmd)}")
    
    try:
        result = subprocess.run(cmd, check=False)
        return result.returncode
    except Exception as e:
        print(f"Error running tests: {e}")
        return 1


def main():
    """Main function."""
    parser = argparse.ArgumentParser(description="Run UI tests with Playwright")
    parser.add_argument(
        "--headed", 
        action="store_true", 
        help="Run tests in headed mode (show browser)"
    )
    parser.add_argument(
        "--browser", 
        choices=["chromium", "firefox", "webkit"], 
        default="chromium",
        help="Browser to use for tests"
    )
    parser.add_argument(
        "--test", 
        help="Specific test file to run"
    )
    
    args = parser.parse_args()
    
    # Check if we're in a virtual environment
    venv_python = Path(".venvtest/Scripts/python.exe")
    if venv_python.exists():
        print("Using virtual environment: .venvtest")
        sys.executable = str(venv_python.absolute())
    
    exit_code = run_ui_tests(
        headless=not args.headed,
        browser=args.browser,
        test_file=args.test
    )
    
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
