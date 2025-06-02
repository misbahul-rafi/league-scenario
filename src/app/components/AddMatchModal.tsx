
import { useEffect, useRef, useState } from 'react';

type Team = {
  id: number;
  name: string;
  code: string;
};

interface Props {
  leagueId: number;
  existingTeamIds: number[];
  onClose: () => void;
}

export default function AddMatchModal({ leagueId, existingTeamIds, onClose }: Props) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [homeQuery, setHomeQuery] = useState('');
  const [awayQuery, setAwayQuery] = useState('');
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [error, setError] = useState('');

  const homeRef = useRef<HTMLInputElement>(null);
  const awayRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      const res = await fetch('/api/teams');
      const data: Team[] = await res.json();
      setTeams(data.filter(team => existingTeamIds.includes(team.id)));
    };
    fetchTeams();
  }, [existingTeamIds]);

  const filterTeams = (query: string) =>
    teams.filter(
      (team) =>
        team.name.toLowerCase().includes(query.toLowerCase()) ||
        team.code.toLowerCase().includes(query.toLowerCase())
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam || homeTeam.id === awayTeam.id) {
      setError('Pilih dua tim yang berbeda.');
      return;
    }

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leagueId,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          date: new Date(date),
        }),
      });

      if (!res.ok) throw new Error('Gagal menambahkan pertandingan');
      onClose();
    } catch (err) {
      console.error(err);
      setError('Gagal menyimpan pertandingan.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white text-black rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Tambah Pertandingan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Tanggal & Waktu</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          {/* Home Team */}
          <div className="relative">
            <label className="block mb-1">Tim Home</label>
            <input
              type="text"
              value={homeQuery}
              ref={homeRef}
              onChange={(e) => {
                setHomeQuery(e.target.value);
                setHomeTeam(null);
                setError('');
              }}
              placeholder="Cari tim..."
              className="w-full px-3 py-2 border rounded"
            />
            {homeQuery && filterTeams(homeQuery).length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto">
                {filterTeams(homeQuery).map((team) => (
                  <li
                    key={team.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => {
                      setHomeTeam(team);
                      setHomeQuery(`${team.name} (${team.code})`);
                    }}
                  >
                    {team.name} ({team.code})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Away Team */}
          <div className="relative">
            <label className="block mb-1">Tim Away</label>
            <input
              type="text"
              value={awayQuery}
              ref={awayRef}
              onChange={(e) => {
                setAwayQuery(e.target.value);
                setAwayTeam(null);
                setError('');
              }}
              placeholder="Cari tim..."
              className="w-full px-3 py-2 border rounded"
            />
            {awayQuery && filterTeams(awayQuery).length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto">
                {filterTeams(awayQuery).map((team) => (
                  <li
                    key={team.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => {
                      setAwayTeam(team);
                      setAwayQuery(`${team.name} (${team.code})`);
                    }}
                  >
                    {team.name} ({team.code})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

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
              Simpan Pertandingan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
