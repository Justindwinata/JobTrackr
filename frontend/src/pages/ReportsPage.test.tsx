import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { CareerProgressReport } from "../types/report";
import ReportsPage from "./ReportsPage";

vi.mock("../api/reports", () => ({
  getCareerProgressReport: vi.fn(),
  getCareerProgressReportHtmlUrl: vi.fn(
    () => "http://127.0.0.1:8000/reports/career-progress.html",
  ),
}));

import { getCareerProgressReport } from "../api/reports";

const getCareerProgressReportMock = vi.mocked(getCareerProgressReport);

afterEach(() => {
  vi.resetAllMocks();
});

describe("ReportsPage", () => {
  it("renders the empty report state", async () => {
    getCareerProgressReportMock.mockResolvedValue(emptyReport());

    renderReportsPage();

    expect(
      await screen.findByText(
        "Save opportunities first to generate a career progress report.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Save an opportunity" })).toBeInTheDocument();
  });

  it("renders report data from the backend", async () => {
    getCareerProgressReportMock.mockResolvedValue(populatedReport());

    renderReportsPage();

    expect(await screen.findByText("Generated report")).toBeInTheDocument();
    expect(screen.getByText("Status distribution")).toBeInTheDocument();
    expect(screen.getByText("Source distribution")).toBeInTheDocument();
    expect(screen.getByText("Priority distribution")).toBeInTheDocument();
    expect(screen.getAllByText("Frontend Developer").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Acme Indonesia").length).toBeGreaterThan(0);
    expect(screen.getByText("Latest saved opportunity updates")).toBeInTheDocument();
  });

  it("links to the standalone HTML report", async () => {
    getCareerProgressReportMock.mockResolvedValue(populatedReport());

    renderReportsPage();

    const link = await screen.findByRole("link", { name: "Open HTML report" });
    expect(link).toHaveAttribute(
      "href",
      "http://127.0.0.1:8000/reports/career-progress.html",
    );
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders report load errors", async () => {
    getCareerProgressReportMock.mockRejectedValue(new Error("Backend unavailable."));

    renderReportsPage();

    expect(await screen.findByText("Backend unavailable.")).toBeInTheDocument();
  });
});

function renderReportsPage() {
  render(
    <MemoryRouter>
      <ReportsPage />
    </MemoryRouter>,
  );
}

function emptyReport(): CareerProgressReport {
  return {
    metadata: {
      report_id: "career-progress-20260711T000000Z",
      generated_at: "2026-07-11T00:00:00Z",
      report_title: "Career Progress Report",
      period_label: "All saved opportunities",
    },
    executive_summary: {
      total_opportunities: 0,
      active_opportunities: 0,
      closed_opportunities: 0,
      applied_count: 0,
      screening_count: 0,
      interview_count: 0,
      offer_count: 0,
      rejected_count: 0,
    },
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
    practical_notes: {
      deterministic_report: true,
      generated_from_manual_opportunities: true,
      no_scraping: true,
      no_external_job_board_ingestion: true,
      no_ai_generated_ranking: true,
    },
  };
}

function populatedReport(): CareerProgressReport {
  return {
    ...emptyReport(),
    executive_summary: {
      total_opportunities: 1,
      active_opportunities: 1,
      closed_opportunities: 0,
      applied_count: 0,
      screening_count: 0,
      interview_count: 1,
      offer_count: 0,
      rejected_count: 0,
    },
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
