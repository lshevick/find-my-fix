import { render, screen } from "@testing-library/react";
import LoginForm from "../components/LoginForm";
import App from "../App";
import { BrowserRouter } from "react-router-dom";
// import * as rrd from 'react-router-dom';

describe("<LoginForm/>", () => {
  it("renders login screen", () => {
    // const context = {};
    // jest.mock('react-router-dom');
    // rrd.useOutletContext.mock(context)
    render(
      <BrowserRouter> 
        <App>
          <LoginForm />
        </App>
      </BrowserRouter>
    );
    expect(screen.getAllByText(/Login/i)[0]).toBeInTheDocument();
  });
});
