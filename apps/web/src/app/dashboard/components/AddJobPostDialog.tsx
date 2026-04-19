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
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@repo/ui/components/ui/combobox";
import { Plus } from "lucide-react";
import { createJobPostAction } from "../actions";
import {
  initialFormState,
  mergeForm,
  useForm,
  useStore,
  useTransform,
} from "@tanstack/react-form-nextjs";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";
import { jobFormOpts } from "./jobFormOpts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { DatePickerInput } from "@repo/ui/components/date-picker-input";

interface AddJobPostDialogProps {
  lookupData: {
    statuses: any[];
    companies: any[];
    sources: any[];
  };
}
const companies = [
  // { label: "Google", value: "1" },
  // { label: "Meta", value: "2" },
  // { label: "Amazon", value: "3" },
];

export function AddJobPostDialog({ lookupData }: AddJobPostDialogProps) {
  const [open, setOpen] = useState(true);
  const isLoading = false;

  const [state, action] = useActionState(createJobPostAction, initialFormState);
  const form = useForm({
    ...jobFormOpts,
    transform: useTransform((baseForm) => mergeForm(baseForm, state!), [state]),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="h-9 px-4">
            <Plus className="mr-2 size-4" /> New Application
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
        </DialogHeader>
        <form
          action={action as never}
          onSubmit={() => form.handleSubmit()}
          className="space-y-6 pb-4"
        >
          <FieldGroup>
            {/*{formErrors.map((error, i) => (
              <p key={i}>Error: {error}</p>
            ))}*/}
            <form.Field
              name="role"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Role / Job Title
                    </FieldLabel>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                    <Input
                      id={field.name}
                      name={field.name}
                      aria-invalid={isInvalid}
                      placeholder="Software Engineer"
                      autoComplete="off"
                      required
                    />
                  </Field>
                );
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              <form.Field
                name="linkToPost"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Link to post</FieldLabel>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      <Input
                        id={field.name}
                        name={field.name}
                        aria-invalid={isInvalid}
                        placeholder="https://linkedin.com/jobs/..."
                        required
                        className="mbs-auto"
                      />
                    </Field>
                  );
                }}
              />
              <form.Field
                name="companyId"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field orientation="responsive" data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Company</FieldLabel>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      <Combobox items={companies} open>
                        <ComboboxInput
                          id={field.name}
                          name={field.name}
                          placeholder="Select a company"
                          className="mbs-auto"
                        />
                        <ComboboxContent>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item.label} value={item}>
                                {item.label}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </Field>
                  );
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <form.Field
                name="sourceId"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field orientation="responsive" data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Source</FieldLabel>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      <Combobox items={companies} open>
                        <ComboboxInput
                          id={field.name}
                          name={field.name}
                          placeholder="Select a source"
                          className="mbs-auto"
                        />
                        <ComboboxContent>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item.label} value={item}>
                                {item.label}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </Field>
                  );
                }}
              />
              <form.Field
                name="statusId"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field orientation="responsive" data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      <Select name={field.name}>
                        <SelectTrigger
                          aria-invalid={isInvalid}
                          className="mbs-auto"
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <form.Field
                name="appliedOn"
                children={(field) => {
                  return (
                    <form.Field
                      name={field.name}
                      children={(field) => (
                        <Field>
                          <FieldLabel htmlFor={field.name}>
                            Applied on
                          </FieldLabel>
                          <DatePickerInput
                            id={field.name}
                            name={field.name}
                            defaultValue={field.state.value} // Sets initial value
                          />
                        </Field>
                      )}
                    />
                  );
                }}
              />
              <form.Field
                name="repliedOn"
                children={(field) => {
                  return (
                    <form.Field
                      name={field.name}
                      children={(field) => (
                        <Field>
                          <FieldLabel htmlFor={field.name}>
                            Replied on
                          </FieldLabel>
                          <DatePickerInput
                            id={field.name}
                            name={field.name}
                            defaultValue={field.state.value} // Sets initial value
                          />
                        </Field>
                      )}
                    />
                  );
                }}
              />
            </div>
          </FieldGroup>
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
