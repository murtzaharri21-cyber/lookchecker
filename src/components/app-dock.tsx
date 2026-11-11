"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlipHorizontal2, LayoutGrid, ScanFace, Sparkles } from "lucide-react";
import { Glass } from "@/components/liquid";

const items = [
  { href: "/tools/attractiveness", label: "Scan", icon: ScanFace, match: "/tools/attractiveness" },
  { href: "/#tools", label: "Tools", icon: LayoutGrid, match: "/" },
  { href: "/beauty-studio", label: "Studio", icon: Sparkles, match: "/beauty-studio" },
  { href: "/tools/true-mirror", label: "Mirror", icon: FlipHorizontal2, match: "/tools/true-mirror" },
];

export function AppDock() {
  const pathname = usePathname();

  return (
    <nav aria-label="Quick features" className="look-dock">
      <Glass className="look-dock-bar">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.match === "/"
              ? pathname === "/" || pathname === "/tools"
              : pathname.startsWith(item.match);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`look-dock-item ${active ? "is-active" : ""}`}
            >
              <Icon size={22} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </Glass>
    </nav>
  );
}
