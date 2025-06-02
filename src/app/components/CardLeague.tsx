
interface Props{
  title: String;
  desc: String;
  logoLink: String;
}
export default function CardLeague({title, desc, logoLink}: Props) {

  return (
    <div className="w-[120px] bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="bg-gray-300 h-[120px] rounded-lg">
      <img src={`${logoLink}`} alt={`${title}`}  />

      </div>
      <div className="p-2 text-center">
        <h5 className="mb-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        <p className="text-gray-700 dark:text-gray-400 text-[10px]">{desc}</p>
      </div>
    </div>
  )
}