import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-green-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-500" size={40} />
        </div>
        <h1 className="text-3xl font-black text-white mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-400 mb-6">Thank you for your order. You'll receive a confirmation email shortly.</p>
        <div className="space-y-3">
          <Link 
            href="/user/orders" 
            className="block w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all"
          >
            View My Orders
          </Link>
          <Link 
            href="/products" 
            className="block w-full py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}