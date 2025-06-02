import { prisma } from "@/lib/prisma";


export default async function UserManagement() {
  const users = await prisma.user.findMany();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Pengguna</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left text-sm font-semibold text-gray-700 dark:text-white uppercase">
              <th className="px-4 py-3 border-b">ID</th>
              <th className="px-4 py-3 border-b">Nama</th>
              <th className="px-4 py-3 border-b">Username</th>
              <th className="px-4 py-3 border-b">Email</th>
              <th className="px-4 py-3 border-b">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user:any) => (
              <tr key={user.id} className="border-b dark:border-gray-600">
                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{user.id}</td>
                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{user.name}</td>
                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{user.username}</td>
                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{user.email}</td>
                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 capitalize">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
