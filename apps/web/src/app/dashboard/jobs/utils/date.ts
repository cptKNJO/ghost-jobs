export function formatDate(date: string | Date | null | undefined) {
  if (!date) return "-";

  const d = typeof date === "string" ? new Date(date) : date;

  // Use a fixed locale to avoid hydration mismatches between server and client
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}
