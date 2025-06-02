import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Team = {
  id: number;
  name: string;
  code: string;
};
interface Props {
  leagueId: number;
  onClose: () => void;
  existingTeamIds: number[];
}

export default function AddTeamModal({ leagueId, onClose, existingTeamIds = [] }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("/api/teams");
        const data = await res.json();
        setTeams(data);
      } catch (error) {
        console.error("Failed to fetch teams", error);
        setError("Gagal mengambil data tim.");
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredTeams([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = teams.filter(
      (team) =>
        team.name.toLowerCase().includes(lowerQuery) ||
        team.code.toLowerCase().includes(lowerQuery)
    );
    setFilteredTeams(filtered);
  }, [query, teams]);

  const handleSelect = (team: Team) => {
    if (existingTeamIds.includes(team.id)) {
      setError(`Tim "${team.name}" sudah ada di leaderboard.`);
      setQuery("");
      setFilteredTeams([]);
      inputRef.current?.focus();
      return;
    }

    if (!selectedTeamIds.includes(team.id)) {
      setSelectedTeamIds([...selectedTeamIds, team.id]);
      setError("");
    }
    setQuery("");
    setFilteredTeams([]);
    inputRef.current?.focus();
  };

  const handleRemoveSelected = (id: number) => {
    setSelectedTeamIds(selectedTeamIds.filter((tid) => tid !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTeamIds.length === 0) {
      setError("Pilih minimal satu tim dari daftar.");
      return;
    }

    try {
      const res = await fetch("/api/leaderboards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamsId: selectedTeamIds,
          leagueId,
        }),
      });
      console.log(res)
      setError("");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Gagal menambahkan tim ke leaderboard");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white text-black rounded-lg p-6 w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-4">Tambah Tim ke Leaderboard</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <label className="block mb-1">Cari Tim</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              placeholder="Cari tim..."
              value={query}
              ref={inputRef}
              onChange={(e) => {
                setQuery(e.target.value);
                setError("");
              }}
            />
            {filteredTeams.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto">
                {filteredTeams.map((team) => (
                  <li
                    key={team.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => handleSelect(team)}
                  >
                    {team.name} ({team.code})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedTeamIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTeamIds.map((id) => {
                const team = teams.find((t) => t.id === id);
                if (!team) return null;
                return (
                  <div
                    key={id}
                    className="bg-teal-600 text-white px-3 py-1 rounded flex items-center gap-2"
                  >
                    <span>
                      {team.name} ({team.code})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSelected(id)}
                      className="text-white font-bold hover:text-gray-300"
                      aria-label={`Hapus ${team.name}`}
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {error && (
            <p className="text-red-600 text-sm mt-1" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
            >
              Tambah
            </button>
          </div>
        </form>
        <Link href={"/admin/teams/"}>Go to add team</Link>
      </div>
    </div>
  );
}
