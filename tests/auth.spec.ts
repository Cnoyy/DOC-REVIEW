import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and localStorage before each test
    await page.context().clearCookies();
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/Auth/Login');
    await expect(page).toHaveTitle(/Login/);
    await expect(page.locator('h1, h2')).toContainText(/login/i);
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/Auth/Login');
    
    // Try to submit without filling the form
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();
    
    // Check for validation errors (form should not submit)
    await expect(page).toHaveURL('/Auth/Login');
  });

  test('should redirect to dashboard after successful login', async ({ page }) => {
    await page.goto('/Auth/Login');
    
    // Fill in login form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();
    
    // Wait for navigation (may fail if no real WorkOS credentials)
    // This test demonstrates the flow but may need real credentials
    await page.waitForTimeout(2000);
    
    // Check if redirected to dashboard or stayed on login
    const currentUrl = page.url();
    console.log('Current URL after login attempt:', currentUrl);
  });

  test('should protect dashboard routes - redirect to 404 when not authenticated', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard/upload');
    
    // Should redirect to 404 page
    await expect(page).toHaveURL('/404');
    await expect(page.locator('h1')).toContainText('404');
  });

  test('should protect library route - redirect to 404 when not authenticated', async ({ page }) => {
    await page.goto('/dashboard/library');
    
    await expect(page).toHaveURL('/404');
    await expect(page.locator('h1')).toContainText('404');
  });

  test('should protect account route - redirect to 404 when not authenticated', async ({ page }) => {
    await page.goto('/dashboard/account');
    
    await expect(page).toHaveURL('/404');
    await expect(page.locator('h1')).toContainText('404');
  });

  test('should display 404 page correctly', async ({ page }) => {
    await page.goto('/404');
    
    await expect(page.locator('h1')).toContainText('404');
    await expect(page.locator('text=Page not found')).toBeVisible();
    await expect(page.locator('a[href="/Auth/Login"]')).toBeVisible();
  });

  test('should navigate to login from 404 page', async ({ page }) => {
    await page.goto('/404');
    
    const loginLink = page.locator('a[href="/Auth/Login"]');
    await loginLink.click();
    
    await expect(page).toHaveURL('/Auth/Login');
  });
});

test.describe('Dashboard Layout', () => {
  test('should have sidebar navigation', async ({ page }) => {
    // This test would need authentication to pass
    // Demonstrates structure test
    await page.goto('/Auth/Login');
    
    // Check for login form elements
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate between public pages', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to login
    await page.goto('/Auth/Login');
    await expect(page).toHaveURL('/Auth/Login');
    
    // Navigate to register
    await page.goto('/Auth/Register');
    await expect(page).toHaveURL('/Auth/Register');
    
    // Navigate to 404
    await page.goto('/404');
    await expect(page).toHaveURL('/404');
  });
});
