import { render, screen } from "@testing-library/react";
import LoginForm from "../components/LoginForm";
import { BrowserRouter } from "react-router-dom";
import * as rrd from 'react-router-dom';

describe("<LoginForm/>", () => {
  it("renders login screen", () => {
    const context = {};
    jest.mock('react-router-dom');
    rrd.useOutletContext.mock(context)
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    expect(screen.getAllByText(/Login/i)[0]).toBeInTheDocument();
  });
});
