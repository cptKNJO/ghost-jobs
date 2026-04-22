// app/not-found.tsx
import { Icon } from "@repo/ui/components/ui/icon";
import { AppLink } from "@/components/shared/app-link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-muted rounded-full p-6 mb-6">
        <Icon
          name="file-question"
          className="w-12 h-12 text-muted-foreground"
        />
      </div>

      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
        Page Not Found
      </h2>

      <p className="mt-4 text-muted-foreground max-w-[500px] text-lg">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might
        have been moved or deleted.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <AppLink href="/">Return home</AppLink>
      </div>
    </div>
  );
}
