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
import { Icon } from "@repo/ui/components/ui/icon";
import { deleteJobPostAction } from "../actions";
import { FormAlerts } from "@/components/shared/form-alert";
import { Link } from "@repo/ui/components/ui/link";
import dynamic from "next/dynamic";

const NoSSRDate = dynamic(() => import("./date-component"), {
  ssr: false,
});

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
      <Link
        variant="ghost"
        size="icon-sm"
        href={`/dashboard/jobs/${post.id}`}
        title="View Details"
      >
        <Icon name="eye" className="size-4" />
      </Link>
      {post.linkToPost && (
        <Link
          variant="ghost"
          size="icon-sm"
          href={post.linkToPost}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="external-link" className="size-4" />
        </Link>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="hover:bg-destructive/10 hover:text-destructive"
              title="Delete"
            />
          }
        >
          <Icon name="trash" className="size-4" />
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

  const handleExportCsv = () => {
    const headers = [
      "Role",
      "Company",
      "Status",
      "Date Applied",
      "Source",
      "Link",
    ];
    const rows = data.map((post) => [
      post.role,
      post.company?.name || "",
      post.status.name,
      post.appliedOn
        ? new Date(post.appliedOn).toISOString().split("T")[0]
        : "",
      post.source?.name || "",
      post.linkToPost || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `job_applications_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnDef<JobPost>[] = [
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        return (
          <Link href={`/dashboard/jobs/${row.original.id}`}>
            {row.getValue("role")}
          </Link>
        );
      },
    },
    {
      accessorKey: "company.name",
      header: "Company",
      cell: ({ row }) => {
        const company = row.original.company;
        return <div>{company?.name || "-"}</div>;
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
        return <NoSSRDate date={date} />;
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
      <div className="flex items-center justify-end">
        <Button variant="outline" size="sm" onClick={handleExportCsv}>
          <Icon name="download" className="mr-2 size-4" />
          Export CSV
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
