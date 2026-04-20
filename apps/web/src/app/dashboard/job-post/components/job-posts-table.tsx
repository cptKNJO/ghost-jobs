"use client";

import { useState, useTransition } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { DataTable } from "@repo/ui/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@repo/ui/components/ui/dialog";
import { Trash2, ExternalLink } from "lucide-react";
import { deleteJobPostAction } from "../actions";
import { FormAlerts } from "@/components/shared/form-alert";
import { Link } from "@repo/ui/components/ui/link";

interface JobPost {
  id: number;
  role: string;
  appliedOn: string | Date | null;
  linkToPost: string | null;
  company: {
    name: string;
  } | null;
  status: {
    name: string;
    code: string;
  };
  source: {
    name: string;
  } | null;
}

interface ActionCellProps {
  post: JobPost;
  onActionComplete: (result: any) => void;
}

function ActionCell({ post, onActionComplete }: ActionCellProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteJobPostAction(post.id);
      onActionComplete(result);
      setOpen(false);
    });
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {post.linkToPost && (
        <Link
          variant="ghost"
          size="icon-sm"
          href={post.linkToPost}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="size-4" />
        </Link>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              title="Delete"
            />
          }
        >
          <Trash2 className="size-4" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              application for <span className="font-semibold">{post.role}</span>{" "}
              at <span className="font-semibold">{post.company?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline" disabled={isPending} />}
            >
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface JobPostsTableProps {
  data: any[];
}

export function JobPostsTable({ data }: JobPostsTableProps) {
  const [actionState, setActionState] = useState<any>(null);

  const columns: ColumnDef<JobPost>[] = [
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("role")}</div>;
      },
    },
    {
      accessorKey: "company.name",
      header: "Company",
      cell: ({ row }) => {
        const company = row.original.company;
        return <div>{company?.name || "Unknown"}</div>;
      },
    },
    {
      accessorKey: "status.name",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={status?.name === "Rejected" ? "destructive" : "secondary"}
          >
            {status?.name}
          </Badge>
        );
      },
    },
    {
      accessorKey: "appliedOn",
      header: "Date Applied",
      cell: ({ row }) => {
        const date = row.getValue("appliedOn");
        if (!date) return "-";
        return <div>{new Date(date as string).toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "source.name",
      header: "Source",
      cell: ({ row }) => {
        const source = row.original.source;
        return (
          <div className="text-muted-foreground">{source?.name || "-"}</div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <ActionCell
            post={row.original}
            onActionComplete={(result) => setActionState(result)}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <FormAlerts state={actionState} onClear={() => setActionState(null)} />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
