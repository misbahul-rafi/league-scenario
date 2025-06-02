'use client'
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";


type CardManagementProps = {
  title: string;
  slug: string;
  icon?: React.ReactNode;
};

export default function CardManagement({ title, slug, icon }: CardManagementProps) {
  const router = useRouter();
  return (
    <div className="max-w-3xs bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700" onClick={() => router.push(slug)}>
      <div className="bg-gray-300 rounded-lg">
        {icon ?? <FaUser size={160} className="m-auto" />}
      </div>

      <div className="p-2 text-center">
        <h5 className="mb-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
      </div>
    </div>
  )
}