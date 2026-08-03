import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {/* 1. Main wrapper: holds everything in a row */}
      <div className="flex min-h-screen w-full bg-background">
        
        {/* 2. Sidebar: Fixed width column */}
        {/* Hidden on small screens, visible on md and up */}
        <div className="hidden md:block w-64 flex-shrink-0 border-r border-border">
          <Sidebar />
        </div>

        {/* 3. Content Area: Vertical stack of Header + Main */}
        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
          
          {/* Top Header: Stays at the top of the content area */}
          <Header />

          {/* 4. Scrollable Body Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          
        </div>
      </div>
    </AuthProvider>
  );
}