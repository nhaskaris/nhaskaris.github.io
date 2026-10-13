"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { DATA } from "@/data/resume";
import { repoName } from "@/lib/repo";
import { COMMANDS } from "./outputs";

type Item = { cmd: string; description: string };

const ITEMS: Item[] = [
  ...COMMANDS.filter((c) => !["open", "theme", "clear"].includes(c.name)).map((c) => ({
    cmd: c.name,
    description: c.description,
  })),
  ...DATA.projects.map((p) => ({ cmd: `open ${repoName(p.href)}`, description: "open repo on GitHub" })),
  { cmd: "theme light", description: "switch to the light theme" },
  { cmd: "theme dark", description: "switch to the dark theme" },
  { cmd: "clear", description: "clear the terminal" },
];

export function CommandPalette({
  open,
  onClose,
  onRun,
}: {
  open: boolean;
  onClose: () => void;
  onRun: (cmd: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? ITEMS.filter((i) => i.cmd.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
      : ITEMS;
  }, [query]);

  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  const choose = (item?: Item) => {
    if (!item) return;
    onClose();
    onRun(item.cmd);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[active]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-[15vh]"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Type a command or search..."
            aria-label="Search commands"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border border-border px-1.5 text-xs text-muted-foreground">esc</kbd>
        </div>
        <ul ref={listRef} role="listbox" className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">No matching commands</li>
          )}
          {results.map((item, i) => (
            <li
              key={item.cmd}
              role="option"
              aria-selected={i === active}
              onMouseMove={() => setActive(i)}
              onClick={() => choose(item)}
              className={`flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-2 text-sm ${
                i === active ? "bg-accent" : ""
              }`}
            >
              <span className="font-mono text-primary">{item.cmd}</span>
              <span className="truncate text-xs text-muted-foreground">{item.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
