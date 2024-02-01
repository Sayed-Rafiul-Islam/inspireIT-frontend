"use server"

export const signUp = async (name: string, email: string, password: string) => {
    const res = await fetch(`https://inspired-it-backend.vercel.app/api/createAdmin`, {
        method : "POST",
        headers : {
            "Content-type" : "application/json"
        },
        body : JSON.stringify({email,password,name}),
        cache : "no-store"
    }) 
    const result = await res.json()
    const status = res.status
    return {result,status}

}
