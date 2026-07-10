import { render, screen } from "@testing-library/react";

import App from "./App";

describe("App", () => {
  it("renders the product foundation content", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /Your career growth, tracked smarter/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Primary navigation")).toBeInTheDocument();
    expect(screen.getByText("Smart Job Discovery")).toBeInTheDocument();
    expect(screen.getByText("External Search Links")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Application Tracker" }),
    ).toBeInTheDocument();
  });
});
