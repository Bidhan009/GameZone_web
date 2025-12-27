import React from 'react';
import { ShoppingCart, Search, Gamepad2, User, LogIn } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-[#0b0e14] text-white sticky top-0 z-50 border-b border-purple-500/30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Gamepad2 className="w-8 h-8 text-purple-500 group-hover:rotate-12 transition-transform" />
          <span className="text-2xl font-bold tracking-tighter uppercase italic">
            Game<span className="text-purple-500">Zone</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search games, consoles, gear..." 
              className="w-full bg-[#1a1f29] border border-gray-700 rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Actions */}
        <nav className="flex items-center gap-3 md:gap-6">
          <Link href="/shop" className="hidden sm:block hover:text-purple-400 transition-colors font-medium">
            Shop
          </Link>
          
          <Link href="/account" className="hidden sm:block hover:text-purple-400 transition-colors">
            <User className="w-6 h-6" />
          </Link>

          <button className="relative p-2 hover:bg-gray-800 rounded-full transition-colors">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-purple-600 text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
              0
            </span>
          </button>

          {/* Sign In Button */}
          <Link href="/login">
            <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg font-bold transition-all active:scale-95 border border-purple-400/20">
              <LogIn className="w-4 h-4 md:w-5 h-5" />
              <span className=" xs:inline text-sm md:text-base">Sign In</span>
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;