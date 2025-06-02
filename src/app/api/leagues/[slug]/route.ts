
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const slug = (await params).slug;
    const league = await prisma.league.findUnique({
      where: { slug: slug },
      include: {
        leaderboard: {
          include: { team: true }
        },
        match: {
          include: {
            awayTeam: true,
            homeTeam: true,
          }
        }
      }
    })
    if (!league) {
      return NextResponse.json({ message: "league not found" }, { status: 404 })
    }
    return NextResponse.json(league)
  } catch (error) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const slug = (await params).slug;
    const league = await prisma.league.findUnique({
      where: { slug },
      include: {
        leaderboard: true,
        match: true
      }
    })
    if (!league) {
      return NextResponse.json({ message: "league not found" }, { status: 404 })
    }
    if (league.leaderboard.length > 0 || league.match.length > 0) {
      return NextResponse.json({ message: "clear the matches in the league" }, { status: 404 })
    }
    await prisma.league.delete({
      where: { slug }
    })
    return NextResponse.json({ message: "league deleted" }, { status: 200 })
  } catch (error: any) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}