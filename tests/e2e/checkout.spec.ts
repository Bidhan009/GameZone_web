import { test, expect } from '../fixtures/auth.fixture';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Checkout Flow', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ authenticatedPage }) => {
    helpers = new TestHelpers(authenticatedPage);
  });

  test('should complete checkout process', async ({ authenticatedPage }) => {
    // Add item to cart
    await helpers.addToCart();
    
    // Go to checkout
    await helpers.goToCheckout();
    
    // Verify checkout page loaded
    await expect(authenticatedPage.locator('h1:has-text("Checkout"), .checkout-title')).toBeVisible();
    
    // Fill checkout form
    await helpers.fillCheckoutForm();
    
    // Submit order
    await helpers.placeOrder();
    
    // Should navigate to success page
    await expect(authenticatedPage).toHaveURL('/user/orders/success');
    
    // Verify success message
    await expect(authenticatedPage.locator('h1:has-text("Order Placed Successfully"), .success-message')).toBeVisible();
  });

  test('should validate required fields', async ({ authenticatedPage }) => {
    // Add item to cart
    await helpers.addToCart();
    await helpers.goToCheckout();
    
    // Try to submit without filling form
    await authenticatedPage.click('button:has-text("Place Order")');
    
    // Should show validation errors
    await expect(authenticatedPage.locator('text=required, .error-message, [data-testid="error"]')).toBeVisible();
    
    // Should not navigate to success page
    await expect(authenticatedPage).toHaveURL('/user/checkout');
  });

  test('should show order summary', async ({ authenticatedPage }) => {
    // Add item to cart
    await helpers.addToCart();
    await helpers.goToCheckout();
    
    // Verify order summary is visible
    await expect(authenticatedPage.locator('.order-summary, [data-testid="order-summary"]')).toBeVisible();
    
    // Verify cart items are listed
    await expect(authenticatedPage.locator('.cart-item, [data-testid="cart-item"]')).toHaveCount(1);
    
    // Verify total price is shown
    await expect(authenticatedPage.locator('text=/\\$[0-9]+\\.\\d{2}/')).toBeVisible();
  });

  test('should handle empty cart', async ({ authenticatedPage }) => {
    // Try to go to checkout with empty cart
    await authenticatedPage.goto('/user/checkout');
    
    // Should redirect to cart or show empty cart message
    await expect(authenticatedPage.locator('text=empty, .empty-cart, [data-testid="empty-cart"]')).toBeVisible();
  });

  test('should toggle billing address', async ({ authenticatedPage }) => {
    // Add item to cart
    await helpers.addToCart();
    await helpers.goToCheckout();
    
    // Find "same as shipping" checkbox
    const sameAsShippingCheckbox = authenticatedPage.locator('input[type="checkbox"]:has-text("Same as shipping"), [data-testid="same-as-shipping"]');
    
    if (await sameAsShippingCheckbox.isVisible()) {
      // Verify checkbox is checked by default
      await expect(sameAsShippingCheckbox).toBeChecked();
      
      // Uncheck to show billing address fields
      await sameAsShippingCheckbox.uncheck();
      
      // Verify billing address fields appear
      await expect(authenticatedPage.locator('input[placeholder*="Street"]:visible, input[name*="billing"]')).toBeVisible();
    }
  });

  test('should navigate back to cart', async ({ authenticatedPage }) => {
    // Add item to cart
    await helpers.addToCart();
    await helpers.goToCheckout();
    
    // Click back to cart link
    await authenticatedPage.click('a:has-text("Back"), .back-link, [data-testid="back-to-cart"]');
    
    // Should navigate back to cart
    await expect(authenticatedPage).toHaveURL('/user/cart');
  });
});
