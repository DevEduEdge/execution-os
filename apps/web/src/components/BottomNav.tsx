"use client";

import type { NavSection } from "@execution-os/shared";
import { BarChart3, CheckCircle2, Wallet } from "lucide-react";
import clsx from "clsx";

const items: Array<{ id: NavSection; label: string; icon: typeof CheckCircle2 }> = [
  { id: "today", label: "Today", icon: CheckCircle2 },
  { id: "money", label: "Money", icon: Wallet },
  { id: "growth", label: "Growth", icon: BarChart3 }
];

export function BottomNav({
  active,
  onChange
}: {
  active: NavSection;
  onChange: (section: NavSection) => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-base/95 px-3 py-3 backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={clsx(
                "flex min-h-14 flex-col items-center justify-center rounded-lg text-xs font-bold transition",
                active === item.id ? "bg-action text-slate-950" : "bg-panel text-textSoft"
              )}
              onClick={() => onChange(item.id)}
            >
              <Icon className="mb-1 h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
