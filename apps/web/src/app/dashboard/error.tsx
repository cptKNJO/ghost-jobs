// app/dashboard/error.tsx
"use client";

import { Button } from "@repo/ui/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // TODO: Use Sentry to track errors
  return (
    <div className="">
      <h1 className="text-2xl">Something went wrong!</h1>

      <div className="mbs-12">
        <Button variant="outline" onClick={() => reset()}>
          Retry
        </Button>
      </div>
    </div>
  );
}
