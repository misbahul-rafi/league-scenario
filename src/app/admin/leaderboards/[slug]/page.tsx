'use client'
import { Leaderboard, Team, Match, League } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddTeamModal from "../../../components/AddTeamModal";
import MatchComponent from "../../../components/MatchComponent";
import AddMatchModal from "../../../components/AddMatchModal";
import TableLeaderboard from "@/app/components/TableLeaderboard";
import { useSession } from "next-auth/react";
import calculatePoint from "@/app/utils/calculatePoint";
import { weeklyGroup } from "@/app/utils/TimeFunction";
import { match } from "assert";
import Spinner from "@/app/components/Spinner";

interface MatchXTeams extends Match {
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

export default function LeaderboardAdminPage() {
  const { data } = useSession();
  const { slug } = useParams();
  const [league, setLeague] = useState<LeagueWithLeaderboard | null>(null);
  const [originalMatches, setOriginalMatches] = useState<MatchXTeams[] | null>(null);
  const [matches, setMatches] = useState<MatchXTeams[] | null>(null);
  const [leaderboardFormat, setLeaderboardFormat] = useState<FormatLeaderboard | null>(null)
  const [modal, setModal] = useState<string | null>(null)

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

  const onMatchChange = (updatedMatch: MatchXTeams) => {
    setMatches((prev) => {
      if (!prev) return null;
      return prev.map((match) =>
        match.id === updatedMatch.id ? updatedMatch : match
      );
    });
    console.log(matches)
  };

  useEffect(() => {
    if (league && matches) {
      const leaderboardData = calculatePoint({ leaderboard: league.leaderboard, matches })
      if (leaderboardData.length > 0) {
        setLeaderboardFormat(leaderboardData)
      }
    } else {
      console.log("Leaderboard atau matches belum tersedia");
    }
  }, [matches, league]);

  const saveScoreChanges = async () => {
    if (!matches || !originalMatches) return;

    const changedMatches = matches.filter(match => {
      const original = originalMatches.find(m => m.id === match.id);
      if (!original) return false;
      return (
        match.homeScore !== original.homeScore ||
        match.awayScore !== original.awayScore
      );
    });

    if (changedMatches.length === 0) {
      console.log("No Data to Update")
      return;
    }
    const updates = changedMatches.map(match => ({
      matchId: match.id,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      leagueId: match.leagueId
    }));
    try {
      await fetch(`/api/matches`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates })
      })
      console.log("Only sending changed matches: SUCCESS ✅");

    } catch (error) {
      console.log(error)
    }
  };
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
        <section className="fleaderboard order-1 md:w-1/2">
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded-lg shadow" onClick={() => setModal("addTeam")}>
            + Team
          </button>
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
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded-lg shadow" onClick={() => setModal("addMatch")}>
              + Match
            </button>
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded-lg shadow" onClick={saveScoreChanges}>
              Save Change
            </button>
          </div>
          {matches && <MatchComponent matches={upcomingWeeks} matchChange={onMatchChange} isAdmin={data?.user?.role === 'admin'} />}
        </section>

        <section className="order-3 md:w-1/2">
          <h1 className="font-bold text-indigo-500 text-center space-y-1">
            Completed Matches
          </h1>
          {matches && <MatchComponent matches={pastWeeks} matchChange={onMatchChange} isAdmin={data?.user?.role === 'admin'} />}
        </section>
      </div>






      {modal === "addTeam" && (
        <AddTeamModal
          leagueId={league.id}
          onClose={() => setModal(null)}
          existingTeamIds={league.leaderboard.map((entry) => entry.teamId)}
        />
      )}
      {modal === "addMatch" && (
        <AddMatchModal
          leagueId={league.id}
          onClose={() => setModal(null)}
          existingTeamIds={league.leaderboard.map((entry) => entry.teamId)}
        />
      )}
    </main>
  );
}