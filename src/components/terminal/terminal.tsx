"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { DATA } from "@/data/resume";
import {
  About,
  COMMANDS,
  Contact,
  Contributions,
  Education,
  Help,
  Neofetch,
  Projects,
  Skills,
  Stats,
  Text,
  Whoami,
  Work,
} from "./outputs";
import { repoName } from "@/lib/repo";
import { CommandPalette } from "./command-palette";
import { MergedToast } from "./merged-toast";

type Entry = {
  id: number;
  cmd: string;
  typed: string;
  done: boolean;
  note?: { text: string; tone?: "error" | "ok" };
};

const INTRO = "whoami";

// Commands that can be deep-linked, e.g. /#projects.
const LINKABLE = ["about", "work", "education", "skills", "projects", "stats", "contributions", "neofetch", "contact", "help"];

function hashCommand() {
  const h = window.location.hash.slice(1).toLowerCase();
  return LINKABLE.includes(h) ? h : null;
}

const CHIPS = ["whoami", "about", "work", "education", "skills", "projects", "stats", "contributions", "neofetch", "contact", "help"];

const PROMPT = "visitor@nhaskaris:~$";

const ALL_NAMES = COMMANDS.flatMap((c) => [c.name, ...(c.aliases ?? [])]);

// Maps any typed command (name or alias) to its canonical name.
function canonical(cmd: string) {
  const [head] = cmd.trim().split(/\s+/);
  const lower = cmd.trim().toLowerCase();
  if (lower === "git status") return lower;
  if (lower.startsWith("git blame")) return "git blame";
  if (/^git push(\s|$)/.test(lower)) return /\s(-f|--force|--force-with-lease)(\s|$)/.test(lower) ? "git push --force" : "git push";
  if (["vim", "vi", "nvim", "nano", "emacs"].includes(head?.toLowerCase() ?? "")) return "vim";
  if ([":q", ":q!", ":wq", ":wq!", ":x"].includes(lower)) return ":q";
  const hit = COMMANDS.find((c) => c.name === lower || c.aliases?.includes(lower));
  return hit?.name ?? head?.toLowerCase() ?? "";
}

