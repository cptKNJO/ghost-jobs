"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { DataTable } from "@repo/ui/components/ui/data-table";
import { Trash2, ExternalLink } from "lucide-react";
import { deleteJobPostAction } from "../actions";

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

export const columns: ColumnDef<JobPost>[] = [
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
      return <div>Date...</div>;
      // return <div>{new Date(date as string).toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: "source.name",
    header: "Source",
    cell: ({ row }) => {
      const source = row.original.source;
      return <div className="text-muted-foreground">{source?.name || "-"}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const post = row.original;

      const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this application?")) {
          await deleteJobPostAction(post.id);
        }
      };

      return (
        <div className="flex items-center justify-end gap-2">
          {post.linkToPost && (
            <Button variant="ghost" size="icon-sm" asChild title="View Post">
              <a
                href={post.linkToPost}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-4" />
              </a>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDelete}
            title="Delete"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      );
    },
  },
];

interface JobPostsTableProps {
  data: any[];
}

export function JobPostsTable({ data }: JobPostsTableProps) {
  return <DataTable columns={columns} data={data} />;
}
