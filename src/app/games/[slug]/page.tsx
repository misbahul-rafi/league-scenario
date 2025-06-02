'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/app/components/Spinner";
import CardLeague from "@/app/components/CardLeague";
import { Game, League } from "@prisma/client";
import TwitterSearch from "@/app/components/TwitterSearch";

interface Props {
  game: Game;
  leagues: League[];
}

export default function EsportLeaguePage() {
  const { slug } = useParams();
  const [data, setData] = useState<Props | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/esports/${slug}`);
    if (!res.ok) {
      return;
    }
      const data = await res.json();
      setData(data);
    })();
  }, [slug]);

  if (!data) {
    return <Spinner />;
  }
  const filteredLeagues = data.leagues.filter(league =>
    league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    league.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-center">
        Leagues in <span className="text-indigo-500">{data.game.name}</span>
      </h1>

      <div className="max-w-md mx-auto mb-8">
        <TwitterSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredLeagues.length > 0 ? (
          filteredLeagues.map((league) => (
            <a href={`/leaderboard/${league.slug}`} key={league.id}>
              <CardLeague
                title={league.code}
                desc={league.name}
                logoLink="/asset/MPLID.png"
              />
            </a>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full">No leagues found.</p>
        )}
      </div>
    </main>
  );
}
