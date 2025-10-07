import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Login from "../pages/Login";

vi.mock("../components/GoogleLoginBtn", () => ({
  default: () => <div>Mocked GoogleLoginBtn</div>,
}));

test("renders greeting with name", () => {
  render(<Login />);
  expect(screen.getByText("Witamy!")).toBeInTheDocument();
});