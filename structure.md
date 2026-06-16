# Doc-Reviewer Project Structure Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [WorkOS Authentication](#workos-authentication)
6. [AuthGuard & Middleware](#authguard--middleware)
7. [404 Page Concept](#404-page-concept)
8. [Services](#services)
9. [Types](#types)
10. [Mock API & Data](#mock-api--data)
11. [Validation](#validation)
12. [Lib](#lib)
13. [Environment Variables](#environment-variables)
14. [Components](#components)
15. [API Routes](#api-routes)
16. [App Pages](#app-pages)
17. [TanStack Query](#tanstack-query)
18. [Zod](#zod)
19. [Zustand](#zustand)
20. [WorkOS AuthKit](#workos-authkit)
21. [WebCrypto](#webcrypto)

---

## Project Overview

**Project**: Doc-Reviewer - Document review platform with AI analysis

**Key Features**: WorkOS auth, document upload, AI suggestions, encrypted storage

---

## Architecture

```
Frontend (Client) → TanStack Query → Services → API Routes → WorkOS API
     ↓                ↓              ↓           ↓              ↓
  Pages          Data Fetching   Business Logic  Server Logic  User Auth
  Components      Caching         Validation     Encryption   User Mgmt
```

---

## Technology Stack

- **Next.js 16.2.4** - React framework
- **TypeScript** - Type safety
- **WorkOS** - Authentication (@workos-inc/node@9.1.1)
- **Zustand** - State management
- **TanStack Query** - Data fetching & caching
- **Zod** - Schema validation
- **WebCrypto** - Client-side encryption
- **Tailwind CSS** - Styling
- **Shadcn UI** - UI components

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── 404/               # 404 page
│   ├── Auth/              # Login/Register pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── auth/              # AuthGuard
│   ├── dashboard/         # Dashboard components
│   └── ui/                # Shadcn UI components
├── hooks/                 # Custom hooks
├── lib/                   # Utilities (crypto, theme, etc.)
├── mock/                  # Mock data
├── service/               # Business logic
├── store/                 # Zustand stores
├── types/                 # TypeScript types
└── validation/            # Zod schemas
middleware.ts              # Route protection
```

---

## WorkOS Authentication

### Files
- `src/service/auth.ts` - WorkOS API integration
- `src/store/auth-store.ts` - Auth state management
- `middleware.ts` - Route protection

### Implementation

**auth.ts** - Server-side WorkOS integration:
```typescript
export async function loginUser(email, password) {
  const response = await workos.userManagement.authenticateWithPassword({
    clientId, email, password
  });
  // Set HTTP-only cookie
  cookieStore.set("auth_session", "authenticated", {
    httpOnly: true, secure: true, maxAge: 60*60*24*7
  });
  return { success: true, user: response.user };
}
```

**auth-store.ts** - Client-side state:
```typescript
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => {
        // Clear all localStorage stores
        localStorage.removeItem('doc-review:auth');
        // ... clear other stores
        set({ user: null, isAuthenticated: false });
      }
    }),
    { name: 'doc-review:auth', storage: createJSONStorage(() => encryptedStorage) }
  )
);
```

### Flow
1. User logs in → WorkOS validates → Sets `auth_session` cookie
2. Frontend stores user in Zustand → Persists to encrypted localStorage
3. Redirect to `/dashboard/upload`

---

## AuthGuard & Middleware

### Dual-Layer Protection

**Middleware** (Server-Side):
```typescript
export function middleware(request) {
  if (pathname.startsWith('/dashboard')) {
    const authSession = request.cookies.get("auth_session");
    if (!authSession) {
      return NextResponse.redirect('/404');
    }
  }
  return NextResponse.next();
}
```
- Checks HTTP-only `auth_session` cookie
- Redirects to `/404` if missing
- Cannot be bypassed by client code

**AuthGuard** (Client-Side):
```typescript
export function AuthGuard({ children }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <NotFound />;
  return <>{children}</>;
}
```
- Checks Zustand auth store
- Shows 404 component if not authenticated
- Wraps dashboard layout

### Combined Flow
1. User accesses `/dashboard/*`
2. Middleware checks `auth_session` cookie → Pass/Fail
3. If pass, dashboard layout renders
4. AuthGuard checks Zustand store → Pass/Fail
5. Both must pass for access

---

## 404 Page Concept

### Implementation

**Component** (`src/components/ui/404.tsx`):
```typescript
export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p>Page not found</p>
      <Link href="/Auth/Login">Go to Login</Link>
    </div>
  );
}
```

**Page** (`src/app/404/page.tsx`):
```typescript
import { NotFound } from "@/components/ui/404";
export default function NotFoundPage() {
  return <NotFound />;
}
```

### Usage
- Shown when middleware blocks access (no `auth_session`)
- Shown when AuthGuard blocks access (no auth store)
- Consistent in dev and production

---

## Services

### Purpose
Business logic layer that abstracts API calls and data transformation

### Files
- `auth.ts` - WorkOS authentication
- `ai-suggestion.ts` - AI document analysis
- `documents-library.ts` - Document management
- `review-documents.ts` - Review management
- `search-history.ts` - Search history
- `send-to-reviewer.ts` - Reviewer assignment
- `user-account.ts` - User profile

### Example (documents-library.ts)
```typescript
export class DocumentsLibraryService {
  static async getDocuments() {
    const response = await fetch('/api/documents-library');
    const envelope = await response.json();
    const plaintext = await decryptClient(envelope.data);
    return DocumentsLibraryResponseSchema.parse(JSON.parse(plaintext));
  }
}
```

---

## Types

### Purpose
TypeScript type definitions for type safety

### Files
- `ai-suggestion.ts` - AI suggestion types
- `documents-library.ts` - Document types
- `review-documents.ts` - Review types
- `search-history.ts` - Search history types
- `user-account.ts` - User account types

### Example
```typescript
export interface DocumentLibraryItem {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'TXT';
  uploadedDate: string;
  reviewerStatus: 'approved' | 'pending' | 'rejected';
}
```

---

## Mock API & Data

### Purpose
Development/testing without real backend

### Files
- `lib/mockapi.ts` - API configuration
- `mock/data/*.ts` - Mock data files

### Implementation
```typescript
// mockapi.ts
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  ENDPOINTS: {
    DOCUMENTS_LIBRARY: '/documents-library',
    // ...
  }
};
```

### Usage
Services fall back to mock data when API fails

---

## Validation

### Purpose
Runtime schema validation with Zod

### Files
- `validation/auth.ts` - Auth schemas
- `validation/schemas.ts` - Other schemas

### Example
```typescript
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
```

### Usage
- Form validation (react-hook-form + zod-resolver)
- API response validation in services

---

## Lib

### Purpose
Utility libraries and helpers

### Files
- `crypto-client.ts` - Client-side encryption (WebCrypto)
- `crypto-server.ts` - Server-side encryption (Node crypto)
- `encrypted-storage.ts` - Encrypted localStorage wrapper
- `mockapi.ts` - Mock API config
- `theme.ts` - Tailwind theme
- `utils.ts` - General utilities

### Key: encrypted-storage.ts
```typescript
export const encryptedStorage: StateStorage = {
  getItem: async (name) => {
    const encrypted = localStorage.getItem(name);
    if (!encrypted) return null;
    return await decryptClient(encrypted);
  },
  setItem: async (name, value) => {
    const encrypted = await encryptClient(value);
    localStorage.setItem(name, encrypted);
  }
};
```

---

## Environment Variables

### Required Variables
```env
# WorkOS
WORKOS_API_KEY=sk_workos_xxx
WORKOS_CLIENT_ID=client_xxx

# WebCrypto
NEXT_PUBLIC_CRYPTO_KEY=0123456789abcdef... (64 hex chars)
```

### Security
- `WORKOS_API_KEY` - Server-side only (no NEXT_PUBLIC_)
- `NEXT_PUBLIC_CRYPTO_KEY` - Client-side (for localStorage encryption)

---

## Components

### Structure
```
components/
├── auth/              # AuthGuard
├── dashboard/         # Logo, Sidebar
├── toasts/            # Success, Error, Validation toasts
└── ui/                # Shadcn UI components
```

### Key Components
- `AuthGuard` - Route protection
- `NotFound` - 404 page
- `DocReviewLogo` - Logo
- `Sidebar` - Dashboard navigation

---

## API Routes

### Purpose
Server-side endpoints for data operations

### Files
```
app/api/
├── ai-suggestion/
├── documents-library/
├── user-profile/
├── change-password/
└── ...
```

### Example
```typescript
// app/api/documents-library/route.ts
export async function GET() {
  const result = await getDocumentsLibraryMock();
  const encrypted = encryptServer(JSON.stringify(result));
  return NextResponse.json({ data: encrypted });
}
```

---

## App Pages

### Structure
```
app/
├── 404/               # 404 page
├── Auth/              # Login, Register
├── dashboard/         # Dashboard pages
│   ├── upload/        # Document upload
│   ├── library/       # Document library
│   └── account/       # User account
└── page.tsx           # Home page
```

### Key Pages
- `/Auth/Login` - Login form
- `/Auth/Register` - Registration form
- `/dashboard/upload` - Document upload with AI
- `/dashboard/library` - Document library

---

## TanStack Query

### Why Used
- Automatic caching
- Background refetching
- Loading/error states
- Deduplication

### Files
- `hooks/useDocumentsLibraryQuery.ts`
- `hooks/useReviewDocumentsQuery.ts`
- `hooks/useSearchHistoryQuery.ts`

### Implementation
```typescript
export function useDocumentsLibraryQuery() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['documents-library'],
    queryFn: () => DocumentsLibraryService.getDocuments(),
    staleTime: 5 * 60 * 1000,
  });
  return { documents: data, loading: isLoading, error };
}
```

### Workflow
1. Component calls hook
2. Hook checks cache
3. If cached → Return data
4. If not → Call service → API
5. Cache response → Return data

---

## Zod

### Why Used
- Runtime type validation
- Schema definitions
- Error messages
- TypeScript integration

### Files
- `validation/auth.ts`
- `validation/schemas.ts`
- Service files (response validation)

### Implementation
```typescript
const DocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['PDF', 'DOCX', 'TXT'])
});

// Validate
const result = DocumentSchema.parse(data);
```

### Usage
- Form validation (react-hook-form)
- API response validation
- Type inference

---

## Zustand

### Why Used
- Simple state management
- No boilerplate
- TypeScript support
- Easy persistence

### Files
- `store/auth-store.ts`
- `store/documents-library-store.ts`
- `store/review-documents-store.ts`
- `store/search-history-store.ts`
- `store/upload-preload-store.ts`

### Implementation
```typescript
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    { name: 'doc-review:auth', storage: createJSONStorage(() => encryptedStorage) }
  )
);
```

### Workflow
1. Component calls hook
2. Zustand returns state and actions
3. Component updates state via actions
4. Middleware intercepts (persist, encryption)
5. State persisted to localStorage

---

## WorkOS AuthKit

### Why Used
- Enterprise authentication
- User management
- SSO/SAML support
- Security compliance

### Installation
```json
"@workos-inc/authkit-nextjs": "^4.0.1",
"@workos-inc/node": "^9.1.1"
```

### Implementation
- Custom implementation preferred (not using AuthKit components)
- Direct WorkOS SDK usage in `auth.ts`
- HTTP-only cookie session management

### Benefits
- No custom user database
- Built-in security
- Scalable infrastructure
- Future SSO support

---

## WebCrypto

### Why Used
- Client-side encryption
- Browser native API
- No external dependencies
- Secure localStorage

### Files
- `lib/crypto-client.ts` - Client encryption
- `lib/crypto-server.ts` - Server encryption
- `lib/encrypted-storage.ts` - Storage wrapper

### Algorithm
- **AES-256-GCM** (Authenticated encryption)
- Key: 256 bits (64 hex chars)
- IV: 12 bytes (random per encryption)
- AuthTag: 16 bytes (integrity verification)

### Implementation (crypto-client.ts)
```typescript
export async function encryptClient(plaintext: string): Promise<string> {
  const key = await getKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    encoded
  );
  // Pack: IV | AuthTag | Ciphertext → Base64
  return btoa(String.fromCharCode(...Array.from(packed)));
}

export async function decryptClient(base64: string): Promise<string> {
  const key = await getKey();
  const packed = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const iv = packed.slice(0, 12);
  const authTag = packed.slice(12, 28);
  const ciphertext = packed.slice(28);
  // Decrypt
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    combined
  );
  return new TextDecoder().decode(decrypted);
}
```

### Environment Variable
```env
NEXT_PUBLIC_CRYPTO_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

### Workflow
1. State update → `setItem()`
2. Encrypt data using AES-256-GCM
3. Store encrypted base64 in localStorage
4. Read → `getItem()`
5. Decrypt using AES-256-GCM
6. Return plaintext to state

### Security
- IV unique per encryption
- AuthTag verifies integrity
- Tampering detected
- Encrypted localStorage

---

## Complete Workflow Example: Login & Dashboard Access

```
1. User visits /Auth/Login
   ↓
2. Enters email/password
   ↓
3. Form validation (Zod)
   ↓
4. Call loginUser() server action
   ↓
5. WorkOS validates credentials
   ↓
6. Set auth_session cookie (HTTP-only)
   ↓
7. Return user data to frontend
   ↓
8. Store user in Zustand (encrypted localStorage)
   ↓
9. Redirect to /dashboard/upload
   ↓
10. Middleware checks auth_session cookie → PASS
   ↓
11. Dashboard layout renders
   ↓
12. AuthGuard checks Zustand store → PASS
   ↓
13. Dashboard content displayed
```

---

## Summary

This project implements a secure document review platform with:

- **WorkOS** for enterprise authentication
- **Dual-layer protection** (middleware + AuthGuard)
- **Encrypted storage** (WebCrypto AES-256-GCM)
- **Type safety** (TypeScript + Zod)
- **Data fetching** (TanStack Query)
- **State management** (Zustand)
- **Modern UI** (Shadcn + Tailwind)

All authentication relies on WorkOS `auth_session` cookie, with Zustand providing client-side state persistence via encrypted localStorage.
