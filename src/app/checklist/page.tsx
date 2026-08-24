import { Suspense } from "react";
import ChecklistView from "./ChecklistView";

export default function ChecklistPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-2xl px-6 py-16 text-slate-500">Loading…</main>}>
      <ChecklistView />
    </Suspense>
  );
}
