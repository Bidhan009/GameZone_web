# Playwright Testing Guide

## Setup Complete ✅

Your GameZone frontend now has comprehensive Playwright testing setup!

## Test Structure

```
tests/
├── e2e/                    # End-to-end tests
│   ├── auth.spec.ts       # Authentication tests
│   ├── cart.spec.ts        # Cart functionality tests
│   ├── checkout.spec.ts    # Checkout flow tests
│   └── products.spec.ts   # Product browsing tests
├── fixtures/
│   └── auth.fixture.ts    # Authentication setup
├── utils/
│   └── test-helpers.ts     # Common test utilities
└── README.md              # This file
```

## Running Tests

### Basic Commands
```bash
# Run all tests
npm run test

# Run with interactive UI (recommended for debugging)
npm run test:ui

# Run with visible browser
npm run test:headed

# Run in debug mode
npm run test:debug

# Generate tests by recording actions
npm run test:codegen
```

### Run Specific Tests
```bash
# Run specific test file
npx playwright test tests/e2e/cart.spec.ts

# Run tests with specific pattern
npx playwright test --grep "cart"

# Run tests in specific browser
npx playwright test --project=chromium
```

## Test Coverage

### Authentication (`auth.spec.ts`)
- ✅ Login with valid credentials
- ✅ Login with invalid credentials  
- ✅ Navigate to register page
- ✅ Logout functionality

### Cart Functionality (`cart.spec.ts`)
- ✅ Add items to cart
- ✅ Remove items from cart
- ✅ Update cart quantity
- ✅ Show correct totals
- ✅ Navigate to checkout

### Checkout Flow (`checkout.spec.ts`)
- ✅ Complete checkout process
- ✅ Form validation
- ✅ Order summary display
- ✅ Empty cart handling
- ✅ Billing address toggle

### Products (`products.spec.ts`)
- ✅ Display products
- ✅ Navigate to product details
- ✅ Add to cart from product page
- ✅ Product images and prices
- ✅ Search/filter functionality

## Configuration

### Playwright Config (`playwright.config.ts`)
- **Browsers**: Chrome, Firefox, Safari
- **Base URL**: http://localhost:3000
- **Retries**: 2 in CI, 0 locally
- **Screenshots**: On failure
- **Traces**: On first retry
- **Auto-start**: Development server

### Authentication Fixture
- Auto-login with test credentials (`nepo@gmail.com`)
- Reusable across tests
- Handles navigation to user dashboard

## Test Helpers (`test-helpers.ts`)

Common utilities for:
- Login functionality
- Adding items to cart
- Checkout form filling
- Navigation helpers

## Best Practices

### Test Organization
- Use descriptive test names
- Group related tests with `test.describe()`
- Use fixtures for common setup

### Selectors
- Use semantic selectors (button, input[type="email"])
- Add data-testid attributes for complex selectors
- Use locators with fallbacks for robustness

### Assertions
- Wait for elements with `waitForSelector()`
- Use specific assertions (`toHaveURL()`, `toHaveCount()`)
- Check both visibility and functionality

## Debugging

### UI Mode
```bash
npm run test:ui
```
- Visual test runner
- Step-by-step execution
- Time travel debugging

### Headed Mode
```bash
npm run test:headed
```
- See browser actions
- Useful for debugging flaky tests

### Codegen
```bash
npm run test:codegen
```
- Record browser actions
- Generate test code automatically
- Great for new test creation

## CI/CD Integration

Tests are ready for GitHub Actions with automatic:
- Multi-browser testing
- Parallel execution
- Artifact collection
- HTML reports

## Next Steps

1. **Run your first test**: `npm run test:ui`
2. **Add data-testid attributes** to your components
3. **Create custom tests** for your specific features
4. **Set up CI/CD** with the provided workflow
5. **Expand coverage** for edge cases and error scenarios

## Troubleshooting

### Common Issues
- **Tests fail to find elements**: Add data-testid attributes
- **Timeout errors**: Increase waitForTimeout or use waitForSelector
- **Authentication issues**: Check test credentials
- **Backend not running**: Ensure backend is on localhost:5000

### Tips
- Use `test:debug` for step-by-step execution
- Check HTML reports in `playwright-report/`
- Use `test:codegen` to discover new selectors
- Run tests in headed mode to see what's happening

Happy testing! 🎭
