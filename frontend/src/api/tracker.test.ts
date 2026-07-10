import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "./opportunities";
import { getTrackerSummary } from "./tracker";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("tracker API client", () => {
  it("loads the tracker summary", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        summary_cards: [],
        status_distribution: [],
        source_distribution: [],
        priority_distribution: [],
        pipeline_groups: [],
        upcoming_deadlines: [],
        overdue_opportunities: [],
        recent_activity: [],
      }),
    } as Response);

    const summary = await getTrackerSummary();

    expect(summary.summary_cards).toEqual([]);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/tracker/summary",
      expect.objectContaining({
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("throws ApiError for failed tracker summary requests", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ detail: "Tracker unavailable." }),
    } as Response);

    await expect(getTrackerSummary()).rejects.toEqual(
      new ApiError("Tracker unavailable.", 500),
    );
  });
});
