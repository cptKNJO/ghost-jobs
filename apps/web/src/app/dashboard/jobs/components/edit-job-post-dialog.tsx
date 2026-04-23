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
import { editJobPostAction } from "../actions";
import {
  FormOptions,
  initialFormState,
  mergeForm,
  useForm,
  useTransform,
} from "@tanstack/react-form-nextjs";

import { jobFormOpts } from "../utils/job-form-opts";

import { type Status, type Company, type Source } from "../data/types";
import { JobPostForm } from "./job-post-form";
import { JobPost } from "../utils/schema";

interface EditJobPostDialogProps {
  jobPost: JobPost;
  lookupData: {
    statuses: Pick<Status, "id" | "name">[];
    companies: Company[];
    sources: Source[];
  };
}

export function EditJobPostDialog({
  jobPost,
  lookupData,
}: EditJobPostDialogProps) {
  const [open, setOpen] = useState(false);
  const isLoading = false;

  const editJobPostActionWithId = editJobPostAction.bind(null, jobPost?.id);

  const [state, action] = useActionState(
    editJobPostActionWithId,
    initialFormState,
  );

  const defaultValues = createInitialValues(jobFormOpts, jobPost);

  const form = useForm({
    defaultValues,
    transform: useTransform((baseForm) => mergeForm(baseForm, state!), [state]),
  });

  function handleReset() {
    startTransition(() => {
      action(null); // Pass null to trigger reset
    });
    form.reset();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          handleReset();
          setOpen(v);
          return;
        }
        setOpen(v);
      }}
    >
      <DialogTrigger
        render={
          <Button className="h-9 px-4">
            <Icon name="plus" className="mr-2 size-4" /> Edit Application
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
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

function createInitialValues(formOptions: FormOptions, item: JobPost) {
  return {
    ...formOptions.defaultValues,
    ...item,
  };
}
