"use client"

import { usePathname } from "next/navigation"
import { useUserAuth } from "./context/AuthContext"


export default function Home() {
  const {logout,setActive} = useUserAuth()
  const path = usePathname()
  setActive(path)


    return (
      <div>
          Root Page
      </div>
    )
  }
  