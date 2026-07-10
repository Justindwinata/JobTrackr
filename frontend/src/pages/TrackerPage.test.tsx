import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { TrackerSummaryResponse } from "../types/tracker";
import TrackerPage from "./TrackerPage";

vi.mock("../api/tracker", () => ({
  getTrackerSummary: vi.fn(),
}));

import { getTrackerSummary } from "../api/tracker";

const getTrackerSummaryMock = vi.mocked(getTrackerSummary);

afterEach(() => {
  vi.resetAllMocks();
});

describe("TrackerPage", () => {
  it("renders the empty tracker state", async () => {
    getTrackerSummaryMock.mockResolvedValue(emptySummary());

    renderTrackerPage();

    expect(
      await screen.findByText("Save your first opportunity to start tracking applications."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Save an opportunity" })).toBeInTheDocument();
  });

  it("renders tracker dashboard data from the backend", async () => {
    getTrackerSummaryMock.mockResolvedValue(populatedSummary());

    renderTrackerPage();

    expect(await screen.findByText("Application status pipeline")).toBeInTheDocument();
    expect(screen.getAllByText("Frontend Developer").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Acme Indonesia").length).toBeGreaterThan(0);
    expect(screen.getByText("Status distribution")).toBeInTheDocument();
    expect(screen.getByText("Upcoming deadlines")).toBeInTheDocument();
    expect(screen.getByText("Recently updated opportunities")).toBeInTheDocument();
  });

  it("renders tracker load errors", async () => {
    getTrackerSummaryMock.mockRejectedValue(new Error("Backend unavailable."));

    renderTrackerPage();

    expect(
      await screen.findByText(
        "Unable to load tracker analytics. Start the backend server and try again.",
      ),
    ).toBeInTheDocument();
  });
});

function renderTrackerPage() {
  render(
    <MemoryRouter>
      <TrackerPage />
    </MemoryRouter>,
  );
}

function emptySummary(): TrackerSummaryResponse {
  return {
    summary_cards: [
      {
        key: "total",
        label: "Total saved",
        value: 0,
        description: "All manually saved opportunities.",
      },
    ],
    status_distribution: [],
    source_distribution: [],
    priority_distribution: [],
    pipeline_groups: [],
    upcoming_deadlines: [],
    overdue_opportunities: [],
    recent_activity: [],
  };
}

function populatedSummary(): TrackerSummaryResponse {
  return {
    summary_cards: [
      {
        key: "total",
        label: "Total saved",
        value: 1,
        description: "All manually saved opportunities.",
      },
      {
        key: "interviews",
        label: "Interviews",
        value: 1,
        description: "Opportunities in interview stage.",
      },
    ],
    status_distribution: [
      { key: "interview", label: "Interview", count: 1, percentage: 100 },
    ],
    source_distribution: [
      { key: "linkedin", label: "LinkedIn", count: 1, percentage: 100 },
    ],
    priority_distribution: [
      { key: "high", label: "High", count: 1, percentage: 100 },
    ],
    pipeline_groups: [
      {
        status: "interview",
        label: "Interview",
        count: 1,
        opportunities: [opportunity()],
      },
    ],
    upcoming_deadlines: [
      {
        ...opportunity(),
        days_until_deadline: 4,
      },
    ],
    overdue_opportunities: [],
    recent_activity: [
      {
        ...opportunity(),
        activity_label: "Updated interview opportunity",
      },
    ],
  };
}

function opportunity() {
  return {
    id: 1,
    company_name: "Acme Indonesia",
    role_title: "Frontend Developer",
    source: "linkedin" as const,
    location: "Jakarta",
    status: "interview" as const,
    priority: "high" as const,
    deadline: "2026-07-15",
    updated_at: "2026-07-11T00:00:00Z",
  };
}
