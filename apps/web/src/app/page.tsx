import { Button } from "@repo/ui/components/button";
// import { db, users } from "@repo/db";

export default async function Home() {
  // Try to fetch users from DB to demonstrate integration (will fail without proper DB URL)
  let userCount = 0;
  // try {
  //   const allUsers = await db.select().from(users);
  //   userCount = allUsers.length;
  // } catch (e) {
  //   console.error("Database connection failed, check DATABASE_URL", e);
  // }

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-8 font-sans">
      <main className="flex flex-col items-center gap-8 text-center max-w-2xl bg-white dark:bg-zinc-900 p-12 rounded-2xl shadow-sm">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Job Application Tracker
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Universal Next.js 16 + React Native Monorepo
        </p>

        <div className="flex flex-col gap-4 p-6 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-full">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
            DB Status
          </p>
          <p className="text-xl font-semibold">
            {userCount > 0
              ? `${userCount} Users Found`
              : "Waiting for DB connection..."}
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <p className="text-sm text-zinc-500">Shared UI Component:</p>
          <Button text="Shared UI Button" />
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-700 w-full flex justify-center gap-6">
          <a
            href="https://nextjs.org/docs"
            className="text-sm font-medium hover:underline"
          >
            Next.js 16 Docs
          </a>
          <a
            href="https://orm.drizzle.team"
            className="text-sm font-medium hover:underline"
          >
            Drizzle ORM
          </a>
          <a
            href="https://reactnative.dev"
            className="text-sm font-medium hover:underline"
          >
            React Native
          </a>
        </div>
      </main>
    </div>
  );
}
