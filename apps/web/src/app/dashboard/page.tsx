import { redirect } from "next/navigation";
import { Briefcase } from "lucide-react";
import { getUser } from "@/app/lib/dal/auth";
import { getProfileAction } from "./profile/actions";
import { getJobPostsAction, getLookupDataAction } from "./job-post/actions";
import { JobPostsTable } from "./job-post/components/job-posts-table";
import { AddJobPostDialog } from "./job-post/components/add-job-post-dialog";
import { AddCompanyDialog } from "./job-post/components/add-company-dialog";

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
        <div className="flex gap-2">
          <AddCompanyDialog />
          <AddJobPostDialog lookupData={lookupData} />
        </div>
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
          <div className="flex gap-2">
            <AddCompanyDialog />
            <AddJobPostDialog lookupData={lookupData} />
          </div>
        </div>
      ) : (
        <JobPostsTable data={jobPosts} />
      )}
    </div>
  );
}
