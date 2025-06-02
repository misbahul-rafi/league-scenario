'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Match, Team } from '@prisma/client';
import { timeIndonesia } from '../utils/TimeFunction';

interface Props {
  isAdmin: boolean;
  match: Match & { homeTeam: Team, awayTeam: Team };
  onScoreChange?: (matchId: number, scores: { homeScore: number; awayScore: number }) => void;
}

export default function MatchCard({ isAdmin, match, onScoreChange, }: Props) {
  const router = useRouter()
  const [homeScore, setHomeScore] = useState<number>(match.homeScore);
  const [awayScore, setAwayScore] = useState<number>(match.awayScore);
  const [modal, setModal] = useState<string | null>(null)

  const scoreOptions = [0, 1, 2];
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/matches/${match.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        router.refresh()
      } else {
        console.error(data.error || 'Gagal menghapus match');
        alert('Gagal menghapus match');
      }
    } catch (err) {
      console.error('Error deleting match:', err);
      alert('Terjadi kesalahan saat menghapus match');
    }
  };

  return (
    <div className='bg-gray-900 shadow-lg rounded-lg text-gray-300 overflow-hidden'>
      <div className="relative px-2 flex items-center">
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-2 w-[75px] flex-shrink-0 justify-between">
            <p className="text-md font-semibold truncate text-center uppercase">{match.homeTeam.code}</p>
            <select
              className='text-3xs'
              value={match.homeScore}
              onChange={(e) => {
                const newScore = parseInt(e.target.value);
                setHomeScore(newScore);
                onScoreChange?.(match.id, { homeScore: newScore, awayScore });
              }}
              disabled={match.isComplete}
            >
              {scoreOptions.map(score => (
                <option key={score} value={score}>{score}</option>
              ))}
            </select>
          </div>

          {/* VS dan Jadwal */}
          <div className="flex flex-col items-center min-w-[40px]">
            <p className="text-sm text-gray-500">VS</p>
            <p className="text-xs text-gray-400 mt-1">{timeIndonesia(match.date)}</p>
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-2 w-[75px] flex-shrink-0 justify-between">
            <select
              value={awayScore}
              onChange={(e) => {
                const newScore = parseInt(e.target.value);
                setAwayScore(newScore);
                onScoreChange?.(match.id, { homeScore, awayScore: newScore });
              }}
              disabled={match.isComplete}
            >
              {scoreOptions.map(score => (
                <option key={score} value={score}>{score}</option>
              ))}
            </select>
            <p className="text-md w-[42px] font-semibold truncate text-right uppercase">{match.awayTeam.code}</p>
          </div>
        </div>
        {isAdmin && (
          <div className='ml-2'>
            <BsThreeDotsVertical size={15} />
            {modal === "actions" && <ActionOptions close={() => setModal(null)} onDelete={() => handleDelete()} />}
          </div>
        )}
      </div>
      <p
        className={`text-center text-xs font-medium
    ${match.isComplete ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black'}`}
      >
        {match.isComplete ? 'completed' : 'ongoing'}
      </p>
    </div>
  );
}

const ActionOptions = ({ close, onDelete }: { close: () => void, onDelete: () => void }) => {
  return (
    <div className='absolute top-0 right-0 flex flex-row justify-around w-full'>
      <div className='text-xs px-10 bg-red-500' onClick={onDelete}>Delete</div>
      <div className='text-xs px-10 bg-red-500'>Edit</div>
      <div onClick={close}>
        <IoMdCloseCircleOutline size={18} />
      </div>
    </div>
  )
}
