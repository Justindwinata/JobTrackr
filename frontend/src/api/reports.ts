import type { CareerProgressReport } from "../types/report";

import { apiBaseUrl } from "./config";
import { ApiError } from "./opportunities";

export async function getCareerProgressReport(): Promise<CareerProgressReport> {
  const response = await fetch(`${apiBaseUrl}/reports/career-progress`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  return (await response.json()) as CareerProgressReport;
}

export function getCareerProgressReportHtmlUrl(): string {
  return `${apiBaseUrl}/reports/career-progress.html`;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { detail?: unknown };
    if (typeof payload.detail === "string") return payload.detail;
    return "Unable to load career progress report.";
  } catch {
    return "Unable to load career progress report.";
  }
}
