import { QueryClient } from "@tanstack/react-query";

export const query = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
    },
  },
});

export enum QueryKeys {
  CONTACTS = "contacts",
  CONTACT_BY_ID = "contactById",
  INVOICE_BY_CONTACT_ID = "invoiceByContactId",
  QUOTES_BY_CONTACT_ID = "quotesByContactId",
  PURCHASE_ORDERS_BY_CONTACT_ID = "purchaseOrdersByContactId",
  BILLS_BY_CONTACT_ID = "billsByContactId",
  NOTES_BY_CONTACT_ID = "notesByContactId",
}
