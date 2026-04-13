import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import LoginForm from "./LoginForm";

const jest = { fn: vi.fn };

describe("LoginForm interaction tests", () => {
  it("allows typing into email and password fields", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);

    await user.type(screen.getByLabelText(/email/i), "alice@example.com");
    await user.type(screen.getByLabelText(/password/i), "supersecret");

    expect(screen.getByLabelText(/email/i)).toHaveValue("alice@example.com");
    expect(screen.getByLabelText(/password/i)).toHaveValue("supersecret");
  });

  it("submits with valid credentials and calls handler with expected payload", async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "alice@example.com");
    await user.type(screen.getByLabelText(/password/i), "supersecret");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(mockSubmit).toHaveBeenCalled();
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith({
      email: "alice@example.com",
      password: "supersecret",
    });
  });

  it("shows an error and does not submit when fields are empty", async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={mockSubmit} />);

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      /both fields are required/i,
    );
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
