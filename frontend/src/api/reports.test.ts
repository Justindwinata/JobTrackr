import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "./opportunities";
import { getCareerProgressReport, getCareerProgressReportHtmlUrl } from "./reports";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("reports API client", () => {
  it("loads the career progress report", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
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
        summary_cards: [],
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
      }),
    } as Response);

    const report = await getCareerProgressReport();

    expect(report.metadata.report_title).toBe("Career Progress Report");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/reports/career-progress",
      expect.objectContaining({
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("throws ApiError for failed report requests", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ detail: "Reports unavailable." }),
    } as Response);

    await expect(getCareerProgressReport()).rejects.toEqual(
      new ApiError("Reports unavailable.", 500),
    );
  });

  it("builds the standalone HTML report URL", () => {
    expect(getCareerProgressReportHtmlUrl()).toBe(
      "http://127.0.0.1:8000/reports/career-progress.html",
    );
  });
});
