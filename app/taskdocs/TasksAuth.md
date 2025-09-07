I'll analyze the current codebase to understand the existing authentication structure and then provide a detailed task breakdown for implementing persistent login with encrypted storage. Based on my analysis of the current codebase, I can see that there's already a solid authentication system in place with Flutter Secure Storage using `encryptedSharedPreferences: true`. However, the app currently lacks **persistent login functionality** - it always shows the login screen on startup without checking for existing valid tokens.

Here's a comprehensive task breakdown for implementing persistent login:

## Task 1: Create App Initialization Service
**Task:** Implement app startup logic to check for existing authentication tokens
**Target:** `@lib/services/app_initialization_service.dart`
**Context:** Currently the app always shows LoginScreen on startup without checking for existing tokens. Need centralized initialization service to handle startup authentication checks. Build with `flutter run` from project root.
**Requirements:**
- Create service to check token existence and validity on app startup
- Validate token by calling `/api/auth/me` endpoint 
- Handle token expiration and refresh scenarios
- Provide initialization state (loading, authenticated, unauthenticated)
**Edge Cases:** Network unavailable on startup, corrupted token data, token expired but API unreachable, partial initialization failure
**Success Criteria:** Service correctly identifies authentication state on app startup, handles all network and token validation scenarios

## Task 2: Create Splash/Loading Screen (DEPRECATED - Over-engineered)
**Task:** Create splash screen to show during app initialization
**Target:** `@lib/screens/splash_screen.dart`
**Context:** Need user-friendly loading screen while checking authentication status on startup. App currently jumps directly to LoginScreen. Build with `flutter run` from project root.
**Requirements:**
- Display app branding and loading indicator during initialization
- Show error states for network/initialization failures
- Provide retry mechanism for failed initialization
- Match existing app theme and design system
**Edge Cases:** Very slow network, initialization timeout, repeated failures, offline mode
**Success Criteria:** Smooth loading experience with proper error handling and retry functionality
**Status:** DEPRECATED - This approach is over-engineered compared to modern app UX patterns. See Task 2B for simplified approach.

## Task 2B: Create Splash Screen (Facebook-Style)
**Task:** Create splash screen with just branding like modern apps (Facebook, Instagram, etc.)
**Target:** `@lib/screens/splash_screen.dart`
**Context:** Modern successful apps use ultra-minimal splash screens with just branding, then show content immediately. Current splash screen implementation follows modern patterns. Build with `flutter run` from project root.
**Requirements:**
- Display only app logo and name (no loading spinner)
- Maximum duration: 500-800ms for branding visibility
- Quick authentication check in background without UI feedback
- Direct navigation to home screen (if authenticated) or login screen
- No error states or retry mechanisms on splash screen
- Match existing app theme and design system
**Edge Cases:** Network failures handled by destination screens, not splash screen
**Success Criteria:** Fast splash screen that immediately routes users to appropriate screen without complex loading states

## Task 3: Enhance AuthService with Token Validation
**Task:** Add token validation and refresh capabilities to existing AuthService
**Target:** auth_service.dart
**Context:** Current AuthService has basic token storage but lacks validation logic. Already uses EncryptedSharedPreferences with Keystore backing. Build with `flutter run` from project root.
**Requirements:**
- Add method to validate stored token via `/api/auth/me` call
- Implement token refresh logic if API supports it
- Add method to check token expiration locally if token contains exp claim
- Maintain existing encrypted storage implementation
**Edge Cases:** Malformed JWT token, expired token, network failure during validation, API returns different user data
**Success Criteria:** Token validation works reliably, expired tokens are handled gracefully, existing encryption security is maintained

## Task 4: Update Main App with Router Logic
**Task:** Implement conditional routing based on authentication state
**Target:** main.dart, `@lib/router/app_router.dart`
**Context:** App currently always shows LoginScreen. Need routing logic to show HomeScreen for authenticated users or LoginScreen for unauthenticated. Current main.dart already initializes AuthService. Build with `flutter run` from project root.
**Requirements:**
- Create app router with authentication-based route guards
- Integrate with app initialization service for startup routing
- Handle deep links and navigation state preservation
- Maintain existing theme and configuration setup
**Edge Cases:** Deep link to protected route when unauthenticated, navigation during authentication state changes, browser back button on web
**Success Criteria:** Authenticated users bypass login screen, unauthenticated users see login screen, navigation works correctly

