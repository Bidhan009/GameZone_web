import { ShoppingCart, Filter, Flame, ChevronRight } from "lucide-react";

// Mock data - In Clean Architecture, this would come from your UseCase/Hive
const PRODUCTS = [
  { id: 1, name: "DualSense Edge Wireless", category: "Accessories", price: "$199.99", image: "🎮", tag: "Best Seller" },
  { id: 2, name: "Elden Ring: Shadow of Erdtree", category: "Games", price: "$39.99", image: "💿", tag: "New" },
  { id: 3, name: "Razer BlackShark V2 Pro", category: "Gear", price: "$179.00", image: "🎧", tag: "Popular" },
  { id: 4, name: "Xbox Series X", category: "Consoles", price: "$499.99", image: "📦", tag: "In Stock" },
  { id: 5, name: "Cyberpunk 2077 Ultimate", category: "Games", price: "$59.99", image: "💿", tag: "Sale" },
  { id: 6, name: "Logitech G Pro X Superlight", category: "Gear", price: "$149.00", image: "🖱️", tag: "Pro Choice" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Promo Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 shadow-2xl shadow-indigo-500/20">
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-2 text-indigo-200 font-bold uppercase tracking-tighter text-xs mb-2">
            <Flame size={14} className="fill-indigo-200" /> Flash Sale Live
          </div>
          <h2 className="text-3xl font-black text-white italic uppercase leading-none">
            Level Up Your <br /> <span className="text-indigo-900">Battlestation</span>
          </h2>
          <p className="mt-3 text-indigo-100 text-sm">Get up to 40% off on all Razer and Logitech gear this weekend only.</p>
          <button className="mt-6 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
            Shop Collection
          </button>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
      </div>

      {/* Store Header & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-black text-white uppercase">Featured Store Items</h3>
          <p className="text-gray-500 text-sm">Handpicked gaming essentials for you.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:bg-gray-700">
             <Filter size={14} /> Filter
           </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination / View All */}
      <div className="flex justify-center pt-4">
        <button className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-500 transition-colors">
          Browse Entire Inventory <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <div className="group relative rounded-2xl border border-gray-800 bg-[#1c212a] p-4 transition-all hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5">
      {/* Product Image Placeholder */}
      <div className="relative mb-4 flex h-48 items-center justify-center rounded-xl bg-[#0f1115] text-5xl">
        {product.image}
        <span className="absolute left-2 top-2 rounded-lg bg-indigo-600/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400 border border-indigo-500/20">
          {product.tag}
        </span>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{product.category}</p>
        <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{product.name}</h4>
        <div className="flex items-center justify-between pt-3">
          <span className="text-lg font-black text-white">{product.price}</span>
          <button className="rounded-lg bg-indigo-600 p-2 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}