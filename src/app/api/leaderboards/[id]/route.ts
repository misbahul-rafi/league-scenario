import { NextRequest, NextResponse } from "next/server"

interface Props {
  params: {
    id: string
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const idNumber = parseInt(id)
    if (isNaN(idNumber)) {
      return NextResponse.json({ message: "bad request" }, { status: 400 })
    }
    await prisma.leaderboard.delete({
      where: { id: idNumber }
    })
    return NextResponse.json({ message: "team deleted from this leaderboard" }, { status: 201 })
  } catch (error: any) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error?.code}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}