# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
```bash
npm run dev        # Start development server (http://localhost:5173)
npm run build      # Type-check and build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
```

### Environment Variables
Required in `.env`:
```
VITE_API_BASE_URL=http://localhost:8000/v1  # Backend API URL
VITE_API_TIMEOUT=5000                       # API timeout in ms
```

## Architecture Overview

### Tech Stack
- **React 19** with TypeScript for type-safe components
- **Vite 7** for fast development and builds
- **React Router DOM 7.6** for client-side routing
- **Tailwind CSS 4.1** with custom utilities
- **Axios** for API communication
- **JWT tokens** for authentication

### Core Project Structure
```
src/
├── components/     # Reusable UI (auth, common, icons, tests)
├── pages/          # Page/layout components
├── services/       # API service layer (auth, account, tests, users)
├── contexts/       # React Context (Auth, TestStep)
├── hooks/          # Custom React hooks (useAuth)
├── types/          # TypeScript interfaces
├── assets/         # Static files (audio, images)
└── App.tsx         # Main routing configuration
```

## Authentication System

### Two-Token Model
The app uses a dual-token authentication system:

1. **Access Token** (`access_token`) - Obtained after login, used for general API access
2. **Profile Token** (`profile_token`) - Obtained after selecting a profile, takes precedence in API requests

**Token Flow:**
```
Login → access_token → Select Profile → profile_token → API calls
```

**Critical Files:**
- `src/contexts/AuthProvider.tsx` - Authentication state management
- `src/services/authService.ts` - Login/register API calls
- `src/hooks/useAuth.ts` - Auth hook (use this in components)
- `src/services/apiClient.ts` - Axios client with token interceptors

**Usage Pattern:**
```typescript
const { user, isAuthenticated, selectProfile, logout } = useAuth();
```

**Token Priority:** API interceptor uses `profile_token` > `access_token` > none

### Protected Routes
Note: Protected route wrappers (`AccountProtectedRoute`, `ProfileProtectedRoute`) are currently commented out in routing for development convenience.

## Routing Architecture

### Route Structure
- **Public Routes:** `/`, `/about`, `/login`, `/register`
- **Protected Routes:** `/dashboard`, `/profile/select`, `/human` (user info form)
- **Test Routes:** `/test/{type}/{step}` where type is `auditory|visual|language|minigame2`

### Test Route Pattern
Each test follows a multi-step flow:
```
/test/{type}/instruction → /test/{type}/{content} → /test/{type}/rating
```

**Key Files:**
- `src/App.tsx` - Main routing configuration
- `src/pages/{TestType}Layout.tsx` - Test-specific layouts with TestStepProvider
- `src/components/TestDispatcher.tsx` - Central routing logic for test content

## Test System Architecture

### Test Types
Defined in `src/enum.ts`:
- `auditory` - Audio-based tests
- `visual` - Visual memory tests (8 rounds: simple/hard alternating)
- `language` - Language tests (6 test types with multiple sub-questions)
- `minigame2` - Interactive mini game

### Test Flow Pattern
All tests use the same pattern:
1. Wrap routes with `TestStepProvider` (defines step sequence)
2. `TestDispatcher` routes to appropriate component based on current step
3. Components use `useTestStep()` to navigate between steps
4. Steps are synced with URL parameters

**Example: Visual Test**
```typescript
// In VisualTestLayout.tsx
const VISUAL_TEST_STEPS = [
  "instruction", "simple/1", "hard/2", "simple/3", "hard/4",
  "simple/5", "hard/6", "simple/7", "hard/8", "rating"
];

<TestStepProvider testType="visual" testSteps={VISUAL_TEST_STEPS}>
  <Outlet />
</TestStepProvider>
```

**In Components:**
```typescript
const { currentStep, goToNextStep, goToPreviousStep } = useTestStep();
```

### Language Test Structure
6 distinct test types in `src/components/LanguageTest.tsx`:
1. Vowels - Letter recognition
2. Consonants - Letter recognition
3. Full alphabet - Complete alphabet recognition
4. Remove letter - Spelling correction by removal
5. Add letter - Spelling correction by addition
6. Replace letter - Spelling correction by replacement

Features: Audio playback, text input, visual feedback per question.

## API Integration

### Service Layer Pattern
All API calls go through service modules in `src/services/`:

**authService** (`authService.ts`)
- `login(email, password)` - POST `/public/auth/login`
- `register(email, password, name)` - POST `/public/auth/register`
- `logout()` - Clears tokens

