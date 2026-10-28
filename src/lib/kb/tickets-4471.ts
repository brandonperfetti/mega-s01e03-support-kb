// Where each problem found in #4471 is tracked now, and what engineering decided (update of 5 Oct,
// when #4471 closed).
import type { Problem } from '#lib/kb/problems';

export type Outcome = { state: 'fixed' | "won't fix" | 'open'; why?: string };

const REPO = 'brandonperfetti/mega-s01e03-support-kb';
const ticket = (n: number, outcome: Outcome) => ({ label: `#${n}`, href: `https://github.com/${REPO}/issues/${n}`, ...outcome });

export const TICKETS_4471: Partial<Record<Problem, ReturnType<typeof ticket>>> = {
  parser: ticket(1, { state: 'fixed', why: 'fix(dates): parse dd/mm for eu locales' }),
  hint: ticket(2, { state: "won't fix", why: 'booking-v3 form retired' }),
  'one-day-move': ticket(3, { state: 'open' }),
};
