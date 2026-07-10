import { describe, expect, it } from "vitest";

import { friendlyErrorMessage, readApiErrorMessage } from "./errors";

describe("API error helpers", () => {
  it("formats FastAPI validation detail arrays", async () => {
    const response = {
      json: async () => ({
        detail: [
          {
            loc: ["body", "job_url"],
            msg: "Input should be a valid URL",
          },
        ],
      }),
    } as Response;

    await expect(readApiErrorMessage(response, "Fallback message.")).resolves.toBe(
      "job_url: Input should be a valid URL",
    );
  });

  it("uses helpful fallback for generic network errors", () => {
    expect(
      friendlyErrorMessage(
        new Error("Failed to fetch"),
        "Start the backend server and try again.",
      ),
    ).toBe("Start the backend server and try again.");
  });
});
