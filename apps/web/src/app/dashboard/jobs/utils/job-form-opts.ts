import { formOptions } from "@tanstack/react-form-nextjs";

export const jobFormOpts = formOptions({
  defaultValues: {
    role: "",
    linkToPost: "",
    companyId: "",
    statusId: "",
    sourceId: "",
    appliedOn: new Date(),
    repliedOn: null,
  },
});

export const companyFormOpts = formOptions({
  defaultValues: {
    name: "",
  },
});

export const sourceFormOpts = formOptions({
  defaultValues: {
    name: "",
    url: "",
  },
});
