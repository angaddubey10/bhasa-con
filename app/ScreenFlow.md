# Bhasa App - Screen Flow Documentation

## Overview
Social media Flutter app with Facebook-like design. Token-based authentication with 6-tab bottom navigation.

**Tech Stack**: Flutter 3.0+, Material Design 3, Provider, HTTP/Dio, Secure Storage

## App Flow

```
main.dart → SplashScreen (200ms) → Auth Check
                                              │
                              ┌───────────────┼───────────────┐
                              │               │               │
                        Unauthenticated   Authenticated    Error
                              │               │               │
                        LoginScreen    FacebookStyleHome  LoginScreen
                              │               │
                      ┌───────┴──────┐        │
                      │              │        │
                  Login Success  RegisterScreen │
                      │              │        │
                      └──────┬───────┘        │
                             │                │
                        Success ──────────────┘
                             │
                    FacebookStyleHomeScreen
                             │
                    Bottom Navigation (6 tabs)
                    Tab 0: MainFeed (active)
                    Tabs 1-5: Coming Soon
```

## Key Screens

### Authentication
- **LoginScreen**: Email/password with validation, token storage
- **RegisterScreen**: User registration with auto-login
- **SplashScreen**: 200ms display with background auth check

### Main App
- **FacebookStyleHomeScreen**: Main container with bottom navigation
- **MainFeedScreen**: Social feed with posts, stories, infinite scroll

## Authentication Flow
```
App Start → Token Check → Valid: MainApp | Invalid/None: Login
Login Success → Store Token → Navigate to MainApp
Token Expired → Auto-logout → Return to Login
```

## File Structure
```
lib/
├── main.dart                          # Entry point
├── screens/
│   ├── splash_screen.dart             # Splash + auth check
│   ├── facebook_style_home_screen.dart # Main container
│   ├── auth/                          # Login/Register
│   ├── feed/main_feed_screen.dart     # Primary feed
│   ├── profile/                       # User profiles
│   └── users/user_search_screen.dart  # User discovery
├── services/                          # Auth, API, initialization
└── widgets/                           # UI components
```

## Implementation Status
- ✅ **Complete**: Splash, auth flow, main feed, profiles, search, bottom nav
- 🚧 **Coming Soon**: Watch, Friends, Marketplace, Notifications, Menu tabs

---

**Last Updated**: September 6, 2025
**Branch**: authImprovement
**Documentation Version**: 1.0
