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
import { Input } from "@repo/ui/components/ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
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
  useTransform,
} from "@tanstack/react-form-nextjs";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";
import { jobFormOpts } from "../utils/job-form-opts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { DatePickerInput } from "@repo/ui/components/date-picker-input";

import {
  type Status,
  type Company,
  type Source,
} from "@/app/dashboard/job-post/data/job-posts";
import { FormAlerts } from "@/components/shared/form-alert";
import { AddCompanyDialog } from "./add-company-dialog";

interface AddJobPostDialogProps {
  form: ReturnType<typeof useForm>;
  action: any;
  state: any;
  lookupData: {
    statuses: Pick<Status, "id" | "name">[];
    companies: Company[];
    sources: Source[];
  };
}

const companies = [];

function formatLookupData(lookupData: AddJobPostDialogProps["lookupData"]) {
  return {
    ...lookupData,
    statuses: lookupData.statuses.map((s) => ({ label: s.name, value: s.id })),
    companies: lookupData.companies.map((d) => ({
      label: d.name,
      value: d.id,
    })),
  };
}

export function JobPostForm({
  id,
  form,
  action,
  state,
  lookupData,
}: AddJobPostDialogProps) {
  const [open, setOpen] = useState(false);
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const isLoading = false;

  // const [state, action] = useActionState(createJobPostAction, initialFormState);
  // const form = useForm({
  //   ...jobFormOpts,
  //   transform: useTransform((baseForm) => mergeForm(baseForm, state!), [state]),
  // });

  const formattedLookupData = formatLookupData(lookupData);

  return (
    <>
      <form
        id={id}
        action={action as never}
        onSubmit={() => form.handleSubmit()}
        className="space-y-6 pb-4"
      >
        <FieldGroup>
          <FormAlerts state={state} />
          <form.Field
            name="role"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Role / Job Title</FieldLabel>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
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
                      defaultValue={field.state.value}
                      aria-invalid={isInvalid}
                      placeholder="https://linkedin.com/jobs/..."
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
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Company</FieldLabel>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                    <Combobox
                      id={field.name}
                      name={field.name}
                      items={formattedLookupData.companies}
                      itemToStringValue={(item) => item.value}
                    >
                      <ComboboxInput
                        placeholder="Select a company"
                        className="mbs-auto"
                      />
                      <ComboboxContent>
                        <ComboboxEmpty className="p-0">
                          <div className="flex flex-col items-center justify-center py-4 px-4 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              type="button"
                              onClick={() => setCompanyDialogOpen(true)}
                            >
                              <Plus className="h-4 w-4" />
                              Add company
                            </Button>
                          </div>
                        </ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.value} value={item}>
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
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Source</FieldLabel>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                    <Combobox items={companies}>
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
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                    <Select
                      name={field.name}
                      defaultValue={formattedLookupData?.statuses.find(
                        (s) => s.label === "Applied",
                      )}
                      items={formattedLookupData?.statuses}
                    >
                      <SelectTrigger
                        aria-invalid={isInvalid}
                        className="mbs-auto"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {formattedLookupData?.statuses.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
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
                        <FieldLabel htmlFor={field.name}>Applied on</FieldLabel>
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
                        <FieldLabel htmlFor={field.name}>Replied on</FieldLabel>
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
      </form>
      <AddCompanyDialog
        open={companyDialogOpen}
        onOpenChange={setCompanyDialogOpen}
        showTrigger={false}
      />
    </>
  );
}
