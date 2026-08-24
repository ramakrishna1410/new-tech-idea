import type { OrderedTask } from "./buildChecklist";

export interface ChecklistEstimate {
  feeMin: number;
  feeMax: number;
  weeksMin: number;
  weeksMax: number;
}

/**
 * Total fees are a simple sum — every applicable task's cost is a real cost
 * incurred regardless of ordering. Total time is NOT a sum: tasks with no
 * dependency relationship (e.g. the gas transfer and the bank claim) can
 * happen in parallel, so summing every task's duration would wildly
 * overstate how long this actually takes. Instead this computes the
 * critical path — the longest chain of dependent tasks — which is the
 * earliest this could realistically finish if unrelated tasks are done
 * alongside each other.
 */
export function estimateChecklist(checklist: OrderedTask[]): ChecklistEstimate {
  const ids = new Set(checklist.map((t) => t.id));
  const finishMin = new Map<string, number>();
  const finishMax = new Map<string, number>();
  let feeMin = 0;
  let feeMax = 0;

  // checklist is already topologically ordered, so every dependency has
  // already been assigned a finish time by the time we reach a task.
  for (const task of checklist) {
    const deps = task.dependsOn.filter((d) => ids.has(d));
    const depFinishMin = deps.length > 0 ? Math.max(...deps.map((d) => finishMin.get(d) ?? 0)) : 0;
    const depFinishMax = deps.length > 0 ? Math.max(...deps.map((d) => finishMax.get(d) ?? 0)) : 0;

    finishMin.set(task.id, depFinishMin + task.timelineDays.min);
    finishMax.set(task.id, depFinishMax + task.timelineDays.max);
    feeMin += task.feeRupees.min;
    feeMax += task.feeRupees.max;
  }

  const allFinishMin = [...finishMin.values()];
  const allFinishMax = [...finishMax.values()];
  const criticalPathDaysMin = allFinishMin.length > 0 ? Math.max(...allFinishMin) : 0;
  const criticalPathDaysMax = allFinishMax.length > 0 ? Math.max(...allFinishMax) : 0;

  return {
    feeMin,
    feeMax,
    weeksMin: Math.ceil(criticalPathDaysMin / 7),
    weeksMax: Math.ceil(criticalPathDaysMax / 7),
  };
}
