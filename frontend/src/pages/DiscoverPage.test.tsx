import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import DiscoverPage from "./DiscoverPage";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("DiscoverPage", () => {
  it("validates required input before calling the backend", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    render(<DiscoverPage />);

    fireEvent.change(screen.getByLabelText("Skills"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /generate recommendations/i }));

    expect(
      await screen.findByText("Add at least one skill, target role, and preferred location."),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("renders deterministic recommendations from the backend", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        recommendations: [
          {
            title: "Frontend Developer roles in Jakarta",
            query: "Frontend Developer React TypeScript SQL",
            matched_skills: [{ name: "React" }, { name: "TypeScript" }],
            target_role: { title: "Frontend Developer" },
            location: { name: "Jakarta" },
            source_links: [
              {
                source: "linkedin",
                label: "LinkedIn",
                url: "https://www.linkedin.com/jobs/search/?keywords=Frontend+Developer",
              },
              {
                source: "glints",
                label: "Glints",
                url: "https://glints.com/id/opportunities/jobs/explore?keyword=Frontend",
              },
            ],
          },
        ],
      }),
    } as Response);

    render(<DiscoverPage />);

    fireEvent.click(screen.getByRole("button", { name: /generate recommendations/i }));

    expect(
      await screen.findByText("Frontend Developer roles in Jakarta"),
    ).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("Glints")).toBeInTheDocument();

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/job-search/recommendations",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });
});

