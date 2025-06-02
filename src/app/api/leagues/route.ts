import slugify from "@/app/utils/slugify";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const leagues = await prisma.league.findMany({
      include: { game: true }
    })
    return NextResponse.json(leagues);
  } catch (error) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}

type TyoeLeague = {
  name: string,
  code: string,
  region: string,
  gameId: number,
  season: number
}
export async function POST(req: Request) {
  const data: TyoeLeague = await req.json();
  const { name, code, region, gameId, season } = data;
  if (!name || !code || !region || typeof gameId !== "number" || typeof season !== "number") {
    return NextResponse.json({ message: "bad request" }, { status: 400 });
  }
  try {
    const league = await prisma.league.create({
      data: {
        name,
        code,
        region,
        slug: slugify(`${code}-${season}`),
        season: season,
        gameId: gameId,
      }
    });
    return NextResponse.json(league);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ message: "league with this season already exist" }, { status: 409 })
    }
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\nError Code: ${error?.code}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}
