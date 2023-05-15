export const ACCOUNT_ID = `__global_access_token.json("[account_id]")__`;
export const ACCESS_TOKEN = "Bearer [[oauth/global/access_token]]";
export const REFRESH_TOKEN = "Bearer [[oauth/global/refresh_token]]";
export const DAY_MS = 1000 * 60 * 60 * 24;
export const SIGNER_DATA = {
  field: "signer",
  fields: [
    {
      name: "name_signer",
      label: "Recipient name",
      type: "text",
      required: true,
    },
    {
      name: "email_signer",
      label: "Recipient email address",
      type: "text",
      required: true,
    },
  ],
};
export const CC_DATA = {
  field: "cc",
  fields: [
    {
      name: "name_cc",
      label: "Recipient name",
      type: "text",
      required: true,
    },
    {
      name: "email_cc",
      label: "Recipient email address",
      type: "text",
      required: true,
    },
  ],
};
