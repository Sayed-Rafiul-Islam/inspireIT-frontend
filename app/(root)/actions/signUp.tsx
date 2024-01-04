"use server"

export const signUp = async (email: string, password: string, name: string) => {
    const res = await fetch(`http://localhost:5000/createUser`, {
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
