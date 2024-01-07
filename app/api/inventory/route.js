"use client"
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    req,
    res

)   {
    const prisma = new PrismaClient()
    const page = await URLSearchParams.get("page")
    // const id = req.nextUrl.searchParams.get('id') as string;
    // console.log(id)
    return NextResponse.json(page)
}