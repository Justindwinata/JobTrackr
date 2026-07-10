import type { TrackerSummaryResponse } from "../types/tracker";

import { apiBaseUrl } from "./config";
import { readApiErrorMessage } from "./errors";
import { ApiError } from "./opportunities";

export async function getTrackerSummary(): Promise<TrackerSummaryResponse> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/tracker/summary`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    throw new ApiError(
      "Unable to reach the JobTrackr backend. Start the FastAPI server and try again.",
      0,
    );
  }

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  return (await response.json()) as TrackerSummaryResponse;
}

async function readErrorMessage(response: Response): Promise<string> {
  return readApiErrorMessage(response, "Unable to load tracker summary.");
}
