import CardManagement from "../components/CardManagement";
import { FaTrophy } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { BsMicrosoftTeams } from "react-icons/bs";

export default function CardLeague() {
  return (
    <div className="flex gap-4 mt-5 m-auto w-full justify-center">
      <CardManagement title="Users" slug="/admin/user-management" icon={<FaUser size={160} className="m-auto"/>}/>
      <CardManagement title="Leagues" slug="/admin/leagues" icon={<FaTrophy size={160} className="m-auto" />} />
      <CardManagement title="Teams" slug="/admin/teams" icon={<BsMicrosoftTeams  size={160} className="m-auto" />} />
      <CardManagement title="Add" slug="/admin/add" icon={<IoMdAdd size={160} className="m-auto" />} />
    </div>
  )
}