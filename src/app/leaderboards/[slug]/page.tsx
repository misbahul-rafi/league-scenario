'use client'
import { Leaderboard, Team, Match, League } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TableLeaderboard from "@/app/components/TableLeaderboard";
import MatchComponent from "@/app/components/MatchComponent";
import Spinner from "@/app/components/Spinner";
import calculatePoint from "@/app/utils/calculatePoint";
import { weeklyGroup } from "@/app/utils/TimeFunction";


type MatchXTeam = Match & {
  homeTeam: Team,
  awayTeam: Team,
};
type FormatLeaderboard = {
  team: Team,
  win: number,
  lose: number,
  totalMatches: number,
  points: number
}[]

interface LeagueWithLeaderboard extends League {
  leaderboard: (Leaderboard & {
    team: Team;
  })[];
  match: (Match & {
    homeTeam: Team;
    awayTeam: Team;
  })[];
}

export default function LeaderboardPage() {
  const { slug } = useParams();
  const [league, setLeague] = useState<LeagueWithLeaderboard | null>(null);
  const [originalMatches, setOriginalMatches] = useState<MatchXTeam[] | null>(null);
  const [matches, setMatches] = useState<MatchXTeam[] | null>(null);
  const [leaderboardFormat, setLeaderboardFormat] = useState<FormatLeaderboard | null>(null)

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        const resLeague = await fetch(`/api/leagues/${slug}`);
        const leagueData = await resLeague.json();
        setLeague(leagueData);
        setOriginalMatches(leagueData.match);
        setMatches(leagueData.match);
        setLeaderboardFormat(leagueData.leaderboard)
      } catch (err) {
        console.error(err);
      }
    };
    fetchLeague()
  }, [slug]);

  const onMatchChange = (updatedMatch: MatchXTeam) => {
    setMatches((prev) => {
      if (!prev) return null;
      return prev.map((match) =>
        match.id === updatedMatch.id ? updatedMatch : match
      );
    });
  };

  useEffect(() => {
    if (league && matches) {
      const leaderboardData = calculatePoint({
        leaderboard: league.leaderboard,
        matches,
      });
      if (leaderboardData.length > 0) {
        setLeaderboardFormat(leaderboardData);
      }
    }
  }, [matches, league]);

  if (!league || !matches) {
    return <Spinner />
  }
  const { pastWeeks, upcomingWeeks } = weeklyGroup(matches);


  return (
    <main className="bg-gray-950 min-h-screen">
      <header className="text-center text-indigo-500 font-bold">
        <h1 className="  text-4xl">{league.name}</h1>
        <h2 className="text-lg text-gray-300">{league?.code}</h2>
      </header>

      <div className="flex flex-col md:flex-row flex-wrap">

        <section className="leaderboard order-1 md:w-1/2">
          <h1 className="font-bold text-indigo-500 text-center space-y-1 md:mb-5">Leaderboard</h1>
          {leaderboardFormat && <TableLeaderboard data={leaderboardFormat} />}
        </section>

        <section className="order-2 md:w-1/2">
          <h1 className="font-bold text-indigo-500 text-center space-y-1">
            Upcoming Matches
          </h1>
          <div className="flex justify-end mb-2">
            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-1 rounded-lg shadow"
              onClick={() => setMatches(originalMatches)}
            >
              Reset
            </button>
          </div>
          {matches && <MatchComponent matches={upcomingWeeks} matchChange={onMatchChange} />}
        </section>

        <section className="order-3 md:w-1/2">
          <h1 className="font-bold text-indigo-500 text-center space-y-1">
            Completed Matches
          </h1>
          {matches && <MatchComponent matches={pastWeeks} matchChange={onMatchChange} />}
        </section>


      </div>
    </main>
  );

}