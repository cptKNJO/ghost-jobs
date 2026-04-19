import { formOptions } from "@tanstack/react-form-nextjs";

export const jobFormOpts = formOptions({
  defaultValues: {
    role: "",
    linkToPost: "",
    companyId: "",
    statusId: "",
    sourceId: "",
  },
});
