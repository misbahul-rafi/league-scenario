import MatchCard from '@/app/components/MatchCard';
import { Match, Team } from '@prisma/client';
import { dailyGroup } from '../utils/TimeFunction';

interface MatchXTeam extends Match {
  homeTeam: Team;
  awayTeam: Team
};

type Props = {
  matches: MatchXTeam[][];
  isAdmin?: boolean;
  matchChange: (updatedMatch: MatchXTeam) => void;
};
export default function MatchComponent({ matches, isAdmin = false, matchChange }: Props) {
  return (
    <div className='flex flex-col items-start flex-wrap gap-2 mx-3 bg-gray-800'>
      {matches.map((matchesInWeek, weekIdx) => (
        <div className='w-full text-xs font-semibold text-teal-400 p-1'>
          <p className='text-center border-b'>Week {weekIdx + 1}</p>
          <div className='flex flex-row gap-2 justify-around flex-wrap'>
            {dailyGroup(matchesInWeek).map((matchesInDaily, dailyIdx) => (
              <div key={weekIdx + dailyIdx}>
                <p className='text-center'>{matchesInDaily.date}</p>
                <div className='flex flex-col gap-2'>
                  {matchesInDaily.matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      isAdmin={isAdmin}
                      match={match}
                      onScoreChange={(matchId, scores) => {
                        matchChange({ ...match, ...scores });
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