**accountService** (`accountService.ts`)
- `getCurrentAccount()` - GET `/account/me`
- `getProfiles()` - GET `/account/profiles`
- `createProfile(data)` - POST `/account/profiles`
- `selectProfile(profileId)` - POST `/account/profiles/{id}/select`
- `updateProfile(id, data)` - PUT `/account/profiles/{id}`
- `deleteProfile(id)` - DELETE `/account/profiles/{id}`

**testSessionService** (`testSessionService.ts`)
- `getAllTestSessions()` - GET `/test-session/`
- `startTestSession()` - POST `/test-session`
- `startSpecificTestSession(params)` - POST `/test-session/start`
- `submitTestSection(id, params)` - POST `/test-session/{id}/submit`

**userService** (`userService.ts`)
- `updateUserProfile(userInfo)` - PUT `/user/profile`

### API Call Pattern
Never call axios directly in components. Always use service functions:

```typescript
// In component
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await accountService.getCurrentAccount();
      setData(data);
    } catch (err) {
      setError(err.message);
    }
  };
  fetchData();
}, []);
```

**API Client Configuration:**
- Base URL from `VITE_API_BASE_URL` env var
- Request interceptor auto-adds `Authorization: Bearer {token}`
- Response interceptor extracts `response.data`
- Tokens prioritized: `profile_token` > `access_token`

## State Management

### Context-Based Architecture
The app uses React Context (no Redux/Zustand):

**AuthContext** (`src/contexts/AuthProvider.tsx`)
- Wrapped at app root in `main.tsx`
- Manages: user, tokens (access + profile), authentication state
- Access via `useAuth()` hook
- Persists to localStorage

**TestStepContext** (`src/contexts/TestStepContext.tsx`)
- Created per test layout
- Manages: current step, step navigation, URL sync
- Access via `useTestStep()` hook
- Each test type defines its own step sequence

## Styling System

### Tailwind CSS 4.1
Uses `@tailwindcss/vite` plugin with custom utilities defined in `src/index.css`:

**Custom Gradient Classes:**
- `.bg-gradient-pink` - Pink gradient background
- `.bg-gradient-cyan` - Cyan gradient background
- `.bg-gradient-pink-right` - Right-direction pink gradient

**Custom Font:**
- Fredoka font family configured in theme

## TypeScript Types

Key type definitions in `src/types/`:

**auth.ts:** `LoginRequest`, `LoginResponse`, `RegisterRequest`, `RegisterResponse`

**account.ts:**
```typescript
Account {
  id: number
  email: string
  created_at: string
  role: string
  profiles: Profile[]
}

Profile {
  id: number
  account_id: number
  profile_type: string
  created_at: string
  name?: string
  year_of_birth?: number
  email?: string
  mother_tongue?: string
  gender?: string
  official_dyslexia_diagnosis?: boolean
}
```

**testSession.ts:** Test session parameters and submission types

## Development Guidelines

### Working with Authentication
- Always use `useAuth()` to access user/auth state
- Tokens are auto-added to API calls via interceptor
- Don't store tokens outside localStorage/AuthContext
- Profile token is required for test-related API calls

### Working with Tests
- Use `useTestStep()` within test layouts to manage progression
- Don't navigate outside TestDispatcher for test content
- All test components must be wrapped in TestStepProvider
- Steps are URL-synced - don't manually change URLs

### Working with APIs
- Create service functions for all API calls
- Never call axios directly in components
- All responses are unwrapped (response.data) by interceptor
- Handle errors in components with try-catch

### Code Style
- Type all React component props with TypeScript
- Use custom utility classes for consistent styling
- Keep components focused and single-purpose
- Follow existing service layer patterns

## Pull Request Workflow

**Important:** Do not push directly to `main` branch. Use pull requests:
1. Create a new branch based on `main`
2. Open a Pull Request describing your changes
3. Wait for team member (code owner) review and approval
4. Merge after approval

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main routing configuration |
| `src/main.tsx` | App entry with AuthProvider |
| `src/contexts/AuthProvider.tsx` | Auth state management |
| `src/contexts/TestStepContext.tsx` | Test progression management |
| `src/hooks/useAuth.ts` | Auth hook (most commonly used) |
| `src/services/apiClient.ts` | Axios config + interceptors |
| `src/components/TestDispatcher.tsx` | Central test routing logic |
| `src/components/LanguageTest.tsx` | Language test implementation |
| `src/pages/VisualTestLayout.tsx` | Visual test layout with steps |
| `vite.config.ts` | Vite + Tailwind configuration |