## Task 5: Enhanced Logout with Complete Cleanup
**Task:** Ensure logout completely clears all stored authentication data
**Target:** auth_service.dart
**Context:** Current logout clears token but may not handle all stored user data. Need to ensure complete cleanup for security. Uses EncryptedSharedPreferences. Build with `flutter run` from project root.
**Requirements:**
- Clear all authentication-related data from encrypted storage
- Call logout API endpoint to invalidate server-side sessions
- Navigate to login screen and reset app state
- Add confirmation dialog for logout action
**Edge Cases:** Network failure during logout API call, partial data cleanup, user denies logout confirmation, logout during network requests
**Success Criteria:** All user data cleared from device, server session invalidated, user returned to login screen

## Task 6: Add Token Expiration Handling
**Task:** Implement automatic token expiration detection and user re-authentication
**Target:** http_service.dart, auth_service.dart
**Context:** Current HTTP service doesn't handle 401 responses for expired tokens. Need automatic token cleanup and re-authentication prompts. Build with `flutter run` from project root.
**Requirements:**
- Detect 401 responses in HTTP service and clear invalid tokens
- Show re-authentication dialog when token expires during app usage
- Implement automatic logout for expired sessions
- Preserve user's current screen/context when possible
**Edge Cases:** Multiple simultaneous 401 responses, token expiry during critical operations, network issues during re-authentication
**Success Criteria:** Expired tokens are automatically detected and handled, user experience is smooth during re-authentication

## Task 7: Add Remember Me Preference Storage (DEPRECATED - Outdated UX Pattern)
**Task:** Store and respect user's "Remember Me" preference for persistent login
**Target:** auth_service.dart, login_screen.dart
**Context:** LoginScreen has "Remember Me" checkbox but preference isn't stored. Need to respect user choice for automatic login. Uses encrypted storage. Build with `flutter run` from project root.
**Requirements:**
- Store "Remember Me" preference in encrypted storage
- Only perform automatic login if user opted for persistent session
- Provide settings option to disable automatic login
- Show appropriate UI feedback for remembered sessions
**Edge Cases:** User toggles preference frequently, security concerns with persistent sessions, preference corrupted or missing
**Success Criteria:** User choice is respected, automatic login only happens when explicitly enabled, preference is securely stored
**Status:** DEPRECATED - Modern apps (Facebook, Instagram, WhatsApp) don't use "Remember Me" checkboxes. See Task 7B for modern approach.

## Task 7B: Implement Always-Persistent Login (Modern Mobile Pattern)
**Task:** Remove "Remember Me" checkbox and implement always-persistent login like modern apps
**Target:** auth_service.dart, login_screen.dart, app_initialization_service.dart
**Context:** Modern successful apps (Facebook, Instagram, WhatsApp, Twitter) don't use "Remember Me" checkboxes - they stay logged in by default until user manually logs out. This provides better mobile UX and matches user expectations. Build with `flutter run` from project root.
**Requirements:**
- Remove "Remember Me" checkbox from login screen
- Always store authentication tokens on successful login
- Always attempt automatic login on app startup (if token exists)
- Provide explicit "Log Out" functionality in settings/profile
- Optional: Add biometric authentication for security on sensitive actions
- Maintain existing encrypted storage security
**Edge Cases:** Shared device usage (handle via explicit logout), token expiration (auto-refresh or re-login), account switching (if multiple accounts supported)
**Success Criteria:** Users stay logged in across app restarts without any checkbox, logout only happens when explicitly requested, matches modern app behavior patterns

## Task 8: Add Comprehensive Testing
**Task:** Create comprehensive tests for persistent login functionality
**Target:** `@test/services/auth_service_test.dart`, `@test/services/app_initialization_service_test.dart`
**Context:** Existing auth tests don't cover persistent login scenarios. Need thorough testing for security-critical functionality. Build with `flutter test`. 
**Requirements:**
- Unit tests for token validation, storage, and cleanup
- Integration tests for app initialization flows
- Widget tests for splash screen and authentication UI
- Test all edge cases and error scenarios
**Edge Cases:** Concurrent auth operations, storage failures, network timeouts, malformed tokens, rapid app restarts
**Success Criteria:** All authentication paths tested, edge cases covered, tests pass consistently, security scenarios validated

Each task builds upon the existing encrypted storage implementation and maintains the current security standards while adding the persistent login functionality.