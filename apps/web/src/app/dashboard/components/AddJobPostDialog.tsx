"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Plus } from "lucide-react";
import { createJobPostAction } from "../actions";

interface AddJobPostDialogProps {
  lookupData: {
    statuses: any[];
    companies: any[];
    sources: any[];
  };
}

export function AddJobPostDialog({ lookupData }: AddJobPostDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setErrors(null);

    const result = await createJobPostAction(formData);

    setIsLoading(false);

    if (result.error) {
      setErrors(result.error);
    } else {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 px-4">
          <Plus className="mr-2 size-4" /> New Application
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="role">Role / Job Title</Label>
            <Input
              id="role"
              name="role"
              placeholder="Software Engineer"
              required
            />
            {errors?.role && (
              <p className="text-xs text-destructive">{errors.role[0]}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="linkToPost">Post URL</Label>
            <Input
              id="linkToPost"
              name="linkToPost"
              placeholder="https://linkedin.com/jobs/..."
              required
            />
            {errors?.linkToPost && (
              <p className="text-xs text-destructive">{errors.linkToPost[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="companyId">Company</Label>
              <Select name="companyId">
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {lookupData.companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="statusId">Status</Label>
              <Select
                name="statusId"
                required
                defaultValue={lookupData.statuses
                  .find((s) => s.name === "Applied")
                  ?.id.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {lookupData.statuses.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sourceId">Source</Label>
            <Select name="sourceId">
              <SelectTrigger>
                <SelectValue placeholder="Where did you find it?" />
              </SelectTrigger>
              <SelectContent>
                {lookupData.sources.map((source) => (
                  <SelectItem key={source.id} value={source.id.toString()}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Saving..." : "Save Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
