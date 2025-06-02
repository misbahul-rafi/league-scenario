import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) return null

  const dataUser = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    }
  })

  return (
    <div className="bg-blue-300 w-max m-auto">
      <h1 className="w-full text-3xl mt-5 text-center font-bold">Informasi User</h1>
      <table className="m-5 w-xl">
        <thead></thead>
        <tbody>
          <tr>
            <td>Nama</td>
            <td>: {dataUser?.name}</td>
          </tr>
          <tr>
            <td>Username</td>
            <td>: {dataUser?.username}</td>
          </tr>
          <tr>
            <td>Role</td>
            <td>: {dataUser?.role}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>: {dataUser?.email}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}