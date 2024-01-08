"use client"
import SignUpForm from "@/components/SignUpForm";
import { useState } from "react";
import LogInForm from "@/components/LogInForm";


export default function Authentication() {
    const [account,setAccount] = useState(true)
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
