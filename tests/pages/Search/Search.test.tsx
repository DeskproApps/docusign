import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render, waitFor, fireEvent } from "@testing-library/react/";
import React from "react";
import { Search } from "../../../src/pages/Search/Search";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <Search />
    </ThemeProvider>
  );
};

jest.mock("../../../src/api/api", () => {
  return {
    getRecipients: () => [{ data: '{"email":"a@b.com","name":"David Smith"}' }],
  };
});

describe("Main", () => {
  test("Main page should show all data correctly", async () => {
    const { getByText, getByTestId } = renderPage();

    fireEvent.change(getByTestId("search-input"), {
      target: { value: "David" },
    });

    const AssigneeName = await waitFor(() => getByText(/David Smith/i));

    const email = await waitFor(() => getByText(/a@b.com/i));

    await waitFor(() => {
      [AssigneeName, email].forEach((el) => {
        expect(el).toBeInTheDocument();
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
