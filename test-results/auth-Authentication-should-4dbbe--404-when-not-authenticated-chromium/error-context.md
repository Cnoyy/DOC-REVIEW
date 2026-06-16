# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication >> should protect dashboard routes - redirect to 404 when not authenticated
- Location: tests\auth.spec.ts:47:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:3000/404"
Received: "http://localhost:3000/dashboard/upload"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    8 × unexpected value "http://localhost:3000/dashboard/upload"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - heading "404" [level=1] [ref=e5]
      - heading "Page Not Found" [level=2] [ref=e6]
      - paragraph [ref=e7]: The page you're looking for doesn't exist or you don't have permission to access it.
    - generic [ref=e8]:
      - link "Sign In to Continue" [ref=e9] [cursor=pointer]:
        - /url: /Auth/Login
      - link "Go to Homepage" [ref=e10] [cursor=pointer]:
        - /url: /
    - paragraph [ref=e11]: If you think this is an error, please contact support.
  - region "Notifications alt+T"
  - alert [ref=e12]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Authentication', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     // Clear cookies and localStorage before each test
  6   |     await page.context().clearCookies();
  7   |     await page.goto('/');
  8   |   });
  9   | 
  10  |   test('should display login page', async ({ page }) => {
  11  |     await page.goto('/Auth/Login');
  12  |     await expect(page).toHaveTitle(/Login/);
  13  |     await expect(page.locator('h1, h2')).toContainText(/login/i);
  14  |   });
  15  | 
  16  |   test('should show validation errors for empty form', async ({ page }) => {
  17  |     await page.goto('/Auth/Login');
  18  |     
  19  |     // Try to submit without filling the form
  20  |     const submitButton = page.locator('button[type="submit"]').first();
  21  |     await submitButton.click();
  22  |     
  23  |     // Check for validation errors (form should not submit)
  24  |     await expect(page).toHaveURL('/Auth/Login');
  25  |   });
  26  | 
  27  |   test('should redirect to dashboard after successful login', async ({ page }) => {
  28  |     await page.goto('/Auth/Login');
  29  |     
  30  |     // Fill in login form
  31  |     await page.fill('input[type="email"]', 'test@example.com');
  32  |     await page.fill('input[type="password"]', 'password123');
  33  |     
  34  |     // Submit form
  35  |     const submitButton = page.locator('button[type="submit"]').first();
  36  |     await submitButton.click();
  37  |     
  38  |     // Wait for navigation (may fail if no real WorkOS credentials)
  39  |     // This test demonstrates the flow but may need real credentials
  40  |     await page.waitForTimeout(2000);
  41  |     
  42  |     // Check if redirected to dashboard or stayed on login
  43  |     const currentUrl = page.url();
  44  |     console.log('Current URL after login attempt:', currentUrl);
  45  |   });
  46  | 
  47  |   test('should protect dashboard routes - redirect to 404 when not authenticated', async ({ page }) => {
  48  |     // Try to access dashboard without authentication
  49  |     await page.goto('/dashboard/upload');
  50  |     
  51  |     // Should redirect to 404 page
> 52  |     await expect(page).toHaveURL('/404');
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  53  |     await expect(page.locator('h1')).toContainText('404');
  54  |   });
  55  | 
  56  |   test('should protect library route - redirect to 404 when not authenticated', async ({ page }) => {
  57  |     await page.goto('/dashboard/library');
  58  |     
  59  |     await expect(page).toHaveURL('/404');
  60  |     await expect(page.locator('h1')).toContainText('404');
  61  |   });
  62  | 
  63  |   test('should protect account route - redirect to 404 when not authenticated', async ({ page }) => {
  64  |     await page.goto('/dashboard/account');
  65  |     
  66  |     await expect(page).toHaveURL('/404');
  67  |     await expect(page.locator('h1')).toContainText('404');
  68  |   });
  69  | 
  70  |   test('should display 404 page correctly', async ({ page }) => {
  71  |     await page.goto('/404');
  72  |     
  73  |     await expect(page.locator('h1')).toContainText('404');
  74  |     await expect(page.locator('text=Page not found')).toBeVisible();
  75  |     await expect(page.locator('a[href="/Auth/Login"]')).toBeVisible();
  76  |   });
  77  | 
  78  |   test('should navigate to login from 404 page', async ({ page }) => {
  79  |     await page.goto('/404');
  80  |     
  81  |     const loginLink = page.locator('a[href="/Auth/Login"]');
  82  |     await loginLink.click();
  83  |     
  84  |     await expect(page).toHaveURL('/Auth/Login');
  85  |   });
  86  | });
  87  | 
  88  | test.describe('Dashboard Layout', () => {
  89  |   test('should have sidebar navigation', async ({ page }) => {
  90  |     // This test would need authentication to pass
  91  |     // Demonstrates structure test
  92  |     await page.goto('/Auth/Login');
  93  |     
  94  |     // Check for login form elements
  95  |     const emailInput = page.locator('input[type="email"]');
  96  |     const passwordInput = page.locator('input[type="password"]');
  97  |     const submitButton = page.locator('button[type="submit"]');
  98  |     
  99  |     await expect(emailInput).toBeVisible();
  100 |     await expect(passwordInput).toBeVisible();
  101 |     await expect(submitButton).toBeVisible();
  102 |   });
  103 | });
  104 | 
  105 | test.describe('Navigation', () => {
  106 |   test('should navigate between public pages', async ({ page }) => {
  107 |     await page.goto('/');
  108 |     
  109 |     // Navigate to login
  110 |     await page.goto('/Auth/Login');
  111 |     await expect(page).toHaveURL('/Auth/Login');
  112 |     
  113 |     // Navigate to register
  114 |     await page.goto('/Auth/Register');
  115 |     await expect(page).toHaveURL('/Auth/Register');
  116 |     
  117 |     // Navigate to 404
  118 |     await page.goto('/404');
  119 |     await expect(page).toHaveURL('/404');
  120 |   });
  121 | });
  122 | 
```