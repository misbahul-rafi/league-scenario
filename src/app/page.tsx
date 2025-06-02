'use client'

import { useEffect, useState } from "react"
import Spinner from "./components/Spinner"
import TwitterSearch from "./components/TwitterSearch"
import { League, Game } from "@prisma/client"
import { useRouter } from "next/navigation"

type LeagueDataItem = League & { game: Game };

export default function Home() {
  const [leagues, setLeagues] = useState<LeagueDataItem[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/leagues');
        if (!res.ok) throw new Error('Failed to fetch leagues');
        const data = await res.json();
        setLeagues(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  if (!leagues) return <Spinner />;

  const filteredLeagues = leagues.filter(league =>
    league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    league.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      <section className="px-6 py-10 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-extrabold leading-tight mb-6">
            Welcome to <strong className="text-indigo-500">Esports League Hub</strong>
          </h1>
          <p className="text-md text-gray-300 mb-8">
            Your ultimate destination for competitive gaming leagues. Track teams, scores, upcoming matches, and <strong className="text-[#8B5DFF]">Make Scenario</strong> in Leaderboard from top esports tournaments.
          </p>
          <TwitterSearch
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
          />
        </div>
        <div className="absolute top-[-10%] left-[50%] transform -translate-x-1/2 w-[1200px] h-[768px] bg-indigo-500 opacity-10 rounded-full blur-3xl pointer-events-none" />
      </section>

      <section className="py-12 px-6 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {filteredLeagues.map((league) => (
            <div
              key={league.id}
              className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-md hover:shadow-xl transition" onClick={()=> router.push(`/leaderboards/${league.slug}`)}
            >
              <h3 className="text-2xl font-bold mb-3">{league.code.toUpperCase()}</h3>
              <p className="text-gray-400 capitalize">{league.name}</p>
              <p className="text-gray-400 capitalize">Region: {league.region}</p>
              <p className="text-gray-400 capitalize">Game: {league.game.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-center">
        <h2 className="text-4xl font-extrabold mb-4">Be the Esports Action</h2>
        <p className="text-lg mb-8 text-white/90">Join us to make your private tournament. Start exploring now.</p>
        <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition">
          Get Started
        </button>
      </section>

      <footer className="py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Esports League Hub. All rights reserved.
      </footer>
    </main>
  );
}
