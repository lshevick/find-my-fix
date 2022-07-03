import { render, screen } from "@testing-library/react";
import LoginForm from "../components/LoginForm";
import { MemoryRouter, Router } from "react-router-dom";

describe("<LoginForm/>", () => {
  it("renders login screen", () => {
      render(<LoginForm />, {wrapper: MemoryRouter});
      expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});
