import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import SavedPage from "./SavedPage";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SavedPage", () => {
  it("renders the manual save workflow", () => {
    render(<SavedPage />);

    expect(
      screen.getByRole("heading", { name: "Save opportunities manually" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Add opportunity")).toBeInTheDocument();
  });

  it("validates required fields before saving", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    render(<SavedPage />);

    fireEvent.click(screen.getByRole("button", { name: "Save opportunity" }));

    expect(await screen.findByText("Company name is required.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("validates job URL format", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    render(<SavedPage />);

    fireEvent.change(screen.getByLabelText(/Company name/i), {
      target: { value: "Acme Indonesia" },
    });
    fireEvent.change(screen.getByLabelText(/Role title/i), {
      target: { value: "Frontend Developer" },
    });
    fireEvent.change(screen.getByLabelText(/Job URL/i), {
      target: { value: "not-a-url" },
    });
    fireEvent.change(screen.getByLabelText(/Location/i), {
      target: { value: "Jakarta" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save opportunity" }));

    expect(await screen.findByText("Job URL must be a valid URL.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("creates a saved opportunity through the API", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        id: 1,
        company_name: "Acme Indonesia",
        role_title: "Frontend Developer",
      }),
    } as Response);

    render(<SavedPage />);

    fireEvent.change(screen.getByLabelText(/Company name/i), {
      target: { value: "Acme Indonesia" },
    });
    fireEvent.change(screen.getByLabelText(/Role title/i), {
      target: { value: "Frontend Developer" },
    });
    fireEvent.change(screen.getByLabelText(/Job URL/i), {
      target: { value: "https://www.linkedin.com/jobs/view/123" },
    });
    fireEvent.change(screen.getByLabelText(/Location/i), {
      target: { value: "Jakarta" },
    });
    fireEvent.change(screen.getByLabelText(/Required skills/i), {
      target: { value: "React, TypeScript" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save opportunity" }));

    expect(
      await screen.findByText(
        "Frontend Developer at Acme Indonesia was saved manually.",
      ),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/opportunities",
        expect.objectContaining({
          body: expect.stringContaining('"required_skills":["React","TypeScript"]'),
          method: "POST",
        }),
      );
    });
  });
});

