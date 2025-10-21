import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import GoogleLoginBtn from "../../components/GoogleLoginBtn";

const mockLogin = vi.fn();

vi.mock("@react-oauth/google", () => ({
  useGoogleLogin: vi.fn(() => mockLogin),
  googleLogout: vi.fn(),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
  useSelector: () => null,
}));

vi.mock("react-router-dom", () => ({
  useLocation: () => ({ pathname: "/" }),
}));

describe("GoogleLoginBtn", () => {
  it("calls Google login when button is clicked", async () => {
    const user = userEvent.setup();
    render(<GoogleLoginBtn />);

    const button = screen.getByRole("button", {
      name: /zaloguj się przez google/i,
    });

    await user.click(button);

    expect(mockLogin).toHaveBeenCalled();
  });
});
