// import { Match, Team, Leaderboard } from "@prisma/client";

// type LeaderboardxTeams = Leaderboard & {
//   team: Team
// }
// type MatchXTeams = Match & {
//   homeTeam: Team,
//   awayTeam: Team,
// }
// type Result = {
//   team: Team,
//   win: number,
//   lose: number,
//   totalMatches: number,
// }

// interface Props {
//   leaderboard: LeaderboardxTeams[],
//   matches: MatchXTeams[]
// }

// export default function calculateScore({ leaderboard, matches }: Props) {
//   const result: Result[] = leaderboard.map(team => {
//     const teamId = team.teamId;
//     const homeMatches = matches.filter(match => match.homeTeamId === teamId);
//     const awayMatches = matches.filter(match => match.awayTeamId === teamId);

//     const homeWin = homeMatches.reduce((sum, match) => sum + (match.homeScore ?? 0), 0);
//     const homeLose = homeMatches.reduce((sum, match) => sum + (match.awayScore ?? 0), 0);
//     const awayWin = awayMatches.reduce((sum, match) => sum + (match.awayScore ?? 0), 0);
//     const awayLose = awayMatches.reduce((sum, match) => sum + (match.homeScore ?? 0), 0);

//     return {
//       team: team.team,
//       win: homeWin + awayWin,
//       lose: homeLose + awayLose,
//       totalMatches: homeMatches.length + awayMatches.length,
//     }
//   });
//   return result.sort((a, b) => b.win - a.win);;
// }