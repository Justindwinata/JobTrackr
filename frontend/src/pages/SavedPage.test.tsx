import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { SavedOpportunity } from "../types/opportunity";
import SavedPage from "./SavedPage";

const savedOpportunity: SavedOpportunity = {
  id: 1,
  company_name: "Acme Indonesia",
  role_title: "Frontend Developer",
  source: "linkedin",
  job_url: "https://www.linkedin.com/jobs/view/123",
  location: "Jakarta",
  work_type: "hybrid",
  employment_type: "full_time",
  status: "wishlist",
  priority: "high",
  deadline: null,
  salary_range: null,
  required_skills: ["React", "TypeScript"],
  notes: "Manual save.",
  created_at: "2026-07-10T00:00:00Z",
  updated_at: "2026-07-10T00:00:00Z",
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SavedPage", () => {
  it("renders the manual save workflow and empty state", async () => {
    mockFetchResponses([{ opportunities: [] }]);

    render(<SavedPage />);

    expect(
      screen.getByRole("heading", { name: "Save opportunities manually" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("No saved opportunities yet")).toBeInTheDocument();
  });

  it("renders saved opportunities from the backend", async () => {
    mockFetchResponses([{ opportunities: [savedOpportunity] }]);

    render(<SavedPage />);

    expect(await screen.findByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Acme Indonesia")).toBeInTheDocument();
    expect(screen.getAllByText("LinkedIn").length).toBeGreaterThan(0);
  });

  it("validates required fields before saving", async () => {
    const fetchMock = mockFetchResponses([{ opportunities: [] }]);
    render(<SavedPage />);

    await screen.findByText("No saved opportunities yet");
    fireEvent.click(screen.getByRole("button", { name: "Save opportunity" }));

    expect(await screen.findByText("Company name is required.")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("validates job URL format", async () => {
    const fetchMock = mockFetchResponses([{ opportunities: [] }]);
    render(<SavedPage />);

    await screen.findByText("No saved opportunities yet");
    fillRequiredFields({ jobUrl: "not-a-url" });
    fireEvent.click(screen.getByRole("button", { name: "Save opportunity" }));

    expect(await screen.findByText("Job URL must be a valid URL.")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("creates a saved opportunity through the API", async () => {
    mockFetchResponses([{ opportunities: [] }, savedOpportunity]);

    render(<SavedPage />);

    await screen.findByText("No saved opportunities yet");
    fillRequiredFields();
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

  it("updates opportunity status and notes", async () => {
    const updatedOpportunity = {
      ...savedOpportunity,
      status: "interview" as const,
      notes: "Technical interview scheduled.",
    };
    mockFetchResponses([{ opportunities: [savedOpportunity] }, updatedOpportunity]);

    render(<SavedPage />);

    expect(await screen.findByText("Frontend Developer")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Edit Frontend Developer"));
    fireEvent.change(screen.getByLabelText("Edit status"), {
      target: { value: "interview" },
    });
    fireEvent.change(screen.getByLabelText("Edit notes"), {
      target: { value: "Technical interview scheduled." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update opportunity" }));

    expect(await screen.findByText("Frontend Developer was updated.")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/opportunities/1",
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("deletes a saved opportunity after confirmation", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    mockFetchResponses([{ opportunities: [savedOpportunity] }, undefined, { opportunities: [] }]);

    render(<SavedPage />);

    expect(await screen.findByText("Frontend Developer")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Delete Frontend Developer"));

    expect(await screen.findByText("Frontend Developer was deleted.")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/opportunities/1",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("renders load errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ detail: "Server error." }),
    } as Response);

    render(<SavedPage />);

    expect(
      await screen.findByText(
        "Unable to load saved opportunities. Start the backend server and try again.",
      ),
    ).toBeInTheDocument();
  });
});

function fillRequiredFields({
  jobUrl = "https://www.linkedin.com/jobs/view/123",
}: {
  jobUrl?: string;
} = {}) {
  fireEvent.change(screen.getByLabelText(/Company name/i), {
    target: { value: "Acme Indonesia" },
  });
  fireEvent.change(screen.getByLabelText(/Role title/i), {
    target: { value: "Frontend Developer" },
  });
  fireEvent.change(screen.getByLabelText(/Job URL/i), {
    target: { value: jobUrl },
  });
  fireEvent.change(screen.getByLabelText(/^Location/i), {
    target: { value: "Jakarta" },
  });
}

function mockFetchResponses(responses: unknown[]) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
    const response = responses.shift();
    return {
      ok: true,
      status: response === undefined ? 204 : 200,
      json: async () => response,
    } as Response;
  });
}
