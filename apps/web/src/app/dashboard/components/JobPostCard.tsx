import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { ExternalLink, Calendar, Trash2 } from "lucide-react";
import { deleteJobPostAction } from "../actions";

interface JobPostCardProps {
  post: any; // Ideally we'd have a generated type here
}

export function JobPostCard({ post }: JobPostCardProps) {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this application?")) {
      await deleteJobPostAction(post.id);
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold leading-none">
              {post.role}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {post.company?.name || "Unknown Company"}
            </p>
          </div>
          <Badge
            variant={
              post.status?.name === "Rejected" ? "destructive" : "secondary"
            }
          >
            {post.status?.name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3 text-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-4" />
            <span>
              Applied on {new Date(post.appliedOn).toLocaleDateString()}
            </span>
          </div>
          {post.source && (
            <div className="text-xs text-muted-foreground">
              Source: {post.source.name}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="ghost" size="sm" asChild>
          <a href={post.linkToPost} target="_blank" rel="noopener noreferrer">
            View Post <ExternalLink className="ml-2 size-3" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
