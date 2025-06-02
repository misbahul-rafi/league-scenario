'use client'

import { useEffect } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-red-900 text-white px-6">
      <h1 className="text-5xl font-extrabold mb-4">Oops! Something went wrong.</h1>
      <p className="mb-6 text-lg text-red-300">{error.message}</p>
      <button
        onClick={() => reset()}
        className="bg-white text-red-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
      >
        Try Again
      </button>
    </main>
  );
}
