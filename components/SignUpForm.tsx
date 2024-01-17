"use client"

import {  useUserAuth } from "@/app/(root)/context/AuthContext"
import { useState } from "react"

export default function SignUpForm() {

    const {signup} = useUserAuth()
    const [loading,setLoading] = useState(true)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [ message, setMessage] = useState('')

    const handleSubmit = async () => {
        setMessage("Signing up...")
        if (name === '' || email === '' || password === '') {
            setMessage("Fill in all the fields")
        }
        else {
            const status = await signup(name,email,password)
            if (status === 400) {
                setLoading(false)
                setMessage("Email already in use")
            }
            else {
                setLoading(true)
                setMessage("User created successfully")
            }
        } 
    }
  return (
    <div className="flex flex-col rounded-lg gap-4 p-4">
        <div className="flex flex-col w-full rounded-lg gap-4 p-4 border-b border-r dark:border-zinc-6">
            <label htmlFor="">User Name :</label>
            <input className="text-zinc-700 outline-none border-b border-zinc-300
            dark:border-zinc-700 dark:placeholder:text-zinc-700 dark:text-zinc-300 dark:bg-inherit
            focus:border-b-2 focus:border-zinc-700" 
            type="text" 
            value={name} 
            onChange={(e)=> setName(e.target.value)} 
            placeholder="Robinson Jeager"
            />
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
            type="password" value={password} 
            onChange={(e)=> setPassword(e.target.value)} 
            placeholder="*****************"
            /> 

            <button onClick={handleSubmit}>
                Sign Up
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
