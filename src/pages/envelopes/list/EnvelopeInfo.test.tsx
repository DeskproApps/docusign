import { DeskproTheme, lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { IEnvelopeFromList } from "../../../api/types";
import { render, screen } from "@testing-library/react";
import EnvelopeInfo from "./EnvelopeInfo";

function renderEnvelopeInfo() {
    const mockProps = {
        theme: { colors: { grey80: "#888888" } } as DeskproTheme,
        user: { name: "Jane Doe" },
        envelope: {
            envelopeId: "123",
            emailSubject: "Test Subject",
            status: "sent",
            lastModifiedDateTime: "2023-01-01T12:00:00Z",
            recipients: {
                signers: [{
                    name: "Jane Doe",
                    email: "fake@notImportant.com",
                    userId: "1"
                }]
            }
        } as IEnvelopeFromList,
    }

    return render(
        <ThemeProvider theme={lightTheme}>
            <EnvelopeInfo {...mockProps} />
        </ThemeProvider>
    )
}

describe("EnvelopeInfo", () => {
    it("should render envelope subject and user name", () => {
        renderEnvelopeInfo()

        expect(screen.getByText("Test Subject")).toBeInTheDocument()
        expect(screen.getByText("Jane Doe")).toBeInTheDocument()
    })

    it("should render formatted date and status", () => {
        renderEnvelopeInfo()

        expect(screen.getByText("1 Jan 2023 12:00")).toBeInTheDocument()
        expect(screen.getByText("sent")).toBeInTheDocument()
    });
});