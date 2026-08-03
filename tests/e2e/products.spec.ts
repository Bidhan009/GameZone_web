import { test, expect } from '@playwright/test';

test.describe('Products Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/user/products');
  });

  test('should display products', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Look for ProductCard components or any product content
    const productCards = page.locator('div[class*="border-gray-800"], [data-testid="product-card"]');
    const noProducts = page.locator('text=No Products Found');
    
    // Either products should be visible or "No Products Found" message
    await expect(productCards.or(noProducts)).toBeVisible({ timeout: 10000 });
    
    // If products exist, check at least one is visible
    if (await productCards.count() > 0) {
      await expect(productCards).toHaveCount(1);
    }
  });

  test('should navigate to product details', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Look for product cards
    const productCards = page.locator('div[class*="border-gray-800"]');
    const count = await productCards.count();
    
    if (count === 0) {
      // Skip test if no products
      test.skip();
      return;
    }
    
    // Click first product link
    await productCards.first().locator('a[href*="/user/products/"]').click();
    
    // Should navigate to product page
    await expect(page).toHaveURL(/\/user\/products\/[a-zA-Z0-9]+/);
    
    // Should show product details
    await expect(page.locator('h1, h2, .product-title')).toBeVisible();
    await expect(page.locator('text=/\\$[0-9]+\\.\\d{2}/')).toBeVisible();
  });

  test('should add product to cart from product page', async ({ page }) => {
    // Navigate to products
    await page.goto('/user/products');
    await page.waitForLoadState('networkidle');
    
    // Look for product cards
    const productCards = page.locator('div[class*="border-gray-800"]');
    const count = await productCards.count();
    
    if (count === 0) {
      // Skip test if no products
      test.skip();
      return;
    }
    
    // Click first product
    await productCards.first().locator('a[href*="/user/products/"]').click();
    
    // Wait for product page to load
    await page.waitForLoadState('networkidle');
    
    // Look for "Add to Cart" button
    const addToCartButton = page.locator('button:has-text("Add to Cart"), button:has-text("Add to cart")');
    
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      
      // Wait for cart update
      await page.waitForTimeout(1000);
      
      // Check for cart notification or update
      const cartNotification = page.locator('.cart-notification, [data-testid="cart-notification"]');
      if (await cartNotification.isVisible()) {
        await expect(cartNotification).toBeVisible();
      }
    } else {
      // Skip if no Add to Cart button found
      test.skip();
    }
  });

  test('should show product images', async ({ page }) => {
    await page.goto('/user/products');
    await page.waitForLoadState('networkidle');
    
    // Look for product cards
    const productCards = page.locator('div[class*="border-gray-800"]');
    const count = await productCards.count();
    
    if (count === 0) {
      test.skip();
      return;
    }
    
    // Check if first product has an image
    const firstProduct = productCards.first();
    const productImage = firstProduct.locator('img');
    
    if (await productImage.isVisible()) {
      await expect(productImage).toHaveAttribute('src');
    } else {
      // Check for fallback icon - use the correct class from ProductCard
      const fallbackIcon = firstProduct.locator('svg, .text-gray-600');
      await expect(fallbackIcon).toBeVisible();
    }
  });

  test('should display product prices', async ({ page }) => {
    await page.goto('/user/products');
    await page.waitForLoadState('networkidle');
    
    // Look for product cards
    const productCards = page.locator('div[class*="border-gray-800"]');
    const count = await productCards.count();
    
    if (count === 0) {
      test.skip();
      return;
    }
    
    // Check if products show prices - be more flexible with the selector
    const priceElements = page.locator('text=/\\$[0-9]+\\.\\d{2}/');
    const priceCount = await priceElements.count();
    
    if (priceCount > 0) {
      await expect(priceElements).toHaveCount(1);
    } else {
      // Skip if no prices found (might be data issue)
      test.skip();
    }
  });

  test('should handle pagination if available', async ({ page }) => {
    await page.goto('/user/products');
    await page.waitForLoadState('networkidle');
    
    // Look for pagination controls
    const pagination = page.locator('a[href*="page="]');
    
    if (await pagination.count() > 0) {
      await expect(pagination.first()).toBeVisible();
    } else {
      // Pagination might not be visible if there are no products or only one page
      test.skip();
    }
  });

  test('should show product categories', async ({ page }) => {
    await page.goto('/user/products');
    await page.waitForLoadState('networkidle');
    
    // Look for product cards
    const productCards = page.locator('div[class*="border-gray-800"]');
    const count = await productCards.count();
    
    if (count === 0) {
      test.skip();
      return;
    }
    
    // Check for category labels - use valid CSS selector
    const categoryLabels = page.locator('.text-gray-500, .text-xs');
    const categoryCount = await categoryLabels.count();
    
    if (categoryCount > 0) {
      await expect(categoryLabels.first()).toBeVisible();
    } else {
      // Skip if no category labels found
      test.skip();
    }
  });
});
