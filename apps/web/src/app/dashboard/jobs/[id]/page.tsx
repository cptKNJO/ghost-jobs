import { notFound } from "next/navigation";
import { Icon } from "@repo/ui/components/ui/icon";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Link } from "@repo/ui/components/ui/link";
import DateComponent from "../components/date-component";
import { getJobPostByIdAction, getLookupDataAction } from "../actions";
import { EditJobPostDialog } from "../components/edit-job-post-dialog";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getJobPostByIdAction(id);

  if (!post) {
    notFound();
  }

  const [jobPost, lookupData] = await Promise.all([
    getJobPostByIdAction(id),
    getLookupDataAction(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link variant="ghost" href="/dashboard">
            <Icon name="arrow-left" className="size-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            Application Details
          </h1>
        </div>
        <div className="flex gap-2">
          <EditJobPostDialog lookupData={lookupData} jobPost={jobPost} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-2xl font-bold">{post.role}</CardTitle>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <Icon name="buildings" className="size-4" />
                <span>{post.company?.name || "Unknown Company"}</span>
              </div>
            </div>
            <Badge
              variant={
                post.status?.name === "Rejected" ? "destructive" : "secondary"
              }
              className="text-sm px-3 py-1"
            >
              {post.status?.name}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 border-t pt-6">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Icon name="calendar" className="size-4" />
                  Applied On
                </div>
                <div className="text-base">
                  <DateComponent date={post.appliedOn} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Icon name="calendar" className="size-4" />
                  Replied On
                </div>
                <div className="text-base">
                  <DateComponent date={post.repliedOn} />
                </div>
              </div>
            </div>

            {post.linkToPost && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Job Posting
                </div>
                <Button variant="outline" className="w-full sm:w-auto" asChild>
                  <a
                    href={post.linkToPost}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    View Original Post
                    <Icon name="external-link" className="size-4" />
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Icon name="info" className="size-4" />
              Source Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Platform
              </div>
              <div className="text-base">
                {post.source?.name || "Manual Entry"}
              </div>
            </div>
            {post.source?.url && (
              <div className="space-y-1 pt-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Source Website
                </div>
                <Link
                  href={post.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {new URL(post.source.url).hostname}
                  <Icon name="external-link" className="size-3" />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
