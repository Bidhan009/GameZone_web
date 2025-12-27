import React from 'react';
import { Twitter, Instagram, Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0b0e14] border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold italic">GAME<span className="text-purple-500">ZONE</span></h2>
            <p className="text-gray-400 text-sm">
              Your one-stop shop for everything gaming. We provide the gear, you provide the skills.
            </p>
            <div className="flex gap-4">
              <Twitter className="w-5 h-5 text-gray-400 hover:text-purple-500 cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-purple-500 cursor-pointer" />
              <Github className="w-5 h-5 text-gray-400 hover:text-purple-500 cursor-pointer" />
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-6 uppercase text-sm tracking-widest">Shop</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-purple-500">Video Games</a></li>
              <li><a href="#" className="hover:text-purple-500">Consoles</a></li>
              <li><a href="#" className="hover:text-purple-500">Accessories</a></li>
              <li><a href="#" className="hover:text-purple-500">PC Components</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase text-sm tracking-widest">Support</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-purple-500">Order Tracking</a></li>
              <li><a href="#" className="hover:text-purple-500">Return Policy</a></li>
              <li><a href="#" className="hover:text-purple-500">Contact Us</a></li>
              <li><a href="#" className="hover:text-purple-500">FAQs</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold mb-6 uppercase text-sm tracking-widest">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Get the latest deals and drops.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-[#1a1f29] border border-gray-700 rounded py-2 px-3 text-sm focus:outline-none focus:border-purple-500 flex-1"
              />
              <button className="bg-purple-600 px-4 py-2 rounded text-sm font-bold hover:bg-purple-500 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} GameZone. All rights reserved. Built for gamers.
        </div>
      </div>
    </footer>
  );
};

export default Footer;