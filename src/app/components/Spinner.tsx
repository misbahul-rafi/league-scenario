export default function Spinner() {
  return (
    <div className="flex justify-center items-center mt-10">
      {[0,1,2,3].map((i) => (
        <div
          key={i}
          className={`relative w-5 h-5 border-2 rounded-full mx-2 border-gray-300 animate-circle ${
            i === 1 ? "delay-300" :
            i === 2 ? "delay-600" :
            i === 3 ? "delay-900" : ""
          }`}
        >
          <div
            className={`absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-gray-300 -translate-x-1/2 -translate-y-1/2 animate-dot ${
              i === 1 ? "delay-300" :
              i === 2 ? "delay-600" :
              i === 3 ? "delay-900" : ""
            }`}
          />
          <div
            className={`absolute top-1/2 left-1/2 w-5 h-5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-outline ${
              i === 0 ? "delay-900" :
              i === 1 ? "delay-1200" :
              i === 2 ? "delay-1500" :
              i === 3 ? "delay-1800" : ""
            }`}
          />
        </div>
      ))}
    </div>
  );
}
