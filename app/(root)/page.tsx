"use client"

import { usePathname } from "next/navigation"
import accessProvider from "./actions/accessProvider"


export default function Home() {
  const path = usePathname()
  accessProvider(path)
    return (
      <div>
          Root Page
      </div>
    )
  }
  