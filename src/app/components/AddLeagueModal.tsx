'use client';
import { useState, useRef, useEffect } from "react";

interface Game {
  id: number;
  name: string;
}

interface Props {
  onCloseAction: () => void;
}

export default function AddLeagueModal({ onCloseAction }: Props) {
  const nameRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const regionRef = useRef<HTMLInputElement>(null);
  const gameNameRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/games")
      .then((res) => res.json())
      .then((data: Game[]) => {
        setGames(data);
      });
  }, []);

  const handleGameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toLowerCase();
    if (!input) {
      setFilteredGames([]);
      return;
    }

    const matches = games.filter((game) =>
      game.name.toLowerCase().includes(input)
    );
    setFilteredGames(matches);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (name: string) => {
    if (gameNameRef.current) {
      gameNameRef.current.value = name;
    }
    setFilteredGames([]);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value || "";
    const code = codeRef.current?.value || "";
    const region = regionRef.current?.value || "";
    const gameName = gameNameRef.current?.value || "";

    if (!name || !code || !region || !gameName) {
      setError("Semua field wajib diisi.");
      return;
    }

    try {
      const res = await fetch("/api/leagues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, code, region, gameName })
      });

      if (!res.ok) throw new Error("Gagal menambahkan liga");

      setError("");
      onCloseAction();
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat menambahkan liga");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white text-black rounded-lg p-6 w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-4">Tambah Liga</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nama Liga</label>
            <input ref={nameRef} type="text" className="w-full px-3 py-2 border rounded" placeholder="Nama liga" />
          </div>
          <div>
            <label className="block mb-1">Kode</label>
            <input ref={codeRef} type="text" className="w-full px-3 py-2 border rounded" placeholder="Kode liga" />
          </div>
          <div>
            <label className="block mb-1">Region</label>
            <input ref={regionRef} type="text" className="w-full px-3 py-2 border rounded" placeholder="Region" />
          </div>
          <div className="relative">
            <label className="block mb-1">Nama Game</label>
            <input
              ref={gameNameRef}
              type="text"
              className="w-full px-3 py-2 border rounded"
              placeholder="Contoh: Mobile Legends"
              onChange={handleGameInputChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
            {showSuggestions && filteredGames.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
                {filteredGames.map((game) => (
                  <li
                    key={game.id}
                    onClick={() => handleSuggestionClick(game.name)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {game.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onCloseAction} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">Batal</button>
            <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded">Tambah</button>
          </div>
        </form>
      </div>
    </div>
  );
}