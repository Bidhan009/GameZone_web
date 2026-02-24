import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f1115] text-gray-100">
      <Header />
      <div className="flex mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <Sidebar />
        </aside>
        <main className="flex-1 bg-[#161920] rounded-3xl border border-gray-800 shadow-2xl p-8">
          {children}
        </main>
      </div>
    </div>
  );
}