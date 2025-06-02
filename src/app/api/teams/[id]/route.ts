import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: {
    id: string;
  };
}
export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    if (!parseInt(id)) {
      return NextResponse.json({ message: "bad request" }, { status: 400 })
    }
    const team = await prisma.team.findUnique({
      where: { id: parseInt(id) }
    })
    if (!team) {
      return NextResponse.json({ message: "team not found" }, { status: 200 })
    }
    return NextResponse.json(team)
  } catch (error) {
    console.log(`❌❌❌ Server Error ❌❌❌\n${error}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}
export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const idNumber = parseInt(id)
    const { name, code } = await req.json()
    if (!idNumber || !name || !code) {
      return NextResponse.json({ message: "bad request" }, { status: 400 })
    }
    await prisma.team.update({
      where: { id: idNumber },
      data: {
        name,
        code,
      }
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'team name already exists' }, { status: 409 })
    }
    console.log(`❌❌❌ Server Error ❌❌❌\n${error}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const { id } = await params;
  try {
    if (!parseInt(id)) {
      return NextResponse.json({ message: 'bad request' }, { status: 409 })
    }
    await prisma.team.delete({
      where: { id: parseInt(id) }
    })
    return NextResponse.json({ message: "team deleted" }, { status: 200 })
  } catch (error: any) {
    if(error?.code === 'P2025'){
      return NextResponse.json({ message: "team not found" }, { status: 404 })
    }
    console.log(`❌❌❌ Server Error ❌❌❌\n${error}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })

  }
}