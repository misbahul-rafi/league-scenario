import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Props {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const idNumber = parseInt(id)
    if (isNaN(idNumber)) {
      return NextResponse.json({ error: 'bad request' }, { status: 400 });
    }
    return NextResponse.json({ message: 'match deleted' }, { status: 200 });
  } catch (error: any) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error?.code}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
  const idNumber = parseInt(id)
  if (isNaN(idNumber)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
  return NextResponse.json({message: "match updated"}, {status: 201})
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const idNumber = parseInt(id)
    if (isNaN(idNumber)) {
      return NextResponse.json({ error: 'bad request' }, { status: 400 });
    }
    await prisma.match.delete({
      where: { id: idNumber },
    });
    return NextResponse.json({ message: 'match deleted' }, { status: 200 });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ message: "match not found" }, { status: 404 })
    }
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error?.code}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}
