import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render, waitFor, fireEvent } from "@testing-library/react/";
import React from "react";
import * as api from "../../../src/api/api";
import { CreateEnvelope } from "../../../src/pages/Create/CreateEnvelope";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <CreateEnvelope />
    </ThemeProvider>
  );
};

jest.mock("../../../src/api/api", () => ({
  getEnvelopesWithRecipients: () => ({}),
  sendEnvelope: jest.fn(),
}));

jest.mock("../../../src/hooks/useQueryMutation", () => ({
  useQueryMutationWithClient: () => ({
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment
    //@ts-ignore
    mutate: () => api.sendEnvelope(),
    isSuccess: true,
    isLoading: false,
  }),
}));

describe("Create", () => {
  test("Create page should create an envelope with a template correctly", async () => {
    const { findByTestId, getByTestId } = renderPage();

    fireEvent.change(getByTestId("email-subject-input"), {
      target: { value: "email@email.com" },
    });

    fireEvent.change(getByTestId("signer-name-input-0"), {
      target: { value: "email@email.com" },
    });

    fireEvent.change(getByTestId("signer-email-input-0"), {
      target: { value: "email@email.com" },
    });

    fireEvent.change(getByTestId("file-input"), {
      target: {
        files: [
          new File(["asd"], "icon.svg", {
            type: "image/svg+xml",
          }),
        ],
      },
    });

    fireEvent(await findByTestId("submit-button"), new MouseEvent("click"));

    await waitFor(() => {
      expect(api.sendEnvelope).toBeCalledTimes(1);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
