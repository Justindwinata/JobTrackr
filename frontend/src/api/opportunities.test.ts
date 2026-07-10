import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ApiError,
  createOpportunity,
  deleteOpportunity,
  listOpportunities,
  updateOpportunity,
} from "./opportunities";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("opportunities API client", () => {
  it("lists opportunities with filters", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ opportunities: [] }),
    } as Response);

    const result = await listOpportunities({
      status: "wishlist",
      source: "linkedin",
      search: "frontend",
    });

    expect(result).toEqual([]);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/opportunities?status=wishlist&source=linkedin&search=frontend",
      expect.objectContaining({ headers: { "Content-Type": "application/json" } }),
    );
  });

  it("creates opportunities", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: 1, company_name: "Acme Indonesia" }),
    } as Response);

    const result = await createOpportunity({
      company_name: "Acme Indonesia",
      role_title: "Frontend Developer",
      source: "linkedin",
      job_url: "https://www.linkedin.com/jobs/view/123",
      location: "Jakarta",
      work_type: "hybrid",
      employment_type: "full_time",
      status: "wishlist",
      priority: "high",
      required_skills: ["React"],
      notes: "Manual save.",
    });

    expect(result.company_name).toBe("Acme Indonesia");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/opportunities",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("updates opportunities", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 1, status: "applied" }),
    } as Response);

    const result = await updateOpportunity(1, { status: "applied" });

    expect(result.status).toBe("applied");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/opportunities/1",
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("deletes opportunities", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 204,
    } as Response);

    await expect(deleteOpportunity(1)).resolves.toBeUndefined();
  });

  it("throws ApiError for failed responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ detail: "Invalid opportunity." }),
    } as Response);

    await expect(listOpportunities()).rejects.toEqual(
      new ApiError("Invalid opportunity.", 422),
    );
  });
});

