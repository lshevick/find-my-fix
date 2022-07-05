import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "../App";

test("renders app", () => {
  render(<App />, {wrapper: Router});
  const linkElement = screen.getByText(/login/i);
  expect(linkElement).toBeInTheDocument();
});
