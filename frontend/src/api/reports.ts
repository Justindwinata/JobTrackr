import type { CareerProgressReport } from "../types/report";

import { apiBaseUrl } from "./config";
import { readApiErrorMessage } from "./errors";
import { ApiError } from "./opportunities";

export async function getCareerProgressReport(): Promise<CareerProgressReport> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/reports/career-progress`, {
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

  return (await response.json()) as CareerProgressReport;
}

export function getCareerProgressReportHtmlUrl(): string {
  return `${apiBaseUrl}/reports/career-progress.html`;
}

async function readErrorMessage(response: Response): Promise<string> {
  return readApiErrorMessage(response, "Unable to load career progress report.");
}
