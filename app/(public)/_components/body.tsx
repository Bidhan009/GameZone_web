import React from 'react';
import Link from 'next/link';

const products = [
  { id: 1, name: "Gaming Mouse", price: "$59.99", category: "Game", image: "" },
  { id: 2, name: "Gaming Pc", price: "$69.99", category: "Accessory", image: "/images/GamingPc.png" },
  { id: 3, name: "PS5", price: "$999.00", category: "Hardware", image: "/images/ps5.png" },
  { id: 4, name: "Xbox Controller", price: "$129.99", category: "Gear", image: "/images/xboxController.png" },
];

const Body = () => {
  return (
    <main className="bg-[#0f1218] min-h-screen text-gray-100">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-black/60 z-10" />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
            LEVEL UP YOUR <span className="text-purple-500">GEAR</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            The ultimate destination for gamers. From the latest AAA titles to high-performance peripherals.
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105">
            Browse All Products
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold">Featured <span className="text-purple-500">Drops</span></h2>
            <div className="h-1 w-20 bg-purple-500 mt-2"></div>
          </div>
          <button className="text-purple-400 hover:underline">View All</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group bg-[#1a1f29] rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition-all">
              <div className="h-64 bg-gray-700 relative overflow-hidden">
                 <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <span className="text-xs text-purple-400 font-semibold uppercase">{product.category}</span>
                <h3 className="text-xl font-bold mt-1 mb-2">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-white">{product.price}</span>
                  <button className="bg-purple-600 p-2 rounded-lg hover:bg-purple-500 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Body;