from fastapi import HTTPException, status


class BhasaConnectException(HTTPException):
    """Base exception for BhasaConnect application"""
    pass


class UserAlreadyExistsException(BhasaConnectException):
    """Exception raised when trying to create a user that already exists"""
    def __init__(self, email: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User with email {email} already exists"
        )


class UserNotFoundException(BhasaConnectException):
    """Exception raised when user is not found"""
    def __init__(self, user_id: str = None, email: str = None):
        if user_id:
            detail = f"User with ID {user_id} not found"
        elif email:
            detail = f"User with email {email} not found"
        else:
            detail = "User not found"
        
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail
        )


class InvalidCredentialsException(BhasaConnectException):
    """Exception raised when login credentials are invalid"""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )


class PostNotFoundException(BhasaConnectException):
    """Exception raised when post is not found"""
    def __init__(self, post_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Post with ID {post_id} not found"
        )


class UnauthorizedOperationException(BhasaConnectException):
    """Exception raised when user tries to perform unauthorized operation"""
    def __init__(self, operation: str):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Not authorized to perform {operation}"
        )


class ValidationException(BhasaConnectException):
    """Exception raised for validation errors"""
    def __init__(self, message: str):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=message
        )
