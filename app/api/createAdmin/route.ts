import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    req: NextRequest,
    res: NextResponse,

)   {
    const prisma = new PrismaClient()
    const admins = await prisma.admins.findMany()
    // const id = req.nextUrl.searchParams.get('id') as string;
    // console.log(id)
    return NextResponse.json(admins)
}