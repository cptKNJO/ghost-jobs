"use client";

import { useActionState, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Plus } from "lucide-react";
import { createCompanyAction } from "../actions";
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
import { companyFormOpts } from "../utils/job-form-opts";

interface AddCompanyDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export function AddCompanyDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  showTrigger = true,
}: AddCompanyDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen =
    setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

  const isLoading = false;

  const [state, action] = useActionState(createCompanyAction, initialFormState);
  const form = useForm({
    ...companyFormOpts,
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
          <DialogTitle>Add New Company</DialogTitle>
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
                    <FieldLabel htmlFor={field.name}>Company Name</FieldLabel>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                    <Input
                      id={field.name}
                      name={field.name}
                      defaultValue={field.state.value}
                      aria-invalid={isInvalid}
                      placeholder="e.g. Acme Corp"
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
              {isLoading ? "Saving..." : "Save Company"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
