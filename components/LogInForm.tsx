"use client"

import {  useUserAuth } from "@/app/(root)/context/AuthContext"
import { useState } from "react"

export default function LogInForm() {

    const {login} = useUserAuth()
    const [loading,setLoading] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [ message, setMessage] = useState('')

    const handleSubmit = async () => {
        setLoading(true)
        setMessage("Logging in...")
        
        if (email === '' || password === '') {
            setLoading(false)
            setMessage("Fill in all the fields")
        }
        else {
            const status = await login(email,password)
            if (status === 403) {
                setLoading(false)
                setMessage("No account with this Email")
            } else if (status === 401) {
                setLoading(false) 
                setMessage("Wrong Password")
            } else if (status === 200) {
                setLoading(true)
                setMessage("Login Successful")
            }
            
        } 
    }
  return (
    <div className="flex flex-col rounded-lg gap-4 p-4">
        <div className="border-b border-r dark:border-zinc-600 flex flex-col w-full rounded-lg gap-4 p-4">
            <label htmlFor="">Email : </label>
            <input className="text-zinc-700 outline-none border-b border-zinc-300
            dark:border-zinc-700 dark:placeholder:text-zinc-700 dark:text-zinc-300 dark:bg-inherit
            focus:border-b-2 focus:border-zinc-700" 
            type="email" 
            value={email} 
            onChange={(e)=> setEmail(e.target.value)}
            placeholder="example@gmail.com"
            />
            <label htmlFor="">Password : </label>
            <input className="text-zinc-700 outline-none border-b border-zinc-300
            dark:border-zinc-700 dark:placeholder:text-zinc-700 dark:text-zinc-300 dark:bg-inherit
            focus:border-b-2 focus:border-zinc-700"
            type="password" 
            value={password} 
            onChange={(e)=> setPassword(e.target.value)}
            placeholder="***********"
            />
            <button onClick={handleSubmit}>
                Log In
            </button>
            
        </div>

        <p className={loading 
        ?"text-green-500"
        : 
         "text-red-500"}>
            {message}
        </p>
      
    </div>
  )
}
