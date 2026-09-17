import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "../../context/AuthContext";

jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );

describe("Header component", () => {
  it("shows public navigation links when the user is not authenticated", () => {
    useAuth.mockReturnValue({
      user: null,
      logout: jest.fn(),
      isAuthenticated: () => false,
    });

    renderHeader();

    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /logout/i }),
    ).not.toBeInTheDocument();
  });

  it("shows authenticated navigation and user greeting when logged in", () => {
    useAuth.mockReturnValue({
      user: { name: "Alice", email: "alice@example.com" },
      logout: jest.fn(),
      isAuthenticated: () => true,
    });

    renderHeader();

    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/hi, alice/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("calls logout when the logout button is clicked", async () => {
    const user = userEvent.setup();
    const logoutMock = jest.fn();

    useAuth.mockReturnValue({
      user: { email: "demo@example.com" },
      logout: logoutMock,
      isAuthenticated: () => true,
    });

    renderHeader();

    await user.click(screen.getByRole("button", { name: /logout/i }));

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
