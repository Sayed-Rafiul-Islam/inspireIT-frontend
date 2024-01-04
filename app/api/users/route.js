import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

export async function POST(request) {
    const prisma = new PrismaClient()
    const data = await request.json()
    
    const users = await prisma.users.findMany()
    const user = users.filter(user => user.email === data.email)
    if (user) {
        return NextResponse.json(null)
    }
    await prisma.users.create({data})
    return NextResponse.json({data})
}

export async function GET(request) {
    const prisma = new PrismaClient()
    const users = await prisma.users.findMany()
    return NextResponse.json(users)   
}
