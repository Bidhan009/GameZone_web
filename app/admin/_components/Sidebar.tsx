"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Gamepad2, 
  Settings, 
  ShieldCheck, 
  PackagePlus,
  UserPlus
} from "lucide-react";

const NAVIGATION_GROUPS = [
  {
    title: "Overview",
    links: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Management",
    links: [
      { href: "/admin/users", label: "All Users", icon: Users },
      { href: "/admin/products", label: "Inventory", icon: Gamepad2 },
    ],
  },
  {
    title: "Quick Actions",
    links: [
      { href: "/admin/users/create", label: "Add User", icon: UserPlus },
      { href: "/admin/products/create", label: "Add Product", icon: PackagePlus },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname?.startsWith(href);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card/50 backdrop-blur-xl md:flex flex-col">
      {/* Brand Section */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-transform group-hover:scale-105">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground uppercase">GameZone</span>
            <span className="text-[10px] font-medium text-blue-500 uppercase tracking-widest">Control Room</span>
          </div>
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {NAVIGATION_GROUPS.map((group) => (
          <div key={group.title} className="space-y-2">
            <h3 className="px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.links.map((link) => {
                const Active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${Active 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }
                    `}
                  >
                    <link.icon className={`h-4 w-4 ${Active ? "text-white" : "text-muted-foreground group-hover:text-foreground"}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer Section */}
      <div className="p-4 border-t border-border">
        <Link 
          href="/admin/settings"
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}