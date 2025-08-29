Based on your frontend structure, here's a comprehensive set of prompts to convert your JavaScript frontend to TypeScript. I've broken it down into small, manageable tasks:

## Configuration & Setup Tasks

### Task 1: TypeScript Configuration Setup
**Task:** Set up TypeScript configuration and update build tooling  
**Target:** @frontend root directory  
**Context:** Currently using Vite with JavaScript. Need TypeScript support with proper tsconfig.json and updated Vite configuration. Build with `npm run dev` and `npm run build`  
**Requirements:**
- Install TypeScript and necessary type definitions (@types/react, @types/react-dom)
- Create tsconfig.json with strict mode enabled
- Update vite.config.js to handle TypeScript
- Update package.json scripts if needed
**Edge Cases:** Ensure hot reload works with .tsx files, handle module resolution for absolute imports  
**Success Criteria:** Can run `npm run dev` with a .tsx file and see no errors, proper type checking in IDE

### Task 2: Update Build Files
**Task:** Convert Vite config and other build files to TypeScript  
**Target:** @vite.config.js, @postcss.config.cjs, @tailwind.config.js  
**Context:** Build configuration files are in JavaScript. Convert to TypeScript for consistency. Build with `npm run dev`  
**Requirements:**
- Convert vite.config.js to vite.config.ts
- Update postcss and tailwind configs if TypeScript is beneficial
- Ensure all plugins work correctly
**Edge Cases:** Handle CJS vs ESM module issues, ensure Docker builds still work  
**Success Criteria:** Build system works identically to before, configs have proper typing

### Task 2.1: ESLint and Prettier Configuration
**Task:** Update linting and formatting for TypeScript  
**Target:** @.eslintrc, @.prettierrc, @package.json  
**Context:** Linting rules need TypeScript support. Build with `npm run lint`  
**Requirements:**
- Install @typescript-eslint/parser and plugins
- Update ESLint config for TS rules
- Configure Prettier for TS formatting
- Add type-check script to package.json
**Edge Cases:** Conflicting rules, import sorting, type import preferences  
**Success Criteria:** Linting works for .ts/.tsx files with appropriate TypeScript rules

## Core Application Tasks

### Task 3: Convert Entry Points
**Task:** Convert main.jsx and App.jsx to TypeScript  
**Target:** @src/main.jsx, @src/App.jsx  
**Context:** Entry point files that bootstrap the React app. Build with `npm run dev`  
**Requirements:**
- Convert to .tsx extension
- Add proper types for React.StrictMode and root element
- Type the App component properly
**Edge Cases:** Handle potential null root element, ensure error boundaries still work  
**Success Criteria:** Application starts without TypeScript errors, hot reload works

### Task 3.1: Router Configuration
**Task:** Convert React Router setup to TypeScript with proper route typing  
**Target:** @src/router or wherever routes are defined (likely in App.jsx)  
**Context:** Route configuration needs proper typing for route params, query strings, and navigation. Build with `npm run dev`  
**Requirements:**
- Install @types/react-router-dom if using React Router
- Create typed route definitions
- Type useParams, useNavigate, useLocation hooks
- Define route parameter types
**Edge Cases:** Dynamic routes, optional params, catch-all routes, route guards  
**Success Criteria:** Navigation is fully typed, route params have IntelliSense

### Task 3.2: Environment Variables Configuration
**Task:** Create typed environment variable configuration  
**Target:** @src/config/env.ts (new file) or vite-env.d.ts  
**Context:** Vite environment variables need typing for IntelliSense. Build with `npm run dev`  
**Requirements:**
- Type import.meta.env variables
- Create env validation if needed
- Update vite-env.d.ts
**Edge Cases:** Missing env vars, different env modes (dev/prod)  
**Success Criteria:** Environment variables have full type safety

### Task 3.3: Custom Hooks and Utilities
**Task:** Convert custom hooks and utility functions to TypeScript  
**Target:** @src/hooks (if exists), @src/utils (if exists), or any custom hooks in components  
**Context:** Custom hooks for data fetching, local storage, utility functions, etc. need proper typing. Build with `npm run dev`  
**Requirements:**
- Type hook parameters and return values
- Type any internal state and effects
- Handle generic hooks properly
- Type utility function signatures with generics where appropriate
**Edge Cases:** Conditional hook returns, error states, cleanup functions, functions accepting multiple types  
**Success Criteria:** All custom hooks and utilities provide proper type inference, no implicit any

