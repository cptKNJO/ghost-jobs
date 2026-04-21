"use client";

import { startTransition, useActionState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { updateProfileAction } from "../actions";
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
import { profileFormOpts } from "../utils/profile-form-opts";

interface ProfileFormProps {
  defaultValues: {
    displayName: string;
  };
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [state, action] = useActionState(updateProfileAction, initialFormState);

  const form = useForm({
    ...profileFormOpts,
    defaultValues,
    transform: useTransform((baseForm) => mergeForm(baseForm, state!), [state]),
  });

  const isLoading = false;

  function handleReset() {
    startTransition(() => {
      action(null); // Pass null to trigger reset
    });
  }

  return (
    <form
      action={action as never}
      onSubmit={() => form.handleSubmit()}
      className="space-y-6"
    >
      <FieldGroup>
        <FormAlerts state={state} onClear={handleReset} />
        <form.Field
          name="displayName"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Display Name</FieldLabel>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Your display name"
                  autoComplete="off"
                  required
                />
              </Field>
            );
          }}
        />
      </FieldGroup>
      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
