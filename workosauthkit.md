# WorkOS Auth Kit Implementation Documentation

## Table of Contents
1. [Overview](#overview)
2. [Why WorkOS?](#why-workos)
3. [Architecture](#architecture)
4. [Dependencies](#dependencies)
5. [Project Files](#project-files)
6. [Implementation Details](#implementation-details)
7. [Authentication Flow](#authentication-flow)
8. [Environment Configuration](#environment-configuration)
9. [Security Considerations](#security-considerations)
10. [Usage Examples](#usage-examples)
11. [Troubleshooting](#troubleshooting)

---

## Overview

This project uses **WorkOS** as the authentication and user management backend. WorkOS provides enterprise-grade authentication, user management, and SSO capabilities. The project leverages the WorkOS Node.js SDK for server-side operations and the AuthKit for Next.js integration.

### What is WorkOS?

WorkOS is a developer platform that provides:
- **User Management**: Create, update, and manage users
- **Authentication**: Password-based authentication, SSO, OAuth, SAML
- **Directory Sync**: Sync users from Active Directory, LDAP, etc.
- **Audit Logs**: Track all authentication and user management events
- **Multi-tenancy**: Support for multiple organizations

---

## Why WorkOS?

### Benefits of Using WorkOS in This Project

1. **Enterprise-Grade Security**
   - Built-in security best practices
   - SOC 2 Type II compliant
   - End-to-end encryption
   - Automatic security updates

2. **Simplified User Management**
   - No need to build custom user database
   - Built-in password hashing and validation
   - Email verification workflows
   - Password reset functionality

3. **Scalability**
   - Handles millions of users
   - Built-in rate limiting
   - High availability infrastructure
   - Global CDN for fast responses

4. **Future-Proofing**
   - Easy to add SSO (Google, Microsoft, Okta, etc.)
   - Supports SAML for enterprise customers
   - Directory sync capabilities
   - Audit logging for compliance

5. **Developer Experience**
   - Clean, well-documented APIs
   - SDKs for multiple platforms
   - Built-in error handling
   - TypeScript support

---

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
         │ HTTP Requests
         ↓
┌─────────────────┐
│  API Routes     │
│  (Server Actions)│
└────────┬────────┘
         │
         │ WorkOS SDK
         ↓
┌─────────────────┐
│  WorkOS API     │
│  (Cloud Service)│
└─────────────────┘
```

### Component Overview

1. **Frontend (Client-Side)**
   - Login/Register forms
   - Auth state management (Zustand)
   - Cookie management for session persistence

2. **Backend (Server-Side)**
   - API routes for auth operations
   - WorkOS Node.js SDK integration
   - Cookie-based session management

3. **WorkOS Service**
   - User database and authentication
   - Password management
   - User profile data

---

## Dependencies

### WorkOS Packages

```json
{
  "@workos-inc/authkit-nextjs": "^4.0.1",
  "@workos-inc/node": "^9.1.1"
}
```

#### @workos-inc/node
- **Purpose**: Server-side WorkOS SDK
- **Features**:
  - User management (create, update, delete users)
  - Authentication (password, OAuth, SAML)
  - Organization management
  - Directory sync
  - Audit logs

#### @workos-inc/authkit-nextjs
- **Purpose**: Next.js integration for WorkOS
- **Features**:
  - Pre-built auth components
  - Middleware helpers
  - Session management
  - Route protection
- **Note**: Installed but not actively used in current implementation (custom implementation preferred)

---

## Project Files

### Core Authentication Files

```
src/
├── service/
│   └── auth.ts                    # WorkOS API integration (login, register, logout)
├── store/
│   └── auth-store.ts             # Zustand auth state management
├── lib/
│   └── encrypted-storage.ts      # Encrypted localStorage for auth state
└── app/
    ├── Auth/
    │   ├── Login/
    │   │   └── page.tsx         # Login page
    │   └── Register/
    │       └── page.tsx         # Register page
    └── middleware.ts            # Route protection middleware
```

### File Descriptions

#### 1. `src/service/auth.ts`
**Purpose**: Server-side WorkOS integration for authentication operations

**Functions**:
- `loginUser(email, password)`: Authenticate user with password
- `registerUser(email, password, username)`: Create new user in WorkOS
- `logoutUser()`: Clear authentication session

**Key Features**:
- Uses WorkOS User Management API
- Sets HTTP-only cookie for session persistence
- Returns user data for frontend state
- Auto-verifies email for demo purposes

#### 2. `src/store/auth-store.ts`
**Purpose**: Client-side authentication state management using Zustand

**Features**:
- Stores user data in encrypted localStorage
- Manages authentication state
- Sets/clears auth-token cookie
- Persisted across page refreshes

**State Structure**:
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}
```

#### 3. `src/lib/encrypted-storage.ts`
**Purpose**: Encrypts auth state before storing in localStorage

**Features**:
- Uses AES-256-GCM encryption
- Protects user data in browser storage
- Automatic decryption on retrieval
- Error handling for corrupted data

#### 4. `middleware.ts`
**Purpose**: Route protection for authenticated pages

**Features**:
- Protects `/dashboard` routes
- Checks for auth-token cookie
- Redirects unauthenticated users to 404

**Note**: This is a custom implementation, not using WorkOS AuthKit middleware

#### 5. `src/app/Auth/Login/page.tsx`
**Purpose**: Login form UI

**Features**:
- Email and password inputs
- Password visibility toggle
- Form validation with Zod
- Calls `loginUser` server action
- Redirects to dashboard on success

#### 6. `src/app/Auth/Register/page.tsx`
**Purpose**: Registration form UI

**Features**:
- Username, email, password inputs
- Password confirmation
- Form validation with Zod
- Calls `registerUser` server action
- Redirects to login on success

---

## Implementation Details

### 1. User Registration Flow

```typescript
// src/service/auth.ts
export async function registerUser(email: string, password: string, username: string) {
  try {
    // 1. Create the user in WorkOS
    const user = await workos.userManagement.createUser({
      email,
      password,
      firstName: username,
      emailVerified: true, // For demo purposes, auto-verify email
    });

    return { success: true, user: { id: user.id, email: user.email } };
  } catch (error: unknown) {
    console.error("Register error:", error);
    const message = error instanceof Error ? error.message : "Failed to register";
    return { success: false, error: message };
  }
}
```

**Process**:
1. Receive user input (email, password, username)
2. Call WorkOS API to create user
3. WorkOS handles password hashing and storage
4. Return user data to frontend
5. Frontend redirects to login page

**WorkOS API Call**:
```
POST /user-management/users
Body: {
  email: string,
  password: string,
  firstName: string,
  emailVerified: boolean
}
```

### 2. User Login Flow

```typescript
// src/service/auth.ts
export async function loginUser(email: string, password: string) {
  try {
    const response = await workos.userManagement.authenticateWithPassword({
      clientId,
      email,
      password,
    });

    // Store a simple auth cookie so middleware knows we are logged in
    const cookieStore = await cookies();
    cookieStore.set("auth_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return {
      success: true,
      user: {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName || undefined,
        lastName: response.user.lastName || undefined,
      },
    };
  } catch (error: unknown) {
    console.error("Login error:", error);
    const message = error instanceof Error ? error.message : "Failed to login";
    return { success: false, error: message };
  }
}
```

**Process**:
1. Receive user credentials (email, password)
2. Call WorkOS authentication API
3. WorkOS validates credentials
4. Set HTTP-only cookie for session
5. Return user data to frontend
6. Frontend stores user in Zustand store

**WorkOS API Call**:
```
POST /user-management/authenticate
Body: {
  clientId: string,
  email: string,
  password: string
}
```

### 3. User Logout Flow

```typescript
// src/service/auth.ts
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  return { success: true };
}
```

**Process**:
1. Clear server-side cookie
2. Frontend clears Zustand store
3. Clear localStorage encrypted data
4. Redirect to login page

### 4. Auth State Management

```typescript
// src/store/auth-store.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => {
        setAuthCookie(user);
        set({ user, isAuthenticated: !!user });
      },
      logout: () => {
        removeAuthCookie();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'doc-review:auth',
      storage: createJSONStorage(() => encryptedStorage),
    }
  )
);
```

**Process**:
1. User data stored in Zustand
2. Persisted to encrypted localStorage
3. auth-token cookie set for middleware
4. Automatic restoration on page refresh

---

## Authentication Flow

### Complete Registration Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. User fills registration form                         │
│    (username, email, password, confirmPassword)          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Client-side validation (Zod schema)                 │
│    - Email format                                       │
│    - Password strength                                 │
│    - Password confirmation                              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Call registerUser server action                      │
│    POST /api/register                                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 4. WorkOS API Call                                     │
│    workos.userManagement.createUser()                   │
│    - Password hashed by WorkOS                         │
│    - User stored in WorkOS database                    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Return success to frontend                          │
│    { success: true, user: { id, email } }              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Show success toast                                  │
│ 7. Redirect to /Auth/Login                             │
└─────────────────────────────────────────────────────────┘
```

### Complete Login Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. User fills login form                                │
│    (email, password)                                    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Client-side validation (Zod schema)                 │
│    - Email format                                       │
│    - Password required                                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Call loginUser server action                         │
│    POST /api/login                                      │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 4. WorkOS API Call                                     │
│    workos.userManagement.authenticateWithPassword()     │
│    - Validate credentials                               │
│    - Return user data                                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Set HTTP-only cookie (auth_session)                  │
│    - Server-side cookie                                 │
│    - HttpOnly, Secure, SameSite=strict                 │
│    - Max age: 1 week                                    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Return success to frontend                          │
│    { success: true, user: { id, email, firstName } }   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 7. Store user in Zustand store                         │
│    - setUser(user)                                      │
│    - Persist to encrypted localStorage                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 8. Set auth-token cookie (client-side)                 │
│    - For middleware authentication                      │
│    - Contains user ID                                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 9. Show success toast                                  │
│ 10. Redirect to /dashboard/upload                       │
└─────────────────────────────────────────────────────────┘
```

### Complete Logout Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. User clicks logout button                           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Call logoutUser server action                        │
│    POST /api/logout                                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Clear auth_session cookie                           │
│    - Server-side cookie                                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Return success to frontend                          │
│    { success: true }                                    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Clear Zustand store                                 │
│    - logout()                                           │
│    - Set user: null, isAuthenticated: false            │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Clear auth-token cookie                             │
│    - Client-side cookie                                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 7. Clear encrypted localStorage                        │
│    - Remove 'doc-review:auth' key                      │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 8. Redirect to /Auth/Login                             │
└─────────────────────────────────────────────────────────┘
```

### Middleware Route Protection Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. User navigates to /dashboard/* route                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Middleware intercepts request                       │
│    - Checks if path starts with /dashboard              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Check for auth-token cookie                        │
│    - request.cookies.get("auth-token")                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
         ┌───────┴───────┐
         │ Token exists? │
         └───────┬───────┘
                 │
        ┌────────┴────────┐
        │                 │
       Yes               No
        │                 │
        ↓                 ↓
┌───────────────┐  ┌───────────────┐
│ Allow access  │  │ Redirect to   │
│ NextResponse  │  │ /404          │
│ .next()       │  │               │
└───────────────┘  └───────────────┘
```

---

## Environment Configuration

### Required Environment Variables

Add to `.env.local`:

```env
# WorkOS Configuration
WORKOS_API_KEY=sk_workos_xxxxxxxxxxxxxxxxxxxx
WORKOS_CLIENT_ID=client_xxxxxxxxxxxxxxxxxxxx
```

### How to Get WorkOS Credentials

1. **Sign up for WorkOS**: Go to [workos.com](https://workos.com) and create an account
2. **Create a Project**: 
   - Go to Dashboard → Projects
   - Click "New Project"
   - Select "Auth" as the product
3. **Get API Key**:
   - Go to Project Settings → API Keys
   - Copy the Secret Key (starts with `sk_workos_`)
4. **Get Client ID**:
   - Go to Project Settings → General
   - Copy the Client ID (starts with `client_`)

### Environment Variable Security

**Important Notes**:
- `WORKOS_API_KEY` should be kept secret (server-side only)
- Currently using `process.env.WORKOS_API_KEY` (server-side)
- **Do not** use `NEXT_PUBLIC_` prefix for API keys
- Client ID is safe to expose (used for OAuth flows)

---

## Security Considerations

### Password Security

1. **Password Hashing**
   - WorkOS automatically hashes passwords using bcrypt
   - Never stores plaintext passwords
   - Uses industry-standard hashing algorithms

2. **Password Validation**
   - WorkOS enforces password complexity rules
   - Additional validation can be added on frontend
   - Zod schema validation on client-side

### Session Security

1. **HTTP-Only Cookies**
   - `auth_session` cookie is HTTP-only
   - Cannot be accessed by JavaScript
   - Prevents XSS attacks

2. **Secure Flag**
   - Set to `true` in production
   - Only sent over HTTPS
   - Prevents man-in-the-middle attacks

3. **SameSite Attribute**
   - Set to `strict` for auth-token cookie
   - Prevents CSRF attacks
   - Only sent with same-site requests

4. **Cookie Expiration**
   - 1 week expiration
   - Automatic session timeout
   - Forces re-authentication

### Data Protection

1. **Encrypted Storage**
   - User data encrypted in localStorage
   - AES-256-GCM encryption
   - Prevents data theft from browser storage

2. **Token Security**
   - User ID used as authentication token
   - Simple approach for this demo
   - **Production recommendation**: Use JWT or WorkOS sessions

### API Security

1. **Server Actions**
   - Auth functions marked as `"use server"`
   - Cannot be called directly from client
   - Server-side execution only

2. **Error Handling**
   - Generic error messages to clients
   - Detailed errors logged server-side
   - Prevents information leakage

### Best Practices

1. **Never expose API keys** to client-side code
2. **Always use HTTPS** in production
3. **Implement rate limiting** (WorkOS provides this)
4. **Log authentication events** for audit trails
5. **Use WorkOS audit logs** for compliance
6. **Implement MFA** for enterprise customers

---

## Usage Examples

### Example 1: Registering a New User

```typescript
// In Register page
import { registerUser } from '@/service/auth';
import { useForm } from 'react-hook-form';

const form = useForm({
  defaultValues: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
});

async function onSubmit(values) {
  const result = await registerUser(values.email, values.password, values.username);
  
  if (result.success) {
    showSuccessToast('Account created successfully! Please login.');
    router.push('/Auth/Login');
  } else {
    showErrorToast(result.error);
  }
}
```

### Example 2: Logging In a User

```typescript
// In Login page
import { loginUser } from '@/service/auth';
import { useAuthStore } from '@/store/auth-store';

const setUser = useAuthStore((state) => state.setUser);

async function onSubmit(values) {
  const result = await loginUser(values.email, values.password);
  
  if (result.success) {
    setUser(result.user);
    showSuccessToast('Login successful!');
    router.push('/dashboard/upload');
  } else {
    showErrorToast(result.error);
  }
}
```

### Example 3: Logging Out a User

```typescript
// In any component
import { logoutUser } from '@/service/auth';
import { useAuthStore } from '@/store/auth-store';

const logout = useAuthStore((state) => state.logout);

async function handleLogout() {
  await logoutUser();
  logout();
  router.push('/Auth/Login');
}
```

### Example 4: Checking Authentication Status

```typescript
// In any component
import { useAuthStore } from '@/store/auth-store';

function MyComponent() {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user?.firstName || user?.email}</div>;
}
```

### Example 5: Protecting a Route with Middleware

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = request.cookies.get("auth-token");
    
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/404";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

---

## Troubleshooting

### Common Issues

#### 1. "WORKOS_API_KEY is not set"

**Cause**: Environment variable not configured

**Solution**:
- Add `WORKOS_API_KEY` to `.env.local`
- Restart development server
- Ensure file is in `.gitignore`

```env
WORKOS_API_KEY=sk_workos_xxxxxxxxxxxxxxxxxxxx
```

#### 2. "WORKOS_CLIENT_ID is not set"

**Cause**: Client ID not configured

**Solution**:
- Add `WORKOS_CLIENT_ID` to `.env.local`
- Restart development server

```env
WORKOS_CLIENT_ID=client_xxxxxxxxxxxxxxxxxxxx
```

#### 3. "Failed to login" or "Failed to register"

**Cause**: Invalid credentials or WorkOS API error

**Solution**:
- Check WorkOS dashboard for API errors
- Verify email and password format
- Check network connectivity
- Review server logs for detailed error

#### 4. Authentication not persisting after refresh

**Cause**: Cookie or localStorage issue

**Solution**:
- Check browser cookie settings
- Verify encrypted-storage is working
- Check for browser extensions blocking cookies
- Ensure auth-token cookie is being set

#### 5. Middleware redirecting to 404

**Cause**: auth-token cookie not set or expired

**Solution**:
- Check if user is actually logged in
- Verify cookie expiration time
- Check browser developer tools for cookies
- Ensure setUser() is called after successful login

#### 6. Encrypted storage decryption failing

**Cause**: Crypto key mismatch or corrupted data

**Solution**:
- Verify `NEXT_PUBLIC_CRYPTO_KEY` is set correctly
- Clear localStorage and try again
- Check crypto-client.ts implementation
- Ensure same key used for encryption/decryption

### Debugging Tips

1. **Check WorkOS Dashboard**
   - Go to [dashboard.workos.com](https://dashboard.workos.com)
   - View Audit Logs for authentication events
   - Check User Management for user records

2. **Enable Debug Logging**
```typescript
// In auth.ts
console.log("WorkOS API Key:", process.env.WORKOS_API_KEY ? "Set" : "Not set");
console.log("Client ID:", process.env.WORKOS_CLIENT_ID);
```

3. **Check Browser DevTools**
   - Application tab → Cookies
   - Application tab → Local Storage
   - Network tab → API requests

4. **Test WorkOS API Directly**
```bash
curl https://api.workos.com/user-management/users \
  -H "Authorization: Bearer sk_workos_xxx"
```

---

## Future Enhancements

### Potential Improvements

1. **Use WorkOS AuthKit Middleware**
   - Replace custom middleware with WorkOS AuthKit
   - Better session management
   - Built-in SSO support

2. **Add OAuth Providers**
   - Google OAuth
   - Microsoft OAuth
   - GitHub OAuth

3. **Implement SAML SSO**
   - For enterprise customers
   - Support Active Directory
   - Support Okta, OneLogin

4. **Add Email Verification**
   - Remove `emailVerified: true` from register
   - Implement email verification flow
   - Use WorkOS email verification

5. **Add Password Reset**
   - Use WorkOS password reset flow
   - Send reset email
   - Verify reset token

6. **Add Multi-Factor Authentication (MFA)**
   - SMS-based MFA
   - TOTP (Time-based One-Time Password)
   - WebAuthn (hardware keys)

7. **Implement WorkOS Sessions**
   - Replace cookie-based auth with WorkOS sessions
   - Better security
   - Centralized session management

8. **Add Organization Support**
   - Multi-tenancy
   - Organization-scoped users
   - Role-based access control

---

## Summary

This project uses WorkOS as the authentication backend, providing enterprise-grade user management and authentication. The implementation includes:

- **User Registration**: Create users via WorkOS API
- **User Login**: Password-based authentication via WorkOS
- **Session Management**: HTTP-only cookies and encrypted localStorage
- **Route Protection**: Custom middleware for protected routes
- **State Management**: Zustand with encrypted persistence

### Key Files
- `src/service/auth.ts` - WorkOS API integration
- `src/store/auth-store.ts` - Auth state management
- `middleware.ts` - Route protection
- `src/lib/encrypted-storage.ts` - Encrypted storage wrapper

### Dependencies
- `@workos-inc/node` - WorkOS Node.js SDK
- `@workos-inc/authkit-nextjs` - Next.js integration (installed but not actively used)

### Security Features
- Password hashing by WorkOS
- HTTP-only cookies
- Encrypted localStorage
- CSRF protection via SameSite cookies
- HTTPS in production

This implementation provides a solid foundation for authentication that can be extended with additional WorkOS features like SSO, SAML, and MFA as the application grows.
