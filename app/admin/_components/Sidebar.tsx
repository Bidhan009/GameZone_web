"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname?.startsWith(href);

  return (
    <aside
      className="
        fixed md:static top-0 left-0 z-40
        h-screen w-64
        bg-background/80 backdrop-blur-xl
        border-r border-border
        shadow-lg
      "
    >
      {/* Brand */}
      <div className="px-5 py-4 border-b border-border">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition">
            A
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold">Admin Panel</p>
            <p className="text-[11px] text-muted-foreground">
              RentEase Control
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1">
        {ADMIN_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`
              group flex items-center gap-3
              px-4 py-2.5 rounded-xl text-sm font-medium
              transition-all
              ${
                isActive(link.href)
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            `}
          >
            {/* Active Indicator */}
            <span
              className={`h-2 w-2 rounded-full transition ${
                isActive(link.href)
                  ? "bg-primary-foreground"
                  : "bg-transparent group-hover:bg-muted-foreground/40"
              }`}
            />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}