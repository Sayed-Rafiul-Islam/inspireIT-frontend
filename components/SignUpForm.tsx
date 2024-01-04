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
            const status = await signup(email,name,password)
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
        <div className="bg-indigo-300 flex flex-col w- full rounded-lg gap-4 p-4">
            <label htmlFor="">User Name :</label>
            <input className="text-black" type="text" value={name} onChange={(e)=> setName(e.target.value)} />
            <label htmlFor="">Email : </label>
            <input className="text-black" type="email" value={email} onChange={(e)=> setEmail(e.target.value)} />
            <label htmlFor="">Password : </label>
            <input className="text-black" type="password" value={password} onChange={(e)=> setPassword(e.target.value)} /> \

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
