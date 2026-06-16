import Link from "next/link";
import { BookOpen, GraduationCap, LayoutDashboard, LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/login", label: "Admin", icon: ShieldCheck },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b bg-white/92 backdrop-blur">
      <div className="page-shell flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-bold text-blue-700">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-blue-600 text-white">
            <GraduationCap size={20} />
          </span>
          <span className="truncate">MSBTE Notes</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <Link href={item.href}>
                <item.icon size={16} />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">
              <LogIn size={16} />
              Login
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
