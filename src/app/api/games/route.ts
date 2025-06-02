import slugify from "@/app/utils/slugify";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const games = await prisma.game.findMany();
    return NextResponse.json(games);

  } catch (error: any) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json()
    if (!name) {
      return NextResponse.json({ message: "bad request" }, { status: 400 })
    }
    await prisma.game.create({
      data: {
        name: name.toLowerCase(),
        slug: slugify(name),
      }
    })
    return NextResponse.json({ message: "Game Added" })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ message: "game already exists" }, { status: 409 })
    }
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}
