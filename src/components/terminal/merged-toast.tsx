"use client";

import { GitMerge, X } from "lucide-react";

export function MergedToast({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="status"
      className="animate-in fade-in slide-in-from-bottom-4 fixed bottom-4 right-4 z-40 flex w-[min(24rem,calc(100vw-2rem))] items-start gap-3 rounded-md border border-border bg-popover p-3 text-sm shadow-xl"
    >
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-gh-done text-white">
        <GitMerge className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-gh-done px-2 py-0.5 text-xs font-semibold text-white">Merged</span>
          <span className="font-semibold">#1 feat: say hello</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          visitor merged 1 commit into <span className="font-mono text-primary">main</span>. Thanks for
          reaching out!
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className="rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
