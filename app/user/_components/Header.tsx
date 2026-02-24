"use client";
import Link from "next/link";
import { Search, Bell, ShoppingCart, Zap, LogOut, User } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function Header() {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#0f1115]/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-[0_0_15px_#4f46e5]">
            <Zap className="text-white fill-white" size={24} />
          </div>
          <Link href="/user/dashboard" className="text-2xl font-black italic tracking-tighter text-white">
            GAME<span className="text-indigo-500">ZONE</span>
          </Link>
        </div>

        {/* Search Input */}
        <div className="hidden md:flex flex-1 max-w-md mx-10">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search gear, consoles, games..." 
              className="w-full bg-gray-900 border border-gray-800 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {/* Cart & Notifications */}
          <div className="hidden sm:flex items-center gap-4 mr-2">
            <div className="relative cursor-pointer text-gray-400 hover:text-indigo-400 transition-colors">
              <ShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-[10px] font-bold px-1.5 rounded-full text-white ring-2 ring-[#0f1115]">3</span>
            </div>
            <Bell className="text-gray-400 cursor-pointer hover:text-white transition-colors" size={22} />
          </div>

          <div className="h-8 w-px bg-gray-800 hidden sm:block"></div>

          {/* Profile & Logout Group */}
          <div className="flex items-center gap-3 bg-gray-900/50 p-1.5 pr-4 rounded-full border border-gray-800">
            <div className="h-8 w-8 rounded-full border border-indigo-500 overflow-hidden">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="avatar" 
                className="bg-gray-800"
              />
            </div>
            
            <div className="hidden lg:block">
              <p className="text-[10px] font-bold text-gray-500 uppercase leading-none">Player</p>
              <p className="text-sm font-bold text-white leading-tight">{user?.fullName || 'User'}</p>
            </div>

            <button 
              onClick={handleLogout}
              className="ml-2 p-2 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all group"
              title="Logout"
            >
              <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}