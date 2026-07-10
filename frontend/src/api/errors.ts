export function friendlyErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) {
    if (error.message === "Failed to fetch" || error.message === "NetworkError") {
      return fallback;
    }

    return error.message;
  }

  return fallback;
}

export async function readApiErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const payload = (await response.json()) as { detail?: unknown };
    return detailToMessage(payload.detail, fallback);
  } catch {
    return fallback;
  }
}

function detailToMessage(detail: unknown, fallback: string): string {
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (!item || typeof item !== "object") return "";
        const record = item as { loc?: unknown; msg?: unknown };
        if (typeof record.msg !== "string") return "";

        const field = Array.isArray(record.loc)
          ? record.loc
              .filter((part) => typeof part === "string")
              .filter((part) => part !== "body")
              .join(".")
          : "";

        return field ? `${field}: ${record.msg}` : record.msg;
      })
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.slice(0, 3).join(" ");
    }
  }

  return fallback;
}
