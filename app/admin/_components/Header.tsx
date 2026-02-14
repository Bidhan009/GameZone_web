"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { 
  LogOut, 
  Users, 
  Gamepad2, 
  ExternalLink, 
  LayoutDashboard,
  Bell
} from "lucide-react";

export default function AdminHeader() {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  // Helper to highlight active links
  const isActive = (path: string) => pathname.startsWith(path);

  const navItems = [
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Products", href: "/admin/products", icon: Gamepad2 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4">
      <nav
        aria-label="Admin Navigation"
        className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-background/60 backdrop-blur-xl shadow-2xl transition-all"
      >
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          
          {/* Left: Brand & Navigation */}
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:rotate-3 transition-transform">
                GZ
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-sm font-bold tracking-tight text-foreground">
                  GAMEZONE
                </p>
                <p className="text-[10px] font-medium uppercase tracking-widest text-blue-500">
                  Admin Pro
                </p>
              </div>
            </Link>

            <div className="h-8 w-px bg-border/60" />

            {/* Admin Nav Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all
                    ${isActive(item.href) 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Actions & User */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Link to Main Site */}
            <Link
              href="/"
              className="hidden lg:flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition"
            >
              Live Site <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <button className="p-2 text-muted-foreground hover:text-foreground transition">
                <Bell className="h-5 w-5" />
            </button>

            {/* Profile Dropdown Mockup (Simplified for now) */}
            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-border/60">
              <div className="hidden md:block text-right leading-tight">
                <p className="text-sm font-bold">{user?.email?.split("@")[0] || "Admin"}</p>
                <p className="text-[11px] text-green-500 font-medium">Online</p>
              </div>
              
              <button
                onClick={() => logout()}
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm"
                title="Logout"
              >
                <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}