export const LANG_COLORS: Record<string, string> = {
  Python: "#3572a5",
  "C#": "#178600",
  JavaScript: "#f1e05a",
  Java: "#b07219",
  TypeScript: "#3178c6",
  PHP: "#4f5d95",
  React: "#61dafb",
  Docker: "#384d54",
};

export function repoName(href: string) {
  return href.split("/").filter(Boolean).pop() ?? href;
}
