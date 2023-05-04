import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render, waitFor } from "@testing-library/react/";
import React from "react";
import { Main } from "../../src/pages/Main";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <Main />
    </ThemeProvider>
  );
};

jest.mock("../../src/hooks/useLinkRecipient", () => ({
  ...jest.requireActual("../../src/api/api"),
  useLinkRecipient: () => ({
    unlinkRecipient: () => {},
    getEnvelopeIds: () => ({
      envelopeIds: ["123"],
      name: "David",
    }),
    context: {
      data: {
        user: {
          primaryEmail: "a@b.com",
        },
      },
    },
  }),
}));

jest.mock("../../src/utils/utils", () => {
  return {
    ...jest.requireActual("../../src/utils/utils"),
    promiseAllEnvelopes: () => [
      {
        status: "Sent",
        statusChangedDateTime: "2001-01-01",
      },
    ],
  };
});

describe("Main", () => {
  test("Main page should show all data correctly", async () => {
    const { getByText } = renderPage();

    const AssigneeName = await waitFor(() => getByText(/David/i));

    const Status = await waitFor(() => getByText(/Sent/i));

    await waitFor(() => {
      [AssigneeName, Status].forEach((el) => {
        expect(el).toBeInTheDocument();
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
