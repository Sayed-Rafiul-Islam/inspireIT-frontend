"use server"

export const logIn = async (email : string, password : string) => {
        const res = await fetch(`http://localhost:5000/api/login`, {
                method : "POST",
                headers : {
                    "Content-type" : "application/json"
                },
                body : JSON.stringify({email,password}),
                cache : "no-store"
            }) 
        const result = await res.json()
        const status = res.status
        return {result,status}
}

