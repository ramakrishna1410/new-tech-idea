import type { Answers } from "@/data/intakeQuestions";

/**
 * Encodes intake answers into a compact, URL-safe string so a checklist can
 * be reconstructed from a shared link with no account or server storage.
 */
export function encodeAnswers(answers: Answers): string {
  const json = JSON.stringify(answers);
  const base64 =
    typeof window === "undefined"
      ? Buffer.from(json, "utf-8").toString("base64")
      : window.btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeAnswers(encoded: string): Answers {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json =
      typeof window === "undefined"
        ? Buffer.from(padded, "base64").toString("utf-8")
        : decodeURIComponent(escape(window.atob(padded)));
    return JSON.parse(json) as Answers;
  } catch {
    return {};
  }
}