function Output({ entry }: { entry: Entry }) {
  if (entry.note) return <Text tone={entry.note.tone}>{entry.note.text}</Text>;
  switch (canonical(entry.cmd)) {
    case "help":
      return <Help />;
    case "whoami":
      return <Whoami />;
    case "about":
      return <About />;
    case "work":
      return <Work />;
    case "education":
      return <Education />;
    case "skills":
      return <Skills />;
    case "projects":
      return <Projects />;
    case "contact":
      return <Contact />;
    case "stats":
      return <Stats />;
    case "neofetch":
      return <Neofetch />;
    case "contributions":
      return <Contributions />;
    default:
      return null;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function Terminal() {
  const { setTheme, resolvedTheme } = useTheme();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [playing, setPlaying] = useState(true);
  const nextId = useRef(0);
  const cancelAuto = useRef<() => void>(() => {});
  const history = useRef<string[]>([]);
  const historyPos = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const shouldScroll = useRef(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState(false);

  // Run a command and return a note for commands that have side effects.
  const execute = useCallback(
    (cmd: string): Entry["note"] => {
      const [, ...args] = cmd.trim().split(/\s+/);
      const arg = args.join(" ").toLowerCase();
      switch (canonical(cmd)) {
        case "theme": {
          const next =
            arg === "light" || arg === "dark"
              ? arg
              : resolvedTheme === "dark"
                ? "light"
                : "dark";
          setTheme(next);
          return { text: `Switched to ${next} theme.`, tone: "ok" };
        }
        case "open": {
          const project = DATA.projects.find(
            (p) =>
              arg &&
              (repoName(p.href).toLowerCase().includes(arg) ||
                p.title.toLowerCase().includes(arg)),
          );
          if (!project) {
            return {
              text: `open: no project matching "${arg}". Try: ${DATA.projects
                .map((p) => repoName(p.href))
                .join(", ")}`,
              tone: "error",
            };
          }
          window.open(project.href, "_blank", "noopener,noreferrer");
          return { text: `Opening ${project.href} ...`, tone: "ok" };
        }
        case "git status":
          return { text: "On branch main\nnothing to commit, working tree clean" };
        case "git blame":
          return {
            text: [
              "^3f9c2a1 (Nick Haskaris 2023-10-01  1) it was probably a race condition",
              "b7d41e0e (Nick Haskaris 2024-03-14  2) works on my machine",
              "c0ffee42 (Nick Haskaris 2025-08-09  3) TODO: fix later",
              "e5a8b930 (Nick Haskaris 2026-01-02  4) later is now",
              "",
              "Verdict: it was me. It's always me. (Nobody else has commit access.)",
            ].join("\n"),
          };
        case "git push":
          return { text: "Everything up-to-date" };
        case "git push --force":
          return {
            text: [
              "To github.com:nhaskaris/portfolio.git",
              " ! [remote rejected] main -> main (protected branch hook declined)",
              "error: failed to push some refs to 'github.com:nhaskaris/portfolio.git'",
              "",
              "Rejected, nice try.",
            ].join("\n"),
            tone: "error",
          };
        case "vim":
          return {
            text: [
              "~",
              "~                 VIM - Vi IMproved",
              "~",
              "~       Type  :q<Enter>  to exit         (try it)",
              "",
              "You are now stuck in vim. Nobody has ever left on their own.",
            ].join("\n"),
          };
        case ":q":
          return { text: "Escaped vim. A rare feat.", tone: "ok" };
        case "sudo":
          return { text: "visitor is not in the sudoers file. This incident will be reported.", tone: "error" };
        case "exit":
          return { text: "There is no escape. Try `help` instead." };
        case "ls":
          return { text: COMMANDS.map((c) => c.name).join("  ") };
        default:
          if (COMMANDS.some((c) => c.name === canonical(cmd))) return undefined;
          return {
            text: `bash: ${cmd.trim().split(/\s+/)[0]}: command not found. Type "help" to see what works.`,
            tone: "error",
          };
      }
    },
    [resolvedTheme, setTheme],
  );

  // Automated intro: type each command, then reveal its output.
  useEffect(() => {
    let cancelled = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const linked = hashCommand();
    const SCRIPT = linked ? [INTRO, linked] : [INTRO];

    const flush = () => {
      cancelled = true;
      setEntries(
        SCRIPT.map((cmd, i) => ({ id: i, cmd, typed: cmd, done: true })),
      );
      nextId.current = SCRIPT.length;
      setPlaying(false);
    };
    cancelAuto.current = flush;

    if (reduced) {
      flush();
      return () => {
        cancelled = true;
      };
    }

    setEntries([]);
    nextId.current = 0;
    setPlaying(true);

    (async () => {
      await sleep(500);
      for (const cmd of SCRIPT) {
        if (cancelled) return;
        const id = nextId.current++;
        setEntries((e) => [...e, { id, cmd, typed: "", done: false }]);
        for (let i = 1; i <= cmd.length; i++) {
          await sleep(32);
          if (cancelled) return;
          setEntries((e) => e.map((x) => (x.id === id ? { ...x, typed: cmd.slice(0, i) } : x)));
        }
        await sleep(250);
        if (cancelled) return;
        setEntries((e) => e.map((x) => (x.id === id ? { ...x, done: true } : x)));
        await sleep(300);
      }
      if (!cancelled) setPlaying(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (shouldScroll.current) {
      endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      shouldScroll.current = false;
    }
  }, [entries]);

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) return;
      if (playing) cancelAuto.current();
      history.current.push(cmd);
      historyPos.current = -1;

      if (canonical(cmd) === "clear") {
        setEntries([]);
        return;
      }
      const note = execute(cmd);
      shouldScroll.current = true;
      // Keep the URL shareable: content commands become /#command.
      const name = canonical(cmd);
      if (!note && LINKABLE.includes(name)) {
        window.history.replaceState(null, "", `#${name}`);
      }
      if (name === "contact") setToast(true);
      setEntries((e) => [...e, { id: nextId.current++, cmd, typed: cmd, done: true, note }]);
    },
    [execute, playing],
  );

  // Following an in-page link like /#projects runs that command.
  const runRef = useRef(run);
  runRef.current = run;
  useEffect(() => {
    const onHash = () => {
      const cmd = hashCommand();
      if (cmd) runRef.current(cmd);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Cmd/Ctrl+K toggles the command palette from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (playing) cancelAuto.current();
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = history.current;
      if (!h.length) return;
      historyPos.current = historyPos.current < 0 ? h.length - 1 : Math.max(0, historyPos.current - 1);
      setInput(h[historyPos.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      if (historyPos.current < 0) return;
      historyPos.current += 1;
      if (historyPos.current >= h.length) {
        historyPos.current = -1;
        setInput("");
      } else setInput(h[historyPos.current]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const matches = ALL_NAMES.filter((n) => input && n.startsWith(input.toLowerCase()));
      if (matches.length === 1) setInput(matches[0]);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  };

  return (
    <div
      className="overflow-hidden rounded-md border border-border bg-terminal font-mono text-[13px] shadow-sm"
      onClick={() => {
        if (!window.getSelection()?.toString()) inputRef.current?.focus();
      }}
    >
      <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-2">
        <span className="size-3 rounded-full bg-destructive/80" />
        <span className="size-3 rounded-full bg-gh-attention/80" />
        <span className="size-3 rounded-full bg-gh-green/80" />
        <span className="ml-2 text-xs text-muted-foreground">nhaskaris — bash</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPaletteOpen(true);
          }}
          className="ml-auto rounded border border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          Commands <kbd className="ml-1">⌘/Ctrl K</kbd>
        </button>
        {playing && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              cancelAuto.current();
            }}
            className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            skip intro
          </button>
        )}
      </div>

      <div className="min-h-[420px] space-y-5 p-4" aria-live="polite">
        {entries.map((entry) => (
          <div key={entry.id} className="space-y-2">
            <div className="break-all">
              <span className="text-gh-green">{PROMPT}</span> {entry.typed}
              {!entry.done && <span className="caret ml-px inline-block h-4 w-2 translate-y-0.5 bg-foreground" />}
            </div>
            {entry.done && (
              <div className="whitespace-pre-wrap">
                <Output entry={entry} />
              </div>
            )}
          </div>
        ))}

        <div className="flex flex-wrap gap-1.5 pt-1">
          {CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                run(c);
              }}
              className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
            >
              {c}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2">
          <span className="shrink-0 text-gh-green">{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => playing && cancelAuto.current()}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            aria-label="Terminal command"
            placeholder={playing ? "" : 'type "help"'}
            className="min-w-0 flex-1 bg-transparent text-foreground caret-primary outline-none placeholder:text-muted-foreground/60"
          />
        </label>
        <div ref={endRef} />
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => {
          setPaletteOpen(false);
          inputRef.current?.focus();
        }}
        onRun={run}
      />
      {toast && <MergedToast onClose={() => setToast(false)} />}
    </div>
  );
}
