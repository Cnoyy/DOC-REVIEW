# Project Workflow Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Project Structure](#project-structure)
4. [Services](#services)
5. [Mock API & Mock Data](#mock-api--mock-data)
6. [TanStack Query Implementation](#tanstack-query-implementation)
7. [Types](#types)
8. [Hooks](#hooks)
9. [Lib](#lib)
10. [Store](#store)
11. [Components](#components)
12. [API Routes](#api-routes)
13. [Pages](#pages)
14. [Data Flow](#data-flow)
15. [Complete Workflow Examples](#complete-workflow-examples)

---

## Project Overview

### Project Name: Doc-Reviewer

**Purpose**: A document review platform that uses AI to analyze documents, manage reviewers, and provide suggestions for improvements.

**Tech Stack**:
- **Framework**: Next.js 16.2.4 (React)
- **Authentication**: WorkOS (User Management)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Encryption**: WebCrypto API (AES-256-GCM)
- **Validation**: Zod
- **Icons**: Lucide React

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Client)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │ Components   │  │    Hooks     │      │
│  │  (UI Layer)  │  │  (Reusable)  │  │ (Data Layer) │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                            ↓                                 │
│                    ┌───────────────┐                         │
│                    │  TanStack     │                         │
│                    │    Query      │                         │
│                    └───────┬───────┘                         │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                      Backend (Server)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ API Routes   │  │   Services   │  │  WorkOS API  │      │
│  │ (Next.js)    │  │ (Business    │  │  (Auth)      │      │
│  │              │  │  Logic)      │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘      │
│         │                  │                                 │
│         └──────────────────┴─────────────────────────────┐  │
│                            │                             │  │
│                            ↓                             │  │
│                    ┌───────────────┐                     │  │
│                    │ Mock API /    │                     │  │
│                    │ Real API      │                     │  │
│                    └───────────────┘                     │  │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Patterns

1. **Service Layer Pattern**: Business logic separated into service files
2. **Repository Pattern**: Services abstract data fetching logic
3. **Custom Hooks Pattern**: Reusable data fetching and state management
4. **Component Composition**: Reusable UI components
5. **Type Safety**: TypeScript throughout the application
6. **Encryption**: Client-side and server-side encryption for sensitive data

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── 404/               # 404 error page
│   ├── Auth/              # Authentication pages (Login, Register)
│   ├── LandingPage/       # Landing page
│   ├── api/               # API routes (server-side)
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
│
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard-specific components
│   ├── toasts/            # Toast notification components
│   └── ui/                # Reusable UI components (Shadcn)
│
├── constants/             # Application constants
│
├── hooks/                 # Custom React hooks
│   ├── useAisuggestions.ts
│   ├── useDocumentDetail.ts
│   ├── useDocumentsLibrary.ts
│   ├── useReviewActions.ts
│   ├── useReviewDocuments.ts
│   ├── useSearchHistory.ts
│   └── useSendToReviewer.ts
│
├── lib/                   # Utility libraries
│   ├── crypto-client.ts   # Client-side encryption (WebCrypto)
│   ├── crypto-server.ts   # Server-side encryption (Node crypto)
│   ├── encrypted-storage.ts # Encrypted localStorage wrapper
│   ├── mockapi.ts         # Mock API configuration
│   ├── theme.ts           # Theme configuration
│   └── utils.ts           # Utility functions
│
├── mock/                  # Mock data for development
│   └── data/              # Mock data files
│
├── providers/             # React context providers
│
├── service/               # Service layer (business logic)
│   ├── ai-suggestion.ts
│   ├── auth.ts
│   ├── document-detail.ts
│   ├── documents-library.ts
│   ├── review-actions.ts
│   ├── review-documents.ts
│   ├── search-history.ts
│   ├── send-to-reviewer.ts
│   └── user-account.ts
│
├── store/                 # Zustand state management
│   ├── auth-store.ts
│   ├── documents-library-store.ts
│   ├── review-documents-store.ts
│   ├── search-history-store.ts
│   └── upload-preload-store.ts
│
├── types/                 # TypeScript type definitions
│   ├── ai-suggestion.ts
│   ├── documents-library.ts
│   ├── review-documents.ts
│   ├── search-history.ts
│   ├── send-to-reviewer.ts
│   └── user-account.ts
│
└── validation/            # Zod validation schemas
    ├── auth.ts
    └── schemas.ts
```

---

## Services

### Overview

Services are the business logic layer that handles data fetching, API communication, and data transformation. They abstract the complexity of API calls and provide a clean interface for hooks to use.

### Service Files

#### 1. `auth.ts`
**Purpose**: Authentication and user management using WorkOS

**Why Used**:
- Centralized authentication logic
- WorkOS API integration
- Session management

**Workflow**:
```
Frontend → auth.loginUser() → WorkOS API → Set Cookie → Return User Data
Frontend → auth.registerUser() → WorkOS API → Create User → Return User Data
Frontend → auth.logoutUser() → Clear Cookie → Return Success
```

**Key Functions**:
- `loginUser(email, password)`: Authenticate user with WorkOS
- `registerUser(email, password, username)`: Create new user
- `logoutUser()`: Clear session

---

#### 2. `ai-suggestion.ts`
**Purpose**: AI-powered document analysis and suggestions

**Why Used**:
- Abstract AI suggestion API calls
- Handle encrypted responses
- Fallback to mock data for development

**Workflow**:
```
Frontend → AI Suggestion Service → API Request → Decrypt Response → Parse Data
```

**Key Functions**:
- `getAISuggestions(documentName)`: Fetch AI suggestions for a document

---

#### 3. `documents-library.ts`
**Purpose**: Document library management

**Why Used**:
- Fetch, filter, and manage documents
- Handle pagination
- Search functionality

**Workflow**:
```
Frontend → Documents Library Service → API Request → Transform Data → Return Documents
```

**Key Functions**:
- `getDocuments(params)`: Fetch documents with filters and pagination
- `deleteDocument(id)`: Delete a document

---

#### 4. `review-documents.ts`
**Purpose**: Review document management

**Why Used**:
- Fetch documents for review
- Manage review status
- Handle reviewer assignments

**Workflow**:
```
Frontend → Review Documents Service → API Request → Transform Data → Return Review Docs
```

**Key Functions**:
- `getReviewDocuments()`: Fetch documents pending review
- `approveDocument(id)`: Approve a document
- `rejectDocument(id, reason)`: Reject a document

---

#### 5. `review-actions.ts`
**Purpose**: Review action management

**Why Used**:
- Handle review-specific operations
- Manage review notes
- Track review history

**Workflow**:
```
Frontend → Review Actions Service → API Request → Update Review Status → Return Result
```

**Key Functions**:
- `getReviewActions(docId)`: Fetch review actions for a document
- `addReviewNote(docId, note)`: Add a review note

---

#### 6. `search-history.ts`
**Purpose**: Search history management

**Why Used**:
- Track user search queries
- Provide search suggestions
- Persistent search history

**Workflow**:
```
Frontend → Search History Service → API Request → Save/Retrieve History → Return Results
```

**Key Functions**:
- `getSearchHistory()`: Fetch user's search history
- `addSearchHistory(query)`: Save search query to history
- `clearSearchHistory()`: Clear all search history

---

#### 7. `send-to-reviewer.ts`
**Purpose**: Send documents to reviewers

**Why Used**:
- Manage reviewer assignments
- Send notifications
- Track reviewer responses

**Workflow**:
```
Frontend → Send to Reviewer Service → API Request → Assign Reviewers → Return Result
```

**Key Functions**:
- `sendToReviewer(emails, docId, message)`: Send document to reviewers
- `getReviewerStatus(docId)`: Check review status

---

#### 8. `user-account.ts`
**Purpose**: User account management

**Why Used**:
- Update user profile
- Change password
- Manage user settings

**Workflow**:
```
Frontend → User Account Service → API Request → Update User Data → Return Result
```

**Key Functions**:
- `getUserProfile()`: Fetch user profile
- `updateProfile(data)`: Update user profile
- `changePassword(oldPassword, newPassword)`: Change user password

---

#### 9. `document-detail.ts`
**Purpose**: Document detail operations

**Why Used**:
- Fetch detailed document information
- Handle document metadata
- Manage document versions

**Workflow**:
```
Frontend → Document Detail Service → API Request → Fetch Document Details → Return Data
```

**Key Functions**:
- `getDocumentDetail(id)`: Fetch document details
- `updateDocumentMetadata(id, data)`: Update document metadata

---

## Mock API & Mock Data

### Overview

Mock API and mock data are used for development and testing purposes. They simulate API responses without requiring a real backend server.

### Why Used

1. **Development**: Allows frontend development without backend dependency
2. **Testing**: Provides consistent test data
3. **Offline Development**: Works without internet connection
4. **Faster Development**: No network latency
5. **Error Handling**: Test error scenarios

### Mock API Configuration

#### `lib/mockapi.ts`

**Purpose**: Centralized mock API configuration

**Why Used**:
- Single source of truth for API endpoints
- Toggle between mock and real API
- Consistent endpoint management

**Configuration**:
```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  ENDPOINTS: {
    AI_SUGGESTION: '/ai-suggestion',
    DOCUMENTS_LIBRARY: '/documents-library',
    REVIEW_DOCUMENTS: '/review-documents',
    SEARCH_HISTORY: '/search-history',
    SEND_TO_REVIEWER: '/send-to-reviewer',
    USER_PROFILE: '/user-profile',
    // ... more endpoints
  }
};
```

**Workflow**:
```
Hooks → getApiUrl(endpoint) → Return Mock or Real API URL
```

### Mock Data Structure

#### `mock/data/` Directory

Contains mock data files for different features:

1. **ai-suggestion.ts**: Mock AI suggestions for documents
2. **documents-library.ts**: Mock document library data
3. **review-documents.ts**: Mock review document data
4. **search-history.ts**: Mock search history
5. **user-account.ts**: Mock user account data

#### Example: `mock/data/ai-suggestion.ts`

**Purpose**: Provide mock AI suggestion data

**Why Used**:
- Test AI suggestion UI without real AI
- Consistent test data
- Development without AI API costs

**Data Structure**:
```typescript
export const getMockAISuggestion = (documentName: string) => {
  return {
    summary: "Document analysis summary...",
    riskFlags: [
      { message: "Potential compliance issue", priority: "high" },
      // ...
    ],
    recommendations: [
      "Add more details to section X",
      // ...
    ],
    moreSuggestions: [
      "Consider adding citations",
      // ...
    ]
  };
};
```

**Workflow**:
```
Service → API Call Fails → Use getMockAISuggestion() → Return Mock Data
```

### Mock API Workflow

```
┌─────────────────────────────────────────────────────────┐
│ 1. Hook calls service function                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Service calls API endpoint                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
         ┌───────┴───────┐
         │ API Success?  │
         └───────┬───────┘
                 │
        ┌────────┴────────┐
        │                 │
       Yes               No
        │                 │
        ↓                 ↓
┌───────────────┐  ┌───────────────┐
│ Return Data   │  │ Use Mock Data │
└───────────────┘  └───────────────┘
```

---

## TanStack Query Implementation

### Overview

TanStack Query (React Query) is used for data fetching, caching, and state management of server state. It provides hooks like `useQuery` and `useMutation` for declarative data fetching.

### Why Used

1. **Caching**: Automatic caching of API responses
2. **Background Refetching**: Keep data fresh automatically
3. **Optimistic Updates**: Update UI before API response
4. **Loading States**: Built-in loading and error states
5. **Deduplication**: Prevent duplicate requests
6. **Pagination**: Built-in pagination support
7. **Type Safety**: Full TypeScript support

### TanStack Query Hooks Structure

Each feature has two types of hooks:
1. **Query Hooks** (useQuery): For fetching data
2. **Mutation Hooks** (useMutation): For modifying data

### Hook Files

#### 1. `useDocumentsLibraryQuery.ts`

**Purpose**: TanStack Query hooks for document library

**Why Used**:
- Fetch and cache document library data
- Handle loading and error states
- Automatic refetching

**Workflow**:
```
Component → useDocumentsLibraryQuery() → TanStack Query → Service → API
```

**Key Hooks**:
```typescript
export const useDocumentsLibrary = () => {
  return useQuery({
    queryKey: ['documents-library'],
    queryFn: () => getDocumentsLibrary(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDeleteDocumentMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents-library'] });
    },
  });
};
```

---

#### 2. `useReviewDocumentsQuery.ts`

**Purpose**: TanStack Query hooks for review documents

**Why Used**:
- Fetch review document data with caching
- Handle approve/reject mutations
- Automatic cache invalidation

**Workflow**:
```
Component → useReviewDocumentsQuery() → TanStack Query → Service → API
```

**Key Hooks**:
- `useReviewDocuments()`: Fetch review documents
- `useApproveDocumentMutation()`: Approve document
- `useRejectDocumentMutation()`: Reject document

---

#### 3. `useSearchHistoryQuery.ts`

**Purpose**: TanStack Query hooks for search history

**Why Used**:
- Cache search history
- Handle add/clear mutations
- Automatic refetching

**Workflow**:
```
Component → useSearchHistoryQuery() → TanStack Query → Service → API
```

**Key Hooks**:
- `useSearchHistory()`: Fetch search history
- `useAddSearchHistoryMutation()`: Add search query
- `useClearSearchHistoryMutation()`: Clear history

---

#### 4. `useSendToReviewerQuery.ts`

**Purpose**: TanStack Query hooks for sending to reviewer

**Why Used**:
- Handle send to reviewer mutation
- Show loading state
- Handle success/error states

**Workflow**:
```
Component → useSendToReviewer() → TanStack Query → Service → API
```

**Key Hooks**:
- `useSendToReviewer()`: Send document to reviewers

---

#### 5. `useUserAccountQuery.ts`

**Purpose**: TanStack Query hooks for user account

**Why Used**:
- Fetch user profile data
- Handle profile update mutation
- Handle password change mutation

**Workflow**:
```
Component → useUserAccountQuery() → TanStack Query → Service → API
```

**Key Hooks**:
- `useUserProfile()`: Fetch user profile
- `useUpdateProfileMutation()`: Update profile
- `useChangePasswordMutation()`: Change password

---

### TanStack Query Workflow

```
┌─────────────────────────────────────────────────────────┐
│ 1. Component calls hook                                │
│    useDocumentsLibraryQuery()                           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 2. TanStack Query checks cache                          │
│    - Is data cached?                                    │
│    - Is data stale?                                     │
└────────────────┬────────────────────────────────────────┘
                 │
         ┌───────┴───────┐
         │ Data Cached?  │
         └───────┬───────┘
                 │
        ┌────────┴────────┐
        │                 │
       Yes               No
        │                 │
        ↓                 ↓
┌───────────────┐  ┌───────────────┐
│ Return Cached │  │ Call Service  │
│ Data          │  │ Function      │
└───────────────┘  └───────┬───────┘
                           │
                           ↓
                  ┌────────────────┐
                  │ Service → API  │
                  └────────┬───────┘
                           │
                           ↓
                  ┌────────────────┐
                  │ Cache Response │
                  └────────────────┘
```

---

## Types

### Overview

TypeScript type definitions provide type safety across the application. They define the shape of data structures, API responses, and component props.

### Why Used

1. **Type Safety**: Catch errors at compile time
2. **IntelliSense**: Better IDE autocomplete
3. **Documentation**: Types serve as documentation
4. **Refactoring**: Safe code refactoring
5. **Team Collaboration**: Clear data contracts

### Type Files

#### 1. `ai-suggestion.ts`

**Purpose**: Type definitions for AI suggestions

**Why Used**:
- Type-safe AI suggestion data
- API response validation
- Component prop types

**Types**:
```typescript
export interface AISuggestionResponse {
  summary: string;
  riskFlags: RiskFlag[];
  recommendations: string[];
  moreSuggestions: string[];
}

export interface RiskFlag {
  message: string;
  priority: 'high' | 'medium' | 'low';
}
```

**Workflow**:
```
Service → API Response → Type Validation → Component (Type-Safe)
```

---

#### 2. `documents-library.ts`

**Purpose**: Type definitions for document library

**Why Used**:
- Type-safe document data
- Filter and pagination types
- API request/response types

**Types**:
```typescript
export interface DocumentLibraryItem {
  id: string;
  name: string;
  type: string;
  fileSize: string;
  uploadedDate: string;
  uploadedBy: string;
  reviewerStatus: ReviewerStatus;
  aiSuggested: boolean;
}

export type ReviewerStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'reviewer-suggestion';
```

**Workflow**:
```
Service → API Response → Type Validation → Component (Type-Safe)
```

---

#### 3. `review-documents.ts`

**Purpose**: Type definitions for review documents

**Why Used**:
- Type-safe review document data
- Review action types
- Reviewer assignment types

**Types**:
```typescript
export interface ReviewDocument {
  id: string;
  name: string;
  submittedBy: string;
  submittedDate: string;
  fileSize: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewerEmails: string[];
  notes?: string;
}
```

**Workflow**:
```
Service → API Response → Type Validation → Component (Type-Safe)
```

---

#### 4. `search-history.ts`

**Purpose**: Type definitions for search history

**Why Used**:
- Type-safe search history data
- Search query types

**Types**:
```typescript
export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
}
```

**Workflow**:
```
Service → API Response → Type Validation → Component (Type-Safe)
```

---

#### 5. `send-to-reviewer.ts`

**Purpose**: Type definitions for send to reviewer

**Why Used**:
- Type-safe reviewer data
- API request/response types

**Types**:
```typescript
export interface SendToReviewerRequest {
  emails: string[];
  documentId: string;
  message: string;
}

export interface SendToReviewerResponse {
  success: boolean;
  message: string;
}
```

**Workflow**:
```
Component → Type-Safe Request → Service → API → Type-Safe Response
```

---

#### 6. `user-account.ts`

**Purpose**: Type definitions for user account

**Why Used**:
- Type-safe user data
- Profile update types
- Password change types

**Types**:
```typescript
export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}
```

**Workflow**:
```
Component → Type-Safe Request → Service → API → Type-Safe Response
```

---

## Hooks

### Overview

Custom React hooks encapsulate reusable stateful logic. They bridge the gap between UI components and data fetching layers.

### Why Used

1. **Code Reusability**: Share logic across components
2. **Separation of Concerns**: UI vs logic separation
3. **Testing**: Easier to test isolated logic
4. **Abstraction**: Hide complexity from components
5. **Consistency**: Standardized data fetching patterns

### Hook Files

#### 1. `useAisuggestions.ts`

**Purpose**: Hook for AI suggestion functionality

**Why Used**:
- Encapsulate AI suggestion logic
- Manage loading states
- Handle errors gracefully

**Workflow**:
```
Component → useAISuggestions() → fetchAISuggestions() → Service → API
```

**Key Features**:
- Fetch AI suggestions for a document
- Loading and error states
- Fallback to mock data

---

#### 2. `useDocumentsLibrary.ts`

**Purpose**: Hook for document library functionality

**Why Used**:
- Encapsulate document library logic
- Manage filters and pagination
- Cache optimization

**Workflow**:
```
Component → useDocumentsLibrary() → fetchDocuments() → Service → API
```

**Key Features**:
- Fetch documents with filters
- Pagination support
- Delete document mutation
- Filter by status

---

#### 3. `useReviewDocuments.ts`

**Purpose**: Hook for review document functionality

**Why Used**:
- Encapsulate review document logic
- Manage review status updates
- Optimistic updates

**Workflow**:
```
Component → useReviewDocuments() → fetchReviewDocs() → Service → API
```

**Key Features**:
- Fetch review documents
- Approve/reject mutations
- Review status management

---

#### 4. `useSearchHistory.ts`

**Purpose**: Hook for search history functionality

**Why Used**:
- Encapsulate search history logic
- Persistent search history
- Quick access to recent searches

**Workflow**:
```
Component → useSearchHistory() → fetchSearchHistory() → Service → API
```

**Key Features**:
- Fetch search history
- Add search query
- Clear history

---

#### 5. `useSendToReviewer.ts`

**Purpose**: Hook for send to reviewer functionality

**Why Used**:
- Encapsulate reviewer assignment logic
- Manage loading states
- Handle multiple reviewers

**Workflow**:
```
Component → useSendToReviewer() → sendToReviewer() → Service → API
```

**Key Features**:
- Send document to reviewers
- Email validation
- Loading and error states

---

### Hook Workflow Pattern

```
┌─────────────────────────────────────────────────────────┐
│ 1. Component calls custom hook                         │
│    const { data, loading, error } = useCustomHook()    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Hook initializes state                             │
│    - loading: true                                    │
│    - data: null                                       │
│    - error: null                                      │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Hook calls service function                        │
│    const result = await service.getData()              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Service calls API (or returns mock data)           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Hook updates state                                 │
│    - loading: false                                   │
│    - data: result.data                                │
│    - error: result.error                              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Component re-renders with new state                │
└─────────────────────────────────────────────────────────┘
```

---

## Lib

### Overview

The lib directory contains utility libraries and helper functions used throughout the application.

### Why Used

1. **Code Organization**: Centralized utilities
2. **Reusability**: Shared across the application
3. **Abstraction**: Hide complex implementations
4. **Testing**: Easier to test in isolation

### Lib Files

#### 1. `crypto-client.ts`

**Purpose**: Client-side encryption using WebCrypto API

**Why Used**:
- Encrypt sensitive data in browser
- Decrypt API responses
- Secure localStorage

**Workflow**:
```
Component → encryptClient() → WebCrypto API → Encrypted Data
Component → decryptClient() → WebCrypto API → Decrypted Data
```

**Key Functions**:
- `encryptClient(plaintext)`: Encrypt data using AES-256-GCM
- `decryptClient(base64)`: Decrypt encrypted data

---

#### 2. `crypto-server.ts`

**Purpose**: Server-side encryption using Node.js crypto module

**Why Used**:
- Encrypt sensitive data on server
- Decrypt client-encrypted data
- Secure API responses

**Workflow**:
```
API Route → encryptServer() → Node crypto → Encrypted Data
API Route → decryptServer() → Node crypto → Decrypted Data
```

**Key Functions**:
- `encryptServer(plaintext)`: Encrypt data using AES-256-GCM
- `decryptServer(base64)`: Decrypt encrypted data

---

#### 3. `encrypted-storage.ts`

**Purpose**: Encrypted localStorage wrapper for Zustand

**Why Used**:
- Encrypt state before storing in localStorage
- Decrypt state when retrieving
- Secure client-side persistence

**Workflow**:
```
Zustand → setItem() → encryptClient() → localStorage
Zustand → getItem() → localStorage → decryptClient() → State
```

**Key Functions**:
- `getItem(name)`: Retrieve and decrypt stored data
- `setItem(name, value)`: Encrypt and store data
- `removeItem(name)`: Remove stored data

---

#### 4. `mockapi.ts`

**Purpose**: Mock API configuration

**Why Used**:
- Centralized API endpoint management
- Toggle between mock and real API
- Consistent URL generation

**Workflow**:
```
Hook → getApiUrl(endpoint) → Return API URL
```

**Key Functions**:
- `getApiUrl(endpoint)`: Generate full API URL
- `API_CONFIG`: API configuration object

---

#### 5. `theme.ts`

**Purpose**: Theme configuration for Tailwind CSS

**Why Used**:
- Centralized theme variables
- Consistent styling across app
- Custom color schemes

**Workflow**:
```
Component → Tailwind Classes → theme.ts → CSS Variables
```

**Key Features**:
- Color palettes
- Button variants
- Spacing scales
- Typography

---

#### 6. `utils.ts`

**Purpose**: General utility functions

**Why Used**:
- Common helper functions
- Data transformation utilities
- Validation helpers

**Workflow**:
```
Component → Utility Function → Transformed Data
```

---

## Store

### Overview

Zustand stores manage global application state. They provide a simple and efficient way to handle state without the complexity of Redux.

### Why Used

1. **Simplicity**: Minimal boilerplate
2. **Performance**: No unnecessary re-renders
3. **TypeScript**: Full type safety
4. **Persistence**: Easy state persistence
5. **DevTools**: Built-in dev tools support

### Store Files

#### 1. `auth-store.ts`

**Purpose**: Authentication state management

**Why Used**:
- Manage user authentication state
- Persist user data securely
- Handle logout logic

**Workflow**:
```
Login → setUser(user) → Zustand Store → Encrypted localStorage
Logout → logout() → Zustand Store → Clear Data
```

**State Structure**:
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}
```

**Key Features**:
- User data storage
- Authentication status
- Encrypted persistence
- Cookie management

---

#### 2. `documents-library-store.ts`

**Purpose**: Document library state management

**Why Used**:
- Manage document library filters
- Persist filter preferences
- Cache document data locally

**Workflow**:
```
Filter Change → Set Filter → Zustand Store → localStorage
Page Load → Restore Filter → Zustand Store
```

**State Structure**:
```typescript
interface DocumentsLibraryState {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
}
```

---

#### 3. `review-documents-store.ts`

**Purpose**: Review document state management

**Why Used**:
- Manage review document filters
- Track selected documents
- Persist review preferences

**Workflow**:
```
Selection → Set Selected → Zustand Store → localStorage
Filter Change → Set Filter → Zustand Store
```

---

#### 4. `search-history-store.ts`

**Purpose**: Search history state management

**Why Used**:
- Manage search history locally
- Quick access to recent searches
- Offline search suggestions

**Workflow**:
```
Search → Add to History → Zustand Store → localStorage
Clear → Clear History → Zustand Store → localStorage
```

---

#### 5. `upload-preload-store.ts`

**Purpose**: Upload page preload state management

**Why Used**:
- Preload upload data
- Persist upload state
- Handle upload progress

**Workflow**:
```
File Upload → Set Upload State → Zustand Store → localStorage
Page Refresh → Restore Upload State → Zustand Store
```

---

### Store Workflow Pattern

```
┌─────────────────────────────────────────────────────────┐
│ 1. Component calls store action                        │
│    setUser(user)                                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Zustand updates state                              │
│    state.user = user                                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Middleware intercepts (if configured)               │
│    - Encrypt before persist                            │
│    - Log changes                                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Persist to localStorage (if configured)              │
│    encrypted-storage.setItem()                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Subscribed components re-render                     │
└─────────────────────────────────────────────────────────┘
```

---

## Components

### Overview

Components are reusable UI building blocks. They are organized by feature and reusability.

### Why Used

1. **Reusability**: Share UI across pages
2. **Maintainability**: Isolated UI logic
3. **Consistency**: Standardized design system
4. **Testing**: Easier to test components

### Component Structure

```
components/
├── auth/              # Authentication components
├── dashboard/         # Dashboard-specific components
├── toasts/            # Toast notification components
└── ui/                # Reusable UI components (Shadcn)
```

### Component Files

#### 1. Auth Components

**Purpose**: Authentication-related UI components

**Components**:
- Login form
- Register form
- Password reset form

**Workflow**:
```
Page → Auth Component → User Input → Validation → Submit
```

---

#### 2. Dashboard Components

**Purpose**: Dashboard-specific UI components

**Components**:
- Logo
- Sidebar
- Navigation
- Search bar

**Workflow**:
```
Dashboard Page → Dashboard Component → Render UI
```

---

#### 3. Toast Components

**Purpose**: Toast notification components

**Components**:
- Success toast
- Error toast
- Validation toast

**Workflow**:
```
Service → Show Toast → Toast Component → Display Notification
```

---

#### 4. UI Components (Shadcn)

**Purpose**: Reusable UI components from Shadcn UI

**Components**:
- Button
- Input
- Dialog
- Form
- Card
- Skeleton
- And many more...

**Workflow**:
```
Page → UI Component → Render Styled Element
```

---

### Component Workflow

```
┌─────────────────────────────────────────────────────────┐
│ 1. Page renders component                              │
│    <Button onClick={handleClick}>Click me</Button>      │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Component receives props                            │
│    { children, onClick, variant }                      │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Component renders UI                                │
│    Apply styles from theme                              │
│    Render children                                      │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 4. User interacts with component                        │
│    Click button                                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Component triggers callback                          │
│    onClick()                                            │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Parent component handles event                       │
│    Update state, call service, etc.                     │
└─────────────────────────────────────────────────────────┘
```

---

## API Routes

### Overview

API routes are Next.js server-side endpoints that handle HTTP requests. They serve as the backend layer for the application.

### Why Used

1. **Server-Side Logic**: Execute code on the server
2. **API Integration**: Connect to external APIs
3. **Security**: Protect sensitive operations
4. **Database Access**: Access databases securely

### API Route Structure

```
app/api/
├── ai-suggestion/          # AI suggestion endpoints
├── change-password/        # Password change endpoint
├── delete/                 # Document deletion endpoint
├── document-detail/        # Document detail endpoint
├── documents-library/      # Document library endpoint
├── reject-by-reviewer/     # Reject by reviewer endpoint
├── Review-documents/       # Review documents endpoint
├── reviewdoc-detail/       # Review doc detail endpoint
├── search-history/         # Search history endpoint
├── sent-suggestion/        # Sent suggestion endpoint
├── send-to-reviewer/       # Send to reviewer endpoint
├── update-profile/         # Update profile endpoint
└── user-profile/           # User profile endpoint
```

### API Route Files

#### 1. `api/ai-suggestion/route.ts`

**Purpose**: Handle AI suggestion requests

**Why Used**:
- Process AI suggestion requests
- Return encrypted AI analysis
- Fallback to mock data

**Workflow**:
```
POST /api/ai-suggestion
→ Validate request
→ Call AI service
→ Encrypt response
→ Return encrypted data
```

---

#### 2. `api/documents-library/route.ts`

**Purpose**: Handle document library requests

**Why Used**:
- Fetch documents with filters
- Handle pagination
- Delete documents

**Workflow**:
```
GET /api/documents-library
→ Validate request
→ Call documents library service
→ Return documents

DELETE /api/documents-library
→ Validate request
→ Delete document
→ Return success
```

---

#### 3. `api/send-to-reviewer/route.ts`

**Purpose**: Handle send to reviewer requests

**Why Used**:
- Assign reviewers to documents
- Send notifications
- Track reviewer assignments

**Workflow**:
```
POST /api/send-to-reviewer
→ Validate request
→ Call send to reviewer service
→ Return result
```

---

### API Route Workflow

```
┌─────────────────────────────────────────────────────────┐
│ 1. Client sends HTTP request                           │
│    POST /api/endpoint                                   │
│    Body: { data }                                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Next.js routes to API route handler                 │
│    route.ts                                             │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Route handler validates request                     │
│    - Check authentication                               │
│    - Validate input data                               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Route handler calls service function                │
│    const result = await service.getData(data)           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Service processes logic                             │
│    - Call external API (if needed)                      │
│    - Transform data                                    │
│    - Return result                                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Route handler formats response                      │
│    - Encrypt sensitive data (if needed)                 │
│    - Set HTTP status code                               │
│    - Add headers                                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 7. Return JSON response to client                      │
│    Response.json({ data })                              │
└─────────────────────────────────────────────────────────┘
```

---

## Pages

### Overview

Pages are Next.js App Router pages that define the application's routes and UI.

### Why Used

1. **Routing**: Define application routes
2. **UI Layout**: Page-specific UI
3. **Data Fetching**: Server and client data fetching
4. **SEO**: Search engine optimization

### Page Structure

```
app/
├── 404/                    # 404 error page
├── Auth/                   # Authentication pages
│   ├── Login/              # Login page
│   └── Register/           # Register page
├── LandingPage/            # Landing page
├── dashboard/              # Dashboard pages
│   ├── account/            # Account management page
│   ├── library/            # Document library page
│   │   └── [id]/          # Document detail page
│   ├── page.tsx            # Dashboard home
│   ├── reviewer/           # Reviewer pages
│   │   └── [id]/          # Reviewer detail page
│   └── upload/             # Upload page
├── layout.tsx              # Root layout
└── page.tsx                # Home page
```

### Page Files

#### 1. `Auth/Login/page.tsx`

**Purpose**: Login page

**Why Used**:
- User authentication entry point
- Email/password login form
- Redirect to dashboard on success

**Workflow**:
```
User visits /Auth/Login
→ Render login form
→ User enters credentials
→ Submit form
→ Call loginUser service
→ Set auth state
→ Redirect to dashboard
```

---

#### 2. `Auth/Register/page.tsx`

**Purpose**: Registration page

**Why Used**:
- New user registration
- Email/password registration form
- Redirect to login on success

**Workflow**:
```
User visits /Auth/Register
→ Render registration form
→ User enters information
→ Submit form
→ Call registerUser service
→ Show success message
→ Redirect to login
```

---

#### 3. `dashboard/upload/page.tsx`

**Purpose**: Document upload page

**Why Used**:
- Upload documents for review
- AI suggestion integration
- Document preview

**Workflow**:
```
User visits /dashboard/upload
→ Render upload area
→ User uploads file
→ Show file preview
→ User clicks submit
→ Call AI suggestion service
→ Display AI suggestions
→ User accepts/reject suggestions
```

---

#### 4. `dashboard/library/page.tsx`

**Purpose**: Document library page

**Why Used**:
- Browse all documents
- Filter and search documents
- Delete documents

**Workflow**:
```
User visits /dashboard/library
→ Fetch documents via hook
→ Render document list
→ User applies filters
→ Re-fetch with filters
→ User clicks document
→ Navigate to detail page
```

---

### Page Workflow

```
┌─────────────────────────────────────────────────────────┐
│ 1. User navigates to route                              │
│    /dashboard/upload                                    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Next.js renders page component                      │
│    page.tsx                                             │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Page component initializes                           │
│    - Call hooks for data fetching                       │
│    - Set up state                                      │
│    - Render UI components                              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Hooks fetch data (if needed)                        │
│    useDocumentsLibraryQuery()                          │
│    → Service → API                                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Page renders UI with data                           │
│    - Components receive data                            │
│    - Render lists, cards, etc.                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 6. User interacts with page                            │
│    - Click buttons                                      │
│    - Fill forms                                        │
│    - Navigate                                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 7. Page handles interactions                           │
│    - Update state                                      │
│    - Call services                                     │
│    - Navigate to other pages                           │
└─────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Complete Data Flow Example: Document Upload

```
┌─────────────────────────────────────────────────────────┐
│ 1. User uploads file on upload page                    │
│    /dashboard/upload                                    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Page handles file selection                          │
│    handleFileSelect()                                   │
│    - Validate file                                      │
│    - Update state                                      │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 3. User clicks submit                                  │
│    handleSubmitClick()                                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Page calls AI suggestion hook                       │
│    useAISuggestions.fetchAISuggestions(docName)        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Hook calls AI suggestion service                     │
│    AISuggestionService.getAISuggestions(docName)        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Service calls API endpoint                          │
│    POST /api/ai-suggestion                             │
│    Body: { documentName, requestType }                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 7. API route handles request                           │
│    - Validate request                                   │
│    - Call AI service                                   │
│    - Encrypt response                                  │
│    - Return encrypted data                             │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 8. Service receives encrypted response                 │
│    - Decrypt response using decryptClient()            │
│    - Parse JSON                                         │
│    - Validate with Zod schema                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 9. Hook updates state                                  │
│    - Set suggestions data                              │
│    - Set loading: false                                │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 10. Page re-renders with AI suggestions               │
│     - Display summary                                  │
│     - Show risk flags                                   │
│     - Show recommendations                              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 11. User accepts suggestions                           │
│     handleAccept()                                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 12. Page generates document card                       │
│     - Use mock generated document                       │
│     - Display success message                           │
│     - Show download button                              │
└─────────────────────────────────────────────────────────┘
```

---

## Complete Workflow Examples

### Example 1: User Registration Flow

```
1. User navigates to /Auth/Register
   ↓
2. Register page renders
   ↓
3. User fills registration form
   - Username
   - Email
   - Password
   - Confirm Password
   ↓
4. Client-side validation (Zod)
   - Email format
   - Password strength
   - Password confirmation
   ↓
5. User submits form
   ↓
6. Page calls registerUser server action
   - POST request to server
   ↓
7. Server action calls WorkOS API
   - workos.userManagement.createUser()
   - Password hashed by WorkOS
   - User stored in WorkOS database
   ↓
8. WorkOS returns user data
   - { id, email, firstName }
   ↓
9. Server action returns success
   - { success: true, user: {...} }
   ↓
10. Page shows success toast
   - "Account created successfully!"
   ↓
11. Page redirects to /Auth/Login
```

---

### Example 2: User Login Flow

```
1. User navigates to /Auth/Login
   ↓
2. Login page renders
   ↓
3. User fills login form
   - Email
   - Password
   ↓
4. Client-side validation (Zod)
   - Email format
   - Password required
   ↓
5. User submits form
   ↓
6. Page calls loginUser server action
   - POST request to server
   ↓
7. Server action calls WorkOS API
   - workos.userManagement.authenticateWithPassword()
   - Validates credentials
   - Returns user data
   ↓
8. Server action sets HTTP-only cookie
   - auth_session = "authenticated"
   - HttpOnly, Secure, SameSite=strict
   - Max age: 1 week
   ↓
9. Server action returns user data
   - { success: true, user: { id, email, firstName } }
   ↓
10. Page stores user in Zustand store
   - setUser(user)
   - Persisted to encrypted localStorage
   ↓
11. Page sets auth-token cookie (client-side)
   - auth-token = user.id
   - For middleware authentication
   ↓
12. Page shows success toast
   - "Login successful!"
   ↓
13. Page redirects to /dashboard/upload
```

---

### Example 3: Document Upload with AI Suggestions

```
1. User navigates to /dashboard/upload
   ↓
2. Upload page renders
   - Check auth via middleware
   - Load preloaded data (if any)
   ↓
3. User selects file
   - Drag and drop or click to select
   ↓
4. Page validates file
   - File type check
   - File size check
   - documentFileSchema.safeParse()
   ↓
5. Page displays file preview
   - File name
   - File size
   - File type
   ↓
6. User clicks "AI Suggestion" button
   - Open submit dialog
   ↓
7. User confirms AI suggestion request
   ↓
8. Page calls AI suggestion hook
   - useAISuggestions.fetchAISuggestions(docName)
   ↓
9. Hook calls AI suggestion service
   - AISuggestionService.getAISuggestions(docName)
   ↓
10. Service calls API endpoint
    - POST /api/ai-suggestion
    - Body: { documentName, requestType: 'ai_suggestion' }
    - Authorization header with auth token
    ↓
11. API route handles request
    - Validate request
    - Call AI service
    - Encrypt response
    - Return encrypted data
    ↓
12. Service receives encrypted response
    - Decrypt using decryptClient()
    - Parse JSON
    - Validate with Zod schema
    ↓
13. Hook updates state
    - Set suggestions data
    - Set loading: false
    ↓
14. Page re-renders with AI suggestions
    - Display summary
    - Show risk flags
    - Show recommendations
    - Show more suggestions
    ↓
15. User reviews suggestions
    - Read summary
    - Check risk flags
    - Review recommendations
    ↓
16. User accepts suggestions
    - Click "Accept" button
    ↓
17. Page handles accept
    - handleAccept()
    - Set loading state
    - Simulate document generation (2 seconds)
    - Get mock generated document
    - Set generatedDocument state
    ↓
18. Page shows document card
    - Success message
    - Document card with:
      - File name
      - Content
      - Type
      - Size
      - Creation date
      - Download button
    ↓
19. User clicks download button
    - handleDownload()
    - Show success toast
    - No actual download (as per requirement)
```

---

### Example 4: Document Library Browse Flow

```
1. User navigates to /dashboard/library
   ↓
2. Library page renders
   - Check auth via middleware
   ↓
3. Page calls documents library hook
   - useDocumentsLibraryQuery()
   ↓
4. Hook calls service
   - getDocumentsLibrary(params)
   ↓
5. Service calls API endpoint
   - GET /api/documents-library
   - Query params: filter, search, page
   ↓
6. API route handles request
   - Validate request
   - Call documents library service
   - Encrypt response
   - Return encrypted data
   ↓
7. Service receives encrypted response
   - Decrypt using decryptClient()
   - Parse JSON
   - Validate with Zod schema
   ↓
8. Hook updates state
   - Set documents data
   - Set loading: false
   ↓
9. Page renders document list
   - Display documents as cards
   - Show status badges
   - Show metadata
   ↓
10. User applies filter
    - Select status filter (e.g., "approved")
    ↓
11. Page updates filter state
    - Set filter in Zustand store
    ↓
12. Hook refetches with new filter
    - Invalidate query
    - Fetch filtered data
    ↓
13. Page re-renders with filtered documents
    - Show only approved documents
    ↓
14. User clicks document
    - Navigate to /dashboard/library/[id]
    ↓
15. Detail page renders
    - Fetch document details
    - Display full information
```

---

## Summary

This project follows a well-structured architecture with clear separation of concerns:

### Key Architectural Patterns

1. **Service Layer Pattern**: Business logic in service files
2. **Repository Pattern**: Services abstract data fetching
3. **Custom Hooks Pattern**: Reusable data fetching logic
4. **Component Composition**: Reusable UI components
5. **Type Safety**: TypeScript throughout
6. **Encryption**: Client and server-side encryption

### Data Flow

```
UI Components → Custom Hooks → Services → API Routes → External APIs
     ↓              ↓            ↓           ↓              ↓
  User Actions  State Mgmt  Business Logic  Server Logic  Third-party
     ↓              ↓            ↓           ↓              ↓
  Update UI    Cache Data  Transform    Encrypt     Raw Data
```

### Key Benefits

1. **Maintainability**: Clear separation of concerns
2. **Scalability**: Easy to add new features
3. **Testability**: Isolated components and logic
4. **Type Safety**: TypeScript prevents errors
5. **Security**: Encryption at multiple layers
6. **Performance**: Caching with TanStack Query
7. **Developer Experience**: Consistent patterns

This architecture provides a solid foundation for building a scalable, maintainable, and secure document review application.
