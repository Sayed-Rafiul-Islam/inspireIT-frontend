"use client"

import { usePathname } from "next/navigation"
import { useUserAuth } from "./context/AuthContext"
import { useEffect } from "react"


export default function Home() {
  const {logout,setActive} = useUserAuth()
  const path = usePathname()


  useEffect(()=>{
    setActive(path)
  },[])


    return (
      <div>
          Root Page
      </div>
    )
  }
  