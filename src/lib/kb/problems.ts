// A merged ticket split by problem: the causes causes.ts knows, plus the one-day moves the desk
// noted by reading (desk-notes.json). A one-day move is not a month flip, so it is its own problem.
import { groupByCause, uniqueById, type CauseGroup, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = CauseGroup['cause'] | 'one-day-move';
export type ProblemGroup = Omit<CauseGroup, 'cause'> & { problem: Problem };

export function splitTicket(
  reports: Report[],
  ticket: number,
  oneDayMove: readonly string[],
  tenantOf: (r: Report) => Tenant | undefined,
): ProblemGroup[] {
  const merged = uniqueById(reports).filter((r) => r.mergedInto === ticket);
  const moved = merged.filter((r) => oneDayMove.includes(r.id));
  const rest = merged.filter((r) => !oneDayMove.includes(r.id));
  const byCause = groupByCause(rest, tenantOf).map(({ cause, ...g }) => ({ problem: cause as Problem, ...g }));
  // groupByCause with no tenant lookup puts every report in one group: the summary we need.
  const byReading = groupByCause(moved, () => undefined).map(({ cause: _, ...g }) => ({ problem: 'one-day-move' as Problem, ...g }));
  return [...byCause, ...byReading].sort((a, b) => b.reports.length - a.reports.length);
}
