import slugify from "@/app/utils/slugify"
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: Request,
  context: any
) {
  try {
    const { params } = context;
    const id = params.id
    const idNumber = parseInt(id)

    if (!idNumber) {
      return NextResponse.json({ message: "bad request" }, { status: 400 })
    }
    const game = await prisma.game.findUnique({
      where: { id: idNumber }
    })
    if (!game) return NextResponse.json({ message: "game not found" }, { status: 404 })

    return NextResponse.json(game)
  } catch (error) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}
export async function PUT(
  req: NextRequest,
  context: any
) {
  try {
    const {params} = context
    const id = params.id;
    const idNumber = parseInt(id)
    const { name } = await req.json();

    if (!name || !idNumber) {
      return NextResponse.json({ message: "bad request" }, { status: 400 })
    }
    await prisma.game.update({
      where: { id: idNumber },
      data: {
        name: name.toLowerCase(),
        slug: slugify(name),
      }
    })
    return NextResponse.json({ message: "Game Updated" })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ message: "game already exists" }, { status: 409 })
    }
    if (error?.code === 'P2025') {
      return NextResponse.json({ message: "game not found" }, { status: 404 })
    }
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error?.code}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const idNumber = parseInt(id)
    if (!idNumber) {
      return NextResponse.json({ message: "game not found" }, { status: 404 })
    }
    await prisma.game.delete({
      where: { id: idNumber }
    })
    return NextResponse.json({ message: "game deleted" }, { status: 200 })
  } catch (error: any) {
    if (error?.code === 'P2003') {
      return NextResponse.json({ message: "clear all league with this game first" }, { status: 406 })
    }
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error?.code}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}