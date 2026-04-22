"use client";

import { startTransition, useActionState, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { Icon } from "@repo/ui/components/ui/icon";
import { createJobPostAction } from "../actions";
import {
  initialFormState,
  mergeForm,
  useForm,
  useTransform,
} from "@tanstack/react-form-nextjs";

import { jobFormOpts } from "../utils/job-form-opts";

import { type Status, type Company, type Source } from "../data/job-posts";
import { JobPostForm } from "./job-post-form";

interface AddJobPostDialogProps {
  lookupData: {
    statuses: Pick<Status, "id" | "name">[];
    companies: Company[];
    sources: Source[];
  };
}

export function AddJobPostDialog({ lookupData }: AddJobPostDialogProps) {
  const [open, setOpen] = useState(false);
  const isLoading = false;

  const [state, action] = useActionState(createJobPostAction, initialFormState);
  const form = useForm({
    ...jobFormOpts,
    transform: useTransform((baseForm) => mergeForm(baseForm, state!), [state]),
  });

  function handleReset() {
    startTransition(() => {
      action(null); // Pass null to trigger reset
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          handleReset();
          form.reset();
          setOpen(v);
          return;
        }
        setOpen(v);
      }}
    >
      <DialogTrigger
        render={
          <Button className="h-9 px-4">
            <Icon name="plus" className="mr-2 size-4" /> New Application
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
        </DialogHeader>
        <JobPostForm
          id="job-form"
          form={form}
          state={state}
          action={action as never}
          lookupData={lookupData}
        />

        <DialogFooter>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
            form="job-form"
          >
            {isLoading ? "Saving..." : "Save Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
