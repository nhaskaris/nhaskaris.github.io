"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="bg-gh-header text-[#f0f6fc]">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <span
          aria-hidden
          className="flex size-8 items-center justify-center rounded-md bg-white/10 font-mono text-sm font-bold"
        >
          NH
        </span>
        <span className="truncate text-sm font-semibold">
          nhaskaris <span className="font-normal opacity-60">/</span> portfolio
        </span>
        <button
          type="button"
          aria-label="Toggle theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="ml-auto flex size-8 items-center justify-center rounded-md border border-white/20 hover:bg-white/10"
        >
          <Sun className="hidden size-4 dark:block" />
          <Moon className="size-4 dark:hidden" />
        </button>
      </div>
    </header>
  );
}
