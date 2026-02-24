"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Package, CreditCard, User, Gamepad2, Settings } from "lucide-react";

const menuItems = [
  { name: "Lobby (Home)", href: "/user/dashboard", icon: Home },
  { name: "My Collection", href: "/user/favourites", icon: Heart },
  { name: "Order History", href: "/user/orders", icon: Package },
  { name: "Wallet & Credits", href: "/user/payment", icon: CreditCard },
  { name: "Gamer Profile", href: "/user/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-3 sticky top-24">
      <div className="px-4 mb-6 text-xs font-bold uppercase tracking-widest text-gray-500">
        Player Menu
      </div>
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
              isActive 
                ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]" 
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <item.icon size={20} />
            <span className="font-semibold tracking-wide">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}