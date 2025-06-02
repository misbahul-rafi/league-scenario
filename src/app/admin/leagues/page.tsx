'use client';
import Table from "@/app/components/Table";
import { filters } from "@/app/utils/filters";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddLeagueModal from "../../components/AddLeagueModal";

export default function LeagueManagement() {
  const [leagues, setLeagues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/leagues")
      .then((res) => res.json())
      .then(setLeagues);
  }, [showAddModal]);

  const filteredLeagues = filters({ fields: ["name", "region", "code"], data: leagues, query: searchQuery });

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-teal-400">League Management</h1>
            <p className="text-gray-400 text-sm">Manage leagues and view details</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow"
            >
              + Add League
            </button>
          </div>
        </header>

        <div className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden pb-4">
          <Table
            titles={["Name", "Region", "Code"]}
            fields={["name", "region", "code"]}
            data={filteredLeagues}
            onRowClick={(row) => router.push(`/admin/leaderboards/${row.slug}`)}
          />
        </div>
      </div>

      {showAddModal && (
        <AddLeagueModal onCloseAction={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
