import { getProductsPaginated } from "@/lib/api/product";
import Link from "next/link";
import { ShoppingCart, Filter, Flame, ChevronRight, Package } from "lucide-react";

export default async function DashboardPage() {
  let productsData;
  let errorMessage = null;

  try {
    productsData = await getProductsPaginated(1, 6);
  } catch (error: any) {
    errorMessage = error.message || "Failed to load products";
    productsData = { products: [], total: 0, page: 1, totalPages: 0 };
  }

  const { products } = productsData;

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
          <Link href="/products" className="mt-6 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
            Shop Collection
          </Link>
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

      {/* Error State */}
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Empty State */}
      {!errorMessage && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Products Available</h3>
            <p className="text-gray-500 text-sm">Check back later for new products</p>
        </div>
      )}

      {/* Product Grid */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination / View All */}
      <div className="flex justify-center pt-4">
        <Link href="/products" className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-500 transition-colors">
          Browse Entire Inventory <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const getTag = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", class: "bg-red-600/10 text-red-400 border-red-500/20" };
    if (stock < 10) return { label: "Low Stock", class: "bg-orange-600/10 text-orange-400 border-orange-500/20" };
    return { label: "In Stock", class: "bg-green-600/10 text-green-400 border-green-500/20" };
  };

  const tag = getTag(product.stock);

  return (
    <div className="group relative rounded-2xl border border-gray-800 bg-[#1c212a] p-4 transition-all hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5">
      {/* Product Image */}
      <Link href={`/products/${product._id}`}>
        <div className="relative mb-4 flex h-48 items-center justify-center rounded-xl bg-[#0f1115] overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
          ) : (
            <Package className="h-16 w-16 text-gray-600" />
          )}
          <span className={`absolute left-2 top-2 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider border ${tag.class}`}>
            {tag.label}
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{product.category}</p>
        <Link href={`/products/${product._id}`}>
            <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{product.name}</h4>
        </Link>
        <div className="flex items-center justify-between pt-3">
          <span className="text-lg font-black text-white">${product.price?.toFixed(2)}</span>
          <Link href={`/products/${product._id}`}>
            <button className="rounded-lg bg-indigo-600 p-2 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95">
              <ShoppingCart size={18} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
