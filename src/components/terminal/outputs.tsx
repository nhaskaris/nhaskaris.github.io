/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import {
  BookOpen,
  ExternalLink,
  GitCommitHorizontal,
  GraduationCap,
  MapPin,
  Star,
} from "lucide-react";
import { DATA } from "@/data/resume";
import { Icons } from "@/components/icons";
import { LANG_COLORS, repoName } from "@/lib/repo";
import {
  GH_USER,
  fetchContributions,
  fetchGithub,
  type ContributionData,
  type GhData,
} from "@/lib/github";

function useAsync<T>(load: () => Promise<T | null>) {
  const [state, setState] = useState<{ data: T | null; loading: boolean }>({
    data: null,
    loading: true,
  });
  useEffect(() => {
    let alive = true;
    load().then((data) => alive && setState({ data, loading: false }));
    return () => {
      alive = false;
    };
  }, [load]);
  return state;
}

export type CommandDef = {
  name: string;
  aliases?: string[];
  description: string;
};

export const COMMANDS: CommandDef[] = [
  { name: "whoami", description: "who is this?" },
  { name: "about", aliases: ["cat about.md", "cat README.md"], description: "read the README" },
  { name: "work", aliases: ["git log"], description: "commit history of my career" },
  { name: "education", aliases: ["ls education"], description: "degrees" },
  { name: "skills", aliases: ["ls skills"], description: "tools I use" },
  { name: "projects", aliases: ["gh repo list"], description: "public repositories" },
  { name: "stats", description: "live numbers from my GitHub" },
  { name: "contributions", aliases: ["git shortlog"], description: "contribution graph, last year" },
  { name: "neofetch", description: "system info, but it's me" },
  { name: "contact", description: "get in touch" },
  { name: "theme", description: "theme [light|dark] - switch colour scheme" },
  { name: "open", description: "open <project> - open a repo on GitHub" },
  { name: "clear", description: "clear the terminal" },
  { name: "help", description: "this list" },
];

