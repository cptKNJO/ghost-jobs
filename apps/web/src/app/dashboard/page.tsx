import { getUser } from "@/app/lib/dal/auth";
import { redirect } from "next/navigation";
import { getProfileAction } from "./profile/actions";
import { getJobPostsAction, getLookupDataAction } from "./actions";
import { JobPostCard } from "./components/job-post-card";
import { AddJobPostDialog } from "./components/add-job-post-dialog";
import { Briefcase } from "lucide-react";

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const [profile, jobPosts, lookupData] = await Promise.all([
    getProfileAction(),
    getJobPostsAction(),
    getLookupDataAction(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.displayName}! Track and manage your job
            search.
          </p>
        </div>
        <AddJobPostDialog lookupData={lookupData} />
      </div>

      {jobPosts.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in duration-500">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Briefcase className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No applications yet</h3>
          <p className="mt-2 mb-6 text-sm text-muted-foreground max-w-xs">
            Start tracking your job search by adding your first application.
          </p>
          <AddJobPostDialog lookupData={lookupData} />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobPosts.map((post) => (
            <JobPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
