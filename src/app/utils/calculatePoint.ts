import { Match, Team, Leaderboard } from "@prisma/client";

type MatchWithTeams = Match & {
  homeTeam: Team;
  awayTeam: Team;
};

type LeaderboardWithTeam = Leaderboard & {
  team: Team;
};

type Result = {
  team: Team;
  win: number;
  lose: number;
  points: number;
  totalMatches: number;
};

interface Props {
  leaderboard: LeaderboardWithTeam[];
  matches: MatchWithTeams[];
}
export default function calculatePoint({ leaderboard, matches }: Props): Result[] {
  return leaderboard.map(team => {
    const teamId = team.teamId;
    let win = 0;
    let lose = 0;
    let points = 0;

    matches.forEach(match => {
      const { homeTeamId, awayTeamId, homeScore, awayScore } = match;

      if (homeScore === null || awayScore === null) return;

      const isHome = homeTeamId === teamId;
      const isAway = awayTeamId === teamId;

      if (!isHome && !isAway) return; // tim tidak terlibat

      const teamScore = isHome ? homeScore : awayScore;
      const opponentScore = isHome ? awayScore : homeScore;

      win += teamScore;
      lose += opponentScore;

      if (teamScore > opponentScore) {
        points += 1;
      }
    });

    const totalMatches = matches.filter(
      m => m.homeTeamId === teamId || m.awayTeamId === teamId
    ).length;

    return {
      team: team.team,
      win,
      lose,
      totalMatches,
      points,
    };
  }).sort((a, b) => {
    if (b.points === a.points) {
      return b.win - a.win;
    }
    return b.points - a.points;
  });
}
