"use client"
import SignUpForm from "@/components/SignUpForm";
import { useEffect, useState } from "react";
import { useUserAuth } from "../context/AuthContext";
import LogInForm from "@/components/LogInForm";


export default function Authentication() {
    const [account,setAccount] = useState(true)
    const [user,setUser] = useState<boolean | null>(null)
    useEffect(()=>{
        const accessToken : string | null = localStorage.getItem("accessToken")
        const isUser = accessToken ? true : false
        setUser(isUser)
    },[user])

  return (
    <div className='flex justify-center'>
        {
            account ? 
              <div className="mt-48">
                <h1 className="text-4xl font-bold text-center">Log In</h1>
                <LogInForm />
                <p>Don't have an account? Go to <button onClick={()=>setAccount(false)} className="text-green-500">Sign Up</button></p>
              </div>
            :
              <div className="mt-48">
                <h1 className="text-4xl font-bold text-center">Sign Up</h1>
                <SignUpForm />
                <p>Already have an account? Go to <button onClick={()=>setAccount(true)} className="text-green-500">Log In</button></p>
              </div>
           
        }  
  </div>
  )
}