### Task 3.4: Constants and Enums
**Task:** Create typed constants and enums file  
**Target:** @src/constants/index.ts (new file)  
**Context:** Centralize magic strings, numbers, and create enums for better type safety. Build with `npm run dev`  
**Requirements:**
- Convert magic strings to const assertions
- Create enums for status codes, user roles, API endpoints
- Type all exported constants
- Define string literal types where appropriate
**Edge Cases:** String literal types vs enums, numeric enums vs string enums, const assertions  
**Success Criteria:** No magic strings in code, all constants are properly typed with IntelliSense

## Service Layer Tasks

### Task 4: Convert API Service
**Task:** Convert base API service to TypeScript with proper typing  
**Target:** @src/services/api.js  
**Context:** Base API service handling HTTP requests. Likely uses fetch or axios. Build with `npm run dev`  
**Requirements:**
- Define types for API responses and errors
- Create generic request/response types
- Type all function parameters and returns
**Edge Cases:** Handle network errors, timeout scenarios, different response types  
**Success Criteria:** All API calls are type-safe, IntelliSense works for API methods

### Task 5: Convert Auth Service
**Task:** Convert authentication service to TypeScript  
**Target:** @src/services/auth.js  
**Context:** Handles login, register, token management. Depends on api.js. Build with `npm run dev`  
**Requirements:**
- Define User type interface
- Type authentication tokens
- Type all auth-related API calls
**Edge Cases:** Handle token expiration, invalid credentials, null user states  
**Success Criteria:** Auth flow is fully typed, no any types used

### Task 6: Convert Posts Service
**Task:** Convert posts service to TypeScript  
**Target:** @src/services/posts.js  
**Context:** Handles CRUD operations for posts. Depends on api.js. Build with `npm run dev`  
**Requirements:**
- Define Post interface
- Type pagination responses
- Type all post-related API calls
**Edge Cases:** Handle empty post lists, validation errors, file uploads if any  
**Success Criteria:** All post operations are type-safe

## Context Tasks

### Task 7: Convert Auth Context
**Task:** Convert AuthContext to TypeScript with proper typing  
**Target:** @src/contexts/AuthContext.jsx  
**Context:** React Context providing auth state. Uses auth service. Build with `npm run dev`  
**Requirements:**
- Define AuthContextType interface
- Type the context value properly
- Type the useAuth hook
**Edge Cases:** Handle loading states, null user, context used outside provider  
**Success Criteria:** useAuth hook provides full IntelliSense, no implicit any

## Component Tasks - Common

### Task 8: Convert Common Components
**Task:** Convert Header, LoadingSpinner, and ErrorBoundary to TypeScript  
**Target:** @src/components/common/Header.jsx, @src/components/common/LoadingSpinner.jsx, @src/components/common/ErrorBoundary.jsx  
**Context:** Shared UI components used across the app. Build with `npm run dev`  
**Requirements:**
- Type all props interfaces
- Type event handlers
- ErrorBoundary needs proper error typing
**Edge Cases:** ErrorBoundary error state typing, Header responsive behavior  
**Success Criteria:** Components have explicit prop types, no TypeScript errors

### Task 9: Convert ProtectedRoute
**Task:** Convert ProtectedRoute component to TypeScript  
**Target:** @src/components/common/ProtectedRoute.jsx  
**Context:** Route guard component using auth context. Build with `npm run dev`  
**Requirements:**
- Type route props
- Integrate with React Router types
- Handle redirect logic typing
**Edge Cases:** Handle loading states, unauthorized access, null routes  
**Success Criteria:** Route protection works with full type safety

## Component Tasks - Auth

### Task 10: Convert Auth Components
**Task:** Convert LoginForm and RegisterForm to TypeScript  
**Target:** @src/components/auth/LoginForm.jsx, @src/components/auth/RegisterForm.jsx  
**Context:** Form components for authentication. Use auth service. Build with `npm run dev`  
**Requirements:**
- Type form state and validation
- Type form submission handlers
- Type error states
**Edge Cases:** Form validation errors, network errors, disabled states  
**Success Criteria:** Forms are fully typed including event handlers

## Component Tasks - Posts

