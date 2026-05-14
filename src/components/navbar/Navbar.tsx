"use client";

import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Menu } from "lucide-react";
import { useSidebar } from "@/components/providers/SidebarProvider";

export default function Navbar() {
  const { toggle } = useSidebar();

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors sticky top-0 z-10">
      <div className="md:hidden flex items-center">
        <button
          onClick={toggle}
          className="p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">MetaEdit</span>
      </div>
      <div className="hidden md:flex flex-1">
        {/* Empty space for global search or breadcrumbs */}
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
        <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9 border border-slate-200 dark:border-slate-700 rounded-full" } }} />
      </div>
    </header>
  );
}
