// A merged ticket split by problem, counted the desk's way: every report under its cause, where it is
// filed (CauseTable). The one-day moves the desk noted by reading (desk-notes.json) are not a month
// flip, so they get a row of their own too, and stay counted where they are filed.
import { causeOf, groupByCause, uniqueById, type CauseGroup, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = CauseGroup['cause'] | 'one-day-move';
export type ProblemGroup = Omit<CauseGroup, 'cause'> & { problem: Problem; alsoIn: Problem[] };

export function splitTicket(
  reports: Report[],
  ticket: number,
  oneDayMove: readonly string[],
  tenantOf: (r: Report) => Tenant | undefined,
): ProblemGroup[] {
  const merged = uniqueById(reports).filter((r) => r.mergedInto === ticket);
  const moved = merged.filter((r) => oneDayMove.includes(r.id));
  const byCause = groupByCause(merged, tenantOf).map(({ cause, ...g }) => ({ problem: cause as Problem, alsoIn: [], ...g }));
  // groupByCause with no tenant lookup puts every report in one group: the summary we need.
  const byReading = groupByCause(moved, () => undefined).map(({ cause: _, ...g }) => ({
    problem: 'one-day-move' as Problem,
    alsoIn: [...new Set(g.reports.map((r) => causeOf(r, tenantOf(r)) ?? 'unplaced'))],
    ...g,
  }));
  return [...byCause, ...byReading];
}