// Deterministic fake short hash so each "commit" keeps a stable id.
function shortHash(input: string) {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(8, "0").slice(0, 7);
}

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function Box({
  title,
  icon,
  children,
}: {
  title: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border bg-background">
      <div className="flex items-center gap-2 rounded-t-md border-b border-border bg-card px-4 py-2 text-sm font-semibold">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

export function Help() {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
      {COMMANDS.map((c) => (
        <div key={c.name} className="contents">
          <span className="text-primary">{c.name}</span>
          <span className="text-muted-foreground">{c.description}</span>
        </div>
      ))}
      <span className="col-span-2 mt-2 text-muted-foreground">
        Tip: press <kbd className="rounded border border-border bg-card px-1">Tab</kbd> to
        autocomplete and <kbd className="rounded border border-border bg-card px-1">↑</kbd> for
        history.
      </span>
    </div>
  );
}

export function Whoami() {
  return (
    <div className="space-y-1">
      <div>
        <span className="font-semibold text-gh-green">nhaskaris</span>{" "}
        <span className="text-muted-foreground">({DATA.name})</span>
      </div>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <MapPin className="size-3.5" /> {DATA.location}
      </div>
      <p className="max-w-xl font-sans text-foreground">{DATA.description}</p>
    </div>
  );
}

export function About() {
  return (
    <Box title="README.md" icon={<BookOpen className="size-4 text-muted-foreground" />}>
      <div className="p-4 font-sans text-sm leading-relaxed [&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline">
        <Markdown>{DATA.summary}</Markdown>
      </div>
    </Box>
  );
}

export function Work() {
  return (
    <ol className="relative ml-2 space-y-5 border-l-2 border-border pl-6">
      {DATA.work.map((job, i) => {
        const hash = shortHash(`${job.company}${job.title}${job.start}`);
        return (
          <li key={hash} className="relative">
            <GitCommitHorizontal className="absolute -left-[2.15rem] top-0 size-5 bg-terminal text-muted-foreground" />
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-gh-attention">commit {hash}</span>
              {i === 0 && (
                <span className="text-xs">
                  (<span className="text-primary">HEAD -&gt; </span>
                  <span className="text-gh-green">main</span>)
                </span>
              )}
            </div>
            <div className="font-sans text-sm font-semibold">
              {job.title} <span className="font-normal text-muted-foreground">@</span>{" "}
              {job.company}
            </div>
            <div className="text-xs text-muted-foreground">
              Date: {job.start} - {job.end} · {job.location}
            </div>
            <p className="mt-1.5 max-w-2xl font-sans text-sm text-muted-foreground">
              {job.description}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

export function Education() {
  return (
    <Box title="education" icon={<GraduationCap className="size-4 text-muted-foreground" />}>
      <ul className="divide-y divide-border font-sans text-sm">
        {DATA.education.map((e) => (
          <li key={e.degree} className="flex items-center gap-3 px-4 py-2">
            <img src={e.logoUrl} alt="" className="size-5 rounded object-contain" />
            <a
              href={e.href}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 flex-1 truncate hover:text-primary hover:underline"
            >
              {e.degree}
            </a>
            <span className="hidden text-muted-foreground sm:inline">{e.school}</span>
            <span className="text-xs tabular-nums text-muted-foreground">
              {e.start} - {e.end}
            </span>
          </li>
        ))}
      </ul>
    </Box>
  );
}

export function Skills() {
  return (
    <div className="flex flex-wrap gap-2">
      {DATA.skills.map((s) => (
        <span
          key={s.name}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 font-sans text-xs font-medium text-primary"
        >
          {s.icon && <s.icon className="size-3.5" />}
          {s.name}
        </span>
      ))}
    </div>
  );
}

export function Projects() {
  const { data: live } = useAsync<GhData>(fetchGithub);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {DATA.projects.map((p) => {
        const liveRepo = live?.repos.find((r) => r.name === repoName(p.href));
        const lang = liveRepo?.language ?? p.technologies[0];
        return (
          <a
            key={p.title}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-2 rounded-md border border-border bg-background p-4 transition-colors hover:border-primary/60"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 truncate font-sans text-sm font-semibold text-primary group-hover:underline">
                {repoName(p.href)}
              </span>
              <span className="ml-auto rounded-full border border-border px-2 text-xs text-muted-foreground">
                Public
              </span>
            </div>
            <p className="flex-1 font-sans text-xs leading-relaxed text-muted-foreground">
              {p.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span
                  className="size-3 rounded-full"
                  style={{ background: LANG_COLORS[lang] ?? "#8b949e" }}
                />
                {lang}
              </span>
              <span className="flex items-center gap-1">
                <Star className="size-3.5" /> {liveRepo ? liveRepo.stargazers_count : p.dates}
              </span>
              {liveRepo && (
                <span title={liveRepo.pushed_at}>
                  updated {timeAgo(liveRepo.pushed_at)}
                </span>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
}

export function Contact() {
  const { GitHub, LinkedIn } = DATA.contact.social;
  return (
    <div className="space-y-3">
      <p className="font-sans text-sm text-muted-foreground">
        Want to collaborate, talk research or just say hi?
      </p>
      <div className="flex flex-wrap gap-2 font-sans">
        <a
          href={LinkedIn.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-gh-green-btn px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <Icons.linkedin className="size-4" /> LinkedIn
        </a>
        <a
          href={GitHub.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-1.5 text-sm font-semibold hover:bg-accent"
        >
          <Icons.github className="size-4" /> GitHub
          <ExternalLink className="size-3 text-muted-foreground" />
        </a>
      </div>
    </div>
  );
}

export function Text({ children, tone }: { children: React.ReactNode; tone?: "error" | "ok" }) {
  return (
    <div
      className={
        tone === "error"
          ? "text-destructive"
          : tone === "ok"
            ? "text-gh-green"
            : "text-muted-foreground"
      }
    >
      {children}
    </div>
  );
}

function Loading({ what }: { what: string }) {
  return <Text>Fetching {what} from GitHub...</Text>;
}

function Unavailable() {
  return (
    <Text tone="error">
      Couldn&apos;t reach GitHub right now (rate limit or offline). See{" "}
      <a
        href={`https://github.com/${GH_USER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        github.com/{GH_USER}
      </a>{" "}
      instead.
    </Text>
  );
}

export function Stats() {
  const { data, loading } = useAsync<GhData>(fetchGithub);
  if (loading) return <Loading what="stats" />;
  if (!data) return <Unavailable />;

  const own = data.repos.filter((r) => !r.fork);
  const stars = own.reduce((n, r) => n + r.stargazers_count, 0);
  const langs = new Map<string, number>();
  own.forEach((r) => r.language && langs.set(r.language, (langs.get(r.language) ?? 0) + 1));
  const ranked = [...langs.entries()].sort((a, b) => b[1] - a[1]);
  const totalLangs = ranked.reduce((n, [, c]) => n + c, 0);
  const latest = own[0];

  const rows: [string, React.ReactNode][] = [
    ["public repos", data.user.public_repos],
    ["stars earned", stars],
    ["followers", data.user.followers],
    ["on GitHub since", new Date(data.user.created_at).getFullYear()],
    ["last push", latest ? `${latest.name} (${timeAgo(latest.pushed_at)})` : "-"],
  ];

  return (
    <Box title={`${GH_USER} / stats`} icon={<Star className="size-4 text-muted-foreground" />}>
      <div className="space-y-4 p-4 font-sans text-sm">
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <span className="text-muted-foreground">{k}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
        {totalLangs > 0 && (
          <div className="space-y-2">
            <div className="flex h-2 overflow-hidden rounded-full">
              {ranked.map(([name, count]) => (
                <span
                  key={name}
                  title={name}
                  style={{
                    width: `${(count / totalLangs) * 100}%`,
                    background: LANG_COLORS[name] ?? "#8b949e",
                  }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {ranked.map(([name, count]) => (
                <span key={name} className="flex items-center gap-1.5">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: LANG_COLORS[name] ?? "#8b949e" }}
                  />
                  <span className="font-semibold">{name}</span>
                  <span className="text-muted-foreground">
                    {Math.round((count / totalLangs) * 100)}%
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Box>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function Contributions() {
  const { data, loading } = useAsync<ContributionData>(fetchContributions);
  if (loading) return <Loading what="contributions" />;
  if (!data || !data.days.length) return <Unavailable />;

  // Pad the first week so columns line up Sunday..Saturday.
  const lead = new Date(data.days[0].date + "T00:00:00Z").getUTCDay();
  const cells: (ContributionData["days"][number] | null)[] = [
    ...Array<null>(lead).fill(null),
    ...data.days,
  ];
  const weeks: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  let lastMonth = -1;
  const labels = weeks.map((w) => {
    const first = w.find(Boolean);
    const m = first ? new Date(first.date + "T00:00:00Z").getUTCMonth() : -1;
    if (m !== lastMonth && m !== -1) {
      lastMonth = m;
      return MONTHS[m];
    }
    return "";
  });

  return (
    <Box title={`${data.total} contributions in the last year`}>
      <div
        className="overflow-x-auto p-4"
        ref={(el) => {
          if (el) el.scrollLeft = el.scrollWidth;
        }}
      >
        <div className="flex w-max gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              <span className="h-3 text-[10px] leading-3 text-muted-foreground">{labels[wi]}</span>
              {week.map((day, di) =>
                day ? (
                  <span
                    key={day.date}
                    title={`${day.count} contributions on ${day.date}`}
                    className="cell-in size-[11px] rounded-[2px]"
                    style={{
                      background: `var(--c${day.level})`,
                      animationDelay: `${wi * 14}ms`,
                    }}
                  />
                ) : (
                  <span key={`pad-${di}`} className="size-[11px]" />
                ),
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
          Less
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className="size-[11px] rounded-[2px]" style={{ background: `var(--c${l})` }} />
          ))}
          More
        </div>
      </div>
    </Box>
  );
}

const LOGO = String.raw`
 _   _ _   _
| \ | | | | |
|  \| | |_| |
| |\  |  _  |
|_| \_|_| |_|
`.trim();

export function Neofetch() {
  const [years] = useState(() =>
    Math.floor((Date.now() - new Date("2023-10-01").getTime()) / (365.25 * 86_400_000)),
  );
  const rows: [string, string][] = [
    ["Name", DATA.name],
    ["Role", "PhD candidate, Academic Researcher"],
    ["Org", "Harokopio University of Athens"],
    ["Location", DATA.location],
    ["Uptime", `${years}+ years in the field (since Oct 2023)`],
    ["Stack", DATA.skills.map((s) => s.name).join(", ")],
    ["Shell", "bash (a very convincing one)"],
    ["Host", "GitHub Pages"],
  ];
  const palette = ["bg-destructive", "bg-gh-attention", "bg-gh-green", "bg-primary", "bg-gh-done", "bg-foreground"];

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3">
      <pre className="font-mono font-bold leading-tight text-primary" aria-hidden>
        {LOGO}
      </pre>
      <div className="min-w-0 grow basis-64 space-y-0.5">
        <div>
          <span className="font-semibold text-gh-green">nhaskaris</span>
          <span className="text-muted-foreground">@</span>
          <span className="font-semibold text-gh-green">portfolio</span>
        </div>
        <div className="text-muted-foreground">-----------------</div>
        {rows.map(([k, v]) => (
          <div key={k}>
            <span className="font-semibold text-primary">{k}</span>
            <span className="text-muted-foreground">: </span>
            {v}
          </div>
        ))}
        <div className="flex gap-1 pt-2">
          {palette.map((c) => (
            <span key={c} className={`size-4 ${c}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
