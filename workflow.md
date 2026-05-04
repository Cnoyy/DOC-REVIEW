# DocuReview — Project Workflow & Architecture Guide

> **Internal documentation.** This file describes how the project is structured, why each layer exists, and how all the pieces connect. Read this before making changes to any layer.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Clean Architecture Flow](#2-clean-architecture-flow)
3. [Auth Kit Concept](#3-auth-kit-concept)
4. [Auth Guard](#4-auth-guard)
5. [TanStack Query Workflow](#5-tanstack-query-workflow)
6. [Services Layer](#6-services-layer)
7. [Hooks Layer](#7-hooks-layer)
8. [Types](#8-types)
9. [Mock API and Mock Data](#9-mock-api-and-mock-data)
10. [API Routes](#10-api-routes)
11. [Zod Validation](#11-zod-validation)
12. [Zustand Store](#12-zustand-store)
13. [Full Working Flow Example](#13-full-working-flow-example)
14. [Best Practices](#14-best-practices)
15. [Folder Responsibility Table](#15-folder-responsibility-table)

---

## 1. Project Overview

### What this project does

**DocuReview** is a document review management system. It allows users to:

- Upload documents (PDF, DOCX, TXT)
- Get AI-generated suggestions and risk analysis for each document
- Send documents to reviewers via email
- Reviewers can approve, reject, or add suggestions to documents
- Track a full library of documents with filtering and search
- View search history with associated AI suggestions

### How the project is structured

The project is a **Next.js 16 application** using the App Router. It is organized as a frontend-first application where:

- All pages live under `src/app/`
- Business logic is separated into `service/`, `hooks/`, `store/`, and `types/`
- Data comes from Next.js API route handlers (`src/app/api/`) which currently serve mock data
- Authentication is handled server-side with WorkOS and persisted client-side with Zustand

### Why clean architecture is used

Clean architecture separates the application into layers where each layer has a single responsibility and only depends on layers below it — never above. In this project this means:

- **UI components** never fetch data directly
- **Hooks** manage component-level state and orchestrate service calls
- **Services** own all data-fetching logic and know nothing about React
- **Types** define the shape of every piece of data and are shared everywhere
- **Stores** hold only global client state (auth, upload preload)

This separation makes the codebase easier to test, easier to extend, and easier to swap pieces (for example, replacing mock data with a real backend) without touching components.

---

## 2. Clean Architecture Flow

### Layered structure

```
┌─────────────────────────────────────────────┐
│              UI Components / Pages           │  ← Renders UI, reads hook output
├─────────────────────────────────────────────┤
│              Custom Hooks (hooks/)           │  ← Orchestrates state + service calls
├─────────────────────────────────────────────┤
│     TanStack Query (useQuery / useMutation)  │  ← Manages server state + caching
├─────────────────────────────────────────────┤
│              Services (service/)             │  ← All API call logic lives here
├─────────────────────────────────────────────┤
│    Next.js API Routes (app/api/) + Mock API  │  ← Endpoint handlers + mock responses
├─────────────────────────────────────────────┤
│              Mock Data (mock/data/)          │  ← Static typed data used as fallback
├─────────────────────────────────────────────┤
│              Types (types/)                  │  ← Shared across every layer
└─────────────────────────────────────────────┘
```

### Data flow direction

```
mockData → mockApi (Next.js route) → service → hook (TanStack Query) → component
```

The flow is strictly **one-directional downward**. Components never skip layers to call a service directly, and services never import from hooks or components.

### Folder responsibilities at a glance

| Layer | Folder | What it owns |
|---|---|---|
| Pages & UI | `src/app/` | Route pages, layouts, auth pages |
| Components | `src/components/` | Reusable UI elements |
| Hooks | `src/hooks/` | State orchestration, TanStack Query hooks |
| Services | `src/service/` | All fetch/API calls |
| API Endpoints | `src/app/api/` | Next.js route handlers |
| Mock Data | `src/mock/data/` | Static in-memory data |
| Types | `src/types/` | TypeScript interfaces and types |
| Stores | `src/store/` | Global client state (Zustand) |
| Validation | `src/validation/` | Zod schemas |
| Config | `src/lib/mockapi.ts` | Centralized API URL configuration |
| Providers | `src/providers/` | React context providers (QueryProvider) |

---

## 3. Auth Kit Concept

### What WorkOS AuthKit is used for

This project uses **WorkOS** as the authentication provider. WorkOS handles:

- User creation and management
- Email/password authentication
- Secure session management on the server

The relevant package is `@workos-inc/authkit-nextjs` and `@workos-inc/node`.

### How authentication state is handled

Authentication in this project operates on two levels:

**Server level — WorkOS + HTTP cookie**

The `src/service/auth.ts` file contains three server actions (marked `"use server"`):

- `loginUser(email, password)` — calls WorkOS, sets an `auth_session` HTTP-only cookie on success
- `registerUser(email, password, username)` — creates a user in WorkOS
- `logoutUser()` — deletes the `auth_session` cookie

These functions run on the server and are never exposed to the browser directly.

**Client level — Zustand auth store**

`src/store/auth-store.ts` is a Zustand store with `persist` middleware. After a successful login, the login page calls `setUser(user)` which:

1. Stores the user object and `isAuthenticated: true` in Zustand state
2. Persists this state to `localStorage` under the key `auth-storage`
3. Writes an `auth-token` cookie to the browser for cross-tab access

### Where login / session / token / user handling lives

| Concern | Location |
|---|---|
| Login server action | `src/service/auth.ts` — `loginUser()` |
| Register server action | `src/service/auth.ts` — `registerUser()` |
| Logout server action | `src/service/auth.ts` — `logoutUser()` |
| Client auth state | `src/store/auth-store.ts` — `useAuthStore` |
| Session cookie (server) | Set by `loginUser()`, read by middleware/server |
| Token cookie (client) | Set by `auth-store.ts` `setUser()`, used in API request headers |
| Login page | `src/app/Auth/Login/page.tsx` |
| Register page | `src/app/Auth/Register/page.tsx` |

### How auth connects with the rest of the app

```
Login form
  ↓ submits to
loginUser() server action (src/service/auth.ts)
  ↓ on success
setUser() in Zustand auth-store
  ↓ persists to
localStorage["auth-storage"]
  ↓ read by
AuthGuard component
  ↓ gates access to
All /dashboard/** routes
```

---

## 4. Auth Guard

### How protected routes work

`src/components/auth/AuthGuard.tsx` is a client component that wraps protected sections of the app. It reads the Zustand persisted auth state from `localStorage` and decides whether to render children or block access.

```
AuthGuard mounts
  ↓
reads localStorage["auth-storage"]
  ↓
parses state.isAuthenticated
  ↓
true  → renders children (the protected page)
false → renders NotFound / redirects
null  → shows a loading spinner (auth state not yet resolved)
```

It also listens to the browser's `storage` event so that if the user logs out in another tab, the current tab will also react and block access.

### Where AuthGuard is used

`AuthGuard` is applied at the **dashboard layout level** (`src/app/dashboard/layout.tsx`). This means every page under `/dashboard/**` is protected by a single `<AuthGuard>` wrapper:

```tsx
// src/app/dashboard/layout.tsx
<AuthGuard>
  <div>
    <Sidebar />
    <main>{children}</main>
  </div>
</AuthGuard>
```

This is the correct approach — you protect the layout, not each individual page. Any new page added under `src/app/dashboard/` is automatically protected.

### How to protect other routes

If you ever add routes outside the dashboard that need protection (e.g. `/settings`, `/profile`), wrap their layout or page with `<AuthGuard>` in the same way.

### Role-based access (recommended addition)

The current `AuthGuard` only checks `isAuthenticated`. It does not implement role-based access control (RBAC). If the project grows to need different roles (e.g. `admin`, `reviewer`, `uploader`), the recommended approach is:

1. Store `role` on the user object in `auth-store.ts`
2. Accept a `requiredRole` prop on `AuthGuard`
3. Check both `isAuthenticated` and `user.role === requiredRole` before rendering children

---

## 5. TanStack Query Workflow

### Why TanStack Query

TanStack Query (formerly React Query) is a **server state management library**. It handles:

- Automatic fetching when a component mounts
- Caching responses so the same data is not fetched twice unnecessarily
- Background refetching when data becomes stale
- Loading and error states without manual `useState` boilerplate
- Mutation (create, update, delete) with automatic cache invalidation

### Where it is set up

**Provider** — `src/providers/QueryProvider.tsx`

This is a `"use client"` component that wraps `QueryClientProvider`. It creates a `QueryClient` instance inside `useState` so it is not shared across server requests (required for Next.js App Router):

```tsx
// src/providers/QueryProvider.tsx
"use client";
const [queryClient] = useState(() => new QueryClient({ ... }));
return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
```

**Root wiring** — `src/app/layout.tsx`

`QueryProvider` is placed inside the root layout body, wrapping all children so every page in the app has access to the query context:

```tsx
// src/app/layout.tsx
<body>
  <QueryProvider>
    {children}
  </QueryProvider>
  <Toaster />
</body>
```

### How queries are organized

Query hooks live in `src/hooks/` alongside the existing hooks. The naming convention is:

- **Read operations**: `use{Resource}Query` — e.g. `useDocumentsLibraryQuery`
- **Write operations**: `use{Action}{Resource}Mutation` — e.g. `useDeleteDocumentMutation`

Each query hook:
1. Calls a **service function** inside `queryFn` — never calls `fetch` directly
2. Uses a **stable query key** (an array) that uniquely identifies the data
3. Returns `{ data, loading, error }` to keep the same surface API that components already expect

```typescript
// src/hooks/useDocumentsLibraryQuery.ts
export const DOCUMENTS_LIBRARY_KEY = ["documents-library"] as const;

export function useDocumentsLibraryQuery() {
  const { data, isLoading, error } = useQuery({
    queryKey: DOCUMENTS_LIBRARY_KEY,
    queryFn: () => DocumentsLibraryService.getDocuments(),
    select: (res) => res.data,
  });

  return {
    documents: data ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
```

### How mutations work

Mutations use `useMutation` and call `invalidateQueries` on success so the relevant query automatically refetches:

```typescript
export function useDeleteDocumentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) =>
      DocumentsLibraryService.deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_LIBRARY_KEY });
    },
  });
}
```

### Current TanStack Query hooks

| Hook file | Exports | Covers |
|---|---|---|
| `useDocumentsLibraryQuery.ts` | `useDocumentsLibraryQuery`, `useDeleteDocumentMutation` | Document library list + delete |
| `useDocumentDetailQuery.ts` | `useDocumentDetailQuery(id)` | Single document detail |
| `useReviewDocumentsQuery.ts` | `useReviewDocumentsQuery`, `useReviewDocDetailQuery(id)` | Reviewer document list + detail |
| `useSearchHistoryQuery.ts` | `useSearchHistoryQuery` | Search history |

### How TanStack Query connects with services

```
TanStack Query hook
  └─ queryFn: () => ServiceClass.methodName()
                         ↓
                    service calls fetch()
                         ↓
                    Next.js API route
                         ↓
                    returns mock data
```

TanStack Query does **not** know about `fetch`, URLs, or mock data. It only calls the service function and manages the result. Services do not know about TanStack Query. This separation means either side can change independently.

---

## 6. Services Layer

### Purpose of the services folder

`src/service/` contains one file per domain area. Each file is a class with static methods. Services are responsible for:

- Constructing the correct API URL using `getApiUrl()` from `src/lib/mockapi.ts`
- Making the `fetch` call with the correct method and headers
- Handling errors and falling back to mock data when the API fails
- Returning typed response objects

### What services look like

```typescript
// src/service/documents-library.ts
export class DocumentsLibraryService {
  static async getDocuments(): Promise<DocumentsLibraryResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DOCUMENTS_LIBRARY), {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}` },
      });
      if (!response.ok) throw new Error(`API request failed`);
      return await response.json();
    } catch {
      return getDocumentsLibraryMock(); // falls back to mock data
    }
  }
}
```

### Rules for the services layer

- Services are **pure async functions** — no React, no hooks, no `useState`
- Services are callable from TanStack Query hooks, traditional hooks, and server actions
- Services always return typed data — never raw `any`
- Services never import from `hooks/`, `components/`, or `store/`
- UI components must **never** call services directly

### How services are used by TanStack Query

TanStack Query hooks place service calls inside `queryFn`. Because services return Promises, they slot in naturally without any adapter code.

---

## 7. Hooks Layer

### Purpose of the hooks folder

`src/hooks/` contains two types of custom hooks:

**Traditional React hooks** (existing, using `useState`/`useCallback`)

These were written before TanStack Query was added. They manage loading/error state manually and use Zustand stores as an in-memory cache:

- `useDocumentsLibrary` — fetches documents, stores in Zustand, supports delete
- `useDocumentDetail` — fetches a single document detail
- `useReviewDocuments` / `useReviewDocDetail` — fetches reviewer queue
- `useSearchHistory` — fetches search history with Zustand caching
- `useAISuggestions` — fetches AI suggestions, supports preloading
- `useSendToReviewer` — handles email validation and submission
- `useReviewActions` — handles approve / reject / suggest actions

**TanStack Query hooks** (new, using `useQuery`/`useMutation`)

These replace the manual `useState` + Zustand cache pattern with TanStack Query's built-in caching:

- `useDocumentsLibraryQuery` + `useDeleteDocumentMutation`
- `useDocumentDetailQuery`
- `useReviewDocumentsQuery` + `useReviewDocDetailQuery`
- `useSearchHistoryQuery`

### Difference between traditional and TanStack Query hooks

| Feature | Traditional hook | TanStack Query hook |
|---|---|---|
| Data fetching trigger | Manual `useEffect` + function call | Automatic on mount |
| Caching | Zustand store | TanStack Query cache |
| Refetch on window focus | No | Yes (configurable) |
| Background refresh | No | Yes (staleTime-based) |
| Loading/error state | Manual `useState` | Built-in `isLoading`, `error` |
| Mutation invalidation | Manual store update | `invalidateQueries` |
| Code per hook | ~60–90 lines | ~20 lines |

### How hooks keep components clean

Components only call one or two hooks and destructure the values they need:

```tsx
// Library page — component sees no fetch logic, no error handling, no cache management
const { documents, loading, error } = useDocumentsLibraryQuery();
const deleteMutation = useDeleteDocumentMutation();
```

All the complexity of when to fetch, how to cache, and what to do on error is hidden inside the hook layer.

---

## 8. Types

### Where types are defined

All TypeScript interfaces and types live in `src/types/`. There is one file per domain area:

- `types/documents-library.ts` — `DocumentLibraryItem`, `DocumentDetail`, `DocumentsLibraryResponse`, `DocumentDetailResponse`, `ReviewerStatus`, etc.
- `types/review-documents.ts` — `ReviewDocument`, `ReviewDocDetail`, `ReviewDocumentsResponse`, `ReviewActionResponse`, `ReviewStatus`, etc.
- `types/search-history.ts` — `SearchHistoryItem`, `SearchHistoryResponse`
- `types/ai-suggestion.ts` — `AISuggestionResponse`, `RiskFlag`
- `types/send-to-reviewer.ts` — `SendToReviewerRequest`, `SendToReviewerResponse`, `EmailValidationResult`

### How types are shared

```
types/
  ↓ imported by
services/     ← for function return types and request/response shapes
hooks/        ← for state type annotations
mock/data/    ← mock data is typed against these interfaces
components/   ← for prop types and display logic
store/        ← Zustand state is typed against these interfaces
```

Types flow down from `types/` to every other layer. No layer defines its own local types for shared data shapes.

### Why type safety matters

- Catches mismatches between what the API returns and what the component expects at **compile time**, not at runtime
- Makes refactoring safe — renaming a field in `types/` shows every broken reference immediately
- Enables IDE autocomplete across the entire codebase
- Prevents the mock data from drifting out of sync with what the UI expects

---

## 9. Mock API and Mock Data

### Architecture of the mock system

This project uses a two-level mock system:

```
src/mock/data/         ← Level 1: Static typed data arrays
src/app/api/           ← Level 2: Next.js route handlers that serve mock data
src/service/           ← Calls the route handlers; falls back to level 1 on error
```

This means the services always go through a real HTTP call (to `localhost:3000/api/...`), which means they exercise the full request/response path even during frontend-only development.

### Mock data files

| File | Contains |
|---|---|
| `mock/data/documents-library.ts` | 17 sample documents with statuses, types, dates |
| `mock/data/document-detail.ts` | Detailed view of each document including AI summary |
| `mock/data/review-documents.ts` | 9 documents in the reviewer queue |
| `mock/data/reviewdoc-detail.ts` | Full detail view for reviewer |
| `mock/data/ai-suggestion.ts` | AI-generated summary, risk flags, recommendations |
| `mock/data/search-history.ts` | 3 historical search entries with attached AI data |
| `mock/data/review-actions.ts` | Mock responses for approve / reject / suggest |
| `mock/data/send-to-reviewer.ts` | Mock email sending and validation logic |

### How mock data connects to API routes

Each Next.js API route handler imports the corresponding mock data function and returns it as a JSON response:

```typescript
// src/app/api/documents-library/route.ts
import { getDocumentsLibraryMock } from '@/mock/data/documents-library';

export async function GET() {
  const result = await getDocumentsLibraryMock();
  return NextResponse.json(result, { status: 200 });
}
```

### How to replace mock data with a real backend

Because services are the only place that knows about URLs, replacing mock data with a real backend requires changes **only in the services layer**:

1. Update `src/lib/mockapi.ts` — point `BASE_URL` to your real backend
2. Update each service method to parse the real API response format if it differs
3. The mock data files and Next.js API routes can remain as a development fallback

No hook, component, store, or type file needs to change.

---

## 10. API Routes

### Centralized API configuration

All API endpoint paths are defined in one place: `src/lib/mockapi.ts`.

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000/api',
  ENDPOINTS: {
    DOCUMENTS_LIBRARY: '/documents-library',
    DOCUMENT_DETAIL:   '/document-detail',
    REVIEW_DOCUMENTS:  '/Review-documents',
    REVIEWDOC_DETAIL:  '/reviewdoc-detail',
    AI_SUGGESTION:     '/ai-suggestion',
    SEND_TO_REVIEWER:  '/send-to-reviewer',
    SENT_SUGGESTION:   '/sent-suggestion',
    ACCEPT_BY_REVIEWER:'/accept-byreviewer',
    REJECT_BY_REVIEWER:'/reject-by-reviewer',
    SEARCH_HISTORY:    '/search-history',
  }
} as const;

export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}
```

### Why paths must not be hardcoded in components or services

If API paths are scattered across many files, a single endpoint rename becomes a search-and-replace task across the whole codebase. With centralized config:

- Changing `/documents-library` to `/docs` is a one-line edit
- TypeScript's `as const` makes every key a literal type — a typo causes a compile error
- `BASE_URL` switches automatically between development and production environments

### How services use the config

Services call `getApiUrl()` and pass the endpoint constant:

```typescript
const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DOCUMENTS_LIBRARY));
```

---

## 11. Zod Validation

### What Zod is used for

Zod is a TypeScript-first schema declaration and validation library. In this project it is used for **form input validation** on the client side. All Zod schemas live in `src/validation/`.

### Current schemas

**`src/validation/auth.ts`**

- `loginSchema` — validates email format and password minimum length (6 characters)
- `registerSchema` — validates username, email, password, and matching `confirmPassword`
- `reviewerEmailSchema` — validates a single reviewer email address

**`src/validation/document.ts`**

- `documentSchema` — validates document name, file size, and MIME type (PDF, DOCX, TXT only)
- `documentFileSchema` — validates a raw `File` object for type and non-zero size

### How Zod connects with forms

Zod integrates with `react-hook-form` through the `@hookform/resolvers` package:

```typescript
// src/app/Auth/Login/page.tsx
const form = useForm<z.infer<typeof loginSchema>>({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: "", password: "" },
});
```

The Zod schema acts as the single source of truth for both:
- The **TypeScript type** of the form values (`z.infer<typeof loginSchema>`)
- The **runtime validation rules** applied when the form is submitted

### Recommended addition — API response validation

Currently Zod is only used for form inputs. For production resilience, Zod schemas can also be used to validate API responses in the service layer, ensuring the shape of data returned by the backend matches what the frontend expects before it reaches the UI.

---

## 12. Zustand Store

### What Zustand is used for

Zustand is a lightweight global state manager. It is used for **client-side / UI state** — state that does not come from a server response and does not need to be cached or refetched.

### Current stores

| Store file | Persisted? | What it holds |
|---|---|---|
| `auth-store.ts` | Yes (`localStorage`) | `user` object, `isAuthenticated` flag |
| `documents-library-store.ts` | No | Cached documents list (used by traditional hook) |
| `review-documents-store.ts` | No | Cached reviewer documents list (used by traditional hook) |
| `search-history-store.ts` | No | Cached search history (used by traditional hook) |
| `upload-preload-store.ts` | No | File selected in upload step + pre-fetched AI suggestions |

### The golden rule: server state vs client state

This is the most important distinction when using TanStack Query alongside Zustand:

| State type | Definition | Managed by |
|---|---|---|
| **Server state** | Data that lives on the server and is fetched over a network | **TanStack Query** |
| **Client / UI state** | State that lives only in the browser and is not stored on any server | **Zustand** |

**Examples of server state** (use TanStack Query):
- List of documents from the API
- Document detail for a given ID
- Review queue
- Search history
- AI suggestions for a document

**Examples of client/UI state** (use Zustand):
- `isAuthenticated` + current user object
- Sidebar open/closed
- Active filter tab
- Selected theme
- Preloaded file before upload confirmation

### What to migrate over time

The three data-caching Zustand stores (`documents-library-store`, `review-documents-store`, `search-history-store`) were created to cache server responses before TanStack Query was introduced. Now that TanStack Query provides its own cache for these resources, these stores are redundant for the query-based hooks. They remain in use by the traditional hooks and should not be removed until those hooks are fully replaced.

Going forward, **do not create new Zustand stores for server data**. Use TanStack Query for anything that is fetched from an API.

---

## 13. Full Working Flow Example

### Document library data flow

Here is a complete trace of how the documents library page loads data:

```
1. User navigates to /dashboard/library
      ↓
2. DashboardLayout renders — AuthGuard checks localStorage["auth-storage"]
      ↓ (isAuthenticated: true)
3. LibraryPage renders — calls useDocumentsLibraryQuery()
      ↓
4. TanStack Query checks its cache for key ["documents-library"]
      ↓ (cache miss — first load)
5. TanStack Query calls queryFn → DocumentsLibraryService.getDocuments()
      ↓
6. Service calls fetch("http://localhost:3000/api/documents-library")
      ↓
7. Next.js route handler (src/app/api/documents-library/route.ts) handles GET
      ↓
8. Route handler calls getDocumentsLibraryMock()
      ↓
9. Mock data (src/mock/data/documents-library.ts) returns 17 typed documents
      ↓
10. Route handler returns NextResponse.json({ success: true, data: [...], total: 17 })
      ↓
11. Service receives the response and returns it
      ↓
12. TanStack Query receives the result, stores it in cache, sets isLoading: false
      ↓
13. useDocumentsLibraryQuery returns { documents: [...], loading: false, error: null }
      ↓
14. LibraryPage renders the table with 17 documents
```

### Delete flow (mutation)

```
1. User clicks delete on a document
      ↓
2. ConfirmDialog opens (local component state)
      ↓
3. User confirms — handleConfirmDelete calls deleteMutation.mutateAsync(documentId)
      ↓
4. TanStack Query calls mutationFn → DocumentsLibraryService.deleteDocument(documentId)
      ↓
5. Service calls fetch("/api/delete", { method: "DELETE", body: { documentId } })
      ↓
6. Route handler processes the delete (or returns mock success)
      ↓
7. Service returns { success: true, message: "Deleted" }
      ↓
8. onSuccess fires → queryClient.invalidateQueries(["documents-library"])
      ↓
9. TanStack Query marks the documents list as stale and refetches automatically
      ↓
10. Library table re-renders with the updated list
```

### Auth flow

```
1. User submits the login form
      ↓
2. Zod schema validates email + password (via zodResolver in react-hook-form)
      ↓ (valid)
3. onSubmit calls loginUser(email, password) — a Next.js server action
      ↓
4. Server action calls WorkOS authenticateWithPassword()
      ↓ (success)
5. Server sets httpOnly auth_session cookie
6. Server returns { success: true, user: { id, email, firstName } }
      ↓
7. Login page calls useAuthStore.setUser(user)
      ↓
8. Zustand store sets isAuthenticated: true, persists to localStorage["auth-storage"]
      ↓
9. Router pushes to /dashboard/upload
      ↓
10. DashboardLayout mounts AuthGuard
11. AuthGuard reads localStorage["auth-storage"] → isAuthenticated: true
12. AuthGuard renders dashboard children — user is in
```

---

## 14. Best Practices

### Component layer
- Components only call custom hooks — never services, stores, or fetch directly
- Components only own **local UI state** (which dialog is open, current page number, etc.)
- Keep components focused on rendering — all logic belongs in hooks

### Hooks layer
- Use TanStack Query hooks for any data that comes from an API
- Use traditional hooks (or add TanStack Query) for actions like AI suggestions and reviewer actions
- Keep hook return shapes consistent: `{ data, loading, error }` plus action functions

### Services layer
- One file per domain (documents, reviews, auth, AI suggestions, etc.)
- Every service method has an explicit return type using types from `src/types/`
- Always handle errors gracefully and fall back to mock data in development
- Never import from React or any hook inside a service

### Types layer
- All shared interfaces live in `src/types/` — never define inline types for shared data
- Use `z.infer<typeof schema>` to derive form types from Zod schemas instead of writing duplicate interfaces

### Validation layer
- Validate all user input with Zod before it reaches a service
- Use `zodResolver` from `@hookform/resolvers` to wire Zod schemas directly to `react-hook-form`

### State management
- TanStack Query owns all server state (lists, details, responses)
- Zustand owns auth state, upload preload state, and any UI state that must survive route changes
- Do not duplicate server data into Zustand stores

### Mock data
- Mock data files must always match the type definitions in `src/types/`
- Never put mock data inside components or hooks — it belongs in `src/mock/data/`

### General
- Do not hardcode API paths in components or services — use `API_CONFIG.ENDPOINTS`
- Follow the `use{Resource}Query` / `use{Action}{Resource}Mutation` naming convention for new hooks
- Add new routes to `API_CONFIG.ENDPOINTS` in `src/lib/mockapi.ts` before building a new feature

---

## 15. Folder Responsibility Table

| Folder / File | Purpose | Used By | Example |
|---|---|---|---|
| `src/app/` | Next.js pages and layouts using the App Router | End users via browser | `dashboard/library/page.tsx` renders the document table |
| `src/app/api/` | Next.js route handlers — serve mock or real data as HTTP endpoints | Services | `api/documents-library/route.ts` handles GET requests |
| `src/components/` | Reusable UI components and layout primitives | Pages and other components | `Sidebar`, `AuthGuard`, `ConfirmDialog`, `Button` |
| `src/hooks/` | Custom React hooks — orchestrate state, service calls, TanStack Query | Pages and components | `useDocumentsLibraryQuery()`, `useAISuggestions()` |
| `src/service/` | All data-fetching logic — fetch calls, error handling, mock fallback | TanStack Query hooks, traditional hooks | `DocumentsLibraryService.getDocuments()` |
| `src/types/` | TypeScript interfaces and type aliases shared across the codebase | Services, hooks, components, stores, mock data | `DocumentLibraryItem`, `ReviewDocument`, `ReviewerStatus` |
| `src/mock/data/` | Static typed arrays used as fallback data during frontend-only development | API route handlers and services (as fallback) | `getDocumentsLibraryMock()` returns 17 documents |
| `src/store/` | Zustand global state stores | Components and hooks | `useAuthStore` — `isAuthenticated`, `setUser()`, `logout()` |
| `src/validation/` | Zod schemas for form input and data validation | Auth pages, upload forms | `loginSchema`, `documentSchema` |
| `src/lib/mockapi.ts` | Centralized API URL config — base URL and all endpoint paths | Services | `getApiUrl(API_CONFIG.ENDPOINTS.DOCUMENTS_LIBRARY)` |
| `src/lib/theme.ts` | Centralized Tailwind class strings for layout and theming | Pages and layout components | `layout.page`, `layout.dashboard` |
| `src/lib/utils.ts` | General utility functions (e.g. `cn()` for class merging) | Components | `cn("base-class", conditionalClass)` |
| `src/providers/` | React context providers that wrap the app | Root layout | `QueryProvider` wraps all children with `QueryClientProvider` |
| `src/constants/` | Static constants shared across the app | Components and hooks | `navigation.ts` — sidebar nav items |
| `src/app/Auth/` | Login and Register pages | Unauthenticated users | `Auth/Login/page.tsx` — login form with WorkOS |
| `src/app/dashboard/` | All protected dashboard pages | Authenticated users | `library/`, `reviewer/`, `search/`, `upload/` |
| `src/components/auth/AuthGuard.tsx` | Blocks unauthenticated access to protected routes | Dashboard layout | Wraps entire dashboard — reads `auth-storage` from localStorage |
| `src/service/auth.ts` | WorkOS server actions for login, register, logout | Login and Register pages | `loginUser()` calls WorkOS, sets session cookie |

---

*This document reflects the architecture as of the current codebase state. Update it whenever a new layer, pattern, or significant dependency is introduced.*
