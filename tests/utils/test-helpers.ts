import { Page } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  async login(email: string = 'nepo@gmail.com', password: string = 'password123') {
    await this.page.goto('/login');
    await this.page.fill('input#email', email);
    await this.page.fill('input#password', password);
    await this.page.click('button[type="submit"]');
    
    // Wait for either successful login or error
    await this.page.waitForTimeout(3000);
    
    const currentUrl = this.page.url();
    
    if (currentUrl.includes('/user/dashboard')) {
      // Successful login
      return;
    } else {
      // Login failed - check for error
      const errorElement = this.page.locator('.text-red-500, .bg-red-500, .error-message');
      const errorVisible = await errorElement.isVisible();
      
      if (errorVisible) {
        const errorText = await errorElement.textContent();
        throw new Error(`Login failed: ${errorText}`);
      } else {
        throw new Error('Login failed for unknown reason');
      }
    }
  }

  async addToCart(productIndex = 0) {
    await this.page.goto('/user/products');
    // Wait for products to load
    await this.page.waitForLoadState('networkidle');
    
    // Look for product cards
    const productCards = this.page.locator('div[class*="border-gray-800"]');
    const count = await productCards.count();
    
    if (count === 0) {
      throw new Error('No products found');
    }
    
    // Click first product
    await productCards.nth(productIndex).locator('a[href*="/user/products/"]').click();
    
    // Wait for product page to load
    await this.page.waitForLoadState('networkidle');
    
    // Look for "Add to Cart" button
    const addToCartButton = this.page.locator('button:has-text("Add to Cart"), button:has-text("Add to cart")');
    
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
    } else {
      // Try to find any button that might add to cart
      const cartButton = this.page.locator('button').filter({ hasText: /cart/i });
      if (await cartButton.count() > 0) {
        await cartButton.first().click();
      } else {
        throw new Error('Add to Cart button not found');
      }
    }
  }

  async waitForCartUpdate() {
    // Wait for cart notification or update
    await this.page.waitForSelector('.cart-notification, [data-testid="cart-notification"]', { 
      state: 'visible', 
      timeout: 5000 
    }).catch(() => {
      // If no notification, just wait a bit for cart to update
      return this.page.waitForTimeout(1000);
    });
  }

  async goToCart() {
    await this.page.goto('/user/cart');
    await this.page.waitForLoadState('networkidle');
  }

  async goToCheckout() {
    await this.page.goto('/user/checkout');
    await this.page.waitForLoadState('networkidle');
  }

  async fillCheckoutForm() {
    // Fill shipping address
    await this.page.fill('input[placeholder*="Street"], input[name="street"]', '123 Test Street');
    await this.page.fill('input[placeholder*="City"], input[name="city"]', 'Test City');
    await this.page.fill('input[placeholder*="ZIP"], input[name="zipCode"]', '12345');
    await this.page.fill('input[placeholder*="phone"], input[name="phone"]', '+1234567890');
    
    // Fill payment info (if visible)
    const cardNumberInput = this.page.locator('input[placeholder*="Card"], input[name="cardNumber"]');
    if (await cardNumberInput.isVisible()) {
      await cardNumberInput.fill('4242424242424242');
      await this.page.fill('input[placeholder*="Name"], input[name="cardName"]', 'Test User');
      await this.page.fill('input[placeholder*="MM/YY"], input[name="expiryDate"]', '12/25');
      await this.page.fill('input[placeholder*="CVV"], input[name="cvv"]', '123');
    }
  }

  async placeOrder() {
    await this.page.click('button:has-text("Place Order")');
    // Wait for success page or error
    await this.page.waitForLoadState('networkidle');
  }
}
