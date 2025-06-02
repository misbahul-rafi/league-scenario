'use client';

import { useEffect, useState, useRef } from "react";

interface Team {
  id: number;
  name: string;
  code: string;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const [showAddModal, setShowAddModal] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const [addError, setAddError] = useState<string>("");

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teams");
      if (!res.ok) throw new Error("Failed to fetch teams");
      const data = await res.json();
      setTeams(data);
      setFilteredTeams(data);
      setError("");
    } catch (err) {
      setError("Gagal memuat data tim");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredTeams(teams);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredTeams(
        teams.filter(team =>
          team.name.toLowerCase().includes(lowerSearch) ||
          team.code.toLowerCase().includes(lowerSearch)
        )
      );
    }
  }, [search, teams]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value.trim() || "";
    const code = codeRef.current?.value.trim() || "";

    if (!name || !code) {
      setAddError("Nama dan kode tim wajib diisi.");
      return;
    }

    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, code })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal menambahkan tim");
      }

      // Reload teams setelah berhasil tambah
      await fetchTeams();
      setShowAddModal(false);
      setAddError("");
      // Clear input fields
      if (nameRef.current) nameRef.current.value = "";
      if (codeRef.current) codeRef.current.value = "";
    } catch (err: any) {
      setAddError(err.message || "Terjadi kesalahan saat menambahkan tim");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Management Teams</h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Cari nama atau kode tim..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded w-full max-w-sm"
        />
        <button
          onClick={() => setShowAddModal(true)}
          className="ml-4 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
        >
          Tambah Tim
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <tr key={team.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{team.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{team.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{team.code}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  Tim tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-black rounded-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Tambah Tim</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Nama Tim</label>
                <input
                  ref={nameRef}
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Nama tim"
                />
              </div>
              <div>
                <label className="block mb-1">Kode Tim</label>
                <input
                  ref={codeRef}
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Kode tim"
                />
              </div>

              {addError && <p className="text-red-600 text-sm">{addError}</p>}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setAddError("");
                  }}
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
          </div>
        </div>
      )}
    </div>
  );
}
