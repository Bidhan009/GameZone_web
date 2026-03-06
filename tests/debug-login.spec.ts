import { test, expect } from '@playwright/test';

test.describe('Debug Login', () => {
  test('debug login flow', async ({ page }) => {
    // Clear cookies
    await page.context().clearCookies();
    
    // Go to login
    await page.goto('/login');
    
    // Take screenshot before login
    await page.screenshot({ path: 'debug-before-login.png' });
    
    // Fill form
    await page.fill('input#email', 'nepo@gmail.com');
    await page.fill('input#password', 'password123');
    
    // Take screenshot after filling form
    await page.screenshot({ path: 'debug-form-filled.png' });
    
    // Click submit
    await page.click('button[type="submit"]');
    
    // Wait a bit for navigation
    await page.waitForTimeout(5000);
    
    // Take screenshot after login attempt
    await page.screenshot({ path: 'debug-after-login.png' });
    
    // Check current URL
    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);
    
    // Check if we're still on login page (error case)
    if (currentUrl.includes('/login')) {
      // Look for error messages
      const errorElement = page.locator('.text-red-500, .bg-red-500, .error-message');
      const errorVisible = await errorElement.isVisible();
      
      if (errorVisible) {
        const errorText = await errorElement.textContent();
        console.log('Error message found:', errorText);
      }
      
      // Check if form is still visible
      const formVisible = await page.locator('form').isVisible();
      console.log('Form still visible:', formVisible);
    }
    
    // If we're on dashboard, check content
    if (currentUrl.includes('/user/dashboard')) {
      console.log('Successfully redirected to dashboard');
      
      // Look for dashboard content
      const dashboardContent = page.locator('h1, h2, h3, .dashboard');
      const contentVisible = await dashboardContent.isVisible();
      console.log('Dashboard content visible:', contentVisible);
    }
    
    // Print page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Wait for manual inspection
    await page.waitForTimeout(10000);
  });
});
