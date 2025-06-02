import { Team } from "@prisma/client";
type FormatLeaderboard = {
  team: Team,
  win: number,
  lose: number,
  totalMatches: number,
  points: number
}[]

export default function TableLeaderboard({data}:{data: FormatLeaderboard}) {
  return (

    <div className="overflow-x-auto rounded-lg p-5">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100">
        <thead className="bg-gray-100 dark:bg-gray-700 uppercase text-xs text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-2 py-3 text-center w-1 whitespace-nowrap">No.</th>
            <th className="px-4 py-3 text-left">Team</th>
            <th className="px-4 py-3 text-left">Code</th>
            <th className="px-2 py-3 text-center">Game</th>
            <th className="px-2 py-3 text-center">Point</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={entry.team.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150">
              <td className="text-center px-2 py-2">{idx + 1}</td>
              <td className="text-left px-4 py-2 capitalize">{entry.team?.name || "-"}</td>
              <td className="text-left px-4 py-2 uppercase">{entry.team?.code || "-"}</td>
              <td className="text-center px-4 py-2">{entry.win} - {entry.lose}</td>
              <td className="text-center px-2 py-2">{entry.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
