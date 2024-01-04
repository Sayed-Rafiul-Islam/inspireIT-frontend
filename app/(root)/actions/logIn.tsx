"use server"

export const logIn = async (email : string, password : string) => {
        const res = await fetch(`http://localhost:5000/login?password=${password}&email=${email}`,{cache : "no-store"})
        const result = await res.json()
        const status = res.status
        return {result,status}
}
