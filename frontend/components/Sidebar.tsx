"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Settings,
  HelpCircle,
  BarChart3,
  Code2,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function Sidebar() {
  const pathname = usePathname();

  const mainNav: NavItem[] = [
    { label: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
  ];

  const customNav: NavItem[] = [
    {
      label: "Personalized",
      href: "/personalized",
      icon: <Code2 className="w-5 h-5" />,
    },
  ];

  const otherNav: NavItem[] = [
    {
      label: "Compare",
      href: "/compare",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    { label: "Help", href: "/help", icon: <HelpCircle className="w-5 h-5" /> },
    {
      label: "About Us",
      href: "/about",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-32 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo Section */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-center">
        <Image
          src="/logo.svg"
          alt="Numerica Logo"
          width={90}
          height={90}
          className="brightness-0 invert"
        />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {mainNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-3 mx-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/30"
              }`}
            >
              {item.icon}
              <span className="text-xs text-center line-clamp-2">
                {item.label}
              </span>
            </Link>
          );
        })}

        {customNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-3 mx-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/30"
              }`}
            >
              {item.icon}
              <span className="text-xs text-center line-clamp-2">
                {item.label}
              </span>
            </Link>
          );
        })}

        {otherNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-3 mx-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/30"
              }`}
            >
              {item.icon}
              <span className="text-xs text-center line-clamp-2">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
