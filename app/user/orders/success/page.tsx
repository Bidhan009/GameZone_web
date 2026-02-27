import { Link } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-3xl font-bold text-white mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-400 mb-6">Thank you for your order.</p>
      <Link href="/user/orders" className="text-indigo-400 hover:text-indigo-300">
        View My Orders
      </Link>
    </div>
  );
}