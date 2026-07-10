import type {
  OpportunityFilters,
  SavedOpportunity,
  SavedOpportunityCreate,
  SavedOpportunityListResponse,
  SavedOpportunityUpdate,
} from "../types/opportunity";

import { apiBaseUrl } from "./config";
import { readApiErrorMessage } from "./errors";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function createOpportunity(
  opportunity: SavedOpportunityCreate,
): Promise<SavedOpportunity> {
  return request<SavedOpportunity>("/opportunities", {
    method: "POST",
    body: JSON.stringify(opportunity),
  });
}

export async function listOpportunities(
  filters: OpportunityFilters = {},
): Promise<SavedOpportunity[]> {
  const params = new URLSearchParams();

  if (filters.status) params.set("status", filters.status);
  if (filters.source) params.set("source", filters.source);
  if (filters.search) params.set("search", filters.search);

  const query = params.toString();
  const payload = await request<SavedOpportunityListResponse>(
    `/opportunities${query ? `?${query}` : ""}`,
  );
  return payload.opportunities;
}

export async function getOpportunity(id: number): Promise<SavedOpportunity> {
  return request<SavedOpportunity>(`/opportunities/${id}`);
}

export async function updateOpportunity(
  id: number,
  opportunity: SavedOpportunityUpdate,
): Promise<SavedOpportunity> {
  return request<SavedOpportunity>(`/opportunities/${id}`, {
    method: "PUT",
    body: JSON.stringify(opportunity),
  });
}

export async function deleteOpportunity(id: number): Promise<void> {
  await request<void>(`/opportunities/${id}`, {
    method: "DELETE",
  });
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
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

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function readErrorMessage(response: Response): Promise<string> {
  return readApiErrorMessage(
    response,
    "Request failed. Please check the submitted opportunity details.",
  );
}
