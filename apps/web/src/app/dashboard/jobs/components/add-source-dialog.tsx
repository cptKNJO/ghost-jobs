"use client";

import { useActionState, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { createSourceAction } from "../actions";
import {
  initialFormState,
  mergeForm,
  useForm,
  useTransform,
} from "@tanstack/react-form-nextjs";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";
import { FormAlerts } from "@/components/shared/form-alert";
import { sourceFormOpts } from "../utils/job-form-opts";

interface AddSourceDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddSourceDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: AddSourceDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen =
    setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

  const isLoading = false;

  const [state, action] = useActionState(createSourceAction, initialFormState);
  const form = useForm({
    ...sourceFormOpts,
    transform: useTransform((baseForm) => mergeForm(baseForm, state!), [state]),
  });

  function handleReset() {
    action(null);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          handleReset();
        }
        setOpen(v);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Source</DialogTitle>
        </DialogHeader>
        <form
          action={action as never}
          onSubmit={() => form.handleSubmit()}
          className="space-y-6 pb-4"
        >
          <FieldGroup>
            <FormAlerts state={state} />
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Source Name</FieldLabel>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                    <Input
                      id={field.name}
                      name={field.name}
                      defaultValue={field.state.value}
                      aria-invalid={isInvalid}
                      placeholder="e.g. Indeed"
                      autoComplete="off"
                      required
                    />
                  </Field>
                );
              }}
            />
            <form.Field
              name="url"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Source URL</FieldLabel>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                    <Input
                      id={field.name}
                      name={field.name}
                      defaultValue={field.state.value}
                      aria-invalid={isInvalid}
                      placeholder="https://indeed.com"
                      autoComplete="off"
                      required
                    />
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Saving..." : "Save Source"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
