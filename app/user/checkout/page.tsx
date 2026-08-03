"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/api/order";
import { CreditCard, Truck, CheckCircle, ArrowLeft, User, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, clearCart, isLoading } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string>("");

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: cart?.user?.email || "",
  });

//   const [paymentInfo, setPaymentInfo] = useState({
//     cardNumber: "",
//     cardName: "",
//     expiryDate: "",
//     cvv: "",
//   });

  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Redirect if cart is empty or loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
        <div className="text-white text-xl">Loading cart...</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white mb-4">Your Cart is Empty</h1>
          <p className="text-gray-400 mb-6">Add items to your cart before checkout</p>
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors("");

    try {
      // Validate form
      if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.zipCode) {
        throw new Error("Please complete all shipping address fields");
      }

      if (!contactInfo.phone) {
        throw new Error("Please provide a phone number");
      }

      if (!cart) {
        throw new Error("Cart is not loaded");
      }

      // Create order items
      const orderItems = cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      }));

        const orderPayload = {
        items: orderItems,
        totalAmount: cart.totalPrice,
        shippingAddress,
        contactInfo,
        paymentMethod: "COD", // Cash on Delivery
        paymentStatus: "pending",
        status: "pending",
        };

      // Place order
      await createOrder(orderPayload);
      
      // Clear cart and redirect
      clearCart();
      router.push("/user/orders/success");
    } catch (error: any) {
      console.error("Order failed:", error);
      setErrors(error.response?.data?.message || error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handleBillingAddressChange = (field: string, value: string) => {
    if (sameAsShipping) {
      setSameAsShipping(false);
    }
    setBillingAddress(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#0f1115] py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/user/cart"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-black text-white uppercase">Checkout</h1>
          </div>
          <div className="text-gray-400">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in cart
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-[#1c212a] p-6 rounded-2xl border border-gray-800">
              <h2 className="flex items-center gap-2 text-white font-bold mb-4">
                <User size={20} className="text-indigo-500" /> Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-[#0f1115] border border-gray-800 rounded-lg p-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Phone</label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-[#0f1115] border border-gray-800 rounded-lg p-3 text-white"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-[#1c212a] p-6 rounded-2xl border border-gray-800">
              <h2 className="flex items-center gap-2 text-white font-bold mb-4">
                <Truck size={20} className="text-indigo-500" /> Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Street Address</label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, street: e.target.value }))}
                    className="w-full bg-[#0f1115] border border-gray-800 rounded-lg p-3 text-white"
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">City</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full bg-[#0f1115] border border-gray-800 rounded-lg p-3 text-white"
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">State</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full bg-[#0f1115] border border-gray-800 rounded-lg p-3 text-white"
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                      className="w-full bg-[#0f1115] border border-gray-800 rounded-lg p-3 text-white"
                      placeholder="10001"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Country</label>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full bg-[#0f1115] border border-gray-800 rounded-lg p-3 text-white"
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-[#1c212a] p-6 rounded-2xl border border-gray-800">
              <h2 className="flex items-center gap-2 text-white font-bold mb-4">
                <CreditCard size={20} className="text-indigo-500" /> Billing Address
              </h2>
              <div className="mb-4">
                <label className="flex items-center gap-2 text-gray-400">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="rounded border-gray-600 bg-[#0f1115] text-indigo-600"
                  />
                  Same as shipping address
                </label>
              </div>
              
              {!sameAsShipping && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Street Address</label>
                    <input
                      type="text"
                      value={billingAddress.street}
                      onChange={(e) => handleBillingAddressChange('street', e.target.value)}
                      className="w-full bg-[#0f1115] border border-gray-800 rounded-lg p-3 text-white"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">City</label>
                      <input
                        type="text"
                        value={billingAddress.city}
                        onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                        className="w-full bg-[#0f1115] border border-gray-800 rounded-lg p-3 text-white"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">State</label>
                      <input
                        type="text"
                        value={billingAddress.state}
                        onChange={(e) => handleBillingAddressChange('state', e.target.value)}
                        className="w-full bg-[#0f1115] border border-gray-800 rounded-lg p-3 text-white"
                        placeholder="NY"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={billingAddress.zipCode}
                        onChange={(e) => handleBillingAddressChange('zipCode', e.target.value)}
                        className="w-full bg-[#0f1115] border border-gray-800 rounded-lg p-3 text-white"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Information */}
            {/* Payment Method - Cash on Delivery */}
                <div className="bg-[#1c212a] p-6 rounded-2xl border border-gray-800">
                <h2 className="flex items-center gap-2 text-white font-bold mb-4">
                    <Truck size={20} className="text-indigo-500" /> Payment Method
                </h2>

                <div className="flex items-start gap-3 p-4 bg-[#0f1115] border border-gray-800 rounded-xl">
                    <input
                    type="radio"
                    checked
                    readOnly
                    className="mt-1 accent-indigo-600"
                    />
                    <div>
                    <p className="text-white font-semibold">Cash on Delivery (COD)</p>
                    <p className="text-gray-400 text-sm">
                        Pay with cash when your order is delivered to your address.
                    </p>
                    </div>
                </div>

                <p className="text-green-400 text-sm mt-4">
                    ✔ No online payment required.
                </p>
                </div>
                        </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1c212a] p-6 rounded-2xl border border-gray-800 sticky top-6">
              <h2 className="text-white font-bold mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.product._id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {item.product.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium truncate">
                        {item.product.name}
                      </p>
                      <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-white font-bold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 border-t border-gray-800 pt-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
              </div>

              <div className="flex justify-between text-white font-bold text-xl border-t border-gray-800 pt-4 mt-4 mb-6">
                <span>Total</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>

              {/* Error Display */}
              {errors && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                  <p className="text-red-400 text-sm">{errors}</p>
                </div>
              )}

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Place Order
                  </>
                )}
              </button>

              {/* Security Note */}
              <div className="mt-4 text-center">
                <p className="text-gray-500 text-xs">
                  🔒 Secure checkout powered by GameZone
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}