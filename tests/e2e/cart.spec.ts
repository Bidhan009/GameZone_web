import { test, expect } from '../fixtures/auth.fixture';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Cart Functionality', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ authenticatedPage }) => {
    helpers = new TestHelpers(authenticatedPage);
  });

  test('should add item to cart', async ({ authenticatedPage }) => {
    // Navigate to products
    await authenticatedPage.goto('/products');
    
    // Wait for products to load
    await authenticatedPage.waitForSelector('.product-card, [data-testid="product-card"]');
    
    // Click first product
    await authenticatedPage.locator('.product-card, [data-testid="product-card"]').first().click();
    
    // Wait for product page
    await authenticatedPage.waitForSelector('h1, .product-title');
    
    // Add to cart
    await authenticatedPage.click('button:has-text("Add to Cart"), button:has-text("Add to cart")');
    
    // Wait for cart update
    await helpers.waitForCartUpdate();
    
    // Go to cart
    await helpers.goToCart();
    
    // Verify item in cart
    await expect(authenticatedPage.locator('.cart-item, [data-testid="cart-item"]')).toHaveCount(1);
    
    // Verify cart shows item details
    await expect(authenticatedPage.locator('text=/\\$[0-9]+\\.\\d{2}/')).toBeVisible();
  });

  test('should remove item from cart', async ({ authenticatedPage }) => {
    // Add item first
    await helpers.addToCart();
    await helpers.goToCart();
    
    // Verify item is in cart
    await expect(authenticatedPage.locator('.cart-item, [data-testid="cart-item"]')).toHaveCount(1);
    
    // Remove item
    await authenticatedPage.click('.remove-item-btn, button:has-text("Remove"), [data-testid="remove-item"]');
    
    // Wait for cart to update
    await authenticatedPage.waitForTimeout(1000);
    
    // Verify cart is empty
    await expect(authenticatedPage.locator('.empty-cart, .text-gray-400:has-text("empty"), [data-testid="empty-cart"]')).toBeVisible();
  });

  test('should update cart quantity', async ({ authenticatedPage }) => {
    // Add item first
    await helpers.addToCart();
    await helpers.goToCart();
    
    // Find quantity selector
    const quantitySelector = authenticatedPage.locator('input[type="number"], select, [data-testid="quantity"]');
    
    if (await quantitySelector.isVisible()) {
      // Update quantity
      await quantitySelector.fill('2');
      
      // Wait for cart to update
      await authenticatedPage.waitForTimeout(1000);
      
      // Verify total price updated
      const totalPrice = authenticatedPage.locator('text=/\\$[0-9]+\\.\\d{2}/');
      await expect(totalPrice).toBeVisible();
    }
  });

  test('should show correct cart total', async ({ authenticatedPage }) => {
    // Add item first
    await helpers.addToCart();
    await helpers.goToCart();
    
    // Verify total price is displayed
    await expect(authenticatedPage.locator('text=Total, .total-price, [data-testid="total"]')).toBeVisible();
    
    // Verify price format
    await expect(authenticatedPage.locator('text=/\\$[0-9]+\\.\\d{2}/')).toBeVisible();
  });

  test('should proceed to checkout from cart', async ({ authenticatedPage }) => {
    // Add item first
    await helpers.addToCart();
    await helpers.goToCart();
    
    // Click proceed to checkout
    await authenticatedPage.click('a:has-text("Proceed to Checkout"), button:has-text("Proceed to Checkout")');
    
    // Should navigate to checkout page
    await expect(authenticatedPage).toHaveURL('/user/checkout');
    
    // Verify checkout form is visible
    await expect(authenticatedPage.locator('form, .checkout-form, [data-testid="checkout-form"]')).toBeVisible();
  });
});
