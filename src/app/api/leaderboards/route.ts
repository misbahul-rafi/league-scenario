import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const leaderboards = await prisma.leaderboard.findMany()
    return NextResponse.json(leaderboards)
  } catch (error: any) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error?.code}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { leagueId, teamsId } = await req.json()
    if (!leagueId || !Array.isArray(teamsId) || teamsId.length < 0) {
      console.log(!Array.isArray(teamsId))
      return NextResponse.json(
        { error: "leagueId dan teamIds yang valid diperlukan" },
        { status: 400 }
      );
    }
    await prisma.leaderboard.createMany({
      data: teamsId.map((teamId: number) => ({
        leagueId,
        teamId
      })),
      skipDuplicates: true,
    });
    return NextResponse.json({ message: "Teams Added" }, { status: 201 })
  } catch (error: any) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error?.code}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}