### Task 11: Convert Post Components
**Task:** Convert PostCard and CreatePostForm to TypeScript  
**Target:** @src/components/posts/PostCard.jsx, @src/components/posts/CreatePostForm.jsx  
**Context:** Components for displaying and creating posts. Use posts service. Build with `npm run dev`  
**Requirements:**
- Use Post type from service
- Type all props and events
- Type form state for CreatePostForm
**Edge Cases:** Empty content, long text truncation, image handling  
**Success Criteria:** Components use shared Post type, no any types

## Page Component Tasks

### Task 12: Convert Auth Pages
**Task:** Convert LoginPage and RegisterPage to TypeScript  
**Target:** @src/pages/LoginPage.jsx, @src/pages/RegisterPage.jsx  
**Context:** Page components using auth forms. Build with `npm run dev`  
**Requirements:**
- Type page props if any
- Ensure proper integration with typed auth components
**Edge Cases:** Redirect logic after auth, query parameters  
**Success Criteria:** Pages work with typed auth flow

### Task 13: Convert Main Pages
**Task:** Convert HomePage, FeedPage, and DiscoveryPage to TypeScript  
**Target:** @src/pages/HomePage.jsx, @src/pages/FeedPage.jsx, @src/pages/DiscoveryPage.jsx  
**Context:** Main content pages using post components. Build with `npm run dev`  
**Requirements:**
- Type any page-specific state
- Type data fetching logic
- Handle pagination typing
**Edge Cases:** Empty states, infinite scroll, filters  
**Success Criteria:** Pages handle posts with full type safety

### Task 14: Convert User Pages
**Task:** Convert ProfilePage and SettingsPage to TypeScript  
**Target:** @src/pages/ProfilePage.jsx, @src/pages/SettingsPage.jsx  
**Context:** User-specific pages. Use auth context and services. Build with `npm run dev`  
**Requirements:**
- Type user profile data
- Type settings form state
- Type update handlers
**Edge Cases:** Missing user data, validation errors, file uploads  
**Success Criteria:** User data flow is fully typed

## Final Tasks

### Task 15: Add Type Declaration Files
**Task:** Create shared type definitions file  
**Target:** @src/types/index.ts (new file)  
**Context:** Need centralized type definitions used across components. Build with `npm run dev`  
**Requirements:**
- Extract common interfaces (User, Post, etc.)
- Define API response types
- Define common prop types
**Edge Cases:** Optional fields, union types, generic responses  
**Success Criteria:** Single source of truth for types, no duplication

### Task 16: Update Docker and CI
**Task:** Ensure Docker builds work with TypeScript  
**Target:** @frontend/Dockerfile, @frontend/Dockerfile.dev  
**Context:** Docker files need to handle TypeScript compilation. Build with `docker-compose build frontend`  
**Requirements:**
- Update build steps for TypeScript
- Ensure production builds work
- Dev container supports TS hot reload
**Edge Cases:** Multi-stage builds, node_modules caching  
**Success Criteria:** Both dev and prod Docker builds work correctly

### Task 16.1: Git Configuration and Package.json Updates
**Task:** Update git configuration and package.json for TypeScript workflow  
**Target:** @.gitignore, @package.json  
**Context:** Ensure TypeScript artifacts are properly handled and add type checking scripts. Build with `npm run type-check`  
**Requirements:**
- Add *.tsbuildinfo to .gitignore
- Add `tsc --noEmit` script for type checking
- Add `type-check` npm script
- Consider adding pre-commit hooks for type checking
- Ensure dist/build folders are ignored
**Edge Cases:** Generated type files that should be committed, incremental compilation artifacts  
**Success Criteria:** Type checking works via npm scripts, no TypeScript build artifacts in git

### Task 16.2: Testing Configuration (if tests exist)
**Task:** Update test configuration for TypeScript support  
**Target:** Test files and jest/vitest configuration  
**Context:** Testing framework needs TypeScript support for type-safe tests. Build with `npm test`  
**Requirements:**
- Install @types/jest or vitest types as needed
- Update test config for .ts/.tsx files
- Convert existing test files to TypeScript
- Type test utilities and mocks
**Edge Cases:** Mock typing, test utilities, async tests, component testing with types  
**Success Criteria:** Tests run with TypeScript files, proper type checking in tests, no any types in test code

Each task is designed to be completed independently while building towards a fully typed TypeScript application. Start with Task 1 (configuration) and proceed sequentially for best results.