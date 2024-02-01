"use client"

import { useUserAuth } from "@/app/(root)/context/AuthContext"
import { useEffect } from "react"

export default function AccessProvider(path : string) {
    const {logout,setActive} = useUserAuth()

    useEffect(()=>{
        const varify = async () => {
            const access = localStorage.getItem("accessToken")
            const res = await fetch(`http://localhost:5000/api/varify?accessToken=${access}`,{cache : "no-store"})
            const status = res.status
            if (status === 401 || status === 403 || status === 500) {
              logout()
            }
            setActive(path)
        }
        varify()
      },[])
}
