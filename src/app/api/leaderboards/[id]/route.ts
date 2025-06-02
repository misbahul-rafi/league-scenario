import { NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id
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