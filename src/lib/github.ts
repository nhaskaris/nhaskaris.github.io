export const GH_USER = "nhaskaris";

export type GhRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  html_url: string;
};

export type GhUser = {
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
};

export type GhData = { user: GhUser; repos: GhRepo[] };

export type Contribution = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type ContributionData = { total: number; days: Contribution[] };

// Memoised so every command shares one request per page load.
let ghPromise: Promise<GhData | null> | null = null;
let contribPromise: Promise<ContributionData | null> | null = null;

export function fetchGithub(): Promise<GhData | null> {
  ghPromise ??= (async () => {
    try {
      const [user, repos] = await Promise.all([
        fetch(`https://api.github.com/users/${GH_USER}`).then((r) => (r.ok ? r.json() : Promise.reject(r))),
        fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`).then((r) =>
          r.ok ? r.json() : Promise.reject(r),
        ),
      ]);
      return { user, repos } as GhData;
    } catch {
      return null;
    }
  })();
  return ghPromise;
}

// GitHub has no public API for the contribution calendar, so this uses a
// community proxy (jogruber's github-contributions-api).
export function fetchContributions(): Promise<ContributionData | null> {
  contribPromise ??= (async () => {
    try {
      const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`);
      if (!res.ok) return null;
      const json = await res.json();
      const days: Contribution[] = json.contributions;
      const total: number = Object.values(json.total as Record<string, number>)[0] ?? 0;
      return { total, days };
    } catch {
      return null;
    }
  })();
  return contribPromise;
}
