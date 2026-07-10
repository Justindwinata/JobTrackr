import type { TrackerSummaryResponse } from "../types/tracker";

import { apiBaseUrl } from "./config";
import { ApiError } from "./opportunities";

export async function getTrackerSummary(): Promise<TrackerSummaryResponse> {
  const response = await fetch(`${apiBaseUrl}/tracker/summary`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  return (await response.json()) as TrackerSummaryResponse;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { detail?: unknown };
    if (typeof payload.detail === "string") return payload.detail;
    return "Unable to load tracker summary.";
  } catch {
    return "Unable to load tracker summary.";
  }
}
