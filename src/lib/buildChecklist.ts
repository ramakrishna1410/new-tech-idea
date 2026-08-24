import { tasks, type Task } from "@/data/tasks";
import type { Answers } from "@/data/intakeQuestions";
import type { LocalizedText } from "@/i18n/types";

// A handful of fields (currently just property-tax-mutation's office/portal)
// can vary by answer — e.g. which district's property tax office applies.
// Resolving them here means every downstream consumer (ChecklistView,
// TaskCard) only ever sees plain values, never functions.
export interface OrderedTask extends Omit<Task, "office" | "portalUrl" | "portalLabel"> {
  office: LocalizedText;
  portalUrl?: string;
  portalLabel?: LocalizedText;
}

function resolveTask(task: Task, answers: Answers): OrderedTask {
  return {
    ...task,
    office: typeof task.office === "function" ? task.office(answers) : task.office,
    portalUrl: typeof task.portalUrl === "function" ? task.portalUrl(answers) : task.portalUrl,
    portalLabel: typeof task.portalLabel === "function" ? task.portalLabel(answers) : task.portalLabel,
  };
}

/**
 * Filters tasks to the ones that apply to this family's situation, then
 * orders them so a dependency never appears after something that needs it
 * (stable topological sort, ties broken by original array order).
 *
 * Whether a task is currently *blocked* depends on which steps the user has
 * actually checked off — that's runtime UI state this pure function has no
 * access to, so it's deliberately not computed here. See `isTaskBlocked` in
 * ChecklistView, which cross-references each task's `dependsOn` against the
 * live `done` set (and this checklist's own applicable ids, so a
 * prerequisite the user said they already have doesn't block anything).
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
      // Safety net: dependency cycle or bad data — append whatever's left
      // as-is rather than looping forever.
      resolved.push(...remaining.map((t) => resolveTask(t, answers)));
      break;
    }

    const [task] = remaining.splice(next, 1);
    resolved.push(resolveTask(task, answers));
    resolvedIds.add(task.id);
  }

  return resolved;
}
