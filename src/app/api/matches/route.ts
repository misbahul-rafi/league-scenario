import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const leagueId = req.nextUrl.searchParams.get('leagueId');

  if (!leagueId || isNaN(Number(leagueId))) {
    return NextResponse.json({ error: 'Invalid or missing leagueId' }, { status: 400 });
  }

  try {
    const matches = await prisma.match.findMany({
      where: { leagueId: parseInt(leagueId) },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    return NextResponse.json(matches);
  } catch (error: any) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error?.code}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leagueId, date, homeTeamId, awayTeamId } = body;

    if (
      !leagueId ||
      !date ||
      !homeTeamId ||
      !awayTeamId ||
      isNaN(Number(leagueId)) ||
      isNaN(Number(homeTeamId)) ||
      isNaN(Number(awayTeamId))
    ) {
      return NextResponse.json({ messege: 'bad request' }, { status: 400 })
    }

    const newMatch = await prisma.match.create({
      data: {
        leagueId: parseInt(leagueId),
        date: new Date(date),
        homeTeamId: parseInt(homeTeamId),
        awayTeamId: parseInt(awayTeamId),
        homeScore: 0,
        awayScore: 0,
      },
    });

    return NextResponse.json(newMatch, { status: 201 });
  } catch (error: any) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error?.code}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { updates } = await req.json();

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    for (const update of updates) {
      const { matchId, homeScore, awayScore } = update;
      if (
        !matchId || isNaN(Number(matchId)) ||
        homeScore === undefined || awayScore === undefined
      ) {
        continue;
      }
      await prisma.match.update({
        where: { id: Number(matchId) },
        data: {
          homeScore: Number(homeScore),
          awayScore: Number(awayScore),
        },
      });
    }
    return NextResponse.json({ message: "Data Updated" }, { status: 200 });
  } catch (error: any) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error?.code}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}
