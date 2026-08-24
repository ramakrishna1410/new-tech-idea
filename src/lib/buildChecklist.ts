import { tasks, type Task } from "@/data/tasks";
import type { Answers } from "@/data/intakeQuestions";

export interface OrderedTask extends Task {
  /** True once every task this one depends on is itself in the applicable set. */
  blockedBy: string[];
}

/**
 * Filters tasks to the ones that apply to this family's situation, then
 * orders them so a dependency never appears after something that needs it
 * (stable topological sort, ties broken by original array order).
 */
export function buildChecklist(answers: Answers): OrderedTask[] {
  const applicable = tasks.filter((t) => t.appliesIf(answers));
  const applicableIds = new Set(applicable.map((t) => t.id));

  const resolved: OrderedTask[] = [];
  const resolvedIds = new Set<string>();
  const remaining = [...applicable];

  // Simple stable Kahn's-algorithm-style pass; dependency graph here is
  // small and acyclic by construction (tasks.ts never has forward refs).
  while (remaining.length > 0) {
    const next = remaining.findIndex((t) =>
      t.dependsOn
        .filter((depId) => applicableIds.has(depId))
        .every((depId) => resolvedIds.has(depId))
    );

    if (next === -1) {
      // Safety net: dependency cycle or bad data — append the rest as-is
      // rather than looping forever.
      for (const t of remaining) {
        resolved.push({
          ...t,
          blockedBy: t.dependsOn.filter((d) => applicableIds.has(d) && !resolvedIds.has(d)),
        });
      }
      break;
    }

    const [task] = remaining.splice(next, 1);
    resolved.push({ ...task, blockedBy: [] });
    resolvedIds.add(task.id);
  }

  return resolved;
}
