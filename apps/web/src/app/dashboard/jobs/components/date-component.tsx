export default function DateComponent({ date }: { date: string }) {
  if (!date) return "-";

  const dated = new Date(date);

  const formattedDate = formatDate(dated);
  const relativeDate = getRelativeTime(dated);

  return (
    <div>
      <div>{formattedDate}</div>
      <div className="text-muted-foreground text-xs">{relativeDate}</div>
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function getRelativeTime(date: Date) {
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();

  // Convert milliseconds to days
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  return rtf.format(diffInDays, "day");
}
