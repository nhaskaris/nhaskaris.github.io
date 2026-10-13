/* eslint-disable @next/next/no-img-element */
import { Building2, Link2, MapPin } from "lucide-react";
import { Icons } from "@/components/icons";
import { Terminal } from "@/components/terminal/terminal";
import { DATA } from "@/data/resume";
import { BookMarked } from "lucide-react";
import { LANG_COLORS, repoName } from "@/lib/repo";

const { GitHub, LinkedIn } = DATA.contact.social;

export default function Page() {
  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[260px_1fr] lg:grid-cols-[296px_1fr]">
      <aside className="flex flex-col gap-4 self-start">
        <img
          src="https://github.com/nhaskaris.png"
          alt={DATA.name}
          className="aspect-square w-40 rounded-full border border-border object-cover md:w-full md:max-w-[296px]"
        />
        <div>
          <h1 className="text-2xl font-semibold leading-tight">{DATA.name}</h1>
          <p className="text-xl font-light text-muted-foreground">nhaskaris</p>
        </div>
        <p className="text-sm">{DATA.description}</p>
        <a
          href={GitHub.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-border bg-card py-1.5 text-center text-sm font-semibold hover:bg-accent"
        >
          Follow on GitHub
        </a>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Building2 className="size-4 shrink-0" /> Harokopio University of Athens
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" /> {DATA.location}
          </li>
          <li className="flex items-center gap-2">
            <Icons.linkedin className="size-4 shrink-0" />
            <a href={LinkedIn.url} className="hover:text-primary hover:underline">
              in/nhaskaris
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Link2 className="size-4 shrink-0" />
            <a href={DATA.url} className="hover:text-primary hover:underline">
              nhaskaris.github.io
            </a>
          </li>
        </ul>
        <div>
          <h2 className="mb-2 text-sm font-semibold">Pinned</h2>
          <div className="grid gap-2">
            {DATA.projects.slice(0, 4).map((p) => (
              <a
                key={p.title}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border p-3 transition-colors hover:border-primary/60"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <BookMarked className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{repoName(p.href)}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: LANG_COLORS[p.technologies[0]] ?? "#8b949e" }}
                  />
                  {p.technologies[0]}
                </div>
              </a>
            ))}
          </div>
        </div>
      </aside>

      <section className="min-w-0 space-y-3" aria-label="Interactive terminal">
        <h2 className="text-sm text-muted-foreground">
          Type a command or click a chip below to explore. Try &quot;help&quot;.
        </h2>
        <Terminal />
      </section>
    </main>
  );
}
