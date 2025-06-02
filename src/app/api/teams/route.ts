
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const teams = await prisma.team.findMany()
    return NextResponse.json(teams)
  } catch (error) {
    console.log(`❌❌❌ Server Error ❌❌❌\n${error}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}
interface TeamsProps{
  name: string,
  code: string
}
export async function POST(req: NextRequest) {
  try {
    const data: TeamsProps = await req.json()
    await prisma.team.create({
      data: {
        name: data.name,
        code: data.code.toLowerCase()
      }
    })
    return NextResponse.json({message: "team added"}, {status: 201})
    
  } catch (error: any) {
    if(error?.code === "P2002"){
      return NextResponse.json({message: "team already exist"}, {status: 409})
    }
    console.log(`❌❌❌ Server Error ❌❌❌\n${error}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}