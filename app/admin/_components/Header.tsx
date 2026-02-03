"use client";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function Header() {
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent px-4 pt-4">
      <nav
        aria-label="Global"
        className="mx-auto max-w-7xl rounded-2xl border bg-background/80 backdrop-blur-xl shadow-lg"
      >
        <div className="flex h-16 items-center justify-between px-6">
          
          {/* Left: Brand */}
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-3 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-md group-hover:scale-105 transition">
                A
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-foreground">
                  Admin Panel
                </p>
                <p className="text-[11px] text-muted-foreground">
                  GameZone Management
                </p>
              </div>
            </Link>

            <div className="hidden sm:block h-6 w-px bg-border" />

            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              ← View Website
            </Link>
          </div>

          {/* Right: User + Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                {user?.email?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="leading-tight">
                <p className="text-xs text-muted-foreground">Logged in as</p>
                <p className="text-sm font-semibold">
                  {user?.email?.split("@")[0] || "Administrator"}
                </p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}