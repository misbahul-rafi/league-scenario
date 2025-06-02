import { Match, Team } from "@prisma/client";

interface MatchXTeam extends Match {
  homeTeam: Team,
  awayTeam: Team,
}

export function timeIndonesia(isoString: Date, timeZone: string = 'Asia/Jakarta'): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone
  });
}

export function dailyGroup(
  matches: MatchXTeam[]
): { date: string; matches: MatchXTeam[] }[] {
  const groups: Record<string, MatchXTeam[]> = {};

  matches.forEach((match) => {
    const d = new Date(match.date);
    if (isNaN(d.getTime())) return;

    const dateKey = `${d.toLocaleDateString("id-ID", { weekday: "long" })}, ${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
    (groups[dateKey] ||= []).push(match);
  });

  return Object.entries(groups)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, matches]) => ({ date, matches }));
}

export function weeklyGroup(matches: MatchXTeam[]) {
  const getWeekStart = (date: Date): number => {
    const day = date.getUTCDay(); // 0 (Minggu) - 6 (Sabtu)
    const diff = (day === 0 ? -6 : 1) - day; // Senin sebagai awal minggu
    const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    monday.setUTCDate(monday.getUTCDate() + diff);
    monday.setUTCHours(0, 0, 0, 0);
    return monday.getTime(); // timestamp
  };

  const groups = new Map<number, MatchXTeam[]>(); // key: minggu, value: array match

  matches.forEach((match) => {
    const date = new Date(match.date);
    const weekStart = getWeekStart(date);

    if (!groups.has(weekStart)) {
      groups.set(weekStart, []);
    }
    groups.get(weekStart)!.push(match);
  });

  const currentWeek = getWeekStart(new Date());

  const pastWeeks: MatchXTeam[][] = [];
  const upcomingWeeks: MatchXTeam[][] = [];

  Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .forEach(([weekStart, matchGroup]) => {
      if (weekStart < currentWeek) {
        pastWeeks.push(matchGroup);
      } else {
        upcomingWeeks.push(matchGroup);
      }
    });

  return {
    pastWeeks,
    upcomingWeeks,
  };
}
